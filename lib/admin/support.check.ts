/**
 * Selbsttest für den Support-Login.
 *
 * Ausführen: `node lib/admin/support.check.ts`
 *
 * Warum es diesen Check gibt: Signatur und Prüfung liegen in ZWEI Repos –
 * `createSupportRequest` hier und `verifyToken` in
 * Gleistrix/apps/admin/app/api/internal/support-login/route.ts. Driftet eines
 * der beiden ab, kommt niemand mehr in eine Kundeninstanz (oder, schlimmer,
 * jemand kommt rein, der nicht sollte). Der Check pinnt das Tokenformat und
 * spiegelt die Prüflogik der Route.
 */
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

const SECRET = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
const PASSWORD = "test-support-passwort";

process.env.SERVICE_SHARED_SECRET = SECRET;
process.env.GLEISTRIX_SUPPORT_EMAIL = "support@example.test";
process.env.GLEISTRIX_SUPPORT_PASSWORD = PASSWORD;

const { createSupportRequest } = await import("./support.ts");

/**
 * Seit dem Umbau auf die mandantenfähige App ist die Audience die Kennung des
 * Mandanten und nicht mehr sein Host – die URL ist für alle dieselbe, nur die
 * Kennung sagt der App, wessen Daten der Support sehen darf.
 */
const KENNUNG = "muster-bau";
const APP_URL = "https://app.gleistrix.de";

/** Exakt die Schritte aus verifyToken() der Gleistrix-Route. */
function verifyLikeInstance(token: string, kennung: string) {
  const separator = token.lastIndexOf(".");
  if (separator <= 0) return { ok: false as const, reason: "Token unvollständig" };

  const encodedPayload = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  const expected = createHmac("sha256", SECRET).update(encodedPayload).digest("hex");
  if (signature !== expected) return { ok: false as const, reason: "Signatur ungültig" };

  let claims: { sub?: unknown; aud?: unknown; exp?: unknown };
  try {
    claims = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  } catch {
    return { ok: false as const, reason: "Token nicht dekodierbar" };
  }

  const { sub, aud, exp } = claims;
  if (typeof sub !== "string" || typeof aud !== "string" || typeof exp !== "number") {
    return { ok: false as const, reason: "Token unvollständig" };
  }
  if (exp * 1000 < Date.now()) return { ok: false as const, reason: "Token abgelaufen" };
  if (aud.toLowerCase() !== kennung) {
    return { ok: false as const, reason: "Audience passt nicht zum Mandanten" };
  }
  return { ok: true as const, email: sub, audience: aud };
}

// 1. Gültige Anfrage wird von der Instanz akzeptiert.
const good = createSupportRequest(KENNUNG, APP_URL, PASSWORD, "Ticket #482");
assert.equal(good.ok, true, "Gültige Anfrage muss einen POST-Übergang liefern");
if (!good.ok) throw new Error("unreachable");

assert.equal(good.action, `${APP_URL}/api/internal/support-login`);
assert.equal(new URL(good.action).search, "", "Das Token darf nicht im Query-String stehen");

const accepted = verifyLikeInstance(good.token, KENNUNG);
assert.equal(accepted.ok, true, "Instanz muss das frische Token akzeptieren");
if (accepted.ok) {
  assert.equal(accepted.email, "support@example.test");
}

// 2. Token von Mandant A darf bei Mandant B nicht greifen. Seit alle dieselbe
// App teilen, ist das die einzige Grenze zwischen zwei Mandanten.
const wrongTenant = verifyLikeInstance(good.token, "nordgleis");
assert.equal(wrongTenant.ok, false, "Fremder Mandant muss abgelehnt werden");

// 3. Manipulierte Signatur fliegt raus.
const token = good.token;
const tampered = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;
assert.equal(
  verifyLikeInstance(tampered, KENNUNG).ok,
  false,
  "Manipulierte Signatur muss abgelehnt werden",
);

// 4. Falsches Support-Passwort erzeugt gar kein Token.
const badPassword = createSupportRequest(KENNUNG, APP_URL, "falsch", "Ticket #482");
assert.equal(badPassword.ok, false, "Falsches Passwort darf keinen Link erzeugen");

// 5. Ohne Begründung kein Zugriff – der Grund landet im Protokoll.
const noReason = createSupportRequest(KENNUNG, APP_URL, PASSWORD, "  ");
assert.equal(noReason.ok, false, "Fehlender Grund muss abgelehnt werden");

// 6. Ohne konfiguriertes Konto passiert nichts.
delete process.env.GLEISTRIX_SUPPORT_PASSWORD;
assert.equal(
  createSupportRequest(KENNUNG, APP_URL, PASSWORD, "Ticket #482").ok,
  false,
  "Ohne Support-Konto darf kein Link entstehen",
);

console.log("support.check: alle 6 Pruefungen bestanden");
