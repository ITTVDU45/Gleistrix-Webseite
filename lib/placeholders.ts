/**
 * Motivpool für Detailseiten (Module, Branchen, Integrationen).
 *
 * Die Katalogseiten teilen sich ein Layout, brauchen aber unterschiedliche
 * Bilder – sonst zeigt jede Unterseite dasselbe Motiv. Statt den Katalog um
 * Bildfelder zu erweitern, die heute niemand pflegen kann, verteilt
 * `sceneFor()` den Pool anhand des Slugs. Gleicher Slug ergibt immer dasselbe
 * Bild, Server und Client kommen also zum selben Ergebnis.
 *
 * Sobald ein Eintrag ein eigenes Motiv verdient: dem Katalogeintrag ein
 * Bildfeld geben und dieses hier vorziehen.
 */

export type Scene = { src: string; alt: string };

export const SCENES: Scene[] = [
  { src: "/media/szenen/gleisbaustelle.webp", alt: "Gleisbaustelle bei Tag" },
  { src: "/media/zielgruppen/sipo.webp", alt: "Sicherungsposten an der Strecke" },
  { src: "/media/start/faq.webp", alt: "Bauüberwachung im Gleis" },
  { src: "/media/szenen/nachtbaustelle.webp", alt: "Nachtbaustelle in der Sperrpause" },
  { src: "/media/seiten/ueberuns.webp", alt: "Truppbesprechung vor Schichtbeginn" },
  { src: "/media/zielgruppen/projektleiter.webp", alt: "Bauleitung mit Tablet vor Ort" },
  { src: "/media/szenen/fahrzeuge.webp", alt: "Zweiwegefahrzeuge und Technik" },
  { src: "/media/zielgruppen/lager.webp", alt: "Lager für Sicherungstechnik" },
  { src: "/media/szenen/schweissarbeiten.webp", alt: "Schweiß- und Stopfarbeiten" },
  { src: "/media/zielgruppen/backoffice.webp", alt: "Disposition im Büro" },
  { src: "/media/szenen/weiche-signal.webp", alt: "Weiche und Signalanlage" },
  { src: "/media/szenen/gleisfeld.webp", alt: "Gleisfeld aus der Vogelperspektive" },
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
