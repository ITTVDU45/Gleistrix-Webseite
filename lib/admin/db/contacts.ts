import type { Contact } from "@/types/admin";

import { COLLECTIONS, repository } from "./collections";

/** Kontaktverzeichnis – aus Anfragen übernommen oder manuell gepflegt. */
const contacts = repository<Contact>(COLLECTIONS.contacts, { createdAt: -1 });

export const listContacts = contacts.list;
export const insertContact = contacts.insert;
export const insertContacts = contacts.insertMany;
export const patchContact = contacts.patch;
export const removeContact = contacts.remove;
export const contactsEmpty = contacts.isEmpty;
