import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { Binary, type Document } from "mongodb";

import { COLLECTIONS } from "../db/collections";
import { getDb, isMongoConfigured } from "../mongo";

/**
 * Ablage für hochgeladene Quelldokumente des Blog-Agenten.
 *
 * Aufbau wie lib/admin/db/assets.ts – Inhaltshash als Kennung, MongoDB oder
 * Dateisystem –, aber bewusst eine eigene Ablage: Assets werden über
 * /api/assets/<id> öffentlich ausgeliefert. Ein hochgeladenes Angebot oder ein
 * internes Protokoll darf nicht unter einer erratbaren Adresse im Netz stehen.
 * Diese Dateien verlassen den Server nur in Richtung KI-Anbieter.
 *
 * PDF ist das einzige Binärformat: Textdateien werden schon beim Hochladen
 * ausgelesen und landen direkt im Quelldatensatz, ein Format wie .docx kann das
 * Modell nicht lesen. Für Word-Dateien bleibt der Weg über PDF oder Einfügen.
 */

export const MAX_SOURCE_BYTES = 8 * 1024 * 1024;

/** Das einzige Binärformat, das direkt zur KI geht. */
export const PDF_TYPE = "application/pdf";

/** Formate, die beim Hochladen als Text ausgelesen werden. */
export function isTextUpload(type: string): boolean {
  return type.startsWith("text/") || type === "application/json";
}

const DATA_DIR = process.env.GLEISTRIX_DATA_DIR ?? path.join(process.cwd(), ".data");
const FILE_DIR = path.join(DATA_DIR, "blog-files");

type FileDocument = Document & { _id: string; data: Binary; size: number };

/** Verhindert, dass eine manipulierte Kennung aus dem Verzeichnis führt. */
function isSafeId(id: string): boolean {
  return /^[a-f0-9]{32}$/.test(id);
}

export async function saveSourceFile(bytes: Buffer): Promise<string> {
  const id = createHash("sha256").update(bytes).digest("hex").slice(0, 32);

  if (isMongoConfigured()) {
    const collection = (await getDb()).collection<FileDocument>(COLLECTIONS.blogFiles);
    await collection.updateOne(
      { _id: id },
      { $setOnInsert: { data: new Binary(bytes), size: bytes.length } },
      { upsert: true },
    );
  } else {
    await fs.mkdir(FILE_DIR, { recursive: true });
    await fs.writeFile(path.join(FILE_DIR, id), bytes);
  }

  return id;
}

export async function readSourceFile(id: string): Promise<Buffer | null> {
  if (!isSafeId(id)) return null;

  if (isMongoConfigured()) {
    const collection = (await getDb()).collection<FileDocument>(COLLECTIONS.blogFiles);
    const doc = await collection.findOne({ _id: id });
    return doc ? Buffer.from(doc.data.value()) : null;
  }

  try {
    return await fs.readFile(path.join(FILE_DIR, id));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

/**
 * Löschen ist bewusst folgenlos, wenn die Datei fehlt: die Kennung ist der
 * Inhaltshash, dieselbe Datei kann an mehreren Quellen hängen.
 */
export async function deleteSourceFile(id: string): Promise<void> {
  if (!isSafeId(id)) return;

  if (isMongoConfigured()) {
    await (await getDb()).collection<FileDocument>(COLLECTIONS.blogFiles).deleteOne({ _id: id });
    return;
  }

  await fs.rm(path.join(FILE_DIR, id), { force: true });
}
