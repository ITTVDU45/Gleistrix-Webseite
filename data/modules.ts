import {
  BarChart3,
  CalendarRange,
  Clock,
  FileText,
  FolderOpen,
  KanbanSquare,
  Package,
  Users,
  Wrench,
} from "lucide-react";

import type { Catalog, CatalogEntry } from "./catalog";

/**
 * Module der Plattform – Quelle für das Megamenü und die Detailseiten unter
 * /produkt/[slug].
 *
 * Die Slugs entsprechen den bisherigen Routen: Footer, Modul-Karussell der
 * Startseite und das Funktionsraster verweisen bereits dorthin.
 *
 * Abgrenzung zu data/landingModules.ts: dort steht der im Adminbereich
 * überschreibbare Inhalt des Startseiten-Karussells, hier die feste
 * Seitenstruktur der Marketingseiten.
 */
export const MODULES: CatalogEntry[] = [
  {
    slug: "projektplanung-disposition",
    crossLinks: [
      { text: "Wie Trupps und Zweiwegetechnik gemeinsam geplant werden, zeigt", href: "/branchen/gleisbauunternehmen", label: "Gleisbau-Software für Baustellen und Ressourcen" },
      { text: "Die Einsatzplanung für Sicherungsposten beschreibt", href: "/branchen/sicherungsunternehmen", label: "Software für Sicherungsunternehmen" },
      { text: "Warum eine Plantafel die Excel-Liste ersetzt, erklärt der Fachartikel", href: "/blog/plantafel-statt-excel", label: "Plantafel statt Excel" },
    ],
    title: "Projektplanung & Disposition",
    h1: "Projektplanung und Disposition für Bahnbau und Gleisbau",
    tagline: "Projekte, Personal und Technik disponieren",
    description:
      "Projekte anlegen und Personal, Fahrzeuge und Technik zuweisen – mit Prüfung auf Doppelbelegung, Urlaub und Krankmeldung, projektübergreifend auf einem Datenstand.",
    metaDescription:
      "Einsatzplanung für den Bahnbau: Personal, Fahrzeuge und Technik projektübergreifend disponieren – mit Konfliktprüfung bei Doppelbelegung, Urlaub und Krankheit.",
    // Übernimmt das Keyword der weitergeleiteten Landingpage
    // /disposition-bahnbau ("Disposition … Bahnbau") und ergänzt die
    // Einsatzplanung, nach der Disponenten ebenso suchen.
    metaTitle: "Einsatzplanung & Disposition für den Bahnbau",
    icon: KanbanSquare,
    group: "Planung & Steuerung",
    image: "/media/module/projektplanung-ui.webp",
    video: "/media/module/projektplanung-ui.mp4",
    mascot: "/media/module/projekte.webp",
    highlights: [
      {
        title: "Eine Projektakte",
        text: "Auftraggeber, Baustelle, Auftrags- und SAP-Nummer, Leistungen und Dokumente liegen an einem Ort statt in fünf Postfächern.",
      },
      {
        title: "Disposition per Drag-and-drop",
        text: "Personal und Fahrzeuge werden dem Einsatz direkt zugewiesen – Konflikte meldet das System sofort.",
      },
      {
        title: "Ein Bestand für alle Projekte",
        text: "Alle Baustellen greifen auf dasselbe Personal und dieselben Fahrzeuge zu. Doppelbelegungen fallen projektübergreifend auf.",
      },
    ],
    bullets: [
      "Projekte mit Status, Laufzeit und Ansprechpartner",
      "Leistungen mit Positionen, Menge und Preis am Projekt",
      "Personal und Fahrzeuge per Drag-and-drop disponieren",
      "Konfliktprüfung: Doppelbelegung, Urlaub, Krankheit, Feiertag",
      "Projektanlage aus DB-Leistungsanfragen per KI",
      "ATWS-Einsatz mit Anzahl und Meterlänge erfassen",
    ],
    challenges: [
      {
        problem:
          "Der Einsatzplan liegt in einer Tabelle, die per Mail wandert. Welche Fassung die aktuelle ist, weiß am Ende niemand sicher.",
        solution:
          "Alle Beteiligten planen im selben System. Jede Änderung ist sofort für Disposition und Bauleitung sichtbar.",
      },
      {
        problem:
          "Ein Sicherungsposten steht an zwei Baustellen gleichzeitig im Plan – auffallen tut das am Einsatztag um fünf Uhr morgens.",
        solution:
          "Doppelbelegungen erkennt Gleistrix beim Zuweisen und meldet den Konflikt, bevor der Plan überhaupt gilt.",
      },
      {
        problem:
          "Auftragsdaten aus dem DB-Lieferantenportal werden Feld für Feld abgetippt, bevor die Planung überhaupt beginnen kann.",
        solution:
          "Die Leistungsanfrage wird als Link oder PDF übergeben und füllt die Projektanlage vor. Geprüft und gespeichert wird von Hand.",
      },
    ],
    details: [
      {
        heading: "Einsatzplanung im Bahnbau: warum Excel an Grenzen stößt",
        paragraphs: [
          "Im Bahnbau entscheidet die Besetzung über die Baustelle: Ohne Sicherungsposten, Bediener oder das passende Fahrzeug fällt eine Schicht aus, die Sperrpause ist dann oft verloren. Gleichzeitig ändern sich Einsätze kurzfristig, und mehrere Baustellen greifen auf dieselben Leute zu.",
          "Eine Tabelle zeigt, was geplant ist – aber nicht, ob es passt. Doppelbelegungen, Urlaub und Krankmeldungen muss jemand im Kopf abgleichen. Gleistrix prüft genau das beim Zuweisen.",
        ],
      },
      {
        heading: "Projekt, Leistungen und Technik an einem Ort",
        paragraphs: [
          "Am Projekt stehen Auftraggeber, Baustelle, Auftrags- und SAP-Nummer, Ansprechpartner und Laufzeit. Leistungen lassen sich mit Positionen, Menge, Einheit und Preis pflegen oder aus einer GAEB-Datei übernehmen; daraus ergibt sich der Soll-Umsatz des Projekts.",
          "Bei Sicherungsaufträgen wird zusätzlich festgehalten, ob ATWS im Einsatz ist, wie viele Anlagen und welche Meterlänge. Eingesetzte Technik wird am Projekt geführt.",
        ],
      },
    ],
    steps: [
      {
        title: "Projekt anlegen",
        text: "Auftraggeber, Baustelle, Auftrags- und SAP-Nummer und Laufzeit einmal erfassen – auf Wunsch vorbefüllt aus der DB-Leistungsanfrage.",
      },
      {
        title: "Leistungen hinterlegen",
        text: "Positionen mit Menge und Preis pflegen oder aus einer GAEB-Datei übernehmen.",
      },
      {
        title: "Ressourcen zuweisen",
        text: "Personal und Fahrzeuge per Drag-and-drop einplanen – Konflikte meldet das System sofort.",
      },
      {
        title: "Fortschritt verfolgen",
        text: "Status, erfasste Stunden und Kosten des Projekts sind jederzeit sichtbar, ohne Rückfrage per Telefon.",
      },
    ],
    faqs: [
      {
        question: "Lassen sich mehrere Baustellen parallel planen?",
        answer:
          "Ja. Projekte laufen unabhängig nebeneinander, greifen aber auf denselben Bestand an Personal und Fahrzeugen zu. Deshalb erkennt Gleistrix Doppelbelegungen auch über Projektgrenzen hinweg.",
      },
      {
        question: "Welche Konflikte prüft die Disposition?",
        answer:
          "Beim Zuweisen prüft Gleistrix, ob ein Mitarbeiter zur selben Zeit bereits eingeteilt ist, Urlaub hat, krankgemeldet ist oder ein Feiertag vorliegt. Auch doppelt eingeplante Fahrzeuge werden gemeldet.",
      },
      {
        question: "Berücksichtigt die Disposition Funktionen wie SIPO oder Sakra?",
        answer:
          "Die Funktionen stehen am Mitarbeiter und werden beim Zeiteintrag festgehalten. So ist sichtbar, wer welche Rollen übernehmen kann und in welcher Rolle er eingesetzt war.",
      },
      {
        question: "Was passiert bei kurzfristigen Änderungen?",
        answer:
          "Die Änderung wird einmal in der Disposition vorgenommen und ist unmittelbar für alle berechtigten Nutzer sichtbar. Eine zweite Fassung des Plans, die verteilt werden müsste, gibt es nicht.",
      },
    ],
  },
  {
    slug: "kalender-einsatzuebersicht",
    crossLinks: [
      { text: "Besprechungen und Termine in Outlook ermöglicht", href: "/integrationen/microsoft", label: "die Microsoft-365-Anbindung" },
      { text: "Wechselnde Nacht- und Wochenendschichten behandelt", href: "/branchen/sicherungsunternehmen", label: "Software für Sicherungsunternehmen" },
      { text: "Warum eine Plantafel die Excel-Liste ersetzt, erklärt der Fachartikel", href: "/blog/plantafel-statt-excel", label: "Plantafel statt Excel" },
    ],
    title: "Plantafel & Einsatzübersicht",
    h1: "Digitale Plantafel für Einsätze, Schichten und Trupps",
    tagline: "Einsätze, Abwesenheiten und Termine in einer Ansicht",
    description:
      "Alle Einsätze, Abwesenheiten, Feiertage und Besprechungen auf einer Plantafel – als Tages-, Wochen-, Monats- oder Jahresansicht und mit Konfliktprüfung beim Zuweisen.",
    metaTitle: "Digitale Plantafel für Bahnbau & Gleisbau",
    metaDescription:
      "Digitale Plantafel für den Bahnbau: Einsätze, Urlaub, Krankmeldungen und Feiertage in einer Ansicht – mit Konfliktprüfung beim Einplanen von Personal und Fahrzeugen.",
    icon: CalendarRange,
    group: "Planung & Steuerung",
    image: "/media/module/plantafel-ui.webp",
    video: "/media/module/plantafel-ui.mp4",
    mascot: "/media/module/plantafel.webp",
    highlights: [
      {
        title: "Tag, Woche, Monat, Jahr",
        text: "Zwischen Zeiträumen und Ansichten wechseln – nach Projekt oder nach Team –, ohne die Planung neu aufzubauen.",
      },
      {
        title: "Abwesenheiten eingerechnet",
        text: "Urlaub, Krankmeldungen und Feiertage je Bundesland stehen in derselben Tafel wie die Einsätze.",
      },
      {
        title: "Konflikte sichtbar",
        text: "Doppelbelegungen und Überschneidungen mit Abwesenheiten sammelt ein eigener Konfliktbereich.",
      },
    ],
    bullets: [
      "Tages-, Wochen-, Monats- und Jahresansicht",
      "Wochenansicht nach Projekt oder nach Team",
      "Urlaub, Krankheit und Feiertage je Bundesland",
      "Konfliktbereich für Doppelbelegungen",
      "Besprechungen mit internen und externen Teilnehmern",
      "Dokumente per Drag-and-drop am Einsatz ablegen",
    ],
    challenges: [
      {
        problem:
          "Jede Rolle bekommt ihren eigenen Ausdruck – und sobald sich etwas ändert, sind sämtliche Ausdrucke falsch.",
        solution:
          "Eine Plantafel für alle, gefiltert nach Projekt oder Zeitraum. Wer sie öffnet, sieht den aktuellen Stand.",
      },
      {
        problem:
          "Urlaub steht im Kalender, Krankmeldungen im Postfach, Feiertage im Kopf. Die Planung erfährt davon, wenn die Schicht schon besetzt ist.",
        solution:
          "Abwesenheiten und Feiertage liegen in derselben Tafel. Wer nicht verfügbar ist, löst beim Einplanen einen Konflikt aus.",
      },
      {
        problem:
          "Abstimmungstermine zur Baustelle laufen über getrennte Kalender, die mit der Einsatzplanung nichts zu tun haben.",
        solution:
          "Besprechungen werden in der Plantafel angelegt – mit Mitarbeitern und externen Teilnehmern – und stehen neben den Einsätzen.",
      },
    ],
    steps: [
      {
        title: "Ansicht wählen",
        text: "Tag, Woche, Monat oder Jahr – und in der Woche nach Projekt oder nach Team.",
      },
      {
        title: "Filtern",
        text: "Nach Projekt eingrenzen und das Bundesland für die Feiertage wählen.",
      },
      {
        title: "Einplanen",
        text: "Mitarbeiter und Fahrzeuge dem Einsatz zuweisen; Konflikte erscheinen sofort im Konfliktbereich.",
      },
      {
        title: "Abstimmen",
        text: "Besprechungen anlegen und Unterlagen per Drag-and-drop am Einsatz ablegen.",
      },
    ],
    faqs: [
      {
        question: "Welche Ansichten bietet die Plantafel?",
        answer:
          "Tages-, Wochen-, Monats- und Jahresansicht. Die Wochenansicht lässt sich nach Projekten oder nach Team ordnen.",
      },
      {
        question: "Werden Feiertage berücksichtigt?",
        answer:
          "Ja. Feiertage werden je Bundesland angezeigt und bei der Konfliktprüfung berücksichtigt – wichtig für Baustellen, die über Landesgrenzen hinweg besetzt werden.",
      },
      {
        question: "Was passiert bei Urlaub oder einer Krankmeldung?",
        answer:
          "Abwesenheiten aus der Mitarbeiterverwaltung erscheinen in der Plantafel. Wird ein abwesender Mitarbeiter eingeplant, meldet die Plantafel den Konflikt.",
      },
      {
        question: "Sieht jeder die komplette Planung?",
        answer:
          "Nicht zwangsläufig. Rollen und Berechtigungen steuern, welche Bereiche ein Nutzer sehen und bearbeiten darf.",
      },
    ],
  },
  {
    slug: "reports-auswertungen",
    crossLinks: [
      { text: "Kosten und Marge je Baustelle behandelt", href: "/branchen/gleisbauunternehmen", label: "Gleisbau-Software für Baustellen und Abrechnung" },
      { text: "Woher die abgerechneten Zahlen stammen, zeigt", href: "/produkt/rechnungsstellung", label: "die Projektabrechnung" },
      { text: "Wie Projektmargen sichtbar werden, erklärt der Fachartikel", href: "/blog/deckungsbeitrag-pro-projekt-sichtbar-machen", label: "Deckungsbeitrag pro Projekt sichtbar machen" },
    ],
    title: "Reports & Auswertungen",
    h1: "Reports und Projektcontrolling für Bahnprojekte",
    tagline: "Kennzahlen zu Auslastung, Kosten und Marge",
    description:
      "Kennzahlen aus dem laufenden Betrieb: Statistiken zu Projekten und Einsätzen, dazu Projektkosten, Ergebnis und Marge je Projekt in der Finanzübersicht.",
    metaTitle: "Projektcontrolling & Reports für Bahnprojekte",
    metaDescription:
      "Projektcontrolling für Bahndienstleister: Soll- und Ist-Umsatz, Personal- und Nachunternehmerkosten, Ergebnis und Marge je Projekt – aus dem laufenden Betrieb.",
    icon: BarChart3,
    group: "Planung & Steuerung",
    image: "/media/module/reports-ui.webp",
    video: "/media/module/reports-ui.mp4",
    mascot: "/media/module/projekte.webp",
    highlights: [
      {
        title: "Zahlen aus dem Betrieb",
        text: "Stunden, Leistungen und Rechnungen liefern die Kennzahlen – ohne separate Erfassung für die Auswertung.",
      },
      {
        title: "Marge je Projekt",
        text: "Umsatz und Kosten stehen je Projekt gegenüber – auch während das Projekt noch läuft.",
      },
      {
        title: "Nur für Berechtigte",
        text: "Kaufmännische Kennzahlen sind der Geschäftsführung vorbehalten.",
      },
    ],
    bullets: [
      "Statistiken zu Projekten, Einsätzen und Auslastung",
      "Soll-Umsatz aus Leistungen, Ist-Umsatz aus Einnahmen",
      "Personal-, Nachunternehmer- und weitere Kosten je Projekt",
      "Ergebnis und Marge je Projekt",
      "Cashflow, Konten und Budgets in der Finanzübersicht",
    ],
    challenges: [
      {
        problem:
          "Kennzahlen entstehen am Monatsende in einer Tabelle – und sind zu dem Zeitpunkt, an dem jemand sie liest, längst überholt.",
        solution:
          "Die Zahlen werden aus den Daten der Plattform gebildet und sind jederzeit abrufbar.",
      },
      {
        problem:
          "Ob ein Projekt am Ende Geld gebracht hat, zeigt sich erst nach der Schlussrechnung – zum Gegensteuern zu spät.",
        solution:
          "Umsatz und Kosten stehen sich schon während der Laufzeit gegenüber. Abweichungen fallen auf, solange man noch reagieren kann.",
      },
      {
        problem:
          "Nachunternehmerkosten tauchen im Projektergebnis nicht auf, weil ihre Rechnungen in einem anderen Ordner liegen.",
        solution:
          "Personal-, Nachunternehmer- und weitere Kosten laufen getrennt ausgewiesen in das Ergebnis des Projekts ein.",
      },
    ],
    steps: [
      {
        title: "Daten entstehen im Betrieb",
        text: "Projekte, Stunden, Leistungen und Rechnungen liefern die Zahlen – ohne separate Erfassung.",
      },
      {
        title: "Umfang eingrenzen",
        text: "Auswertung nach Projekt und Zeitraum eingrenzen.",
      },
      {
        title: "Kennzahlen lesen",
        text: "Soll- und Ist-Umsatz, Kosten, Ergebnis und Marge stehen nebeneinander statt in fünf Dateien.",
      },
      {
        title: "Gegensteuern",
        text: "Abweichungen fallen während der Laufzeit auf, nicht erst nach der Schlussrechnung.",
      },
    ],
    faqs: [
      {
        question: "Woher kommen die Zahlen in den Auswertungen?",
        answer:
          "Aus dem laufenden Betrieb: Leistungen am Projekt, erfasste Stunden, gebuchte Einnahmen und Ausgaben sowie Rechnungen von Nachunternehmern. Eine zweite Erfassung nur für Auswertungen entfällt.",
      },
      {
        question: "Lässt sich die Marge je Projekt auswerten?",
        answer:
          "Ja. Die Finanzübersicht stellt je Projekt Soll-Umsatz aus Leistungen und Ist-Umsatz aus gebuchten Einnahmen den Personal-, Nachunternehmer- und weiteren Kosten gegenüber und weist Ergebnis und Marge aus.",
      },
      {
        question: "Wer darf kaufmännische Kennzahlen sehen?",
        answer:
          "Die Finanzübersicht ist der Geschäftsführung vorbehalten. Rollen und Berechtigungen steuern, wer welche Auswertungen sieht.",
      },
    ],
  },
  {
    slug: "mitarbeiterverwaltung",
    crossLinks: [
      { text: "Wie Funktionen und Abwesenheiten die Einsatzplanung steuern, zeigt", href: "/branchen/sicherungsunternehmen", label: "Software für Sicherungsunternehmen" },
      { text: "Nachweise von Nachunternehmern mit Fristen behandelt", href: "/branchen/gleisbausicherung-bauueberwachung", label: "Software für Gleisbausicherung und Bauüberwachung" },
      { text: "Wie Stunden und Zuschläge erfasst werden, steht unter", href: "/produkt/zeiterfassung-stundenzettel", label: "Zeiterfassung und Stundennachweise" },
    ],
    title: "Mitarbeiterverwaltung",
    h1: "Mitarbeiterverwaltung für Bahndienstleister",
    tagline: "Funktionen, Abwesenheiten und Nachweise",
    description:
      "Personal mit seinen Funktionen im Bahnbetrieb verwalten – SIPO, Sakra, BüP und mehr –, Abwesenheiten erfassen und Nachunternehmer mit ihren Nachweisen und Fristen im Blick behalten.",
    metaTitle: "Mitarbeiterverwaltung für Bahndienstleister",
    metaDescription:
      "Personal mit Funktionen wie SIPO, Sakra und BüP verwalten, Abwesenheiten in die Einsatzplanung geben und Nachweise von Nachunternehmern mit Fristen überwachen.",
    icon: Users,
    group: "Team & Ressourcen",
    image: "/media/module/mitarbeiter-ui.webp",
    video: "/media/module/mitarbeiter-ui.mp4",
    mascot: "/media/module/team.webp",
    highlights: [
      {
        title: "Funktionen im Blick",
        text: "SIPO, Sakra, BüP, HiBa, SAS, HFE, Bahnerder – jeder Mitarbeiter trägt die Funktionen, die er übernehmen kann.",
      },
      {
        title: "Abwesenheiten integriert",
        text: "Urlaub, Arbeitsunfähigkeit, Freistellung und Fortbildung stehen direkt in der Plantafel.",
      },
      {
        title: "Nachweise mit Frist",
        text: "Nachunternehmer laden Nachweise hoch; Gleistrix zeigt, was fehlt, bald abläuft oder abgelaufen ist.",
      },
    ],
    bullets: [
      "Funktionen je Mitarbeiter, mehrere pro Person",
      "ElBa-Kennung für Sicherungspersonal",
      "Abwesenheiten: Urlaub, AU, Freistellung, Fortbildung",
      "Status aktiv, nicht aktiv oder im Urlaub",
      "Stundennachweis-Empfänger je Mitarbeiter",
      "Nachunternehmer mit Portal, Nachweisen und Erneuerungsintervallen",
      "Rollen und Berechtigungen für Nutzer",
    ],
    challenges: [
      {
        problem:
          "Wer welche Funktion übernehmen kann, steht in einer Liste, die eine Person pflegt – und nur sie kennt den aktuellen Stand.",
        solution:
          "Die Funktionen stehen am Mitarbeiter im System. Jeder mit Berechtigung sieht, wer als SIPO, Sakra oder BüP eingesetzt werden kann.",
      },
      {
        problem:
          "Urlaubsanträge laufen per Mail, die Einsatzplanung weiß nichts davon und plant weiter.",
        solution:
          "Abwesenheiten stehen direkt in der Plantafel. Wer abwesend ist, löst beim Einplanen einen Konflikt aus.",
      },
      {
        problem:
          "Nachweise von Nachunternehmern kommen per Mail und liegen in Ordnern. Wann sie ablaufen, prüft niemand systematisch.",
        solution:
          "Für jede Firma ist hinterlegt, welche Nachweise sie vorlegen muss und in welchem Rhythmus. Fehlende und ablaufende Nachweise zeigt Gleistrix mit Status an.",
      },
    ],
    details: [
      {
        heading: "Qualifikationen und Funktionen im Bahnbetrieb",
        paragraphs: [
          "Im Bahnbetrieb entscheidet die Funktion über den Einsatz: Ein Sicherungsposten ist keine Sicherungsaufsicht, ein Bahnübergangsposten kein Bediener. Gleistrix führt deshalb zu jedem Mitarbeiter die Funktionen, die er übernehmen kann – SIPO, Sakra, BüP, HiBa, SAS, HFE, Bahnerder oder Monteur/Bediener. Ein Mitarbeiter kann mehrere tragen.",
          "Beim Zeiteintrag wird festgehalten, in welcher Funktion jemand eingesetzt war. So ist später nachvollziehbar, wer in welcher Rolle auf der Baustelle stand – und die Abrechnung kann nach Funktion unterscheiden.",
        ],
      },
      {
        heading: "Fristenmanagement für Nachweise von Nachunternehmern",
        paragraphs: [
          "Wer mit Nachunternehmern arbeitet, muss deren Unterlagen im Blick behalten. In Gleistrix legst du Nachweistypen mit Erneuerungsintervall an und weist sie einer oder mehreren Firmen zu.",
          "Nachunternehmer laden die Nachweise im Portal hoch. Die Übersicht zeigt je Firma, ob ein Nachweis fehlt, bald abläuft oder bereits abgelaufen ist – und im Portal erscheint ein Hinweis auf offene Nachweise.",
        ],
      },
    ],
    steps: [
      {
        title: "Mitarbeiter anlegen",
        text: "Kontaktdaten, Personalnummer, ElBa-Kennung und Status erfassen – einmal, an einem Ort.",
      },
      {
        title: "Funktionen zuordnen",
        text: "SIPO, Sakra, BüP und weitere Funktionen auswählen; mehrere pro Person sind möglich.",
      },
      {
        title: "Abwesenheiten pflegen",
        text: "Urlaub, Arbeitsunfähigkeit, Freistellung oder Fortbildung mit Zeitraum eintragen – die Plantafel übernimmt sie.",
      },
      {
        title: "Stunden nachweisen",
        text: "Der monatliche Stundennachweis geht an den Mitarbeiter und an hinterlegte Empfänger wie das Lohnbüro.",
      },
    ],
    faqs: [
      {
        question: "Welche Funktionen lassen sich abbilden?",
        answer:
          "Die im Bahnumfeld üblichen Funktionen SIPO, Sakra, BüP, HiBa, SAS, HFE, Bahnerder und Monteur/Bediener. Ein Mitarbeiter kann mehrere Funktionen tragen.",
      },
      {
        question: "Sind Urlaub und Krankheit enthalten?",
        answer:
          "Ja. Urlaub, Arbeitsunfähigkeit, unbezahlte Freistellung und Fortbildung werden mit Zeitraum erfasst und erscheinen in der Plantafel, damit niemand doppelt verplant wird.",
      },
      {
        question: "Wie werden Fristen für Nachweise überwacht?",
        answer:
          "Für Nachunternehmer: Nachweistypen tragen ein Erneuerungsintervall, und Gleistrix zeigt je Firma an, ob ein Nachweis fehlt, bald abläuft oder abgelaufen ist. Für eigene Mitarbeiter werden die Funktionen im Profil geführt.",
      },
      {
        question: "Wer bekommt Personaldaten zu sehen?",
        answer:
          "Nur Nutzer mit entsprechender Berechtigung. Rollen und Rechte steuern, wer die Mitarbeiterverwaltung sehen und bearbeiten darf.",
      },
    ],
  },
  {
    slug: "fahrzeug-technik",
    crossLinks: [
      { text: "Trupps und Fahrzeuge im Baustellenkontext behandelt", href: "/branchen/gleisbauunternehmen", label: "Gleisbau-Software für Baustellen und Ressourcen" },
      { text: "Geräte, Sicherungstechnik und Prüftermine verwaltet", href: "/produkt/lagerverwaltung", label: "die Lagerverwaltung" },
      { text: "Wie Doppelbelegungen vermieden werden, erklärt der Fachartikel", href: "/blog/fahrzeuge-und-technik-ohne-doppelbelegung-planen", label: "Fahrzeuge und Technik ohne Doppelbelegung planen" },
    ],
    title: "Fahrzeuge & Technik",
    h1: "Fahrzeuge und Technik für Bahnbaustellen disponieren",
    tagline: "Fuhrpark, Zuordnung und Tageskosten",
    description:
      "Fahrzeuge zentral führen, Projekten und Mitarbeitern zuordnen und auf der Einsatztafel wie Personal disponieren – mit Konfliktprüfung bei Doppelbelegung.",
    metaTitle: "Fahrzeugdisposition & Fuhrpark für den Bahnbau",
    metaDescription:
      "Fahrzeugdisposition für den Bahnbau: Fuhrpark mit Kilometerstand, Schäden, Status und Tageskosten führen, Fahrzeuge Projekten zuordnen, Doppelbelegung vermeiden.",
    icon: Wrench,
    group: "Team & Ressourcen",
    image: "/media/module/team-ui.webp",
    video: "/media/module/team-ui.mp4",
    mascot: "/media/module/team.webp",
    highlights: [
      {
        title: "Direkt disponierbar",
        text: "Fahrzeuge werden dem Einsatz zugeordnet wie Personal – ist eines schon verplant, meldet Gleistrix den Konflikt.",
      },
      {
        title: "Zustand dokumentiert",
        text: "Kilometerstand, Tankstand, Schäden und Status stehen am Fahrzeug statt auf einem Zettel im Handschuhfach.",
      },
      {
        title: "Kosten je Tag",
        text: "Ein Tagessatz pro Fahrzeug fließt in die Kosten der Projekte ein, denen es zugeordnet ist.",
      },
    ],
    bullets: [
      "Fahrzeuge mit Typ, Kennzeichen, Kilometer- und Tankstand",
      "Schäden und Status mit Notiz",
      "Tageskosten je Fahrzeug",
      "Direkte Übergabe an Mitarbeiter oder Projekt",
      "Konfliktprüfung bei doppelter Zuordnung",
      "Wartungs- und TÜV-Termine für Geräte im Lager",
    ],
    challenges: [
      {
        problem:
          "Ein Zweiwegefahrzeug steht für zwei Baustellen gleichzeitig im Plan. Bemerkt wird das, wenn es an der falschen Stelle steht.",
        solution:
          "Fahrzeuge laufen in derselben Planung wie die Trupps. Doppelte Zuordnungen meldet Gleistrix beim Zuweisen.",
      },
      {
        problem:
          "Wer das Fahrzeug gerade hat und in welchem Zustand es ist, weiß man erst, wenn man danach telefoniert.",
        solution:
          "Übergaben an Mitarbeiter oder Projekt sind mit Datum dokumentiert, Kilometerstand und Schäden stehen am Fahrzeug.",
      },
      {
        problem:
          "Was ein Fahrzeug die Baustelle kostet, wird nachträglich geschätzt.",
        solution:
          "Ein Tagessatz je Fahrzeug fließt in die Projektkosten ein und macht den Anteil am Ergebnis sichtbar.",
      },
    ],
    steps: [
      {
        title: "Fuhrpark erfassen",
        text: "Fahrzeuge mit Typ, Kennzeichen, Kilometerstand und Tageskosten anlegen.",
      },
      {
        title: "Zustand pflegen",
        text: "Tankstand, Schäden und Status mit Notiz aktuell halten.",
      },
      {
        title: "Einsätzen zuordnen",
        text: "Fahrzeuge dem Einsatz oder direkt einem Mitarbeiter übergeben – samt Prüfung auf Doppelbelegung.",
      },
      {
        title: "Kosten verfolgen",
        text: "Die Tageskosten laufen in die Kosten der Projekte ein.",
      },
    ],
    faqs: [
      {
        question: "Sieht die Disposition, ob ein Fahrzeug frei ist?",
        answer:
          "Ja. Wird ein Fahrzeug eingeplant, das zur selben Zeit bereits zugeordnet ist, meldet Gleistrix den Konflikt.",
      },
      {
        question: "Welche Angaben werden am Fahrzeug geführt?",
        answer:
          "Typ, Kennzeichen, Kilometerstand, Tankstand, Schäden, Status mit Notiz und die Tageskosten. Übergaben an Mitarbeiter oder Projekte werden mit Datum festgehalten.",
      },
      {
        question: "Können auch Geräte und Sicherungstechnik verwaltet werden?",
        answer:
          "Ja, in der Lagerverwaltung. Dort lassen sich für Geräte Wartungen wie TÜV, Prüfung, Kalibrierung oder Inspektion mit Fälligkeitsdatum planen und dokumentieren.",
      },
    ],
  },
  {
    slug: "lagerverwaltung",
    crossLinks: [
      { text: "Material und Technik gemeinsam mit Trupps planen beschreibt", href: "/branchen/gleisbauunternehmen", label: "Gleisbau-Software für Baustellen und Ressourcen" },
      { text: "Fahrzeuge mit Zuordnung und Tageskosten verwaltet", href: "/produkt/fahrzeug-technik", label: "Fahrzeuge und Technik" },
    ],
    title: "Lagerverwaltung",
    h1: "Lagerverwaltung für Material, Geräte und Sicherungstechnik",
    tagline: "Bestände, Ausgaben und Prüftermine",
    description:
      "Material, Geräte und Sicherungstechnik mit Beständen, Mindestmengen, Lieferscheinen und Wartungsterminen verwalten – auch mobil per QR-Code.",
    metaTitle: "Lagerverwaltung für Material & Sicherungstechnik",
    metaDescription:
      "Material, Geräte und Sicherungstechnik verwalten: Bestände und Mindestmengen, Ausgaben mit Rückgabe, Lieferscheine, Inventur und TÜV-Termine – auch mobil per QR-Code.",
    icon: Package,
    group: "Team & Ressourcen",
    image: "/media/module/lager-ui.webp",
    video: "/media/module/lager-ui.mp4",
    mascot: "/media/module/lager.webp",
    highlights: [
      {
        title: "Bestand statt Schätzung",
        text: "Wareneingang, Ausgabe und Rückgabe werden gebucht – die Bestände stimmen, ohne dass jemand zählen muss.",
      },
      {
        title: "Mobil im Lager",
        text: "Die Lager-App bucht per QR-Code dort, wo das Material bewegt wird.",
      },
      {
        title: "Prüftermine geplant",
        text: "TÜV, Prüfung, Kalibrierung und Inspektion stehen mit Fälligkeitsdatum am Gerät.",
      },
    ],
    bullets: [
      "Artikel mit Bestand, Einheit und Mindestmenge",
      "Wareneingang und Lieferscheine mit Anhängen",
      "Ausgabe an Mitarbeiter mit geplanter Rückgabe",
      "Erinnerung an offene Rückgaben",
      "Inventur",
      "Wartungen mit Fälligkeit und Ergebnis",
      "Mobile Lager-App mit QR-Code",
    ],
    challenges: [
      {
        problem:
          "Was tatsächlich im Lager liegt, weiß nur, wer zuletzt drin war. Der Rest schätzt.",
        solution:
          "Bestände werden gebucht statt geschätzt – beim Wareneingang, bei der Ausgabe und bei der Rückgabe.",
      },
      {
        problem:
          "Ausgegebene Technik kommt nicht zurück, und niemand weiß mehr, wer sie zuletzt hatte.",
        solution:
          "Jede Ausgabe ist einer Person mit geplanter Rückgabe zugeordnet. An offene Rückgaben erinnert Gleistrix.",
      },
      {
        problem:
          "Der TÜV-Termin eines Geräts fällt erst auf, wenn es auf der Baustelle gebraucht wird.",
        solution:
          "Wartungen und Prüfungen sind mit Fälligkeitsdatum geplant und nach der Durchführung mit Ergebnis dokumentiert.",
      },
    ],
    steps: [
      {
        title: "Artikel anlegen",
        text: "Material, Geräte und Sicherungstechnik mit Einheit und Mindestmenge erfassen.",
      },
      {
        title: "Wareneingang buchen",
        text: "Lieferungen mit Lieferschein erfassen, Anhänge direkt am Beleg ablegen.",
      },
      {
        title: "Ausgeben und zurücknehmen",
        text: "Ausgaben an Mitarbeiter mit geplanter Rückgabe buchen – am Rechner oder mobil per QR-Code.",
      },
      {
        title: "Prüfen und zählen",
        text: "Wartungen und Prüfungen nach Fälligkeit abarbeiten, Bestände per Inventur abgleichen.",
      },
    ],
    faqs: [
      {
        question: "Gibt es eine mobile Lösung für das Lager?",
        answer:
          "Ja. Die Lager-App läuft mobil und bucht Ausgaben, Rücknahmen und Eingänge per QR-Code direkt am Regal.",
      },
      {
        question: "Wie behalte ich ausgegebene Technik im Blick?",
        answer:
          "Jede Ausgabe ist einer Person mit Menge, Ausgabedatum und geplanter Rückgabe zugeordnet. Offene Rückgaben meldet Gleistrix per Erinnerung.",
      },
      {
        question: "Werden Prüffristen von Geräten mitgeführt?",
        answer:
          "Ja. Wartungen wie TÜV, Service, Prüfung, Kalibrierung und Inspektion werden mit Fälligkeitsdatum geplant und nach der Durchführung mit Ergebnis dokumentiert.",
      },
    ],
  },
  {
    slug: "zeiterfassung-stundenzettel",
    crossLinks: [
      { text: "Stundennachweise für SiPo-Einsätze beschreibt", href: "/branchen/sicherungsunternehmen", label: "Software für Sicherungsunternehmen" },
      { text: "Die Übergabe von Buchungsdaten an die Steuerberatung übernimmt", href: "/integrationen/datev", label: "die DATEV-Anbindung" },
      { text: "Wie prüffähige Stundenzettel entstehen, erklärt der Fachartikel", href: "/blog/stundenzettel-mobil-und-prueffaehig-erfassen", label: "Stundenzettel prüffähig erfassen" },
    ],
    title: "Zeiterfassung & Stundenzettel",
    h1: "Zeiterfassung und Stundennachweise für Bahndienstleister",
    tagline: "Zeiten mit Funktion, Fahrtzeit und Zuschlägen",
    description:
      "Arbeitszeit, Fahrtzeit und Funktion je Einsatz erfassen, Nacht- und Sonntagszuschläge berechnen und den monatlichen Stundennachweis automatisch per E-Mail versenden.",
    metaTitle: "Zeiterfassung & Stundennachweise für den Bahnbau",
    metaDescription:
      "Zeiterfassung für Bahnbau und Sicherung: Stunden mit Funktion und Fahrtzeit am Projekt, Nacht- und Sonntagszuschläge, monatlicher Stundennachweis per E-Mail.",
    icon: Clock,
    group: "Nachweise & Abrechnung",
    image: "/media/module/zeiterfassung-ui.webp",
    video: "/media/module/zeiterfassung-ui.mp4",
    mascot: "/media/module/abrechnung.webp",
    highlights: [
      {
        title: "Zeiten am Projekt",
        text: "Jeder Eintrag hängt an Projekt, Tag und Person – mit Funktion und Fahrtzeit.",
      },
      {
        title: "Zuschläge gerechnet",
        text: "Nacht- und Sonntagszuschläge werden aus den Zeiten abgeleitet, nicht von Hand nachgerechnet.",
      },
      {
        title: "Nachweis per E-Mail",
        text: "Der Stundennachweis geht monatlich an Mitarbeiter, Lohnbüro und weitere hinterlegte Empfänger.",
      },
    ],
    bullets: [
      "Zeiteinträge mit Funktion, Arbeits- und Fahrtzeit",
      "Nacht- und Sonntagszuschläge automatisch berechnet",
      "Monatlicher Stundennachweis per E-Mail",
      "Freigabe von Nachunternehmer-Stunden",
      "Übergabe freigegebener Stunden an die Abrechnung",
    ],
    challenges: [
      {
        problem:
          "Stundenzettel kommen auf Papier in die Verwaltung – teils Tage später, teils kaum lesbar.",
        solution:
          "Zeiten werden direkt am Projekt erfasst und liegen sofort zur Prüfung vor.",
      },
      {
        problem:
          "Das Backoffice tippt Zettel ab und rechnet Nacht- und Sonntagszuschläge von Hand nach.",
        solution:
          "Zuschläge werden aus den erfassten Zeiten abgeleitet, statt sie im Nachhinein zu rekonstruieren.",
      },
      {
        problem:
          "Am Monatsende werden Stundennachweise einzeln zusammengestellt und an Mitarbeiter und Lohnbüro verschickt.",
        solution:
          "Der Stundennachweis entsteht aus den Einträgen und geht monatlich per E-Mail an alle hinterlegten Empfänger.",
      },
    ],
    steps: [
      {
        title: "Zeit erfassen",
        text: "Arbeitszeit, Fahrtzeit und Funktion je Einsatz am Projekt eintragen.",
      },
      {
        title: "Zuschläge ableiten",
        text: "Nacht- und Sonntagsanteile berechnet Gleistrix aus den Zeiten.",
      },
      {
        title: "Prüfen und freigeben",
        text: "Stunden – auch die von Nachunternehmern – prüfen und für die Abrechnung freigeben.",
      },
      {
        title: "Nachweis versenden",
        text: "Der monatliche Stundennachweis geht per E-Mail an Mitarbeiter und Lohnbüro.",
      },
    ],
    faqs: [
      {
        question: "Werden Zuschläge automatisch berücksichtigt?",
        answer:
          "Ja. Nacht- und Sonntagszuschläge werden aus den erfassten Zeiten berechnet, ohne dass jemand nachrechnet.",
      },
      {
        question: "Wer erhält den Stundennachweis?",
        answer:
          "Der Mitarbeiter selbst und weitere Empfänger, die je Mitarbeiter hinterlegt werden – zum Beispiel Lohnbüro oder Vorgesetzte. Der Versand erfolgt monatlich per E-Mail.",
      },
      {
        question: "Wie kommen die Stunden in die Abrechnung?",
        answer:
          "Freigegebene Stunden stehen der Abrechnung des Projekts direkt zur Verfügung. Ein erneutes Eintippen oder der Umweg über Zwischentabellen entfällt.",
      },
      {
        question: "Lassen sich Stunden von Nachunternehmern einbeziehen?",
        answer:
          "Ja. Stunden von Nachunternehmern werden am Projekt geprüft und freigegeben, bevor sie in die Abrechnung gehen.",
      },
    ],
  },
  {
    slug: "dokumentenmanagement",
    crossLinks: [
      { text: "Unterlagen für die Bauüberwachung beschreibt", href: "/branchen/gleisbausicherung-bauueberwachung", label: "Software für Gleisbausicherung und Bauüberwachung" },
      { text: "Ablage in OneDrive und SharePoint ermöglicht", href: "/integrationen/microsoft", label: "die Microsoft-365-Anbindung" },
      { text: "Wie SiPo-Einsätze nachvollziehbar dokumentiert werden, erklärt der Fachartikel", href: "/blog/sipo-einsaetze-rechtssicher-dokumentieren", label: "SiPo-Einsätze sauber dokumentieren" },
    ],
    title: "Dokumentenmanagement",
    h1: "Dokumentenmanagement für Bahnprojekte und Baustellen",
    tagline: "Unterlagen am Projekt statt im Postfach",
    description:
      "Lieferscheine, Stundennachweise, Bestellscheine und Rechnungen am Projekt ablegen, nach Typ ordnen und über das Projekt wiederfinden – bei Bedarf in OneDrive oder SharePoint.",
    metaTitle: "Dokumentenmanagement für Bahnprojekte",
    metaDescription:
      "Digitale Baustellendokumentation für Bahnprojekte: Lieferscheine, Stundennachweise, Bestellscheine und Rechnungen nach Typ am Projekt ablegen und wiederfinden.",
    icon: FolderOpen,
    group: "Nachweise & Abrechnung",
    image: "/media/module/dokumente-ui.webp",
    video: "/media/module/dokumente-ui.mp4",
    mascot: "/media/module/dokumente.webp",
    highlights: [
      {
        title: "Alles am Projekt",
        text: "Unterlagen hängen am Projekt statt verstreut in Postfächern und Netzlaufwerken.",
      },
      {
        title: "Nach Typ geordnet",
        text: "Lieferschein, Stundennachweis, Bestellschein, Rechnung – jedes Dokument trägt seinen Typ.",
      },
      {
        title: "Schnell abgelegt",
        text: "Dateien lassen sich per Drag-and-drop direkt aus der Plantafel am Einsatz ablegen.",
      },
    ],
    bullets: [
      "Dokumente am Projekt statt im Postfach",
      "Dokumenttypen frei definierbar",
      "Eingangs- und Ausgangsrechnungen als eigener Typ",
      "Ablage per Drag-and-drop aus der Plantafel",
      "Nachweise von Nachunternehmern im Portal",
      "Anbindung an OneDrive und SharePoint",
    ],
    challenges: [
      {
        problem:
          "Lieferscheine, Stundennachweise und Rechnungen verteilen sich auf Postfächer, Netzlaufwerke und Chatverläufe.",
        solution:
          "Alle Unterlagen hängen am Projekt und werden über das Projekt gefunden, nicht über den Dateinamen.",
      },
      {
        problem:
          "Ob ein Dokument eine Rechnung, ein Lieferschein oder ein Nachweis ist, verrät bestenfalls der Dateiname.",
        solution:
          "Jedes Dokument trägt einen Typ. Die Typen lassen sich an die eigenen Abläufe anpassen.",
      },
      {
        problem:
          "Nachunternehmer schicken ihre Unterlagen per Mail, und jemand muss sie einsortieren.",
        solution:
          "Nachunternehmer laden Nachweise und Rechnungen im Portal hoch – direkt an der richtigen Stelle.",
      },
    ],
    steps: [
      {
        title: "Ablegen",
        text: "Lieferscheine, Nachweise, Rechnungen und Fotos direkt am Projekt speichern.",
      },
      {
        title: "Einordnen",
        text: "Jedem Dokument einen Typ geben – Lieferschein, Stundennachweis, Bestellschein oder Rechnung.",
      },
      {
        title: "Teilen",
        text: "Nachunternehmer laden ihre Unterlagen im Portal hoch; Projektordner lassen sich über SharePoint anbinden.",
      },
      {
        title: "Auskunft geben",
        text: "Bei Rückfragen wird das Dokument über das Projekt gefunden statt über die Dateisuche.",
      },
    ],
    faqs: [
      {
        question: "Welche Dokumente lassen sich ablegen?",
        answer:
          "Grundsätzlich alle Unterlagen eines Projekts. Voreingestellt sind Typen wie Rechnung, Nachunternehmerrechnung, Materialrechnung, Ausgangsrechnung, Lieferschein, Stundennachweis und Bestellschein; weitere lassen sich anlegen.",
      },
      {
        question: "Wer hat Zugriff auf welche Dokumente?",
        answer:
          "Der Zugriff wird über Rollen und Berechtigungen gesteuert. Nachunternehmer sehen im Portal nur die Unterlagen, die sie selbst betreffen.",
      },
      {
        question: "Lässt sich Microsoft 365 anbinden?",
        answer:
          "Ja. Über die Microsoft-365-Anbindung lassen sich OneDrive als Dokumentenablage und SharePoint-Projektordner nutzen.",
      },
    ],
  },
  {
    slug: "rechnungsstellung",
    crossLinks: [
      { text: "Die Übergabe von Buchungsdaten und Belegen übernimmt", href: "/integrationen/datev", label: "die DATEV-Anbindung" },
      { text: "Leistungsverzeichnisse einlesen erklärt", href: "/integrationen/gaeb", label: "die GAEB-Schnittstelle" },
      { text: "Wie aus der erfassten Stunde eine Rechnung wird, erklärt der Fachartikel", href: "/blog/von-der-erfassten-stunde-zur-x-rechnung", label: "Von der erfassten Stunde zur Rechnung" },
    ],
    title: "Abrechnung & Rechnungsstellung",
    h1: "Projektabrechnung für Bahndienstleister",
    tagline: "Von der geprüften Stunde zur Abrechnung",
    description:
      "Aus freigegebenen Stunden und Leistungen die Abrechnung des Projekts erstellen, Rechnungen von Nachunternehmern prüfen und Buchungsdaten an die Steuerberatung übergeben.",
    metaTitle: "Projektabrechnung & Rechnungsstellung im Bahnbau",
    metaDescription:
      "Projektabrechnung für den Bahnbau: freigegebene Stunden abrechnen, als PDF ausgeben, Nachunternehmer-Rechnungen prüfen und Buchungsdaten an DATEV übergeben.",
    icon: FileText,
    group: "Nachweise & Abrechnung",
    image: "/media/module/abrechnung-ui.webp",
    video: "/media/module/abrechnung-ui.mp4",
    mascot: "/media/module/abrechnung.webp",
    highlights: [
      {
        title: "Ohne Zweiterfassung",
        text: "Freigegebene Stunden und Leistungen gehen in die Abrechnung – kein erneutes Eintippen.",
      },
      {
        title: "Freigabe vor Abrechnung",
        text: "Offene Freigaben sind sichtbar, bevor abgerechnet wird. Abgerechnet wird nur, was geprüft ist.",
      },
      {
        title: "Saubere Übergabe",
        text: "Buchungsdaten und Belege gehen über die DATEV-Anbindung an die Steuerberatung.",
      },
    ],
    bullets: [
      "Abrechnung je Projekt aus freigegebenen Stunden",
      "Abrechnungspositionen nach Tag und Funktion",
      "Ausgabe als PDF",
      "Rechnungen von Nachunternehmern prüfen und freigeben",
      "Eingangsrechnungen erfassen",
      "Buchungsdatenexport und Belegübertragung an DATEV",
    ],
    challenges: [
      {
        problem:
          "Die Rechnung entsteht aus Zetteln, Mails und einer Tabelle – und braucht dafür Wochen.",
        solution:
          "Aus freigegebenen Stunden entstehen die Abrechnungspositionen des Projekts, sobald die Freigabe steht.",
      },
      {
        problem:
          "Nachunternehmer schicken Rechnungen per Mail, und niemand weiß sicher, welche schon geprüft ist.",
        solution:
          "Nachunternehmer reichen Rechnungen im Portal ein. Dort werden sie geprüft und freigegeben; die vereinbarten Tagessätze je Funktion sind am Nachunternehmer hinterlegt.",
      },
      {
        problem:
          "Die Steuerberatung bekommt eine Sammlung von PDF-Dateien und stellt dazu Rückfragen.",
        solution:
          "Buchungsdaten und Belege werden über die DATEV-Anbindung übergeben statt als Belegsammlung.",
      },
    ],
    steps: [
      {
        title: "Leistungen sammeln",
        text: "Freigegebene Stunden laufen während des Projekts als Abrechnungspositionen nach Tag und Funktion zusammen.",
      },
      {
        title: "Freigaben prüfen",
        text: "Offene Freigaben sind sichtbar, bevor abgerechnet wird.",
      },
      {
        title: "Abrechnen",
        text: "Die Abrechnung des Projekts erstellen und als PDF ausgeben.",
      },
      {
        title: "Übergeben",
        text: "Buchungsdaten und Belege über die DATEV-Anbindung an die Steuerberatung übergeben.",
      },
    ],
    faqs: [
      {
        question: "Muss ich Stunden für die Abrechnung erneut erfassen?",
        answer:
          "Nein. Freigegebene Stunden werden als Abrechnungspositionen übernommen. Eine Zweiterfassung für die Abrechnung entfällt.",
      },
      {
        question: "In welchem Format wird abgerechnet?",
        answer:
          "Die Abrechnung lässt sich als PDF ausgeben. Buchungsdaten und Belege können über die DATEV-Anbindung übergeben werden.",
      },
      {
        question: "Wie werden Rechnungen von Nachunternehmern geprüft?",
        answer:
          "Nachunternehmer reichen ihre Rechnungen im Portal ein, wo sie geprüft und freigegeben werden. Die vereinbarten Tagessätze je Funktion sind am Nachunternehmer hinterlegt; Mahnungen laufen ebenfalls über das Portal.",
      },
      {
        question: "Kann nach Leistungspositionen abgerechnet werden?",
        answer:
          "Leistungen mit Positionen, Menge und Preis stehen am Projekt – eingepflegt oder aus einer GAEB-Datei importiert – und bilden den Soll-Umsatz. Die Abrechnung der Stunden erfolgt nach Tag und Funktion.",
      },
    ],
  },
];

export const MODULE_CATALOG: Catalog = {
  basePath: "/produkt",
  singular: "Modul",
  plural: "Module",
  menuNote: `${MODULES.length} Module · eine Plattform`,
  scopeHeading: "Das steckt in {title}",
  ctaHeading: "{title} live sehen?",
  challengesHeading: "Was sich mit {title} ändert",
  stepsHeading: "So arbeitest du mit {title}",
  faqHeading: "Häufige Fragen zu {title}",
  overviewHref: "/produkt",
  overviewLabel: "Alle Module ansehen",
  entries: MODULES,
};
