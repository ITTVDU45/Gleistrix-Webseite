import {
  Banknote,
  CalendarCheck,
  FileSpreadsheet,
  Mail,
  MessageCircle,
  Train,
  UserSearch,
} from "lucide-react";

import type { Catalog, CatalogEntry } from "./catalog";
import { INTEGRATIONS } from "./integrations";

/**
 * Integrationen als eigene Seiten – Megamenü, Übersicht unter /integrationen
 * und Detailseiten unter /integrationen/[slug].
 *
 * Die Logodaten kommen aus data/integrations.ts, damit die Laufschrift der
 * Startseite und die Integrationsseiten dieselbe Quelle haben.
 */
function logoOf(id: string): NonNullable<CatalogEntry["logo"]> {
  const match = INTEGRATIONS.find((item) => item.id === id);
  if (!match?.src || !match.width || !match.height) {
    // Beim Import, nicht erst beim Rendern: ein Tippfehler in der ID fällt so
    // schon im Build auf und nicht als leeres Bild auf der Live-Seite.
    throw new Error(`Kein vollständiges Logo für Integration "${id}" hinterlegt.`);
  }
  return { src: match.src, width: match.width, height: match.height };
}

export const INTEGRATION_PAGES: CatalogEntry[] = [
  {
    slug: "gaeb",
    title: "GAEB",
    tagline: "Leistungsverzeichnisse ein- und ausgeben",
    description:
      "Leistungsverzeichnisse im GAEB-Format einlesen, kalkulieren und wieder ausgeben – ohne Positionen von Hand zu übertragen.",
    icon: FileSpreadsheet,
    group: "Bahn & Ausschreibung",
    logo: logoOf("gaeb"),
    highlights: [
      {
        title: "Import statt Abtippen",
        text: "Ein eingelesenes LV steht mit allen Positionen und Mengen im Projekt bereit.",
      },
      {
        title: "Kalkulation am Original",
        text: "Preise werden an der Originalposition gepflegt, die Struktur bleibt unverändert.",
      },
      {
        title: "Rückgabe im Format",
        text: "Das ausgefüllte Angebot geht im geforderten GAEB-Austauschformat zurück.",
      },
    ],
    bullets: [
      "GAEB-Dateien importieren und Positionen übernehmen",
      "Angebote direkt auf Basis des LV kalkulieren",
      "Abrechnung nach LV-Positionen",
      "Export im vom Auftraggeber geforderten Format",
    ],
  },
  {
    slug: "deutsche-bahn",
    title: "Deutsche Bahn",
    tagline: "Anforderungen der Auftraggeberseite",
    description:
      "Nachweise, Rückmeldungen und Rechnungen so aufbereiten, wie sie im Bahnumfeld erwartet werden – strukturiert und prüffähig.",
    icon: Train,
    group: "Bahn & Ausschreibung",
    logo: logoOf("deutsche-bahn"),
    highlights: [
      {
        title: "Nachweise vollständig",
        text: "Qualifikationen und Dokumente sind zum Prüfzeitpunkt vorhanden und gültig.",
      },
      {
        title: "Strukturierte Rückmeldung",
        text: "Leistungen und Stunden werden im vereinbarten Format zurückgemeldet.",
      },
      {
        title: "Revisionssicher",
        text: "Was geliefert wurde, bleibt mit Stand und Zeitpunkt nachvollziehbar.",
      },
    ],
    bullets: [
      "Strukturierte Leistungs- und Stundenrückmeldungen",
      "Qualifikations- und Dokumentennachweise je Einsatz",
      "X-Rechnung für öffentliche Auftraggeber",
      "Revisionssichere Ablage aller Nachweise",
    ],
  },
  {
    slug: "datev",
    title: "DATEV",
    tagline: "Übergabe an Steuerberatung und Lohn",
    description:
      "Geprüfte Stunden, Belege und Rechnungen an DATEV-Prozesse übergeben – ohne Sammelmappe und ohne Rückfragen zum Monatsende.",
    icon: Banknote,
    group: "Buchhaltung & Finanzen",
    logo: logoOf("datev"),
    highlights: [
      {
        title: "Ein Übergabestand",
        text: "Die Kanzlei erhält geprüfte Daten statt einer Sammlung einzelner PDF-Dateien.",
      },
      {
        title: "Lohn vorbereitet",
        text: "Freigegebene Stunden inklusive Zuschlägen stehen für die Lohnabrechnung bereit.",
      },
      {
        title: "Weniger Rückfragen",
        text: "Die Zuordnung zu Projekt und Kostenstelle passiert bei der Erfassung, nicht danach.",
      },
    ],
    bullets: [
      "Buchungsrelevante Daten strukturiert übergeben",
      "Stunden und Zuschläge für die Lohnabrechnung",
      "Belege den Projekten zugeordnet",
      "Monatsabschluss ohne Sammelmappe",
    ],
  },
  {
    slug: "lexoffice",
    title: "lexoffice",
    tagline: "Rechnungen und Belege synchron",
    description:
      "Rechnungen und Belege aus Gleistrix in lexoffice weiterführen – die Buchhaltung arbeitet mit denselben Zahlen wie die Disposition.",
    icon: Banknote,
    group: "Buchhaltung & Finanzen",
    logo: logoOf("lexoffice"),
    highlights: [
      {
        title: "Ein Datenstand",
        text: "Was abgerechnet wurde, steht in der Buchhaltung – ohne zweite Erfassung.",
      },
      {
        title: "Belege am Projekt",
        text: "Eingangsbelege bleiben dem Projekt zugeordnet und tauchen in der Auswertung auf.",
      },
      {
        title: "Schneller Abschluss",
        text: "Der Monatsabschluss beginnt nicht mit dem Zusammensuchen von Unterlagen.",
      },
    ],
    bullets: [
      "Rechnungen aus dem Projekt übernehmen",
      "Belege mit Projektbezug",
      "Zahlungsstände nachvollziehbar",
      "Weniger Doppelerfassung im Monatsabschluss",
    ],
  },
  {
    slug: "sevdesk",
    title: "sevdesk",
    tagline: "Buchhaltung ohne Doppelerfassung",
    description:
      "Rechnungs- und Belegdaten an sevdesk weitergeben, statt sie ein zweites Mal einzutippen.",
    icon: Banknote,
    group: "Buchhaltung & Finanzen",
    logo: logoOf("sevdesk"),
    highlights: [
      {
        title: "Direkt weitergereicht",
        text: "Gestellte Rechnungen laufen in die Buchhaltung, ohne Umweg über Exportdateien.",
      },
      {
        title: "Projektbezug bleibt",
        text: "Auch in der Buchhaltung ist erkennbar, zu welchem Projekt ein Beleg gehört.",
      },
      {
        title: "Offene Posten",
        text: "Zahlungsstände sind dort sichtbar, wo über das Projekt entschieden wird.",
      },
    ],
    bullets: [
      "Rechnungsdaten ohne Zweiterfassung",
      "Belege mit Projekt- und Kostenbezug",
      "Offene Posten im Blick",
      "Sauberer Übergang in den Jahresabschluss",
    ],
  },
  {
    slug: "agenda",
    title: "Agenda",
    tagline: "Lohn- und Finanzbuchhaltung",
    description:
      "Stunden- und Abrechnungsdaten für die Agenda-Lohn- und Finanzbuchhaltung bereitstellen – geprüft und im passenden Schnitt.",
    icon: Banknote,
    group: "Buchhaltung & Finanzen",
    logo: logoOf("agenda"),
    highlights: [
      {
        title: "Geprüfte Stunden",
        text: "Nur freigegebene Zeiten gehen in die Lohnabrechnung – Korrekturschleifen entfallen.",
      },
      {
        title: "Zuschläge korrekt",
        text: "Nacht-, Wochenend- und Feiertagszuschläge sind bereits berechnet.",
      },
      {
        title: "Fester Rhythmus",
        text: "Die Übergabe folgt dem Abrechnungszeitraum, nicht dem Zuruf.",
      },
    ],
    bullets: [
      "Stundendaten für die Lohnabrechnung",
      "Zuschläge und Zulagen vorberechnet",
      "Abrechnungsdaten je Zeitraum",
      "Übergabe im vereinbarten Rhythmus",
    ],
  },
  {
    slug: "stripe",
    title: "Stripe",
    tagline: "Zahlungen empfangen und zuordnen",
    description:
      "Zahlungen über Stripe abwickeln und automatisch der richtigen Rechnung zuordnen.",
    icon: Banknote,
    group: "Buchhaltung & Finanzen",
    logo: logoOf("stripe"),
    highlights: [
      {
        title: "Zahlung am Beleg",
        text: "Eingehende Zahlungen landen an der Rechnung, zu der sie gehören.",
      },
      {
        title: "Status sichtbar",
        text: "Offen, bezahlt oder überfällig steht in der Projektakte.",
      },
      {
        title: "Weniger Nachfassen",
        text: "Erinnerungen laufen anhand des tatsächlichen Zahlungsstands.",
      },
    ],
    bullets: [
      "Zahlungen automatisch zuordnen",
      "Zahlungsstatus je Rechnung",
      "Erinnerungen auf Basis echter Stände",
      "Auswertung offener Posten",
    ],
  },
  {
    slug: "paypal",
    title: "PayPal",
    tagline: "Alternative Zahlungswege",
    description:
      "PayPal als zusätzlichen Zahlungsweg anbieten – mit derselben Zuordnung zu Rechnung und Projekt.",
    icon: Banknote,
    group: "Buchhaltung & Finanzen",
    logo: logoOf("paypal"),
    highlights: [
      {
        title: "Mehr Wege zur Zahlung",
        text: "Kunden zahlen so, wie es für sie am schnellsten geht.",
      },
      {
        title: "Gleiche Zuordnung",
        text: "Auch PayPal-Zahlungen erscheinen an der zugehörigen Rechnung.",
      },
      {
        title: "Ein Überblick",
        text: "Alle Zahlungswege laufen in derselben Auswertung zusammen.",
      },
    ],
    bullets: [
      "Zusätzlicher Zahlungsweg für Kunden",
      "Automatische Zuordnung zur Rechnung",
      "Einheitlicher Blick auf alle Zahlungseingänge",
      "Weniger manuelle Abgleiche",
    ],
  },
  {
    slug: "microsoft",
    title: "Microsoft 365",
    tagline: "Postfach, Kalender und Dateien",
    description:
      "Mit Microsoft 365 arbeiten, ohne die Plattform zu verlassen – Termine, Nachrichten und Dokumente bleiben verbunden.",
    icon: Mail,
    group: "Kommunikation & Kalender",
    logo: logoOf("microsoft"),
    highlights: [
      {
        title: "Termine synchron",
        text: "Einsätze erscheinen im gewohnten Kalender des Teams.",
      },
      {
        title: "E-Mail am Projekt",
        text: "Wichtige Nachrichten landen in der Projektakte statt nur im Postfach.",
      },
      {
        title: "Vertraute Umgebung",
        text: "Das Team behält seine Werkzeuge – die Daten laufen trotzdem zusammen.",
      },
    ],
    bullets: [
      "Kalendereinträge für Einsätze und Schichten",
      "Nachrichten dem Projekt zuordnen",
      "Dokumente ohne Medienbruch",
      "Anmeldung über bestehende Konten",
    ],
  },
  {
    slug: "telegram",
    title: "Telegram",
    tagline: "Kurze Wege zum Trupp",
    description:
      "Einsatzinformationen und Rückmeldungen über Telegram austauschen – dort, wo die Teams ohnehin erreichbar sind.",
    icon: MessageCircle,
    group: "Kommunikation & Kalender",
    logo: logoOf("telegram"),
    highlights: [
      {
        title: "Sofort erreichbar",
        text: "Kurzfristige Änderungen erreichen den Trupp, ohne dass jemand telefoniert.",
      },
      {
        title: "Rückmeldung dokumentiert",
        text: "Bestätigungen bleiben am Einsatz hängen statt im Chatverlauf zu verschwinden.",
      },
      {
        title: "Ohne neue App",
        text: "Das Team nutzt den Messenger, den es bereits kennt.",
      },
    ],
    bullets: [
      "Benachrichtigungen zu Einsätzen und Änderungen",
      "Rückmeldungen am Einsatz dokumentiert",
      "Erinnerungen vor Schichtbeginn",
      "Keine zusätzliche App für das Team",
    ],
  },
  {
    slug: "cal-com",
    title: "Cal.com",
    tagline: "Termine ohne Hin und Her",
    description:
      "Termine über Cal.com buchbar machen – Verfügbarkeiten kommen aus der Planung, nicht aus dem Bauchgefühl.",
    icon: CalendarCheck,
    group: "Kommunikation & Kalender",
    logo: logoOf("cal-com"),
    highlights: [
      {
        title: "Echte Verfügbarkeit",
        text: "Buchbar ist nur, was in der Planung tatsächlich frei ist.",
      },
      {
        title: "Weniger Abstimmung",
        text: "Kunden und Bewerber buchen selbst, statt Termine per Mail auszuhandeln.",
      },
      {
        title: "Direkt im Kalender",
        text: "Gebuchte Termine erscheinen sofort in der Einsatzübersicht.",
      },
    ],
    bullets: [
      "Buchungsseiten mit echten Verfügbarkeiten",
      "Termine direkt in der Einsatzübersicht",
      "Automatische Bestätigungen und Erinnerungen",
      "Weniger Abstimmung per E-Mail",
    ],
  },
  {
    slug: "calendly",
    title: "Calendly",
    tagline: "Buchbare Zeitfenster",
    description:
      "Beratungs- und Bewerbungstermine über Calendly anbieten und automatisch in die Planung übernehmen.",
    icon: CalendarCheck,
    group: "Kommunikation & Kalender",
    logo: logoOf("calendly"),
    highlights: [
      {
        title: "Selbst buchen lassen",
        text: "Interessenten wählen ein Zeitfenster, das wirklich zur Verfügung steht.",
      },
      {
        title: "Ohne Nacharbeit",
        text: "Gebuchte Termine müssen nicht von Hand nachgetragen werden.",
      },
      {
        title: "Erinnerungen inklusive",
        text: "Absagen und Verschiebungen laufen über denselben Weg.",
      },
    ],
    bullets: [
      "Zeitfenster für Beratung und Gespräche",
      "Übernahme in die Einsatzübersicht",
      "Automatische Erinnerungen",
      "Verschiebungen ohne Telefonat",
    ],
  },
  {
    slug: "indeed",
    title: "Indeed",
    tagline: "Stellen ausschreiben und nachverfolgen",
    description:
      "Offene Stellen über Indeed ausschreiben und Bewerbungen dort weiterverfolgen, wo auch geplant wird.",
    icon: UserSearch,
    group: "Personal & Recruiting",
    logo: logoOf("indeed"),
    highlights: [
      {
        title: "Bedarf sichtbar",
        text: "Wo Personal fehlt, zeigt die Planung – die Ausschreibung setzt genau dort an.",
      },
      {
        title: "Ein Eingang",
        text: "Bewerbungen laufen an einer Stelle zusammen statt in mehreren Postfächern.",
      },
      {
        title: "Direkt einsatzfähig",
        text: "Aus der Einstellung wird die Personalakte samt Qualifikationen.",
      },
    ],
    bullets: [
      "Stellen aus dem erkannten Bedarf ausschreiben",
      "Bewerbungen zentral nachverfolgen",
      "Gesprächstermine ohne Umweg",
      "Übernahme in die Personalakte",
    ],
  },
  {
    slug: "stepstone",
    title: "StepStone",
    tagline: "Reichweite für Fachkräfte",
    description:
      "Fachkräfte über StepStone erreichen und den Bewerbungsprozess an die Einsatzplanung anschließen.",
    icon: UserSearch,
    group: "Personal & Recruiting",
    logo: logoOf("stepstone"),
    highlights: [
      {
        title: "Passende Profile",
        text: "Ausschreibungen benennen die Qualifikationen, die der Einsatz wirklich verlangt.",
      },
      {
        title: "Nachverfolgbar",
        text: "Jeder Schritt im Verfahren bleibt dokumentiert.",
      },
      {
        title: "Anschluss an die Planung",
        text: "Neue Mitarbeitende sind mit Nachweisen sofort disponierbar.",
      },
    ],
    bullets: [
      "Ausschreibungen mit geforderten Qualifikationen",
      "Bewerbungsstand nachvollziehbar",
      "Termine für Gespräche einplanen",
      "Direkter Übergang in die Personalakte",
    ],
  },
];

export const INTEGRATION_CATALOG: Catalog = {
  basePath: "/integrationen",
  singular: "Integration",
  plural: "Integrationen",
  menuNote: `${INTEGRATION_PAGES.length} Anbindungen · sauber verzahnt`,
  scopeHeading: "Was die Anbindung an {title} übernimmt",
  ctaHeading: "{title} anbinden?",
  overviewHref: "/integrationen",
  overviewLabel: "Alle Integrationen ansehen",
  entries: INTEGRATION_PAGES,
};
