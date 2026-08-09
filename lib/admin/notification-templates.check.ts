/**
 * Selbsttest für die Benachrichtigungsvorlagen.
 *
 * Ausführen: `node lib/admin/notification-templates.check.ts`
 *
 * Warum es diesen Check gibt: Dieselbe Funktion erzeugt die Vorschau im Browser
 * UND die Mail beim Versand. Driftet sie, sieht der Admin etwas anderes, als
 * beim Kunden ankommt – und das fällt erst auf, wenn die Mail schon raus ist.
 * Gepinnt werden die vier Stellen, an denen das schiefgehen kann: Platzhalter,
 * Absätze, der optionale Knopf und die Erkennung unbekannter Platzhalter.
 */
import assert from "node:assert/strict";

const {
  INVITE_FALLBACK_TEMPLATE,
  bodyToHtml,
  renderNotification,
  renderPlaceholders,
  sampleValues,
  unknownPlaceholders,
} = await import("./notification-templates.ts");

/* ------------------------------------------------------------- Platzhalter */

assert.equal(
  renderPlaceholders("Hallo {{name}} von {{unternehmen}}", {
    name: "Jonas",
    unternehmen: "Muster Bau",
  }),
  "Hallo Jonas von Muster Bau",
);

// Leerraum in der Klammer kommt beim Abtippen ständig vor und muss greifen.
assert.equal(renderPlaceholders("{{ name }}", { name: "Jonas" }), "Jonas");

/**
 * Unbefüllte Platzhalter bleiben STEHEN.
 *
 * Würden sie geleert, entstünde „Ihr Zugang für  ist bereit." – ein Satz, den
 * niemand als Fehler erkennt. Sichtbares {{unternehmen}} ist der ehrliche Hinweis.
 */
assert.equal(renderPlaceholders("Für {{unternehmen}}", {}), "Für {{unternehmen}}");
assert.equal(renderPlaceholders("Für {{unternehmen}}", { unternehmen: "" }), "Für {{unternehmen}}");

/* ----------------------------------------------------------------- Absätze */

const html = bodyToHtml("Erster Absatz.\n\nZweiter mit\nUmbruch.");
assert.equal((html.match(/<p /g) ?? []).length, 2, "Leerzeile trennt Absätze");
assert.ok(html.includes("Zweiter mit<br />Umbruch."), "Einfacher Umbruch bleibt Umbruch");

// Der Admin schreibt reinen Text – eingeschleustes Markup darf nicht rendern.
assert.ok(bodyToHtml("<script>alert(1)</script>").includes("&lt;script&gt;"), "Text wird escaped");

assert.equal(bodyToHtml("   \n\n  "), "", "Nur Leerraum ergibt keinen Absatz");

/* -------------------------------------------------------------------- Knopf */

/**
 * Der Anker, nicht die CSS-Klasse.
 *
 * Auf `email-button` allein zu prüfen wäre wertlos: die Klassennamen stehen
 * ohnehin im <style>-Block der Hülle, also auch in jeder Mail ohne Knopf.
 */
const BUTTON_MARKUP = '<a class="email-button"';

const mitKnopf = renderNotification(
  {
    subject: "Zugang für {{unternehmen}}",
    eyebrow: "Zugang",
    title: "Willkommen",
    body: "Hallo {{name}}",
    actionLabel: "Passwort festlegen",
    actionUrl: "{{link}}",
  },
  { unternehmen: "Muster Bau", name: "Jonas", link: "https://app.example.test/set?token=abc" },
);

assert.equal(mitKnopf.subject, "Zugang für Muster Bau");
assert.ok(mitKnopf.html.includes("Passwort festlegen"), "Knopfbeschriftung steht in der Mail");
assert.ok(
  mitKnopf.html.includes("https://app.example.test/set?token=abc"),
  "Der gerenderte Link steht im Knopf – nicht der Platzhalter",
);
assert.ok(
  mitKnopf.text.includes("https://app.example.test/set?token=abc"),
  "Auch in der Textfassung",
);

const ohneKnopf = renderNotification(
  {
    subject: "Gesperrt",
    eyebrow: "Mitteilung",
    title: "Zugang gesperrt",
    body: "Guten Tag",
    actionLabel: "",
    actionUrl: "",
  },
  {},
);
assert.ok(!ohneKnopf.html.includes(BUTTON_MARKUP), "Ohne Angaben steht kein Knopf in der Mail");

/**
 * Halb ausgefüllt heisst: kein Knopf.
 *
 * Ein Knopf ohne Ziel führt ins Leere, ein Ziel ohne Beschriftung ist
 * unklickbar. Die Server Action lehnt das ab; hier wird geprüft, dass das
 * Rendern selbst dabei nichts Kaputtes erzeugt.
 */
const halb = renderNotification(
  { subject: "S", eyebrow: "E", title: "T", body: "B", actionLabel: "Klick", actionUrl: "" },
  {},
);
assert.ok(!halb.html.includes(BUTTON_MARKUP), "Beschriftung ohne Ziel erzeugt keinen Knopf");

/* --------------------------------------------------- Unbekannte Platzhalter */

assert.deepEqual(unknownPlaceholders("{{unternehmen}} {{quatsch}}", "{{name}}"), ["quatsch"]);
assert.deepEqual(unknownPlaceholders("{{unternehmen}}", "{{name}}"), []);

/* ------------------------------------------------------------------ Fußzeile */

/**
 * Impressum und Datenschutz gehören in JEDE Mail, mit oder ohne Knopf.
 *
 * Sie hängen an der Hülle und nicht an der Vorlage – sonst könnte eine neu
 * angelegte Vorlage die Pflichtangaben versehentlich weglassen.
 */
for (const [name, mail] of [
  ["mit Knopf", mitKnopf],
  ["ohne Knopf", ohneKnopf],
] as const) {
  assert.ok(mail.html.includes(">Impressum</a>"), `Impressum fehlt (${name})`);
  assert.ok(mail.html.includes(">Datenschutz</a>"), `Datenschutz fehlt (${name})`);
}

/**
 * Genau diese Adressen, nicht irgendeine absolute.
 *
 * Sie hängen bewusst nicht an SITE_URL: Eine Mail aus einer Testinstanz soll auf
 * die echten Rechtstexte zeigen. Würde jemand sie doch ableiten, fiele es hier auf.
 */
assert.ok(
  mitKnopf.html.includes('href="https://www.gleistrix.de/impressum"'),
  "Impressum zeigt auf die Produktivadresse",
);
assert.ok(
  mitKnopf.html.includes('href="https://www.gleistrix.de/datenschutz"'),
  "Datenschutz zeigt auf die Produktivadresse",
);

/* ----------------------------------------------------------- Einladungsmail */

/**
 * Die eingebaute Einladung muss mit den Beispielwerten vollständig aufgehen –
 * bliebe hier ein {{platzhalter}} stehen, ginge er auch beim echten Versand
 * ungefüllt raus.
 */
const einladung = renderNotification(INVITE_FALLBACK_TEMPLATE, sampleValues());
assert.ok(!einladung.subject.includes("{{"), "Betreff der Einladung ist vollständig gefüllt");
assert.ok(!einladung.text.includes("{{"), "Text der Einladung ist vollständig gefüllt");

console.log("notification-templates.check.ts: alle Prüfungen bestanden");
