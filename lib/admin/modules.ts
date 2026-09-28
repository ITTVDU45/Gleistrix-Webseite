import type { Company, Package, Purchase } from "@/types/admin";
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
 * Kennung des Grundumfangs. Die App schaltet darüber Dashboard, Projekte,
 * Zeiterfassung, Mitarbeiter und Statistiken frei.
 *
 * Hier eine Paket-, keine Modulkennung – deshalb steht sie in keinem Modulsatz
 * und muss ausdrücklich mitgemeldet werden. Fehlte sie, bekäme ein Mandant ohne
 * Zusatzmodule eine leere Liste, und die App läse sie als Zugangsstopp.
 */
export const BASE_PACKAGE_ID = "basispaket";

/**
 * Katalogmodule, für die es in der App noch keine Funktion gibt.
 *
 * Sie lassen sich trotzdem freigeben und werden gemeldet – die App kennt die
 * Kennungen und schaltet nur nichts frei. Der Modul-Tab sagt das dazu, sonst
 * sucht jemand nach einer Wirkung, die es nicht geben kann.
 */
const WITHOUT_APP_FUNCTION = new Set(["qualifications", "employee-documents", "templates", "deadlines"]);

export function hasAppFunction(moduleId: string): boolean {
  return !WITHOUT_APP_FUNCTION.has(moduleId);
}

/** Woher ein Modul kommt – für die Anzeige auf der Unternehmensdetailseite. */
export type ModuleSource = "package" | "purchase" | "addon" | "extra" | "blocked" | "none";

/** Wirkt ein Modul mit dieser Quelle, solange der Mandant nicht gesperrt ist? */
export function isEffective(source: ModuleSource): boolean {
  return source !== "blocked" && source !== "none";
}

export type ModuleAccess = {
  /** Wirksame Katalogmodule ohne Grundumfang – der Zähler im Adminbereich. */
  moduleIds: string[];
  /**
   * Was die App bekommt: `basispaket` zuerst, dann `moduleIds`. Ein gesperrter
   * Mandant bekommt eine leere Liste – das ist der Zugangsstopp.
   */
  reported: string[];
  /** Quelle eines Moduls, unabhängig von einer Sperre des ganzen Mandanten. */
  sourceOf: (moduleId: string) => ModuleSource;
};

/**
 * DIE Regel für den Modulumfang eines Mandanten – für die Meldung an die App
 * UND für jede Anzeige im Adminbereich. Zwei Rechenwege drifteten auseinander:
 * Genau so zeigte der Modul-Tab „Einzeln freigegeben", während in der App
 * nichts ankam.
 *
 * Basis ist der Grundkauf, ohne ihn das Mandantenpaket. Dazu kommen Zubuchungen
 * und Einzelfreigaben; eine Sperre zieht von ALLEM ab, auch vom Kauf und von
 * Zubuchungen – sonst stünde ein gesperrtes Modul trotzdem in der App.
 * Eingefroren am Kauf bleiben Preis, Paket und Benutzerzahl, nicht der Umfang.
 *
 * Unbekannte Kennungen fallen heraus: Die App lehnte sie ab, und im Protokoll
 * stünde ein Fehler statt der Ursache.
 *
 * @param input.purchases Nur die zählenden Käufe, neueste zuerst (siehe
 *   `zaehlendeKaeufe`). Welcher Kauf zählt, entscheidet der Aufrufer.
 */
export function moduleAccess(input: {
  company: Company;
  pricing: PricingConfig;
  tenantPackage: Package | null;
  purchases: Purchase[];
}): ModuleAccess {
  const { company, pricing, tenantPackage, purchases } = input;

  const grundkauf = purchases.find((purchase) => purchase.kind === "paket") ?? null;
  const basis = new Set(grundkauf ? grundkauf.moduleIds : (tenantPackage?.moduleIds ?? []));
  const zubuchungen = new Set(
    purchases.filter((purchase) => purchase.kind === "zubuchung").flatMap((p) => p.moduleIds),
  );

  const sourceOf = (moduleId: string): ModuleSource => {
    if (company.blockedModuleIds.includes(moduleId)) return "blocked";
    if (basis.has(moduleId)) return grundkauf ? "purchase" : "package";
    if (zubuchungen.has(moduleId)) return "addon";
    if (company.extraModuleIds.includes(moduleId)) return "extra";
    return "none";
  };

  if (company.status === "suspended") return { moduleIds: [], reported: [], sourceOf };

  const moduleIds = moduleCatalog(pricing)
    .map((module) => module.id)
    .filter((id) => isEffective(sourceOf(id)));

  return { moduleIds, reported: [BASE_PACKAGE_ID, ...moduleIds], sourceOf };
}
