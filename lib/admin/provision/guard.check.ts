/**
 * Selbsttest für die Namensschranke des Mandanten-Abbaus.
 *
 * Ausführen: `node lib/admin/provision/guard.check.ts`
 *
 * Warum es diesen Check gibt: `teardownGuard` ist die einzige Verteidigung
 * zwischen einem Klick im Adminbereich und `dropDatabase` mit root-Rechten.
 * Fällt eine Regel still weg, merkt das niemand – bis eine Löschung die
 * Control-Plane oder einen fremden Mandanten trifft. TypeScript kann hier
 * nichts prüfen: alle Werte sind Zeichenketten.
 */
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// guard.ts importiert mit dem @/-Alias und ohne Dateiendung – für den Bundler
// richtig, für ein nacktes `node` nicht auflösbar.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith("@/")) {
      return next(new URL(`../../../${specifier.slice(2)}.ts`, import.meta.url).href, context);
    }
    const relativ = specifier.startsWith("./") || specifier.startsWith("../");
    return next(relativ && !specifier.endsWith(".ts") ? `${specifier}.ts` : specifier, context);
  },
});

const { teardownGuard } = await import("./guard.ts");
const { tenantFor } = await import("../tenant.ts");

/** Der Normalfall: ein echter Mandant, dessen Namen aus tenantFor stammen. */
assert.equal(
  teardownGuard("muster-bau", tenantFor("muster-bau")),
  null,
  "Ein regulärer Mandant muss abgebaut werden dürfen",
);

/* ------------------------------------------------- Die Control-Plane selbst */

// Der gefährlichste Fall, und der einzige, der über den REGULÄREN Weg
// hereinkäme: `slugify("Control")` ergibt „control", tenantFor liefert dazu
// gleistrix_control – den Adminbereich. Die Namen sind in sich stimmig, das
// Präfix stimmt, die Neuberechnung stimmt. Nur die Ausschlussliste rettet hier.
assert.equal(tenantFor("control").mongoDatabase, "gleistrix_control");
const control = teardownGuard("control", tenantFor("control"));
assert.ok(control, "Die Control-Plane darf niemals abgebaut werden");
assert.ok(
  control.includes("gleistrix_control"),
  `Die Meldung muss die Datenbank nennen: ${control}`,
);

// Abweichend konfigurierte Control-Plane: BEIDE Namen bleiben gesperrt – der
// konfigurierte und das Literal. Sonst wäre eine noch stehende Altdatenbank
// ungeschützt.
process.env.MONGODB_DATABASE = "gleistrix_steuerung";
assert.ok(
  teardownGuard("steuerung", tenantFor("steuerung")),
  "Die konfigurierte Control-Plane-Datenbank darf nicht abgebaut werden",
);
assert.ok(
  teardownGuard("control", tenantFor("control")),
  "Auch bei abweichender Konfiguration bleibt gleistrix_control gesperrt",
);
delete process.env.MONGODB_DATABASE;

/* ------------------------------------------------------- Geteilte Benutzer */

// Der Benutzer der App bedient ALLE Mandanten. Träfe der Abbau ihn, wären
// sämtliche Kunden gleichzeitig ausgesperrt.
process.env.MONGODB_APP_USERNAME = "svc_muster_bau";
const geteilt = teardownGuard("muster-bau", tenantFor("muster-bau"));
assert.ok(geteilt, "Ein geteilter Datenbankbenutzer darf nicht gelöscht werden");
assert.ok(geteilt.includes("svc_muster_bau"), `Die Meldung muss den Benutzer nennen: ${geteilt}`);
delete process.env.MONGODB_APP_USERNAME;

process.env.MONGODB_USERNAME = "svc_muster_bau";
assert.ok(
  teardownGuard("muster-bau", tenantFor("muster-bau")),
  "Auch der Anwendungsbenutzer der Control-Plane ist tabu",
);
delete process.env.MONGODB_USERNAME;

/* ------------------------------------- Gespeicherte Namen, die nicht passen */

// Ab hier Fälle, die über tenantFor gar nicht entstehen können. Sie kämen aus
// einem von Hand verbogenen Datensatz oder einer alten Migration – genau
// deshalb traut der Guard dem gespeicherten Feld nicht und rechnet nach.
const echt = tenantFor("muster-bau");

assert.ok(
  teardownGuard("muster-bau", { ...echt, mongoDatabase: "gleistrix_fremder_kunde" }),
  "Ein Datenbankname, der nicht zur Kennung gehört, muss abgelehnt werden",
);
assert.ok(
  teardownGuard("muster-bau", { ...echt, mongoDatabase: "admin" }),
  "„admin“ ist keine Mandanten-Datenbank",
);
assert.ok(
  teardownGuard("muster-bau", { ...echt, mongoDatabase: "local" }),
  "„local“ ist keine Mandanten-Datenbank",
);
assert.ok(
  teardownGuard("muster-bau", { ...echt, mongoDatabase: "config" }),
  "„config“ ist keine Mandanten-Datenbank",
);
assert.ok(
  teardownGuard("muster-bau", { ...echt, mongoUser: "root" }),
  "Ein Benutzer ohne svc_-Präfix muss abgelehnt werden",
);
assert.ok(
  teardownGuard("muster-bau", { ...echt, minioBucket: "uploads" }),
  "Ein Bucket ohne gleistrix--Präfix muss abgelehnt werden",
);
assert.ok(
  teardownGuard("muster-bau", { ...echt, minioBucket: "" }),
  "Ohne Bucketname liefe removeObjects auf den Standardbucket",
);

// Und die Gegenprobe zur Neuberechnung: eine andere Kennung mit denselben
// gespeicherten Namen. Ohne Regel 1 würde hier ein fremder Mandant gelöscht.
assert.ok(
  teardownGuard("andere-firma", echt),
  "Kennung und gespeicherte Namen müssen zusammenpassen",
);

console.log("guard.check: alle 16 Pruefungen bestanden");
