/**
 * Selbsttest für den eingefrorenen Kaufpreis.
 *
 * Ausführen: `node lib/admin/purchase.check.ts`
 *
 * Warum es diesen Check gibt: `monthlyTotal` wird einmal geschrieben und nie
 * wieder nachgerechnet – ein Fehler hier fällt erst auf der Rechnung auf. Am
 * teuersten wäre das Vergessen der Nutzungsmengen: Die Lagerverwaltung kostet
 * je Artikel, bei 10.000 Artikeln sind das 5.000 € im Monat, die stillschweigend
 * unter den Tisch fielen.
 */
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

import type { PricingConfig } from "@/types/pricing";

// purchase.ts importiert mit dem @/-Alias und ohne Dateiendung – für den
// Bundler richtig, für ein nacktes `node` nicht auflösbar.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith("@/")) {
      return next(new URL(`../../${specifier.slice(2)}.ts`, import.meta.url).href, context);
    }
    const relativ = specifier.startsWith("./") || specifier.startsWith("../");
    return next(relativ && !specifier.endsWith(".ts") ? `${specifier}.ts` : specifier, context);
  },
});

const { addonPurchaseFor, purchaseFor } = await import("./purchase.ts");

/** Zahlen bewusst krumm, damit ein vergessener Summand auffällt. */
const config = {
  packages: [
    {
      id: "professional",
      name: "Professional",
      price: 390,
      includedUsers: 10,
      implementationPrice: 1500,
      isDefault: true,
      description: "",
      features: [],
    },
    {
      id: "starter",
      name: "Starter",
      price: 150,
      includedUsers: 3,
      implementationPrice: 500,
      isDefault: false,
      description: "",
      features: [],
    },
  ],
  capacities: [
    { id: "klein", label: "Klein", shortLabel: "S", projects: 10, monthlySurcharge: 0, isDefault: true },
    { id: "gross", label: "Groß", shortLabel: "L", projects: 100, monthlySurcharge: 80, isDefault: false },
  ],
  extraUserPrice: 12,
  modules: [
    { id: "einsatztafel", tier: "standard", title: "Einsatztafel", price: 49, isActive: true, features: [], description: "", iconKey: "a" },
    {
      id: "lager",
      tier: "complex",
      title: "Lager",
      price: 79,
      isActive: true,
      features: [],
      description: "",
      iconKey: "b",
      usage: { unitPrice: 0.5, label: "Artikel", hint: "", sliderMax: 10000, step: 50 },
    },
    { id: "inaktiv", tier: "standard", title: "Stillgelegt", price: 999, isActive: false, features: [], description: "", iconKey: "c" },
  ],
  integrations: [],
  integrationCategories: [],
  texts: {},
} as unknown as PricingConfig;

const basis = {
  id: "pur_test",
  companyId: "cmp_muster",
  config,
  createdAt: "2026-08-06T09:00:00.000Z",
};

/* -------------------------------------------------------- Die Geldrechnung */

// 1. Alle Summanden landen im Monatspreis:
// 390 Paket + (14-10)*12 Zusatzbenutzer + 80 Kapazität + 49+79 Module
// + 2000*0,50 Nutzung = 390 + 48 + 80 + 128 + 1000 = 1646
const voll = purchaseFor({
  ...basis,
  selection: {
    packageId: "professional",
    users: 14,
    capacityId: "gross",
    moduleIds: ["einsatztafel", "lager"],
    usageAmounts: { lager: 2000 },
  },
});
assert.equal(voll.monthlyTotal, 1646, `Monatspreis falsch: ${voll.monthlyTotal}`);

// 2. Die Nutzungsmenge macht hier den Löwenanteil aus – ohne sie wären es 646.
// Genau dieser Summand ginge verloren, wenn usageAmounts nicht durchgereicht wird.
assert.notEqual(voll.monthlyTotal, 646, "Die Nutzungsmenge fehlt im Preis");

// 3. Die Mengen werden mitgeschrieben, sonst ist der Preis später ohne Herkunft.
assert.deepEqual(voll.usageAmounts, { lager: 2000 }, "Die gebuchte Menge muss im Kauf stehen");

// 4. Die Implementierung kommt aus dem gewählten Paket, nicht aus dem Standardpaket.
const starter = purchaseFor({
  ...basis,
  selection: {
    packageId: "starter",
    users: 3,
    capacityId: "klein",
    moduleIds: [],
    usageAmounts: {},
  },
});
assert.equal(starter.implementationPrice, 500);
assert.equal(starter.monthlyTotal, 150, "Ohne Zusätze gilt der reine Paketpreis");

// 5. Ein stillgelegtes Modul kostet nichts – calculatePrice zählt nur isActive.
const mitInaktivem = purchaseFor({
  ...basis,
  selection: {
    packageId: "starter",
    users: 3,
    capacityId: "klein",
    moduleIds: ["inaktiv"],
    usageAmounts: {},
  },
});
assert.equal(mitInaktivem.monthlyTotal, 150, "Ein stillgelegtes Modul darf nicht berechnet werden");

/* ------------------------------------------------------------- Aufräumen */

// 6. Mengen zu nicht gebuchten Modulen fliegen raus.
const fremdeMenge = purchaseFor({
  ...basis,
  selection: {
    packageId: "starter",
    users: 3,
    capacityId: "klein",
    moduleIds: ["einsatztafel"],
    usageAmounts: { lager: 500 },
  },
});
assert.equal(
  fremdeMenge.usageAmounts,
  undefined,
  "Eine Menge zu einem nicht gebuchten Modul gehört nicht in den Kauf",
);

// 7. Ohne Nutzungsmodul bleibt das Feld leer, statt ein leeres Objekt zu speichern.
assert.equal(starter.usageAmounts, undefined);

/* ------------------------------------------------------- Der Kauf selbst */

// 8. Ein frischer Kauf ist offen und trägt noch keine Rückmeldung der App.
assert.equal(voll.status, "offen");
assert.equal(voll.syncedAt, null);
assert.equal(voll.syncError, null);
assert.equal(voll.createdAt, "2026-08-06T09:00:00.000Z");

// 9. Die Auswahl steht unverändert im Kauf – sie ist die Grundlage der Meldung
// an die App.
assert.equal(voll.packageId, "professional");
assert.deepEqual(voll.moduleIds, ["einsatztafel", "lager"]);
assert.equal(voll.users, 14);
assert.equal(voll.capacityId, "gross");

/* ----------------------------------------------------- Zubuchung aus der App */

const zubuchung = addonPurchaseFor({
  id: "pur_zub_abc",
  companyId: "cmp_muster",
  moduleIds: ["lager"],
  usageAmounts: { lager: 2000 },
  config,
  createdAt: "2026-08-06T09:00:00.000Z",
});

// 10. Eine Zubuchung kostet NUR ihre Module plus Nutzung: 79 + 2000*0,50 = 1079.
// Der entscheidende Punkt: KEIN Grundpreis. Wuerde hier calculatePrice benutzt,
// kaemen die 390 des Standardpakets ein zweites Mal obendrauf - der Kunde zahlte
// sein Paket doppelt.
assert.equal(zubuchung.monthlyTotal, 1079, `Zubuchung falsch berechnet: ${zubuchung.monthlyTotal}`);
assert.notEqual(zubuchung.monthlyTotal, 1469, "Der Grundpreis darf in einer Zubuchung nicht auftauchen");

// 11. Sie beansprucht nichts, was zum Grundkauf gehoert.
assert.equal(zubuchung.kind, "zubuchung");
assert.equal(zubuchung.packageId, "");
assert.equal(zubuchung.capacityId, "");
assert.equal(zubuchung.users, 0);
assert.equal(zubuchung.implementationPrice, 0, "Implementierung faellt nur beim Grundkauf an");

// 12. Sie gilt sofort - das Add-on laeuft in der App bereits, wenn die Meldung
// eintrifft. Die Website haelt es fest, sie gibt es nicht frei.
assert.equal(zubuchung.status, "freigegeben");
assert.equal(zubuchung.syncedAt, "2026-08-06T09:00:00.000Z");

// 13. Die Mengen werden auch hier mitgeschrieben.
assert.deepEqual(zubuchung.usageAmounts, { lager: 2000 });

// 14. Ein stillgelegtes Modul kostet nichts und landet nicht im Kauf - sonst
// zahlte der Kunde fuer etwas, das im Katalog nicht mehr angeboten wird.
const mitStillgelegtem = addonPurchaseFor({
  id: "pur_zub_def",
  companyId: "cmp_muster",
  moduleIds: ["inaktiv", "einsatztafel"],
  usageAmounts: {},
  config,
  createdAt: "2026-08-06T09:00:00.000Z",
});
assert.equal(mitStillgelegtem.monthlyTotal, 49, "Nur das aktive Modul zaehlt");
assert.deepEqual(mitStillgelegtem.moduleIds, ["einsatztafel"]);

// 15. Der Grundkauf bleibt davon voellig unberuehrt - er ist eingefroren.
assert.equal(voll.monthlyTotal, 1646, "Eine Zubuchung darf den Grundkauf nicht anfassen");

console.log("purchase.check: alle 15 Pruefungen bestanden");
