/**
 * Selbsttest für den Rumpf, den die App bekommt.
 *
 * Ausführen: `node lib/admin/app-sync.check.ts`
 *
 * Warum es diesen Check gibt: Was hier entschieden wird, sieht niemand mehr.
 * Meldet die Website einen falschen Paketnamen oder einen zu kleinen Modulsatz,
 * legt die App den Mandanten trotzdem an – nur eben falsch, ohne Fehlschlag im
 * Protokoll. Genau das ist passiert: Der Paketname wurde im falschen Katalog
 * gesucht, und die Modulliste bestand nur aus den Einzelfreigaben.
 */
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

import type { Company, Package, Purchase } from "@/types/admin";
import type { PricingConfig } from "@/types/pricing";

// app-sync.ts importiert seine Nachbarn ohne Dateiendung – für den Bundler
// richtig, für ein nacktes `node` nicht auflösbar. Statt die Anwendung für den
// Test umzuschreiben, ergänzt dieser Haken die Endung beim Auflösen.
registerHooks({
  resolve(specifier, context, next) {
    const relative = specifier.startsWith("./") || specifier.startsWith("../");
    return next(relative && !specifier.endsWith(".ts") ? `${specifier}.ts` : specifier, context);
  },
});

const { registrationFor } = await import("./app-sync.ts");
const { tenantFor } = await import("./tenant.ts");

/**
 * Zwei Kataloge mit getrenntem Kennungsraum – der Kern der Verwechslung.
 * Preispakete tragen keine Unterstriche, Mandantenpakete schon; ein Treffer im
 * jeweils anderen Katalog ist strukturell unmöglich.
 */
const pricing = {
  packages: [{ id: "professional", name: "Professional" }],
  modules: [
    { id: "einsatztafel", tier: "standard" },
    { id: "zeiterfassung", tier: "standard" },
    { id: "abrechnung", tier: "complex" },
  ],
} as unknown as PricingConfig;

const tenantPackage = {
  id: "pkg_professional",
  name: "Professional",
  moduleIds: ["einsatztafel", "zeiterfassung"],
} as unknown as Package;

const company = {
  id: "cmp_muster",
  name: "Muster Bau GmbH",
  slug: "muster-bau",
  contactName: "Max Mustermann",
  contactEmail: "info@example.test",
  seats: 12,
  status: "provisioning",
  packageId: "pkg_professional",
  extraModuleIds: ["abrechnung"],
  blockedModuleIds: [],
  tenant: tenantFor("muster-bau"),
  provisioning: [],
  createdAt: "2026-07-01T08:00:00.000Z",
} as unknown as Company;

/* ------------------------------------------------------------- Ohne Kauf */

const ohneKauf = registrationFor({ company, purchase: null, pricing, tenantPackage });

// 1. Der Paketname kommt aus dem Mandantenkatalog, nicht aus der Preisliste.
// Vorher wurde "pkg_professional" in pricing.packages gesucht, ging leer aus und
// die App bekam die technische Kennung als Namen.
assert.equal(
  ohneKauf.paket.name,
  "Professional",
  "Der Paketname darf keine technische Kennung sein",
);
assert.equal(ohneKauf.paket.id, "pkg_professional");

// 2. Gemeldet wird der volle Umfang: Paketmodule PLUS Einzelfreigaben.
// Vorher waren es nur die Einzelfreigaben – die App bekam einen anderen
// Modulsatz, als der Adminbereich für denselben Mandanten anzeigt.
assert.deepEqual(
  [...ohneKauf.module].sort(),
  ["abrechnung", "einsatztafel", "zeiterfassung"],
  "Paketmodule und Einzelfreigaben gehören beide in die Meldung",
);

// 3. Eine Sperre zieht ab.
const mitSperre = registrationFor({
  company: { ...company, blockedModuleIds: ["zeiterfassung"] },
  purchase: null,
  pricing,
  tenantPackage,
});
assert.ok(
  !mitSperre.module.includes("zeiterfassung"),
  "Ein gesperrtes Modul darf nicht gemeldet werden",
);

// 4. Ohne zugewiesenes Paket bleibt das Feld leer, statt eine Kennung zu erfinden.
const ohnePaket = registrationFor({
  company: { ...company, packageId: null, extraModuleIds: [] },
  purchase: null,
  pricing,
  tenantPackage: null,
});
assert.equal(ohnePaket.paket.id, "");
assert.equal(ohnePaket.paket.name, "");
assert.deepEqual(ohnePaket.module, []);

// 5. Benutzerzahl des Mandanten, solange es keinen Kauf gibt.
assert.equal(ohneKauf.paket.benutzer, 12);

/* -------------------------------------------------------------- Mit Kauf */

const purchase = {
  id: "pur_abc",
  companyId: "cmp_muster",
  packageId: "professional",
  moduleIds: ["einsatztafel", "geloeschtes-modul"],
  users: 25,
  capacityId: "cap_mittel",
  monthlyTotal: 289.9,
  implementationPrice: 1500,
  status: "offen",
  createdAt: "2026-08-01T10:00:00.000Z",
} as unknown as Purchase;

const mitKauf = registrationFor({ company, purchase, pricing, tenantPackage });

// 6. Der Kauf gewinnt: sein eingefrorener Stand, nicht der heutige des Mandanten.
assert.equal(mitKauf.paket.id, "professional", "Der Kauf verweist auf die Preisliste");
assert.equal(mitKauf.paket.name, "Professional");
assert.equal(mitKauf.paket.benutzer, 25, "Gebuchte Benutzerzahl schlägt die des Mandanten");

// 7. Module aus dem Kauf, aber ohne Kennungen, die es im Katalog nicht mehr gibt –
// die App würde sie ablehnen und im Protokoll stünde ein Fehler statt der Ursache.
assert.deepEqual(
  mitKauf.module,
  ["einsatztafel"],
  "Eine inzwischen gelöschte Modulkennung darf nicht mitgeschickt werden",
);

// 8. Die Einzelfreigaben des Mandanten mischen sich NICHT in einen Kauf.
assert.ok(
  !mitKauf.module.includes("abrechnung"),
  "Ein Kauf ist eingefroren und nimmt keine späteren Freigaben auf",
);

/* ----------------------------------------------------------- Rumpf selbst */

// 9. Was fest zum Mandanten gehört, steht unabhängig vom Kauf im Rumpf – und ein
// Zugangsdatum ist NICHT dabei. Die App verbindet sich mit ihrem eigenen Zugang.
assert.equal(mitKauf.kennung, "muster-bau");
assert.equal(mitKauf.datenbank, "gleistrix_muster_bau");
assert.equal(mitKauf.bucket, "gleistrix-muster-bau");
assert.deepEqual(mitKauf.erstbenutzer, { email: "info@example.test", name: "Max Mustermann" });
assert.equal(mitKauf.gueltigBis, null, "Ohne Demozugang bleibt gueltigBis leer");
assert.ok(
  !JSON.stringify(mitKauf).toLowerCase().includes("passwor"),
  "Im Rumpf darf kein Passwortfeld auftauchen",
);

/* ------------------------------------------------------------- Die Sperre */

// 10. Eine Sperre deaktiviert alle Module – auch mit Kauf. Der Adminbereich
// sagt genau das zu („Eine Sperre deaktiviert sofort alle Module"). Läge die
// Regel nur in effectiveModuleIds, hebelte ein Kauf sie aus: Der Kauf-Zweig
// kommt an dieser Funktion vorbei.
const gesperrtMitKauf = registrationFor({
  company: { ...company, status: "suspended" } as Company,
  purchase,
  pricing,
  tenantPackage,
});
assert.deepEqual(
  gesperrtMitKauf.module,
  [],
  "Ein gesperrter Mandant darf auch mit Kauf keine Module gemeldet bekommen",
);

// 11. Ohne Kauf gilt dasselbe – hier über effectiveModuleIds.
const gesperrtOhneKauf = registrationFor({
  company: { ...company, status: "suspended" } as Company,
  purchase: null,
  pricing,
  tenantPackage,
});
assert.deepEqual(gesperrtOhneKauf.module, [], "Auch ohne Kauf bleibt eine Sperre eine Sperre");

console.log("app-sync.check: alle 11 Pruefungen bestanden");
