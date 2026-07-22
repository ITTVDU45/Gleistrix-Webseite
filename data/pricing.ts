export type ProjectCapacity = {
  id: string;
  label: string;
  shortLabel: string;
  projects: number;
  monthlySurcharge: number;
  implementationPrice: number;
};

export type ConfigurableModule = {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
};

export type PricingIntegration = {
  id: string;
  title: string;
  category: "Projekt & Auftrag" | "Finanzen" | "Zusammenarbeit" | "Recruiting" | "Kommunikation";
  description: string;
  src?: string;
  width?: number;
  height?: number;
  initials?: string;
};

export const BASE_PRICE = 150;
export const EXTRA_USER_PRICE = 10;
export const ARTICLE_PRICE = 0.5;

export const BASE_FEATURES = [
  "1 Benutzer",
  "Bis zu 100 Projekte pro Monat",
  "Zentrale Projektverwaltung",
  "Mitarbeiterverwaltung",
  "Dokumentenverwaltung",
  "Rollen- und Rechteverwaltung",
  "Grundlegende Stammdatenverwaltung",
] as const;

export const PROJECT_CAPACITIES: ProjectCapacity[] = [
  {
    id: "projects-100",
    label: "Bis 100 Projekte",
    shortLabel: "100 Projekte",
    projects: 100,
    monthlySurcharge: 0,
    implementationPrice: 990,
  },
  {
    id: "projects-500",
    label: "Bis 500 Projekte",
    shortLabel: "500 Projekte",
    projects: 500,
    monthlySurcharge: 50,
    implementationPrice: 1490,
  },
  {
    id: "projects-1000",
    label: "Bis 1.000 Projekte",
    shortLabel: "1.000 Projekte",
    projects: 1000,
    monthlySurcharge: 100,
    implementationPrice: 1990,
  },
  {
    id: "projects-10000",
    label: "Bis 10.000 Projekte",
    shortLabel: "10.000 Projekte",
    projects: 10000,
    monthlySurcharge: 300,
    implementationPrice: 2500,
  },
];

export const STANDARD_MODULES: ConfigurableModule[] = [
  {
    id: "material",
    title: "Materialverwaltung",
    description: "Materialien und Betriebsmittel anlegen, planen und Projekten zuordnen.",
    price: 10,
    features: ["Projektzuordnung", "Bedarfsübersicht"],
  },
  {
    id: "absence",
    title: "Urlaub & Abwesenheiten",
    description: "Urlaub, Krankheit, Freistellungen und Fortbildungen zentral erfassen.",
    price: 10,
    features: ["Abwesenheitsarten", "Mitarbeiterübersicht"],
  },
  {
    id: "vehicles",
    title: "Fahrzeugverwaltung",
    description: "Fahrzeuge, Kennzeichen, Dokumente und Projektzuordnungen verwalten.",
    price: 10,
    features: ["Fahrzeugstammdaten", "Einsatzzuordnung"],
  },
  {
    id: "qualifications",
    title: "Qualifikationen",
    description: "Nachweise und Qualifikationen deiner Mitarbeitenden im Blick behalten.",
    price: 10,
    features: ["Gültigkeiten", "Qualifikationsmatrix"],
  },
  {
    id: "employee-documents",
    title: "Mitarbeiterdokumente",
    description: "Personenbezogene Unterlagen strukturiert und rollenbasiert ablegen.",
    price: 10,
    features: ["Dokumentenablage", "Zugriffsrechte"],
  },
  {
    id: "clients",
    title: "Auftraggeber",
    description: "Kontakte, Projekte und relevante Informationen je Auftraggeber bündeln.",
    price: 10,
    features: ["Kontaktstammdaten", "Projektübersicht"],
  },
  {
    id: "subcontractors",
    title: "Nachunternehmer",
    description: "Partnerunternehmen, Dokumente und Einsätze zentral koordinieren.",
    price: 10,
    features: ["Partnerverwaltung", "Einsatzzuordnung"],
  },
  {
    id: "deadlines",
    title: "Termine & Fristen",
    description: "Wichtige Termine, Prüfungen und Fristen zuverlässig nachverfolgen.",
    price: 10,
    features: ["Fristenübersicht", "Erinnerungen"],
  },
  {
    id: "templates",
    title: "Projektvorlagen",
    description: "Wiederkehrende Projektstrukturen schnell und einheitlich anlegen.",
    price: 10,
    features: ["Vorlagenbibliothek", "Schnellstart"],
  },
];

export const COMPLEX_MODULES: ConfigurableModule[] = [
  {
    id: "operations-board",
    title: "Einsatztafel",
    description: "Mitarbeiter, Teams, Fahrzeuge und Nachunternehmen nach Zeitraum und Rolle koordinieren.",
    price: 25,
    features: ["Schicht- und Rollenplanung", "Ressourcenkoordination"],
  },
  {
    id: "billing",
    title: "Abrechnungsmodul",
    description: "Arbeitszeiten, Zuschläge und Leistungen für die projektbezogene Abrechnung zusammenführen.",
    price: 25,
    features: ["Leistungserfassung", "Abrechnungsvorbereitung"],
  },
  {
    id: "warehouse",
    title: "Lagerverwaltung",
    description: "Bestände, Werkzeuge und Betriebsmittel mit Standorten und Zuständen digital führen.",
    price: 25,
    features: ["Bestandsbewegungen", "QR-Code-Zuordnung"],
  },
  {
    id: "finance",
    title: "Finanzmodul",
    description: "Umsätze, Kosten, Budgets und offene Posten als Grundlage für das Controlling bündeln.",
    price: 25,
    features: ["Projektbudgets", "Kennzahlen & offene Posten"],
  },
];

export const AI_MODULE: ConfigurableModule = {
  id: "ai-agents",
  title: "KI-Agenten",
  description: "Wiederkehrende Dokumenten- und Auswertungsprozesse mit Gleistrix automatisieren.",
  price: 25,
  features: [
    "Leistungsverzeichnisse und Ausschreibungen analysieren",
    "Projekt- und Mängeldokumentation vorbereiten",
    "Rechnungsdaten, Dokumente und E-Mails auslesen",
    "Projektinformationen automatisch zusammenfassen",
  ],
};

export const PRICING_INTEGRATIONS: PricingIntegration[] = [
  {
    id: "gaeb",
    title: "GAEB",
    category: "Projekt & Auftrag",
    description: "Leistungsverzeichnisse und Ausschreibungsdaten strukturiert übernehmen.",
    initials: "GAEB",
  },
  {
    id: "deutsche-bahn",
    title: "Deutsche Bahn",
    category: "Projekt & Auftrag",
    description: "Projektbezogene Datenflüsse passend zu vorhandenen Prozessen abstimmen.",
    initials: "DB",
  },
  {
    id: "microsoft-365",
    title: "Microsoft 365",
    category: "Zusammenarbeit",
    description: "Dokumente, E-Mail, Kalender und Zusammenarbeit verbinden.",
    src: "/logos/microsoft-365.png",
    width: 500,
    height: 550,
  },
  {
    id: "datev",
    title: "DATEV",
    category: "Finanzen",
    description: "Abrechnungs- und Buchhaltungsdaten für Folgeprozesse bereitstellen.",
    src: "/logos/datev.png",
    width: 500,
    height: 493,
  },
  {
    id: "sevdesk",
    title: "sevdesk",
    category: "Finanzen",
    description: "Rechnungs- und Buchhaltungsprozesse mit Gleistrix verzahnen.",
    src: "/logos/sevdesk.svg",
    width: 400,
    height: 100,
  },
  {
    id: "stripe",
    title: "Stripe",
    category: "Finanzen",
    description: "Zahlungsinformationen für automatisierte Abläufe nutzbar machen.",
    src: "/logos/stripe.png",
    width: 500,
    height: 209,
  },
  {
    id: "cal-com",
    title: "Cal.com",
    category: "Zusammenarbeit",
    description: "Termine und Verfügbarkeiten direkt in Abläufe einbinden.",
    src: "/logos/cal-com.png",
    width: 512,
    height: 512,
  },
  {
    id: "calendly",
    title: "Calendly",
    category: "Zusammenarbeit",
    description: "Buchungslinks und Gesprächstermine automatisch übernehmen.",
    src: "/logos/calendly.png",
    width: 666,
    height: 375,
  },
  {
    id: "indeed",
    title: "Indeed",
    category: "Recruiting",
    description: "Bewerber- und Recruitingprozesse mit Mitarbeiterabläufen verbinden.",
    src: "/logos/indeed.png",
    width: 1280,
    height: 345,
  },
  {
    id: "stepstone",
    title: "StepStone",
    category: "Recruiting",
    description: "Stellenanzeigen und Bewerberdaten in definierte Workflows übergeben.",
    src: "/logos/stepstone.png",
    width: 1920,
    height: 329,
  },
  {
    id: "telegram",
    title: "Telegram",
    category: "Kommunikation",
    description: "Benachrichtigungen und Einsatzinformationen gezielt ausspielen.",
    src: "/logos/telegram.png",
    width: 1280,
    height: 1280,
  },
  {
    id: "custom-api",
    title: "Individuelle Schnittstelle",
    category: "Kommunikation",
    description: "Weitere Systeme über API, Import oder einen abgestimmten Workflow anbinden.",
    initials: "API",
  },
];

export const INTEGRATION_CATEGORIES = [
  "Alle",
  "Projekt & Auftrag",
  "Finanzen",
  "Zusammenarbeit",
  "Recruiting",
  "Kommunikation",
] as const;

export function formatPriceEUR(value: number, showCents = false): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: showCents || !Number.isInteger(value) ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
}
