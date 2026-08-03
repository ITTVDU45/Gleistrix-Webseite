import type { Package } from "@/types/admin";

import { COLLECTIONS, repository } from "./collections";

/**
 * Mandanten-Pakete der Provisionierung – nicht zu verwechseln mit den
 * PricingPackages der öffentlichen Preisseite (db/pricing.ts).
 */
const packages = repository<Package>(COLLECTIONS.tenantPackages, { createdAt: 1 });

export const listPackages = packages.list;
export const getPackage = packages.get;
export const insertPackage = packages.insert;
export const insertPackages = packages.insertMany;
export const patchPackage = packages.patch;
export const packagesEmpty = packages.isEmpty;
