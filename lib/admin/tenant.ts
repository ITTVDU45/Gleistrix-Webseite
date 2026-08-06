import type {
  Company,
  CompanyStatus,
  ProvisioningStatus,
  ProvisioningStep,
  ProvisioningStepId,
  Tenant,
} from "@/types/admin";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_TENANT_ROOT_DOMAIN ?? "gleistrix.de";

/**
 * Adresse der mandantenfähigen App – für alle Kunden dieselbe. Welcher Mandant
 * gemeint ist, entscheidet dort die Anmeldung, nicht mehr die URL.
 *
 * Der Schrägstrich am Ende fliegt weg: Die Pfade werden angehängt, aus
 * „https://app.gleistrix.de/" würde sonst „…de//api/internal/tenants".
 */
export const APP_URL = (
  process.env.GLEISTRIX_APP_URL?.trim() || `https://app.${ROOT_DOMAIN}`
).replace(/\/+$/, "");

/**
 * Reservierte Kennungen, die kein Mandant belegen darf.
 *
 * Sie werden zu Datenbank- und Bucketnamen (gleistrix_<kennung>,
 * gleistrix-<kennung>). Eine Subdomain je Mandant gibt es seit dem Umbau nicht
 * mehr – die Namenskollision aber sehr wohl.
 */
const RESERVED_SLUGS = new Set([
  "www",
  "app",
  "admin",
  "api",
  "mail",
  "status",
  "docs",
  "cdn",
  "static",
  "minio",
  "db",
  "portal",
  "support",
]);

/** "Muster Bau GmbH" -> "muster-bau-gmbh" */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
}

export type SlugCheck = { ok: true } | { ok: false; error: string };

export function validateSlug(slug: string, takenSlugs: string[]): SlugCheck {
  if (slug.length < 3) {
    return { ok: false, error: "Die Kennung braucht mindestens 3 Zeichen." };
  }
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(slug)) {
    return { ok: false, error: "Nur Kleinbuchstaben, Ziffern und Bindestriche erlaubt." };
  }
  if (RESERVED_SLUGS.has(slug)) {
    return { ok: false, error: `„${slug}“ ist eine reservierte Kennung.` };
  }
  if (takenSlugs.includes(slug)) {
    return { ok: false, error: `„${slug}“ ist bereits vergeben.` };
  }
  return { ok: true };
}

/** Namensschema für alle Mandanten-Ressourcen – an genau einer Stelle definiert. */
export function tenantFor(slug: string): Tenant {
  const flat = slug.replace(/-/g, "_");
  return {
    mongoDatabase: `gleistrix_${flat}`,
    mongoUser: `svc_${flat}`,
    minioBucket: `gleistrix-${slug}`,
  };
}

type StepBlueprint = {
  id: ProvisioningStep["id"];
  label: string;
  requiredEnv: string;
  target: (tenant: Tenant) => string;
  note: (tenant: Tenant) => string;
};

const BLUEPRINTS: StepBlueprint[] = [
  {
    id: "mongo-database",
    label: "MongoDB-Datenbank anlegen",
    requiredEnv: "MONGODB_ADMIN_URI",
    target: (t) => t.mongoDatabase,
    note: (t) =>
      `Eigene Datenbank ${t.mongoDatabase} im Cluster. Die Gleistrix-App legt darin ihre ~46 Collections selbst an.`,
  },
  {
    id: "mongo-role",
    label: "MongoDB-Rolle & Benutzer anlegen",
    requiredEnv: "MONGODB_ADMIN_URI",
    target: (t) => t.mongoUser,
    note: (t) =>
      `Benutzer ${t.mongoUser} mit readWrite ausschließlich auf ${t.mongoDatabase} – kein Zugriff auf andere Mandanten.`,
  },
  {
    id: "minio-bucket",
    label: "MinIO-Bucket anlegen",
    requiredEnv: "MINIO_ENDPOINT",
    target: (t) => t.minioBucket,
    note: (t) =>
      `Bucket ${t.minioBucket} mit Versionierung. Ohne Policy, denn bei MinIO ist ein Bucket ohne Policy privat – die Beschränkung auf den Mandanten gehört an dessen Access Key.`,
  },
  {
    id: "app-sync",
    label: "Mandant an die App melden",
    requiredEnv: "SERVICE_SHARED_SECRET",
    target: (t) => t.mongoDatabase,
    note: (t) =>
      `Meldet Kennung, Unternehmen, Paket und Module an ${APP_URL}. Übertragen wird nur der Datenbankname ${t.mongoDatabase}, kein Passwort – die App verbindet sich mit dem Zugang aus ihrer eigenen Umgebung.`,
  },
];

/** Frischer Provisionierungsplan für einen neuen Mandanten – alle Schritte offen. */
export function provisioningPlan(tenant: Tenant): ProvisioningStep[] {
  const now = new Date().toISOString();
  return BLUEPRINTS.map((blueprint) => ({
    id: blueprint.id,
    label: blueprint.label,
    target: blueprint.target(tenant),
    requiredEnv: blueprint.requiredEnv,
    status: "pending" as const,
    note: blueprint.note(tenant),
    updatedAt: now,
  }));
}

/**
 * Bringt einen gespeicherten Plan auf die aktuelle Schrittliste.
 *
 * Bestandsmandanten tragen noch die Schritte `deployment` und `dns-record` und
 * kennen `app-sync` nicht. Beschriftung, Ziel und Hinweis kommen deshalb immer
 * frisch aus dem Bauplan – erhalten bleibt nur, was ein Lauf erreicht hat:
 * Status, Zeitpunkt und die Meldung eines ausgeführten Schritts.
 *
 * Der Status des Unternehmens bleibt bewusst unangetastet. Ein aktiver Mandant
 * bekommt zwar einen offenen `app-sync`-Schritt dazu, verlöre bei einem
 * Rückfall auf „provisioning" aber sofort den Support-Zugriff.
 */
export function reconcileProvisioning(
  tenant: Tenant,
  stored: ProvisioningStep[],
): ProvisioningStep[] {
  const previousById = new Map(stored.map((step) => [step.id, step]));

  return provisioningPlan(tenant).map((step) => {
    const previous = previousById.get(step.id);
    if (!previous) return step;

    return {
      ...step,
      status: previous.status,
      // Ein offener Schritt hat noch nichts zu erzählen – dort gilt der
      // Hinweis aus dem Bauplan, sonst das Protokoll des Laufs.
      note: previous.status === "pending" ? step.note : previous.note,
      updatedAt: previous.updatedAt,
    };
  });
}

/**
 * Status eines Mandanten aus dem Stand seiner Provisionierung.
 *
 * Eine Sperre überlebt: Sie ist eine bewusste Entscheidung und darf nicht
 * dadurch verschwinden, dass ein Provisionierungsschritt durchläuft.
 *
 * An genau einer Stelle definiert, weil mehrere Wege sie brauchen: der manuelle
 * Haken, der automatische Lauf, die Wiederholung unter /admin/kaeufe und die
 * Nachmigration beim Start.
 */
export function statusFor(current: CompanyStatus, steps: ProvisioningStep[]): CompanyStatus {
  if (current === "suspended") return current;
  return steps.every((step) => step.status === "done") ? "active" : "provisioning";
}

/**
 * Schreibt das Ergebnis eines Schritts an den Mandanten – Schrittliste UND
 * Status in einem Zug.
 *
 * Bewusst die einzige Stelle, an der ein Schrittergebnis entsteht: Vorher stand
 * die Statusableitung nur an einem der drei Aufrufer, und ein vollständig
 * durchgelaufener Mandant blieb auf „provisioning" stehen – mitsamt gesperrtem
 * Support-Zugriff. Wer den Schritt hier setzt, kann den Status nicht vergessen.
 */
export function applyStepResult(
  company: Company,
  stepId: ProvisioningStepId,
  result: { status: ProvisioningStatus; note?: string; updatedAt: string },
): Company {
  const provisioning = company.provisioning.map((step) =>
    step.id === stepId
      ? {
          ...step,
          status: result.status,
          // Ohne eigene Meldung bleibt der bisherige Hinweis stehen – der
          // manuelle Haken hat nichts zu erzählen, ein Lauf schon.
          note: result.note ?? step.note,
          updatedAt: result.updatedAt,
        }
      : step,
  );

  return { ...company, provisioning, status: statusFor(company.status, provisioning) };
}

/** Ob `reconcileProvisioning` an dieser Schrittliste etwas ändern würde. */
export function provisioningIsCurrent(stored: ProvisioningStep[]): boolean {
  const expected = BLUEPRINTS.map((blueprint) => blueprint.id);
  return (
    stored.length === expected.length && stored.every((step, index) => step.id === expected[index])
  );
}

/** Welche Zugangsdaten für die automatische Ausführung noch fehlen. */
export function missingProvisioningEnv(): string[] {
  const required = [...new Set(BLUEPRINTS.map((b) => b.requiredEnv))];
  return required.filter((name) => !process.env[name]);
}
