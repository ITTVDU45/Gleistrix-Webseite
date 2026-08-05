"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { DEFAULT_PRICING } from "@/data/pricing";
import { login, logout } from "@/lib/admin/auth";
import {
  APP_SYNC_ISSUE_TEXT,
  DEFAULT_DEMO_DAYS,
  MAX_DEMO_DAYS,
  appSyncIssue,
  grantDemo,
  revokeDemo,
} from "@/lib/admin/app-sync";
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
  deleteContact,
  getLead,
  getPurchases,
  insertCompany,
  insertContact,
  insertPackage,
  listContacts,
  readStore,
  recordSupportAccess,
  setBrochureSent,
  updateCompany,
  updateContact,
  updateDemoAccess,
  updateLead,
  updatePackage,
} from "@/lib/admin/store";
import { createSupportLink } from "@/lib/admin/support";
import {
  APP_URL,
  applyStepResult,
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
  revalidatePath("/admin/kontakte");
  revalidatePath("/admin/broschuere");
  revalidatePath("/admin/demo-zugang");
  revalidatePath("/admin/kaeufe");
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

  await insertCompany(company);
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

  const updated = await updateCompany(companyId, (company) =>
    applyStepResult(company, stepId as ProvisioningStepId, {
      status,
      updatedAt: new Date().toISOString(),
    }),
  );

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

  if (company.status === "provisioning") {
    return { error: "Die Provisionierung dieses Mandanten ist noch nicht abgeschlossen." };
  }

  // Alle Mandanten teilen sich eine App – die Kennung im Token sagt der App,
  // wessen Daten der Support sehen darf.
  const link = createSupportLink(company.slug, APP_URL, password, reason);
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

  await insertPackage(pkg);
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

/* ---------------------------------------------------------------- Kontakte */

/** Neuer Kontakt bei leerer contactId, sonst Änderung am bestehenden. */
export async function saveContactAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const contactId = field(data, "contactId");
  const company = field(data, "company");
  const contactName = field(data, "contactName");
  const email = field(data, "email");

  if (!company) return { error: "Firmenname fehlt." };
  if (!contactName) return { error: "Bitte den Ansprechpartner angeben." };
  if (!email.includes("@")) return { error: "Bitte eine gültige E-Mail-Adresse angeben." };

  const values = {
    company,
    contactName,
    email,
    phone: field(data, "phone") || undefined,
    role: field(data, "role") || undefined,
    note: field(data, "note") || undefined,
    companyId: field(data, "companyId") || null,
  };

  if (contactId) {
    // Herkunft und leadId bleiben stehen – sie beschreiben, woher der Kontakt
    // kam, nicht seinen aktuellen Stand.
    const updated = await updateContact(contactId, (current) => ({ ...current, ...values }));
    if (!updated) return { error: "Unbekannter Kontakt." };

    revalidateAdmin();
    return { success: `Kontakt „${contactName}“ gespeichert.` };
  }

  await insertContact({
    id: `ctc_${Date.now().toString(36)}`,
    ...values,
    source: "manuell",
    leadId: null,
    createdAt: new Date().toISOString(),
  });
  revalidateAdmin();
  return { success: `Kontakt „${contactName}“ angelegt.` };
}

export async function deleteContactAction(data: FormData): Promise<void> {
  const contactId = field(data, "contactId");
  if (!contactId) return;

  await deleteContact(contactId);
  revalidateAdmin();
}

/**
 * Übernimmt eine Anfrage ins Kontaktverzeichnis.
 *
 * Der Lead gilt damit als gewonnen: Wer im Verzeichnis steht, ist kein offener
 * Vorgang mehr. Die Anfrage selbst bleibt als Historie bestehen.
 */
export async function createContactFromLeadAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const leadId = field(data, "leadId");

  const lead = await getLead(leadId);
  if (!lead) return { error: "Unbekannte Anfrage." };

  // ponytail: Prüfung im Anwendungscode statt eines partiellen Unique-Index.
  // Bei einer Handvoll Admins ist das Zeitfenster bis zum Insert unkritisch;
  // Upgrade-Pfad wäre ein Unique-Index auf leadId für source "lead".
  const contacts = await listContacts();
  if (contacts.some((contact) => contact.leadId === leadId)) {
    return { error: "Zu dieser Anfrage gibt es bereits einen Kontakt." };
  }

  await insertContact({
    id: `ctc_${Date.now().toString(36)}`,
    company: lead.company,
    contactName: lead.contactName,
    email: lead.email,
    phone: lead.phone,
    source: "lead",
    leadId,
    companyId: null,
    createdAt: new Date().toISOString(),
  });
  await updateLead(leadId, (current) => ({ ...current, status: "gewonnen" }));

  revalidateAdmin();
  return { success: `„${lead.contactName}“ ins Kontaktverzeichnis übernommen.` };
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
  const companyId = field(data, "companyId") || null;
  const email = field(data, "email").toLowerCase();
  const company = field(data, "company");
  const days = Number.parseInt(field(data, "days") || String(DEFAULT_DEMO_DAYS), 10);

  if (!email.includes("@")) return { error: "Bitte eine gültige E-Mail-Adresse angeben." };
  if (!company) return { error: "Bitte das Unternehmen angeben." };
  if (!Number.isFinite(days) || days < 1 || days > MAX_DEMO_DAYS) {
    return { error: `Laufzeit muss zwischen 1 und ${MAX_DEMO_DAYS} Tagen liegen.` };
  }

  const issue = appSyncIssue();
  if (issue) return { error: APP_SYNC_ISSUE_TEXT[issue] };

  const result = await grantDemo({ email, company, days });
  const now = new Date().toISOString();
  const id = `demo_${Date.now().toString(36)}`;

  if (!result.ok) {
    await addDemoAccess({
      id,
      leadId,
      companyId,
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
    companyId,
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

  // Wie bei Modulen: Ein gekauftes Paket bleibt stehen. Der Kauf hält seine
  // Kennung eingefroren – ohne das Paket zeigten Kaufseite und Meldung an die
  // App nur noch die technische Kennung statt des Namens.
  const purchases = await getPurchases();
  if (purchases.some((purchase) => purchase.packageId === packageId)) return;

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

  // Gekaufte Kapazitätsstufe bleibt stehen – gleicher Grund wie beim Paket.
  const purchases = await getPurchases();
  if (purchases.some((purchase) => purchase.capacityId === capacityId)) return;

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
      usage.purchases.length > 0 ? `Käufe: ${usage.purchases.length}` : "",
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

/* ------------------------------------------------------- Broschürenversand */

// Nachträglich angehängt, damit die Importliste oben unberührt bleibt.
// Namespace-Import: ein weiterer Name aus store.ts könnte sonst mit dem
// dortigen Block kollidieren.
import * as brochureStore from "@/lib/admin/store";
import { brochureFile, mailConfigIssue, sendMail } from "@/lib/admin/mail";
import { basename } from "node:path";

/**
 * Verschickt die Broschüre an den Anforderer und markiert die Anfrage als
 * versendet.
 *
 * Der Empfänger kommt aus dem gespeicherten Datensatz, nicht aus dem Formular –
 * sonst wäre der Adminbereich ein offenes Versandrelais.
 */
export async function sendBrochureAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const requestId = field(data, "requestId");
  const subject = field(data, "subject");
  const body = field(data, "body");

  if (!requestId) return { error: "Anfrage nicht erkannt." };
  if (!subject || !body) return { error: "Betreff und Text dürfen nicht leer sein." };

  const issue = mailConfigIssue();
  if (issue) return { error: issue };

  const request = (await brochureStore.getBrochureRequests()).find(
    (entry) => entry.id === requestId,
  );
  if (!request) return { error: "Diese Anforderung gibt es nicht mehr." };

  const { path } = brochureFile();

  try {
    await sendMail({
      to: request.email,
      subject,
      text: body,
      attachments: path ? [{ filename: basename(path), path }] : undefined,
    });
  } catch (error) {
    console.error(`Broschürenversand für ${requestId} fehlgeschlagen:`, error);
    return { error: "Der Versand ist fehlgeschlagen. Die Anfrage bleibt offen." };
  }

  await brochureStore.setBrochureSent(requestId, true);
  revalidateAdmin();

  return { success: `Broschüre an ${request.email} versendet.` };
}

/* --------------------------------------------------- Automatische Provisionierung */

import { getCompany as loadCompany } from "@/lib/admin/store";
import {
  MINIO_ISSUE_TEXT,
  createTenantBucket,
  minioIssue,
} from "@/lib/admin/provision/minio";
import {
  MONGO_ADMIN_ISSUE_TEXT,
  createTenantDatabase,
  createTenantUser,
  generateTenantPassword,
  mongoAdminIssue,
} from "@/lib/admin/provision/mongo";
import { registerTenant, registrationFor } from "@/lib/admin/app-sync";
import {
  addPurchase,
  getPackage,
  getPurchase,
  getPurchasesForCompany,
  updatePurchase,
} from "@/lib/admin/store";
import { purchaseFor } from "@/lib/admin/purchase";
import { formatPriceEUR } from "@/data/pricing";
import { getPublishedPricing } from "@/lib/admin/pricing";
import type { ProvisioningStepId, Purchase } from "@/types/admin";

/** Ergebnis eines Schritts, einheitlich für alle Anbieter. */
type StepOutcome = { ok: true; note: string } | { ok: false; error: string };

/**
 * Meldet den Mandanten an die App.
 *
 * Gibt es einen Kauf, gilt dessen eingefrorener Stand – Paket, Module und
 * Benutzerzahl zum Kaufzeitpunkt, nicht der heutige Stand der Preisliste. Die
 * Kauf-ID ist zugleich der Idempotency-Key, damit eine Wiederholung nach einem
 * Fehlschlag keinen zweiten Mandanten erzeugt.
 *
 * Scheitert der Aufruf, bleibt der Kauf erhalten: `status` geht auf
 * `fehlgeschlagen`, `syncError` hält die Meldung, und der Knopf unter
 * /admin/kaeufe wiederholt den Lauf.
 */
async function runAppSync(company: Company, forPurchase?: Purchase): Promise<StepOutcome> {
  const [purchases, pricing, tenantPackage] = await Promise.all([
    forPurchase ? Promise.resolve([forPurchase]) : getPurchasesForCompany(company.id),
    getPublishedPricing(),
    getPackage(company.packageId),
  ]);
  const purchase = purchases[0] ?? null;

  const registration = registrationFor({
    company,
    purchase,
    pricing,
    tenantPackage,
    gueltigBis: null,
  });

  const result = await registerTenant(registration, purchase?.id ?? company.id);
  const now = new Date().toISOString();

  if (purchase) {
    await updatePurchase(purchase.id, (current) => ({
      ...current,
      status: result.ok ? "freigegeben" : "fehlgeschlagen",
      syncedAt: result.ok ? now : current.syncedAt ?? null,
      syncError: result.ok ? null : result.error,
    }));
  }

  if (!result.ok) return result;

  const details = [
    result.tenantId ? `Mandant ${result.tenantId}` : null,
    result.einladungsLink ? `Einladungslink: ${result.einladungsLink}` : null,
  ].filter(Boolean);

  return {
    ok: true,
    note: `An ${registration.datenbank} gemeldet, ohne Zugangsdaten.${
      details.length > 0 ? ` ${details.join(" · ")}` : ""
    }`,
  };
}

/** Führt genau einen Provisionierungsschritt aus und hält das Ergebnis fest. */
export async function runProvisioningStepAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const companyId = field(data, "companyId");
  const stepId = field(data, "stepId") as ProvisioningStepId;

  const company = await loadCompany(companyId);
  if (!company) return { error: "Unbekanntes Unternehmen." };
  if (!company.provisioning.some((step) => step.id === stepId)) {
    return { error: "Unbekannter Schritt." };
  }

  const tenant = company.tenant;
  let outcome: StepOutcome;

  switch (stepId) {
    case "mongo-database": {
      const issue = mongoAdminIssue();
      if (issue) return { error: MONGO_ADMIN_ISSUE_TEXT[issue] };
      outcome = await createTenantDatabase(tenant);
      break;
    }
    case "mongo-role": {
      const issue = mongoAdminIssue();
      if (issue) return { error: MONGO_ADMIN_ISSUE_TEXT[issue] };
      // Das Passwort wird hier verworfen: Die App verbindet sich mit dem
      // Zugang aus ihrer eigenen Umgebung, nicht mit einem je Mandant erzeugten.
      const user = await createTenantUser(tenant, generateTenantPassword());
      outcome = user.ok
        ? { ok: true, note: user.note }
        : { ok: false, error: user.error };
      break;
    }
    case "minio-bucket": {
      const issue = minioIssue();
      if (issue) return { error: MINIO_ISSUE_TEXT[issue] };
      outcome = await createTenantBucket(tenant);
      break;
    }
    case "app-sync": {
      const issue = appSyncIssue();
      if (issue) return { error: APP_SYNC_ISSUE_TEXT[issue] };
      outcome = await runAppSync(company);
      break;
    }
    default:
      return { error: "Für diesen Schritt gibt es keine Automatik." };
  }

  await updateCompany(companyId, (current) =>
    applyStepResult(current, stepId, {
      status: outcome.ok ? "done" : "failed",
      note: outcome.ok ? outcome.note : outcome.error,
      updatedAt: new Date().toISOString(),
    }),
  );
  revalidateAdmin(companyId);

  return outcome.ok ? { success: outcome.note } : { error: outcome.error };
}

/**
 * Erfasst einen Kauf für einen Mandanten.
 *
 * Der Preis wird hier neu gerechnet und dann eingefroren – der Betrag aus dem
 * Formular ist nur Anzeige. Käme er aus dem Browser, bestimmte der Kunde, was er
 * zahlt.
 *
 * Jede Kennung wird gegen die FREIGEGEBENE Preisliste geprüft, nicht gegen den
 * Entwurf: Ein Kauf darf sich nicht auf ein Paket beziehen, das noch niemand
 * sehen konnte. Unbekannte Kennungen führen zum Abbruch statt stillschweigend zu
 * verschwinden – `calculatePrice` fiele sonst auf das Standardpaket zurück und
 * schriebe einen Preis fest, den niemand gewählt hat.
 */
export async function createPurchaseAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const companyId = field(data, "companyId");
  const packageId = field(data, "packageId");
  const capacityId = field(data, "capacityId");
  const users = Number.parseInt(field(data, "users") || "0", 10);

  const company = await loadCompany(companyId);
  if (!company) return { error: "Unbekanntes Unternehmen." };

  const pricing = await getPublishedPricing();

  if (!pricing.packages.some((pkg) => pkg.id === packageId)) {
    return { error: "Bitte ein freigegebenes Paket wählen." };
  }
  if (!pricing.capacities.some((capacity) => capacity.id === capacityId)) {
    return { error: "Bitte eine Kapazitätsstufe wählen." };
  }
  if (!Number.isFinite(users) || users < 1) {
    return { error: "Anzahl Benutzer muss mindestens 1 sein." };
  }

  const active = new Map(
    pricing.modules.filter((module) => module.isActive).map((module) => [module.id, module]),
  );
  const moduleIds = data
    .getAll("moduleIds")
    .filter((value): value is string => typeof value === "string");

  const unbekannt = moduleIds.filter((id) => !active.has(id));
  if (unbekannt.length > 0) {
    return { error: `Nicht freigegebene Module: ${unbekannt.join(", ")}.` };
  }

  // Mengen nur für Module, die überhaupt nach Nutzung abgerechnet werden.
  const usageAmounts: Record<string, number> = {};
  for (const moduleId of moduleIds) {
    const module = active.get(moduleId);
    if (!module?.usage) continue;

    const amount = Number.parseInt(field(data, `usage_${moduleId}`) || "0", 10);
    if (!Number.isFinite(amount) || amount < 0) {
      return { error: `Ungültige Menge für „${module.title}".` };
    }
    usageAmounts[moduleId] = amount;
  }

  const purchase = purchaseFor({
    id: `pur_${Date.now().toString(36)}`,
    companyId,
    selection: { packageId, users, capacityId, moduleIds, usageAmounts },
    config: pricing,
    createdAt: new Date().toISOString(),
  });

  await addPurchase(purchase);
  revalidateAdmin(companyId);

  return {
    success: `Kauf über ${formatPriceEUR(purchase.monthlyTotal)} pro Monat erfasst. Der Schritt „Mandant an die App melden" überträgt ihn.`,
  };
}

/**
 * Wiederholt die Meldung eines fehlgeschlagenen Kaufs an die App.
 *
 * Derselbe Weg wie der Provisionierungsschritt, nur von der Kaufseite aus –
 * inklusive Idempotency-Key, sodass ein bereits angelegter Mandant nicht
 * doppelt entsteht.
 */
export async function syncPurchaseAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const purchaseId = field(data, "purchaseId");

  const purchase = await getPurchase(purchaseId);
  if (!purchase) return { error: "Unbekannter Kauf." };

  const company = await loadCompany(purchase.companyId);
  if (!company) return { error: "Zu diesem Kauf gibt es kein Unternehmen mehr." };

  const issue = appSyncIssue();
  if (issue) return { error: APP_SYNC_ISSUE_TEXT[issue] };

  // Der angeklickte Kauf wird ausdrücklich durchgereicht: Ohne ihn nähme
  // runAppSync den neuesten des Unternehmens und meldete den falschen frei.
  const outcome = await runAppSync(company, purchase);

  // Auch den Schritt im Protokoll nachziehen – sonst steht dort „fehlgeschlagen“,
  // während der Kauf längst freigegeben ist.
  await updateCompany(company.id, (current) =>
    applyStepResult(current, "app-sync", {
      status: outcome.ok ? "done" : "failed",
      note: outcome.ok ? outcome.note : outcome.error,
      updatedAt: new Date().toISOString(),
    }),
  );
  revalidateAdmin(company.id);

  return outcome.ok ? { success: outcome.note } : { error: outcome.error };
}
