/**
 * Selbsttest für die Ablage des Modul-Karussells.
 *
 * Warum es diesen Check gibt: Die Startseite liest ihre Module aus dem Store,
 * fällt bei leerer Ablage aber auf den Auslieferungszustand zurück. Genau daran
 * hängen zwei Fehler, die man nicht sofort sieht – eine leere Modul-Sektion auf
 * der Startseite, und eine gespeicherte Reihenfolge, die beim Lesen wieder in
 * die Ausgangsfolge kippt.
 *
 * Läuft gegen den Dateispeicher in einem Wegwerf-Verzeichnis, nie gegen eine
 * Datenbank.
 *
 * Ausführen: `node lib/admin/landing-modules.check.ts`
 */
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { registerHooks } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";

// Wie in purchase.check.ts: der @/-Alias und endungslose Pfade sind für den
// Bundler richtig, für ein nacktes `node` aber nicht auflösbar.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith("@/")) {
      return next(new URL(`../../${specifier.slice(2)}.ts`, import.meta.url).href, context);
    }
    // Nur Projektdateien: mongodb lädt intern ebenfalls relativ ("./admin"),
    // dort wäre die angehängte Endung falsch.
    const relative = specifier.startsWith("./") || specifier.startsWith("../");
    const fromProject = !context.parentURL?.includes("/node_modules/");
    return next(
      relative && fromProject && !specifier.endsWith(".ts") ? `${specifier}.ts` : specifier,
      context,
    );
  },
});

const dataDir = await mkdtemp(path.join(tmpdir(), "gleistrix-landing-"));
process.env.GLEISTRIX_DATA_DIR = dataDir;
// Der Check darf unter keinen Umständen an einer echten Datenbank landen.
delete process.env.MONGODB_URI;
delete process.env.MONGODB_HOST;

try {
  const { DEFAULT_LANDING_MODULES } = await import("../../data/landingModules.ts");
  const { getLandingModules, saveLandingModules } = await import("./landing-modules.ts");

  // 1. Leere Ablage ⇒ Auslieferungszustand. Ohne diesen Rückfall stünde auf der
  // Startseite vor der ersten Pflege gar kein Modul.
  const initial = await getLandingModules();
  assert.deepEqual(
    initial.map((module) => module.id),
    DEFAULT_LANDING_MODULES.map((module) => module.id),
    "Ohne gepflegten Stand muss der Auslieferungszustand kommen",
  );

  // 2. Reihenfolge ist die Listenreihenfolge – umgedreht gespeichert, umgedreht
  // gelesen. Ein Sortierfeld, das beim Lesen wieder greift, fiele hier auf.
  const reversed = [...initial].reverse();
  await saveLandingModules(reversed);
  assert.deepEqual(
    (await getLandingModules()).map((module) => module.id),
    reversed.map((module) => module.id),
    "Die gespeicherte Reihenfolge muss erhalten bleiben",
  );

  // 3. Inhaltliche Änderung kommt vollständig zurück, auch das optionale Bild.
  const edited = reversed.map((module, index) =>
    index === 0 ? { ...module, title: "Neuer Titel", imageSrc: "/api/assets/abc.png" } : module,
  );
  await saveLandingModules(edited);
  const stored = await getLandingModules();
  assert.equal(stored[0].title, "Neuer Titel");
  assert.equal(stored[0].imageSrc, "/api/assets/abc.png");

  // 4. Alles gelöscht ⇒ wieder Auslieferungszustand statt leerer Sektion.
  await saveLandingModules([]);
  assert.equal((await getLandingModules()).length, DEFAULT_LANDING_MODULES.length);

  console.log("landing-modules.check: alle Prüfungen bestanden");
} finally {
  await rm(dataDir, { recursive: true, force: true });
}
