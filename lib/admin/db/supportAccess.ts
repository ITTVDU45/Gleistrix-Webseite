import type { SupportAccess } from "@/types/admin";

import { COLLECTIONS, repository } from "./collections";

const access = repository<SupportAccess>(COLLECTIONS.supportAccess, { createdAt: -1 });

export const insertSupportAccess = access.insert;
export const insertSupportAccessEntries = access.insertMany;
export const supportAccessEmpty = access.isEmpty;

/** Protokoll aller Support-Zugriffe, optional auf ein Unternehmen eingegrenzt. */
export function listSupportAccess(companyId?: string): Promise<SupportAccess[]> {
  return access.list(companyId ? { companyId } : {});
}
