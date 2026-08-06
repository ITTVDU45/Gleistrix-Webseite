import type { Purchase } from "@/types/admin";

import { COLLECTIONS, repository } from "./collections";

const purchases = repository<Purchase>(COLLECTIONS.purchases, { createdAt: -1 });

export const listPurchases = purchases.list;
export const getPurchase = purchases.get;
export const insertPurchase = purchases.insert;
export const insertPurchases = purchases.insertMany;
export const patchPurchase = purchases.patch;
export const purchasesEmpty = purchases.isEmpty;

/** Käufe eines Mandanten – Grundlage für die Meldung an die App. */
export function listPurchasesForCompany(companyId: string): Promise<Purchase[]> {
  return purchases.list({ companyId });
}
