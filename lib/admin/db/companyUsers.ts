import type { CompanyUser } from "@/types/admin";

import { COLLECTIONS, repository } from "./collections";

/** Protokoll der zusätzlich in einen Mandanten eingeladenen Nutzer. */
const companyUsers = repository<CompanyUser>(COLLECTIONS.companyUsers, { invitedAt: -1 });

export const listCompanyUsers = companyUsers.list;
export const getCompanyUser = companyUsers.get;
export const insertCompanyUser = companyUsers.insert;
export const insertCompanyUsers = companyUsers.insertMany;
export const patchCompanyUser = companyUsers.patch;
export const removeCompanyUser = companyUsers.remove;
export const companyUsersEmpty = companyUsers.isEmpty;
