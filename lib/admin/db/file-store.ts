import { promises as fs } from "node:fs";
import path from "node:path";

import type { AdminStore } from "@/types/admin";

import { reconcileProvisioning, statusFor } from "../tenant";
import { seed } from "./seed";

/**
 * Rückfallebene für die Entwicklung OHNE Datenbank.
 *
 * Hier bleibt der gesamte Stand ein JSON-Dokument – inklusive der Preisstände,
 * die gegen MongoDB in eigenen Collections liegen. Ohne Serverzugang lässt sich
 * der Adminbereich damit weiter starten.
 */

const DATA_DIR = process.env.GLEISTRIX_DATA_DIR ?? path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "admin-store.json");

let cache: AdminStore | null = null;
/**
 * Änderungszeitpunkt der Datei, aus der der Cache stammt.
 *
 * Ohne diesen Abgleich liefert jede Modulinstanz ewig ihren ersten Lesestand:
 * Next bündelt Routen getrennt, `/api/pricing` und eine Server Action haben
 * damit je einen eigenen `cache`. Eine Freigabe wäre in der einen sichtbar und
 * in der anderen nicht. Ein `stat` je Aufruf kostet nichts und behebt das.
 */
let cacheMtimeMs = -1;

/** Fehlende Felder auffüllen – ältere Stände kennen die neueren nicht. */
export function normalize(parsed: Partial<AdminStore>): AdminStore {
  return {
    // Wie in bootstrap.ts: Bestandsmandanten bekommen die aktuelle
    // Schrittliste, sonst fehlte hier ohne Datenbank der Schritt app-sync.
    companies: (parsed.companies ?? []).map((company) => {
      const provisioning = reconcileProvisioning(company.tenant, company.provisioning);

      return {
        ...company,
        provisioning,
        // Nur ABWÄRTS: Ein Mandant mit offenem Schritt gilt als nicht fertig
        // bereitgestellt, sonst bekäme er Support-Zugriff für etwas, das die
        // App nie erhalten hat. Aufwärts wäre hier falsch – anders als die
        // einmalige Migration läuft normalize() bei JEDEM Lesen und würde einen
        // von Hand gesetzten Status sofort wieder überschreiben.
        status:
          company.status === "active" && statusFor(company.status, provisioning) !== "active"
            ? ("provisioning" as const)
            : company.status,
      };
    }),
    packages: parsed.packages ?? [],
    usage: parsed.usage ?? [],
    supportAccess: parsed.supportAccess ?? [],
    leads: parsed.leads ?? [],
    contacts: parsed.contacts ?? [],
    brochureRequests: parsed.brochureRequests ?? [],
    demoAccess: parsed.demoAccess ?? [],
    purchases: parsed.purchases ?? [],
    // Fehlt die Preiskonfiguration, greift DEFAULT_PRICING als Rückfallebene
    // (siehe lib/admin/pricing.ts) – nicht hier, damit der Store frei von
    // Preislogik bleibt.
    pricingDraft: parsed.pricingDraft,
    pricingPublished: parsed.pricingPublished,
  };
}

export async function readFileStore(): Promise<AdminStore> {
  try {
    const stat = await fs.stat(DATA_FILE);
    if (cache && stat.mtimeMs === cacheMtimeMs) return cache;

    const raw = await fs.readFile(DATA_FILE, "utf8");
    cacheMtimeMs = stat.mtimeMs;
    cache = normalize(JSON.parse(raw) as Partial<AdminStore>);
  } catch {
    // Erster Start oder beschädigte Datei: mit Demodaten beginnen.
    cache = seed();
    await writeFileStore(cache);
  }

  return cache;
}

/**
 * Ein fehlgeschlagener Schreibvorgang wird durchgereicht, nicht verschluckt.
 * Der Adminbereich meldete sonst „gespeichert", während die Änderung verloren
 * ging – auf einem schreibgeschützten Dateisystem passiert genau das.
 */
export async function writeFileStore(next: AdminStore): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(next, null, 2), "utf8");
  // Eigenen Schreibvorgang vermerken, sonst liest der nächste Aufruf die
  // gerade geschriebene Datei unnötig erneut ein.
  cacheMtimeMs = (await fs.stat(DATA_FILE)).mtimeMs;
  cache = next;
}

/** Lesen, ändern, zurückschreiben – der Ersatz für den entfallenen writeStore. */
export async function patchFileStore<T>(
  apply: (store: AdminStore) => { next: AdminStore; result: T },
): Promise<T> {
  const store = await readFileStore();
  const { next, result } = apply(store);
  await writeFileStore(next);
  return result;
}
