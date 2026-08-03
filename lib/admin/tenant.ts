import type { ProvisioningStep, Tenant } from "@/types/admin";

export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_TENANT_ROOT_DOMAIN ?? "gleistrix.de";

/** Reservierte Subdomains, die kein Mandant belegen darf. */
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
    return { ok: false, error: `„${slug}“ ist eine reservierte Subdomain.` };
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
    subdomain: `${slug}.${ROOT_DOMAIN}`,
    mongoDatabase: `gleistrix_${flat}`,
    mongoUser: `svc_${flat}`,
    minioBucket: `gleistrix-${slug}`,
  };
}

/** Basis-URL der Kundeninstanz. */
export function instanceUrl(tenant: Tenant): string {
  return `https://${tenant.subdomain}`;
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
      `Bucket ${t.minioBucket} mit Versionierung, Verschlüsselung und einer Policy, die nur ${t.mongoUser} zulässt.`,
  },
  {
    id: "deployment",
    label: "Gleistrix-Instanz deployen",
    requiredEnv: "VERCEL_API_TOKEN",
    target: (t) => t.subdomain,
    note: (t) =>
      `Eigenes Deployment der Gleistrix-App: MONGODB_URI auf ${t.mongoDatabase}, MinIO auf ${t.minioBucket}, eigenes NEXTAUTH_SECRET und eigenes SUPERADMIN_EMAIL/PASSWORD für den Kunden.`,
  },
  {
    id: "dns-record",
    label: "DNS-Eintrag setzen",
    requiredEnv: "DNS_API_TOKEN",
    target: (t) => t.subdomain,
    note: (t) =>
      `CNAME ${t.subdomain} → das Deployment des Mandanten, anschließend TLS-Zertifikat ausstellen.`,
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

/** Welche Zugangsdaten für die automatische Ausführung noch fehlen. */
export function missingProvisioningEnv(): string[] {
  const required = [...new Set(BLUEPRINTS.map((b) => b.requiredEnv))];
  return required.filter((name) => !process.env[name]);
}
