/**
 * Selbsttest für den Support-Login.
 *
 * Ausführen: `node lib/admin/support.check.ts`
 *
 * Warum es diesen Check gibt: Signatur und Prüfung liegen in ZWEI Repos –
 * `createSupportLink` hier und `verifyToken` in
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

const { createSupportLink } = await import("./support.ts");

const tenant = {
  subdomain: "muster-bau.gleistrix.de",
  mongoDatabase: "gleistrix_muster_bau",
  mongoUser: "svc_muster_bau",
  minioBucket: "gleistrix-muster-bau",
};

/** Exakt die Schritte aus verifyToken() der Gleistrix-Route. */
function verifyLikeInstance(token: string, host: string) {
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
  if (aud.toLowerCase() !== host) {
    return { ok: false as const, reason: "Audience passt nicht zum Host" };
  }
  return { ok: true as const, email: sub, audience: aud };
}

function tokenOf(url: string): string {
  const value = new URL(url).searchParams.get("token");
  assert.ok(value, "Link enthält kein Token");
  return value;
}

// 1. Gültiger Link wird von der Instanz akzeptiert.
const good = createSupportLink(tenant.subdomain, `https://${tenant.subdomain}`,PASSWORD, "Ticket #482");
assert.equal(good.ok, true, "Gültige Anfrage muss einen Link liefern");
if (!good.ok) throw new Error("unreachable");

assert.ok(
  good.url.startsWith("https://muster-bau.gleistrix.de/api/internal/support-login?"),
  `Unerwartete Link-Basis: ${good.url}`,
);

const accepted = verifyLikeInstance(tokenOf(good.url), "muster-bau.gleistrix.de");
assert.equal(accepted.ok, true, "Instanz muss das frische Token akzeptieren");
if (accepted.ok) {
  assert.equal(accepted.email, "support@example.test");
}

// 2. Token von Mandant A darf bei Mandant B nicht greifen.
const wrongHost = verifyLikeInstance(tokenOf(good.url), "nordgleis.gleistrix.de");
assert.equal(wrongHost.ok, false, "Fremder Host muss abgelehnt werden");

// 3. Manipulierte Signatur fliegt raus.
const token = tokenOf(good.url);
const tampered = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;
assert.equal(
  verifyLikeInstance(tampered, "muster-bau.gleistrix.de").ok,
  false,
  "Manipulierte Signatur muss abgelehnt werden",
);

// 4. Falsches Support-Passwort erzeugt gar kein Token.
const badPassword = createSupportLink(tenant.subdomain, `https://${tenant.subdomain}`,"falsch", "Ticket #482");
assert.equal(badPassword.ok, false, "Falsches Passwort darf keinen Link erzeugen");

// 5. Ohne Begründung kein Zugriff – der Grund landet im Protokoll.
const noReason = createSupportLink(tenant.subdomain, `https://${tenant.subdomain}`,PASSWORD, "  ");
assert.equal(noReason.ok, false, "Fehlender Grund muss abgelehnt werden");

// 6. Ohne konfiguriertes Konto passiert nichts.
delete process.env.GLEISTRIX_SUPPORT_PASSWORD;
assert.equal(
  createSupportLink(tenant.subdomain, `https://${tenant.subdomain}`,PASSWORD, "Ticket #482").ok,
  false,
  "Ohne Support-Konto darf kein Link entstehen",
);

console.log("support.check: alle 6 Pruefungen bestanden");
