import { migratePricing } from "@/data/pricing";
import type {
  PricingCapacity,
  PricingConfig,
  PricingIntegration,
  PricingModule,
  PricingPackage,
  PricingTexts,
} from "@/types/pricing";

import { COLLECTIONS, col, listOrdered, replaceOrdered } from "./collections";

/**
 * Preisseite: Arbeitsstand und Freigaben.
 *
 * Der Entwurf liegt zerlegt in den vier sortierten pricing_*-Collections plus
 * einem Einstellungsdokument. Eine Freigabe wird als vollständiger
 * Schnappschuss nach pricing_releases geschrieben – die öffentliche Seite liest
 * ausschließlich den neuesten Release, nie den Arbeitsstand.
 */

const SETTINGS_ID = "settings";

type SettingsDoc = {
  version: number;
  extraUserPrice: number;
  integrationCategories: string[];
  texts: PricingTexts;
  updatedAt: string;
};

/* ------------------------------------------------------------- Arbeitsstand */

/** Der Entwurf, aus den Collections zusammengesetzt – oder null, wenn leer. */
export async function readDraft(): Promise<PricingConfig | null> {
  const settings = await (await col(COLLECTIONS.pricingSettings)).findOne({ _id: SETTINGS_ID });
  if (!settings) return null;

  const [packages, capacities, modules, integrations] = await Promise.all([
    listOrdered<PricingPackage>(COLLECTIONS.pricingPackages),
    listOrdered<PricingCapacity>(COLLECTIONS.pricingCapacities),
    listOrdered<PricingModule>(COLLECTIONS.pricingModules),
    listOrdered<PricingIntegration>(COLLECTIONS.pricingIntegrations),
  ]);

  const { _id: _key, ...rest } = settings;
  const stored = rest as SettingsDoc;

  // migratePricing auch hier: ein aus altem Bestand migriertes Einstellungs-
  // dokument kann noch Version 1 tragen.
  return migratePricing({
    version: stored.version,
    packages,
    extraUserPrice: stored.extraUserPrice,
    capacities,
    modules,
    integrations,
    integrationCategories: stored.integrationCategories,
    texts: stored.texts,
    updatedAt: stored.updatedAt,
  });
}

/** Schreibt den kompletten Entwurf – alle vier Listen und die Einstellungen. */
export async function writeDraft(config: PricingConfig): Promise<void> {
  await Promise.all([
    replaceOrdered(COLLECTIONS.pricingPackages, config.packages),
    replaceOrdered(COLLECTIONS.pricingCapacities, config.capacities),
    replaceOrdered(COLLECTIONS.pricingModules, config.modules),
    replaceOrdered(COLLECTIONS.pricingIntegrations, config.integrations),
    writeSettings(config),
  ]);
}

/**
 * Schreibt nur die Listen, die sich tatsächlich geändert haben.
 *
 * Jede Liste wird beim Schreiben komplett ersetzt (siehe replaceOrdered) – das
 * unnötig für alle vier zu tun, würde bei jeder Textänderung den ganzen
 * Modulkatalog neu schreiben.
 */
export async function writeDraftChanges(
  previous: PricingConfig,
  next: PricingConfig,
): Promise<void> {
  const changed = <T>(a: T[], b: T[]) => JSON.stringify(a) !== JSON.stringify(b);
  const writes: Promise<unknown>[] = [writeSettings(next)];

  if (changed(previous.packages, next.packages)) {
    writes.push(replaceOrdered(COLLECTIONS.pricingPackages, next.packages));
  }
  if (changed(previous.capacities, next.capacities)) {
    writes.push(replaceOrdered(COLLECTIONS.pricingCapacities, next.capacities));
  }
  if (changed(previous.modules, next.modules)) {
    writes.push(replaceOrdered(COLLECTIONS.pricingModules, next.modules));
  }
  if (changed(previous.integrations, next.integrations)) {
    writes.push(replaceOrdered(COLLECTIONS.pricingIntegrations, next.integrations));
  }

  await Promise.all(writes);
}

async function writeSettings(config: PricingConfig): Promise<void> {
  const settings: SettingsDoc = {
    version: config.version,
    extraUserPrice: config.extraUserPrice,
    integrationCategories: config.integrationCategories,
    texts: config.texts,
    updatedAt: config.updatedAt,
  };
  await (await col(COLLECTIONS.pricingSettings)).replaceOne({ _id: SETTINGS_ID }, settings, {
    upsert: true,
  });
}

export async function draftEmpty(): Promise<boolean> {
  const settings = await (await col(COLLECTIONS.pricingSettings)).findOne({ _id: SETTINGS_ID });
  return settings === null;
}

/* ----------------------------------------------------------------- Freigabe */

/** Freigabe als unveränderlicher Schnappschuss – die Historie bleibt erhalten. */
export async function insertRelease(config: PricingConfig): Promise<void> {
  const publishedAt = new Date().toISOString();
  await (await col(COLLECTIONS.pricingReleases)).insertOne({
    _id: `rel_${Date.now().toString(36)}`,
    config,
    publishedAt,
  });
}

export async function latestRelease(): Promise<PricingConfig | null> {
  const doc = await (await col(COLLECTIONS.pricingReleases))
    .find({})
    .sort({ publishedAt: -1 })
    .limit(1)
    .next();

  return doc ? migratePricing(doc.config) : null;
}

export async function releasesEmpty(): Promise<boolean> {
  return (await (await col(COLLECTIONS.pricingReleases)).countDocuments({}, { limit: 1 })) === 0;
}
