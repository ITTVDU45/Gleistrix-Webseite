import { promises as fs } from "node:fs";
import path from "node:path";

import type {
  AdminStore,
  BrochureRequest,
  Company,
  DemoAccess,
  Lead,
  Package,
  SupportAccess,
  Usage,
} from "@/types/admin";
import { provisioningPlan, tenantFor } from "./tenant";

/**
 * Persistenz des Superadmin-Bereichs: JSON-Datei + Prozess-Cache.
 *
 * ponytail: eine Datei statt einer Datenbank, solange MONGODB_URI fehlt.
 * Sobald die Mongo-Anbindung steht, werden nur readStore/writeStore
 * ausgetauscht – Seiten und Actions bleiben unverändert.
 */

const DATA_DIR = process.env.GLEISTRIX_DATA_DIR ?? path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "admin-store.json");

let cache: AdminStore | null = null;
/**
 * Änderungszeitpunkt der Datei, aus der der Cache stammt.
 *
 * Ohne diesen Abgleich liefert jede Modulinstanz ewig ihren ersten Lesestand:
 * Next bündelt Routen getrennt, `/api/pricing` und eine Server Action haben
 * damit je einen eigenen `cache`. Eine Freigabe wäre in der einen sichtbar und
 * in der anderen nicht. Ein `stat` je Aufruf kostet nichts und behebt das.
 */
let cacheMtimeMs = -1;

function buildCompany(input: {
  id: string;
  name: string;
  slug: string;
  contactName: string;
  contactEmail: string;
  seats: number;
  packageId: string | null;
  status: Company["status"];
  createdAt: string;
  allStepsDone: boolean;
  extraModuleIds?: string[];
  blockedModuleIds?: string[];
}): Company {
  const tenant = tenantFor(input.slug);
  const provisioning = provisioningPlan(tenant).map((step) => ({
    ...step,
    status: input.allStepsDone ? ("done" as const) : step.status,
    updatedAt: input.createdAt,
  }));

  return {
    id: input.id,
    name: input.name,
    slug: input.slug,
    contactName: input.contactName,
    contactEmail: input.contactEmail,
    seats: input.seats,
    status: input.status,
    packageId: input.packageId,
    extraModuleIds: input.extraModuleIds ?? [],
    blockedModuleIds: input.blockedModuleIds ?? [],
    tenant,
    provisioning,
    createdAt: input.createdAt,
  };
}

function seed(): AdminStore {
  const packages: Package[] = [
    {
      id: "pkg_starter",
      name: "Starter",
      description: "Einstieg für kleine Kolonnen: Projekte, Mitarbeitende, Dokumente.",
      monthlyPrice: 150,
      includedSeats: 5,
      projectLimit: 100,
      moduleIds: ["absence", "clients", "deadlines"],
      isPublished: true,
      createdAt: "2026-01-15T09:00:00.000Z",
    },
    {
      id: "pkg_professional",
      name: "Professional",
      description: "Standard für Bahndienstleister mit eigener Disposition und Abrechnung.",
      monthlyPrice: 390,
      includedSeats: 15,
      projectLimit: 1000,
      moduleIds: [
        "absence",
        "clients",
        "deadlines",
        "material",
        "vehicles",
        "qualifications",
        "operations-board",
        "billing",
      ],
      isPublished: true,
      createdAt: "2026-01-15T09:00:00.000Z",
    },
    {
      id: "pkg_enterprise",
      name: "Enterprise",
      description: "Voller Funktionsumfang inklusive Lager, Finanzen und KI-Agenten.",
      monthlyPrice: 890,
      includedSeats: 50,
      projectLimit: 10000,
      moduleIds: [
        "absence",
        "clients",
        "deadlines",
        "material",
        "vehicles",
        "qualifications",
        "employee-documents",
        "subcontractors",
        "templates",
        "operations-board",
        "billing",
        "warehouse",
        "finance",
        "ai-agents",
      ],
      isPublished: false,
      createdAt: "2026-06-02T09:00:00.000Z",
    },
  ];

  const companies: Company[] = [
    buildCompany({
      id: "cmp_musterbau",
      name: "Muster Bau GmbH",
      slug: "muster-bau",
      contactName: "Sabine Ahrens",
      contactEmail: "leitung@example.test",
      seats: 12,
      packageId: "pkg_professional",
      status: "active",
      createdAt: "2026-05-14T08:00:00.000Z",
      allStepsDone: true,
    }),
    buildCompany({
      id: "cmp_nordgleis",
      name: "Nordgleis Service AG",
      slug: "nordgleis",
      contactName: "Tim Oltmanns",
      contactEmail: "it@example.test",
      seats: 34,
      packageId: "pkg_professional",
      status: "active",
      createdAt: "2026-03-02T08:00:00.000Z",
      allStepsDone: true,
      extraModuleIds: ["warehouse"],
      blockedModuleIds: ["billing"],
    }),
    buildCompany({
      id: "cmp_rheinbahntechnik",
      name: "Rheinbahntechnik e.K.",
      slug: "rheinbahntechnik",
      contactName: "Katrin Vogt",
      contactEmail: "kontakt@example.test",
      seats: 6,
      packageId: "pkg_starter",
      status: "provisioning",
      createdAt: "2026-07-28T08:00:00.000Z",
      allStepsDone: false,
    }),
  ];

  const usage: Usage[] = [
    { companyId: "cmp_musterbau", month: "2026-07", activeUsers: 11, projects: 172, storageMb: 6900, apiCalls: 118200 },
    { companyId: "cmp_musterbau", month: "2026-08", activeUsers: 12, projects: 184, storageMb: 7400, apiCalls: 128400 },
    { companyId: "cmp_nordgleis", month: "2026-07", activeUsers: 29, projects: 512, storageMb: 24100, apiCalls: 402300 },
    { companyId: "cmp_nordgleis", month: "2026-08", activeUsers: 31, projects: 538, storageMb: 25800, apiCalls: 431900 },
    { companyId: "cmp_rheinbahntechnik", month: "2026-08", activeUsers: 2, projects: 4, storageMb: 120, apiCalls: 1400 },
  ];

  const leads: Lead[] = [
    {
      id: "lead_hansen",
      kind: "demo",
      company: "Hansen Gleisbau GmbH",
      contactName: "Jan Hansen",
      email: "j.hansen@example.test",
      phone: "+49 40 1234567",
      message: "12 Kolonnen, Interesse an Disposition und Abrechnung.",
      status: "neu",
      createdAt: "2026-08-01T07:40:00.000Z",
    },
    {
      id: "lead_suedschiene",
      kind: "termin",
      company: "Südschiene Technik KG",
      contactName: "Marie Ebert",
      email: "m.ebert@example.test",
      phone: "+49 89 998877",
      message: "Bitte Termin für eine Live-Demo mit der Geschäftsführung.",
      status: "termin",
      appointmentAt: "2026-08-06T09:00:00.000Z",
      note: "Teams-Link vorab senden.",
      createdAt: "2026-07-29T13:05:00.000Z",
    },
    {
      id: "lead_bahnwerk",
      kind: "kontakt",
      company: "Bahnwerk Ost e.K.",
      contactName: "Peter Lorenz",
      email: "p.lorenz@example.test",
      message: "Frage zur Schnittstelle an unsere Lohnbuchhaltung.",
      status: "in-kontakt",
      createdAt: "2026-07-25T15:20:00.000Z",
    },
  ];

  const brochureRequests: BrochureRequest[] = [
    {
      id: "brq_hansen",
      company: "Hansen Gleisbau GmbH",
      contactName: "Jan Hansen",
      email: "j.hansen@example.test",
      createdAt: "2026-08-01T07:42:00.000Z",
    },
    {
      id: "brq_westgleis",
      company: "Westgleis Bau AG",
      contactName: "Ulrike Stein",
      email: "u.stein@example.test",
      createdAt: "2026-07-22T11:10:00.000Z",
      sentAt: "2026-07-22T14:00:00.000Z",
    },
  ];

  return { companies, packages, usage, supportAccess: [], leads, brochureRequests, demoAccess: [] };
}

export async function readStore(): Promise<AdminStore> {
  try {
    const stat = await fs.stat(DATA_FILE);
    if (cache && stat.mtimeMs === cacheMtimeMs) return cache;

    const raw = await fs.readFile(DATA_FILE, "utf8");
    cacheMtimeMs = stat.mtimeMs;
    const parsed = JSON.parse(raw) as Partial<AdminStore>;
    // Ältere Dateien kennen supportAccess, leads, brochureRequests und
    // demoAccess noch nicht.
    cache = {
      companies: parsed.companies ?? [],
      packages: parsed.packages ?? [],
      usage: parsed.usage ?? [],
      supportAccess: parsed.supportAccess ?? [],
      leads: parsed.leads ?? [],
      brochureRequests: parsed.brochureRequests ?? [],
      demoAccess: parsed.demoAccess ?? [],
      // Fehlt die Preiskonfiguration, greift DEFAULT_PRICING als Rückfallebene
      // (siehe lib/admin/pricing.ts) – nicht hier, damit der Store frei von
      // Preislogik bleibt.
      pricingDraft: parsed.pricingDraft,
      pricingPublished: parsed.pricingPublished,
    };
  } catch {
    // Erster Start oder beschädigte Datei: mit Demodaten beginnen.
    cache = seed();
    await writeStore(cache);
  }

  return cache;
}

export async function writeStore(next: AdminStore): Promise<void> {
  cache = next;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(next, null, 2), "utf8");
    // Eigenen Schreibvorgang als bekannt vermerken, sonst liest der nächste
    // Aufruf die gerade geschriebene Datei unnötig erneut ein.
    cacheMtimeMs = (await fs.stat(DATA_FILE)).mtimeMs;
  } catch (error) {
    // Ein schreibgeschütztes Dateisystem darf den Admin nicht blockieren –
    // der Prozess-Cache trägt die Sitzung, der Fehler bleibt sichtbar.
    console.error("[admin-store] Konnte nicht persistieren:", error);
  }
}

/** Ersetzt ein Unternehmen unveränderlich und schreibt den Store zurück. */
export async function updateCompany(
  id: string,
  patch: (company: Company) => Company,
): Promise<Company | null> {
  const store = await readStore();
  const current = store.companies.find((c) => c.id === id);
  if (!current) return null;

  const updated = patch(current);
  await writeStore({
    ...store,
    companies: store.companies.map((c) => (c.id === id ? updated : c)),
  });
  return updated;
}

/** Ersetzt ein Paket unveränderlich und schreibt den Store zurück. */
export async function updatePackage(
  id: string,
  patch: (pkg: Package) => Package,
): Promise<Package | null> {
  const store = await readStore();
  const current = store.packages.find((p) => p.id === id);
  if (!current) return null;

  const updated = patch(current);
  await writeStore({
    ...store,
    packages: store.packages.map((p) => (p.id === id ? updated : p)),
  });
  return updated;
}

export async function getCompany(id: string): Promise<Company | null> {
  const store = await readStore();
  return store.companies.find((c) => c.id === id) ?? null;
}

export async function getPackage(id: string | null): Promise<Package | null> {
  if (!id) return null;
  const store = await readStore();
  return store.packages.find((p) => p.id === id) ?? null;
}

/** Hält jeden Support-Zugriff fest; neueste Einträge zuerst. */
export async function recordSupportAccess(
  entry: Omit<SupportAccess, "id" | "createdAt">,
): Promise<void> {
  const store = await readStore();
  const record: SupportAccess = {
    ...entry,
    id: `sup_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };
  await writeStore({ ...store, supportAccess: [record, ...store.supportAccess].slice(0, 500) });
}

export async function getSupportAccess(companyId?: string): Promise<SupportAccess[]> {
  const store = await readStore();
  return companyId
    ? store.supportAccess.filter((entry) => entry.companyId === companyId)
    : store.supportAccess;
}

/* --------------------------------------------------------------- Anfragen */

/** Neueste Anfrage zuerst – der Superadmin arbeitet den Eingang von oben ab. */
export async function getLeads(): Promise<Lead[]> {
  const store = await readStore();
  return [...store.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getLead(id: string): Promise<Lead | null> {
  const store = await readStore();
  return store.leads.find((lead) => lead.id === id) ?? null;
}

export async function updateLead(
  id: string,
  patch: (lead: Lead) => Lead,
): Promise<Lead | null> {
  const store = await readStore();
  const current = store.leads.find((lead) => lead.id === id);
  if (!current) return null;

  const updated = patch(current);
  await writeStore({
    ...store,
    leads: store.leads.map((lead) => (lead.id === id ? updated : lead)),
  });
  return updated;
}

/* --------------------------------------------------------------- Broschüre */

export async function getBrochureRequests(): Promise<BrochureRequest[]> {
  const store = await readStore();
  return [...store.brochureRequests].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Versandstatus umschalten – das Versenden selbst passiert außerhalb. */
export async function setBrochureSent(id: string, sent: boolean): Promise<void> {
  const store = await readStore();
  await writeStore({
    ...store,
    brochureRequests: store.brochureRequests.map((request) =>
      request.id === id
        ? { ...request, sentAt: sent ? new Date().toISOString() : undefined }
        : request,
    ),
  });
}

/* ------------------------------------------------------------ Demo-Zugang */

export async function getDemoAccess(): Promise<DemoAccess[]> {
  const store = await readStore();
  return [...store.demoAccess].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addDemoAccess(entry: DemoAccess): Promise<void> {
  const store = await readStore();
  await writeStore({ ...store, demoAccess: [entry, ...store.demoAccess].slice(0, 500) });
}

export async function updateDemoAccess(
  id: string,
  patch: (access: DemoAccess) => DemoAccess,
): Promise<DemoAccess | null> {
  const store = await readStore();
  const current = store.demoAccess.find((access) => access.id === id);
  if (!current) return null;

  const updated = patch(current);
  await writeStore({
    ...store,
    demoAccess: store.demoAccess.map((access) => (access.id === id ? updated : access)),
  });
  return updated;
}

export async function getUsage(companyId: string): Promise<Usage[]> {
  const store = await readStore();
  return store.usage
    .filter((entry) => entry.companyId === companyId)
    .sort((a, b) => a.month.localeCompare(b.month));
}
