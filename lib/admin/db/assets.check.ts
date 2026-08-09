/**
 * Selbsttest für den Bild-Upload.
 *
 * Ausführen: `node lib/admin/db/assets.check.ts`
 *
 * Warum es diesen Check gibt: die Kennung eines Assets ist zugleich Dateiname,
 * Cache-Schlüssel und Content-Type-Quelle. Bricht eines davon – etwa weil die
 * Endung nicht mehr an der Kennung hängt oder die Pfadprüfung durchlässig wird –
 * liefert /api/assets entweder nichts mehr aus oder Dateien außerhalb des
 * Asset-Verzeichnisses.
 */
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const dir = await fs.mkdtemp(path.join(os.tmpdir(), "gleistrix-assets-"));
process.env.GLEISTRIX_DATA_DIR = dir;
delete process.env.MONGODB_URI;
delete process.env.MONGODB_HOST;

const { MAX_IMAGE_BYTES, assetContentType, readImageAsset, saveImageAsset } = await import(
  "./assets.ts"
);

/** Kleinstmögliches gültiges PNG – der Inhalt ist egal, es geht um den Rundlauf. */
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

const stored = await saveImageAsset(
  new File([new Uint8Array(PNG)], "bild.png", { type: "image/png" }),
);
assert.equal(stored.ok, true, "PNG muss angenommen werden");
if (!stored.ok) process.exit(1);

const id = stored.src.replace("/api/assets/", "");
assert.match(id, /^[a-f0-9]{32}\.png$/, "Kennung ist Inhaltshash plus Endung");
assert.equal(assetContentType(id), "image/png");
assert.equal(assetContentType(`x${id}`), null, "nur vollständige Asset-Kennungen sind gültig");

// Rundlauf: was gespeichert wurde, kommt unverändert zurück.
const read = await readImageAsset(id);
assert.ok(read, "gespeichertes Bild muss lesbar sein");
assert.deepEqual(read, PNG, "Bytes dürfen sich nicht verändern");

// Gleicher Inhalt ⇒ gleiche Adresse, kein zweiter Datensatz.
const again = await saveImageAsset(
  new File([new Uint8Array(PNG)], "kopie.png", { type: "image/png" }),
);
assert.equal(again.ok && again.src, stored.src, "identisches Bild behält seine Adresse");
assert.equal((await fs.readdir(path.join(dir, "assets"))).length, 1);

// SVG bliebe same-origin ausführbar und ist deshalb gesperrt.
const svg = await saveImageAsset(new File(["<svg/>"], "x.svg", { type: "image/svg+xml" }));
assert.equal(svg.ok, false, "SVG darf nicht angenommen werden");

const empty = await saveImageAsset(new File([], "leer.png", { type: "image/png" }));
assert.equal(empty.ok, false, "leere Dateien dürfen nicht angenommen werden");

const tooLarge = await saveImageAsset(
  new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], "zu-gross.png", { type: "image/png" }),
);
assert.equal(tooLarge.ok, false, "Dateien über 4 MB dürfen nicht angenommen werden");

// Pfadtraversal darf nicht aus dem Asset-Verzeichnis führen.
assert.equal(await readImageAsset("../../admin-store.json"), null);
assert.equal(await readImageAsset("nicht-existent.png"), null);
assert.equal(assetContentType("skript.js"), null);

await fs.rm(dir, { recursive: true, force: true });
console.log("assets.check.ts: alle Prüfungen bestanden");
