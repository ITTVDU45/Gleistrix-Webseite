/**
 * Selbsttest für die Mandanten-Verbindungszeichenfolge.
 *
 * Ausführen: `node lib/admin/provision/mongo.check.ts`
 *
 * Warum es diesen Check gibt: `tenantMongoUri` schneidet die Zugangsdaten des
 * Cluster-Administrators per Regex aus MONGODB_ADMIN_URI heraus und setzt die
 * des Mandanten ein. Greift die Regex daneben, wandert das root-Passwort in die
 * Umgebung einer Kundeninstanz – der teuerste denkbare Fehler an dieser Stelle.
 * Der Check pinnt genau das, plus authSource und das Passwortalphabet.
 */
import assert from "node:assert/strict";

const ADMIN_PASSWORD = "root-geheim-xyz";
process.env.MONGODB_ADMIN_URI = `mongodb://cluster_root:${ADMIN_PASSWORD}@5.9.22.170:57017/admin?authSource=admin&retryWrites=true`;

const { generateTenantPassword, tenantMongoUri } = await import("./mongo.ts");

const tenant = {
  mongoDatabase: "gleistrix_muster_bau",
  mongoUser: "svc_muster_bau",
  minioBucket: "gleistrix-muster-bau",
};

// 1. Keine Spur des Administrators in der Mandanten-URI.
const uri = tenantMongoUri(tenant, "mandanten-passwort");
assert.ok(!uri.includes(ADMIN_PASSWORD), `Admin-Passwort steht in der Mandanten-URI: ${uri}`);
assert.ok(!uri.includes("cluster_root"), `Admin-Benutzer steht in der Mandanten-URI: ${uri}`);

// 2. Zugangsdaten, Host und Parameter des Mandanten stimmen.
const parsed = new URL(uri);
assert.equal(parsed.username, "svc_muster_bau");
assert.equal(decodeURIComponent(parsed.password), "mandanten-passwort");
assert.equal(parsed.host, "5.9.22.170:57017");
assert.equal(parsed.pathname, "/gleistrix_muster_bau");
assert.equal(parsed.searchParams.get("retryWrites"), "true", "Cluster-Parameter dürfen nicht verloren gehen");

// 3. authSource zeigt auf die Mandanten-Datenbank, nicht auf admin.
assert.equal(
  parsed.searchParams.get("authSource"),
  "gleistrix_muster_bau",
  "authSource=admin würde den Mandanten am falschen Ort authentifizieren",
);

// 4. Sonderzeichen im Passwort werden kodiert, statt die URI zu zerlegen.
const tricky = tenantMongoUri(tenant, "a:b@c/d?e");
assert.equal(decodeURIComponent(new URL(tricky).password), "a:b@c/d?e");
assert.equal(new URL(tricky).host, "5.9.22.170:57017", "Sonderzeichen dürfen den Host nicht verschieben");

// 5. Erzeugte Passwörter: feste Länge, URI-sicheres Alphabet, nicht wiederholt.
const first = generateTenantPassword();
assert.equal(first.length, 32);
assert.match(first, /^[A-Za-z0-9_-]{32}$/, `Nicht URI-sicheres Zeichen im Passwort: ${first}`);
assert.notEqual(first, generateTenantPassword(), "Zwei Aufrufe dürfen nie dasselbe Passwort liefern");

// 6. Ohne Administrator-Zugang gibt es keine URI – lieber Abbruch als Halbfertiges.
delete process.env.MONGODB_ADMIN_URI;
assert.throws(() => tenantMongoUri(tenant, "egal"), "Ohne MONGODB_ADMIN_URI darf keine URI entstehen");

console.log("provision/mongo.check: alle 6 Pruefungen bestanden");
