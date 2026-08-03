import type {
  AdminStore,
  BrochureRequest,
  Company,
  Contact,
  DemoAccess,
  Lead,
  Package,
  SupportAccess,
  Usage,
} from "@/types/admin";

import { bootstrap } from "./db/bootstrap";
import * as brochureDb from "./db/brochure";
import * as companiesDb from "./db/companies";
import * as contactsDb from "./db/contacts";
import * as demoDb from "./db/demoAccess";
import { patchFileStore, readFileStore } from "./db/file-store";
import * as leadsDb from "./db/leads";
import * as supportDb from "./db/supportAccess";
import * as packagesDb from "./db/tenantPackages";
import * as usageDb from "./db/usage";
import { isMongoConfigured } from "./mongo";

/**
 * Zugriff auf den Stand des Superadmin-Bereichs.
 *
 * Gegen MongoDB liegt jede Entität in einer eigenen Collection (lib/admin/db).
 * Dieses Modul ist nur noch die Fassade davor: es entscheidet je Funktion
 * einmal zwischen Datenbank und Dateispeicher und delegiert an die
 * Repositories.
 *
 * Ein Gesamtschreibvorgang (früher writeStore) gibt es nicht mehr – er hätte
 * bei zwei gleichzeitigen Bearbeitern jeweils die Arbeit des anderen verworfen.
 * Geschrieben wird immer nur das eine Dokument, das sich ändert.
 */

/** Für Mongo-Zugriffe: Migration und Indizes müssen vorher gelaufen sein. */
async function ready(): Promise<void> {
  await bootstrap();
}

/**
 * Gesamtstand für Übersichtsseiten.
 *
 * Alle Collections parallel – die Seiten brauchen mehrere davon gleichzeitig,
 * nacheinander wäre es die Summe der Latenzen.
 *
 * Gegen MongoDB wird bewusst NICHT zwischengespeichert: mehrere Instanzen
 * hätten sonst je einen eigenen Stand.
 */
export async function readStore(): Promise<AdminStore> {
  if (!isMongoConfigured()) return readFileStore();
  await ready();

  const [companies, packages, usage, supportAccess, leads, contacts, brochureRequests, demoAccess] =
    await Promise.all([
      companiesDb.listCompanies(),
      packagesDb.listPackages(),
      usageDb.listUsage(),
      supportDb.listSupportAccess(),
      leadsDb.listLeads(),
      contactsDb.listContacts(),
      brochureDb.listBrochureRequests(),
      demoDb.listDemoAccess(),
    ]);

  return { companies, packages, usage, supportAccess, leads, contacts, brochureRequests, demoAccess };
}

/* --------------------------------------------------------------- Unternehmen */

/** Ersetzt ein Unternehmen unveränderlich. */
export async function updateCompany(
  id: string,
  patch: (company: Company) => Company,
): Promise<Company | null> {
  if (isMongoConfigured()) {
    await ready();
    return companiesDb.patchCompany(id, patch);
  }

  return patchFileStore((store) => {
    const current = store.companies.find((c) => c.id === id);
    if (!current) return { next: store, result: null };

    const updated = patch(current);
    return {
      next: { ...store, companies: store.companies.map((c) => (c.id === id ? updated : c)) },
      result: updated,
    };
  });
}

export async function insertCompany(company: Company): Promise<void> {
  if (isMongoConfigured()) {
    await ready();
    return companiesDb.insertCompany(company);
  }

  await patchFileStore((store) => ({
    next: { ...store, companies: [...store.companies, company] },
    result: undefined,
  }));
}

export async function getCompany(id: string): Promise<Company | null> {
  if (isMongoConfigured()) {
    await ready();
    return companiesDb.getCompany(id);
  }

  const store = await readFileStore();
  return store.companies.find((c) => c.id === id) ?? null;
}

/* -------------------------------------------------------- Mandanten-Pakete */

/** Ersetzt ein Paket unveränderlich. */
export async function updatePackage(
  id: string,
  patch: (pkg: Package) => Package,
): Promise<Package | null> {
  if (isMongoConfigured()) {
    await ready();
    return packagesDb.patchPackage(id, patch);
  }

  return patchFileStore((store) => {
    const current = store.packages.find((p) => p.id === id);
    if (!current) return { next: store, result: null };

    const updated = patch(current);
    return {
      next: { ...store, packages: store.packages.map((p) => (p.id === id ? updated : p)) },
      result: updated,
    };
  });
}

export async function insertPackage(pkg: Package): Promise<void> {
  if (isMongoConfigured()) {
    await ready();
    return packagesDb.insertPackage(pkg);
  }

  await patchFileStore((store) => ({
    next: { ...store, packages: [...store.packages, pkg] },
    result: undefined,
  }));
}

export async function getPackage(id: string | null): Promise<Package | null> {
  if (!id) return null;
  if (isMongoConfigured()) {
    await ready();
    return packagesDb.getPackage(id);
  }

  const store = await readFileStore();
  return store.packages.find((p) => p.id === id) ?? null;
}

/* ------------------------------------------------------------ Supportzugriff */

/** Hält jeden Support-Zugriff fest; neueste Einträge zuerst. */
export async function recordSupportAccess(
  entry: Omit<SupportAccess, "id" | "createdAt">,
): Promise<void> {
  const record: SupportAccess = {
    ...entry,
    id: `sup_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    await ready();
    return supportDb.insertSupportAccess(record);
  }

  await patchFileStore((store) => ({
    // Ohne Datenbank begrenzt: die Datei wird bei jedem Schreibvorgang komplett
    // serialisiert. Gegen MongoDB gibt es die Grenze nicht mehr.
    next: { ...store, supportAccess: [record, ...store.supportAccess].slice(0, 500) },
    result: undefined,
  }));
}

export async function getSupportAccess(companyId?: string): Promise<SupportAccess[]> {
  if (isMongoConfigured()) {
    await ready();
    return supportDb.listSupportAccess(companyId);
  }

  const store = await readFileStore();
  return companyId
    ? store.supportAccess.filter((entry) => entry.companyId === companyId)
    : store.supportAccess;
}

/* ----------------------------------------------------------------- Anfragen */

/** Neueste Anfrage zuerst – der Superadmin arbeitet den Eingang von oben ab. */
export async function getLeads(): Promise<Lead[]> {
  if (isMongoConfigured()) {
    await ready();
    return leadsDb.listLeads();
  }

  const store = await readFileStore();
  return [...store.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getLead(id: string): Promise<Lead | null> {
  if (isMongoConfigured()) {
    await ready();
    return leadsDb.getLead(id);
  }

  const store = await readFileStore();
  return store.leads.find((lead) => lead.id === id) ?? null;
}

export async function insertLead(lead: Lead): Promise<void> {
  if (isMongoConfigured()) {
    await ready();
    return leadsDb.insertLead(lead);
  }

  await patchFileStore((store) => ({
    next: { ...store, leads: [lead, ...store.leads] },
    result: undefined,
  }));
}

export async function updateLead(
  id: string,
  patch: (lead: Lead) => Lead,
): Promise<Lead | null> {
  if (isMongoConfigured()) {
    await ready();
    return leadsDb.patchLead(id, patch);
  }

  return patchFileStore((store) => {
    const current = store.leads.find((lead) => lead.id === id);
    if (!current) return { next: store, result: null };

    const updated = patch(current);
    return {
      next: { ...store, leads: store.leads.map((lead) => (lead.id === id ? updated : lead)) },
      result: updated,
    };
  });
}

/* ----------------------------------------------------------------- Kontakte */

export async function listContacts(): Promise<Contact[]> {
  if (isMongoConfigured()) {
    await ready();
    return contactsDb.listContacts();
  }

  const store = await readFileStore();
  return [...store.contacts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function insertContact(contact: Contact): Promise<void> {
  if (isMongoConfigured()) {
    await ready();
    return contactsDb.insertContact(contact);
  }

  await patchFileStore((store) => ({
    next: { ...store, contacts: [contact, ...store.contacts] },
    result: undefined,
  }));
}

export async function updateContact(
  id: string,
  patch: (contact: Contact) => Contact,
): Promise<Contact | null> {
  if (isMongoConfigured()) {
    await ready();
    return contactsDb.patchContact(id, patch);
  }

  return patchFileStore((store) => {
    const current = store.contacts.find((contact) => contact.id === id);
    if (!current) return { next: store, result: null };

    const updated = patch(current);
    return {
      next: {
        ...store,
        contacts: store.contacts.map((contact) => (contact.id === id ? updated : contact)),
      },
      result: updated,
    };
  });
}

export async function deleteContact(id: string): Promise<void> {
  if (isMongoConfigured()) {
    await ready();
    return contactsDb.removeContact(id);
  }

  await patchFileStore((store) => ({
    next: { ...store, contacts: store.contacts.filter((contact) => contact.id !== id) },
    result: undefined,
  }));
}

/* ---------------------------------------------------------------- Broschüre */

export async function getBrochureRequests(): Promise<BrochureRequest[]> {
  if (isMongoConfigured()) {
    await ready();
    return brochureDb.listBrochureRequests();
  }

  const store = await readFileStore();
  return [...store.brochureRequests].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function insertBrochureRequest(request: BrochureRequest): Promise<void> {
  if (isMongoConfigured()) {
    await ready();
    return brochureDb.insertBrochureRequest(request);
  }

  await patchFileStore((store) => ({
    next: { ...store, brochureRequests: [request, ...store.brochureRequests] },
    result: undefined,
  }));
}

/** Versandstatus umschalten – das Versenden selbst passiert außerhalb. */
export async function setBrochureSent(id: string, sent: boolean): Promise<void> {
  const apply = (request: BrochureRequest): BrochureRequest => ({
    ...request,
    sentAt: sent ? new Date().toISOString() : undefined,
  });

  if (isMongoConfigured()) {
    await ready();
    await brochureDb.patchBrochureRequest(id, apply);
    return;
  }

  await patchFileStore((store) => ({
    next: {
      ...store,
      brochureRequests: store.brochureRequests.map((request) =>
        request.id === id ? apply(request) : request,
      ),
    },
    result: undefined,
  }));
}

/* -------------------------------------------------------------- Demo-Zugang */

export async function getDemoAccess(): Promise<DemoAccess[]> {
  if (isMongoConfigured()) {
    await ready();
    return demoDb.listDemoAccess();
  }

  const store = await readFileStore();
  return [...store.demoAccess].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addDemoAccess(entry: DemoAccess): Promise<void> {
  if (isMongoConfigured()) {
    await ready();
    return demoDb.insertDemoAccess(entry);
  }

  await patchFileStore((store) => ({
    next: { ...store, demoAccess: [entry, ...store.demoAccess].slice(0, 500) },
    result: undefined,
  }));
}

export async function updateDemoAccess(
  id: string,
  patch: (access: DemoAccess) => DemoAccess,
): Promise<DemoAccess | null> {
  if (isMongoConfigured()) {
    await ready();
    return demoDb.patchDemoAccess(id, patch);
  }

  return patchFileStore((store) => {
    const current = store.demoAccess.find((access) => access.id === id);
    if (!current) return { next: store, result: null };

    const updated = patch(current);
    return {
      next: {
        ...store,
        demoAccess: store.demoAccess.map((access) => (access.id === id ? updated : access)),
      },
      result: updated,
    };
  });
}

/* ---------------------------------------------------------------- Verbrauch */

export async function getUsage(companyId: string): Promise<Usage[]> {
  if (isMongoConfigured()) {
    await ready();
    return usageDb.listUsageForCompany(companyId);
  }

  const store = await readFileStore();
  return store.usage
    .filter((entry) => entry.companyId === companyId)
    .sort((a, b) => a.month.localeCompare(b.month));
}
