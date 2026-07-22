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
};

/**
 * Anonymisierte Praxisbeispiele – bewusst ohne Firmennamen.
 * Zahlen sind Platzhalter und vor dem Livegang durch belegte Werte zu ersetzen.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "sicherung-schichtplanung",
    tag: "Einsatzplanung",
    branche: "Sicherungsunternehmen",
    title: "Monatsplanung von zwei Tagen auf drei Stunden",
    summary:
      "Ein Sicherungsunternehmen mit 120 Sicherungsposten plant den kompletten Monat in Gleistrix – qualifikationsbasiert, mit automatischer Prüfung ablaufender Nachweise.",
    metrics: [
      { value: "−85 %", label: "Planungsaufwand" },
      { value: "120", label: "SiPo im Einsatz" },
      { value: "0", label: "abgelaufene Nachweise" },
    ],
  },
  {
    id: "gleisbau-abrechnung",
    tag: "Abrechnung",
    branche: "Gleisbauunternehmen",
    title: "Von der Schicht zur Rechnung in vier Tagen",
    summary:
      "Sechs Trupps erfassen ihre Zeiten mobil. Stundenzettel laufen geprüft in die Abrechnung – inklusive X-Rechnung an den Auftraggeber.",
    metrics: [
      { value: "4 Tage", label: "bis zur Rechnung" },
      { value: "−78 %", label: "Nacherfassung" },
      { value: "6", label: "Trupps im System" },
    ],
  },
  {
    id: "schweissbetrieb-protokolle",
    tag: "Dokumentation",
    branche: "Schweißfachbetrieb",
    title: "Schweißprüfungen direkt am Gleis protokolliert",
    summary:
      "Temperatur, Durchgang und Prüfprotokoll werden mobil erfasst. Der Bericht liegt beim Auftraggeber, bevor der Trupp die Baustelle verlässt.",
    metrics: [
      { value: "0", label: "Papierprotokolle" },
      { value: "−90 %", label: "Rückfragen" },
      { value: "2.400", label: "Prüfungen pro Jahr" },
    ],
  },
  {
    id: "ingenieurbuero-nachweise",
    tag: "Projektsteuerung",
    branche: "Ingenieurbüro",
    title: "Jeder Nachweis in unter 30 Sekunden auffindbar",
    summary:
      "Bauabschnitte, Prüfprotokolle und Baustellenfotos liegen je Projekt zusammen. Audits laufen ohne Suchen in Postfächern und Netzlaufwerken.",
    metrics: [
      { value: "< 30 Sek", label: "bis zum Nachweis" },
      { value: "100 %", label: "revisionssichere Ablage" },
      { value: "5 Std", label: "weniger Büro pro Woche" },
    ],
  },
];
