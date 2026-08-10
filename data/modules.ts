import {
  BarChart3,
  CalendarRange,
  Clock,
  FileText,
  FolderOpen,
  KanbanSquare,
  Package,
  Users,
  Wrench,
} from "lucide-react";

import type { Catalog, CatalogEntry } from "./catalog";

/**
 * Module der Plattform – Quelle für das Megamenü und die Detailseiten unter
 * /produkt/[slug].
 *
 * Die Slugs entsprechen den bisherigen Routen: Footer, Modul-Karussell der
 * Startseite und das Funktionsraster verweisen bereits dorthin.
 *
 * Abgrenzung zu data/landingModules.ts: dort steht der im Adminbereich
 * überschreibbare Inhalt des Startseiten-Karussells, hier die feste
 * Seitenstruktur der Marketingseiten.
 */
export const MODULES: CatalogEntry[] = [
  {
    slug: "projektplanung-disposition",
    title: "Projektplanung & Disposition",
    tagline: "Projekte, Ressourcen und Meilensteine",
    description:
      "Projekte anlegen und Ressourcen wie Technik, Fahrzeuge und Personal präzise zuweisen – ohne Doppelbelegungen und ohne Rückfragen per Telefon.",
    icon: KanbanSquare,
    group: "Planung & Steuerung",
    image: "/Einsatzvorbereitung & Logistik.png",
    highlights: [
      {
        title: "Eine Projektakte",
        text: "Auftrag, Beteiligte, Termine und Dokumente liegen an einem Ort statt in fünf Postfächern.",
      },
      {
        title: "Disposition per Drag-and-drop",
        text: "Personal, Fahrzeuge und Technik werden dem Einsatz direkt zugewiesen – mit Prüfung auf Konflikte.",
      },
      {
        title: "Fortschritt in Echtzeit",
        text: "Status und Meilensteine sind jederzeit sichtbar, statt erst im Wochenbericht aufzutauchen.",
      },
    ],
    bullets: [
      "Projekte mit Status, Meilensteinen und Verantwortlichen",
      "Ressourcen per Drag-and-drop disponieren",
      "Doppelbelegungen werden automatisch erkannt",
      "Sperrpausen und Bauabschnitte sauber abgebildet",
    ],
  },
  {
    slug: "kalender-einsatzuebersicht",
    title: "Plantafel & Einsatzübersicht",
    tagline: "Schichten, Termine und Trupps in einer Ansicht",
    description:
      "Alle Termine und Schichten übersichtlich in einer Plantafel – jederzeit aktuell und für jede Rolle passend gefiltert.",
    icon: CalendarRange,
    group: "Planung & Steuerung",
    image: "/Standortbezogene Disposition.png",
    highlights: [
      {
        title: "Woche, Monat, Trupp",
        text: "Zwischen Zeiträumen und Ansichten wechseln, ohne die Planung neu aufbauen zu müssen.",
      },
      {
        title: "Nacht und Wochenende",
        text: "Schichten über Mitternacht und an Feiertagen werden korrekt gerechnet statt manuell korrigiert.",
      },
      {
        title: "Live für alle",
        text: "Änderungen der Disposition erreichen das Team sofort – auch mobil auf der Baustelle.",
      },
    ],
    bullets: [
      "Alle Einsätze und Schichten in einer Ansicht",
      "Nacht- und Wochenendschichten sauber abgebildet",
      "Live-Aktualisierung für Disposition und Team",
      "Lücken und Überschneidungen sofort sichtbar",
    ],
  },
  {
    slug: "reports-auswertungen",
    title: "Reports & Auswertungen",
    tagline: "Kennzahlen zu Auslastung und Kosten",
    description:
      "Echtzeitdaten für fundierte Entscheidungen und transparente Abläufe – von der Auslastung bis zum Deckungsbeitrag pro Projekt.",
    icon: BarChart3,
    group: "Planung & Steuerung",
    image: "/reports.png",
    highlights: [
      {
        title: "Auslastung sehen",
        text: "Wie voll ist der nächste Monat wirklich? Die Antwort steht im Dashboard, nicht in einer Tabelle.",
      },
      {
        title: "Deckungsbeiträge",
        text: "Erlöse und Kosten je Projekt gegenübergestellt – auch während das Projekt noch läuft.",
      },
      {
        title: "Exportierbar",
        text: "Auswertungen lassen sich für Geschäftsführung, Bank oder Auftraggeber herausziehen.",
      },
    ],
    bullets: [
      "Kennzahlen zu Projekten, Auslastung und Kosten",
      "Deckungsbeiträge pro Projekt und Zeitraum",
      "Transparente Abläufe für die Geschäftsführung",
      "Auswertungen als Datei für Berichte und Termine",
    ],
  },
  {
    slug: "mitarbeiterverwaltung",
    title: "Mitarbeiterverwaltung",
    tagline: "Qualifikationen, Fristen und Abwesenheiten",
    description:
      "Personal anlegen, bearbeiten und verwalten – inklusive Qualifikationen, Urlaubsplanung und Abwesenheiten, mit Warnung vor ablaufenden Nachweisen.",
    icon: Users,
    group: "Team & Ressourcen",
    image: "/Sicherungspersonal%20gleis.png",
    highlights: [
      {
        title: "Qualifikationen im Blick",
        text: "SiPo, SaKra oder HIB samt Tauglichkeiten – mit Frist und Warnung vor dem Ablauf.",
      },
      {
        title: "Abwesenheiten integriert",
        text: "Urlaub und Krankheit stehen direkt in der Plantafel, nicht in einer zweiten Liste.",
      },
      {
        title: "Rollen und Rechte",
        text: "Jede Rolle sieht genau das, was sie braucht – von der Disposition bis zum Trupp.",
      },
    ],
    bullets: [
      "Qualifikationen und Tauglichkeiten mit Fristenwarnung",
      "Urlaubs- und Abwesenheitsplanung integriert",
      "Rollen und Berechtigungen pro Team",
      "Personalakte mit Nachweisen und Dokumenten",
    ],
  },
  {
    slug: "fahrzeug-technik",
    title: "Fahrzeuge & Technik",
    tagline: "Prüffristen, Wartung und Zuordnung",
    description:
      "Fahrzeuge und Geräte zentral erfassen, warten und Einsätzen zuordnen – inklusive Prüffristen und vollständiger Wartungshistorie.",
    icon: Wrench,
    group: "Team & Ressourcen",
    image: "/Fahrzeugplanung.png",
    highlights: [
      {
        title: "Fristen laufen nicht ab",
        text: "HU, UVV und Prüftermine melden sich rechtzeitig, statt am Einsatztag aufzufallen.",
      },
      {
        title: "Historie dokumentiert",
        text: "Wartungen und Reparaturen bleiben nachvollziehbar – auch Jahre später.",
      },
      {
        title: "Direkt disponierbar",
        text: "Zweiwegefahrzeuge und Sicherungstechnik werden dem Einsatz zugeordnet wie Personal.",
      },
    ],
    bullets: [
      "Fahrzeuge, HU- und Prüftermine mit Fristenwarnung",
      "Geräte- und Wartungshistorie dokumentiert",
      "Direkte Zuordnung zu Projekten und Einsätzen",
      "Verfügbarkeiten und Standorte im Überblick",
    ],
  },
  {
    slug: "lagerverwaltung",
    title: "Lagerverwaltung",
    tagline: "Bestände, Reservierungen und Prüfhistorie",
    description:
      "Material, Geräte und Sicherungstechnik mit Beständen und Reservierungen verwalten – damit auf der Baustelle nichts fehlt.",
    icon: Package,
    group: "Team & Ressourcen",
    image: "/Einsatzvorbereitung & Logistik.png",
    highlights: [
      {
        title: "Bestand in Echtzeit",
        text: "Was im Lager liegt und was auf der Baustelle ist, steht in derselben Ansicht.",
      },
      {
        title: "Mindestmengen",
        text: "Unterschreitungen melden sich, bevor der Nachschub zum Engpass wird.",
      },
      {
        title: "Dem Projekt zugeordnet",
        text: "Entnahmen laufen auf das Projekt und tauchen später in der Abrechnung wieder auf.",
      },
    ],
    bullets: [
      "Bestände und Mindestmengen in Echtzeit",
      "Material direkt dem Projekt zuordnen",
      "Geräte- und Prüfhistorie dokumentiert",
      "Reservierungen für geplante Einsätze",
    ],
  },
  {
    slug: "zeiterfassung-stundenzettel",
    title: "Zeiterfassung & Stundenzettel",
    tagline: "Mobil erfasst, prüffähig abgelegt",
    description:
      "Zeiten digital, mobil und prüffähig erfassen – direkt mit Projekten verknüpft und ohne Abtippen in der Verwaltung.",
    icon: Clock,
    group: "Nachweise & Abrechnung",
    image: "/Zeiterfassung.png",
    highlights: [
      {
        title: "Erfassung vor Ort",
        text: "Das Team trägt Zeiten am Einsatzort ein – der Zettel im Auto entfällt.",
      },
      {
        title: "Freigabe statt Nacharbeit",
        text: "Die Verwaltung prüft und gibt frei, statt Zettel abzutippen und zu korrigieren.",
      },
      {
        title: "Direkt weiterverwendet",
        text: "Freigegebene Stunden fließen ohne Zwischenschritt in Abrechnung und Lohn.",
      },
    ],
    bullets: [
      "Mobile Zeiterfassung direkt auf der Baustelle",
      "Prüffähige Stundenzettel ohne Nacharbeit",
      "Nahtlose Verknüpfung mit Projekten und Abrechnung",
      "Zuschläge für Nacht, Wochenende und Feiertag",
    ],
  },
  {
    slug: "dokumentenmanagement",
    title: "Dokumentenmanagement",
    tagline: "Revisionssicher in der Projektakte",
    description:
      "Wichtige Unterlagen zentral speichern, teilen und revisionssicher archivieren – bei Prüfungen bist du in Sekunden auskunftsfähig.",
    icon: FolderOpen,
    group: "Nachweise & Abrechnung",
    image: "/Lösungen.png",
    highlights: [
      {
        title: "Alles am Projekt",
        text: "Pläne, Nachweise und Protokolle hängen an der Akte statt verstreut in Ordnern.",
      },
      {
        title: "Versionen nachvollziehbar",
        text: "Wer wann was freigegeben hat, bleibt dokumentiert – ohne Dateinamen mit _final_v3.",
      },
      {
        title: "Auskunftsfähig",
        text: "Bei Audits und Prüfungen ist der passende Nachweis in Sekunden gefunden.",
      },
    ],
    bullets: [
      "Revisionssichere Ablage pro Projekt",
      "Freigaben und Versionen jederzeit nachvollziehbar",
      "Nachweise und Protokolle zentral statt im Postfach",
      "Zugriff nach Rolle und Projekt gesteuert",
    ],
  },
  {
    slug: "rechnungsstellung",
    title: "Abrechnung & Rechnungsstellung",
    tagline: "Von der Leistung zur X-Rechnung",
    description:
      "Rechnungen schnell, korrekt und auf Wunsch automatisiert erstellen – aus geprüften Leistungen und Stunden, übergabefertig für die Buchhaltung.",
    icon: FileText,
    group: "Nachweise & Abrechnung",
    image: "/Rechnungen.png",
    highlights: [
      {
        title: "Ohne Zweiterfassung",
        text: "Freigegebene Stunden und Leistungen werden zum Rechnungsentwurf – kein erneutes Eintippen.",
      },
      {
        title: "Normkonform",
        text: "X-Rechnung und strukturierte Belege erfüllen die Anforderungen öffentlicher Auftraggeber.",
      },
      {
        title: "Saubere Übergabe",
        text: "Steuerberater und DATEV-Prozesse erhalten geprüfte Daten statt PDF-Sammlungen.",
      },
    ],
    bullets: [
      "Leistungsnachweise automatisch zusammengeführt",
      "Rechnungsentwürfe pro Projekt und Zeitraum",
      "X-Rechnung und saubere Übergabe an die Buchhaltung",
      "Abrechnung nach LV und GAEB-Positionen",
    ],
  },
];

export const MODULE_CATALOG: Catalog = {
  basePath: "/produkt",
  singular: "Modul",
  plural: "Module",
  menuNote: `${MODULES.length} Module · eine Plattform`,
  scopeHeading: "Das steckt in {title}",
  ctaHeading: "{title} live sehen?",
  overviewHref: "/produkt",
  overviewLabel: "Alle Module ansehen",
  entries: MODULES,
};
