"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { syncConsentAttribute } from "@/lib/consent/browser";
import {
  createSelection,
  type ConsentCategory,
  type ConsentMethod,
  type ConsentSelection,
} from "@/lib/consent/config";
import type { ConsentState } from "@/lib/consent/state";
import {
  commitConsent,
  getConsentSnapshot,
  getServerConsentSnapshot,
  subscribeToConsent,
} from "@/lib/consent/store";

type ConsentContextValue = {
  /** `null`, solange keine Entscheidung vorliegt. */
  state: ConsentState | null;
  /** `false` bis der Client hydriert ist — vorher ist der Cookie unbekannt. */
  isReady: boolean;
  isBannerVisible: boolean;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  saveSelection: (selection: ConsentSelection) => void;
  hasConsent: (category: ConsentCategory) => boolean;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

/** Kein Abonnement nötig: Hydration passiert genau einmal. */
const subscribeToNothing = () => () => {};

function reportConsent(state: ConsentState): void {
  void fetch("/api/consent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ consent: state, page: window.location.pathname }),
    keepalive: true,
  }).catch(() => {
    // Der Nachweis-Request ist für die Wirksamkeit der Entscheidung nicht
    // kritisch — die steht bereits im Cookie.
  });
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );

  // Server und erster Client-Render liefern `false`; erst danach steht fest,
  // ob ein Cookie existiert. Ohne diese Trennung entstünde ein
  // Hydration-Mismatch, weil der Server den Cookie hier nicht kennt.
  const isReady = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Freigegebene Kategorien am <html>-Element spiegeln, damit auch CSS und
  // Skripte außerhalb von React den Status auslesen können.
  useEffect(() => {
    if (state) syncConsentAttribute(state.categories);
  }, [state]);

  const decide = useCallback(
    (categories: ConsentSelection, method: ConsentMethod) => {
      const next = commitConsent(categories, method);

      setIsSettingsOpen(false);
      reportConsent(next);
    },
    [],
  );

  const acceptAll = useCallback(
    () => decide(createSelection(true), "accept_all"),
    [decide],
  );

  const rejectAll = useCallback(
    () => decide(createSelection(false), "reject_all"),
    [decide],
  );

  const saveSelection = useCallback(
    (selection: ConsentSelection) => decide(selection, "custom"),
    [decide],
  );

  // Stabile Identität: der Dialog hängt seinen Fokus- und Scroll-Effekt daran
  // auf und darf ihn nicht bei jedem Context-Update neu aufsetzen.
  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      state,
      isReady,
      isBannerVisible: isReady && state === null && !isSettingsOpen,
      isSettingsOpen,
      openSettings,
      closeSettings,
      acceptAll,
      rejectAll,
      saveSelection,
      hasConsent: (category) => state?.categories[category] === true,
    }),
    [
      state,
      isReady,
      isSettingsOpen,
      openSettings,
      closeSettings,
      acceptAll,
      rejectAll,
      saveSelection,
    ],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);

  if (!context) {
    throw new Error(
      "useConsent muss innerhalb von <ConsentProvider> genutzt werden.",
    );
  }

  return context;
}
