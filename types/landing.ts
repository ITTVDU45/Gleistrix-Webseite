/**
 * Inhalte der Startseite, die im Adminbereich gepflegt werden.
 *
 * Bisher standen die Module als Konstante in components/landing/ModulesSection.
 * Titel, Beschreibung, Bild und Reihenfolge kommen jetzt aus der Ablage; die
 * Illustrationen bleiben im Code, weil sie gezeichnetes Markup sind und kein
 * Inhalt.
 */

export type ModuleVisualVariant =
  | "projekte"
  | "plantafel"
  | "team"
  | "dokumente"
  | "lager"
  | "abrechnung"
  | "ki";

/** Kopf der Modul-Sektion. Getrennt von den Folien, weil er einmal existiert. */
export type LandingModuleTexts = {
  /** Kleine Marke über der Überschrift. */
  eyebrow: string;
  title: string;
  description: string;
};

export type LandingModule = {
  /** Fachlicher Schlüssel, aus dem Titel abgeleitet. Nach dem Anlegen unverändert. */
  id: string;
  title: string;
  description: string;
  /** Stichpunkte unter der Beschreibung. */
  bullets: string[];
  /** Hochgeladenes Bild (/api/assets/…). Ohne Bild greift die Illustration. */
  imageSrc?: string;
  /** Rückfall-Illustration, solange kein Bild hinterlegt ist. */
  visual: ModuleVisualVariant;
  /** Ziel des „Mehr erfahren“-Links; ohne Angabe entfällt der Link. */
  href?: string;
  /** Ausgeblendete Module bleiben erhalten, erscheinen aber nicht im Karussell. */
  isActive: boolean;
};
