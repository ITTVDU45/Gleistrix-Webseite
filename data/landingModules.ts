import type { LandingModule, LandingModuleTexts, ModuleVisualVariant } from "@/types/landing";

/** Kopf der Modul-Sektion, solange im Adminbereich nichts gepflegt wurde. */
export const DEFAULT_LANDING_MODULE_TEXTS: LandingModuleTexts = {
  eyebrow: "Module",
  title: "Eine Plattform. Alle Werkzeuge für den Bahnbetrieb.",
  description:
    "Jedes Modul löst ein konkretes Problem im Alltag von Bahndienstleistern – zusammen ergeben sie ein durchgängiges System.",
};

/**
 * Auslieferungszustand des Modul-Karussells.
 *
 * Solange im Adminbereich nichts gepflegt wurde, steht die Startseite damit
 * vollständig da – dieselbe Rolle wie DEFAULT_PRICING für die Preisseite.
 */
export const DEFAULT_LANDING_MODULES: LandingModule[] = [
  {
    id: "projektmanagement",
    title: "Projektmanagement",
    description:
      "Alle Bahnprojekte an einem Ort – vom Auftragseingang bis zur Abnahme. Status, Verantwortliche und Fortschritt sind jederzeit nachvollziehbar.",
    bullets: [
      "Projektakten mit Status und Meilensteinen",
      "Aufgaben und Verantwortlichkeiten im Blick",
      "Fortschritt in Echtzeit statt Wochenbericht",
    ],
    visual: "projekte",
    href: "/produkt/projektplanung-disposition",
    isActive: true,
  },
  {
    id: "plantafel",
    title: "Plantafel & Einsatzplanung",
    description:
      "Die digitale Plantafel zeigt Trupps, Maschinen und Schichten in einer Ansicht. Konflikte und Lücken werden sichtbar, bevor sie zum Problem werden.",
    bullets: [
      "Drag-and-drop-Planung über Wochen und Monate",
      "Doppelbelegungen werden automatisch erkannt",
      "Nacht- und Wochenendschichten sauber abgebildet",
    ],
    visual: "plantafel",
    href: "/produkt/kalender-einsatzuebersicht",
    isActive: true,
  },
  {
    id: "mitarbeiter-fahrzeuge",
    title: "Mitarbeiter & Fahrzeuge",
    description:
      "Qualifikationen, Verfügbarkeiten und Fristen zentral verwaltet – vom Sicherungsposten bis zum Zweiwegefahrzeug.",
    bullets: [
      "Qualifikationen und Tauglichkeiten mit Fristenwarnung",
      "Fahrzeuge, Wartung und HU-Termine im Blick",
      "Rollen und Berechtigungen pro Team",
    ],
    visual: "team",
    href: "/produkt/mitarbeiterverwaltung",
    isActive: true,
  },
  {
    id: "dokumentenmanagement",
    title: "Dokumentenmanagement",
    description:
      "Pläne, Nachweise und Protokolle liegen revisionssicher in der Projektakte – statt verstreut in Postfächern und Ordnern.",
    bullets: [
      "Revisionssichere Ablage pro Projekt",
      "Freigaben und Versionen nachvollziehbar",
      "Bei Prüfungen in Sekunden auskunftsfähig",
    ],
    visual: "dokumente",
    href: "/produkt/dokumentenmanagement",
    isActive: true,
  },
  {
    id: "lagerverwaltung",
    title: "Lagerverwaltung",
    description:
      "Material, Geräte und Sicherungstechnik mit Beständen und Reservierungen – damit auf der Baustelle nichts fehlt.",
    bullets: [
      "Bestände und Mindestmengen in Echtzeit",
      "Material direkt dem Projekt zuordnen",
      "Geräte- und Prüfhistorie dokumentiert",
    ],
    visual: "lager",
    isActive: true,
  },
  {
    id: "abrechnung",
    title: "Abrechnung & vorbereitende Buchhaltung",
    description:
      "Erfasste Leistungen, Stunden und Belege fließen direkt in die Abrechnung – geprüft, vollständig und übergabefertig für die Buchhaltung.",
    bullets: [
      "Leistungsnachweise automatisch zusammengeführt",
      "Rechnungsentwürfe pro Projekt und Zeitraum",
      "Saubere Übergabe an Steuerberater und DATEV-Prozesse",
    ],
    visual: "abrechnung",
    href: "/produkt/rechnungsstellung",
    isActive: true,
  },
  {
    id: "ki-agenten",
    title: "KI-Agenten",
    description:
      "Digitale Assistenten übernehmen vorbereitende Arbeit: Leistungsverzeichnisse lesen, Berichte erstellen, Ausschreibungen auswerten.",
    bullets: [
      "LV-Analyse und Angebotsvorbereitung",
      "Automatische Projekt- und Tagesberichte",
      "Ausschreibungs- und Abrechnungsprüfung",
    ],
    visual: "ki",
    href: "#ki-agenten",
    isActive: true,
  },
];

/** Auswahl der Rückfall-Illustration im Adminformular. */
export const VISUAL_LABEL: Record<ModuleVisualVariant, string> = {
  projekte: "Projektliste",
  plantafel: "Plantafel",
  team: "Team",
  dokumente: "Dokumente",
  lager: "Lager",
  abrechnung: "Abrechnung",
  ki: "KI-Agenten",
};

export const VISUAL_KEYS = Object.keys(VISUAL_LABEL) as ModuleVisualVariant[];
