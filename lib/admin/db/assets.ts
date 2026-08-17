import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { Binary, type Document } from "mongodb";

import { getDb, isMongoConfigured } from "../mongo.ts";
import { minioClient, minioIssue } from "../provision/minio.ts";

/**
 * Hochgeladene Bilder des Adminbereichs.
 *
 * Die Kennung ist der Inhaltshash plus Endung – damit ist ein Bild unter seiner
 * Adresse unveränderlich (lange Cache-Zeit), zweimal dasselbe Bild belegt nur
 * einmal Platz, und der Content-Type folgt aus der Endung statt aus einem
 * zweiten Feld.
 *
 * Drei Ablagen in dieser Reihenfolge: MinIO, sonst MongoDB, sonst neben dem
 * JSON-Speicher. Ausgeliefert wird in allen Fällen über /api/assets/<id> –
 * bewusst NICHT nach public/: dort zur Laufzeit geschriebene Dateien überleben
 * kein Deployment.
 *
 * Gelesen wird in derselben Reihenfolge, aber ohne Abbruch: Bilder, die vor der
 * MinIO-Umstellung in MongoDB gelandet sind, bleiben unter ihrer Adresse
 * erreichbar. Der Bucket bleibt privat – wie die Mandanten-Buckets bekommt er
 * keine Policy, die Route ist der einzige Weg nach draußen.
 */

const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
};

/**
 * SVG ist ausführbar: ein `<script>` darin liefe bei direktem Aufruf von
 * /api/assets/<id>.svg in unserer eigenen Origin – mit Zugriff auf die
 * Admin-Session. Im `<img>`-Tag der Preisseite passiert das nie, aber die
 * Adresse ist öffentlich und aufrufbar.
 *
 * Deshalb geht jedes SVG nur mit dieser Kopfzeile raus. `sandbox` ohne Wert
 * setzt das Dokument in eine eigene Origin und schaltet Skripte ab;
 * `style-src 'unsafe-inline'` und `img-src data:` bleiben offen, weil viele
 * Logos ihre Farben in einem inline-<style> oder eingebettete Rasterbilder
 * mitbringen und sonst kaputt aussähen.
 *
 * ponytail: Kopfzeile statt Sanitizer. Ein Sanitizer bräuchte DOMPurify plus
 * jsdom im Serverbündel, und eine selbstgebaute Filterliste („kein <script>,
 * kein onload=") würde nur so lange halten, bis jemand die nächste Variante
 * findet. Die CSP schließt den Weg unabhängig vom Inhalt der Datei.
 */
export const SVG_SECURITY_POLICY =
  "default-src 'none'; style-src 'unsafe-inline'; img-src data:; sandbox";

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const COLLECTION = "assets";
const DATA_DIR = process.env.GLEISTRIX_DATA_DIR ?? path.join(process.cwd(), ".data");
const ASSET_DIR = path.join(DATA_DIR, "assets");

type AssetDocument = Document & {
  _id: string;
  data: Binary;
  size: number;
};

/* -------------------------------------------------------------------- MinIO */

/**
 * Bucket der Website – bewusst getrennt von den Mandanten-Buckets
 * (gleistrix-<kennung>). Hier liegen Bilder der öffentlichen Seite, dort
 * Kundendaten; ein gemeinsamer Bucket würde beides vermischen.
 */
const ASSET_BUCKET = process.env.MINIO_BUCKET?.trim() || "gleistrix-web";

/** Ein hängender Speicher darf die Server Action nicht endlos blockieren. */
const MINIO_TIMEOUT_MS = 10_000;

function isMinioConfigured(): boolean {
  return minioIssue() === null;
}

function withTimeout<T>(task: Promise<T>, label: string): Promise<T> {
  return Promise.race([
    task,
    new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `${label}: MinIO hat nicht innerhalb von ${MINIO_TIMEOUT_MS / 1000} Sekunden geantwortet.`,
            ),
          ),
        MINIO_TIMEOUT_MS,
      ),
    ),
  ]);
}

/**
 * Legt den Bucket beim ersten Schreibzugriff an; danach kostet der Aufruf
 * nichts mehr. Ein gescheiterter Versuch darf sich nicht als „erledigt"
 * festsetzen – sonst liefe jeder weitere Upload in denselben Fehler, ohne es
 * noch einmal zu versuchen.
 */
let bucketReady: Promise<void> | null = null;

function ensureAssetBucket(): Promise<void> {
  bucketReady ??= (async () => {
    const minio = minioClient();
    if (await withTimeout(minio.bucketExists(ASSET_BUCKET), "Bucket-Prüfung")) return;
    try {
      await withTimeout(minio.makeBucket(ASSET_BUCKET), "Bucket-Anlage");
    } catch (error) {
      // Zwischen Prüfung und Anlage kann ein zweiter Prozess zuvorgekommen
      // sein. Nur der eigene Bucket zählt als erledigt.
      if ((error as { code?: unknown } | null)?.code !== "BucketAlreadyOwnedByYou") throw error;
    }
  })().catch((error: unknown) => {
    bucketReady = null;
    throw error;
  });

  return bucketReady;
}

/** Fehlt das Objekt (oder der ganze Bucket), gilt das nicht als Fehler – dann übernimmt die nächste Ablage. */
function isMissing(error: unknown): boolean {
  const code = (error as { code?: unknown } | null)?.code;
  return code === "NoSuchKey" || code === "NotFound" || code === "NoSuchBucket";
}

async function readFromMinio(id: string): Promise<Buffer | null> {
  try {
    const stream = await withTimeout(minioClient().getObject(ASSET_BUCKET, id), "Bild lesen");
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(chunk as Buffer);
    return Buffer.concat(chunks);
  } catch (error) {
    if (isMissing(error)) return null;
    throw error;
  }
}

/** Kennung → Content-Type. Unbekannte Endung ⇒ nichts, was wir ausliefern. */
export function assetContentType(id: string): string | null {
  if (!isSafeId(id)) return null;
  return MIME[id.split(".").pop()?.toLowerCase() ?? ""] ?? null;
}

function extensionFor(contentType: string): string | null {
  return Object.keys(MIME).find((key) => MIME[key] === contentType) ?? null;
}

/** Verhindert, dass eine manipulierte Kennung aus dem Asset-Verzeichnis führt. */
function isSafeId(id: string): boolean {
  return /^[a-f0-9]{32}\.(?:png|jpg|webp|avif|svg)$/.test(id);
}

/**
 * Legt das Bild ab und gibt seine öffentliche Adresse zurück.
 * Gleicher Inhalt ⇒ gleiche Kennung ⇒ kein zweiter Datensatz.
 */
export async function saveImageAsset(
  file: File,
): Promise<{ ok: true; src: string } | { ok: false; error: string }> {
  const extension = extensionFor(file.type);
  if (!extension) return { ok: false, error: "Nur PNG, JPEG, WebP, AVIF oder SVG sind erlaubt." };
  if (file.size === 0) return { ok: false, error: "Das Bild ist leer." };
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: "Das Bild ist größer als 4 MB." };

  const bytes = Buffer.from(await file.arrayBuffer());
  // `File.size` kommt aus dem Request. Die tatsächlichen Bytes sind die
  // maßgebliche Grenze, falls ein anderer Aufrufer ein File-artiges Objekt baut.
  if (bytes.length > MAX_IMAGE_BYTES) return { ok: false, error: "Das Bild ist größer als 4 MB." };

  const id = `${createHash("sha256").update(bytes).digest("hex").slice(0, 32)}.${extension}`;

  if (isMinioConfigured()) {
    await ensureAssetBucket();
    // Gleiche Kennung ⇒ gleicher Inhalt: ein zweiter Upload schreibt dieselben
    // Bytes noch einmal. Ein vorheriges statObject würde das nur teurer machen.
    await withTimeout(
      minioClient().putObject(ASSET_BUCKET, id, bytes, bytes.length, {
        "Content-Type": MIME[extension],
      }),
      "Bild speichern",
    );
  } else if (isMongoConfigured()) {
    const collection = (await getDb()).collection<AssetDocument>(COLLECTION);
    await collection.updateOne(
      { _id: id },
      { $setOnInsert: { data: new Binary(bytes), size: bytes.length } },
      { upsert: true },
    );
  } else {
    await fs.mkdir(ASSET_DIR, { recursive: true });
    await fs.writeFile(path.join(ASSET_DIR, id), bytes);
  }

  return { ok: true, src: `/api/assets/${id}` };
}

export async function readImageAsset(id: string): Promise<Buffer | null> {
  if (!isSafeId(id)) return null;

  // Kein `else`: Bilder aus der Zeit vor MinIO liegen weiter in MongoDB und
  // müssen unter derselben Adresse erreichbar bleiben.
  if (isMinioConfigured()) {
    const bytes = await readFromMinio(id);
    if (bytes) return bytes;
  }

  if (isMongoConfigured()) {
    const collection = (await getDb()).collection<AssetDocument>(COLLECTION);
    const doc = await collection.findOne({ _id: id });
    return doc ? Buffer.from(doc.data.value()) : null;
  }

  try {
    return await fs.readFile(path.join(ASSET_DIR, id));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
