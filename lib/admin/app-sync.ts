/**
 * Schnittstelle zur mandantenfähigen App unter app.gleistrix.de.
 *
 * Nimmt die frühere lib/admin/demo.ts auf: Website und App reden über genau
 * einen Host und ein gemeinsames Geheimnis, egal ob ein Mandant angelegt oder
 * eine Demo freigeschaltet wird.
 *
 * WAS HIER NICHT ÜBERTRAGEN WIRD: das Passwort des Mandantenbenutzers. Die App
 * verbindet sich mit einem Datenbankzugang aus ihrer eigenen Umgebung und
 * wählt die Kundendatenbank nur über deren Namen. Damit verlässt kein
 * Mandantengeheimnis die Website.
 */
import type { Company, Package, Purchase } from "@/types/admin";
import type { PricingConfig } from "@/types/pricing";

import { effectiveModuleIds } from "./modules";
import { APP_URL } from "./tenant";

/** Wie in der Gleistrix-App: 32 Zeichen = 128 Bit. */
const MIN_SECRET_LENGTH = 32;

/** Wie lange ein Demo-Zugang standardmäßig gilt. */
export const DEFAULT_DEMO_DAYS = 14;
export const MAX_DEMO_DAYS = 90;

/** Zeitlimit, damit eine hängende App die Server Action nicht blockiert. */
const REQUEST_TIMEOUT_MS = 10_000;

const TENANTS_PATH = "/api/internal/tenants";
const DEMO_PATH = "/api/internal/demo";

function secret(): string | null {
  const value = process.env.SERVICE_SHARED_SECRET;
  return value && value.length >= MIN_SECRET_LENGTH ? value : null;
}

export type AppSyncIssue = "no-secret" | null;

/** Was für den Abgleich mit der App noch fehlt – für die Anzeige im Adminbereich. */
export function appSyncIssue(): AppSyncIssue {
  return secret() ? null : "no-secret";
}

export const APP_SYNC_ISSUE_TEXT: Record<"no-secret", string> = {
  "no-secret": `SERVICE_SHARED_SECRET fehlt oder ist kürzer als ${MIN_SECRET_LENGTH} Zeichen. Es muss in Website und App identisch sein.`,
};

/* ---------------------------------------------------------------- Transport */

type JsonObject = Record<string, unknown>;
type CallResult = { ok: true; status: number; payload: JsonObject } | { ok: false; error: string };

/**
 * Ein POST an die App, einheitlich für alle Aufrufe.
 *
 * `idempotencyKey` bindet den Aufruf an denselben Vorgang: ein zweiter Aufruf
 * mit demselben Schlüssel darf keinen zweiten Mandanten anlegen, sondern muss
 * denselben Rumpf liefern. Genau das macht die Wiederholung im Admin gefahrlos.
 */
async function post(path: string, body: JsonObject, idempotencyKey?: string): Promise<CallResult> {
  const token = secret();
  if (!token) return { ok: false, error: APP_SYNC_ISSUE_TEXT["no-secret"] };

  try {
    const response = await fetch(`${APP_URL}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        // Das Geheimnis geht nur an die konfigurierte App, nie an den Client.
        authorization: `Bearer ${token}`,
        ...(idempotencyKey ? { "idempotency-key": idempotencyKey } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const payload = (await response.json().catch(() => ({}))) as JsonObject;
    if (!response.ok) {
      const message =
        typeof payload.error === "string"
          ? payload.error
          : `Die Gleistrix-App hat mit HTTP ${response.status} geantwortet.`;
      return { ok: false, error: message };
    }
    return { ok: true, status: response.status, payload };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unbekannter Fehler";
    return { ok: false, error: `Die Gleistrix-App war nicht erreichbar: ${reason}` };
  }
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/* ----------------------------------------------------------------- Mandanten */

/** Was die App braucht, um einen Mandanten anzulegen – ohne Zugangsdaten. */
export type TenantRegistration = {
  /** Kennung des Mandanten = Datenbankname ohne Präfix. */
  kennung: string;
  unternehmen: string;
  datenbank: string;
  bucket: string;
  erstbenutzer: { email: string; name: string };
  paket: { id: string; name: string; benutzer: number };
  module: string[];
  /** Nur bei Demozugängen gesetzt, sonst null. */
  gueltigBis: string | null;
};

/**
 * Baut den Rumpf aus dem Mandanten zusammen.
 *
 * Paket, Benutzerzahl und Module kommen vom Aufrufer und nicht aus dem
 * Unternehmen: Bei einem Kauf gilt der eingefrorene Stand aus `purchases`, nicht
 * der heutige Stand der Preisliste.
 */
function tenantRegistration(input: {
  company: Company;
  paket: { id: string; name: string };
  benutzer: number;
  module: string[];
  gueltigBis?: string | null;
}): TenantRegistration {
  const { company } = input;
  return {
    kennung: company.slug,
    unternehmen: company.name,
    datenbank: company.tenant.mongoDatabase,
    bucket: company.tenant.minioBucket,
    erstbenutzer: { email: company.contactEmail, name: company.contactName },
    paket: { ...input.paket, benutzer: input.benutzer },
    module: input.module,
    gueltigBis: input.gueltigBis ?? null,
  };
}

/**
 * Entscheidet, was der App gemeldet wird – die ganze Regel an einer Stelle und
 * ohne Datenbank, damit sie prüfbar ist.
 *
 * Der Kauf hat Vorrang: sein eingefrorener Stand gilt, nicht die heutige
 * Preisliste. Ohne Kauf zählt der Mandant selbst, und zwar mit genau dem
 * Umfang, den der Adminbereich für ihn anzeigt.
 *
 * ACHTUNG BEI DEN PAKETEN: Es gibt zwei Kataloge mit eigenem Kennungsraum.
 * `purchase.packageId` verweist auf die Preisliste (pricing_packages),
 * `company.packageId` auf die Mandantenpakete (tenant_packages). Wer im
 * falschen sucht, findet strukturell nie etwas und meldet der App die
 * technische Kennung als Paketnamen – genau das war der Fehler.
 */
export function registrationFor(input: {
  company: Company;
  purchase: Purchase | null;
  pricing: PricingConfig;
  /** Von Hand zugewiesenes Mandantenpaket – nur ohne Kauf maßgeblich. */
  tenantPackage: Package | null;
  gueltigBis?: string | null;
}): TenantRegistration {
  const { company, purchase, pricing, tenantPackage } = input;

  const paket = purchase
    ? {
        id: purchase.packageId,
        name:
          pricing.packages.find((pkg) => pkg.id === purchase.packageId)?.name ??
          purchase.packageId,
      }
    : { id: tenantPackage?.id ?? "", name: tenantPackage?.name ?? "" };

  const known = new Set(pricing.modules.map((module) => module.id));

  return tenantRegistration({
    company,
    paket,
    benutzer: purchase?.users ?? company.seats,
    module: purchase
      ? // Unbekannte Kennungen fliegen raus: die App würde sie ohnehin ablehnen,
        // und im Protokoll stünde dann ein Fehler statt der Ursache. Der Kauf
        // selbst behält sie – die Kaufseite zeigt sie als „Unbekanntes Modul".
        purchase.moduleIds.filter((id) => known.has(id))
      : effectiveModuleIds(pricing, company, tenantPackage),
    gueltigBis: input.gueltigBis,
  });
}

export type TenantSyncResult =
  | { ok: true; tenantId?: string; einladungsLink?: string }
  | { ok: false; error: string };

/**
 * Meldet einen Mandanten an die App.
 *
 * `idempotencyKey` ist die Kauf-ID: Scheitert der Aufruf und der Admin
 * wiederholt ihn, entsteht kein zweiter Mandant.
 */
export async function registerTenant(
  registration: TenantRegistration,
  idempotencyKey: string,
): Promise<TenantSyncResult> {
  const result = await post(TENANTS_PATH, { ...registration }, idempotencyKey);
  if (!result.ok) return result;

  return {
    ok: true,
    tenantId: text(result.payload.tenantId),
    einladungsLink: text(result.payload.einladungsLink),
  };
}

/* --------------------------------------------------------------- Demo-Zugang */

export type DemoGrantResult =
  | { ok: true; url?: string; expiresAt: string }
  | { ok: false; error: string };

/**
 * Schaltet eine Demoversion für eine E-Mail-Adresse frei.
 * `expiresAt` kommt bevorzugt von der App; ohne Angabe rechnen wir selbst,
 * damit im Protokoll nie ein leeres Ablaufdatum steht.
 */
export async function grantDemo(input: {
  email: string;
  company: string;
  days: number;
}): Promise<DemoGrantResult> {
  const days = Math.min(Math.max(Math.trunc(input.days), 1), MAX_DEMO_DAYS);
  const result = await post(DEMO_PATH, {
    action: "grant",
    email: input.email,
    company: input.company,
    days,
  });

  if (!result.ok) return result;

  const fallback = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  return {
    ok: true,
    url: text(result.payload.url),
    expiresAt: text(result.payload.expiresAt) ?? fallback,
  };
}

export type DemoRevokeResult = { ok: true } | { ok: false; error: string };

export async function revokeDemo(email: string): Promise<DemoRevokeResult> {
  const result = await post(DEMO_PATH, { action: "revoke", email });
  return result.ok ? { ok: true } : result;
}
