import type {
  ModuleTier,
  PricingCapacity,
  PricingConfig,
  PricingModule,
  PricingPackage,
  PricingTexts,
} from "@/types/pricing";

/**
 * Auslieferungszustand der Preisseite.
 *
 * Diese Werte waren bis zur Umstellung über data/pricing.ts und
 * components/pricing/pricing-section.tsx verteilt hartkodiert. Sie dienen jetzt
 * als Seed für den Adminbereich und als Rückfallebene, solange dort noch nichts
 * freigegeben wurde. Gepflegt wird ab hier ausschließlich im Admin.
 */
export const DEFAULT_PRICING: PricingConfig = {
  version: 2,
  packages: [
    {
      id: "basispaket",
      name: "Basispaket",
      description:
        "Die zentrale Gleistrix-Webanwendung mit Projekt-, Mitarbeiter-, Dokumenten- und Rechteverwaltung.",
      price: 150,
      includedUsers: 1,
      features: [
        "Zentrale Projektverwaltung",
        "Mitarbeiterverwaltung",
        "Dokumentenverwaltung",
        "Rollen- und Rechteverwaltung",
        "Grundlegende Stammdatenverwaltung",
      ],
      implementationPrice: 990,
      isDefault: true,
    },
  ],
  extraUserPrice: 10,
  capacities: [
    {
      id: "projects-100",
      label: "Bis 100 Projekte",
      shortLabel: "100 Projekte",
      projects: 100,
      monthlySurcharge: 0,
      isDefault: true,
    },
    {
      id: "projects-500",
      label: "Bis 500 Projekte",
      shortLabel: "500 Projekte",
      projects: 500,
      monthlySurcharge: 50,
      isDefault: false,
    },
    {
      id: "projects-1000",
      label: "Bis 1.000 Projekte",
      shortLabel: "1.000 Projekte",
      projects: 1000,
      monthlySurcharge: 100,
      isDefault: false,
    },
    {
      id: "projects-10000",
      label: "Bis 10.000 Projekte",
      shortLabel: "10.000 Projekte",
      projects: 10000,
      monthlySurcharge: 300,
      isDefault: false,
    },
  ],
  modules: [
    {
      id: "material",
      tier: "standard",
      title: "Materialverwaltung",
      description: "Materialien und Betriebsmittel anlegen, planen und Projekten zuordnen.",
      price: 10,
      features: ["Projektzuordnung", "Bedarfsübersicht"],
      extras: [],
      iconKey: "boxes",
      isActive: true,
    },
    {
      id: "absence",
      tier: "standard",
      title: "Urlaub & Abwesenheiten",
      description: "Urlaub, Krankheit, Freistellungen und Fortbildungen zentral erfassen.",
      price: 10,
      features: ["Abwesenheitsarten", "Mitarbeiterübersicht"],
      extras: [],
      iconKey: "umbrella",
      isActive: true,
    },
    {
      id: "vehicles",
      tier: "standard",
      title: "Fahrzeugverwaltung",
      description: "Fahrzeuge, Kennzeichen, Dokumente und Projektzuordnungen verwalten.",
      price: 10,
      features: ["Fahrzeugstammdaten", "Einsatzzuordnung"],
      extras: [],
      iconKey: "truck",
      isActive: true,
    },
    {
      id: "qualifications",
      tier: "standard",
      title: "Qualifikationen",
      description: "Nachweise und Qualifikationen deiner Mitarbeitenden im Blick behalten.",
      price: 10,
      features: ["Gültigkeiten", "Qualifikationsmatrix"],
      extras: [],
      iconKey: "badge-check",
      isActive: true,
    },
    {
      id: "employee-documents",
      tier: "standard",
      title: "Mitarbeiterdokumente",
      description: "Personenbezogene Unterlagen strukturiert und rollenbasiert ablegen.",
      price: 10,
      features: ["Dokumentenablage", "Zugriffsrechte"],
      extras: [],
      iconKey: "file-archive",
      isActive: true,
    },
    {
      id: "clients",
      tier: "standard",
      title: "Auftraggeber",
      description: "Kontakte, Projekte und relevante Informationen je Auftraggeber bündeln.",
      price: 10,
      features: ["Kontaktstammdaten", "Projektübersicht"],
      extras: [],
      iconKey: "building",
      isActive: true,
    },
    {
      id: "subcontractors",
      tier: "standard",
      title: "Nachunternehmer",
      description: "Partnerunternehmen, Dokumente und Einsätze zentral koordinieren.",
      price: 10,
      features: ["Partnerverwaltung", "Einsatzzuordnung"],
      extras: [],
      iconKey: "network",
      isActive: true,
    },
    {
      id: "deadlines",
      tier: "standard",
      title: "Termine & Fristen",
      description: "Wichtige Termine, Prüfungen und Fristen zuverlässig nachverfolgen.",
      price: 10,
      features: ["Fristenübersicht", "Erinnerungen"],
      extras: [],
      iconKey: "calendar-clock",
      isActive: true,
    },
    {
      id: "templates",
      tier: "standard",
      title: "Projektvorlagen",
      description: "Wiederkehrende Projektstrukturen schnell und einheitlich anlegen.",
      price: 10,
      features: ["Vorlagenbibliothek", "Schnellstart"],
      extras: [],
      iconKey: "copy",
      isActive: true,
    },
    {
      id: "operations-board",
      tier: "complex",
      title: "Einsatztafel",
      description:
        "Mitarbeiter, Teams, Fahrzeuge und Nachunternehmen nach Zeitraum und Rolle koordinieren.",
      price: 25,
      features: ["Schicht- und Rollenplanung", "Ressourcenkoordination"],
      extras: [],
      iconKey: "board",
      isActive: true,
    },
    {
      id: "billing",
      tier: "complex",
      title: "Abrechnungsmodul",
      description:
        "Arbeitszeiten, Zuschläge und Leistungen für die projektbezogene Abrechnung zusammenführen.",
      price: 25,
      features: ["Leistungserfassung", "Abrechnungsvorbereitung"],
      extras: [],
      iconKey: "receipt",
      isActive: true,
    },
    {
      id: "warehouse",
      tier: "complex",
      title: "Lagerverwaltung",
      description:
        "Bestände, Werkzeuge und Betriebsmittel mit Standorten und Zuständen digital führen.",
      price: 25,
      features: ["Bestandsbewegungen", "QR-Code-Zuordnung"],
      extras: [],
      iconKey: "warehouse",
      isActive: true,
      usage: {
        unitPrice: 0.5,
        label: "Aktiv verwaltete Artikel und QR-Codes",
        hint: "Kalkuliert je aktiv verwaltetem Artikel und Monat.",
        sliderMax: 10000,
        step: 50,
      },
    },
    {
      id: "finance",
      tier: "complex",
      title: "Finanzmodul",
      description:
        "Umsätze, Kosten, Budgets und offene Posten als Grundlage für das Controlling bündeln.",
      price: 25,
      features: ["Projektbudgets", "Kennzahlen & offene Posten"],
      extras: [],
      iconKey: "chart",
      isActive: true,
    },
    {
      id: "ai-agents",
      tier: "ai",
      title: "KI-Agenten",
      description:
        "Wiederkehrende Dokumenten- und Auswertungsprozesse mit Gleistrix automatisieren.",
      price: 25,
      features: [
        "Leistungsverzeichnisse und Ausschreibungen analysieren",
        "Projekt- und Mängeldokumentation vorbereiten",
        "Rechnungsdaten, Dokumente und E-Mails auslesen",
        "Projektinformationen automatisch zusammenfassen",
      ],
      extras: [],
      iconKey: "bot",
      isActive: true,
    },
  ],
  integrations: [
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
      description:
        "Weitere Systeme über API, Import oder einen abgestimmten Workflow anbinden.",
      initials: "API",
    },
  ],
  integrationCategories: [
    "Alle",
    "Projekt & Auftrag",
    "Finanzen",
    "Zusammenarbeit",
    "Recruiting",
    "Kommunikation",
  ],
  texts: {
    heroEyebrow: "Modular und transparent",
    heroTitle: "Preise, die mit deinem Betrieb wachsen.",
    heroDescription:
      "Wähle Nutzer, Projektvolumen und Module. Dein Monats- und Einführungspreis aktualisiert sich sofort.",
    configuratorTitle: "Stelle dein Gleistrix zusammen",
    configuratorDescription:
      "Das Basispaket ist dein Startpunkt. Ergänze genau die Kapazitäten und Funktionen, die dein Team im Alltag braucht.",
    packagesTitle: "Wähle dein Paket",
    packagesDescription:
      "Das Paket ist dein Startpunkt und bestimmt Grundpreis, enthaltene Benutzer und die einmalige Implementierung.",
    usersTitle: "Wie viele Benutzer arbeiten mit Gleistrix?",
    capacityTitle: "Wie viele Projekte planst du pro Monat?",
    capacityDescription:
      "Die gewählte Kapazität bestimmt auch den einmaligen Implementierungsumfang.",
    standardModulesTitle: "Standardmodule für deinen Arbeitsalltag",
    complexModulesTitle: "Komplexe Module für durchgängige Prozesse",
    aiModuleTitle: "KI-Agenten für Dokumente und Projekte",
    summaryTitle: "Deine Konfiguration",
    ctaLabel: "Konfiguration anfragen",
    implementationTitle: "Sicher vom Setup bis zum Produktivstart",
    implementationDescription:
      "Die einmalige Implementierung richtet sich nach deinem Projektvolumen und umfasst die gemeinsame Einführung in Gleistrix.",
    integrationsTitle: "Gleistrix passt in deine Systemlandschaft",
    integrationsDescription:
      "Verbinde Projekt-, Finanz-, Recruiting- und Kommunikationssysteme. Den genauen Schnittstellenumfang stimmen wir im Einführungsprojekt ab.",
  },
  updatedAt: "2026-01-01T00:00:00.000Z",
};

/* ----------------------------------------------------------- Hilfsfunktionen */

export function formatPriceEUR(value: number, showCents = false): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: showCents || !Number.isInteger(value) ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function modulesByTier(config: PricingConfig, tier: ModuleTier): PricingModule[] {
  return config.modules.filter((module) => module.tier === tier && module.isActive);
}

/** Vorausgewählte Kapazität – ohne Flag die erste Stufe, damit der Konfigurator nie leer startet. */
export function defaultCapacity(config: PricingConfig): PricingCapacity | undefined {
  return config.capacities.find((capacity) => capacity.isDefault) ?? config.capacities[0];
}

/** Vorausgewähltes Paket – ohne Flag das erste, damit der Konfigurator nie leer startet. */
export function defaultPackage(config: PricingConfig): PricingPackage | undefined {
  return config.packages.find((pkg) => pkg.isDefault) ?? config.packages[0];
}

export type ConfiguratorSelection = {
  packageId: string;
  users: number;
  capacityId: string;
  moduleIds: string[];
  /** Nutzungsmengen je Modul-ID, z. B. Lagerartikel. */
  usageAmounts: Record<string, number>;
};

export type PriceBreakdown = {
  basePrice: number;
  extraUsers: number;
  extraUsersPrice: number;
  capacitySurcharge: number;
  modulesPrice: number;
  usagePrice: number;
  monthlyTotal: number;
  implementationPrice: number;
};

/**
 * Einzige Stelle, an der der Monatspreis entsteht.
 *
 * Gerundet wird genau einmal am Ende: die Summanden sind admin-gepflegte
 * Euro-Beträge, deren Gleitkomma-Abweichung sich sonst in den Endpreis trägt.
 * Mengen werden abgerundet, damit „1,5 Benutzer" nicht zu einem halben
 * Nutzerpreis führt.
 */
export function calculatePrice(
  config: PricingConfig,
  selection: ConfiguratorSelection,
): PriceBreakdown {
  const pkg =
    config.packages.find((item) => item.id === selection.packageId) ?? defaultPackage(config);
  const capacity =
    config.capacities.find((item) => item.id === selection.capacityId) ?? defaultCapacity(config);

  // Ohne Paket gibt es keine Konfiguration: Zusatznutzer und Module sind
  // Aufschläge auf ein Paket, ohne Basis ergäben sie einen Fantasiepreis.
  if (!pkg) {
    return {
      basePrice: 0,
      extraUsers: 0,
      extraUsersPrice: 0,
      capacitySurcharge: 0,
      modulesPrice: 0,
      usagePrice: 0,
      monthlyTotal: 0,
      implementationPrice: 0,
    };
  }

  const selected = config.modules.filter(
    (module) => module.isActive && selection.moduleIds.includes(module.id),
  );

  const basePrice = pkg.price;
  const extraUsers = Math.max(0, Math.floor(selection.users) - pkg.includedUsers);
  const extraUsersPrice = extraUsers * config.extraUserPrice;
  const modulesPrice = selected.reduce((total, module) => total + module.price, 0);
  const usagePrice = selected.reduce((total, module) => {
    if (!module.usage) return total;
    const amount = Math.max(0, Math.floor(selection.usageAmounts[module.id] ?? 0));
    return total + amount * module.usage.unitPrice;
  }, 0);

  const capacitySurcharge = capacity?.monthlySurcharge ?? 0;
  const monthlyTotal =
    Math.round(
      (basePrice + extraUsersPrice + capacitySurcharge + modulesPrice + usagePrice) * 100,
    ) / 100;

  return {
    basePrice,
    extraUsers,
    extraUsersPrice,
    capacitySurcharge,
    modulesPrice,
    usagePrice: Math.round(usagePrice * 100) / 100,
    monthlyTotal,
    // Die Implementierung hängt am Paket, nicht mehr an der Projektkapazität.
    implementationPrice: pkg.implementationPrice,
  };
}

/* -------------------------------------------------------------- Migration */

/** Projektkapazität aus Version 1 – trug damals noch die Implementierungskosten. */
type LegacyCapacity = PricingCapacity & { implementationPrice?: number };

type LegacyConfig = Omit<PricingConfig, "packages" | "extraUserPrice" | "texts"> & {
  base?: { price: number; includedUsers: number; extraUserPrice: number; features: string[] };
  capacities?: LegacyCapacity[];
  texts?: Partial<PricingTexts> & { basePackageTitle?: string; basePackageDescription?: string };
};

/**
 * Bringt einen gespeicherten Stand auf das aktuelle Schema.
 *
 * Version 1 kannte genau ein Basispaket und trug die Implementierungskosten an
 * der Projektkapazität. Beim Übergang wird daraus ein Paket; als
 * Implementierungspreis gilt der günstigste der bisherigen Kapazitätspreise –
 * das entspricht dem, was die Seite bisher als „Implementierung ab" auswies.
 */
export function migratePricing(stored: unknown): PricingConfig {
  if (!stored || typeof stored !== "object") return DEFAULT_PRICING;
  const raw = stored as LegacyConfig;

  if (Array.isArray((raw as Partial<PricingConfig>).packages)) {
    const config = stored as PricingConfig;
    // `extras` kam später dazu – ältere Dokumente haben das Feld nicht.
    return {
      ...config,
      modules: config.modules.map((module) => ({ ...module, extras: module.extras ?? [] })),
    };
  }

  // Ohne die Annotation wird der Typ zur Union beider Array-Typen und der
  // Legacy-Zusatz fällt beim .map wieder weg.
  const capacities: LegacyCapacity[] = raw.capacities ?? DEFAULT_PRICING.capacities;
  const implementationPrice = capacities.length
    ? Math.min(
        ...capacities.map(
          (capacity) => capacity.implementationPrice ?? DEFAULT_PRICING.packages[0].implementationPrice,
        ),
      )
    : DEFAULT_PRICING.packages[0].implementationPrice;

  const base = raw.base ?? {
    price: DEFAULT_PRICING.packages[0].price,
    includedUsers: DEFAULT_PRICING.packages[0].includedUsers,
    extraUserPrice: DEFAULT_PRICING.extraUserPrice,
    features: DEFAULT_PRICING.packages[0].features,
  };

  const { basePackageTitle, basePackageDescription, ...texts } = raw.texts ?? {};

  return {
    ...DEFAULT_PRICING,
    ...(stored as Partial<PricingConfig>),
    version: 2,
    packages: [
      {
        id: "basispaket",
        name: basePackageTitle ?? DEFAULT_PRICING.packages[0].name,
        description: basePackageDescription ?? DEFAULT_PRICING.packages[0].description,
        price: base.price,
        includedUsers: base.includedUsers,
        features: base.features,
        implementationPrice,
        isDefault: true,
      },
    ],
    extraUserPrice: base.extraUserPrice,
    capacities: capacities.map(({ implementationPrice: _dropped, ...capacity }) => capacity),
    texts: { ...DEFAULT_PRICING.texts, ...texts },
  };
}
