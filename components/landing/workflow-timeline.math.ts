/**
 * Rechenkern der Prozess-Timeline.
 *
 * Alles hängt an einer einzigen Zahl: der Kopfposition `head` in
 * Index-Koordinaten, also `fortschritt * (anzahl - 1)`. Fortschrittslinie,
 * aktiver Knoten, Kartenskalierung und Icon-Versatz leiten sich daraus ab –
 * es gibt bewusst keine gemessenen Kartenmittelpunkte und keine Schwellenwerte
 * je Karte, die gegeneinander driften könnten.
 *
 * Bewusst frei von Node- und DOM-Importen: die Datei landet im Client-Bundle.
 * Der Selbsttest liegt daneben in workflow-timeline.check.ts.
 */

/** Kleinste Skalierung einer Karte am Rand des Blickfelds. */
export const CARD_MIN_SCALE = 0.94;

/** Maximaler Gegenversatz der Icon-Kachel in Pixeln. */
export const ICON_SHIFT_PX = 12;

/** Welcher Schritt gilt als aktiv? Klemmt an beiden Enden. */
export function activeIndex(head: number, count: number): number {
  if (count <= 0) return 0;
  return Math.min(count - 1, Math.max(0, Math.round(head)));
}

/**
 * Karte unter dem Kopf steht auf 1, Nachbarn treten zurück.
 *
 * Bewusst ohne Deckkraft-Anteil: eine Karte mit opacity 0.68 über #f3f6fb
 * drückt text-slate-500 auf rund 1,9:1 Kontrast. Tiefe kommt aus Skalierung
 * und Schatten, nicht aus Transparenz.
 */
export function cardScale(index: number, head: number): number {
  const distance = Math.min(1, Math.abs(index - head));
  return 1 - distance * (1 - CARD_MIN_SCALE);
}

/** Gegenparallaxe: die Icon-Kachel bleibt beim Durchziehen leicht zurück. */
export function iconShift(index: number, head: number): number {
  const offset = Math.max(-1, Math.min(1, index - head));
  // Die 0 wird ausdrücklich abgefangen: 0 * -12 ergibt -0, und daraus würde
  // ein `translateX(-0px)` im Stilattribut.
  return offset === 0 ? 0 : offset * -ICON_SHIFT_PX;
}

/**
 * Rückrechnung: zu welcher Seiten-Scrollposition gehört ein horizontaler Stand?
 *
 * Gebraucht, wenn der Container von fremder Hand bewegt wurde – Strg+F,
 * Fokus-scrollIntoView, virtueller Screenreader-Cursor, Trackpad-Wisch. Statt
 * gegen die Bewegung zu arbeiten, wird sie in Seitenscroll übersetzt, und der
 * Zustand heilt sich selbst.
 */
export function pageScrollFor(
  scrollLeft: number,
  travel: number,
  extra: number,
  pinStart: number,
): number {
  if (travel <= 0) return pinStart;
  const progress = Math.max(0, Math.min(1, scrollLeft / travel));
  return pinStart + progress * extra;
}
