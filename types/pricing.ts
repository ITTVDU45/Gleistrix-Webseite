/**
 * Datenvertrag der öffentlichen Preisseite.
 *
 * Alles, was hier steht, war vorher als Konstante in data/pricing.ts oder als
 * Literal in components/pricing/pricing-section.tsx hinterlegt und ist jetzt im
 * Adminbereich pflegbar. Die Rechenformel selbst bleibt bewusst im Code – nur
 * ihre Eingangswerte sind konfigurierbar.
 *
 * Preise sind Euro-Beträge mit höchstens zwei Nachkommastellen. Summiert wird
 * in Euro und am Ende einmal auf Cent gerundet (siehe calculateMonthlyTotal).
 */

export type ModuleTier = "standard" | "complex" | "ai";

/**
 * Nutzungsabhängiger Zusatzpreis eines Moduls – bisher fest auf das
 * Lagermodul verdrahtet (ARTICLE_PRICE × Artikel). Als Feld am Modul lässt es
 * sich jedem Modul geben, ohne dass die Modul-ID im Code auftaucht.
 */
export type ModuleUsagePricing = {
  /** Preis je Einheit und Monat, z. B. 0,5 € pro Artikel. */
  unitPrice: number;
  /** Beschriftung des Eingabefelds, z. B. „Aktiv verwaltete Artikel und QR-Codes". */
  label: string;
  /** Erläuterung unter der Beschriftung. */
  hint: string;
  /** Obergrenze des Schiebereglers; höhere Werte bleiben per Eingabe möglich. */
  sliderMax: number;
  /** Schrittweite von Regler und Zahlenfeld. */
  step: number;
};

export type PricingModule = {
  /** Fachlicher Schlüssel. Nach dem Anlegen unveränderlich – Mandanten referenzieren ihn. */
  id: string;
  tier: ModuleTier;
  title: string;
  description: string;
  /** Monatspreis in Euro. */
  price: number;
  features: string[];
  /** Zusatzleistungen, die das Modul über den Grundumfang hinaus mitbringt. */
  extras: string[];
  /** Bildpfad unter /public; ohne Bild zeigt die Karte nur das Icon. */
  imageSrc?: string;
  /** Schlüssel aus der Icon-Registry (lib/pricing/icons.ts). */
  iconKey: string;
  /** Archivierte Module verschwinden von der Preisseite, bleiben aber gebucht nutzbar. */
  isActive: boolean;
  usage?: ModuleUsagePricing;
};

/**
 * Buchbares Paket – der Startpunkt jeder Konfiguration.
 *
 * Ersetzt das frühere einzelne Basispaket: Grundpreis, Freikontingent,
 * Leistungen und Implementierungskosten hängen jetzt am Paket, nicht mehr
 * verteilt an Konfiguration und Projektkapazität.
 */
export type PricingPackage = {
  id: string;
  name: string;
  description: string;
  /** Monatlicher Grundpreis in Euro. */
  price: number;
  /** Im Grundpreis enthaltene Benutzer. */
  includedUsers: number;
  features: string[];
  /** Einmalige Implementierung in Euro. */
  implementationPrice: number;
  /** Vorauswahl im Konfigurator. Genau ein Paket trägt das Flag. */
  isDefault: boolean;
};

export type PricingCapacity = {
  id: string;
  label: string;
  shortLabel: string;
  /** Nur informativ und als CTA-Parameter – geht nicht in den Preis ein. */
  projects: number;
  /** Monatlicher Aufschlag in Euro. */
  monthlySurcharge: number;
  /** Vorauswahl im Konfigurator. Genau eine Stufe trägt das Flag. */
  isDefault: boolean;
};

export type PricingIntegration = {
  id: string;
  title: string;
  category: string;
  description: string;
  /** Logo-Pfad unter /public; ohne Bild werden die Initialen gezeigt. */
  src?: string;
  width?: number;
  height?: number;
  initials?: string;
};

/** Freitexte der Preisseite. Preisangaben stehen bewusst NICHT darin – sie werden berechnet. */
export type PricingTexts = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  configuratorTitle: string;
  configuratorDescription: string;
  /** Überschrift über der Paketauswahl. */
  packagesTitle: string;
  packagesDescription: string;
  usersTitle: string;
  capacityTitle: string;
  capacityDescription: string;
  standardModulesTitle: string;
  complexModulesTitle: string;
  aiModuleTitle: string;
  summaryTitle: string;
  ctaLabel: string;
  implementationTitle: string;
  implementationDescription: string;
  integrationsTitle: string;
  integrationsDescription: string;
};

export type PricingConfig = {
  /** Schemaversion des Preisdokuments – erlaubt spätere Migrationen. */
  version: number;
  packages: PricingPackage[];
  /** Preis je zusätzlichem Benutzer und Monat – gilt paketübergreifend. */
  extraUserPrice: number;
  capacities: PricingCapacity[];
  modules: PricingModule[];
  integrations: PricingIntegration[];
  /** Filterleiste der Integrationen. Der erste Eintrag ist der „Alle"-Filter. */
  integrationCategories: string[];
  texts: PricingTexts;
  updatedAt: string;
};
