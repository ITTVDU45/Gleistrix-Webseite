import type { DemoAccess } from "@/types/admin";

import { COLLECTIONS, repository } from "./collections";

const access = repository<DemoAccess>(COLLECTIONS.demoAccess, { createdAt: -1 });

export const listDemoAccess = access.list;
export const getDemoAccessEntry = access.get;
export const insertDemoAccess = access.insert;
export const insertDemoAccessEntries = access.insertMany;
export const patchDemoAccess = access.patch;
export const demoAccessEmpty = access.isEmpty;
