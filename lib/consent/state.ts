/**
 * Serialisierung und defensive Validierung des Consent-Zustands.
 *
 * Diese Funktionen laufen auf Client und Server. Der Cookie-Inhalt ist
 * clientseitig manipulierbar und wird deshalb bei jedem Lesen streng geprüft:
 * Was nicht der erwarteten Form entspricht, gilt als "keine Entscheidung" –
 * dann wird erneut gefragt, statt eine erfundene Einwilligung anzunehmen.
 */

import {
  CONSENT_COOKIE_NAME,
  CONSENT_MAX_AGE_SECONDS,
  CONSENT_VERSION,
  OPTIONAL_CONSENT_CATEGORIES,
  type ConsentMethod,
  type ConsentSelection,
} from "./config.ts";

export type ConsentState = {
  /** Pseudonyme ID zur Verknüpfung mit dem serverseitigen Nachweis. */
  id: string;
  version: number;
  /** ISO-8601, Zeitpunkt der Entscheidung. */
  timestamp: string;
  method: ConsentMethod;
  categories: ConsentSelection;
};

const CONSENT_METHODS: readonly ConsentMethod[] = [
  "accept_all",
  "reject_all",
  "custom",
];

/** Maximale Länge der Consent-ID — begrenzt, was aus dem Cookie übernommen wird. */
const MAX_ID_LENGTH = 64;

export function serializeConsentState(state: ConsentState): string {
  return encodeURIComponent(JSON.stringify(state));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseCategories(value: unknown): ConsentSelection {
  const source = isRecord(value) ? value : {};

  return OPTIONAL_CONSENT_CATEGORIES.reduce<ConsentSelection>(
    (selection, category) => ({
      ...selection,
      // Nur ein ausdrückliches true zählt: fehlende oder kaputte Felder
      // bedeuten "keine Einwilligung", nicht "vermutlich ja".
      [category]: source[category] === true,
    }),
    // Notwendige Kategorie ist immer aktiv, unabhängig vom Cookie-Inhalt.
    { necessary: true } as ConsentSelection,
  );
}

/**
 * Prüft eine bereits geparste Struktur auf einen gültigen Consent-Zustand.
 *
 * Gibt `null` zurück, wenn Pflichtfelder fehlen oder die Einwilligung zu einer
 * älteren Version gehört — dann wird erneut gefragt.
 */
export function validateConsentState(value: unknown): ConsentState | null {
  if (!isRecord(value)) return null;

  if (value.version !== CONSENT_VERSION) return null;

  const { id, timestamp, method } = value;

  if (typeof id !== "string" || id.length === 0 || id.length > MAX_ID_LENGTH) {
    return null;
  }

  if (typeof timestamp !== "string" || Number.isNaN(Date.parse(timestamp))) {
    return null;
  }

  const safeMethod = CONSENT_METHODS.includes(method as ConsentMethod)
    ? (method as ConsentMethod)
    : "custom";

  return {
    id,
    version: CONSENT_VERSION,
    timestamp,
    method: safeMethod,
    categories: parseCategories(value.categories),
  };
}

/** Liest einen gespeicherten Consent-Zustand aus dem Cookie-Wert. */
export function parseConsentState(
  raw: string | null | undefined,
): ConsentState | null {
  if (!raw) return null;

  try {
    return validateConsentState(JSON.parse(decodeURIComponent(raw)));
  } catch {
    return null;
  }
}

/**
 * Baut den `Set-Cookie`-Header-Wert.
 *
 * Kein `httpOnly`: der Wert muss clientseitig lesbar sein, damit eingebettete
 * Inhalte vor dem Laden geprüft werden können. Der Cookie enthält keine
 * Anmeldedaten, sondern nur die Entscheidung selbst.
 */
export function buildConsentCookieHeader(
  state: ConsentState,
  options: { secure: boolean },
): string {
  const attributes = [
    `${CONSENT_COOKIE_NAME}=${serializeConsentState(state)}`,
    "Path=/",
    `Max-Age=${CONSENT_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
  ];

  if (options.secure) attributes.push("Secure");

  return attributes.join("; ");
}
