/**
 * Externer Store für den Consent-Zustand.
 *
 * Der Cookie ist die Quelle der Wahrheit — React abonniert ihn über
 * `useSyncExternalStore`, statt ihn in einem Effekt in State zu kopieren. Damit
 * gibt es keinen Moment, in dem gerenderte UI und gespeicherte Entscheidung
 * auseinanderlaufen.
 */

import {
  createConsentId,
  emitConsentChange,
  readConsentState,
  syncConsentAttribute,
  writeConsentState,
} from "./browser.ts";
import {
  CONSENT_VERSION,
  type ConsentMethod,
  type ConsentSelection,
} from "./config.ts";
import type { ConsentState } from "./state.ts";

const listeners = new Set<() => void>();

/**
 * Zwischengespeicherter Snapshot: `useSyncExternalStore` verlangt bei
 * unverändertem Zustand dieselbe Objektreferenz, sonst rendert React endlos.
 */
let snapshot: ConsentState | null = null;
let isSnapshotInitialized = false;

export function subscribeToConsent(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getConsentSnapshot(): ConsentState | null {
  if (!isSnapshotInitialized) {
    snapshot = readConsentState();
    isSnapshotInitialized = true;
  }

  return snapshot;
}

/**
 * Auf dem Server liegt keine Entscheidung vor.
 *
 * Bewusst immer `null`: Der Server rendert damit denselben Zustand wie der
 * Client im ersten Durchgang, es gibt keinen Hydration-Mismatch. Erst nach der
 * Hydration wird der Cookie gelesen — deshalb hängt die Sichtbarkeit des
 * Banners zusätzlich an `isReady` im Provider.
 */
export function getServerConsentSnapshot(): ConsentState | null {
  return null;
}

/**
 * Speichert eine Entscheidung: Cookie schreiben, Snapshot aktualisieren und
 * alle Abonnenten benachrichtigen.
 */
export function commitConsent(
  categories: ConsentSelection,
  method: ConsentMethod,
): ConsentState {
  const next: ConsentState = {
    id: createConsentId(),
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    method,
    // Notwendige Kategorie lässt sich nicht abwählen.
    categories: { ...categories, necessary: true },
  };

  writeConsentState(next);
  syncConsentAttribute(next.categories);

  snapshot = next;
  isSnapshotInitialized = true;

  emitConsentChange(next);
  listeners.forEach((listener) => listener());

  return next;
}
