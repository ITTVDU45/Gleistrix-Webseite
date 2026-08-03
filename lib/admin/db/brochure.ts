import type { BrochureRequest } from "@/types/admin";

import { COLLECTIONS, repository } from "./collections";

const requests = repository<BrochureRequest>(COLLECTIONS.brochureRequests, { createdAt: -1 });

export const listBrochureRequests = requests.list;
export const getBrochureRequest = requests.get;
export const insertBrochureRequest = requests.insert;
export const insertBrochureRequests = requests.insertMany;
export const patchBrochureRequest = requests.patch;
export const brochureRequestsEmpty = requests.isEmpty;
