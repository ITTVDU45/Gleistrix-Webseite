/**
 * Motivpool für Detailseiten (Module, Branchen, Integrationen).
 *
 * Die Katalogseiten teilen sich ein Layout, brauchen aber unterschiedliche
 * Bilder – sonst zeigt jede Unterseite dasselbe Motiv. Statt den Katalog um
 * Bildfelder zu erweitern, die heute niemand pflegen kann, verteilt
 * `sceneFor()` den Pool anhand des Slugs. Gleicher Slug ergibt immer dasselbe
 * Bild, Server und Client kommen also zum selben Ergebnis.
 *
 * Sobald echte Fotos je Eintrag vorliegen: Datei unter public/placeholders/
 * ersetzen, oder dem Katalogeintrag ein eigenes Bildfeld geben und dieses hier
 * vorziehen.
 */

export type Scene = { src: string; alt: string };

export const SCENES: Scene[] = [
  { src: "/placeholders/szene-gleisbaustelle.svg", alt: "Gleisbaustelle bei Tag" },
  { src: "/placeholders/szene-sicherungsposten.svg", alt: "Sicherungsposten an der Strecke" },
  { src: "/placeholders/szene-bauueberwachung.svg", alt: "Bauüberwachung im Gleis" },
  { src: "/placeholders/szene-nachtbaustelle.svg", alt: "Nachtbaustelle in der Sperrpause" },
  { src: "/placeholders/szene-truppbesprechung.svg", alt: "Truppbesprechung vor Schichtbeginn" },
  { src: "/placeholders/szene-bauleitung-tablet.svg", alt: "Bauleitung mit Tablet vor Ort" },
  { src: "/placeholders/szene-fahrzeuge.svg", alt: "Zweiwegefahrzeuge und Technik" },
  { src: "/placeholders/szene-lager.svg", alt: "Lager für Sicherungstechnik" },
  { src: "/placeholders/szene-schweissarbeiten.svg", alt: "Schweiß- und Stopfarbeiten" },
  { src: "/placeholders/szene-disposition-buero.svg", alt: "Disposition im Büro" },
  { src: "/placeholders/szene-weiche-signal.svg", alt: "Weiche und Signalanlage" },
  { src: "/placeholders/szene-gleisfeld.svg", alt: "Gleisfeld aus der Vogelperspektive" },
];

/** Stabiler Hash über den Slug – kein Zufall, damit SSR und Hydration übereinstimmen. */
function hash(seed: string): number {
  let value = 0;
  for (let index = 0; index < seed.length; index++) {
    value = (value * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return value;
}

/**
 * @param seed   Slug des Eintrags
 * @param offset Position innerhalb der Seite (0 = erstes Bild, 1 = zweites …)
 */
export function sceneFor(seed: string, offset = 0): Scene {
  // Der Offset ist teilerfremd zur Poolgröße (5 zu 12), damit zwei Bilder auf
  // derselben Seite nie zusammenfallen.
  return SCENES[(hash(seed) + offset * 5) % SCENES.length];
}
