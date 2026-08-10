/**
 * Browserseitiger Zugriff auf den Consent-Cookie.
 *
 * Der Cookie wird direkt im Browser gesetzt, damit die Entscheidung sofort
 * wirkt — auch wenn der Nachweis-Request an den Server scheitert. Der Server
 * bestätigt sie anschließend nur noch autoritativ (app/api/consent/route.ts).
 */

import {
  CONSENT_COOKIE_NAME,
  CONSENT_MAX_AGE_SECONDS,
  OPTIONAL_CONSENT_CATEGORIES,
  type ConsentSelection,
} from "./config.ts";
import {
  parseConsentState,
  serializeConsentState,
  type ConsentState,
} from "./state.ts";

/** Attribut am `<html>`-Element, über das auch Nicht-React-Code gaten kann. */
export const CONSENT_DATA_ATTRIBUTE = "data-consent";

/** Event auf `window`, sobald sich die Einwilligung ändert. */
export const CONSENT_CHANGE_EVENT = "gx:consentchange";

export type ConsentChangeEvent = CustomEvent<ConsentState>;

function readRawCookie(name: string): string | null {
  const prefix = `${name}=`;

  const entry = document.cookie
    .split("; ")
    .find((candidate) => candidate.startsWith(prefix));

  return entry ? entry.slice(prefix.length) : null;
}

export function readConsentState(): ConsentState | null {
  if (typeof document === "undefined") return null;

  return parseConsentState(readRawCookie(CONSENT_COOKIE_NAME));
}

export function writeConsentState(state: ConsentState): void {
  if (typeof document === "undefined") return;

  const attributes = [
    `${CONSENT_COOKIE_NAME}=${serializeConsentState(state)}`,
    "path=/",
    `max-age=${CONSENT_MAX_AGE_SECONDS}`,
    "samesite=lax",
  ];

  if (window.location.protocol === "https:") attributes.push("secure");

  document.cookie = attributes.join("; ");
}

export function createConsentId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `c_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Spiegelt die freigegebenen Kategorien nach `<html data-consent="...">`,
 * damit auch CSS und Skripte außerhalb von React den Status auslesen können.
 */
export function syncConsentAttribute(selection: ConsentSelection): void {
  if (typeof document === "undefined") return;

  const granted = OPTIONAL_CONSENT_CATEGORIES.filter(
    (category) => selection[category],
  );

  document.documentElement.setAttribute(
    CONSENT_DATA_ATTRIBUTE,
    ["necessary", ...granted].join(" "),
  );
}

export function emitConsentChange(state: ConsentState): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: state }));
}
