/**
 * Selbsttest des Timeline-Rechenkerns.
 *
 * Warum es diesen Check gibt: die vier Funktionen laufen 60-mal pro Sekunde in
 * einer gescrubbten Animation. Ein Vorzeichenfehler oder eine fehlende Klemmung
 * fällt dort nicht als Ausnahme auf, sondern als Karte, die aus dem Bild
 * wandert – und in der Vorschauumgebung dieses Projekts läuft keine
 * Frame-Schleife, die das zeigen würde. Der Check ersetzt das Auge.
 *
 * Ausführen: `node components/landing/workflow-timeline.check.ts`
 */
import assert from "node:assert/strict";

const { CARD_MIN_SCALE, ICON_SHIFT_PX, activeIndex, cardScale, iconShift, pageScrollFor } =
  await import("./workflow-timeline.math.ts");

const COUNT = 6;
/** Kopfposition wie im Renderer: Fortschritt mal (Anzahl - 1). */
const head = (progress: number) => progress * (COUNT - 1);

/* ------------------------------------------------------------ Aktiver Schritt */

// Anfang und Ende muessen exakt treffen: am Anfang leuchtet Knoten 1, am Ende
// Knoten 6. Ein Rundungsfehler an den Raendern hiesse, dass der letzte Schritt
// nie aktiv wird.
assert.equal(activeIndex(head(0), COUNT), 0);
assert.equal(activeIndex(head(1), COUNT), COUNT - 1);
assert.equal(activeIndex(head(0.5), COUNT), 3, "Mitte rundet auf den naechsten Knoten");

// Ueber die Raender hinaus darf nichts herauslaufen – ein Scrub schiesst durch
// die Traegheit regelmaessig kurz ueber 1 hinaus.
assert.equal(activeIndex(-3, COUNT), 0);
assert.equal(activeIndex(99, COUNT), COUNT - 1);
assert.equal(activeIndex(0, 0), 0, "Ohne Schritte darf kein NaN entstehen");

/* -------------------------------------------------------- Kartenskalierung */

assert.equal(cardScale(2, 2), 1, "Die Karte unter dem Kopf steht auf voller Groesse");
assert.equal(cardScale(0, 5), CARD_MIN_SCALE, "Weit entfernt gilt die Untergrenze");
assert.equal(cardScale(1, 2), CARD_MIN_SCALE, "Schon der direkte Nachbar ist ganz zurueck");

for (let index = 0; index < COUNT; index += 1) {
  for (let step = 0; step <= 20; step += 1) {
    const scale = cardScale(index, head(step / 20));
    assert.ok(
      scale >= CARD_MIN_SCALE && scale <= 1,
      `cardScale(${index}, ${step}) lief aus dem Rahmen: ${scale}`,
    );
  }
}

/* ------------------------------------------------------------ Icon-Versatz */

assert.equal(iconShift(3, 3), 0, "Unter dem Kopf steht die Kachel still");
// Vorzeichen: eine Karte RECHTS vom Kopf zieht die Kachel nach links.
assert.equal(iconShift(5, 0), -ICON_SHIFT_PX);
assert.equal(iconShift(0, 5), ICON_SHIFT_PX);
assert.ok(Math.abs(iconShift(0, 99)) <= ICON_SHIFT_PX, "Der Versatz muss geklemmt sein");

/* ------------------------------------------------- Rueckrechnung auf die Seite */

const TRAVEL = 988;
const EXTRA = 1235;
const PIN_START = 4200;

assert.equal(pageScrollFor(0, TRAVEL, EXTRA, PIN_START), PIN_START);
assert.equal(pageScrollFor(TRAVEL, TRAVEL, EXTRA, PIN_START), PIN_START + EXTRA);
assert.equal(pageScrollFor(TRAVEL / 2, TRAVEL, EXTRA, PIN_START), PIN_START + EXTRA / 2);

// Ohne horizontale Strecke gibt es nichts zurueckzurechnen – ohne diesen Zweig
// waere es eine Division durch null und die Seite spraenge nach NaN.
assert.equal(pageScrollFor(0, 0, EXTRA, PIN_START), PIN_START);
assert.ok(Number.isFinite(pageScrollFor(500, 0, EXTRA, PIN_START)));

// Ausserhalb des Fensters bleibt das Ergebnis im Pin-Bereich, sonst rissen
// Ueberschwinger die Seite aus der Sektion heraus.
assert.equal(pageScrollFor(-200, TRAVEL, EXTRA, PIN_START), PIN_START);
assert.equal(pageScrollFor(TRAVEL + 200, TRAVEL, EXTRA, PIN_START), PIN_START + EXTRA);

/* ------------------------------------------------------------- Zusammenspiel */

// Der Renderer schreibt scrollLeft = p * travel und der Scroll-Listener rechnet
// zurueck. Beides muss sich aufheben, sonst schaukelt sich die Selbstheilung
// zu einer Endlosschleife auf.
for (let step = 0; step <= 20; step += 1) {
  const progress = step / 20;
  const scrollLeft = progress * TRAVEL;
  const zurueck = pageScrollFor(scrollLeft, TRAVEL, EXTRA, PIN_START);
  assert.ok(
    Math.abs(zurueck - (PIN_START + progress * EXTRA)) < 1e-9,
    `Hin- und Rueckrechnung driften bei ${progress}`,
  );
}

console.log("workflow-timeline.check: alle Pruefungen bestanden");
