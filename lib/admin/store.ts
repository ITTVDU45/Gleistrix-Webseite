import type {
  AdminStore,
  BrochureRequest,
  Company,
  CompanyUser,
  Contact,
  DemoAccess,
  Lead,
  NotificationTemplate,
  Package,
  Purchase,
  SupportAccess,
  Usage,
} from "@/types/admin";

import { bootstrap } from "./db/bootstrap";
import * as brochureDb from "./db/brochure";
import * as companiesDb from "./db/companies";
import * as companyUsersDb from "./db/companyUsers";
import * as contactsDb from "./db/contacts";
import * as templatesDb from "./db/notificationTemplates";
import * as demoDb from "./db/demoAccess";
import { patchFileStore, readFileStore } from "./db/file-store";
import * as leadsDb from "./db/leads";
import * as purchasesDb from "./db/purchases";
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

  const [
    companies,
    companyUsers,
    notificationTemplates,
    packages,
    usage,
    supportAccess,
    leads,
    contacts,
    brochureRequests,
    demoAccess,
    purchases,
  ] = await Promise.all([
    companiesDb.listCompanies(),
    companyUsersDb.listCompanyUsers(),
    templatesDb.listNotificationTemplates(),
    packagesDb.listPackages(),
    usageDb.listUsage(),
    supportDb.listSupportAccess(),
    leadsDb.listLeads(),
    contactsDb.listContacts(),
    brochureDb.listBrochureRequests(),
    demoDb.listDemoAccess(),
    purchasesDb.listPurchases(),
  ]);

  return {
    companies,
    companyUsers,
    notificationTemplates,
    packages,
    usage,
    supportAccess,
    leads,
    contacts,
    brochureRequests,
    demoAccess,
    purchases,
  };
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

/**
 * Entfernt den Mandanten aus der Control-Plane, mitsamt seiner eingeladenen
 * Nutzer.
 *
 * Die Nutzerliste ist reine Betriebsanzeige zu diesem Mandanten – bliebe sie
 * stehen, zeigte der Adminbereich Einladungen zu einem Unternehmen, das es
 * nicht mehr gibt. Käufe, Nutzungsdaten und das Zugriffsprotokoll bleiben
 * dagegen als Beleg liegen; die Kaufseite zeigt sie als „Unbekanntes
 * Unternehmen".
 *
 * Datenbank, Bucket und die Rechte des App-Benutzers baut der Aufrufer ab –
 * siehe deleteCompanyAction. Hier steht nur die Control-Plane.
 */
export async function deleteCompany(id: string): Promise<void> {
  // ponytail: Schleife statt deleteMany – ein Mandant hat eine Handvoll Nutzer,
  // und so gilt derselbe Code für Datenbank und Dateispeicher. Ab dreistelligen
  // Nutzerzahlen wäre removeMany() in repository() der Upgrade-Pfad.
  for (const user of await listCompanyUsers(id)) {
    await deleteCompanyUser(user.id);
  }

  if (isMongoConfigured()) {
    await ready();
    return companiesDb.removeCompany(id);
  }

  await patchFileStore((store) => ({
    next: { ...store, companies: store.companies.filter((c) => c.id !== id) },
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

/* ------------------------------------------------------- Mandanten-Nutzer */

/** Eingeladene Nutzer eines Mandanten, neueste Einladung zuerst. */
export async function listCompanyUsers(companyId?: string): Promise<CompanyUser[]> {
  if (isMongoConfigured()) {
    await ready();
    return companyUsersDb.listCompanyUsers(companyId ? { companyId } : {});
  }

  const store = await readFileStore();
  const users = companyId
    ? store.companyUsers.filter((user) => user.companyId === companyId)
    : store.companyUsers;
  return [...users].sort((a, b) => b.invitedAt.localeCompare(a.invitedAt));
}

export async function getCompanyUser(id: string): Promise<CompanyUser | null> {
  if (isMongoConfigured()) {
    await ready();
    return companyUsersDb.getCompanyUser(id);
  }

  const store = await readFileStore();
  return store.companyUsers.find((user) => user.id === id) ?? null;
}

export async function insertCompanyUser(user: CompanyUser): Promise<void> {
  if (isMongoConfigured()) {
    await ready();
    return companyUsersDb.insertCompanyUser(user);
  }

  await patchFileStore((store) => ({
    next: { ...store, companyUsers: [user, ...store.companyUsers] },
    result: undefined,
  }));
}

export async function updateCompanyUser(
  id: string,
  patch: (user: CompanyUser) => CompanyUser,
): Promise<CompanyUser | null> {
  if (isMongoConfigured()) {
    await ready();
    return companyUsersDb.patchCompanyUser(id, patch);
  }

  return patchFileStore((store) => {
    const current = store.companyUsers.find((user) => user.id === id);
    if (!current) return { next: store, result: null };

    const updated = patch(current);
    return {
      next: {
        ...store,
        companyUsers: store.companyUsers.map((user) => (user.id === id ? updated : user)),
      },
      result: updated,
    };
  });
}

/**
 * Entfernt den Eintrag aus dem Protokoll der Control-Plane.
 *
 * Der Benutzer in der App bleibt bestehen – dort liegt seine Wahrheit, und ein
 * Löschen über die Ferne wäre ein stiller Datenverlust im Mandanten.
 */
export async function deleteCompanyUser(id: string): Promise<void> {
  if (isMongoConfigured()) {
    await ready();
    return companyUsersDb.removeCompanyUser(id);
  }

  await patchFileStore((store) => ({
    next: { ...store, companyUsers: store.companyUsers.filter((user) => user.id !== id) },
    result: undefined,
  }));
}

/* ------------------------------------------------ Benachrichtigungsvorlagen */

export async function listNotificationTemplates(): Promise<NotificationTemplate[]> {
  if (isMongoConfigured()) {
    await ready();
    return templatesDb.listNotificationTemplates();
  }

  const store = await readFileStore();
  return [...store.notificationTemplates].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getNotificationTemplate(id: string): Promise<NotificationTemplate | null> {
  if (isMongoConfigured()) {
    await ready();
    return templatesDb.getNotificationTemplate(id);
  }

  const store = await readFileStore();
  return store.notificationTemplates.find((template) => template.id === id) ?? null;
}

export async function insertNotificationTemplate(template: NotificationTemplate): Promise<void> {
  if (isMongoConfigured()) {
    await ready();
    return templatesDb.insertNotificationTemplate(template);
  }

  await patchFileStore((store) => ({
    next: { ...store, notificationTemplates: [template, ...store.notificationTemplates] },
    result: undefined,
  }));
}

export async function updateNotificationTemplate(
  id: string,
  patch: (template: NotificationTemplate) => NotificationTemplate,
): Promise<NotificationTemplate | null> {
  if (isMongoConfigured()) {
    await ready();
    return templatesDb.patchNotificationTemplate(id, patch);
  }

  return patchFileStore((store) => {
    const current = store.notificationTemplates.find((template) => template.id === id);
    if (!current) return { next: store, result: null };

    const updated = patch(current);
    return {
      next: {
        ...store,
        notificationTemplates: store.notificationTemplates.map((template) =>
          template.id === id ? updated : template,
        ),
      },
      result: updated,
    };
  });
}

export async function deleteNotificationTemplate(id: string): Promise<void> {
  if (isMongoConfigured()) {
    await ready();
    return templatesDb.removeNotificationTemplate(id);
  }

  await patchFileStore((store) => ({
    next: {
      ...store,
      notificationTemplates: store.notificationTemplates.filter(
        (template) => template.id !== id,
      ),
    },
    result: undefined,
  }));
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

export async function deleteLead(id: string): Promise<void> {
  if (isMongoConfigured()) {
    await ready();
    return leadsDb.removeLead(id);
  }

  await patchFileStore((store) => ({
    next: { ...store, leads: store.leads.filter((lead) => lead.id !== id) },
    result: undefined,
  }));
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

/* -------------------------------------------------------------------- Käufe */

export async function getPurchases(): Promise<Purchase[]> {
  if (isMongoConfigured()) {
    await ready();
    return purchasesDb.listPurchases();
  }

  const store = await readFileStore();
  return [...store.purchases].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPurchase(id: string): Promise<Purchase | null> {
  if (isMongoConfigured()) {
    await ready();
    return purchasesDb.getPurchase(id);
  }

  const store = await readFileStore();
  return store.purchases.find((purchase) => purchase.id === id) ?? null;
}

export async function getPurchasesForCompany(companyId: string): Promise<Purchase[]> {
  if (isMongoConfigured()) {
    await ready();
    return purchasesDb.listPurchasesForCompany(companyId);
  }

  const store = await readFileStore();
  return store.purchases
    .filter((purchase) => purchase.companyId === companyId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addPurchase(purchase: Purchase): Promise<void> {
  if (isMongoConfigured()) {
    await ready();
    return purchasesDb.insertPurchase(purchase);
  }

  await patchFileStore((store) => ({
    next: { ...store, purchases: [purchase, ...store.purchases] },
    result: undefined,
  }));
}

export async function updatePurchase(
  id: string,
  patch: (purchase: Purchase) => Purchase,
): Promise<Purchase | null> {
  if (isMongoConfigured()) {
    await ready();
    return purchasesDb.patchPurchase(id, patch);
  }

  return patchFileStore((store) => {
    const current = store.purchases.find((purchase) => purchase.id === id);
    if (!current) return { next: store, result: null };

    const updated = patch(current);
    return {
      next: {
        ...store,
        purchases: store.purchases.map((purchase) => (purchase.id === id ? updated : purchase)),
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
