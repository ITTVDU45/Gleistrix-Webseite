import {
  Banknote,
  CalendarCheck,
  FileSpreadsheet,
  Mail,
  MessageCircle,
  Train,
  UserSearch,
} from "lucide-react";

import type { Catalog, CatalogEntry } from "./catalog";
import { INTEGRATIONS } from "./integrations";

/**
 * Integrationen als eigene Seiten – Megamenü, Übersicht unter /integrationen
 * und Detailseiten unter /integrationen/[slug].
 *
 * Die Logodaten kommen aus data/integrations.ts, damit die Laufschrift der
 * Startseite und die Integrationsseiten dieselbe Quelle haben.
 */
function logoOf(id: string): NonNullable<CatalogEntry["logo"]> {
  const match = INTEGRATIONS.find((item) => item.id === id);
  if (!match?.src || !match.width || !match.height) {
    // Beim Import, nicht erst beim Rendern: ein Tippfehler in der ID fällt so
    // schon im Build auf und nicht als leeres Bild auf der Live-Seite.
    throw new Error(`Kein vollständiges Logo für Integration "${id}" hinterlegt.`);
  }
  return { src: match.src, width: match.width, height: match.height };
}

export const INTEGRATION_PAGES: CatalogEntry[] = [
  {
    slug: "gaeb",
    crossLinks: [
      { text: "Wie Leistungen und Positionen am Projekt weiterverwendet werden, zeigt", href: "/produkt/projektplanung-disposition", label: "Projektplanung und Disposition" },
      { text: "Im Gleisbau steht das Verzeichnis am Anfang der Baustellenplanung – siehe", href: "/branchen/gleisbauunternehmen", label: "Gleisbau-Software" },
      { text: "Für Sicherungsprojekte mit Leistungsverzeichnis passt", href: "/branchen/gleisbausicherung-bauueberwachung", label: "Software für Gleisbausicherung und Bauüberwachung" },
    ],
    title: "GAEB",
    h1: "GAEB-Import für Bahnbau und Gleisbau",
    tagline: "Leistungsverzeichnisse einlesen und prüfen",
    description:
      "GAEB-DA-XML-Dateien einlesen, gegen das Schema prüfen und die Positionen des Leistungsverzeichnisses einem Projekt zuordnen – ohne Positionen von Hand zu übertragen.",
    icon: FileSpreadsheet,
    group: "Bahn & Ausschreibung",
    metaTitle: "GAEB-Import & LV-Prüfung für den Bahnbau",
    // Gleistrix liest GAEB ein, prüft und wertet aus. Eine GAEB-Ausgabe
    // (Angebotsrückgabe im Austauschformat) gibt es nicht – deshalb steht
    // sie hier auch nicht.
    metaDescription:
      "GAEB-Software für den Bahnbau: GAEB-DA-XML einlesen und gegen das Schema prüfen, LV-Positionen erkennen, Projekten zuordnen und per KI auswerten.",
    logo: logoOf("gaeb"),
    highlights: [
      {
        title: "Import statt Abtippen",
        text: "Ein eingelesenes LV steht mit seinen Positionen im System bereit, statt in eine Tabelle übertragen zu werden.",
      },
      {
        title: "Geprüft beim Einlesen",
        text: "Jede Datei wird gegen das XSD-Schema und auf ihre Struktur geprüft – Fehler fallen beim Import auf, nicht in der Kalkulation.",
      },
      {
        title: "Fragen an das LV",
        text: "Ein KI-Agent wertet die Positionen aus und beantwortet Fragen zum Leistungsverzeichnis.",
      },
    ],
    bullets: [
      "Import von GAEB-DA-XML (X81 bis X89)",
      "XSD- und Strukturprüfung beim Einlesen",
      "LV-Positionen automatisch erkennen",
      "Versionen und Phasen konfigurierbar",
      "Import-Historie mit Dublettenerkennung",
      "Zuordnung zum Projekt und Ablage als Projektdokument",
      "KI-Auswertung: benötigtes Personal, Fahrzeuge und Material",
    ],
    challenges: [
      {
        problem:
          "Das Leistungsverzeichnis kommt als GAEB-Datei, gearbeitet wird in einer Tabelle. Die Positionen wandern per Hand von einem Format ins andere.",
        solution:
          "Die Datei wird eingelesen, ihre Positionen erkannt und dem Projekt zugeordnet. Der Übertragungsschritt entfällt samt seiner Tippfehler.",
      },
      {
        problem:
          "Eine fehlerhafte oder unvollständige Datei fällt erst auf, wenn mit ihr schon gerechnet wurde.",
        solution:
          "Beim Import prüft Gleistrix die Datei gegen das XSD-Schema und auf ihre Struktur. Probleme werden gemeldet, bevor die Datei weiterverwendet wird.",
      },
      {
        problem:
          "Um abzuschätzen, was ein Auftrag an Personal, Fahrzeugen und Material braucht, wird das LV Position für Position gelesen.",
        solution:
          "Ein KI-Agent wertet die Positionen aus, schlägt benötigte Ressourcen vor und beantwortet Fragen zum Leistungsverzeichnis. Die Entscheidung bleibt beim Menschen.",
      },
    ],
    steps: [
      {
        title: "Datei hochladen",
        text: "Die GAEB-DA-XML-Datei des Auftraggebers wird hochgeladen; doppelte Importe erkennt Gleistrix.",
      },
      {
        title: "Prüfen",
        text: "Schema- und Strukturprüfung laufen automatisch, Hinweise stehen am Import.",
      },
      {
        title: "Projekt zuordnen",
        text: "Den Import einem Projekt zuordnen und als Projektdokument ablegen.",
      },
      {
        title: "Auswerten",
        text: "Positionen durchsehen und den KI-Agenten nach benötigten Ressourcen oder Details fragen.",
      },
    ],
    faqs: [
      {
        question: "Welche GAEB-Dateien kann Gleistrix einlesen?",
        answer:
          "GAEB-DA-XML-Dateien der Phasen X81 bis X89 – also unter anderem Leistungsverzeichnis, Ausschreibung, Angebot und Rechnung. Welche Versionen und Phasen angenommen werden, ist konfigurierbar.",
      },
      {
        question: "Wird die Datei beim Import geprüft?",
        answer:
          "Ja. Jede Datei wird gegen das XSD-Schema und auf ihre Struktur geprüft. Doppelte Importe erkennt Gleistrix anhand einer Prüfsumme, und jeder Import bleibt in der Historie nachvollziehbar.",
      },
      {
        question: "Kann Gleistrix GAEB-Dateien auch ausgeben?",
        answer:
          "Nein. Gleistrix liest GAEB-Dateien ein, prüft und wertet sie aus. Eine Rückgabe im GAEB-Austauschformat ist derzeit nicht Teil des Funktionsumfangs.",
      },
      {
        question: "Was macht der KI-Agent mit dem Leistungsverzeichnis?",
        answer:
          "Er wertet die Positionen aus, schlägt vor, welches Personal, welche Fahrzeuge und welches Material voraussichtlich gebraucht werden, und beantwortet Fragen zum Inhalt des LV. Die Funktion setzt einen konfigurierten KI-Zugang voraus.",
      },
    ],
  },
  {
    slug: "deutsche-bahn",
    crossLinks: [
      { text: "Für Auftragnehmer der DB im Detail beschrieben unter", href: "/branchen/subunternehmen-db", label: "Software für Subunternehmen der DB" },
      { text: "Wie Nachweise abgelegt und wiedergefunden werden, zeigt", href: "/produkt/dokumentenmanagement", label: "das Dokumentenmanagement" },
    ],
    title: "Deutsche Bahn",
    h1: "Aufträge der Deutschen Bahn mit Gleistrix abwickeln",
    tagline: "Anforderungen der Auftraggeberseite",
    description:
      "Leistungsanfragen aus dem DB-Lieferantenportal übernehmen und Stunden, Nachweise und Abrechnung so aufbereiten, wie sie im Bahnumfeld erwartet werden.",
    icon: Train,
    group: "Bahn & Ausschreibung",
    metaDescription:
      "Aufträge der Deutschen Bahn abwickeln: Leistungsanfragen aus dem Lieferantenportal übernehmen, Stunden je Funktion nachweisen und je Projekt abrechnen.",
    logo: logoOf("deutsche-bahn"),
    highlights: [
      {
        title: "Leistungsanfrage übernommen",
        text: "Eine Anfrage aus dem DB-Lieferantenportal füllt die Projektanlage vor – als Link oder PDF.",
      },
      {
        title: "Auftrags- und SAP-Nummer",
        text: "Die Kennungen des Auftraggebers stehen am Projekt und damit an jedem Einsatz und jeder Abrechnung.",
      },
      {
        title: "Stunden je Funktion",
        text: "Zeiteinträge halten fest, wer in welcher Funktion – etwa SIPO oder Sakra – eingesetzt war.",
      },
    ],
    bullets: [
      "Projektanlage aus DB-Leistungsanfragen per KI",
      "Auftrags- und SAP-Nummer am Projekt",
      "Stundennachweise mit Funktion und Fahrtzeit",
      "Dokumente wie Lieferschein und Bestellschein am Projekt",
      "Abrechnung je Projekt als PDF",
    ],
    challenges: [
      {
        problem:
          "Die Leistungsanfrage liegt im Lieferantenportal. Auftragsnummer, SAP-Nummer, Baustelle und Ansprechpartner werden von Hand ins eigene System übertragen.",
        solution:
          "Die Anfrage wird als Link oder PDF übergeben. Gleistrix liest die Angaben aus und füllt die Projektanlage vor; geprüft und gespeichert wird von Hand.",
      },
      {
        problem:
          "Für die Rückfrage des Auftraggebers zu einem Einsatz werden Stunden aus Zetteln und Tabellen zusammengesucht.",
        solution:
          "Zeiteinträge hängen am Projekt, mit Funktion, Arbeits- und Fahrtzeit. Die Angaben zu einem Einsatz sind über das Projekt auffindbar.",
      },
      {
        problem:
          "Lieferscheine und Bestellscheine zu einem Auftrag liegen verstreut in Postfächern.",
        solution:
          "Dokumente werden am Projekt abgelegt und tragen einen Typ – so sind sie über den Auftrag auffindbar.",
      },
    ],
    steps: [
      {
        title: "Anfrage übernehmen",
        text: "Leistungsanfrage aus dem DB-Lieferantenportal einlesen und die vorbefüllte Projektanlage prüfen.",
      },
      {
        title: "Einsätze planen",
        text: "Personal nach Funktion und Fahrzeuge auf der Einsatztafel einteilen.",
      },
      {
        title: "Stunden nachweisen",
        text: "Zeiten mit Funktion und Fahrtzeit am Projekt erfassen und freigeben.",
      },
      {
        title: "Abrechnen",
        text: "Die Abrechnung des Projekts mit Auftrags- und SAP-Nummer als PDF ausgeben.",
      },
    ],
    faqs: [
      {
        question: "Was heißt hier Integration?",
        answer:
          "Es gibt keine technische Kopplung an ein System der Deutschen Bahn. Gleistrix übernimmt Leistungsanfragen aus dem Lieferantenportal – als Link, als PDF oder als eingefügter Text – und hilft, Stunden, Dokumente und Abrechnung in der Form aufzubereiten, die im Bahnumfeld erwartet wird.",
      },
      {
        question: "Welche Angaben werden aus der Leistungsanfrage übernommen?",
        answer:
          "Projektname, Auftraggeber, Baustelle, Auftrags- und SAP-Nummer, Ansprechpartner mit Kontaktdaten sowie Beginn und Ende. Die Angaben füllen die Projektanlage vor und werden vor dem Speichern geprüft.",
      },
      {
        question: "Wie werden Stunden je Einsatz nachgewiesen?",
        answer:
          "Jeder Zeiteintrag hängt am Projekt und hält Funktion, Arbeits- und Fahrtzeit fest. Daraus entstehen der monatliche Stundennachweis und die Abrechnung des Projekts.",
      },
    ],
  },
  {
    slug: "datev",
    crossLinks: [
      { text: "Woher die Stunden mit ihren Zuschlägen kommen, zeigt", href: "/produkt/zeiterfassung-stundenzettel", label: "Zeiterfassung und Stundenzettel" },
      { text: "Den Weg zur gestellten Rechnung beschreibt", href: "/produkt/rechnungsstellung", label: "die Rechnungsstellung" },
    ],
    title: "DATEV",
    h1: "DATEV-Anbindung für Bahndienstleister",
    tagline: "Übergabe an Steuerberatung und Lohn",
    description:
      "Geprüfte Stunden, Belege und Rechnungen an DATEV-Prozesse übergeben – ohne Sammelmappe und ohne Rückfragen zum Monatsende.",
    icon: Banknote,
    group: "Buchhaltung & Finanzen",
    metaDescription:
      "DATEV-Übergabe aus Gleistrix: geprüfte Stunden mit Zuschlägen, Belege mit Projektbezug und buchungsrelevante Daten strukturiert an die Kanzlei geben.",
    logo: logoOf("datev"),
    highlights: [
      {
        title: "Ein Übergabestand",
        text: "Die Kanzlei erhält geprüfte Daten statt einer Sammlung einzelner PDF-Dateien.",
      },
      {
        title: "Lohn vorbereitet",
        text: "Freigegebene Stunden inklusive Zuschlägen stehen für die Lohnabrechnung bereit.",
      },
      {
        title: "Weniger Rückfragen",
        text: "Die Zuordnung zu Projekt und Kostenstelle passiert bei der Erfassung, nicht danach.",
      },
    ],
    bullets: [
      "Buchungsrelevante Daten strukturiert übergeben",
      "Stunden und Zuschläge für die Lohnabrechnung",
      "Belege den Projekten zugeordnet",
      "Monatsabschluss ohne Sammelmappe",
    ],
    challenges: [
      {
        problem:
          "Zum Monatsende werden Belege, Stundenlisten und Rechnungen zusammengesucht und als Sammlung einzelner Dateien an die Kanzlei geschickt.",
        solution:
          "Die Kanzlei erhält einen geprüften Übergabestand statt einer Mappe, aus der sie sich die Zuordnung selbst erschließen muss.",
      },
      {
        problem:
          "Es kommen Rückfragen, zu welchem Projekt oder welcher Kostenstelle ein Beleg gehört. Beantwortet werden sie Wochen nach dem Vorgang.",
        solution:
          "Die Zuordnung passiert bei der Erfassung, nicht in der Nachbereitung. Wer den Beleg anlegt, weiß noch, wozu er gehört.",
      },
      {
        problem:
          "Für die Lohnabrechnung werden Stunden und Zuschläge aus den Stundenzetteln erneut aufbereitet.",
        solution:
          "Freigegebene Stunden stehen inklusive Zuschlägen bereit. Was in der Zeiterfassung geprüft wurde, wird nicht ein zweites Mal gerechnet.",
      },
    ],
    steps: [
      {
        title: "Zeiten erfassen und freigeben",
        text: "Stunden entstehen am Einsatz und werden in der Verwaltung geprüft – einmal, verbindlich für alles Weitere.",
      },
      {
        title: "Belege zuordnen",
        text: "Eingangsbelege bekommen ihren Projekt- und Kostenbezug beim Erfassen.",
      },
      {
        title: "Übergabe zusammenstellen",
        text: "Buchungsrelevante Daten, Stunden und Belege gehen strukturiert an die Kanzlei.",
      },
      {
        title: "Monat abschließen",
        text: "Der Abschluss beginnt mit vollständigen Daten statt mit dem Zusammentragen von Unterlagen.",
      },
    ],
    faqs: [
      {
        question: "Werden Zuschläge mit übergeben?",
        answer:
          "Ja. Freigegebene Stunden stehen inklusive der Zuschläge für die Lohnabrechnung bereit, weil sie in der Zeiterfassung bereits mit erfasst und geprüft wurden.",
      },
      {
        question: "Wie kommt der Projektbezug in die Buchhaltung?",
        answer:
          "Er entsteht bei der Erfassung. Ein Beleg trägt Projekt und Kostenstelle von Anfang an mit sich, sodass die Zuordnung nicht nachträglich rekonstruiert wird.",
      },
      {
        question: "Was ändert sich am Monatsabschluss?",
        answer:
          "Der Sammelschritt entfällt. Statt Unterlagen aus Postfächern und Ordnern zusammenzutragen, steht der Übergabestand am Monatsende bereits.",
      },
      {
        question: "Ersetzt das die Zusammenarbeit mit der Kanzlei?",
        answer:
          "Nein. Es verändert nur, in welcher Form die Kanzlei die Daten bekommt: geprüft und zugeordnet statt als Sammlung, die dort erst sortiert werden muss.",
      },
    ],
  },
  {
    slug: "lexoffice",
    unlisted: true,
    crossLinks: [
      { text: "Wo die Rechnung entsteht, beschreibt", href: "/produkt/rechnungsstellung", label: "die Rechnungsstellung" },
      { text: "Für die durchgehende Kette vom Angebot bis zur Rechnung siehe", href: "/branchen/auftragsbasierte-dienstleister", label: "Software für auftragsbasierte Dienstleister" },
    ],
    title: "lexoffice",
    tagline: "Rechnungen und Belege synchron",
    description:
      "Rechnungen und Belege aus Gleistrix in lexoffice weiterführen – die Buchhaltung arbeitet mit denselben Zahlen wie die Disposition.",
    icon: Banknote,
    group: "Buchhaltung & Finanzen",
    metaDescription:
      "lexoffice mit Gleistrix verbinden: Rechnungen aus dem Projekt übernehmen, Belege mit Projektbezug führen und Zahlungsstände nachvollziehbar halten.",
    logo: logoOf("lexoffice"),
    highlights: [
      {
        title: "Ein Datenstand",
        text: "Was abgerechnet wurde, steht in der Buchhaltung – ohne zweite Erfassung.",
      },
      {
        title: "Belege am Projekt",
        text: "Eingangsbelege bleiben dem Projekt zugeordnet und tauchen in der Auswertung auf.",
      },
      {
        title: "Schneller Abschluss",
        text: "Der Monatsabschluss beginnt nicht mit dem Zusammensuchen von Unterlagen.",
      },
    ],
    bullets: [
      "Rechnungen aus dem Projekt übernehmen",
      "Belege mit Projektbezug",
      "Zahlungsstände nachvollziehbar",
      "Weniger Doppelerfassung im Monatsabschluss",
    ],
    challenges: [
      {
        problem:
          "Eine gestellte Rechnung wird in der Buchhaltung ein zweites Mal angelegt. Weichen die Zahlen voneinander ab, fällt das erst beim Abgleich auf.",
        solution:
          "Was abgerechnet wurde, wird in lexoffice weitergeführt statt neu erfasst. Disposition und Buchhaltung rechnen mit demselben Stand.",
      },
      {
        problem:
          "Eingangsbelege liegen in der Buchhaltung, die Projektauswertung kennt sie nicht. Die Kosten eines Projekts sind dort unvollständig.",
        solution:
          "Belege behalten ihren Projektbezug und tauchen in der Auswertung des Projekts auf, zu dem sie gehören.",
      },
      {
        problem:
          "Ob eine Rechnung bezahlt ist, weiß die Buchhaltung. Gefragt wird danach aber im Projekt, beim Gespräch mit dem Kunden.",
        solution:
          "Zahlungsstände sind dort sichtbar, wo über das Projekt gesprochen wird – ohne Rückfrage in einem anderen Werkzeug.",
      },
    ],
    steps: [
      {
        title: "Rechnung im Projekt stellen",
        text: "Die Abrechnung entsteht aus den geprüften Leistungen des Projekts.",
      },
      {
        title: "Nach lexoffice übernehmen",
        text: "Die Rechnung wird weitergeführt, statt in der Buchhaltung erneut angelegt zu werden.",
      },
      {
        title: "Belege zuordnen",
        text: "Eingangsbelege behalten den Bezug zum Projekt, aus dem sie stammen.",
      },
      {
        title: "Zahlungsstand verfolgen",
        text: "Ob und wann bezahlt wurde, bleibt am Projekt nachvollziehbar.",
      },
    ],
    faqs: [
      {
        question: "Muss eine Rechnung zweimal erfasst werden?",
        answer:
          "Nein. Sie entsteht im Projekt aus den geprüften Leistungen und wird nach lexoffice weitergeführt. Eine zweite Eingabe entfällt und damit auch die Möglichkeit, dass beide Stände auseinanderlaufen.",
      },
      {
        question: "Bleibt der Projektbezug von Belegen erhalten?",
        answer:
          "Ja. Ein Eingangsbeleg trägt sein Projekt mit sich und erscheint deshalb auch in der Auswertung dieses Projekts, nicht nur in der Buchhaltung.",
      },
      {
        question: "Wo sehe ich, ob eine Rechnung bezahlt wurde?",
        answer:
          "Am Projekt. Der Zahlungsstand ist dort sichtbar, wo über das Projekt entschieden wird, statt nur in der Buchhaltung zu liegen.",
      },
      {
        question: "Was ändert sich am Monatsabschluss?",
        answer:
          "Er beginnt nicht mit dem Zusammensuchen von Unterlagen. Weil Rechnungen und Belege bereits zugeordnet sind, entfällt der Sortierschritt davor.",
      },
    ],
  },
  {
    slug: "sevdesk",
    unlisted: true,
    crossLinks: [
      { text: "Wo die Rechnungsdaten herkommen, zeigt", href: "/produkt/rechnungsstellung", label: "die Rechnungsstellung" },
      { text: "Die Alternative in derselben Rolle ist", href: "/integrationen/lexoffice", label: "die lexoffice-Anbindung" },
    ],
    title: "sevdesk",
    tagline: "Buchhaltung ohne Doppelerfassung",
    description:
      "Rechnungs- und Belegdaten an sevdesk weitergeben, statt sie ein zweites Mal einzutippen.",
    icon: Banknote,
    group: "Buchhaltung & Finanzen",
    metaDescription:
      "sevdesk mit Gleistrix verbinden: Rechnungsdaten ohne Zweiterfassung weitergeben, offene Posten verfolgen und den Jahresabschluss sauber vorbereiten.",
    logo: logoOf("sevdesk"),
    highlights: [
      {
        title: "Direkt weitergereicht",
        text: "Gestellte Rechnungen laufen in die Buchhaltung, ohne Umweg über Exportdateien.",
      },
      {
        title: "Projektbezug bleibt",
        text: "Auch in der Buchhaltung ist erkennbar, zu welchem Projekt ein Beleg gehört.",
      },
      {
        title: "Offene Posten",
        text: "Zahlungsstände sind dort sichtbar, wo über das Projekt entschieden wird.",
      },
    ],
    bullets: [
      "Rechnungsdaten ohne Zweiterfassung",
      "Belege mit Projekt- und Kostenbezug",
      "Offene Posten im Blick",
      "Sauberer Übergang in den Jahresabschluss",
    ],
    challenges: [
      {
        problem:
          "Rechnungsdaten werden als Datei exportiert, geprüft und in der Buchhaltung wieder eingelesen. Jeder Zwischenschritt kann schiefgehen.",
        solution:
          "Gestellte Rechnungen laufen direkt in die Buchhaltung, ohne den Umweg über Exportdateien und deren Nachbereitung.",
      },
      {
        problem:
          "In der Buchhaltung ist nicht mehr erkennbar, aus welchem Projekt ein Beleg stammt. Die Kostenzuordnung geht auf dem Weg verloren.",
        solution:
          "Belege behalten Projekt- und Kostenbezug auch nach der Übergabe. Die Zuordnung überlebt den Wechsel zwischen den Systemen.",
      },
      {
        problem:
          "Offene Posten stehen in der Buchhaltung, entschieden wird aber im Projekt – etwa darüber, ob weitergearbeitet wird.",
        solution:
          "Offene Posten sind dort im Blick, wo die Entscheidung fällt, statt in einem getrennten Werkzeug nachgeschlagen zu werden.",
      },
    ],
    steps: [
      {
        title: "Rechnung stellen",
        text: "Die Rechnung entsteht im Projekt aus den geprüften Leistungen.",
      },
      {
        title: "An sevdesk weitergeben",
        text: "Die Daten laufen direkt weiter, ohne Exportdatei als Zwischenschritt.",
      },
      {
        title: "Offene Posten verfolgen",
        text: "Zahlungseingänge bleiben am Projekt sichtbar.",
      },
      {
        title: "Jahresabschluss vorbereiten",
        text: "Weil Belege und Rechnungen zugeordnet sind, ist der Bestand am Jahresende bereits sortiert.",
      },
    ],
    faqs: [
      {
        question: "Braucht es Exportdateien für die Übergabe?",
        answer:
          "Nein. Gestellte Rechnungen laufen direkt in die Buchhaltung. Der Zwischenschritt über eine Datei entfällt und damit auch die Fehlerquelle, die er darstellt.",
      },
      {
        question: "Ist in sevdesk noch erkennbar, zu welchem Projekt ein Beleg gehört?",
        answer:
          "Ja. Projekt- und Kostenbezug gehen bei der Übergabe nicht verloren, sodass sich Kosten auch später noch dem richtigen Vorgang zuordnen lassen.",
      },
      {
        question: "Wo sehe ich offene Posten?",
        answer:
          "Am Projekt, nicht nur in der Buchhaltung. Das ist die Stelle, an der über Weiterarbeit oder Nachfassen entschieden wird.",
      },
      {
        question: "Worin unterscheidet sich das von der lexoffice-Anbindung?",
        answer:
          "Im Schwerpunkt, nicht im Prinzip: Beide vermeiden die Zweiterfassung. Welches der beiden Werkzeuge passt, entscheidet die Buchhaltung, nicht Gleistrix.",
      },
    ],
  },
  {
    slug: "agenda",
    title: "Agenda",
    tagline: "Lohn- und Finanzbuchhaltung",
    description:
      "Stunden- und Abrechnungsdaten für die Agenda-Lohn- und Finanzbuchhaltung bereitstellen – geprüft und im passenden Schnitt.",
    icon: Banknote,
    group: "Buchhaltung & Finanzen",
    unlisted: true,
    logo: logoOf("agenda"),
    highlights: [
      {
        title: "Geprüfte Stunden",
        text: "Nur freigegebene Zeiten gehen in die Lohnabrechnung – Korrekturschleifen entfallen.",
      },
      {
        title: "Zuschläge korrekt",
        text: "Nacht-, Wochenend- und Feiertagszuschläge sind bereits berechnet.",
      },
      {
        title: "Fester Rhythmus",
        text: "Die Übergabe folgt dem Abrechnungszeitraum, nicht dem Zuruf.",
      },
    ],
    bullets: [
      "Stundendaten für die Lohnabrechnung",
      "Zuschläge und Zulagen vorberechnet",
      "Abrechnungsdaten je Zeitraum",
      "Übergabe im vereinbarten Rhythmus",
    ],
  },
  {
    slug: "stripe",
    title: "Stripe",
    tagline: "Zahlungen empfangen und zuordnen",
    description:
      "Zahlungen über Stripe abwickeln und automatisch der richtigen Rechnung zuordnen.",
    icon: Banknote,
    group: "Buchhaltung & Finanzen",
    unlisted: true,
    logo: logoOf("stripe"),
    highlights: [
      {
        title: "Zahlung am Beleg",
        text: "Eingehende Zahlungen landen an der Rechnung, zu der sie gehören.",
      },
      {
        title: "Status sichtbar",
        text: "Offen, bezahlt oder überfällig steht in der Projektakte.",
      },
      {
        title: "Weniger Nachfassen",
        text: "Erinnerungen laufen anhand des tatsächlichen Zahlungsstands.",
      },
    ],
    bullets: [
      "Zahlungen automatisch zuordnen",
      "Zahlungsstatus je Rechnung",
      "Erinnerungen auf Basis echter Stände",
      "Auswertung offener Posten",
    ],
  },
  {
    slug: "paypal",
    title: "PayPal",
    tagline: "Alternative Zahlungswege",
    description:
      "PayPal als zusätzlichen Zahlungsweg anbieten – mit derselben Zuordnung zu Rechnung und Projekt.",
    icon: Banknote,
    group: "Buchhaltung & Finanzen",
    unlisted: true,
    logo: logoOf("paypal"),
    highlights: [
      {
        title: "Mehr Wege zur Zahlung",
        text: "Kunden zahlen so, wie es für sie am schnellsten geht.",
      },
      {
        title: "Gleiche Zuordnung",
        text: "Auch PayPal-Zahlungen erscheinen an der zugehörigen Rechnung.",
      },
      {
        title: "Ein Überblick",
        text: "Alle Zahlungswege laufen in derselben Auswertung zusammen.",
      },
    ],
    bullets: [
      "Zusätzlicher Zahlungsweg für Kunden",
      "Automatische Zuordnung zur Rechnung",
      "Einheitlicher Blick auf alle Zahlungseingänge",
      "Weniger manuelle Abgleiche",
    ],
  },
  {
    slug: "microsoft",
    crossLinks: [
      { text: "Welche Einsätze im Kalender landen, entscheidet", href: "/produkt/kalender-einsatzuebersicht", label: "die Plantafel und Einsatzübersicht" },
      { text: "Wie Dokumente am Projekt abgelegt werden, zeigt", href: "/produkt/dokumentenmanagement", label: "das Dokumentenmanagement" },
    ],
    title: "Microsoft 365",
    h1: "Microsoft 365 für Bahnprojekte: Outlook, OneDrive, SharePoint und Teams",
    tagline: "Postfach, Kalender und Dateien",
    description:
      "Mit Microsoft 365 arbeiten, ohne die Plattform zu verlassen – Termine, Nachrichten und Dokumente bleiben verbunden.",
    icon: Mail,
    group: "Kommunikation & Kalender",
    metaDescription:
      "Microsoft 365 mit Gleistrix verbinden: Einsätze im gewohnten Kalender, Projektbezug für Nachrichten und Dokumente, Anmeldung über bestehende Konten.",
    logo: logoOf("microsoft"),
    highlights: [
      {
        title: "Termine synchron",
        text: "Einsätze erscheinen im gewohnten Kalender des Teams.",
      },
      {
        title: "E-Mail am Projekt",
        text: "Wichtige Nachrichten landen in der Projektakte statt nur im Postfach.",
      },
      {
        title: "Vertraute Umgebung",
        text: "Das Team behält seine Werkzeuge – die Daten laufen trotzdem zusammen.",
      },
    ],
    bullets: [
      "Kalendereinträge für Einsätze und Schichten",
      "Nachrichten dem Projekt zuordnen",
      "Dokumente ohne Medienbruch",
      "Anmeldung über bestehende Konten",
    ],
    challenges: [
      {
        problem:
          "Der Einsatzplan liegt in der Plattform, der Arbeitsalltag im Outlook-Kalender. Wer beides im Blick behalten will, pflegt zwei Kalender.",
        solution:
          "Einsätze und Schichten erscheinen im gewohnten Kalender. Der Plan bleibt an einer Stelle geführt und trotzdem dort sichtbar, wo hingeschaut wird.",
      },
      {
        problem:
          "Die entscheidende Absprache zu einem Projekt steht in einem Postfach. Wer nicht im Verteiler war, findet sie nicht.",
        solution:
          "Wichtige Nachrichten lassen sich dem Projekt zuordnen und liegen damit in der Projektakte statt nur beim einzelnen Empfänger.",
      },
      {
        problem:
          "Für ein weiteres Werkzeug braucht es weitere Zugänge. Jeder neue Mitarbeiter bedeutet einen zusätzlichen Verwaltungsschritt.",
        solution:
          "Die Anmeldung läuft über die bestehenden Konten. Zugänge werden dort verwaltet, wo sie ohnehin verwaltet werden.",
      },
    ],
    steps: [
      {
        title: "Konten verbinden",
        text: "Die Anmeldung erfolgt über die vorhandenen Microsoft-365-Konten des Unternehmens.",
      },
      {
        title: "Kalender koppeln",
        text: "Geplante Einsätze und Schichten erscheinen im Kalender des Teams.",
      },
      {
        title: "Nachrichten zuordnen",
        text: "Projektrelevante Mails landen in der Projektakte statt nur im Postfach.",
      },
      {
        title: "Dokumente weiterverwenden",
        text: "Dateien bleiben zugänglich, ohne den Umweg über einen zusätzlichen Speicherort.",
      },
    ],
    faqs: [
      {
        question: "Muss das Team seine gewohnten Werkzeuge aufgeben?",
        answer:
          "Nein, das ist der Zweck der Anbindung. Kalender, Postfach und Dateien bleiben, wo sie sind – die Daten laufen trotzdem im Projekt zusammen.",
      },
      {
        question: "Erscheinen Einsätze im Outlook-Kalender?",
        answer:
          "Ja. Einsätze und Schichten werden als Kalendereinträge geführt, sodass der Plan im gewohnten Kalender sichtbar ist, ohne ihn dort zweitpflegen zu müssen.",
      },
      {
        question: "Braucht jeder Mitarbeiter einen eigenen neuen Zugang?",
        answer:
          "Nein. Die Anmeldung läuft über die bestehenden Konten, sodass die Benutzerverwaltung an einer Stelle bleibt.",
      },
      {
        question: "Was passiert mit Nachrichten, die nicht zum Projekt gehören?",
        answer:
          "Nichts – zugeordnet wird bewusst und einzeln. Die Projektakte füllt sich mit dem, was hineingehört, nicht mit dem gesamten Postfach.",
      },
    ],
  },
  {
    slug: "telegram",
    title: "Telegram",
    tagline: "Kurze Wege zum Trupp",
    description:
      "Einsatzinformationen und Rückmeldungen über Telegram austauschen – dort, wo die Teams ohnehin erreichbar sind.",
    icon: MessageCircle,
    group: "Kommunikation & Kalender",
    unlisted: true,
    logo: logoOf("telegram"),
    highlights: [
      {
        title: "Sofort erreichbar",
        text: "Kurzfristige Änderungen erreichen den Trupp, ohne dass jemand telefoniert.",
      },
      {
        title: "Rückmeldung dokumentiert",
        text: "Bestätigungen bleiben am Einsatz hängen statt im Chatverlauf zu verschwinden.",
      },
      {
        title: "Ohne neue App",
        text: "Das Team nutzt den Messenger, den es bereits kennt.",
      },
    ],
    bullets: [
      "Benachrichtigungen zu Einsätzen und Änderungen",
      "Rückmeldungen am Einsatz dokumentiert",
      "Erinnerungen vor Schichtbeginn",
      "Keine zusätzliche App für das Team",
    ],
  },
  {
    slug: "cal-com",
    title: "Cal.com",
    tagline: "Termine ohne Hin und Her",
    description:
      "Termine über Cal.com buchbar machen – Verfügbarkeiten kommen aus der Planung, nicht aus dem Bauchgefühl.",
    icon: CalendarCheck,
    group: "Kommunikation & Kalender",
    unlisted: true,
    logo: logoOf("cal-com"),
    highlights: [
      {
        title: "Echte Verfügbarkeit",
        text: "Buchbar ist nur, was in der Planung tatsächlich frei ist.",
      },
      {
        title: "Weniger Abstimmung",
        text: "Kunden und Bewerber buchen selbst, statt Termine per Mail auszuhandeln.",
      },
      {
        title: "Direkt im Kalender",
        text: "Gebuchte Termine erscheinen sofort in der Einsatzübersicht.",
      },
    ],
    bullets: [
      "Buchungsseiten mit echten Verfügbarkeiten",
      "Termine direkt in der Einsatzübersicht",
      "Automatische Bestätigungen und Erinnerungen",
      "Weniger Abstimmung per E-Mail",
    ],
  },
  {
    slug: "calendly",
    title: "Calendly",
    tagline: "Buchbare Zeitfenster",
    description:
      "Beratungs- und Bewerbungstermine über Calendly anbieten und automatisch in die Planung übernehmen.",
    icon: CalendarCheck,
    group: "Kommunikation & Kalender",
    unlisted: true,
    logo: logoOf("calendly"),
    highlights: [
      {
        title: "Selbst buchen lassen",
        text: "Interessenten wählen ein Zeitfenster, das wirklich zur Verfügung steht.",
      },
      {
        title: "Ohne Nacharbeit",
        text: "Gebuchte Termine müssen nicht von Hand nachgetragen werden.",
      },
      {
        title: "Erinnerungen inklusive",
        text: "Absagen und Verschiebungen laufen über denselben Weg.",
      },
    ],
    bullets: [
      "Zeitfenster für Beratung und Gespräche",
      "Übernahme in die Einsatzübersicht",
      "Automatische Erinnerungen",
      "Verschiebungen ohne Telefonat",
    ],
  },
  {
    slug: "indeed",
    title: "Indeed",
    tagline: "Stellen ausschreiben und nachverfolgen",
    description:
      "Offene Stellen über Indeed ausschreiben und Bewerbungen dort weiterverfolgen, wo auch geplant wird.",
    icon: UserSearch,
    group: "Personal & Recruiting",
    unlisted: true,
    logo: logoOf("indeed"),
    highlights: [
      {
        title: "Bedarf sichtbar",
        text: "Wo Personal fehlt, zeigt die Planung – die Ausschreibung setzt genau dort an.",
      },
      {
        title: "Ein Eingang",
        text: "Bewerbungen laufen an einer Stelle zusammen statt in mehreren Postfächern.",
      },
      {
        title: "Direkt einsatzfähig",
        text: "Aus der Einstellung wird die Personalakte samt Qualifikationen.",
      },
    ],
    bullets: [
      "Stellen aus dem erkannten Bedarf ausschreiben",
      "Bewerbungen zentral nachverfolgen",
      "Gesprächstermine ohne Umweg",
      "Übernahme in die Personalakte",
    ],
  },
  {
    slug: "stepstone",
    title: "StepStone",
    tagline: "Reichweite für Fachkräfte",
    description:
      "Fachkräfte über StepStone erreichen und den Bewerbungsprozess an die Einsatzplanung anschließen.",
    icon: UserSearch,
    group: "Personal & Recruiting",
    unlisted: true,
    logo: logoOf("stepstone"),
    highlights: [
      {
        title: "Passende Profile",
        text: "Ausschreibungen benennen die Qualifikationen, die der Einsatz wirklich verlangt.",
      },
      {
        title: "Nachverfolgbar",
        text: "Jeder Schritt im Verfahren bleibt dokumentiert.",
      },
      {
        title: "Anschluss an die Planung",
        text: "Neue Mitarbeitende sind mit Nachweisen sofort disponierbar.",
      },
    ],
    bullets: [
      "Ausschreibungen mit geforderten Qualifikationen",
      "Bewerbungsstand nachvollziehbar",
      "Termine für Gespräche einplanen",
      "Direkter Übergang in die Personalakte",
    ],
  },
];

export const INTEGRATION_CATALOG: Catalog = {
  basePath: "/integrationen",
  singular: "Integration",
  plural: "Integrationen",
  menuNote: `${INTEGRATION_PAGES.filter((entry) => !entry.unlisted).length} Anbindungen · sauber verzahnt`,
  scopeHeading: "Was die Anbindung an {title} übernimmt",
  ctaHeading: "{title} anbinden?",
  challengesHeading: "Was sich mit {title} ändert",
  stepsHeading: "So arbeitest du mit {title}",
  faqHeading: "Häufige Fragen zu {title}",
  overviewHref: "/integrationen",
  overviewLabel: "Alle Integrationen ansehen",
  // Nur Anbindungen mit Produktbeleg (GAEB, Deutsche Bahn, DATEV,
  // Microsoft 365). Die übrigen Seiten bleiben erreichbar, siehe `unlisted`.
  entries: INTEGRATION_PAGES.filter((entry) => !entry.unlisted),
};
