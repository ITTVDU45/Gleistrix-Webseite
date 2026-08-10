/**
 * Selbsttest des Consent-Kerns.
 *
 * Warum es diesen Check gibt: Der Cookie-Inhalt kommt aus dem Browser und ist
 * frei manipulierbar. Ein zu nachsichtiges Parsen fällt im Betrieb nicht auf –
 * es sieht aus wie eine gültige Einwilligung, obwohl nie eine erteilt wurde.
 * Genau das ist der Fehler, der teuer wird, und genau den prüft diese Datei.
 *
 * Ausführen: `node lib/consent/consent.check.ts`
 */
import assert from "node:assert/strict";

const { CONSENT_VERSION, createSelection, DOCUMENTED_OPTIONAL_CATEGORIES } =
  await import("./config.ts");
const {
  buildConsentCookieHeader,
  parseConsentState,
  serializeConsentState,
  validateConsentState,
} = await import("./state.ts");

const VALID = {
  id: "test-id",
  version: CONSENT_VERSION,
  timestamp: "2026-08-10T12:00:00.000Z",
  method: "custom" as const,
  categories: {
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  },
};

/* --------------------------------------------------------------- Auswahl */

// Ohne Einwilligung darf keine optionale Kategorie aktiv sein. Ein
// vorangekreuztes Kästchen ist als Einwilligung unwirksam (Art. 4 Nr. 11 DSGVO).
const none = createSelection(false);
assert.equal(none.necessary, true, "notwendig ist immer aktiv");
assert.equal(none.functional, false);
assert.equal(none.analytics, false);
assert.equal(none.marketing, false);

// "Alle akzeptieren" darf nur erlauben, worüber der Dialog informiert hat.
// Kategorien ohne Eintrag in CONSENT_CATEGORY_INFO bleiben aus.
const all = createSelection(true);
for (const category of ["functional", "analytics", "marketing"] as const) {
  assert.equal(
    all[category],
    DOCUMENTED_OPTIONAL_CATEGORIES.includes(category),
    `${category} wird nur erlaubt, wenn es im Dialog gezeigt wird`,
  );
}

// Frisches Objekt je Aufruf: ein Schreibzugriff darf keinen anderen Aufrufer treffen.
const first = createSelection(false);
first.functional = true;
assert.equal(createSelection(false).functional, false, "kein geteilter Zustand");

/* ------------------------------------------------------------ Validierung */

assert.deepEqual(validateConsentState(VALID), VALID, "gültiger Zustand bleibt");

assert.equal(validateConsentState(null), null, "kein Objekt");
assert.equal(validateConsentState("nope"), null, "String ist kein Zustand");
assert.equal(
  validateConsentState({ ...VALID, version: CONSENT_VERSION + 1 }),
  null,
  "andere Version wird erneut abgefragt",
);
assert.equal(validateConsentState({ ...VALID, id: "" }), null, "leere ID");
assert.equal(
  validateConsentState({ ...VALID, id: "x".repeat(65) }),
  null,
  "überlange ID wird nicht übernommen",
);
assert.equal(
  validateConsentState({ ...VALID, timestamp: "irgendwann" }),
  null,
  "unlesbarer Zeitstempel",
);

// Unbekannte Methode fällt auf die schwächste Annahme zurück, statt den
// Zustand zu verwerfen – die Kategorien darin bleiben ja gültig.
assert.equal(validateConsentState({ ...VALID, method: "hack" })?.method, "custom");

/* -------------------------------------------------------------- Kategorien */

// Manipulierter Cookie: nichts außer einem ausdrücklichen true zählt.
const tampered = validateConsentState({
  ...VALID,
  categories: {
    necessary: false,
    functional: "true",
    analytics: 1,
    marketing: true,
  },
});
assert.equal(tampered?.categories.necessary, true, "notwendig bleibt aktiv");
assert.equal(tampered?.categories.functional, false, "String ist kein true");
assert.equal(tampered?.categories.analytics, false, "1 ist kein true");
assert.equal(tampered?.categories.marketing, true);

// Fehlende Kategorien bedeuten "keine Einwilligung", nicht "unbekannt".
const partial = validateConsentState({ ...VALID, categories: {} });
assert.equal(partial?.categories.functional, false);
assert.equal(partial?.categories.necessary, true);

/* ------------------------------------------------------------ Rundlauf */

assert.deepEqual(
  parseConsentState(serializeConsentState(VALID)),
  VALID,
  "geschrieben und wieder gelesen ergibt denselben Zustand",
);
assert.equal(parseConsentState(null), null);
assert.equal(parseConsentState(""), null);
assert.equal(parseConsentState("kein-json"), null, "Müll wirft nicht");
assert.equal(parseConsentState("%E0%A4%A"), null, "kaputte Kodierung wirft nicht");

/* ---------------------------------------------------------------- Cookie */

const secure = buildConsentCookieHeader(VALID, { secure: true });
assert.ok(secure.startsWith("gx_consent="), "richtiger Cookie-Name");
assert.ok(secure.includes("Path=/"), "gilt für die ganze Domain");
assert.ok(secure.includes("SameSite=Lax"));
assert.ok(secure.includes("Max-Age=15724800"), "182 Tage");
assert.ok(secure.includes("Secure"));

// Ohne HTTPS darf kein Secure-Flag gesetzt werden, sonst kommt der Cookie in
// der lokalen Entwicklung nie an.
assert.ok(!buildConsentCookieHeader(VALID, { secure: false }).includes("Secure"));

console.log("consent.check.ts: alle Prüfungen bestanden");
