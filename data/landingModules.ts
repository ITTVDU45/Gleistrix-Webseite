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
      "Projektakten mit Status, Laufzeit und Ansprechpartner",
      "Leistungen mit Positionen, Menge und Preis",
      "Projektanlage aus DB-Leistungsanfragen per KI",
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
      "Funktionen, Abwesenheiten und Fahrzeuge zentral verwaltet – vom Sicherungsposten bis zum Zweiwegefahrzeug.",
    bullets: [
      "Funktionen wie SIPO, Sakra und BüP je Mitarbeiter",
      "Fahrzeuge mit Zustand, Zuordnung und Tageskosten",
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
      "Lieferscheine, Nachweise und Protokolle liegen am Projekt – statt verstreut in Postfächern und Ordnern.",
    bullets: [
      "Ablage am Projekt, nach Dokumenttyp",
      "Anbindung an OneDrive und SharePoint",
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
      "Material, Geräte und Sicherungstechnik mit Beständen, Ausgaben und Prüfterminen – damit auf der Baustelle nichts fehlt.",
    bullets: [
      "Bestände und Mindestmengen in Echtzeit",
      "Ausgabe mit geplanter Rückgabe, mobil per QR-Code",
      "Wartungen und TÜV-Termine mit Fälligkeit",
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
      "Freigegebene Stunden als Abrechnungspositionen",
      "Abrechnung je Projekt mit PDF-Ausgabe",
      "Buchungsdaten und Belege an DATEV übergeben",
    ],
    visual: "abrechnung",
    href: "/produkt/rechnungsstellung",
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
