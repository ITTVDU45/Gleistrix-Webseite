import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Globaler Gleistrix-Support-Zugang über alle Mandanten.
 *
 * Alle Mandanten arbeiten in derselben App; getrennt sind ihre Daten auf
 * Datenbankebene. Damit ein Support-Konto hineinkommt, ohne dass wir Kunden-
 * passwörter speichern, erzeugt der Adminbereich ein kurzlebiges, signiertes
 * Token. Die App prüft es mit demselben SERVICE_SHARED_SECRET, das dort
 * bereits für Portal→Admin-Requests genutzt wird.
 *
 * WELCHER Mandant gemeint ist, sagt allein die Audience des Tokens – die URL
 * ist für alle dieselbe und trägt die Information nicht mehr.
 *
 * Das Support-Konto ist bewusst NICHT das Control-Plane-Konto: eine Session
 * unter /admin allein öffnet keine Kundendaten, es braucht zusätzlich das
 * Gleistrix-Support-Passwort.
 */

/** Token-Laufzeit. Kurz genug, dass ein geleakter Link nicht nachnutzbar ist. */
const TOKEN_TTL_SECONDS = 120;

/** Wie in der Gleistrix-App: 32 Zeichen = 128 Bit. */
const MIN_SECRET_LENGTH = 32;

export const SUPPORT_LOGIN_PATH = "/api/internal/support-login";

function secret(): string | null {
  const value = process.env.SERVICE_SHARED_SECRET;
  return value && value.length >= MIN_SECRET_LENGTH ? value : null;
}

function credentials(): { email: string; password: string } | null {
  const email = process.env.GLEISTRIX_SUPPORT_EMAIL;
  const password = process.env.GLEISTRIX_SUPPORT_PASSWORD;
  return email && password ? { email, password } : null;
}

/** Konstante Laufzeit über den Vergleich – die Länge selbst gilt als unkritisch. */
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export type SupportConfigIssue = "no-account" | "no-secret" | null;

/** Was für den Support-Zugang noch fehlt – für die Anzeige im Adminbereich. */
export function supportConfigIssue(): SupportConfigIssue {
  if (!credentials()) return "no-account";
  if (!secret()) return "no-secret";
  return null;
}

export function supportAccountEmail(): string | null {
  return credentials()?.email ?? null;
}

function sign(payload: string): string {
  return createHmac("sha256", secret() ?? "").update(payload).digest("hex");
}

export type SupportLinkResult =
  | { ok: true; url: string; actor: string; expiresAt: string }
  | { ok: false; error: string };

/**
 * Baut einen kurzlebigen Support-Link auf einen Mandanten.
 * Das Passwort wird hier geprüft (Step-up) und nicht in das Token übernommen.
 *
 * `kennung` ist die Audience des Tokens, `baseUrl` das Ziel des Links – beide
 * kommen vom Aufrufer, damit dieses Modul nichts über das Namensschema der
 * Mandanten wissen muss (das liegt allein in `tenant.ts`).
 */
export function createSupportLink(
  kennung: string,
  baseUrl: string,
  password: string,
  reason: string,
): SupportLinkResult {
  const account = credentials();
  if (!account) {
    return {
      ok: false,
      error:
        "Support-Konto ist nicht konfiguriert (GLEISTRIX_SUPPORT_EMAIL / GLEISTRIX_SUPPORT_PASSWORD).",
    };
  }
  if (!secret()) {
    return {
      ok: false,
      error: `SERVICE_SHARED_SECRET fehlt oder ist kürzer als ${MIN_SECRET_LENGTH} Zeichen.`,
    };
  }
  if (reason.trim().length < 3) {
    return { ok: false, error: "Bitte einen Grund für den Zugriff angeben." };
  }
  if (!safeEqual(password, account.password)) {
    return { ok: false, error: "Support-Passwort ist falsch." };
  }

  const expires = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;

  // JSON statt "email.audience.exp": E-Mail und Domain enthalten selbst Punkte,
  // ein Trennzeichen-Format zerlegt sie falsch.
  //
  // `aud` ist die Kennung des Mandanten und gehört mit in die Signatur: ein
  // Token für Mandant A darf sich nicht gegen Mandant B einlösen lassen. Seit
  // alle dieselbe App teilen, ist das die EINZIGE Grenze zwischen beiden – die
  // App muss `aud` gegen den aufgelösten Mandanten prüfen, nicht gegen ihren
  // Host. Siehe support.check.ts, dort ist das Format gepinnt.
  const payload = JSON.stringify({ sub: account.email, aud: kennung, exp: expires });
  // Signiert wird die kodierte Form: so prüft die Instanz exakt die Bytes, die
  // sie empfangen hat, ohne Roundtrip über JSON.
  const encoded = Buffer.from(payload, "utf8").toString("base64url");
  const token = `${encoded}.${sign(encoded)}`;

  const url = new URL(SUPPORT_LOGIN_PATH, baseUrl);
  url.searchParams.set("token", token);

  return {
    ok: true,
    url: url.toString(),
    actor: account.email,
    expiresAt: new Date(expires * 1000).toISOString(),
  };
}
