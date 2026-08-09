import type { Lead } from "@/types/admin";

import { COLLECTIONS, repository } from "./collections";

/** Neueste Anfrage zuerst – der Superadmin arbeitet den Eingang von oben ab. */
const leads = repository<Lead>(COLLECTIONS.leads, { createdAt: -1 });

export const listLeads = leads.list;
export const getLead = leads.get;
export const insertLead = leads.insert;
export const insertLeads = leads.insertMany;
export const patchLead = leads.patch;
export const removeLead = leads.remove;
export const leadsEmpty = leads.isEmpty;
