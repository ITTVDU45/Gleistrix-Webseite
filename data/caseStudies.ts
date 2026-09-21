export type CaseMetric = {
  value: string;
  label: string;
};

export type CaseStudy = {
  id: string;
  /** Kategorie-Chip oben in der Karte */
  tag: string;
  /** Branche im dunklen Kennzahlen-Panel */
  branche: string;
  title: string;
  summary: string;
  /**
   * Erste Kennzahl steht groß im Panel, die übrigen als Fußzeile in der Karte.
   * Mindestens drei Einträge.
   */
  metrics: CaseMetric[];
  /**
   * Motiv im Kennzahlen-Panel. Zeigt derzeit einen Platzhalter; sobald
   * Baustellenfotos vorliegen, wird nur der Pfad getauscht.
   */
  image: { src: string; alt: string };
};

/**
 * Beispielszenarien – bewusst ohne Firmennamen.
 *
 * Die Zahlen sind Beispielwerte, keine Messungen einzelner Kunden. Die Sektion
 * sagt das deshalb selbst (siehe CaseStudiesSection). Sobald belegte Werte aus
 * echten Einführungen vorliegen, werden sie hier eingetragen und die
 * Kennzeichnung angepasst – nicht vorher.
 *
 * Die Texte beschreiben nur Funktionen, die es im Produkt gibt.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "sicherung-schichtplanung",
    tag: "Einsatzplanung",
    branche: "Sicherungsunternehmen",
    title: "Monatsplanung von zwei Tagen auf drei Stunden",
    summary:
      "Ein Sicherungsunternehmen mit 120 Sicherungsposten plant den kompletten Monat in Gleistrix – nach Funktion, mit Konfliktprüfung bei Doppelbelegung, Urlaub und Krankmeldung.",
    metrics: [
      { value: "−85 %", label: "Planungsaufwand" },
      { value: "120", label: "SiPo im Einsatz" },
      { value: "0", label: "Doppelbelegungen" },
    ],
    image: { src: "/media/cases/schichtplanung.webp", alt: "Schichtplanung im Sicherungsunternehmen" },
  },
  {
    id: "gleisbau-abrechnung",
    tag: "Abrechnung",
    branche: "Gleisbauunternehmen",
    title: "Von der Schicht zur Rechnung in vier Tagen",
    summary:
      "Sechs Trupps erfassen ihre Zeiten am Projekt. Freigegebene Stunden laufen ohne Nacherfassung in die Abrechnung und als Stundennachweis ans Lohnbüro.",
    metrics: [
      { value: "4 Tage", label: "bis zur Rechnung" },
      { value: "−78 %", label: "Nacherfassung" },
      { value: "6", label: "Trupps im System" },
    ],
    image: { src: "/media/cases/abrechnung.webp", alt: "Abrechnung im Gleisbau" },
  },
  {
    id: "schweissbetrieb-protokolle",
    tag: "Dokumentation",
    branche: "Schweißfachbetrieb",
    title: "Schweißprüfungen direkt am Gleis protokolliert",
    summary:
      "Prüfprotokolle, Fotos und Lieferscheine werden am Projekt abgelegt. Wer nachfragt, findet den Bericht über das Projekt statt im Postfach.",
    metrics: [
      { value: "0", label: "Papierprotokolle" },
      { value: "−90 %", label: "Rückfragen" },
      { value: "2.400", label: "Prüfungen pro Jahr" },
    ],
    image: { src: "/media/cases/dokumentation.webp", alt: "Dokumentation auf der Baustelle" },
  },
  {
    id: "ingenieurbuero-nachweise",
    tag: "Projektsteuerung",
    branche: "Ingenieurbüro",
    title: "Jeder Nachweis in unter 30 Sekunden auffindbar",
    summary:
      "Prüfprotokolle, Lieferscheine und Baustellenfotos liegen je Projekt zusammen. Audits laufen ohne Suchen in Postfächern und Netzlaufwerken.",
    metrics: [
      { value: "< 30 Sek", label: "bis zum Nachweis" },
      { value: "100 %", label: "Unterlagen am Projekt" },
      { value: "5 Std", label: "weniger Büro pro Woche" },
    ],
    image: { src: "/media/cases/auslastung.webp", alt: "Auslastung und Kennzahlen im Ingenieurbüro" },
  },
];
