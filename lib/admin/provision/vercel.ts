import type { Tenant } from "@/types/admin";

/**
 * Vercel-Schnittstelle für die Mandanten-Provisionierung.
 *
 * Legt je Mandant ein eigenes Vercel-Projekt an, setzt dessen
 * Umgebungsvariablen und hängt die Subdomain an. gleistrix.de liegt bei Vercel
 * (ns1/ns2.vercel-dns.com), deshalb setzt Vercel den DNS-Eintrag selbst – ein
 * eigener DNS-Anbieter wird hier nicht gebraucht.
 *
 * Nur serverseitig verwenden: das Token darf nie in ein Client-Bundle geraten.
 *
 * ponytail: reines fetch gegen die REST-API, kein SDK. Drei Endpunkte
 * rechtfertigen keine zusätzliche Abhängigkeit.
 */

const API_BASE = "https://api.vercel.com";

/** Konto ittvdu45 (Slug ittvdu45s-projects). Über VERCEL_TEAM_ID überschreibbar. */
const DEFAULT_TEAM_ID = "team_Y5lYUntxkrXoqYjTfhG0ztRB";

/** Zeitlimit je Aufruf, damit eine Server Action nicht hängen bleibt. */
const REQUEST_TIMEOUT_MS = 15_000;

/** Alle Mandantenprojekte tragen dasselbe Präfix – so sind sie im Konto sortiert. */
const PROJECT_PREFIX = "gleistrix-";

/** Vercel akzeptiert nur Env-Namen in dieser Form. */
const ENV_KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;

function token(): string | null {
  return process.env.VERCEL_API_TOKEN?.trim() || null;
}

function teamId(): string {
  return process.env.VERCEL_TEAM_ID?.trim() || DEFAULT_TEAM_ID;
}

export type VercelConfigIssue = "no-token" | null;

/** Was für die Vercel-Provisionierung noch fehlt – für die Anzeige im Adminbereich. */
export function vercelIssue(): VercelConfigIssue {
  return token() ? null : "no-token";
}

export const VERCEL_ISSUE_TEXT: Record<"no-token", string> = {
  "no-token":
    "VERCEL_API_TOKEN fehlt – ohne Token kann kein Projekt angelegt und keine Subdomain angehängt werden.",
};

export type VercelResult =
  | { ok: true; note: string; url?: string }
  | { ok: false; error: string };

/** "kunde.gleistrix.de" -> "gleistrix-kunde". Der Projektname ist zugleich der idOrName der API. */
export function projectName(tenant: Tenant): string {
  return `${PROJECT_PREFIX}${tenant.subdomain.split(".")[0]}`;
}

type Payload = Record<string, unknown>;
type CallResult = { status: number; payload: Payload } | { failed: string };

function endpoint(path: string, query: Record<string, string> = {}): string {
  const params = new URLSearchParams({ teamId: teamId(), ...query });
  return `${API_BASE}${path}?${params.toString()}`;
}

async function call(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  query?: Record<string, string>,
): Promise<CallResult> {
  const bearer = token();
  if (!bearer) return { failed: VERCEL_ISSUE_TEXT["no-token"] };

  try {
    const response = await fetch(endpoint(path, query), {
      method,
      headers: {
        // Das Token geht ausschließlich an api.vercel.com, nie in eine Antwort.
        authorization: `Bearer ${bearer}`,
        ...(body === undefined ? {} : { "content-type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const payload = (await response.json().catch(() => ({}))) as Payload;
    return { status: response.status, payload };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unbekannter Fehler";
    return { failed: `Vercel war nicht erreichbar: ${reason}` };
  }
}

function errorCode(payload: Payload): string | null {
  const error = payload.error as { code?: unknown } | undefined;
  return typeof error?.code === "string" ? error.code : null;
}

/**
 * Vercel quittiert die Anlage einer Umgebungsvariablen auch dann mit HTTP 200,
 * wenn sie fehlgeschlagen ist – der Fehlschlag steht nur im Feld `failed`. Ohne
 * diese Prüfung gälte eine nicht gesetzte Variable als gesetzt.
 *
 * Nur der Fehlercode wandert in die Meldung, nie der Eintrag selbst: in dessen
 * Wert steht die MONGODB_URI des Mandanten samt Passwort.
 */
function rejectedReason(payload: Payload): string | null {
  const failed = payload.failed;
  if (!Array.isArray(failed) || failed.length === 0) return null;

  const code = (failed[0] as { error?: { code?: unknown } } | null)?.error?.code;
  return typeof code === "string" ? code : "ohne Angabe eines Grundes";
}

function errorText(status: number, payload: Payload): string {
  const error = payload.error as { message?: unknown } | undefined;
  return typeof error?.message === "string"
    ? error.message
    : `Vercel hat mit HTTP ${status} geantwortet.`;
}

/**
 * Legt das Projekt des Mandanten an und setzt seine Umgebungsvariablen für
 * Production.
 *
 * Idempotent: ein bereits vorhandenes Projekt gilt als Erfolg, die Variablen
 * werden per upsert überschrieben. Ein Deployment wird NICHT ausgelöst – dafür
 * braucht das Projekt zuerst eine Git-Verknüpfung oder einen Upload.
 */
export async function createTenantProject(
  tenant: Tenant,
  env: Record<string, string>,
): Promise<VercelResult> {
  const name = projectName(tenant);

  const invalidKeys = Object.keys(env).filter((key) => !ENV_KEY_PATTERN.test(key));
  if (invalidKeys.length > 0) {
    return {
      ok: false,
      error: `Ungültige Namen für Umgebungsvariablen: ${invalidKeys.join(", ")}. Erlaubt sind Buchstaben, Ziffern und Unterstriche, nicht mit einer Ziffer beginnend.`,
    };
  }

  const created = await call("POST", "/v11/projects", { name, framework: "nextjs" });
  if ("failed" in created) return { ok: false, error: created.failed };

  const alreadyExists =
    created.status === 409 || errorCode(created.payload) === "project_name_already_exists";

  if (created.status >= 400 && !alreadyExists) {
    return {
      ok: false,
      error: `Projekt ${name} konnte nicht angelegt werden: ${errorText(created.status, created.payload)}`,
    };
  }

  for (const [key, value] of Object.entries(env)) {
    const result = await call(
      "POST",
      `/v10/projects/${encodeURIComponent(name)}/env`,
      { key, value, type: "encrypted", target: ["production"] },
      { upsert: "true" },
    );
    if ("failed" in result) return { ok: false, error: result.failed };
    if (result.status >= 400) {
      return {
        ok: false,
        error: `Umgebungsvariable ${key} konnte nicht gesetzt werden: ${errorText(result.status, result.payload)}`,
      };
    }

    const rejected = rejectedReason(result.payload);
    if (rejected) {
      return {
        ok: false,
        error: `Umgebungsvariable ${key} wurde von Vercel abgelehnt (${rejected}).`,
      };
    }
  }

  const count = Object.keys(env).length;
  const projectNote = alreadyExists
    ? `Projekt ${name} war bereits vorhanden`
    : `Projekt ${name} angelegt (Framework nextjs)`;

  return {
    ok: true,
    note: `${projectNote}, ${count} Umgebungsvariable(n) für Production gesetzt. Es läuft noch kein Deployment: das Projekt braucht zuerst eine Git-Verknüpfung oder einen Upload, erst danach ist die Instanz erreichbar.`,
  };
}

/**
 * Hängt die Subdomain des Mandanten an sein Projekt. Da gleistrix.de bei Vercel
 * liegt, legt Vercel den DNS-Eintrag selbst an und meldet verified: true.
 */
export async function attachTenantDomain(tenant: Tenant): Promise<VercelResult> {
  const name = projectName(tenant);
  const instanceUrl = `https://${tenant.subdomain}`;

  const result = await call("POST", `/v10/projects/${encodeURIComponent(name)}/domains`, {
    name: tenant.subdomain,
  });
  if ("failed" in result) return { ok: false, error: result.failed };

  if (result.status >= 400) {
    const inUse = result.status === 409 || errorCode(result.payload) === "domain_already_in_use";
    if (!inUse) {
      return {
        ok: false,
        error: `${tenant.subdomain} konnte nicht angehängt werden: ${errorText(result.status, result.payload)}`,
      };
    }

    // Belegt – aber von wem? Nur wenn dasselbe Projekt sie hält, ist der Schritt erledigt.
    // ponytail: eine Nachfrage nur im Konfliktfall; ein Vorab-GET bei jedem Lauf wäre teurer.
    const owned = await call(
      "GET",
      `/v9/projects/${encodeURIComponent(name)}/domains/${encodeURIComponent(tenant.subdomain)}`,
    );
    if (!("failed" in owned) && owned.status < 400) {
      return {
        ok: true,
        note: `${tenant.subdomain} ist bereits an ${name} angehängt.`,
        url: instanceUrl,
      };
    }
    // Nicht zwingend ein anderes Projekt: 409 kommt auch, wenn die Domain im
    // Konto liegt und noch nicht bestätigt ist. Deshalb Vercels Wortlaut mitgeben.
    return {
      ok: false,
      error: `${tenant.subdomain} ist bei Vercel belegt, aber nicht von ${name}: ${errorText(result.status, result.payload)}`,
    };
  }

  const verified = result.payload.verified === true;
  return {
    ok: true,
    url: instanceUrl,
    note: verified
      ? `${tenant.subdomain} an ${name} angehängt, Vercel hat den DNS-Eintrag gesetzt und die Domain bestätigt. Erreichbar wird sie mit dem ersten Deployment.`
      : `${tenant.subdomain} an ${name} angehängt, Vercel meldet aber verified: false. Bei einer Zone in der Vercel-Nameserververwaltung sollte das nicht passieren – Nameserver von ${tenant.subdomain.split(".").slice(1).join(".")} prüfen.`,
  };
}
