import type { Company, Package } from "@/types/admin";
import type { ModuleTier, PricingConfig, PricingModule } from "@/types/pricing";

export type { ModuleTier };

/** Modul aus dem Preiskatalog – identisch zum öffentlichen Typ, nur klarer benannt. */
export type CatalogModule = PricingModule;

export const TIER_LABEL: Record<ModuleTier, string> = {
  standard: "Standardmodul",
  complex: "Komplexmodul",
  ai: "KI-Modul",
};

const TIER_ORDER: ModuleTier[] = ["standard", "complex", "ai"];

/**
 * Modulkatalog aus der Preiskonfiguration.
 *
 * Die Konfiguration kommt als Parameter herein, nicht per Import: der Store
 * liest das Dateisystem und wäre in Client-Komponenten (z. B. NewPackageForm)
 * nicht ladbar. Server-Seiten holen die Konfiguration und reichen sie durch.
 *
 * Archivierte Module bleiben enthalten – Mandanten können sie gebucht haben.
 */
export function moduleCatalog(config: PricingConfig): CatalogModule[] {
  return [...config.modules].sort(
    (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier),
  );
}

export function getModule(config: PricingConfig, id: string): CatalogModule | undefined {
  return config.modules.find((module) => module.id === id);
}

export function moduleTitle(config: PricingConfig, id: string): string {
  return getModule(config, id)?.title ?? id;
}

/**
 * Tatsächlich nutzbare Module: Paketumfang + Einzelfreigaben − Sperren.
 * Ein gesperrtes Unternehmen hat gar keine aktiven Module.
 */
export function effectiveModuleIds(
  config: PricingConfig,
  company: Company,
  pkg: Package | null,
): string[] {
  if (company.status === "suspended") return [];

  const granted = new Set([...(pkg?.moduleIds ?? []), ...company.extraModuleIds]);
  for (const blocked of company.blockedModuleIds) granted.delete(blocked);

  return moduleCatalog(config)
    .filter((module) => granted.has(module.id))
    .map((module) => module.id);
}

/** Woher die Freigabe kommt – für die Anzeige auf der Unternehmensdetailseite. */
export type ModuleGrantSource = "package" | "extra" | "blocked" | "none";

export function moduleGrantSource(
  moduleId: string,
  company: Company,
  pkg: Package | null,
): ModuleGrantSource {
  if (company.blockedModuleIds.includes(moduleId)) return "blocked";
  if (pkg?.moduleIds.includes(moduleId)) return "package";
  if (company.extraModuleIds.includes(moduleId)) return "extra";
  return "none";
}
