import type { Collection, Document, Filter, Sort } from "mongodb";

import { getDb } from "../mongo";

/**
 * Zugriff auf die Collections der Control-Plane.
 *
 * Eine Collection je Entität statt eines Gesamtdokuments: zwei gleichzeitige
 * Bearbeiter überschreiben sich damit nicht mehr gegenseitig.
 *
 * Dokumente nutzen die fachliche id als `_id` (String, keine ObjectId). Damit
 * gibt es keinen zweiten Schlüssel, der auseinanderlaufen kann; beim Lesen wird
 * `_id` wieder zu `id`, sodass die Typen aus types/admin.ts unverändert passen.
 */

export const COLLECTIONS = {
  companies: "companies",
  companyUsers: "company_users",
  notificationTemplates: "notification_templates",
  leads: "leads",
  contacts: "contacts",
  brochureRequests: "brochure_requests",
  demoAccess: "demo_access",
  purchases: "purchases",
  supportAccess: "support_access",
  usage: "usage",
  tenantPackages: "tenant_packages",
  pricingPackages: "pricing_packages",
  pricingModules: "pricing_modules",
  pricingCapacities: "pricing_capacities",
  pricingIntegrations: "pricing_integrations",
  pricingSettings: "pricing_settings",
  pricingReleases: "pricing_releases",
  landingModules: "landing_modules",
  landingSettings: "landing_settings",
  blogSources: "blog_sources",
  blogSuggestions: "blog_suggestions",
  blogArticles: "blog_articles",
  blogCategories: "blog_categories",
  blogFiles: "blog_files",
} as const;

/** Schema aller Collections: String-_id, sonst frei. */
export type StoredDoc = { _id: string } & Document;

export async function col(name: string): Promise<Collection<StoredDoc>> {
  return (await getDb()).collection<StoredDoc>(name);
}

export type Entity = { id: string };

export function toDoc<T extends Entity>(entity: T): StoredDoc {
  const { id, ...rest } = stripUndefined(entity);
  return { _id: id, ...rest };
}

export function fromDoc<T extends Entity>(doc: StoredDoc): T {
  const { _id, ...rest } = doc;
  return { id: _id, ...rest } as unknown as T;
}

/**
 * `undefined` verschwindet beim Serialisieren nicht von selbst – der Treiber
 * schreibt `null`. Ein zurückgenommener Broschürenversand hätte dann
 * `sentAt: null` statt gar kein Feld, und `sentAt ? …` bliebe falsch.
 */
export function stripUndefined<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

/**
 * Standardzugriffe einer Entität.
 *
 * ponytail: eine Fabrik statt acht mal derselben zehn Zeilen. Die Repositories
 * darüber geben den Funktionen ihre fachlichen Namen und Typen.
 */
export function repository<T extends Entity>(name: string, sort: Sort = {}) {
  const collection = () => col(name);

  async function list(filter: Filter<StoredDoc> = {}): Promise<T[]> {
    const docs = await (await collection()).find(filter).sort(sort).toArray();
    return docs.map((doc) => fromDoc<T>(doc));
  }

  async function get(id: string): Promise<T | null> {
    const doc = await (await collection()).findOne({ _id: id });
    return doc ? fromDoc<T>(doc) : null;
  }

  async function insert(entity: T): Promise<void> {
    await (await collection()).insertOne(toDoc(entity));
  }

  async function insertMany(entities: T[]): Promise<void> {
    if (entities.length === 0) return;
    await (await collection()).insertMany(entities.map(toDoc));
  }

  /** Liest, wendet den Patch an und ersetzt – der Aufrufer sieht das Ergebnis. */
  async function patch(id: string, apply: (current: T) => T): Promise<T | null> {
    const current = await get(id);
    if (!current) return null;

    const updated = apply(current);
    // _id bleibt draußen: MongoDB lehnt ein Ersatzdokument mit _id-Feld ab,
    // sobald es abweicht – der Filter setzt ihn ohnehin.
    const { _id: _unchanged, ...replacement } = toDoc(updated);
    await (await collection()).replaceOne({ _id: id }, replacement);
    return updated;
  }

  async function remove(id: string): Promise<void> {
    await (await collection()).deleteOne({ _id: id });
  }

  async function isEmpty(): Promise<boolean> {
    return (await (await collection()).countDocuments({}, { limit: 1 })) === 0;
  }

  return { list, get, insert, insertMany, patch, remove, isEmpty };
}

/* -------------------------------------------------------- Sortierte Listen */

/**
 * Preislisten sind vom Admin sortierbar. MongoDB kennt keine Array-Reihenfolge,
 * deshalb trägt jedes Dokument ein numerisches `order`-Feld.
 */
export async function listOrdered<T extends Entity>(name: string): Promise<T[]> {
  const docs = await (await col(name)).find({}).sort({ order: 1 }).toArray();
  return docs.map(({ order: _position, ...doc }) => fromDoc<T>(doc as StoredDoc));
}

/**
 * Ersetzt eine sortierte Liste vollständig und vergibt `order` neu (0, 1, 2 …).
 *
 * ponytail: löschen und neu schreiben statt Einzel-Updates – bei einer
 * Umsortierung müsste sonst jedes Nachbardokument nachgezogen werden. Zwischen
 * beiden Schritten ist die Liste kurz leer; für eine Control-Plane mit einer
 * Handvoll Admins ist das vertretbar. Upgrade-Pfad wäre eine Transaktion, die
 * ein Replica-Set voraussetzt (wir verbinden mit directConnection).
 */
export async function replaceOrdered<T extends Entity>(name: string, items: T[]): Promise<void> {
  const collection = await col(name);
  await collection.deleteMany({});
  if (items.length === 0) return;

  await collection.insertMany(items.map((item, index) => ({ ...toDoc(item), order: index })));
}
