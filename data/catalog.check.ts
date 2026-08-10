/**
 * Selbsttest der Katalog-Hilfsfunktionen.
 *
 * Warum es diesen Check gibt: `groupEntries` bestimmt die Spalten des
 * Megamenüs, `relatedEntries` die Verweisleiste am Fuß jeder Detailseite. Beide
 * scheitern nicht mit einer Ausnahme, sondern still – eine verschluckte Spalte
 * oder ein Verweis auf die Seite, auf der man gerade steht, fällt beim
 * Durchklicken kaum auf.
 *
 * Ausführen: `node --experimental-strip-types data/catalog.check.ts`
 */
import assert from "node:assert/strict";

import type { CatalogEntry } from "./catalog.ts";

const { groupEntries, relatedEntries } = await import("./catalog.ts");

/** Minimaler Eintrag – nur die Felder, die die Funktionen anfassen. */
const entry = (slug: string, group: string): CatalogEntry => ({
  slug,
  title: slug,
  tagline: "",
  description: "",
  // Das Icon wird nie gelesen, nur durchgereicht.
  icon: (() => null) as unknown as CatalogEntry["icon"],
  group,
  highlights: [],
  bullets: [],
});

/* ------------------------------------------------------------- Gruppierung */

const mixed = [
  entry("a", "Planung"),
  entry("b", "Abrechnung"),
  entry("c", "Planung"),
  entry("d", "Abrechnung"),
];

const groups = groupEntries(mixed);

assert.equal(groups.length, 2, "Zwei Ueberschriften ergeben zwei Spalten");
assert.deepEqual(
  groups.map((group) => group.heading),
  ["Planung", "Abrechnung"],
  "Die Spaltenfolge richtet sich nach dem ersten Auftreten, nicht nach dem Alphabet",
);
assert.deepEqual(
  groups[0].entries.map((item) => item.slug),
  ["a", "c"],
  "Auch ein spaeter nachgereichter Eintrag landet in seiner Spalte",
);
assert.equal(mixed.length, 4, "Die Eingabeliste bleibt unangetastet");
assert.deepEqual(groupEntries([]), [], "Ein leerer Katalog ergibt keine Spalte");

/* ----------------------------------------------------------- Verweisleiste */

const related = relatedEntries(mixed, "a");

assert.ok(
  !related.some((item) => item.slug === "a"),
  "Die aktuelle Seite darf nicht auf sich selbst verweisen",
);
assert.equal(related[0].slug, "c", "Der Nachbar aus derselben Gruppe steht vorn");
assert.equal(related.length, 3, "Ohne Angabe werden drei Verweise geliefert");
assert.equal(relatedEntries(mixed, "a", 1).length, 1, "Das Limit wird eingehalten");
assert.equal(
  relatedEntries([entry("solo", "Planung")], "solo").length,
  0,
  "Ein einzelner Eintrag erzeugt keine Verweisleiste",
);
assert.equal(
  relatedEntries(mixed, "gibt-es-nicht").length,
  3,
  "Ein unbekannter Slug liefert trotzdem Verweise, statt zu werfen",
);

console.log("catalog.check.ts: alle Zusicherungen erfuellt");
