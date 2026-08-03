import { DEFAULT_PRICING, migratePricing } from "@/data/pricing";
import { isIconKey } from "@/lib/pricing/icons";
import type { PricingConfig, PricingModule } from "@/types/pricing";
import { readStore, writeStore } from "./store";

/**
 * Preisseite als pflegbares Dokument.
 *
 * Zwei Stände: `pricingDraft` wird im Admin bearbeitet, `pricingPublished` ist
 * das, was Kunden sehen. Ohne Freigabe ändert sich die öffentliche Seite nicht –
 * ein halb gepflegter Modulkatalog geht damit nie live.
 */

export async function getDraftPricing(): Promise<PricingConfig> {
  const store = await readStore();
  return store.pricingDraft ? migratePricing(store.pricingDraft) : DEFAULT_PRICING;
}

export async function getPublishedPricing(): Promise<PricingConfig> {
  const store = await readStore();
  return store.pricingPublished ? migratePricing(store.pricingPublished) : DEFAULT_PRICING;
}

/** Ändert den Entwurf unveränderlich und stempelt ihn. */
export async function updateDraft(
  patch: (config: PricingConfig) => PricingConfig,
): Promise<PricingConfig> {
  const store = await readStore();
  const current = store.pricingDraft ? migratePricing(store.pricingDraft) : DEFAULT_PRICING;
  const next: PricingConfig = { ...patch(current), updatedAt: new Date().toISOString() };

  await writeStore({ ...store, pricingDraft: next });
  return next;
}

export async function publishDraft(): Promise<PricingConfig> {
  const store = await readStore();
  const draft = store.pricingDraft ? migratePricing(store.pricingDraft) : DEFAULT_PRICING;
  const published: PricingConfig = { ...draft, updatedAt: new Date().toISOString() };

  await writeStore({ ...store, pricingPublished: published, pricingDraft: published });
  return published;
}

/** Verwirft den Entwurf und setzt ihn auf den freigegebenen Stand zurück. */
export async function discardDraft(): Promise<void> {
  const store = await readStore();
  const published = store.pricingPublished ? migratePricing(store.pricingPublished) : DEFAULT_PRICING;
  await writeStore({ ...store, pricingDraft: published });
}

/** Gibt es unveröffentlichte Änderungen? Vergleicht ohne den Zeitstempel. */
export function hasUnpublishedChanges(draft: PricingConfig, published: PricingConfig): boolean {
  const strip = ({ updatedAt: _ignored, ...rest }: PricingConfig) => rest;
  return JSON.stringify(strip(draft)) !== JSON.stringify(strip(published));
}

/* ------------------------------------------------------------- Validierung */

export type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

/** Preise: nicht negativ, endlich, höchstens zwei Nachkommastellen. */
export function parsePrice(raw: string, label: string): ParseResult<number> {
  const normalized = raw.replace(",", ".").trim();
  if (normalized === "") return { ok: false, error: `${label} fehlt.` };

  const value = Number(normalized);
  if (!Number.isFinite(value)) return { ok: false, error: `${label} ist keine gültige Zahl.` };
  if (value < 0) return { ok: false, error: `${label} darf nicht negativ sein.` };
  // Toleranz, weil value * 100 in Gleitkomma nie exakt ganzzahlig wird (19.99 → 1998.9999…).
  if (Math.abs(value * 100 - Math.round(value * 100)) > 1e-6) {
    return { ok: false, error: `${label} darf höchstens zwei Nachkommastellen haben.` };
  }
  return { ok: true, value: Math.round(value * 100) / 100 };
}

/** Mengen: ganzzahlig und mindestens `min`. */
export function parseCount(raw: string, label: string, min = 0): ParseResult<number> {
  const value = Number.parseInt(raw.trim(), 10);
  if (!Number.isFinite(value)) return { ok: false, error: `${label} ist keine gültige Zahl.` };
  if (value < min) return { ok: false, error: `${label} muss mindestens ${min} sein.` };
  return { ok: true, value };
}

/** Zeilenweise Eingabe → Liste, leere Zeilen fallen weg. */
export function parseLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const ID_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

export function validateModuleId(id: string, taken: string[]): ParseResult<string> {
  if (id.length < 2) return { ok: false, error: "Die Kennung braucht mindestens 2 Zeichen." };
  if (!ID_PATTERN.test(id)) {
    return { ok: false, error: "Nur Kleinbuchstaben, Ziffern und Bindestriche erlaubt." };
  }
  if (taken.includes(id)) return { ok: false, error: `„${id}" ist bereits vergeben.` };
  return { ok: true, value: id };
}

export function validateIconKey(iconKey: string): ParseResult<string> {
  if (!isIconKey(iconKey)) return { ok: false, error: "Unbekanntes Icon." };
  return { ok: true, value: iconKey };
}

/* -------------------------------------------------- Referentielle Integrität */

export type ModuleUsage = {
  /** Mandanten-Pakete, die das Modul enthalten. */
  packages: string[];
  /** Unternehmen mit Einzelfreigabe oder Sperre auf das Modul. */
  companies: string[];
};

/**
 * Wo ein Modul außerhalb der Preisseite referenziert wird.
 *
 * Modul-IDs sind Fremdschlüssel: Mandanten-Pakete und Unternehmen speichern sie.
 * Ein gelöschtes Modul würde einem Kunden still die Freigabe entziehen – deshalb
 * darf nur gelöscht werden, was nirgends referenziert ist. Alles andere wird
 * archiviert.
 */
export async function moduleUsage(moduleId: string): Promise<ModuleUsage> {
  const store = await readStore();

  return {
    packages: store.packages
      .filter((pkg) => pkg.moduleIds.includes(moduleId))
      .map((pkg) => pkg.name),
    companies: store.companies
      .filter(
        (company) =>
          company.extraModuleIds.includes(moduleId) ||
          company.blockedModuleIds.includes(moduleId),
      )
      .map((company) => company.name),
  };
}

export function isModuleInUse(usage: ModuleUsage): boolean {
  return usage.packages.length > 0 || usage.companies.length > 0;
}

/** Alle Module inklusive archivierter – der Admin muss auch die sehen. */
export function allModules(config: PricingConfig): PricingModule[] {
  return config.modules;
}
