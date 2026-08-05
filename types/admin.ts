import type { PricingConfig } from "./pricing";

export type CompanyStatus = "provisioning" | "active" | "suspended";

export type ProvisioningStepId =
  | "mongo-database"
  | "mongo-role"
  | "minio-bucket"
  | "app-sync";

export type ProvisioningStatus = "pending" | "done" | "failed";

export type ProvisioningStep = {
  id: ProvisioningStepId;
  label: string;
  /** Was konkret angelegt wird – z. B. der Datenbank- oder Bucket-Name. */
  target: string;
  /** Env-Variable, die für die automatische Ausführung nötig ist. */
  requiredEnv: string;
  status: ProvisioningStatus;
  note?: string;
  updatedAt: string;
};

/**
 * Ressourcen eines Mandanten.
 *
 * Isolationsmodell: EINE mandantenfähige App unter app.gleistrix.de für alle
 * Kunden, die Trennung liegt auf Datenbankebene. Jeder Kunde bekommt eine
 * eigene Datenbank statt einer gemeinsamen mit companyId je Dokument – die App
 * ist mit fest verdrahtetem dbName und globalen Feature-Flags gebaut.
 */
export type Tenant = {
  /** Eigene MongoDB-Datenbank im gemeinsamen Cluster (die App braucht ~46 Collections). */
  mongoDatabase: string;
  /** MongoDB-Benutzer, dessen Rolle nur auf diese Datenbank zeigt. */
  mongoUser: string;
  /** Eigener MinIO-Bucket des Mandanten. */
  minioBucket: string;
};

export type Company = {
  id: string;
  name: string;
  slug: string;
  contactName: string;
  contactEmail: string;
  seats: number;
  status: CompanyStatus;
  packageId: string | null;
  /** Zusätzlich freigegebene Module über das Paket hinaus. */
  extraModuleIds: string[];
  /** Trotz Paket gesperrte Module. */
  blockedModuleIds: string[];
  suspendedReason?: string;
  tenant: Tenant;
  provisioning: ProvisioningStep[];
  createdAt: string;
};

export type Package = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  includedSeats: number;
  projectLimit: number;
  moduleIds: string[];
  /** Nicht freigegebene Pakete lassen sich keinem Unternehmen zuweisen. */
  isPublished: boolean;
  createdAt: string;
};

export type Usage = {
  companyId: string;
  /** ISO-Monat, z. B. 2026-08 */
  month: string;
  activeUsers: number;
  projects: number;
  storageMb: number;
  apiCalls: number;
};

/**
 * Protokoll jedes Support-Zugriffs auf eine Kundeninstanz.
 * Wer, wann, worauf und warum – ohne das ist ein globaler Zugang nicht
 * vertretbar.
 */
export type SupportAccess = {
  id: string;
  companyId: string;
  companyName: string;
  /** Gleistrix-Support-Konto, nicht der Control-Plane-Admin. */
  actor: string;
  reason: string;
  createdAt: string;
};

/* --------------------------------------------------------------- Anfragen */

export type LeadKind = "demo" | "termin" | "kontakt";

export type LeadStatus = "neu" | "in-kontakt" | "termin" | "gewonnen" | "verloren";

/** Eingehende Anfrage von der Website – Demo, Terminwunsch oder Kontaktformular. */
export type Lead = {
  id: string;
  kind: LeadKind;
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  message?: string;
  status: LeadStatus;
  /** Vereinbarter Termin als ISO-Zeitpunkt. */
  appointmentAt?: string;
  /** Interne Notiz des Superadmins. */
  note?: string;
  createdAt: string;
};

/** Woher ein Kontakt stammt – aus einer Anfrage übernommen oder von Hand angelegt. */
export type ContactSource = "lead" | "manuell";

/**
 * Kontaktverzeichnis des Vertriebs.
 *
 * Bewusst neben Lead und Company: eine Anfrage ist ein Vorgang mit Status, ein
 * Unternehmen ein bereitgestellter Mandant. Der Kontakt überlebt beides und
 * bleibt bestehen, auch wenn eine Anfrage verloren geht.
 */
export type Contact = {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  role?: string;
  note?: string;
  source: ContactSource;
  /** Anfrage, aus der der Kontakt entstanden ist. */
  leadId?: string | null;
  /** Zugehöriger Mandant, sobald es einen gibt. */
  companyId?: string | null;
  createdAt: string;
};

/** Anforderung der Produktbroschüre – separat, weil sie nur einen Versand braucht. */
export type BrochureRequest = {
  id: string;
  company: string;
  contactName: string;
  email: string;
  createdAt: string;
  sentAt?: string;
};

export type DemoAccessStatus = "angefragt" | "aktiv" | "widerrufen" | "fehlgeschlagen";

/**
 * Über die Schnittstelle in der Gleistrix-App freigeschalteter Demo-Zugang.
 * Der Control-Plane hält nur das Protokoll – die Instanz führt den Zugang.
 */
export type DemoAccess = {
  id: string;
  /** Anfrage, aus der die Freigabe entstanden ist. */
  leadId: string | null;
  /**
   * Mandant, für den die Demo läuft – sofern es ihn schon gibt.
   *
   * Eine Demo entsteht oft vor dem Mandanten, deshalb optional. Ist sie gesetzt,
   * gilt sie; die Zuordnung über den Firmennamen bleibt nur die Rückfallebene
   * für Altdaten und frei eingegebene Empfänger.
   */
  companyId?: string | null;
  company: string;
  email: string;
  status: DemoAccessStatus;
  /** Login-Adresse der Demo-Instanz, wie von der App gemeldet. */
  url?: string;
  expiresAt: string;
  /** Fehlermeldung der App, wenn die Freigabe scheiterte. */
  error?: string;
  createdAt: string;
};

/* ----------------------------------------------------------------- Käufe */

export type PurchaseStatus = "offen" | "freigegeben" | "fehlgeschlagen";

export type PurchaseKind = "paket" | "zubuchung";

/**
 * Ein abgeschlossener Kauf – die Vorlage für den Mandanten in der App.
 *
 * Preise stehen hier eingefroren zum Kaufzeitpunkt. Änderte sich später die
 * Preisliste, verschöbe sich sonst rückwirkend, was der Kunde zahlt.
 */
export type Purchase = {
  id: string;
  /**
   * Woher der Kauf stammt.
   *
   * `paket` ist der im Adminbereich erfasste Grundkauf. `zubuchung` entsteht,
   * wenn ein Nutzer in der App ein Add-on freischaltet – dort bleiben
   * `packageId`, `capacityId` und `users` leer, weil sie zum Grundkauf gehören,
   * und `implementationPrice` ist 0.
   *
   * Was ein Mandant monatlich zahlt, ist die Summe seiner Käufe: der Grundkauf
   * plus jede Zubuchung „on top". Käufe lösen einander nicht ab.
   */
  kind: PurchaseKind;
  companyId: string;
  packageId: string;
  moduleIds: string[];
  /** Gebuchte Benutzerzahl. */
  users: number;
  capacityId: string;
  /**
   * Gebuchte Mengen der Module mit Nutzungspreis, je Modulkennung.
   *
   * Ohne sie ließe sich `monthlyTotal` später nicht mehr nachrechnen: Ein Modul
   * wie die Lagerverwaltung kostet je Artikel, das können vierstellige Beträge
   * im Monat sein. Der eingefrorene Preis wäre sonst eine Zahl ohne Herkunft.
   */
  usageAmounts?: Record<string, number>;
  monthlyTotal: number;
  implementationPrice: number;
  status: PurchaseStatus;
  /** Zeitpunkt der Rückmeldung aus der App. */
  syncedAt?: string | null;
  /** Letzte Fehlermeldung – Grundlage für die Wiederholung im Admin. */
  syncError?: string | null;
  createdAt: string;
};

export type AdminStore = {
  companies: Company[];
  packages: Package[];
  usage: Usage[];
  supportAccess: SupportAccess[];
  leads: Lead[];
  contacts: Contact[];
  brochureRequests: BrochureRequest[];
  demoAccess: DemoAccess[];
  purchases: Purchase[];
  /** Bearbeitungsstand der öffentlichen Preisseite. */
  pricingDraft?: PricingConfig;
  /** Freigegebener Stand – nur dieser wird auf /preise ausgeliefert. */
  pricingPublished?: PricingConfig;
};
