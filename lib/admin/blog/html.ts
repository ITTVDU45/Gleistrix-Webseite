/**
 * Aufräumen von Artikel-HTML vor dem Speichern.
 *
 * Der Text kommt entweder aus einem Sprachmodell, das eine untergeschobene
 * Anweisung aus einem hochgeladenen Dokument befolgt haben kann, oder aus dem
 * Adminformular. Beides landet auf der öffentlichen Seite in
 * dangerouslySetInnerHTML – ungeprüft wäre das eine offene XSS-Lücke.
 *
 * Kein DOMPurify: die Bibliothek braucht ein DOM, das hier auf dem Server nicht
 * existiert, und wäre eine weitere Abhängigkeit für eine Aufgabe, die mit einer
 * strikten Positivliste auskommt. Der Ansatz ist bewusst umgekehrt zur üblichen
 * Sperrliste – alles, was nicht ausdrücklich erlaubt ist, fällt weg. Damit
 * überleben weder `onclick` noch `style` noch ein unbekanntes Element, weil
 * ALLE Attribute entfernt werden (Ausnahme: geprüftes href).
 */

/** Erlaubte Elemente. Bilder und Tabellen bewusst nicht – dafür gibt es Felder. */
const ALLOWED = new Set([
  "p",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "b",
  "i",
  "br",
  "blockquote",
  "a",
]);

const SELF_CLOSING = new Set(["br"]);

/** Nur interne Ziele, https und E-Mail – `javascript:` wäre sonst ein Klick weit weg. */
function safeHref(value: string): string | null {
  const href = value.trim();
  if (href.startsWith("/") || href.startsWith("#")) return href;
  if (/^https:\/\/[^\s"'<>]+$/i.test(href)) return href;
  if (/^mailto:[^\s"'<>]+$/i.test(href)) return href;
  return null;
}

export function sanitizeArticleHtml(raw: string): string {
  const withoutBlocks = raw
    // Inhalt mitentfernen, nicht nur die Klammern: sonst stünde der Skripttext
    // als sichtbarer Absatz im Artikel.
    .replace(/<(script|style|iframe|object|embed|svg|math)\b[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    // Ein Codezaun um die Antwort herum ist bei Sprachmodellen der Regelfall.
    .replace(/^\s*```(?:html)?\s*/i, "")
    .replace(/\s*```\s*$/i, "");

  return withoutBlocks
    .replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (_match, slash: string, rawName: string, attrs: string) => {
      const name = rawName.toLowerCase();
      if (!ALLOWED.has(name)) return "";

      if (slash) return SELF_CLOSING.has(name) ? "" : `</${name}>`;
      if (SELF_CLOSING.has(name)) return `<${name} />`;

      if (name === "a") {
        const found = /\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(attrs);
        const href = found ? safeHref(found[2] ?? found[3] ?? found[4] ?? "") : null;
        if (!href) return "<a>";
        // Externe Ziele öffnen in einem neuen Tab; noopener, damit die Zielseite
        // nicht über window.opener auf die Gleistrix-Seite zugreift.
        return href.startsWith("https")
          ? `<a href="${href}" target="_blank" rel="noopener noreferrer">`
          : `<a href="${href}">`;
      }

      return `<${name}>`;
    })
    .trim();
}

/** Reiner Text – für Teaser, Lesezeit und die Vorschau im Adminbereich. */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
