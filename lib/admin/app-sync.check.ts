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

const { demoConfirmationIssue, registrationFor } = await import("./app-sync.ts");
const { blocksFreeSale, hasAppFunction, moduleAccess, requiredModule } = await import("./modules.ts");
const { tenantFor } = await import("./tenant.ts");
const { DEFAULT_PRICING, migratePricing } = await import("../../data/pricing.ts");

/**
 * Zwei Kataloge mit getrenntem Kennungsraum – der Kern der Verwechslung.
 * Preispakete tragen keine Unterstriche, Mandantenpakete schon; ein Treffer im
 * jeweils anderen Katalog ist strukturell unmöglich.
 *
 * Die Kennungen sind die echten des Website-Katalogs (data/pricing.ts): Die App
 * übersetzt genau diese, ausgedachte hielten hier einen Vertrag fest, den es
 * nicht gibt.
 */
const pricing = {
  packages: [{ id: "basispaket", name: "Basispaket" }],
  modules: [
    { id: "operations-board", tier: "standard" },
    { id: "vehicles", tier: "standard" },
    { id: "billing", tier: "complex" },
    { id: "warehouse", tier: "complex" },
  ],
} as unknown as PricingConfig;

const tenantPackage = {
  id: "pkg_professional",
  name: "Professional",
  moduleIds: ["operations-board", "vehicles"],
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
  extraModuleIds: ["billing"],
  blockedModuleIds: [],
  tenant: tenantFor("muster-bau"),
  provisioning: [],
  createdAt: "2026-07-01T08:00:00.000Z",
} as unknown as Company;

/* ------------------------------------------------------------- Ohne Kauf */

const ohneKauf = registrationFor({ company, purchases: [], pricing, tenantPackage });

// 1. Der Paketname kommt aus dem Mandantenkatalog, nicht aus der Preisliste.
// Vorher wurde "pkg_professional" in pricing.packages gesucht, ging leer aus und
// die App bekam die technische Kennung als Namen.
assert.equal(
  ohneKauf.paket.name,
  "Professional",
  "Der Paketname darf keine technische Kennung sein",
);
assert.equal(ohneKauf.paket.id, "pkg_professional");

// 2. Gemeldet wird der volle Umfang: Grundumfang, Paketmodule PLUS
// Einzelfreigaben. Vorher waren es nur die Einzelfreigaben – die App bekam einen
// anderen Modulsatz, als der Adminbereich für denselben Mandanten anzeigt.
// `basispaket` steht vorn: Die App schaltet darüber Dashboard, Projekte,
// Zeiterfassung, Mitarbeiter und Statistiken frei – ohne die Kennung fehlten sie.
assert.deepEqual(
  ohneKauf.module,
  ["basispaket", "operations-board", "vehicles", "billing"],
  "Grundumfang, Paketmodule und Einzelfreigaben gehören alle in die Meldung",
);

// 3. Eine Sperre zieht ab.
const mitSperre = registrationFor({
  company: { ...company, blockedModuleIds: ["vehicles"] },
  purchases: [],
  pricing,
  tenantPackage,
});
assert.ok(!mitSperre.module.includes("vehicles"), "Ein gesperrtes Modul darf nicht gemeldet werden");

// 4. Ohne zugewiesenes Paket bleibt das Feld leer, statt eine Kennung zu erfinden –
// der Grundumfang geht trotzdem mit. Vorher kam hier eine leere Liste an, und
// die App las sie als Zugangsstopp: Eine Demo ohne Paket war sofort gesperrt.
const ohnePaket = registrationFor({
  company: { ...company, packageId: null, extraModuleIds: [] },
  purchases: [],
  pricing,
  tenantPackage: null,
});
assert.equal(ohnePaket.paket.id, "");
assert.equal(ohnePaket.paket.name, "");
assert.deepEqual(ohnePaket.module, ["basispaket"], "Der Grundumfang gehört zu jedem Mandanten");

// 5. Benutzerzahl des Mandanten, solange es keinen Kauf gibt.
assert.equal(ohneKauf.paket.benutzer, 12);

/* -------------------------------------------------------------- Mit Kauf */

const purchase = {
  id: "pur_abc",
  kind: "paket",
  companyId: "cmp_muster",
  packageId: "basispaket",
  moduleIds: ["operations-board", "geloeschtes-modul"],
  users: 25,
  capacityId: "cap_mittel",
  monthlyTotal: 289.9,
  implementationPrice: 1500,
  status: "offen",
  createdAt: "2026-08-01T10:00:00.000Z",
} as unknown as Purchase;

const mitKauf = registrationFor({ company, purchases: [purchase], pricing, tenantPackage });

// 6. Der Kauf gewinnt bei Paket und Benutzerzahl: sein eingefrorener Stand,
// nicht der heutige des Mandanten.
assert.equal(mitKauf.paket.id, "basispaket", "Der Kauf verweist auf die Preisliste");
assert.equal(mitKauf.paket.name, "Basispaket");
assert.equal(mitKauf.paket.benutzer, 25, "Gebuchte Benutzerzahl schlägt die des Mandanten");

// 7. Module aus dem Kauf, aber ohne Kennungen, die es im Katalog nicht mehr gibt –
// die App würde sie ablehnen und im Protokoll stünde ein Fehler statt der Ursache.
assert.ok(
  !mitKauf.module.includes("geloeschtes-modul"),
  "Eine inzwischen gelöschte Modulkennung darf nicht mitgeschickt werden",
);

// 8. BEWUSST UMGESCHRIEBEN: Früher stand hier „Ein Kauf ist eingefroren und
// nimmt keine späteren Freigaben auf". Damit wirkte der Modul-Tab für jeden
// Mandanten mit Kauf gar nicht – er zeigte „Einzeln freigegeben", und in der
// App kam nichts an. Eingefroren bleiben Preis, Paket und Benutzerzahl; den
// Modulumfang steuert der Superadmin über Freigaben und Sperren.
assert.deepEqual(
  mitKauf.module,
  ["basispaket", "operations-board", "billing"],
  "Einzelfreigaben wirken auch mit Kauf",
);

// 8a. Mit Kauf zählt dessen Umfang als Basis, nicht das Mandantenpaket: vehicles
// steht nur im Mandantenpaket und darf nicht nebenbei mitkommen.
assert.ok(!mitKauf.module.includes("vehicles"), "Mit Kauf wirkt das Mandantenpaket nicht");

// 8b. Eine Sperre wirkt auch gegen den Kauf. Vorher blieb ein gesperrtes Modul
// in der App sichtbar, sobald ein Kauf erfasst war.
const sperreMitKauf = registrationFor({
  company: { ...company, blockedModuleIds: ["operations-board"] },
  purchases: [purchase],
  pricing,
  tenantPackage,
});
assert.deepEqual(
  sperreMitKauf.module,
  ["basispaket", "billing"],
  "Ein gesperrtes Modul darf auch mit Kauf nicht gemeldet werden",
);

/* ----------------------------------------------------------- Rumpf selbst */

// 9. Was fest zum Mandanten gehört, steht unabhängig vom Kauf im Rumpf – und ein
// Zugangsdatum ist NICHT dabei. Die App verbindet sich mit ihrem eigenen Zugang.
assert.equal(mitKauf.kennung, "muster-bau");
assert.equal(mitKauf.datenbank, "gleistrix_muster_bau");
assert.equal(mitKauf.bucket, "gleistrix-muster-bau");
assert.deepEqual(mitKauf.erstbenutzer, { email: "info@example.test", name: "Max Mustermann" });
assert.ok(
  !JSON.stringify(mitKauf).toLowerCase().includes("passwor"),
  "Im Rumpf darf kein Passwortfeld auftauchen",
);

/* ------------------------------------------------------------- Die Sperre */

// 10. Eine Sperre deaktiviert alle Module – auch mit Kauf und auch den
// Grundumfang. Der Adminbereich sagt genau das zu („Eine Sperre deaktiviert
// sofort alle Module"), und die App liest die leere Liste als Zugangsstopp.
const gesperrtMitKauf = registrationFor({
  company: { ...company, status: "suspended" } as Company,
  purchases: [purchase],
  pricing,
  tenantPackage,
});
assert.deepEqual(
  gesperrtMitKauf.module,
  [],
  "Ein gesperrter Mandant darf auch mit Kauf keine Module gemeldet bekommen",
);

// 11. Ohne Kauf gilt dasselbe.
const gesperrtOhneKauf = registrationFor({
  company: { ...company, status: "suspended" } as Company,
  purchases: [],
  pricing,
  tenantPackage,
});
assert.deepEqual(gesperrtOhneKauf.module, [], "Auch ohne Kauf bleibt eine Sperre eine Sperre");

/* ---------------------------------------------------------- Zubuchungen */

/** Freischaltung aus der App: kommt „on top" auf den Grundkauf. */
const zubuchung = {
  id: "pur_zub_xyz",
  kind: "zubuchung",
  companyId: "cmp_muster",
  packageId: "",
  capacityId: "",
  users: 0,
  moduleIds: ["warehouse"],
  monthlyTotal: 39,
  implementationPrice: 0,
  status: "freigegeben",
  createdAt: "2026-08-06T09:00:00.000Z",
} as unknown as Purchase;

// 12. Der Mandant behaelt seinen Grundumfang UND bekommt die Zubuchung dazu.
// Wuerde nur der neueste Kauf gemeldet, entzoege die Zubuchung ihm alles, was
// er vorher gebucht hat - hier also die Einsatztafel.
const mitZubuchung = registrationFor({
  company,
  // Neueste zuerst, wie der Store sie liefert.
  purchases: [zubuchung, purchase],
  pricing,
  tenantPackage,
});
assert.deepEqual(
  mitZubuchung.module,
  ["basispaket", "operations-board", "billing", "warehouse"],
  "Zubuchung kommt zum Grundumfang dazu, sie ersetzt ihn nicht",
);

// 13. Paket und Benutzerzahl bleiben die des Grundkaufs - eine Zubuchung
// enthaelt dazu nichts und darf sie nicht auf 0 ziehen.
assert.equal(mitZubuchung.paket.id, "basispaket", "Das Paket steht im Grundkauf");
assert.equal(mitZubuchung.paket.benutzer, 25, "Die Benutzerzahl steht im Grundkauf");

// 14. Auch ohne Grundkauf zaehlt eine Zubuchung mit - dann zum Stand, den der
// Adminbereich fuer den Mandanten anzeigt.
const nurZubuchung = registrationFor({
  company,
  purchases: [zubuchung],
  pricing,
  tenantPackage,
});
assert.ok(
  nurZubuchung.module.includes("warehouse"),
  "Eine Zubuchung ohne Grundkauf darf nicht verschwinden",
);
assert.ok(
  nurZubuchung.module.includes("operations-board"),
  "Der Paketumfang des Mandanten bleibt daneben bestehen",
);

// 14a. Eine Sperre filtert auch Zubuchungen. Vorher kamen sie NACH dem Abzug
// der Sperren dazu – ein in der App zugebuchtes Modul liess sich im
// Adminbereich auf keinem Weg sperren.
const zubuchungGesperrt = registrationFor({
  company: { ...company, blockedModuleIds: ["warehouse"] },
  purchases: [zubuchung, purchase],
  pricing,
  tenantPackage,
});
assert.ok(
  !zubuchungGesperrt.module.includes("warehouse"),
  "Ein gesperrtes Modul darf auch als Zubuchung nicht gemeldet werden",
);

// 15. Ein gewoehnlicher Mandant traegt kein Ablaufdatum - aber ausdruecklich
// null, nicht "fehlt". Nur so entfernt die App die Befristung, wenn aus einer
// Demo ein zahlender Kunde wird.
assert.equal(
  ohneKauf.demoLaeuftAbAm,
  null,
  "Ohne Demo muss das Ablaufdatum ausdruecklich null sein",
);

// 16. Ein Demomandant meldet sein Ablaufdatum unveraendert weiter. Ohne das
// liefe der Zugang in der App unbefristet - die Befristung ist die einzige
// Eigenschaft, die eine Demo von einem Kunden unterscheidet.
const demo = registrationFor({
  company: { ...company, demoExpiresAt: "2026-08-23T10:00:00.000Z" },
  purchases: [],
  pricing,
  tenantPackage,
});
assert.equal(demo.demoLaeuftAbAm, "2026-08-23T10:00:00.000Z");

// 16b. Ein Grundkauf hebt die Befristung auf. Aus einer Demo wird ein Kunde,
// indem er kauft - bliebe das Datum stehen, spaerrte die App den bezahlten
// Zugang am Tag des frueheren Demoendes aus.
const gekauft = registrationFor({
  company: { ...company, demoExpiresAt: "2026-08-23T10:00:00.000Z" },
  purchases: [purchase],
  pricing,
  tenantPackage,
});
assert.equal(
  gekauft.demoLaeuftAbAm,
  null,
  "Ein Grundkauf muss die Demo-Befristung aufheben",
);

/* ------------------------------------ Quittung zum Demo-Ablaufdatum */

// 17. Ohne Befristung wird nichts geprueft. Ein gewoehnlicher Mandant muss
// auch gegen eine aeltere App weiterhin gemeldet werden koennen.
assert.equal(demoConfirmationIssue(null, undefined), null);
assert.equal(demoConfirmationIssue(undefined, undefined), null);

// 18. Stimmt die Quittung, ist alles in Ordnung.
assert.equal(
  demoConfirmationIssue("2026-08-23T10:00:00.000Z", "2026-08-23T10:00:00.000Z"),
  null,
);

// 19. Der Kern: Eine aeltere App wirft das Feld beim Parsen weg und antwortet
// ohne es. Ohne diese Pruefung ginge die Einladung raus und der Demozugang
// liefe unbefristet - als Erfolg im Protokoll.
const ohneQuittung = demoConfirmationIssue("2026-08-23T10:00:00.000Z", undefined);
assert.ok(
  ohneQuittung && ohneQuittung.includes("aktualisieren"),
  "Eine fehlende Quittung muss zum Aktualisieren der App auffordern",
);
assert.ok(demoConfirmationIssue("2026-08-23T10:00:00.000Z", null));

// 20. Auch ein abweichender Zeitpunkt zaehlt nicht als Freigabe: Beide Seiten
// muessen dasselbe Ende kennen, sonst sperrt die App zu einem anderen Termin
// als dem, der im Protokoll steht.
assert.ok(demoConfirmationIssue("2026-08-23T10:00:00.000Z", "2026-09-23T10:00:00.000Z"));
assert.ok(demoConfirmationIssue("2026-08-23T10:00:00.000Z", "unlesbar"));

/* ------------------------------------------ Zustand je Modul (Modul-Tab) */

// 21. Die Anzeige liest DIESELBE Funktion wie die Meldung. Zwei Rechenwege
// drifteten auseinander – genau so zeigte der Modul-Tab „Einzeln freigegeben",
// während in der App nichts ankam.
const zustand = moduleAccess({
  company: { ...company, blockedModuleIds: ["vehicles"] },
  pricing,
  tenantPackage,
  purchases: [zubuchung],
});
assert.equal(zustand.sourceOf("operations-board"), "package");
assert.equal(zustand.sourceOf("vehicles"), "blocked", "Die Sperre steht über dem Paket");
assert.equal(zustand.sourceOf("billing"), "extra");
assert.equal(zustand.sourceOf("warehouse"), "addon");
assert.equal(zustand.sourceOf("material"), "none");
assert.deepEqual(
  registrationFor({
    company: { ...company, blockedModuleIds: ["vehicles"] },
    purchases: [zubuchung],
    pricing,
    tenantPackage,
  }).module,
  ["basispaket", ...zustand.moduleIds],
  "Zähler und Meldung müssen denselben Satz zeigen",
);
assert.ok(!zustand.moduleIds.includes("basispaket"), "Der Zähler zählt nur Katalogmodule");

// 22. Mit Kauf heisst die Quelle „Kauf", und das Mandantenpaket wirkt nicht.
const zustandMitKauf = moduleAccess({ company, pricing, tenantPackage, purchases: [purchase] });
assert.equal(zustandMitKauf.sourceOf("operations-board"), "purchase");
assert.equal(zustandMitKauf.sourceOf("vehicles"), "none");

// 23. Ein gesperrter Mandant meldet nichts und zählt nichts – die Quelle bleibt
// aber lesbar, damit die Knöpfe nach dem Entsperren stimmen.
const zustandGesperrt = moduleAccess({
  company: { ...company, status: "suspended" } as Company,
  pricing,
  tenantPackage,
  purchases: [],
});
assert.deepEqual(zustandGesperrt.reported, []);
assert.deepEqual(zustandGesperrt.moduleIds, []);
assert.equal(zustandGesperrt.sourceOf("billing"), "extra");

// 24. Vier Katalogmodule haben in der App noch keine Funktion. Der Modul-Tab
// sagt das dazu – sonst hält der Superadmin eine Freigabe für wirkungslos kaputt.
for (const id of ["qualifications", "employee-documents", "templates", "deadlines"]) {
  assert.equal(hasAppFunction(id), false, `${id} hat in der App noch keine Funktion`);
}
assert.equal(hasAppFunction("warehouse"), true);

/* -------------------------------------------- KI-Agenten und Wissensdatenbank */

const kiKatalog = {
  ...pricing,
  modules: [...pricing.modules, { id: "ai-agents", tier: "ai" }, { id: "knowledge-base", tier: "ai" }],
} as unknown as PricingConfig;

const kiZugang = (extraModuleIds: string[], blockedModuleIds: string[] = []) =>
  moduleAccess({
    company: { ...company, extraModuleIds, blockedModuleIds } as Company,
    pricing: kiKatalog,
    tenantPackage,
    purchases: [],
  });

// 25. Die Wissensdatenbank liegt in der App im KI-Chat: Ohne `ai-agents` führte
// der Mandant sie, sähe sie aber nirgends – bei „abgeglichen" im Protokoll.
const nurWissen = kiZugang(["knowledge-base"]);
assert.ok(nurWissen.reported.includes("knowledge-base"));
assert.ok(nurWissen.reported.includes("ai-agents"));
assert.equal(nurWissen.sourceOf("ai-agents"), "required");
assert.equal(requiredModule("knowledge-base"), "ai-agents");

// 26. Eine Sperre gilt auch hier: Wer KI-Agenten gesperrt hat, bekommt sie nicht
// durch die Hintertür zurück.
const kiGesperrt = kiZugang(["knowledge-base"], ["ai-agents"]);
assert.equal(kiGesperrt.sourceOf("ai-agents"), "blocked");
assert.ok(!kiGesperrt.reported.includes("ai-agents"));
assert.ok(kiGesperrt.reported.includes("knowledge-base"));

// 27. KI-Agenten allein ziehen die Wissensdatenbank nicht mit: Sie ist eine
// eigene Position, und ohne sie bleibt der Chat wie bisher.
const nurKi = kiZugang(["ai-agents"]);
assert.ok(nurKi.reported.includes("ai-agents"));
assert.equal(nurKi.sourceOf("ai-agents"), "extra");
assert.equal(nurKi.sourceOf("knowledge-base"), "none");
assert.ok(!nurKi.reported.includes("knowledge-base"));

// 28. Eine eigene Freigabe bleibt als solche sichtbar, sonst zeigte der Modul-Tab
// keinen Knopf zum Zurücknehmen.
assert.equal(kiZugang(["ai-agents", "knowledge-base"]).sourceOf("ai-agents"), "extra");

// 29. Eine gesperrte Wissensdatenbank schaltet nichts mit, und ohne jede Freigabe
// kommt keins von beiden an.
const wissenGesperrt = kiZugang(["knowledge-base"], ["knowledge-base"]);
assert.equal(wissenGesperrt.sourceOf("ai-agents"), "none");
assert.ok(!wissenGesperrt.reported.includes("ai-agents"));
assert.equal(kiZugang([]).sourceOf("ai-agents"), "none");

// 30. Ein gesperrter Mandant meldet weiter nichts.
assert.deepEqual(
  moduleAccess({
    company: { ...company, status: "suspended", extraModuleIds: ["knowledge-base"] } as Company,
    pricing: kiKatalog,
    tenantPackage,
    purchases: [],
  }).reported,
  [],
);

/* --------------------------------------- Gespeicherter Katalog ohne das Modul */

// Der Katalog liegt als Stand in der Datenbank: Ein Eintrag in DEFAULT_PRICING käme
// dort nie an, und moduleAccess würfe die Freigabe still weg.
const gespeichert = {
  ...DEFAULT_PRICING,
  modules: DEFAULT_PRICING.modules.filter(
    (module) => module.id !== "knowledge-base" && module.id !== "ai-agents",
  ),
};

// 31. Beide kommen als inaktiv dazu: freigebbar, aber nicht auf der Preisseite.
const nachgezogen = migratePricing(gespeichert);
for (const id of ["ai-agents", "knowledge-base"]) {
  const eintrag = nachgezogen.modules.find((module) => module.id === id);
  assert.ok(eintrag, `${id} fehlt im nachgezogenen Katalog`);
  assert.equal(eintrag.isActive, false, `${id} darf nicht ungefragt verkauft werden`);
}
assert.equal(nachgezogen.modules.length, gespeichert.modules.length + 2);

// 32. Was der Admin gepflegt hat, bleibt: kein Doppel, kein überschriebener Preis.
const gepflegt = migratePricing({
  ...DEFAULT_PRICING,
  modules: [
    { ...DEFAULT_PRICING.modules[0] },
    { id: "ai-agents", tier: "ai", title: "Eigener Titel", price: 99, isActive: true, features: [] },
    { id: "knowledge-base", tier: "ai", title: "Wissen", price: 40, isActive: true, features: [] },
  ],
});
assert.equal(gepflegt.modules.length, 3);
assert.equal(gepflegt.modules.find((module) => module.id === "ai-agents")?.price, 99);
assert.equal(gepflegt.modules.find((module) => module.id === "knowledge-base")?.isActive, true);

// 33. Der ganze Weg: alter Stand aus der Datenbank, Freigabe, Meldung an die App.
const gemeldet = registrationFor({
  company: {
    ...company,
    status: "active",
    extraModuleIds: ["knowledge-base"],
    blockedModuleIds: [],
  } as Company,
  purchases: [],
  pricing: migratePricing(gespeichert),
  tenantPackage,
});
assert.ok(gemeldet.module.includes("knowledge-base"));
assert.ok(gemeldet.module.includes("ai-agents"));

// 34. Der Auslieferungszustand verkauft die Wissensdatenbank nicht ungefragt, die
// App kennt die Kennung aber: Der Modul-Tab sagt nicht „noch ohne Funktion".
const auslieferung = DEFAULT_PRICING.modules.find((module) => module.id === "knowledge-base");
assert.equal(auslieferung?.isActive, false);
assert.equal(auslieferung?.tier, "ai");
assert.equal(hasAppFunction("knowledge-base"), true);

// 35. Für 0 € aktiviert, verschenkte die Wissensdatenbank KI-Agenten gleich mit.
assert.equal(blocksFreeSale({ id: "knowledge-base", price: 0 }), true);
assert.equal(blocksFreeSale({ id: "knowledge-base", price: 30 }), false);
assert.equal(blocksFreeSale({ id: "ai-agents", price: 0 }), false);

console.log("app-sync.check: alle 35 Pruefungen bestanden");
