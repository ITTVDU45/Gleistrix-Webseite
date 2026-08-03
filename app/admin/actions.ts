"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { DEFAULT_PRICING } from "@/data/pricing";
import { login, logout } from "@/lib/admin/auth";
import {
  DEFAULT_DEMO_DAYS,
  DEMO_ISSUE_TEXT,
  MAX_DEMO_DAYS,
  demoConfigIssue,
  grantDemo,
  revokeDemo,
} from "@/lib/admin/demo";
import { getModule } from "@/lib/admin/modules";
import {
  discardDraft,
  getDraftPricing,
  isModuleInUse,
  moduleUsage,
  parseCount,
  parseLines,
  parsePrice,
  publishDraft,
  updateDraft,
  validateIconKey,
  validateModuleId,
} from "@/lib/admin/pricing";
import {
  addDemoAccess,
  readStore,
  recordSupportAccess,
  setBrochureSent,
  updateCompany,
  updateDemoAccess,
  updateLead,
  updatePackage,
  writeStore,
} from "@/lib/admin/store";
import { createSupportLink } from "@/lib/admin/support";
import {
  instanceUrl,
  provisioningPlan,
  slugify,
  tenantFor,
  validateSlug,
} from "@/lib/admin/tenant";
import type { Company, LeadStatus, Package, ProvisioningStatus } from "@/types/admin";
import type {
  ModuleTier,
  ModuleUsagePricing,
  PricingCapacity,
  PricingIntegration,
  PricingModule,
  PricingPackage,
  PricingTexts,
} from "@/types/pricing";

export type FormState = { error?: string; success?: string; supportUrl?: string };

function field(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function revalidateAdmin(companyId?: string): void {
  revalidatePath("/admin");
  revalidatePath("/admin/unternehmen");
  revalidatePath("/admin/pakete");
  revalidatePath("/admin/pakete/mandanten");
  revalidatePath("/admin/module");
  revalidatePath("/admin/anfragen");
  revalidatePath("/admin/broschuere");
  revalidatePath("/admin/demo-zugang");
  // Ohne die Kundenseite bleibt nach einer Freigabe der alte Preis stehen.
  revalidatePath("/preise");
  if (companyId) revalidatePath(`/admin/unternehmen/${companyId}`);
}

/* ------------------------------------------------------------------ Login */

/** Einfache Bremse gegen Passwort-Raten – pro Prozess, reicht für einen Root-Account. */
const attempts = new Map<string, { count: number; firstAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function loginAction(_prev: FormState, data: FormData): Promise<FormState> {
  const email = field(data, "email");
  const password = field(data, "password");
  const next = field(data, "next");

  if (!email || !password) {
    return { error: "Bitte E-Mail und Passwort eingeben." };
  }
  if (tooManyAttempts(email.toLowerCase())) {
    return { error: "Zu viele Versuche. Bitte in einigen Minuten erneut probieren." };
  }

  const result = await login(email, password);
  if (!result.ok) return { error: result.error };

  attempts.delete(email.toLowerCase());
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect("/admin/login");
}

/* ------------------------------------------------------------- Unternehmen */

export async function createCompanyAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const name = field(data, "name");
  const contactName = field(data, "contactName");
  const contactEmail = field(data, "contactEmail");
  const seats = Number.parseInt(field(data, "seats") || "1", 10);
  const packageId = field(data, "packageId") || null;
  const slug = slugify(field(data, "slug") || name);

  if (!name) return { error: "Firmenname fehlt." };
  if (!contactEmail.includes("@")) return { error: "Bitte eine gültige Kontakt-E-Mail angeben." };
  if (!Number.isFinite(seats) || seats < 1) return { error: "Anzahl Benutzer muss mindestens 1 sein." };

  const store = await readStore();
  const slugCheck = validateSlug(
    slug,
    store.companies.map((c) => c.slug),
  );
  if (!slugCheck.ok) return { error: slugCheck.error };

  if (packageId) {
    const pkg = store.packages.find((p) => p.id === packageId);
    if (!pkg) return { error: "Unbekanntes Paket." };
    if (!pkg.isPublished) return { error: `Paket „${pkg.name}“ ist nicht freigegeben.` };
  }

  const tenant = tenantFor(slug);
  const company: Company = {
    id: `cmp_${slug.replace(/-/g, "")}_${Date.now().toString(36)}`,
    name,
    slug,
    contactName,
    contactEmail,
    seats,
    status: "provisioning",
    packageId,
    extraModuleIds: [],
    blockedModuleIds: [],
    tenant,
    provisioning: provisioningPlan(tenant),
    createdAt: new Date().toISOString(),
  };

  await writeStore({ ...store, companies: [...store.companies, company] });
  revalidateAdmin(company.id);
  redirect(`/admin/unternehmen/${company.id}`);
}

export async function assignPackageAction(data: FormData): Promise<void> {
  const companyId = field(data, "companyId");
  const packageId = field(data, "packageId") || null;

  const store = await readStore();
  if (packageId) {
    const pkg = store.packages.find((p) => p.id === packageId);
    if (!pkg || !pkg.isPublished) return;
  }

  await updateCompany(companyId, (company) => ({ ...company, packageId }));
  revalidateAdmin(companyId);
}

/** Modul freigeben, sperren oder auf den Paketstand zurücksetzen. */
export async function setModuleAccessAction(data: FormData): Promise<void> {
  const companyId = field(data, "companyId");
  const moduleId = field(data, "moduleId");
  const mode = field(data, "mode");

  const pricing = await getDraftPricing();
  if (!getModule(pricing, moduleId)) return;
  if (mode !== "grant" && mode !== "block" && mode !== "reset") return;

  await updateCompany(companyId, (company) => {
    const extra = company.extraModuleIds.filter((id) => id !== moduleId);
    const blocked = company.blockedModuleIds.filter((id) => id !== moduleId);

    return {
      ...company,
      extraModuleIds: mode === "grant" ? [...extra, moduleId] : extra,
      blockedModuleIds: mode === "block" ? [...blocked, moduleId] : blocked,
    };
  });
  revalidateAdmin(companyId);
}

export async function setCompanyStatusAction(data: FormData): Promise<void> {
  const companyId = field(data, "companyId");
  const status = field(data, "status");
  const reason = field(data, "reason");

  if (status !== "active" && status !== "suspended" && status !== "provisioning") return;

  await updateCompany(companyId, (company) => ({
    ...company,
    status,
    suspendedReason: status === "suspended" ? reason || "Ohne Angabe" : undefined,
  }));
  revalidateAdmin(companyId);
}

/* ---------------------------------------------------------- Provisionierung */

export async function setProvisioningStepAction(data: FormData): Promise<void> {
  const companyId = field(data, "companyId");
  const stepId = field(data, "stepId");
  const status = field(data, "status") as ProvisioningStatus;

  if (status !== "pending" && status !== "done" && status !== "failed") return;

  const updated = await updateCompany(companyId, (company) => {
    const provisioning = company.provisioning.map((step) =>
      step.id === stepId ? { ...step, status, updatedAt: new Date().toISOString() } : step,
    );
    const allDone = provisioning.every((step) => step.status === "done");

    return {
      ...company,
      provisioning,
      // Erst wenn alle Ressourcen stehen, verlässt der Mandant die Provisionierung.
      status:
        company.status === "suspended"
          ? company.status
          : allDone
            ? ("active" as const)
            : ("provisioning" as const),
    };
  });

  if (updated) revalidateAdmin(companyId);
}

/* --------------------------------------------------------- Support-Zugriff */

/**
 * Erzeugt einen kurzlebigen Support-Link in die Instanz eines Mandanten.
 *
 * Bewusst mit eigenem Passwort abgesichert: Eine Control-Plane-Session allein
 * darf keine Kundendaten öffnen. Jeder Zugriff wird protokolliert – auch der,
 * bei dem am Ende niemand den Link benutzt.
 */
export async function openSupportSessionAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const companyId = field(data, "companyId");
  const password = field(data, "supportPassword");
  const reason = field(data, "reason");

  const store = await readStore();
  const company = store.companies.find((c) => c.id === companyId);
  if (!company) return { error: "Unbekanntes Unternehmen." };

  const deployed = company.provisioning.find((step) => step.id === "deployment");
  if (deployed?.status !== "done") {
    return { error: "Die Instanz dieses Mandanten ist noch nicht deployed." };
  }

  const link = createSupportLink(
    company.tenant.subdomain,
    instanceUrl(company.tenant),
    password,
    reason,
  );
  if (!link.ok) return { error: link.error };

  await recordSupportAccess({
    companyId: company.id,
    companyName: company.name,
    actor: link.actor,
    reason: reason.trim(),
  });
  revalidateAdmin(companyId);

  return {
    success: `Support-Link erstellt, gültig bis ${new Date(link.expiresAt).toLocaleTimeString("de-DE")}.`,
    supportUrl: link.url,
  };
}

/* ------------------------------------------------------------------ Pakete */

export async function createPackageAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const name = field(data, "name");
  const description = field(data, "description");
  const monthlyPrice = Number.parseFloat(field(data, "monthlyPrice") || "0");
  const includedSeats = Number.parseInt(field(data, "includedSeats") || "1", 10);
  const projectLimit = Number.parseInt(field(data, "projectLimit") || "100", 10);
  const pricing = await getDraftPricing();
  const moduleIds = data
    .getAll("moduleIds")
    .filter((v): v is string => typeof v === "string")
    .filter((id) => Boolean(getModule(pricing, id)));

  if (!name) return { error: "Paketname fehlt." };
  if (!Number.isFinite(monthlyPrice) || monthlyPrice < 0) {
    return { error: "Monatspreis muss eine Zahl ≥ 0 sein." };
  }
  if (!Number.isFinite(includedSeats) || includedSeats < 1) {
    return { error: "Enthaltene Benutzer müssen mindestens 1 sein." };
  }

  const store = await readStore();
  const pkg: Package = {
    id: `pkg_${slugify(name) || "paket"}_${Date.now().toString(36)}`,
    name,
    description,
    monthlyPrice,
    includedSeats,
    projectLimit: Number.isFinite(projectLimit) ? projectLimit : 100,
    moduleIds,
    isPublished: false,
    createdAt: new Date().toISOString(),
  };

  await writeStore({ ...store, packages: [...store.packages, pkg] });
  revalidateAdmin();
  return { success: `Paket „${pkg.name}“ angelegt – noch nicht freigegeben.` };
}

export async function togglePackagePublishedAction(data: FormData): Promise<void> {
  const packageId = field(data, "packageId");

  const store = await readStore();
  const pkg = store.packages.find((p) => p.id === packageId);
  if (!pkg) return;

  // Ein Paket zurückzuziehen, das noch zugewiesen ist, würde Mandanten still
  // Module entziehen – deshalb blockieren wir das.
  if (pkg.isPublished && store.companies.some((c) => c.packageId === packageId)) return;

  await updatePackage(packageId, (current) => ({
    ...current,
    isPublished: !current.isPublished,
  }));
  revalidateAdmin();
}

/* ---------------------------------------------------------------- Anfragen */

const LEAD_STATUS: LeadStatus[] = ["neu", "in-kontakt", "termin", "gewonnen", "verloren"];

function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUS as string[]).includes(value);
}

export async function setLeadStatusAction(data: FormData): Promise<void> {
  const leadId = field(data, "leadId");
  const status = field(data, "status");
  if (!isLeadStatus(status)) return;

  await updateLead(leadId, (lead) => ({ ...lead, status }));
  revalidateAdmin();
}

/**
 * Termin setzen oder löschen. Ein gesetzter Termin hebt den Status auf
 * „termin“ – ohne das müsste der Superadmin zwei Felder gleich pflegen.
 */
export async function setLeadAppointmentAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const leadId = field(data, "leadId");
  // datetime-local liefert Ortszeit ohne Zone, z. B. "2026-08-06T09:00".
  const value = field(data, "appointmentAt");
  const note = field(data, "note");

  if (!value) {
    const cleared = await updateLead(leadId, (lead) => ({
      ...lead,
      appointmentAt: undefined,
      note: note || undefined,
      status: lead.status === "termin" ? "in-kontakt" : lead.status,
    }));
    if (!cleared) return { error: "Unbekannte Anfrage." };
    revalidateAdmin();
    return { success: "Termin entfernt." };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { error: "Bitte einen gültigen Termin angeben." };
  }

  const updated = await updateLead(leadId, (lead) => ({
    ...lead,
    appointmentAt: parsed.toISOString(),
    note: note || undefined,
    status: "termin",
  }));
  if (!updated) return { error: "Unbekannte Anfrage." };

  revalidateAdmin();
  return {
    success: `Termin auf ${parsed.toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" })} gesetzt.`,
  };
}

/* --------------------------------------------------------------- Broschüre */

export async function setBrochureSentAction(data: FormData): Promise<void> {
  const requestId = field(data, "requestId");
  const sent = field(data, "sent") === "true";
  if (!requestId) return;

  await setBrochureSent(requestId, sent);
  revalidateAdmin();
}

/* ------------------------------------------------------------- Demo-Zugang */

/**
 * Schaltet über die Schnittstelle der Gleistrix-App eine Demoversion frei.
 * Jeder Versuch landet im Protokoll – auch der fehlgeschlagene, sonst bleibt
 * unklar, warum ein Interessent keinen Zugang bekommen hat.
 */
export async function releaseDemoAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const leadId = field(data, "leadId") || null;
  const email = field(data, "email").toLowerCase();
  const company = field(data, "company");
  const days = Number.parseInt(field(data, "days") || String(DEFAULT_DEMO_DAYS), 10);

  if (!email.includes("@")) return { error: "Bitte eine gültige E-Mail-Adresse angeben." };
  if (!company) return { error: "Bitte das Unternehmen angeben." };
  if (!Number.isFinite(days) || days < 1 || days > MAX_DEMO_DAYS) {
    return { error: `Laufzeit muss zwischen 1 und ${MAX_DEMO_DAYS} Tagen liegen.` };
  }

  const issue = demoConfigIssue();
  if (issue) return { error: DEMO_ISSUE_TEXT[issue] };

  const result = await grantDemo({ email, company, days });
  const now = new Date().toISOString();
  const id = `demo_${Date.now().toString(36)}`;

  if (!result.ok) {
    await addDemoAccess({
      id,
      leadId,
      company,
      email,
      status: "fehlgeschlagen",
      expiresAt: now,
      error: result.error,
      createdAt: now,
    });
    revalidateAdmin();
    return { error: result.error };
  }

  await addDemoAccess({
    id,
    leadId,
    company,
    email,
    status: "aktiv",
    url: result.url,
    expiresAt: result.expiresAt,
    createdAt: now,
  });

  if (leadId) {
    await updateLead(leadId, (lead) => ({
      ...lead,
      status: lead.status === "neu" ? "in-kontakt" : lead.status,
    }));
  }

  revalidateAdmin();
  return {
    success: `Demo für ${email} freigeschaltet, gültig bis ${new Date(result.expiresAt).toLocaleDateString("de-DE")}.`,
    supportUrl: result.url,
  };
}

export async function revokeDemoAction(data: FormData): Promise<void> {
  const accessId = field(data, "accessId");

  const store = await readStore();
  const access = store.demoAccess.find((entry) => entry.id === accessId);
  if (!access || access.status !== "aktiv") return;

  const result = await revokeDemo(access.email);
  await updateDemoAccess(accessId, (current) => ({
    ...current,
    status: result.ok ? "widerrufen" : "fehlgeschlagen",
    error: result.ok ? undefined : result.error,
  }));
  revalidateAdmin();
}

/* ------------------------------------------------------------------ Preise */

/**
 * Alle Preis-Actions schreiben ausschließlich in den Entwurf. Erst
 * publishPricingAction hebt ihn auf die Kundenseite – ein halb gepflegter
 * Katalog geht damit nie live.
 */

function checked(data: FormData, name: string): boolean {
  return field(data, name) === "on";
}

/** Optionales Zahlenfeld: leer bleibt leer, ausgefüllt muss gültig sein. */
function optionalCount(
  raw: string,
  label: string,
): { ok: true; value?: number } | { ok: false; error: string } {
  if (!raw) return { ok: true, value: undefined };
  const parsed = parseCount(raw, label, 1);
  return parsed.ok ? { ok: true, value: parsed.value } : parsed;
}

const TIERS: ModuleTier[] = ["standard", "complex", "ai"];

function isTier(value: string): value is ModuleTier {
  return (TIERS as string[]).includes(value);
}

/**
 * Genau ein Eintrag trägt isDefault – sonst hat der Konfigurator keine
 * Vorauswahl. Gilt gleichermaßen für Pakete und Kapazitätsstufen.
 */
function withSingleDefault<T extends { id: string; isDefault: boolean }>(
  entries: T[],
  defaultId: string | null,
): T[] {
  if (defaultId) return entries.map((entry) => ({ ...entry, isDefault: entry.id === defaultId }));
  if (entries.some((entry) => entry.isDefault)) return entries;
  return entries.map((entry, index) => ({ ...entry, isDefault: index === 0 }));
}

export async function savePricingPackageAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const packageId = field(data, "packageId");
  const name = field(data, "name");
  if (!name) return { error: "Paketname fehlt." };

  const price = parsePrice(field(data, "price"), "Grundpreis");
  if (!price.ok) return { error: price.error };

  const includedUsers = parseCount(field(data, "includedUsers"), "Enthaltene Benutzer", 1);
  if (!includedUsers.ok) return { error: includedUsers.error };

  const implementationPrice = parsePrice(
    field(data, "implementationPrice"),
    "Implementierungspreis",
  );
  if (!implementationPrice.ok) return { error: implementationPrice.error };

  const features = parseLines(field(data, "features"));
  if (features.length === 0) return { error: "Bitte mindestens eine Leistung angeben." };

  const config = await getDraftPricing();
  const existing = packageId ? config.packages.find((pkg) => pkg.id === packageId) : undefined;
  if (packageId && !existing) return { error: "Unbekanntes Paket." };

  // Wie bei Modulen: Die Kennung entsteht beim Anlegen aus dem Namen und bleibt
  // danach stehen – Konfiguration und Anfragen referenzieren sie.
  let id = existing?.id ?? "";
  if (!existing) {
    const check = validateModuleId(
      slugify(name),
      config.packages.map((pkg) => pkg.id),
    );
    if (!check.ok) return { error: check.error };
    id = check.value;
  }

  const next: PricingPackage = {
    id,
    name,
    description: field(data, "description"),
    price: price.value,
    includedUsers: includedUsers.value,
    features,
    implementationPrice: implementationPrice.value,
    isDefault: checked(data, "isDefault"),
  };

  await updateDraft((current) => {
    const merged = existing
      ? current.packages.map((pkg) => (pkg.id === id ? next : pkg))
      : [...current.packages, next];
    return { ...current, packages: withSingleDefault(merged, next.isDefault ? id : null) };
  });
  revalidateAdmin();
  return { success: `Paket „${name}“ ${existing ? "gespeichert" : "angelegt"}.` };
}

export async function deletePricingPackageAction(data: FormData): Promise<void> {
  const packageId = field(data, "packageId");

  await updateDraft((config) => {
    // Der Konfigurator braucht mindestens ein Paket – das letzte bleibt stehen.
    if (config.packages.length <= 1) return config;

    const packages = config.packages.filter((pkg) => pkg.id !== packageId);
    if (packages.length === config.packages.length) return config;

    return { ...config, packages: withSingleDefault(packages, null) };
  });
  revalidateAdmin();
}

export async function savePricingExtraUserAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const extraUserPrice = parsePrice(field(data, "extraUserPrice"), "Preis je Zusatzbenutzer");
  if (!extraUserPrice.ok) return { error: extraUserPrice.error };

  await updateDraft((config) => ({ ...config, extraUserPrice: extraUserPrice.value }));
  revalidateAdmin();
  return { success: "Preis je Zusatzbenutzer gespeichert." };
}

export async function savePricingCapacityAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const capacityId = field(data, "capacityId");
  const label = field(data, "label");
  const shortLabel = field(data, "shortLabel");
  if (!label) return { error: "Bezeichnung der Kapazitätsstufe fehlt." };

  const projects = parseCount(field(data, "projects"), "Projektanzahl", 1);
  if (!projects.ok) return { error: projects.error };

  const monthlySurcharge = parsePrice(field(data, "monthlySurcharge"), "Monatlicher Aufschlag");
  if (!monthlySurcharge.ok) return { error: monthlySurcharge.error };

  const config = await getDraftPricing();
  const existing = capacityId
    ? config.capacities.find((capacity) => capacity.id === capacityId)
    : undefined;
  if (capacityId && !existing) return { error: "Unbekannte Kapazitätsstufe." };

  let id = existing?.id ?? "";
  if (!existing) {
    // Neue Stufen bekommen ihre Kennung aus der Bezeichnung.
    const check = validateModuleId(
      slugify(label),
      config.capacities.map((capacity) => capacity.id),
    );
    if (!check.ok) return { error: check.error };
    id = check.value;
  }

  const next: PricingCapacity = {
    id,
    label,
    shortLabel: shortLabel || label,
    projects: projects.value,
    monthlySurcharge: monthlySurcharge.value,
    isDefault: checked(data, "isDefault"),
  };

  await updateDraft((current) => {
    const merged = existing
      ? current.capacities.map((capacity) => (capacity.id === id ? next : capacity))
      : [...current.capacities, next];
    return { ...current, capacities: withSingleDefault(merged, next.isDefault ? id : null) };
  });
  revalidateAdmin();
  return { success: `Kapazität „${label}“ ${existing ? "gespeichert" : "angelegt"}.` };
}

export async function deletePricingCapacityAction(data: FormData): Promise<void> {
  const capacityId = field(data, "capacityId");

  await updateDraft((config) => {
    // Der Konfigurator braucht mindestens eine Stufe – die letzte bleibt stehen.
    if (config.capacities.length <= 1) return config;

    const capacities = config.capacities.filter((capacity) => capacity.id !== capacityId);
    if (capacities.length === config.capacities.length) return config;

    return { ...config, capacities: withSingleDefault(capacities, null) };
  });
  revalidateAdmin();
}

export async function savePricingModuleAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const moduleId = field(data, "moduleId");
  const tier = field(data, "tier");
  const title = field(data, "title");
  if (!title) return { error: "Modultitel fehlt." };
  if (!isTier(tier)) return { error: "Unbekannte Modulart." };

  const price = parsePrice(field(data, "price"), "Modulpreis");
  if (!price.ok) return { error: price.error };

  const iconKey = validateIconKey(field(data, "iconKey"));
  if (!iconKey.ok) return { error: iconKey.error };

  const config = await getDraftPricing();
  const existing = moduleId ? getModule(config, moduleId) : undefined;
  if (moduleId && !existing) return { error: "Unbekanntes Modul." };

  // Die Kennung ist nach dem Anlegen unveränderlich: Mandanten-Pakete und
  // Unternehmen speichern sie als Fremdschlüssel.
  let id = existing?.id ?? "";
  if (!existing) {
    const check = validateModuleId(
      field(data, "newId"),
      config.modules.map((module) => module.id),
    );
    if (!check.ok) return { error: check.error };
    id = check.value;
  }

  let usage: ModuleUsagePricing | undefined;
  if (checked(data, "usageEnabled")) {
    const unitPrice = parsePrice(field(data, "usageUnitPrice"), "Preis je Einheit");
    if (!unitPrice.ok) return { error: unitPrice.error };

    const usageLabel = field(data, "usageLabel");
    if (!usageLabel) return { error: "Beschriftung des Nutzungsfelds fehlt." };

    const sliderMax = parseCount(field(data, "usageSliderMax"), "Obergrenze des Reglers", 1);
    if (!sliderMax.ok) return { error: sliderMax.error };

    const step = parseCount(field(data, "usageStep"), "Schrittweite", 1);
    if (!step.ok) return { error: step.error };

    usage = {
      unitPrice: unitPrice.value,
      label: usageLabel,
      hint: field(data, "usageHint"),
      sliderMax: sliderMax.value,
      step: step.value,
    };
  }

  const next: PricingModule = {
    id,
    tier,
    title,
    description: field(data, "description"),
    price: price.value,
    features: parseLines(field(data, "features")),
    iconKey: iconKey.value,
    isActive: checked(data, "isActive"),
    usage,
  };

  await updateDraft((current) => ({
    ...current,
    modules: existing
      ? current.modules.map((module) => (module.id === id ? next : module))
      : [...current.modules, next],
  }));
  revalidateAdmin();
  return { success: `Modul „${title}“ ${existing ? "gespeichert" : "angelegt"}.` };
}

export async function togglePricingModuleActiveAction(data: FormData): Promise<void> {
  const moduleId = field(data, "moduleId");

  await updateDraft((config) => ({
    ...config,
    modules: config.modules.map((module) =>
      module.id === moduleId ? { ...module, isActive: !module.isActive } : module,
    ),
  }));
  revalidateAdmin();
}

export async function deletePricingModuleAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const moduleId = field(data, "moduleId");

  const config = await getDraftPricing();
  const target = getModule(config, moduleId);
  if (!target) return { error: "Unbekanntes Modul." };

  const usage = await moduleUsage(moduleId);
  if (isModuleInUse(usage)) {
    const references = [
      usage.packages.length > 0 ? `Pakete: ${usage.packages.join(", ")}` : "",
      usage.companies.length > 0 ? `Unternehmen: ${usage.companies.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    return {
      error: `„${target.title}“ ist noch referenziert (${references}). Löschen würde diesen Mandanten still die Freigabe entziehen – das Modul stattdessen archivieren.`,
    };
  }

  await updateDraft((current) => ({
    ...current,
    modules: current.modules.filter((entry) => entry.id !== moduleId),
  }));
  revalidateAdmin();

  // Von der Detailseite aus: die Seite existiert nach dem Löschen nicht mehr.
  // Der Redirect muss hier passieren, sonst rendert Next die Route neu, findet
  // das Modul nicht und zeigt eine 404, bevor der Client umleiten kann.
  const redirectTo = field(data, "redirectTo");
  if (redirectTo.startsWith("/admin")) redirect(redirectTo);

  return { success: `Modul „${target.title}“ gelöscht.` };
}

export async function savePricingIntegrationAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const integrationId = field(data, "integrationId");
  const title = field(data, "title");
  const category = field(data, "category");
  if (!title) return { error: "Name der Integration fehlt." };
  if (!category) return { error: "Kategorie fehlt." };

  const width = optionalCount(field(data, "width"), "Bildbreite");
  if (!width.ok) return { error: width.error };

  const height = optionalCount(field(data, "height"), "Bildhöhe");
  if (!height.ok) return { error: height.error };

  const config = await getDraftPricing();
  const existing = integrationId
    ? config.integrations.find((integration) => integration.id === integrationId)
    : undefined;
  if (integrationId && !existing) return { error: "Unbekannte Integration." };

  let id = existing?.id ?? "";
  if (!existing) {
    const check = validateModuleId(
      field(data, "newId") || slugify(title),
      config.integrations.map((integration) => integration.id),
    );
    if (!check.ok) return { error: check.error };
    id = check.value;
  }

  const src = field(data, "src");
  const next: PricingIntegration = {
    id,
    title,
    category,
    description: field(data, "description"),
    src: src || undefined,
    width: width.value,
    height: height.value,
    initials: field(data, "initials") || undefined,
  };

  await updateDraft((current) => ({
    ...current,
    integrations: existing
      ? current.integrations.map((integration) =>
          integration.id === id ? next : integration,
        )
      : [...current.integrations, next],
  }));
  revalidateAdmin();
  return { success: `Integration „${title}“ ${existing ? "gespeichert" : "angelegt"}.` };
}

export async function deletePricingIntegrationAction(data: FormData): Promise<void> {
  const integrationId = field(data, "integrationId");

  await updateDraft((config) => ({
    ...config,
    integrations: config.integrations.filter((integration) => integration.id !== integrationId),
  }));
  revalidateAdmin();
}

export async function savePricingTextsAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  // Schlüssel aus dem Auslieferungszustand: so fehlt nie ein Feld, auch wenn im
  // Entwurf einmal eines fehlen sollte.
  const keys = Object.keys(DEFAULT_PRICING.texts) as (keyof PricingTexts)[];
  const missing = keys.filter((key) => !field(data, key));
  if (missing.length > 0) {
    return { error: `Diese Textfelder dürfen nicht leer sein: ${missing.join(", ")}.` };
  }

  const texts = Object.fromEntries(keys.map((key) => [key, field(data, key)])) as PricingTexts;

  await updateDraft((config) => ({ ...config, texts }));
  revalidateAdmin();
  return { success: "Texte gespeichert." };
}

export async function savePricingCategoriesAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const categories = parseLines(field(data, "categories"));
  if (categories.length < 2) {
    return { error: "Bitte den „Alle“-Filter und mindestens eine Kategorie angeben." };
  }

  // Die erste Zeile ist der „Alle"-Filter; nur die übrigen tragen Integrationen.
  const selectable = categories.slice(1);
  const config = await getDraftPricing();
  const orphaned = [...new Set(config.integrations.map((integration) => integration.category))]
    .filter((category) => !selectable.includes(category))
    .sort();

  if (orphaned.length > 0) {
    return {
      error: `Diese Kategorien sind noch von Integrationen belegt: ${orphaned.join(", ")}.`,
    };
  }

  await updateDraft((current) => ({ ...current, integrationCategories: categories }));
  revalidateAdmin();
  return { success: "Kategorien gespeichert." };
}

/** Ohne Felder – die leere Parameterliste bleibt für useActionState zuweisbar. */
export async function publishPricingAction(): Promise<FormState> {
  const published = await publishDraft();
  revalidateAdmin();

  return {
    success: `Preisseite freigegeben – Stand ${new Date(published.updatedAt).toLocaleString(
      "de-DE",
      { dateStyle: "medium", timeStyle: "short" },
    )}.`,
  };
}

export async function discardPricingDraftAction(): Promise<void> {
  await discardDraft();
  revalidateAdmin();
}

/* ------------------------------------------------------------- Reihenfolge */

/**
 * Tauscht einen Eintrag mit seinem Nachbarn.
 *
 * Die Anzeigereihenfolge ist die Array-Reihenfolge – ein eigenes Sortierfeld
 * gäbe es nur doppelt zu pflegen. Bei Add-ons wird mit dem nächsten Eintrag
 * DERSELBEN Stufe getauscht: die Preisseite gruppiert nach Stufe, ein Tausch
 * über die Stufengrenze hinweg würde dort nichts bewegen.
 */
function moveEntry<T extends { id: string }>(
  items: T[],
  id: string,
  step: number,
  sameGroup: (a: T, b: T) => boolean = () => true,
): T[] {
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return items;

  let partner = index + step;
  while (partner >= 0 && partner < items.length && !sameGroup(items[index], items[partner])) {
    partner += step;
  }
  if (partner < 0 || partner >= items.length) return items;

  const next = [...items];
  next[index] = items[partner];
  next[partner] = items[index];
  return next;
}

export async function movePricingEntryAction(data: FormData): Promise<void> {
  const kind = field(data, "kind");
  const id = field(data, "id");
  const step = field(data, "direction") === "up" ? -1 : 1;
  if (!id) return;

  await updateDraft((current) => {
    switch (kind) {
      case "package":
        return { ...current, packages: moveEntry(current.packages, id, step) };
      case "capacity":
        return { ...current, capacities: moveEntry(current.capacities, id, step) };
      case "module":
        return {
          ...current,
          modules: moveEntry(current.modules, id, step, (a, b) => a.tier === b.tier),
        };
      case "integration":
        return { ...current, integrations: moveEntry(current.integrations, id, step) };
      default:
        return current;
    }
  });
  revalidateAdmin();
}
