import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { Binary, type Document } from "mongodb";

import { getDb, isMongoConfigured } from "../mongo.ts";

/**
 * Hochgeladene Bilder des Adminbereichs.
 *
 * Die Kennung ist der Inhaltshash plus Endung – damit ist ein Bild unter seiner
 * Adresse unveränderlich (lange Cache-Zeit), zweimal dasselbe Bild belegt nur
 * einmal Platz, und der Content-Type folgt aus der Endung statt aus einem
 * zweiten Feld.
 *
 * Ohne Datenbank landen die Dateien neben dem JSON-Speicher; ausgeliefert wird
 * in beiden Fällen über /api/assets/<id>. Bewusst NICHT nach public/: dort zur
 * Laufzeit geschriebene Dateien überleben kein Deployment.
 */

const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
};

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const COLLECTION = "assets";
const DATA_DIR = process.env.GLEISTRIX_DATA_DIR ?? path.join(process.cwd(), ".data");
const ASSET_DIR = path.join(DATA_DIR, "assets");

type AssetDocument = Document & {
  _id: string;
  data: Binary;
  size: number;
};

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
  return /^[a-f0-9]{32}\.(?:png|jpg|webp|avif)$/.test(id);
}

/**
 * Legt das Bild ab und gibt seine öffentliche Adresse zurück.
 * Gleicher Inhalt ⇒ gleiche Kennung ⇒ kein zweiter Datensatz.
 */
export async function saveImageAsset(
  file: File,
): Promise<{ ok: true; src: string } | { ok: false; error: string }> {
  const extension = extensionFor(file.type);
  if (!extension) return { ok: false, error: "Nur PNG, JPEG, WebP oder AVIF sind erlaubt." };
  if (file.size === 0) return { ok: false, error: "Das Bild ist leer." };
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: "Das Bild ist größer als 4 MB." };

  const bytes = Buffer.from(await file.arrayBuffer());
  // `File.size` kommt aus dem Request. Die tatsächlichen Bytes sind die
  // maßgebliche Grenze, falls ein anderer Aufrufer ein File-artiges Objekt baut.
  if (bytes.length > MAX_IMAGE_BYTES) return { ok: false, error: "Das Bild ist größer als 4 MB." };

  const id = `${createHash("sha256").update(bytes).digest("hex").slice(0, 32)}.${extension}`;

  if (isMongoConfigured()) {
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
