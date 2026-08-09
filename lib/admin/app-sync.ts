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
const TENANT_ACTIVITY_PATH = "/api/internal/tenant-activity";
const TENANT_INVITATION_PATH = "/api/internal/tenant-invitation";
const TENANT_USERS_PATH = "/api/internal/tenant-users";

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
async function call(
  path: string,
  options: { method: "GET" | "POST"; body?: JsonObject; idempotencyKey?: string },
): Promise<CallResult> {
  const token = secret();
  if (!token) return { ok: false, error: APP_SYNC_ISSUE_TEXT["no-secret"] };

  try {
    const response = await fetch(`${APP_URL}${path}`, {
      method: options.method,
      headers: {
        ...(options.body ? { "content-type": "application/json" } : {}),
        // Das Geheimnis geht nur an die konfigurierte App, nie an den Client.
        authorization: `Bearer ${token}`,
        ...(options.idempotencyKey ? { "idempotency-key": options.idempotencyKey } : {}),
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
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

async function post(path: string, body: JsonObject, idempotencyKey?: string): Promise<CallResult> {
  return call(path, { method: "POST", body, idempotencyKey });
}

async function get(path: string): Promise<CallResult> {
  return call(path, { method: "GET" });
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
  /**
   * Laufzeitende eines Demomandanten als ISO-Zeitpunkt, sonst null.
   *
   * Immer mitgeschickt, auch als null: Die App setzt das Feld absolut. Nur so
   * fällt die Befristung weg, wenn aus der Demo ein zahlender Kunde wird.
   */
  demoLaeuftAbAm: string | null;
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
  demoLaeuftAbAm: string | null;
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
    demoLaeuftAbAm: input.demoLaeuftAbAm,
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
  const modules = company.status === "suspended" ? [] : gebucht.filter((id) => known.has(id));

  return tenantRegistration({
    company,
    paket,
    benutzer: grundkauf?.users ?? company.seats,
    module: modules,
    // Ein Grundkauf hebt die Befristung auf – und zwar hier, nicht durch einen
    // zusätzlichen Handgriff im Adminbereich. Aus einer Demo wird ein Kunde,
    // indem er kauft; bliebe das Datum stehen, sperrte die App den bezahlten
    // Zugang am Tag des früheren Demoendes aus.
    demoLaeuftAbAm: grundkauf ? null : (company.demoExpiresAt ?? null),
  });
}

export type TenantSyncResult =
  | {
      ok: true;
      tenantId?: string;
      einladungsLink?: string;
      /**
       * Was die App als Laufzeitende gespeichert hat.
       *
       * `undefined` heißt: Die App hat das Feld gar nicht gemeldet – dort läuft
       * eine Version, die Demomandanten noch nicht befristen kann.
       */
      demoLaeuftAbAm?: string | null;
    }
  | { ok: false; error: string };

/**
 * Prüft die Quittung der App zum Laufzeitende eines Demomandanten.
 *
 * Der Grund für diese Prüfung ist eine Reihenfolge, an die beim Deployen
 * niemand denkt: Eine ältere App kennt `demoLaeuftAbAm` nicht, wirft das Feld
 * beim Parsen still weg und legt den Mandanten UNBEFRISTET an. Die Meldung
 * käme als Erfolg zurück, der Interessent bekäme seine Einladung, und der
 * Zugang liefe für immer – ohne dass irgendwo ein Fehler stünde.
 *
 * Deshalb gilt die Meldung nur als gelungen, wenn die App denselben Zeitpunkt
 * zurückgibt. Für Mandanten ohne Befristung wird nichts geprüft: Sie sollen
 * auch gegen eine ältere App weiterhin funktionieren.
 *
 * @returns Fehlertext für das Protokoll, oder null wenn alles stimmt
 */
export function demoConfirmationIssue(
  erwartet: string | null | undefined,
  bestaetigt: string | null | undefined,
): string | null {
  if (!erwartet) return null;

  if (!bestaetigt) {
    return `Die App hat kein Ablaufdatum für den Demozugang bestätigt. Dort läuft vermutlich noch eine Version ohne Befristung von Demomandanten – bitte zuerst die App aktualisieren, sonst liefe der Zugang unbefristet weiter.`;
  }

  const erwarteteZeit = new Date(erwartet).getTime();
  const bestaetigteZeit = new Date(bestaetigt).getTime();
  if (!Number.isFinite(bestaetigteZeit) || erwarteteZeit !== bestaetigteZeit) {
    return `Die App hat ein abweichendes Ablaufdatum gespeichert (${bestaetigt} statt ${erwartet}). Der Demozugang gilt erst als freigeschaltet, wenn beide Seiten dasselbe Ende kennen.`;
  }

  return null;
}

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
    // Fehlt das Feld, bleibt es undefined – der Unterschied zu einem
    // ausdrücklichen null ist genau die Information, die die Prüfung braucht.
    demoLaeuftAbAm:
      "demoLaeuftAbAm" in result.payload ? (text(result.payload.demoLaeuftAbAm) ?? null) : undefined,
  };
}

/* ------------------------------------------------------ Zugang & Aktivitäten */

export type TenantInvitationStatus = "pending" | "accepted" | "expired" | "missing";

export type TenantLoginActivity = {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  role: string;
  description: string;
  historical: boolean;
};

export type TenantActivity = {
  hasLoggedIn: boolean;
  lastLoginAt: string | null;
  lastLoginUser: { name: string; email: string; role: string } | null;
  invitation: {
    status: TenantInvitationStatus;
    expiresAt: string | null;
    acceptedAt: string | null;
  };
  activities: TenantLoginActivity[];
};

export type TenantActivityResult =
  | { ok: true; activity: TenantActivity }
  | { ok: false; error: string };

function optionalText(value: unknown): string | null {
  return text(value) ?? null;
}

function dateText(value: unknown): string | null {
  const candidate = optionalText(value);
  return candidate && Number.isFinite(new Date(candidate).getTime()) ? candidate : null;
}

function invitationStatus(value: unknown): TenantInvitationStatus {
  return value === "pending" || value === "accepted" || value === "expired" || value === "missing"
    ? value
    : "missing";
}

export type TenantUser = {
  email: string;
  name: string;
  rolle: string;
  aktiv: boolean;
  letzterLogin: string | null;
  angelegtAm: string | null;
};

export type TenantInvite = {
  email: string;
  name: string;
  rolle: string;
  laeuftAbAm: string | null;
  eingeladenAm: string | null;
};

export type TenantUsersResult =
  | { ok: true; benutzer: TenantUser[]; einladungen: TenantInvite[] }
  | { ok: false; error: string };

function objects(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === "object",
  );
}

/**
 * Liest die echten Benutzer eines Mandanten samt offener Einladungen.
 *
 * Führend ist die App: Benutzer entstehen dort, egal ob der Mandant sie selbst
 * einlädt oder der Superadmin es über das Admin-Center tut. Das Protokoll in
 * der Control-Plane kennt nur den zweiten Weg – wer sich darauf verlässt, sieht
 * die halbe Belegschaft nicht.
 */
export async function getTenantUsers(kennung: string): Promise<TenantUsersResult> {
  const result = await get(
    `${TENANT_USERS_PATH}?kennung=${encodeURIComponent(kennung.trim().toLowerCase())}`,
  );
  if (!result.ok) return result;

  return {
    ok: true,
    // Fehlende Felder werden zu "" statt undefined: die Liste zeigt sie roh an,
    // und ein „undefined" in der Oberfläche wäre schlechter als eine Lücke.
    benutzer: objects(result.payload.benutzer).map((eintrag) => ({
      email: text(eintrag.email) ?? "",
      name: text(eintrag.name) ?? "",
      rolle: text(eintrag.rolle) ?? "",
      aktiv: eintrag.aktiv !== false,
      letzterLogin: dateText(eintrag.letzterLogin),
      angelegtAm: dateText(eintrag.angelegtAm),
    })),
    einladungen: objects(result.payload.einladungen).map((eintrag) => ({
      email: text(eintrag.email) ?? "",
      name: text(eintrag.name) ?? "",
      rolle: text(eintrag.rolle) ?? "",
      laeuftAbAm: dateText(eintrag.laeuftAbAm),
      eingeladenAm: dateText(eintrag.eingeladenAm),
    })),
  };
}

/** Liest Loginstatus und die letzten Anmeldungen eines Mandanten aus der App. */
export async function getTenantActivity(kennung: string): Promise<TenantActivityResult> {
  const result = await get(
    `${TENANT_ACTIVITY_PATH}?kennung=${encodeURIComponent(kennung.trim().toLowerCase())}`,
  );
  if (!result.ok) return result;

  const lastLoginUser = result.payload.lastLoginUser;
  const invitation = result.payload.invitation;
  const activities = Array.isArray(result.payload.activities) ? result.payload.activities : [];

  return {
    ok: true,
    activity: {
      hasLoggedIn: result.payload.hasLoggedIn === true,
      lastLoginAt: dateText(result.payload.lastLoginAt),
      lastLoginUser:
        lastLoginUser && typeof lastLoginUser === "object" && !Array.isArray(lastLoginUser)
          ? {
              name: optionalText((lastLoginUser as JsonObject).name) ?? "",
              email: optionalText((lastLoginUser as JsonObject).email) ?? "",
              role: optionalText((lastLoginUser as JsonObject).role) ?? "",
            }
          : null,
      invitation:
        invitation && typeof invitation === "object" && !Array.isArray(invitation)
          ? {
              status: invitationStatus((invitation as JsonObject).status),
              expiresAt: dateText((invitation as JsonObject).expiresAt),
              acceptedAt: dateText((invitation as JsonObject).acceptedAt),
            }
          : { status: "missing", expiresAt: null, acceptedAt: null },
      activities: activities.flatMap((entry) => {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
        const item = entry as JsonObject;
        const timestamp = dateText(item.timestamp);
        if (!timestamp) return [];
        return [
          {
            id: optionalText(item.id) ?? timestamp,
            timestamp,
            name: optionalText(item.name) ?? "",
            email: optionalText(item.email) ?? "",
            role: optionalText(item.role) ?? "",
            description: optionalText(item.description) ?? "Erfolgreiche Anmeldung",
            historical: item.historical === true,
          },
        ];
      }),
    },
  };
}

export type TenantInvitationResult =
  | { ok: true; email: string; einladungsLink: string; expiresAt: string | null }
  | { ok: false; error: string };

/** Fordert einen gültigen Erstzugangslink an, ohne Empfänger oder Token vorzugeben. */
export async function requestTenantInvitation(kennung: string): Promise<TenantInvitationResult> {
  const result = await post(TENANT_INVITATION_PATH, { kennung });
  if (!result.ok) return result;

  const email = text(result.payload.email);
  const einladungsLink = text(result.payload.einladungsLink);
  if (!email || !einladungsLink) {
    return { ok: false, error: "Die App hat keinen vollständigen Einladungslink geliefert." };
  }

  return {
    ok: true,
    email,
    einladungsLink,
    expiresAt: dateText(result.payload.expiresAt),
  };
}

export type TenantUserInviteResult =
  | { ok: true; email: string; einladungsLink: string; expiresAt: string | null; reused: boolean }
  | { ok: false; error: string };

/**
 * Legt einen weiteren Benutzer im Mandanten an und holt dessen Passwortlink.
 *
 * Anders als `requestTenantInvitation` gibt der Aufrufer hier Empfänger und
 * Rolle vor – den Nutzer gibt es in der App ja noch nicht. Das Token erzeugt
 * weiterhin ausschliesslich die App; die Control-Plane sieht nur den fertigen
 * Link und speichert ihn nicht.
 *
 * Der Idempotency-Key bindet den Aufruf an Mandant und Adresse: Ein zweiter
 * Klick auf „Einladen" darf keinen zweiten Benutzer erzeugen.
 */
export async function inviteTenantUser(input: {
  kennung: string;
  email: string;
  name: string;
  rolle: string;
}): Promise<TenantUserInviteResult> {
  const kennung = input.kennung.trim().toLowerCase();
  const email = input.email.trim().toLowerCase();

  const result = await post(
    TENANT_USERS_PATH,
    { kennung, email, name: input.name.trim(), rolle: input.rolle },
    `${kennung}:${email}`,
  );
  if (!result.ok) return result;

  const einladungsLink = text(result.payload.einladungsLink);
  if (!einladungsLink) {
    return { ok: false, error: "Die App hat keinen Einladungslink geliefert." };
  }

  return {
    ok: true,
    email: text(result.payload.email) ?? email,
    einladungsLink,
    expiresAt: dateText(result.payload.expiresAt),
    reused: result.payload.reused === true,
  };
}

/* --------------------------------------------------------------- Demo-Zugang */

/**
 * Für Demozugänge gibt es hier bewusst keinen eigenen Aufruf mehr.
 *
 * Eine Demo ist ein gewöhnlicher Mandant mit eigener Datenbank, eigenem Bucket
 * und einem Ablaufdatum in `demoLaeuftAbAm` – sie läuft deshalb über
 * `registerTenant` wie jeder Kunde. Die frühere Route `/api/internal/demo`
 * teilte allen Interessenten EINEN Demomandanten und ist entfallen.
 */
