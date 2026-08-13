/**
 * Erzeugt die Platzhalter-Bilder unter public/placeholders/.
 *
 * Jede Datei ist ein eigenständiges SVG im Markenlook (Indigo-Verlauf mit
 * Gleismotiv) und traegt sichtbar ihr Motiv. Sobald echte Fotos vorliegen,
 * wird die jeweilige Datei ersetzt – die Bildpfade im Code bleiben gleich.
 *
 * Aufruf: node scripts/generate-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "placeholders");

/** Seitenverhaeltnisse, die im Layout vorkommen. */
const RATIOS = {
  wide: { w: 1600, h: 900 },
  landscape: { w: 1200, h: 900 },
  portrait: { w: 900, h: 1200 },
  square: { w: 1000, h: 1000 },
};

/** Farbpaare fuer den Hintergrundverlauf – rotieren, damit Seiten nicht monoton wirken. */
const PALETTES = [
  ["#312e81", "#4f46e5"],
  ["#1e1b4b", "#4338ca"],
  ["#3730a3", "#6366f1"],
  ["#26235c", "#5b21b6"],
];

const escapeXml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Gleiskörper in Zentralperspektive: zwei Schienen plus enger werdende Schwellen. */
function trackMotif(w, h) {
  const vanishY = h * 0.44;
  const baseHalf = w * 0.34;
  const depth = h - vanishY;
  const railLeft = `M ${w / 2 - baseHalf} ${h} L ${w / 2} ${vanishY}`;
  const railRight = `M ${w / 2 + baseHalf} ${h} L ${w / 2} ${vanishY}`;

  const sleepers = [];
  const count = 16;
  for (let i = 0; i < count; i++) {
    const progress = Math.pow(i / count, 1.9);
    const y = h - depth * progress;
    const scale = (h - y) / depth;
    const half = baseHalf * (1 - scale) * 1.16;
    if (half < 6) continue;
    sleepers.push(
      `<line x1="${(w / 2 - half).toFixed(1)}" y1="${y.toFixed(1)}" x2="${(w / 2 + half).toFixed(1)}" y2="${y.toFixed(1)}" stroke-width="${Math.max(1.5, 9 * (1 - scale)).toFixed(1)}" />`,
    );
  }

  return `<g stroke="#ffffff" stroke-linecap="round" opacity="0.16">
      <g>${sleepers.join("")}</g>
      <path d="${railLeft}" stroke-width="5" fill="none" />
      <path d="${railRight}" stroke-width="5" fill="none" />
    </g>`;
}

function buildSvg({ label, hint, ratio, paletteIndex }) {
  const { w, h } = RATIOS[ratio];
  const [from, to] = PALETTES[paletteIndex % PALETTES.length];
  const titleSize = Math.round(Math.min(w, h) * 0.056);
  const hintSize = Math.round(titleSize * 0.52);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${escapeXml(label)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}" />
      <stop offset="1" stop-color="${to}" />
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.32" r="0.6">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.22" />
      <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.4" fill="#ffffff" fill-opacity="0.10" />
    </pattern>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#bg)" />
  <rect width="${w}" height="${h}" fill="url(#dots)" />
  ${trackMotif(w, h)}
  <rect width="${w}" height="${h}" fill="url(#glow)" />

  <g font-family="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" text-anchor="middle">
    <text x="${w / 2}" y="${h * 0.5}" fill="#ffffff" font-size="${titleSize}" font-weight="700" letter-spacing="-0.5">${escapeXml(label)}</text>
    <text x="${w / 2}" y="${h * 0.5 + titleSize * 1.25}" fill="#ffffff" fill-opacity="0.62" font-size="${hintSize}" font-weight="500" letter-spacing="1.6">${escapeXml(hint)}</text>
  </g>
</svg>
`;
}

/**
 * name = Dateiname ohne Endung, label = sichtbarer Motivhinweis.
 * Der Hinweis sagt, welches Foto hier spaeter stehen soll.
 */
const PLACEHOLDERS = [
  // Allgemeiner Motivpool – wird auf Detailseiten deterministisch verteilt.
  { name: "szene-gleisbaustelle", label: "Gleisbaustelle bei Tag", ratio: "landscape" },
  { name: "szene-sicherungsposten", label: "Sicherungsposten an der Strecke", ratio: "landscape" },
  { name: "szene-bauueberwachung", label: "Bauüberwachung im Gleis", ratio: "landscape" },
  { name: "szene-nachtbaustelle", label: "Nachtbaustelle in der Sperrpause", ratio: "landscape" },
  { name: "szene-truppbesprechung", label: "Truppbesprechung vor Schichtbeginn", ratio: "landscape" },
  { name: "szene-bauleitung-tablet", label: "Bauleitung mit Tablet vor Ort", ratio: "landscape" },
  { name: "szene-fahrzeuge", label: "Zweiwegefahrzeuge & Technik", ratio: "landscape" },
  { name: "szene-lager", label: "Lager für Sicherungstechnik", ratio: "landscape" },
  { name: "szene-schweissarbeiten", label: "Schweiß- und Stopfarbeiten", ratio: "landscape" },
  { name: "szene-disposition-buero", label: "Disposition im Büro", ratio: "landscape" },
  { name: "szene-weiche-signal", label: "Weiche und Signalanlage", ratio: "landscape" },
  { name: "szene-gleisfeld", label: "Gleisfeld aus der Vogelperspektive", ratio: "landscape" },

  // Startseite
  { name: "problem-zettelwirtschaft", label: "Papierpläne und Stundenzettel", ratio: "portrait" },
  { name: "agenten-arbeitsvorbereitung", label: "Ausschreibung am Bildschirm", ratio: "landscape" },
  { name: "workflow-durchgaengig", label: "Vom Auftrag bis zur Abrechnung", ratio: "wide" },

  // Zielgruppen
  { name: "zielgruppe-sipo", label: "Sicherungsposten im Einsatz", ratio: "landscape" },
  { name: "zielgruppe-bahndienstleister", label: "Bahndienstleister auf der Baustelle", ratio: "landscape" },
  { name: "zielgruppe-projektleiter", label: "Projektleitung im Gelände", ratio: "landscape" },
  { name: "zielgruppe-backoffice", label: "Backoffice am Arbeitsplatz", ratio: "landscape" },
  { name: "zielgruppe-lager", label: "Lagerverwaltung mit Scanner", ratio: "landscape" },
  { name: "zielgruppe-geschaeftsfuehrung", label: "Geschäftsführung im Auswertungsgespräch", ratio: "landscape" },

  // Praxisbeispiele
  { name: "case-schichtplanung", label: "Schichtplanung im Sicherungsunternehmen", ratio: "square" },
  { name: "case-abrechnung", label: "Abrechnung im Gleisbau", ratio: "square" },
  { name: "case-dokumentation", label: "Dokumentation auf der Baustelle", ratio: "square" },
  { name: "case-auslastung", label: "Auslastung und Kennzahlen", ratio: "square" },

  // SEO-Landingpages
  { name: "seo-erp-bahnbau", label: "ERP im Bahnbau", ratio: "wide" },
  { name: "seo-disposition", label: "Disposition und Plantafel", ratio: "wide" },
  { name: "seo-sicherungsunternehmen", label: "Sicherungsunternehmen im Einsatz", ratio: "wide" },
  { name: "seo-prozesskette", label: "Verbundene Prozesskette", ratio: "landscape" },

  // Übersichtsseiten
  { name: "uebersicht-branchen", label: "Branchen im Bahnbetrieb", ratio: "wide" },
  { name: "uebersicht-integrationen", label: "Systeme im Zusammenspiel", ratio: "wide" },
  { name: "uebersicht-preise", label: "Einführung und Betreuung", ratio: "wide" },
  { name: "uebersicht-blog", label: "Wissen aus der Bahnbranche", ratio: "wide" },
];

mkdirSync(OUT_DIR, { recursive: true });

for (const [index, item] of PLACEHOLDERS.entries()) {
  const svg = buildSvg({
    label: item.label,
    hint: "PLATZHALTER · BILD ERSETZEN",
    ratio: item.ratio,
    paletteIndex: index,
  });
  writeFileSync(join(OUT_DIR, `${item.name}.svg`), svg, "utf8");
}

console.log(`${PLACEHOLDERS.length} Platzhalter geschrieben nach ${OUT_DIR}`);
