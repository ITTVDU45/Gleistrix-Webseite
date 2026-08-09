/**
 * Selbsttest für die Objektliste beim Bucket-Abbau.
 *
 * Ausführen: `node lib/admin/provision/minio.check.ts`
 *
 * Warum es diesen Check gibt: `listObjectsQuery` liefert zur Laufzeit ein Feld
 * `versionId`, das der Typ `ObjectInfo` nicht kennt – TypeScript kann hier also
 * nichts absichern. Fällt die versionId weg, schreibt MinIO in einem
 * versionierten Bucket nur einen weiteren Delete-Marker: der Bucket wird nie
 * leer, `removeBucket` scheitert, und der Abbau bricht bei jedem Versuch am
 * Zeitlimit ab. Genau diese Umwandlung pinnt der Check.
 */
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// minio.ts importiert guard.ts ohne Dateiendung und Typen über den @/-Alias.
// Die Endung darf nur für Dateien DIESES Repos ergänzt werden – minio zieht
// CommonJS-Interna mit, die sonst zu „./xyz.ts" würden.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith("@/")) {
      return next(new URL(`../../../${specifier.slice(2)}.ts`, import.meta.url).href, context);
    }
    const eigeneDatei =
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      !specifier.endsWith(".ts") &&
      !context.parentURL?.includes("/node_modules/");
    return next(eigeneDatei ? `${specifier}.ts` : specifier, context);
  },
});

const { entriesFor } = await import("./minio.ts");

// 1. Die versionId bleibt an JEDEM Eintrag. Das ist der eigentliche Zweck.
assert.deepEqual(
  entriesFor([
    { name: "belege/2026/rechnung.pdf", versionId: "v1" },
    { name: "belege/2026/rechnung.pdf", versionId: "v2" },
  ]),
  [
    { name: "belege/2026/rechnung.pdf", versionId: "v1" },
    { name: "belege/2026/rechnung.pdf", versionId: "v2" },
  ],
  "Ohne versionId entsteht nur ein weiterer Delete-Marker statt einer Löschung",
);

// 2. Delete-Marker stehen mit eigener versionId in derselben Liste und müssen
// mit weg – sonst bleibt der Bucket aus Sicht von removeBucket nicht leer.
assert.deepEqual(
  entriesFor([{ name: "alt.txt", versionId: "v9", isDeleteMarker: true }]),
  [{ name: "alt.txt", versionId: "v9" }],
  "Ein Delete-Marker ist ein zu löschender Eintrag",
);

// 3. Verzeichnis-Präfixe kommen ohne `name` und dürfen nicht in die Löschliste.
// Ein Eintrag ohne Namen brächte removeObjects durcheinander.
assert.deepEqual(
  entriesFor([
    { prefix: "belege/", size: 0 },
    { name: "datei.txt", versionId: "v1" },
  ]),
  [{ name: "datei.txt", versionId: "v1" }],
  "CommonPrefixes sind keine Objekte",
);

// 4. Ein unversionierter Bucket liefert keine versionId – dann darf auch keine
// im Eintrag stehen, sonst lehnt MinIO die Löschung ab.
assert.deepEqual(
  entriesFor([{ name: "ohne-version.txt" }]),
  [{ name: "ohne-version.txt" }],
  "Ohne Versionierung darf kein versionId-Feld erfunden werden",
);

// 5. Eine leere Seite beendet die Schleife, statt sie stolpern zu lassen.
assert.deepEqual(entriesFor([]), []);

// 6. Kaputte Einträge fliegen raus, statt den ganzen Abbau zu werfen.
assert.deepEqual(entriesFor([null, undefined, { name: 42 }, { name: "gut.txt" }]), [
  { name: "gut.txt" },
]);

console.log("provision/minio.check: alle 6 Pruefungen bestanden");
