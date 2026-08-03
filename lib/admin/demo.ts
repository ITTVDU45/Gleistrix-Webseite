/**
 * Schnittstelle zur Gleistrix-App für Demo-Zugänge.
 *
 * Der Control-Plane legt keine Demo-Benutzer selbst an – er ruft die
 * Demo-Schnittstelle der App auf. Authentifiziert wird mit demselben
 * SERVICE_SHARED_SECRET, das schon für Portal→Admin-Requests genutzt wird.
 *
 * ponytail: ein Endpunkt, zwei Aktionen. Erst wenn es mehrere Demo-Stufen oder
 * Kontingente gibt, lohnt sich hier mehr als grant/revoke.
 */

/** Wie in der Gleistrix-App: 32 Zeichen = 128 Bit. */
const MIN_SECRET_LENGTH = 32;

/** Wie lange ein Demo-Zugang standardmäßig gilt. */
export const DEFAULT_DEMO_DAYS = 14;
export const MAX_DEMO_DAYS = 90;

/** Zeitlimit, damit eine hängende Instanz die Server Action nicht blockiert. */
const REQUEST_TIMEOUT_MS = 10_000;

function endpoint(): string | null {
  const value = process.env.GLEISTRIX_DEMO_API_URL;
  return value && /^https?:\/\//.test(value) ? value : null;
}

function secret(): string | null {
  const value = process.env.SERVICE_SHARED_SECRET;
  return value && value.length >= MIN_SECRET_LENGTH ? value : null;
}

export type DemoConfigIssue = "no-endpoint" | "no-secret" | null;

/** Was für die Demo-Freigabe noch fehlt – für die Anzeige im Adminbereich. */
export function demoConfigIssue(): DemoConfigIssue {
  if (!endpoint()) return "no-endpoint";
  if (!secret()) return "no-secret";
  return null;
}

export const DEMO_ISSUE_TEXT: Record<"no-endpoint" | "no-secret", string> = {
  "no-endpoint":
    "GLEISTRIX_DEMO_API_URL fehlt – ohne Endpunkt kann die App keine Demo freischalten.",
  "no-secret": `SERVICE_SHARED_SECRET fehlt oder ist kürzer als ${MIN_SECRET_LENGTH} Zeichen. Es muss in beiden Deployments identisch sein.`,
};

export type DemoGrantResult =
  | { ok: true; url?: string; expiresAt: string }
  | { ok: false; error: string };

type ApiResponse = {
  url?: unknown;
  expiresAt?: unknown;
  error?: unknown;
};

async function call(body: Record<string, unknown>): Promise<ApiResponse | { fetchError: string }> {
  const url = endpoint();
  const token = secret();
  if (!url || !token) {
    return { fetchError: "Demo-Schnittstelle ist nicht konfiguriert." };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        // Das Secret geht nur an den konfigurierten Endpunkt, nie an den Client.
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const payload = (await response.json().catch(() => ({}))) as ApiResponse;
    if (!response.ok) {
      const message =
        typeof payload.error === "string"
          ? payload.error
          : `Die Gleistrix-App hat mit HTTP ${response.status} geantwortet.`;
      return { fetchError: message };
    }
    return payload;
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unbekannter Fehler";
    return { fetchError: `Die Gleistrix-App war nicht erreichbar: ${reason}` };
  }
}

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
  const result = await call({
    action: "grant",
    email: input.email,
    company: input.company,
    days,
  });

  if ("fetchError" in result) return { ok: false, error: result.fetchError };

  const fallback = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  return {
    ok: true,
    url: typeof result.url === "string" ? result.url : undefined,
    expiresAt: typeof result.expiresAt === "string" ? result.expiresAt : fallback,
  };
}

export type DemoRevokeResult = { ok: true } | { ok: false; error: string };

export async function revokeDemo(email: string): Promise<DemoRevokeResult> {
  const result = await call({ action: "revoke", email });
  if ("fetchError" in result) return { ok: false, error: result.fetchError };
  return { ok: true };
}
