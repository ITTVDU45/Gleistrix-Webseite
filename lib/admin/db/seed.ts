import type { AdminStore, BrochureRequest, Company, Lead, Package, Usage } from "@/types/admin";

import { provisioningPlan, tenantFor } from "../tenant";

/**
 * Demodaten für den ersten Start gegen eine leere Ablage.
 *
 * Greift nur, wenn weder Collections noch Datei etwas enthalten – bestehende
 * Bestände werden nie überschrieben.
 */

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

export function seed(): AdminStore {
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

  return {
    companies,
    packages,
    usage,
    supportAccess: [],
    leads,
    contacts: [],
    brochureRequests,
    demoAccess: [],
  };
}
