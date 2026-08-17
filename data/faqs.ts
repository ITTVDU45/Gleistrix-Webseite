export type FAQ = {
  question: string;
  answer: string;
};

/**
 * Fragen und Antworten der Startseite.
 *
 * Liegen hier und nicht in FAQSection, weil zwei Stellen sie brauchen: die
 * Komponente rendert sie, und app/page.tsx erzeugt daraus die
 * FAQPage-Auszeichnung. Google akzeptiert die Auszeichnung nur, wenn Frage und
 * Antwort genau so auch sichtbar auf der Seite stehen – bei zwei getrennten
 * Fassungen liefen sie irgendwann auseinander.
 */
/**
 * Wie viele Fragen FAQSection gleichzeitig rendert.
 *
 * Steht hier, weil app/page.tsx die Zahl braucht: Das Karussell rendert die
 * übrigen Fragen nicht versteckt, sondern gar nicht – sie stehen erst nach
 * einem Klick im DOM. Ausgezeichnet werden darf deshalb nur, was ohne
 * Interaktion ausgeliefert wird. Wer den Wert hier ändert, ändert beides
 * zugleich und kann die zwei Stellen nicht auseinanderlaufen lassen.
 */
export const HOME_FAQ_VISIBLE_COUNT = 3;

export const HOME_FAQS: readonly FAQ[] = [
  {
    question: "Für wen ist Gleistrix geeignet?",
    answer:
      "Gleistrix richtet sich an Bahndienstleister jeder Größe: Sicherungsunternehmen (SIPO), Gleisbauunternehmen, Subunternehmer und Dienstleister rund um Bahninfrastruktur. Vom Zwei-Mann-Betrieb bis zum Unternehmen mit mehreren Standorten.",
  },
  {
    question: "Welche Module sind enthalten?",
    answer:
      "Projektmanagement, Plantafel & Einsatzplanung, Mitarbeiter- und Fahrzeugverwaltung, Dokumentenmanagement, Lagerverwaltung sowie Abrechnung mit vorbereitender Buchhaltung. KI-Agenten lassen sich optional zuschalten.",
  },
  {
    question: "Können bestehende Prozesse abgebildet werden?",
    answer:
      "Ja. Gleistrix wird auf deine Abläufe eingerichtet – von der Schichtplanung über Freigabeprozesse bis zu Abrechnungszyklen. In der Demo schauen wir uns deine konkreten Prozesse gemeinsam an.",
  },
  {
    question: "Gibt es Rollen und Berechtigungen?",
    answer:
      "Ja. Jede Rolle – Disposition, Projektleitung, Monteur, Backoffice, Geschäftsführung – sieht genau die Daten und Funktionen, die sie braucht. Berechtigungen sind pro Modul und Projekt steuerbar.",
  },
  {
    question: "Können Dokumente und Abrechnungen verwaltet werden?",
    answer:
      "Ja. Dokumente liegen revisionssicher in der Projektakte, mit Versionen und Freigaben. Erfasste Leistungen und Stunden fließen direkt in Rechnungsentwürfe – inklusive sauberer Übergabe an die Buchhaltung.",
  },
  {
    question: "Sind KI-Agenten optional?",
    answer:
      "Ja, vollständig. Alle KI-Agenten – vom LV-Agenten bis zum Abrechnungsagenten – lassen sich pro Unternehmen aktivieren oder deaktivieren. Gleistrix funktioniert auch komplett ohne KI-Funktionen.",
  },
];
