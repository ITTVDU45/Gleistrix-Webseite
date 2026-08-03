import { DEFAULT_PRICING, migratePricing } from "@/data/pricing";
import { isIconKey } from "@/lib/pricing/icons";
import type { PricingConfig, PricingModule } from "@/types/pricing";
import { bootstrap } from "./db/bootstrap";
import { patchFileStore, readFileStore } from "./db/file-store";
import * as pricingDb from "./db/pricing";
import { isMongoConfigured } from "./mongo";
import { readStore } from "./store";

/**
 * Preisseite als pflegbarer Stand.
 *
 * Zwei Stände: der ENTWURF wird im Admin bearbeitet, eine FREIGABE ist das, was
 * Kunden sehen. Ohne Freigabe ändert sich die öffentliche Seite nicht – ein
 * halb gepflegter Modulkatalog geht damit nie live.
 *
 * Gegen MongoDB liegt der Entwurf zerlegt in den pricing_*-Collections; jede
 * Freigabe wird als vollständiger Schnappschuss nach pricing_releases
 * geschrieben. Ohne Datenbank bleiben beide Stände im JSON-Gesamtdokument.
 */

export async function getDraftPricing(): Promise<PricingConfig> {
  if (!isMongoConfigured()) {
    const store = await readFileStore();
    return store.pricingDraft ? migratePricing(store.pricingDraft) : DEFAULT_PRICING;
  }

  await bootstrap();
  const draft = await pricingDb.readDraft();
  if (draft) return draft;

  // Erster Aufruf gegen leere Collections: den Auslieferungszustand einmalig
  // hineinschreiben, damit ab hier ausschließlich im Admin gepflegt wird.
  await pricingDb.writeDraft(DEFAULT_PRICING);
  return DEFAULT_PRICING;
}

export async function getPublishedPricing(): Promise<PricingConfig> {
  if (!isMongoConfigured()) {
    const store = await readFileStore();
    return store.pricingPublished ? migratePricing(store.pricingPublished) : DEFAULT_PRICING;
  }

  await bootstrap();
  return (await pricingDb.latestRelease()) ?? DEFAULT_PRICING;
}

/** Ändert den Entwurf unveränderlich und stempelt ihn. */
export async function updateDraft(
  patch: (config: PricingConfig) => PricingConfig,
): Promise<PricingConfig> {
  const current = await getDraftPricing();
  const next: PricingConfig = { ...patch(current), updatedAt: new Date().toISOString() };

  if (isMongoConfigured()) {
    await pricingDb.writeDraftChanges(current, next);
    return next;
  }

  await patchFileStore((store) => ({ next: { ...store, pricingDraft: next }, result: undefined }));
  return next;
}

/** Schreibt den Entwurf als Schnappschuss in die Freigabe-Historie. */
export async function publishDraft(): Promise<PricingConfig> {
  // Ohne Änderung durchreichen: setzt updatedAt und liefert den Entwurf zurück.
  const published = await updateDraft((config) => config);

  if (isMongoConfigured()) {
    await pricingDb.insertRelease(published);
    return published;
  }

  await patchFileStore((store) => ({
    next: { ...store, pricingPublished: published },
    result: undefined,
  }));
  return published;
}

/** Verwirft den Entwurf und setzt ihn auf den freigegebenen Stand zurück. */
export async function discardDraft(): Promise<void> {
  const published = await getPublishedPricing();

  if (isMongoConfigured()) {
    await pricingDb.writeDraft(published);
    return;
  }

  await patchFileStore((store) => ({
    next: { ...store, pricingDraft: published },
    result: undefined,
  }));
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
