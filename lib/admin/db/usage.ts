import type { Usage } from "@/types/admin";

import { COLLECTIONS, col, fromDoc, type StoredDoc } from "./collections";

/**
 * Verbrauchszahlen je Unternehmen und Monat.
 *
 * Eigene Umsetzung statt `repository()`: Usage hat keine fachliche id, der
 * Schlüssel ist das Paar aus companyId und Monat. Genau das wird zur _id –
 * damit kann derselbe Monat nicht zweimal einlaufen.
 */

function usageId(entry: Usage): string {
  return `${entry.companyId}_${entry.month}`;
}

export async function listUsage(): Promise<Usage[]> {
  const docs = await (await col(COLLECTIONS.usage)).find({}).sort({ month: 1 }).toArray();
  return docs.map((doc) => toUsage(doc));
}

export async function listUsageForCompany(companyId: string): Promise<Usage[]> {
  const docs = await (await col(COLLECTIONS.usage))
    .find({ companyId })
    .sort({ month: 1 })
    .toArray();
  return docs.map((doc) => toUsage(doc));
}

export async function insertUsage(entries: Usage[]): Promise<void> {
  if (entries.length === 0) return;
  await (await col(COLLECTIONS.usage)).insertMany(
    entries.map((entry) => ({ _id: usageId(entry), ...entry })),
  );
}

export async function usageEmpty(): Promise<boolean> {
  return (await (await col(COLLECTIONS.usage)).countDocuments({}, { limit: 1 })) === 0;
}

/** Die _id ist hier ein technischer Zusatz und gehört nicht in den Typ. */
function toUsage(doc: StoredDoc): Usage {
  const { id: _key, ...usage } = fromDoc<Usage & { id: string }>(doc);
  return usage;
}
