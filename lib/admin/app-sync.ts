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
  /**
   * Kennung des Mandanten, z. B. „muster-bau".
   *
   * NICHT der Datenbankname ohne Präfix: dort stehen Unterstriche statt
   * Bindestriche (gleistrix_muster_bau). Die App übernimmt `datenbank`
   * unverändert und leitet sie nicht aus der Kennung ab.
   */
  kennung: string;
  unternehmen: string;
  datenbank: string;
  bucket: string;
  erstbenutzer: { email: string; name: string };
  paket: { id: string; name: string; benutzer: number };
  module: string[];
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
  /**
   * Alle Käufe des Mandanten, neueste zuerst.
   *
   * Käufe sind additiv: Der Grundkauf trägt Paket und Benutzerzahl, jede
   * Zubuchung legt Module „on top". Nur den neuesten zu melden entzöge dem
   * Mandanten alles, was er vorher gebucht hat.
   */
  purchases: Purchase[];
  pricing: PricingConfig;
  /** Von Hand zugewiesenes Mandantenpaket – nur ohne Grundkauf maßgeblich. */
  tenantPackage: Package | null;
}): TenantRegistration {
  const { company, purchases, pricing, tenantPackage } = input;

  // Paket und Benutzerzahl stehen im Grundkauf; eine Zubuchung sagt dazu nichts.
  const grundkauf = purchases.find((purchase) => purchase.kind === "paket") ?? null;

  const paket = grundkauf
    ? {
        id: grundkauf.packageId,
        name:
          pricing.packages.find((pkg) => pkg.id === grundkauf.packageId)?.name ??
          grundkauf.packageId,
      }
    : { id: tenantPackage?.id ?? "", name: tenantPackage?.name ?? "" };

  const known = new Set(pricing.modules.map((module) => module.id));

  // Grundumfang plus jede Zubuchung. Ohne Grundkauf zählt der Stand, den der
  // Adminbereich anzeigt – Zubuchungen kommen auch dann obendrauf.
  const gebucht = [
    ...new Set([
      ...(grundkauf ? grundkauf.moduleIds : effectiveModuleIds(pricing, company, tenantPackage)),
      ...purchases
        .filter((purchase) => purchase.kind === "zubuchung")
        .flatMap((purchase) => purchase.moduleIds),
    ]),
  ];

  // Eine Sperre steht ÜBER dem Kauf. Der Adminbereich sagt zu, dass sie sofort
  // alle Module deaktiviert – läge die Regel nur in effectiveModuleIds, hielte
  // der Kauf-Zweig diese Zusage nicht, und ein gesperrter Mandant bekäme seinen
  // vollen Umfang gemeldet. Der Kauf selbst bleibt unberührt: Er ist
  // eingefroren, die Sperre ist ein Zugangsstopp.
  // Unbekannte Kennungen fliegen raus: die App würde sie ohnehin ablehnen, und
  // im Protokoll stünde dann ein Fehler statt der Ursache. Der Kauf behält sie –
  // die Kaufseite zeigt sie als „Unbekanntes Modul".
  const module = company.status === "suspended" ? [] : gebucht.filter((id) => known.has(id));

  return tenantRegistration({
    company,
    paket,
    benutzer: grundkauf?.users ?? company.seats,
    module,
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
