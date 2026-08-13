import { Briefcase, Building2, HardHat, Network, ShieldCheck } from "lucide-react";

import type { Catalog, CatalogEntry } from "./catalog";

/**
 * Branchen – Quelle für das Megamenü, die Übersicht unter /branchen und die
 * Detailseiten unter /branchen/[slug].
 */
export const INDUSTRIES: CatalogEntry[] = [
  {
    slug: "gleisbausicherung-bauueberwachung",
    title: "Gleisbausicherung & Bauüberwachung",
    tagline: "Sicherungsplanung und Nachweise",
    description:
      "Gleistrix ist aus der Gleisbausicherung entstanden – hier spielt die Plattform ihre Stärken am deutlichsten aus.",
    icon: ShieldCheck,
    group: "Sicherung & Überwachung",
    image: "/Sicherungspersonal%20gleis.png",
    highlights: [
      {
        title: "Aus der Praxis entstanden",
        text: "Die Plattform wurde entlang echter Sicherungsaufträge gebaut, nicht am Reißbrett.",
      },
      {
        title: "Qualifikation entscheidet",
        text: "Die Planung schlägt nur Personal vor, dessen Nachweise am Einsatztag gültig sind.",
      },
      {
        title: "Nachweise ohne Suchen",
        text: "Stundenzettel, Protokolle und Dokumente hängen an Projekt und Schicht.",
      },
    ],
    bullets: [
      "Qualifikationsbasierte Schichtplanung, Abrechnung und Vergütung",
      "Vereinfachte Auftragsverwaltung, Dienstplanvermittlung und Disposition",
      "Angebotserstellung auch im GAEB-Format",
      "Digitale Stundenzettel, Nachweise und Dokumente",
      "Dashboard mit allen wichtigen Kennzahlen",
      "Integrierte Kommunikation",
    ],
  },
  {
    slug: "sicherungsunternehmen",
    title: "Sicherungsunternehmen",
    tagline: "Regelbasierte Einsätze, lückenlose Doku",
    description:
      "Einsätze qualifikations- und regelbasiert planen – mit lückenloser Dokumentation und prüffähigen Nachweisen.",
    // Übernimmt Titel und Beschreibung der weitergeleiteten Landingpage
    // /software-sicherungsunternehmen. Der abgeleitete Titel hieße sonst nur
    // "Software für Sicherungsunternehmen" und verlöre "Gleisbausicherung".
    metaTitle: "Software für Sicherungsunternehmen & Gleisbausicherung",
    metaDescription:
      "Software für Sicherungsunternehmen: qualifikationsbasierte Disposition, Schichtplanung, Zeiterfassung, Nachweise und Abrechnung für die Gleisbausicherung.",
    icon: Network,
    group: "Sicherung & Überwachung",
    image: "/Sicherungsunternehmen.png",
    highlights: [
      {
        title: "Regeln statt Erfahrungswissen",
        text: "Besetzungsregeln liegen im System – nicht im Kopf einer einzelnen Person.",
      },
      {
        title: "Prüffähig auf Knopfdruck",
        text: "Jede Schicht ist mit Nachweis und Signatur hinterlegt und bleibt auffindbar.",
      },
      {
        title: "Mobil im Einsatz",
        text: "Das Team meldet Zeiten und Vorkommnisse direkt vom Einsatzort.",
      },
    ],
    bullets: [
      "Planung nach Qualifikationen (z. B. SiPo, SaKra, HIB)",
      "Lückenlose Dokumentation inkl. Nachweisen und Signaturen",
      "Mobile Zeiterfassung und prüffähige Stundenzettel",
      "Standardisierte Exporte und optionale Schnittstellen",
      "X-Rechnung und Compliance-Unterstützung",
    ],
    challenges: [
      {
        problem:
          "Eine Tauglichkeit läuft mitten im Einsatzzeitraum ab. Auffallen tut das, wenn der Posten schon auf der Strecke steht.",
        solution:
          "Qualifikationen und ihre Gültigkeit liegen am Mitarbeiter. Wer für den geplanten Tag nicht mehr gültig ist, wird bei der Besetzung nicht vorgeschlagen.",
      },
      {
        problem:
          "Der Auftraggeber fragt Nachweise zu einer Schicht von vor acht Wochen an. Die Suche geht durch Ordner, Fotos und drei Postfächer.",
        solution:
          "Jede Schicht trägt ihre Nachweise und Signaturen bei sich und bleibt über das Projekt auffindbar – ohne Rekonstruktion aus Einzelteilen.",
      },
      {
        problem:
          "Nacht- und Wochenendeinsätze stehen in einer Tabelle, die Verfügbarkeit der Posten im Kalender. Beides wird von Hand abgeglichen.",
        solution:
          "Schichten, Abwesenheiten und Verfügbarkeiten liegen in derselben Plantafel. Doppelbelegungen meldet Gleistrix beim Zuweisen, nicht am Einsatztag.",
      },
    ],
    steps: [
      {
        title: "Einsatz anlegen",
        text: "Auftrag, Streckenabschnitt und Sperrpause werden einmal erfasst und gelten für alle Schichten darin.",
      },
      {
        title: "Nach Regeln besetzen",
        text: "Pro Schicht steht fest, welche Qualifikationen gebraucht werden – SiPo, SaKra oder HIB. Vorgeschlagen wird nur, wer sie zum Einsatztag gültig besitzt.",
      },
      {
        title: "Vor Ort erfassen",
        text: "Das Team meldet Zeiten und Vorkommnisse direkt vom Einsatzort, inklusive Signatur.",
      },
      {
        title: "Prüfen und abrechnen",
        text: "Freigegebene Stunden gehen ohne erneute Eingabe in die Abrechnung, auf Wunsch als X-Rechnung.",
      },
    ],
    faqs: [
      {
        question: "Welche Qualifikationen lassen sich hinterlegen?",
        answer:
          "Die in der Gleisbausicherung üblichen Nachweise wie Sicherungsposten, Sicherungsaufsicht mit Kranausbildung oder Handbedienung von Bahnübergängen, jeweils mit Gültigkeitsdatum. Weitere Qualifikationen und Tauglichkeiten lassen sich ergänzen, weil die Liste je Unternehmen konfiguriert wird.",
      },
      {
        question: "Was passiert, wenn eine Qualifikation während des Einsatzzeitraums abläuft?",
        answer:
          "Gleistrix prüft die Gültigkeit gegen den geplanten Einsatztag, nicht gegen das heutige Datum. Ein Posten, dessen Nachweis am Freitag ausläuft, taucht für den Montag danach nicht mehr als Vorschlag auf.",
      },
      {
        question: "Wie kommen die Nachweise zum Auftraggeber?",
        answer:
          "Über standardisierte Exporte aus dem Projekt heraus. Weil Schicht, Zeiterfassung und Nachweis am selben Vorgang hängen, entsteht die Zusammenstellung aus dem laufenden Betrieb statt in einer Nachbearbeitung.",
      },
      {
        question: "Eignet sich das auch für kurzfristige Umplanungen?",
        answer:
          "Ja. Änderungen an einer Schicht sind sofort für Disposition und Trupp sichtbar, weil alle Beteiligten dieselbe Plantafel sehen. Es gibt keine zweite Fassung des Plans, die noch verteilt werden müsste.",
      },
    ],
  },
  {
    slug: "gleisbauunternehmen",
    title: "Gleisbauunternehmen",
    tagline: "Baustellen, Sperrpausen und Geräte",
    description:
      "Baustellen im Griff: Ressourcen, Sperrpausen, Geräte und Kosten transparent steuern – vom Angebot bis zur Schlussrechnung.",
    icon: HardHat,
    group: "Bau & Infrastruktur",
    image: "/Gleisbauunternehmen.png",
    highlights: [
      {
        title: "Sperrpausen planbar",
        text: "Knappe Zeitfenster werden mit Personal, Technik und Material zusammen geplant.",
      },
      {
        title: "Technik disponiert",
        text: "Zweiwegefahrzeuge und Geräte laufen in derselben Planung wie die Trupps.",
      },
      {
        title: "Kosten im Blick",
        text: "Leistungen nach LV und GAEB abrechnen und Deckungsbeiträge laufend sehen.",
      },
    ],
    bullets: [
      "Baustellen- und Sperrpausenplanung",
      "Geräte- und Fahrzeugdisposition (z. B. Zweiwege-Technik)",
      "Leistungsnachweise und Abrechnung nach LV/GAEB",
      "Sicherheits- und Qualifikationsmanagement",
      "Projekt- und Kostencontrolling über Reports",
    ],
  },
  {
    slug: "subunternehmen-db",
    title: "Subunternehmen der DB",
    tagline: "Anforderungen erfüllen, Daten sauber liefern",
    description:
      "Daten sauber liefern und Anforderungen erfüllen – mit strukturierten Nachweisen, Exporten und revisionssicherer Ablage.",
    icon: Building2,
    group: "Bau & Infrastruktur",
    image: "/subunternehmer.png",
    highlights: [
      {
        title: "Formate, die passen",
        text: "Exporte und Schnittstellen liefern das, was der Auftraggeber tatsächlich anfordert.",
      },
      {
        title: "Nachweise vollständig",
        text: "Qualifikationen und Dokumente sind zum Prüfzeitpunkt vorhanden und gültig.",
      },
      {
        title: "Status transparent",
        text: "Freigaben und Rückmeldungen sind für beide Seiten nachvollziehbar.",
      },
    ],
    bullets: [
      "Standardisierte Exporte und individuelle Schnittstellen",
      "Qualifikations- und Dokumentennachweise",
      "Leistungs- und Stundenrückmeldungen",
      "X-Rechnung und revisionssichere Ablage",
      "Transparente Status- und Freigabeprozesse",
    ],
  },
  {
    slug: "auftragsbasierte-dienstleister",
    title: "Auftragsbasierte Dienstleister",
    tagline: "Vom Angebot bis zur Abrechnung",
    description:
      "Von der Anfrage bis zur Abrechnung: Angebot, Auftrag, Schichtplanung, Zeiterfassung, Stundenzettel und Rechnung in einer Kette.",
    icon: Briefcase,
    group: "Service & Dienstleistung",
    image: "/Auftragsbasierter dienstleister.png",
    highlights: [
      {
        title: "Eine Kette, kein Bruch",
        text: "Jeder Schritt übernimmt die Daten des vorherigen – kein Übertragen zwischen Werkzeugen.",
      },
      {
        title: "Angebote schneller",
        text: "Wiederkehrende Leistungen sind hinterlegt und stehen beim nächsten Angebot bereit.",
      },
      {
        title: "Lohn ohne Umweg",
        text: "Freigegebene Stunden gehen direkt in Abrechnung und Lohnvorbereitung.",
      },
    ],
    bullets: [
      "Flexible Auftragsverwaltung",
      "Integrierte Angebotserstellung",
      "Einsatzplanung und -steuerung",
      "Automatisierte Lohnabrechnung",
      "Effiziente Rechnungsstellung",
    ],
  },
];

export const INDUSTRY_CATALOG: Catalog = {
  basePath: "/branchen",
  singular: "Branche",
  plural: "Branchen",
  menuNote: `${INDUSTRIES.length} Branchen · passend zu deinem Alltag`,
  scopeHeading: "Was Gleistrix für {title} übernimmt",
  ctaHeading: "Gleistrix für {title} sehen?",
  overviewHref: "/branchen",
  overviewLabel: "Alle Branchenlösungen ansehen",
  entries: INDUSTRIES,
};
