import type { IndexSpecification } from "mongodb";

import { migratePricing } from "@/data/pricing";
import type { AdminStore } from "@/types/admin";

import { provisioningIsCurrent, reconcileProvisioning, statusFor } from "../tenant";

import { insertBrochureRequests, brochureRequestsEmpty } from "./brochure";
import { COLLECTIONS, col } from "./collections";
import { companiesEmpty, insertCompanies, listCompanies, patchCompany } from "./companies";
import { contactsEmpty, insertContacts } from "./contacts";
import { demoAccessEmpty, insertDemoAccessEntries } from "./demoAccess";
import { insertLeads, leadsEmpty } from "./leads";
import { draftEmpty, insertRelease, releasesEmpty, writeDraft } from "./pricing";
import { insertPurchases, purchasesEmpty } from "./purchases";
import { seed } from "./seed";
import { insertSupportAccessEntries, supportAccessEmpty } from "./supportAccess";
import { insertPackages, packagesEmpty } from "./tenantPackages";
import { insertUsage, usageEmpty } from "./usage";

/**
 * Einmaliger Start der Datenbankablage: Indizes, Migration, Demodaten.
 *
 * Läuft beim ersten Zugriff und danach nie wieder – ein Promise im Modul-Scope
 * hält parallele Aufrufe zusammen. Next bündelt Routen getrennt, deshalb kann
 * es pro Prozess mehrere Modulinstanzen geben; alle Schritte sind daher auch
 * über Instanzgrenzen hinweg idempotent.
 */

const LEGACY_COLLECTION = "control_plane";
const LEGACY_ID = "admin-store";
const MIGRATED_ID = "admin-store-migrated";

let started: Promise<void> | null = null;

export function bootstrap(): Promise<void> {
  // Ein gescheiterter Lauf darf nicht dauerhaft als erledigt gelten – sonst
  // bliebe die Ablage nach einem Netzwerkaussetzer bis zum Neustart uninitialisiert.
  started ??= run().catch((error: unknown) => {
    started = null;
    throw error;
  });
  return started;
}

async function run(): Promise<void> {
  await ensureIndexes();
  const migrated = await migrateLegacyDocument();
  if (!migrated) await seedIfEmpty();
  await migrateProvisioningPlans();
}

/**
 * Zieht gespeicherte Provisionierungspläne auf die aktuelle Schrittliste nach.
 *
 * Bestandsmandanten kennen `app-sync` nicht und tragen noch `deployment` und
 * `dns-record`. Ohne diesen Lauf bekämen sie den neuen Schritt erst, wenn
 * jemand sie neu anlegt.
 *
 * Gleichzeitig fällt das Feld `tenant.subdomain` weg. Der Typ kennt es nicht
 * mehr, im Dokument stünde sonst dauerhaft eine Adresse, die es nicht gibt.
 *
 * Der Status zieht mit: Ein Mandant mit offenem `app-sync` ist nicht fertig
 * bereitgestellt und geht zurück auf `provisioning`. Bis der Schritt läuft,
 * gibt es für ihn keinen Support-Zugriff – der setzt einen abgeschlossenen
 * Lauf voraus.
 *
 * Idempotent: Beim zweiten Start stimmen Schrittliste, `tenant` und Status, und
 * es wird nichts geschrieben.
 */
async function migrateProvisioningPlans(): Promise<void> {
  const companies = await listCompanies();
  const outdated = companies.filter((company) => {
    const provisioning = reconcileProvisioning(company.tenant, company.provisioning);
    return (
      !provisioningIsCurrent(company.provisioning) ||
      "subdomain" in (company.tenant ?? {}) ||
      statusFor(company.status, provisioning) !== company.status
    );
  });
  if (outdated.length === 0) return;

  await Promise.all(
    outdated.map((company) =>
      patchCompany(company.id, (current) => {
        const provisioning = reconcileProvisioning(current.tenant, current.provisioning);

        return {
          ...current,
          // Neu aufgebaut statt gespreizt: nur so verschwinden Altfelder, die
          // fromDoc unverändert durchreicht.
          tenant: {
            mongoDatabase: current.tenant.mongoDatabase,
            mongoUser: current.tenant.mongoUser,
            minioBucket: current.tenant.minioBucket,
          },
          provisioning,
          status: statusFor(current.status, provisioning),
        };
      }),
    ),
  );
}

/* ---------------------------------------------------------------- Migration */

/**
 * Verteilt das alte Gesamtdokument control_plane/admin-store auf die
 * Collections und benennt es danach in admin-store-migrated um.
 *
 * Reihenfolge bewusst: erst die Kopie anlegen, dann verteilen, zuletzt das
 * Original löschen. Bricht der Lauf dazwischen ab, ist der alte Stand noch da.
 * Das Anlegen der Kopie ist gleichzeitig der Anspruch: `$setOnInsert` mit
 * `upsert` schlägt für jede weitere Instanz fehl, sodass nur eine verteilt.
 *
 * @returns ob es überhaupt einen alten Stand gab
 */
async function migrateLegacyDocument(): Promise<boolean> {
  const control = await col(LEGACY_COLLECTION);
  const legacy = await control.findOne({ _id: LEGACY_ID });
  if (!legacy) return false;

  const { _id: _key, ...stored } = legacy;
  const claim = await control.updateOne(
    { _id: MIGRATED_ID },
    { $setOnInsert: stored },
    { upsert: true },
  );
  // Eine andere Instanz war schneller und verteilt gerade – nichts zu tun.
  if (!claim.upsertedCount) return true;

  await distribute(stored as Partial<AdminStore>);
  await control.deleteOne({ _id: LEGACY_ID });
  return true;
}

/**
 * Schreibt nur in Collections, die leer sind.
 *
 * Bestehende Daten werden nie überschrieben: hätte jemand nach dem Umstieg
 * bereits gepflegt, würde die Migration diese Arbeit sonst verwerfen.
 */
async function distribute(store: Partial<AdminStore>): Promise<void> {
  await Promise.all([
    fill(companiesEmpty, () => insertCompanies(store.companies ?? [])),
    fill(packagesEmpty, () => insertPackages(store.packages ?? [])),
    fill(usageEmpty, () => insertUsage(store.usage ?? [])),
    fill(supportAccessEmpty, () => insertSupportAccessEntries(store.supportAccess ?? [])),
    fill(leadsEmpty, () => insertLeads(store.leads ?? [])),
    fill(contactsEmpty, () => insertContacts(store.contacts ?? [])),
    fill(brochureRequestsEmpty, () => insertBrochureRequests(store.brochureRequests ?? [])),
    fill(demoAccessEmpty, () => insertDemoAccessEntries(store.demoAccess ?? [])),
    fill(purchasesEmpty, () => insertPurchases(store.purchases ?? [])),
    fill(draftEmpty, async () => {
      if (store.pricingDraft) await writeDraft(migratePricing(store.pricingDraft));
    }),
    fill(releasesEmpty, async () => {
      if (store.pricingPublished) await insertRelease(migratePricing(store.pricingPublished));
    }),
  ]);
}

async function fill(isEmpty: () => Promise<boolean>, write: () => Promise<void>): Promise<void> {
  if (await isEmpty()) await write();
}

/* ---------------------------------------------------------------- Demodaten */

/** Erster Start gegen eine leere Datenbank ohne alten Stand. */
async function seedIfEmpty(): Promise<void> {
  if (!(await companiesEmpty())) return;
  await distribute(seed());
}

/* ------------------------------------------------------------------ Indizes */

async function ensureIndexes(): Promise<void> {
  await Promise.all([
    index(COLLECTIONS.companies, { createdAt: 1 }),
    index(COLLECTIONS.tenantPackages, { createdAt: 1 }),
    index(COLLECTIONS.leads, { createdAt: -1 }),
    index(COLLECTIONS.contacts, { createdAt: -1 }),
    index(COLLECTIONS.brochureRequests, { createdAt: -1 }),
    index(COLLECTIONS.demoAccess, { createdAt: -1 }),
    index(COLLECTIONS.purchases, { companyId: 1, createdAt: -1 }),
    index(COLLECTIONS.purchases, { createdAt: -1 }),
    index(COLLECTIONS.supportAccess, { companyId: 1, createdAt: -1 }),
    index(COLLECTIONS.usage, { companyId: 1, month: 1 }),
    index(COLLECTIONS.pricingPackages, { order: 1 }),
    index(COLLECTIONS.pricingCapacities, { order: 1 }),
    index(COLLECTIONS.pricingModules, { order: 1 }),
    index(COLLECTIONS.pricingIntegrations, { order: 1 }),
    index(COLLECTIONS.pricingReleases, { publishedAt: -1 }),
  ]);
}

/** createIndex ist idempotent – ein zweiter Aufruf mit gleichem Schlüssel tut nichts. */
async function index(name: string, keys: IndexSpecification): Promise<void> {
  await (await col(name)).createIndex(keys);
}
