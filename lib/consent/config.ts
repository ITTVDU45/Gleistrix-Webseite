/**
 * Zentrale Konfiguration der Cookie-/Consent-Verwaltung.
 *
 * Rechtlicher Rahmen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 7 DSGVO
 * (Bedingungen und Widerruf) sowie § 25 TDDDG (Speichern von und Zugriff auf
 * Informationen in der Endeinrichtung). Technisch notwendige Speicherungen
 * stützen sich auf § 25 Abs. 2 Nr. 2 TDDDG und brauchen keine Einwilligung.
 *
 * Einen Dienst ergänzen: Eintrag in CONSENT_CATEGORY_INFO unter der passenden
 * Kategorie. Kommt eine bislang undokumentierte Kategorie hinzu (Statistik,
 * Marketing), reicht ein weiterer Block in derselben Liste — der Dialog und
 * "Alle akzeptieren" richten sich nach dieser Liste, nicht nach dem Typ.
 */

/** Präfix wie beim Admin-Cookie (lib/admin/session.ts). */
export const CONSENT_COOKIE_NAME = "gx_consent";

/**
 * Version der Einwilligung. Bei inhaltlichen Änderungen — neuer Dienst, neuer
 * Zweck, neue Kategorie — hochzählen. Bestehende Einwilligungen werden dadurch
 * ungültig und erneut abgefragt, weil sie sich auf eine andere Information
 * bezogen haben.
 */
export const CONSENT_VERSION = 1;

/** Rund 6 Monate — Empfehlung der Datenschutzkonferenz zur erneuten Abfrage. */
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 182;

/**
 * Vokabular der optionalen Kategorien. Bewusst breiter als das, was heute
 * dokumentiert ist: der gespeicherte Zustand bleibt lesbar, wenn später eine
 * Kategorie hinzukommt. Eingewilligt wird trotzdem nur in das, was im Dialog
 * gezeigt wurde — siehe createSelection().
 */
export const OPTIONAL_CONSENT_CATEGORIES = [
  "functional",
  "analytics",
  "marketing",
] as const;

export type OptionalConsentCategory =
  (typeof OPTIONAL_CONSENT_CATEGORIES)[number];

export type ConsentCategory = "necessary" | OptionalConsentCategory;

export type ConsentSelection = Record<ConsentCategory, boolean>;

/** Wie die Entscheidung zustande kam — Teil des Einwilligungsnachweises. */
export type ConsentMethod = "accept_all" | "reject_all" | "custom";

export type ConsentServiceInfo = {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
};

export type ConsentCategoryInfo = {
  id: ConsentCategory;
  label: string;
  summary: string;
  legalBasis: string;
  services: readonly ConsentServiceInfo[];
};

export function isOptionalCategory(
  category: ConsentCategory,
): category is OptionalConsentCategory {
  return category !== "necessary";
}

/**
 * Die im Einstellungs-Dialog gezeigten Kategorien.
 *
 * Hier steht ausschließlich, was die Website tatsächlich einsetzt. Eine
 * Kategorie ohne Dienst wäre ein Schalter, der nichts schaltet — und eine
 * Einwilligung, die niemanden informiert.
 */
export const CONSENT_CATEGORY_INFO: readonly ConsentCategoryInfo[] = [
  {
    id: "necessary",
    label: "Notwendig",
    summary:
      "Erforderlich für den Betrieb der Website: Sicherheit, Formularverarbeitung und das Speichern Ihrer Datenschutz-Entscheidung. Diese Kategorie lässt sich nicht abwählen.",
    legalBasis:
      "§ 25 Abs. 2 Nr. 2 TDDDG, Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren Betrieb)",
    services: [
      {
        name: "gx_consent",
        provider: "Gleistrix (gleistrix.de)",
        purpose:
          "Speichert Ihre Auswahl aus diesem Dialog, damit sie bei jedem Besuch beachtet und nicht erneut abgefragt wird.",
        duration: "6 Monate",
      },
      {
        name: "gx_admin",
        provider: "Gleistrix (gleistrix.de)",
        purpose:
          "Hält die Anmeldung im Adminbereich aufrecht. Wird erst nach einer Anmeldung gesetzt, nicht beim Besuch der Website.",
        duration: "Sitzung",
      },
    ],
  },
  {
    id: "functional",
    label: "Funktional",
    summary:
      "Erlaubt eingebettete Inhalte von Drittanbietern – den Chat-Assistenten und die Online-Terminbuchung. Ohne diese Einwilligung werden sie nicht geladen; die Terminbuchung lässt sich stattdessen einmalig freigeben.",
    legalBasis: "Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG (Einwilligung)",
    services: [
      {
        name: "Chat-Assistent (Dify)",
        provider: "Dify-Instanz unter dify.hostiteasy.com",
        purpose:
          "Eingebetteter Chat für Fragen zur Plattform. Lädt Skripte vom Server des Anbieters und speichert den Gesprächsverlauf im Browser.",
        duration: "bis zu 12 Monate",
      },
      {
        name: "Cal.com Terminbuchung",
        provider: "Cal.com, Inc., San Francisco, USA",
        purpose:
          "Eingebetteter Buchungskalender für Demo-Termine. Lädt Skripte und Stile von Cal.com.",
        duration: "bis zu 12 Monate",
      },
    ],
  },
];

/** Kategorien, in die überhaupt eingewilligt werden kann — dokumentiert und optional. */
export const DOCUMENTED_OPTIONAL_CATEGORIES: readonly OptionalConsentCategory[] =
  CONSENT_CATEGORY_INFO.map((category) => category.id).filter(isOptionalCategory);

/**
 * Frische Auswahl-Objekte statt geteilter Konstanten: verhindert, dass ein
 * versehentlicher Schreibzugriff den Default für alle Aufrufer verändert.
 *
 * `true` erlaubt nur die im Dialog gezeigten Kategorien. Eine Einwilligung kann
 * sich nur auf das beziehen, worüber informiert wurde (Art. 4 Nr. 11 DSGVO).
 */
export function createSelection(optionalValue: boolean): ConsentSelection {
  const selection = { necessary: true } as ConsentSelection;

  for (const category of OPTIONAL_CONSENT_CATEGORIES) {
    selection[category] =
      optionalValue && DOCUMENTED_OPTIONAL_CATEGORIES.includes(category);
  }

  return selection;
}
