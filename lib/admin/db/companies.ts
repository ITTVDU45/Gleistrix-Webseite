import type { Company } from "@/types/admin";

import { COLLECTIONS, repository } from "./collections";

const companies = repository<Company>(COLLECTIONS.companies, { createdAt: 1 });

export const listCompanies = companies.list;
export const getCompany = companies.get;
export const insertCompany = companies.insert;
export const insertCompanies = companies.insertMany;
export const patchCompany = companies.patch;
export const companiesEmpty = companies.isEmpty;
