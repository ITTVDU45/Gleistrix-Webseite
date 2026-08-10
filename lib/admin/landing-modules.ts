import { DEFAULT_LANDING_MODULES } from "@/data/landingModules";
import type { LandingModule } from "@/types/landing";

import { bootstrap } from "./db/bootstrap";
import { COLLECTIONS, listOrdered, replaceOrdered } from "./db/collections";
import { patchFileStore, readFileStore } from "./db/file-store";
import { isMongoConfigured } from "./mongo";

/**
 * Modul-Karussell der Startseite.
 *
 * Bewusst OHNE Entwurf/Freigabe wie bei der Preisseite: hier hängt kein
 * Rechenweg dran, der halb gepflegt live gehen könnte. Gespeichert ist
 * sichtbar – die Actions stoßen dafür revalidatePath("/") an.
 *
 * Leere Ablage ⇒ Auslieferungszustand aus data/landingModules.ts. Damit steht
 * die Startseite vor der ersten Pflege vollständig da, und die Reihenfolge ist
 * die Listenreihenfolge (gegen MongoDB über das order-Feld, siehe listOrdered).
 */
export async function getLandingModules(): Promise<LandingModule[]> {
  try {
    if (!isMongoConfigured()) {
      const store = await readFileStore();
      return store.landingModules?.length ? store.landingModules : DEFAULT_LANDING_MODULES;
    }

    await bootstrap();
    const stored = await listOrdered<LandingModule>(COLLECTIONS.landingModules);
    return stored.length > 0 ? stored : DEFAULT_LANDING_MODULES;
  } catch (error) {
    // Die Startseite ist die Visitenkarte: eine nicht erreichbare Ablage darf
    // sie nicht in einen Fehler laufen lassen, der Auslieferungszustand reicht.
    console.error("Startseiten-Module konnten nicht gelesen werden:", error);
    return DEFAULT_LANDING_MODULES;
  }
}

/** Schreibt die vollständige Liste – Reihenfolge inklusive. */
export async function saveLandingModules(next: LandingModule[]): Promise<void> {
  if (isMongoConfigured()) {
    await bootstrap();
    await replaceOrdered(COLLECTIONS.landingModules, next);
    return;
  }

  await patchFileStore((store) => ({
    next: { ...store, landingModules: next },
    result: undefined,
  }));
}
