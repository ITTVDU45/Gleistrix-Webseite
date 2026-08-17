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
import { registerHooks } from "node:module";
import os from "node:os";
import path from "node:path";

// assets.ts zieht über provision/minio.ts Dateien ohne Endung und Typen über
// den @/-Alias nach; node löst beides von sich aus nicht auf. Die Endung darf
// nur für Dateien DIESES Repos ergänzt werden – minio bringt CommonJS-Interna
// mit, die sonst zu „./xyz.ts" würden. (Gleiche Auflösung wie in
// provision/minio.check.ts.)
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

const dir = await fs.mkdtemp(path.join(os.tmpdir(), "gleistrix-assets-"));
process.env.GLEISTRIX_DATA_DIR = dir;
delete process.env.MONGODB_URI;
delete process.env.MONGODB_HOST;

// Ohne Netz: sonst liefe der Check je nach lokaler .env gegen einen echten
// MinIO und hinterließe dort Testbilder.
delete process.env.MINIO_ENDPOINT;
delete process.env.MINIO_ACCESS_KEY;
delete process.env.MINIO_SECRET_KEY;

const {
  MAX_IMAGE_BYTES,
  SVG_SECURITY_POLICY,
  assetContentType,
  readImageAsset,
  saveImageAsset,
} = await import("./assets.ts");

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

// SVG ist erlaubt – aber nur, solange die Auslieferung es einsperrt. Ein SVG
// same-origin ohne diese Kopfzeile wäre ausführbares Dokument mit Zugriff auf
// die Admin-Session; deshalb hängen Annahme und Policy hier zusammen an einem
// Test. Wer die Policy entfernt, bricht ihn.
const svg = await saveImageAsset(
  new File(['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>'], "logo.svg", {
    type: "image/svg+xml",
  }),
);
assert.equal(svg.ok, true, "SVG muss angenommen werden");
if (!svg.ok) process.exit(1);
assert.match(svg.src, /^\/api\/assets\/[a-f0-9]{32}\.svg$/);
assert.equal(assetContentType(svg.src.replace("/api/assets/", "")), "image/svg+xml");
assert.match(SVG_SECURITY_POLICY, /(^|;)\s*sandbox\s*$/, "SVG muss in die Sandbox");
assert.match(SVG_SECURITY_POLICY, /default-src 'none'/, "SVG darf nichts nachladen");

// Skripte bleiben trotzdem draußen: kein anderer Typ als die fünf erlaubten.
const html = await saveImageAsset(new File(["<h1>x</h1>"], "x.html", { type: "text/html" }));
assert.equal(html.ok, false, "HTML darf nicht angenommen werden");

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
