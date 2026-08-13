import { Briefcase, Building2, HardHat, Network, ShieldCheck } from "lucide-react";

import type { Catalog, CatalogEntry } from "./catalog";

/**
 * Branchen – Quelle für das Megamenü, die Übersicht unter /branchen und die
 * Detailseiten unter /branchen/[slug].
 */
export const INDUSTRIES: CatalogEntry[] = [
  {
    slug: "gleisbausicherung-bauueberwachung",
    crossLinks: [
      { text: "Wie Protokolle und Nachweise abgelegt werden, beschreibt", href: "/produkt/dokumentenmanagement", label: "Dokumentenmanagement für Bahnprojekte" },
      { text: "Angebote auf Basis eines Leistungsverzeichnisses erklärt", href: "/integrationen/gaeb", label: "die GAEB-Schnittstelle" },
      { text: "Für die reine Personaldisposition ohne Bauüberwachung passt", href: "/branchen/sicherungsunternehmen", label: "Software für Sicherungsunternehmen" },
    ],
    title: "Gleisbausicherung & Bauüberwachung",
    tagline: "Sicherungsplanung und Nachweise",
    description:
      "Gleistrix ist aus der Gleisbausicherung entstanden – hier spielt die Plattform ihre Stärken am deutlichsten aus.",
    metaDescription:
      "Software für Gleisbausicherung und Bauüberwachung: qualifikationsbasierte Schichtplanung, Nachweise, Stundenzettel und Abrechnung – aus der Praxis entstanden.",
    icon: ShieldCheck,
    group: "Sicherung & Überwachung",
    image: "/Sicherungspersonal%20gleis.png",
    highlights: [
      {
        title: "Aus der Praxis entstanden",
        text: "Die Plattform wurde entlang echter Sicherungsaufträge gebaut, nicht am Reißbrett.",
      },
      {
        title: "Qualifikation entscheidet",
        text: "Die Planung schlägt nur Personal vor, dessen Nachweise am Einsatztag gültig sind.",
      },
      {
        title: "Nachweise ohne Suchen",
        text: "Stundenzettel, Protokolle und Dokumente hängen an Projekt und Schicht.",
      },
    ],
    bullets: [
      "Qualifikationsbasierte Schichtplanung, Abrechnung und Vergütung",
      "Vereinfachte Auftragsverwaltung, Dienstplanvermittlung und Disposition",
      "Angebotserstellung auch im GAEB-Format",
      "Digitale Stundenzettel, Nachweise und Dokumente",
      "Dashboard mit allen wichtigen Kennzahlen",
      "Integrierte Kommunikation",
    ],
    challenges: [
      {
        problem:
          "Wer welche Schicht übernimmt, wird per Telefon und Nachricht abgestimmt. Der verbindliche Stand liegt am Ende bei einer Person.",
        solution:
          "Auftragsverwaltung, Dienstplan und Disposition liegen zusammen. Alle Beteiligten arbeiten auf demselben Stand, ohne ihn erst erfragen zu müssen.",
      },
      {
        problem:
          "Vor einer Prüfung werden Stundenzettel, Protokolle und Qualifikationsnachweise aus Ordnern und Postfächern zusammengetragen.",
        solution:
          "Nachweise und Dokumente hängen an Projekt und Schicht. Was zu einem Einsatz gehört, ist über den Einsatz auffindbar.",
      },
      {
        problem:
          "Positionen aus dem Leistungsverzeichnis werden für jedes Angebot von Hand in ein eigenes Dokument übertragen.",
        solution:
          "Angebote entstehen im GAEB-Format, sodass Positionen und Mengen nicht abgetippt werden müssen.",
      },
    ],
    steps: [
      {
        title: "Auftrag erfassen",
        text: "Auftraggeber, Strecke und Zeitraum werden einmal hinterlegt und gelten für alle Schichten des Auftrags.",
      },
      {
        title: "Schichten besetzen",
        text: "Die Planung schlägt nur Personal vor, dessen Nachweise am jeweiligen Einsatztag gültig sind.",
      },
      {
        title: "Einsatz dokumentieren",
        text: "Zeiten, Stundenzettel und Protokolle entstehen am Einsatz und bleiben dort verknüpft.",
      },
      {
        title: "Abrechnen und auswerten",
        text: "Geprüfte Leistungen gehen in die Abrechnung, das Dashboard zeigt die Kennzahlen dazu.",
      },
    ],
    faqs: [
      {
        question: "Was unterscheidet Gleistrix von einer allgemeinen Dispositionssoftware?",
        answer:
          "Die Plattform ist entlang echter Sicherungsaufträge entstanden. Qualifikationen, Gültigkeiten und Nachweise sind deshalb keine nachträglich ergänzten Felder, sondern Teil der Planung selbst.",
      },
      {
        question: "Lassen sich Angebote im GAEB-Format erstellen?",
        answer:
          "Ja. Die Angebotserstellung unterstützt das GAEB-Format, sodass Leistungsverzeichnisse nicht in ein separates Dokument übertragen werden müssen.",
      },
      {
        question: "Wie werden Nachweise für eine Prüfung bereitgestellt?",
        answer:
          "Stundenzettel, Protokolle und Dokumente sind dem Projekt und der einzelnen Schicht zugeordnet. Die Zusammenstellung für eine Prüfung entsteht daraus, statt nachträglich rekonstruiert zu werden.",
      },
      {
        question: "Lässt sich die Abstimmung mit dem Team abbilden?",
        answer:
          "Ja. Die Kommunikation ist in die Plattform integriert, sodass Absprachen zu einem Einsatz nicht in einem getrennten Kanal liegen.",
      },
    ],
  },
  {
    slug: "sicherungsunternehmen",
    crossLinks: [
      { text: "Wie Schichten und Stundenzettel im Detail zusammenhängen, steht unter", href: "/produkt/zeiterfassung-stundenzettel", label: "Zeiterfassung und Stundenzettel" },
      { text: "Die Plantafel dahinter beschreibt", href: "/produkt/projektplanung-disposition", label: "Projektplanung und Disposition" },
      { text: "Was Auftraggeber im Bahnumfeld an Nachweisen erwarten, steht unter", href: "/integrationen/deutsche-bahn", label: "Anforderungen der Deutschen Bahn" },
    ],
    title: "Sicherungsunternehmen",
    tagline: "Regelbasierte Einsätze, lückenlose Doku",
    description:
      "Einsätze qualifikations- und regelbasiert planen – mit lückenloser Dokumentation und prüffähigen Nachweisen.",
    // Übernimmt Titel und Beschreibung der weitergeleiteten Landingpage
    // /software-sicherungsunternehmen. Der abgeleitete Titel hieße sonst nur
    // "Software für Sicherungsunternehmen" und verlöre "Gleisbausicherung".
    metaTitle: "Software für Sicherungsunternehmen & Gleisbausicherung",
    metaDescription:
      "Software für Sicherungsunternehmen: qualifikationsbasierte Disposition, Schichtplanung, Zeiterfassung, Nachweise und Abrechnung für die Gleisbausicherung.",
    icon: Network,
    group: "Sicherung & Überwachung",
    image: "/Sicherungsunternehmen.png",
    highlights: [
      {
        title: "Regeln statt Erfahrungswissen",
        text: "Besetzungsregeln liegen im System – nicht im Kopf einer einzelnen Person.",
      },
      {
        title: "Prüffähig auf Knopfdruck",
        text: "Jede Schicht ist mit Nachweis und Signatur hinterlegt und bleibt auffindbar.",
      },
      {
        title: "Mobil im Einsatz",
        text: "Das Team meldet Zeiten und Vorkommnisse direkt vom Einsatzort.",
      },
    ],
    bullets: [
      "Planung nach Qualifikationen (z. B. SiPo, SaKra, HIB)",
      "Lückenlose Dokumentation inkl. Nachweisen und Signaturen",
      "Mobile Zeiterfassung und prüffähige Stundenzettel",
      "Standardisierte Exporte und optionale Schnittstellen",
      "X-Rechnung und Compliance-Unterstützung",
    ],
    challenges: [
      {
        problem:
          "Eine Tauglichkeit läuft mitten im Einsatzzeitraum ab. Auffallen tut das, wenn der Posten schon auf der Strecke steht.",
        solution:
          "Qualifikationen und ihre Gültigkeit liegen am Mitarbeiter. Wer für den geplanten Tag nicht mehr gültig ist, wird bei der Besetzung nicht vorgeschlagen.",
      },
      {
        problem:
          "Der Auftraggeber fragt Nachweise zu einer Schicht von vor acht Wochen an. Die Suche geht durch Ordner, Fotos und drei Postfächer.",
        solution:
          "Jede Schicht trägt ihre Nachweise und Signaturen bei sich und bleibt über das Projekt auffindbar – ohne Rekonstruktion aus Einzelteilen.",
      },
      {
        problem:
          "Nacht- und Wochenendeinsätze stehen in einer Tabelle, die Verfügbarkeit der Posten im Kalender. Beides wird von Hand abgeglichen.",
        solution:
          "Schichten, Abwesenheiten und Verfügbarkeiten liegen in derselben Plantafel. Doppelbelegungen meldet Gleistrix beim Zuweisen, nicht am Einsatztag.",
      },
    ],
    steps: [
      {
        title: "Einsatz anlegen",
        text: "Auftrag, Streckenabschnitt und Sperrpause werden einmal erfasst und gelten für alle Schichten darin.",
      },
      {
        title: "Nach Regeln besetzen",
        text: "Pro Schicht steht fest, welche Qualifikationen gebraucht werden – SiPo, SaKra oder HIB. Vorgeschlagen wird nur, wer sie zum Einsatztag gültig besitzt.",
      },
      {
        title: "Vor Ort erfassen",
        text: "Das Team meldet Zeiten und Vorkommnisse direkt vom Einsatzort, inklusive Signatur.",
      },
      {
        title: "Prüfen und abrechnen",
        text: "Freigegebene Stunden gehen ohne erneute Eingabe in die Abrechnung, auf Wunsch als X-Rechnung.",
      },
    ],
    faqs: [
      {
        question: "Welche Qualifikationen lassen sich hinterlegen?",
        answer:
          "Die in der Gleisbausicherung üblichen Nachweise wie Sicherungsposten, Sicherungsaufsicht mit Kranausbildung oder Handbedienung von Bahnübergängen, jeweils mit Gültigkeitsdatum. Weitere Qualifikationen und Tauglichkeiten lassen sich ergänzen, weil die Liste je Unternehmen konfiguriert wird.",
      },
      {
        question: "Was passiert, wenn eine Qualifikation während des Einsatzzeitraums abläuft?",
        answer:
          "Gleistrix prüft die Gültigkeit gegen den geplanten Einsatztag, nicht gegen das heutige Datum. Ein Posten, dessen Nachweis am Freitag ausläuft, taucht für den Montag danach nicht mehr als Vorschlag auf.",
      },
      {
        question: "Wie kommen die Nachweise zum Auftraggeber?",
        answer:
          "Über standardisierte Exporte aus dem Projekt heraus. Weil Schicht, Zeiterfassung und Nachweis am selben Vorgang hängen, entsteht die Zusammenstellung aus dem laufenden Betrieb statt in einer Nachbearbeitung.",
      },
      {
        question: "Eignet sich das auch für kurzfristige Umplanungen?",
        answer:
          "Ja. Änderungen an einer Schicht sind sofort für Disposition und Trupp sichtbar, weil alle Beteiligten dieselbe Plantafel sehen. Es gibt keine zweite Fassung des Plans, die noch verteilt werden müsste.",
      },
    ],
  },
  {
    slug: "gleisbauunternehmen",
    crossLinks: [
      { text: "Zweiwegefahrzeuge, Geräte und Prüffristen behandelt", href: "/produkt/fahrzeug-technik", label: "Fahrzeuge und Technik disponieren" },
      { text: "Leistungsverzeichnisse einlesen und zurückgeben erklärt", href: "/integrationen/gaeb", label: "die GAEB-Schnittstelle" },
      { text: "Deckungsbeiträge und Projektkennzahlen zeigt", href: "/produkt/reports-auswertungen", label: "Reports und Auswertungen" },
    ],
    title: "Gleisbauunternehmen",
    tagline: "Baustellen, Sperrpausen und Geräte",
    description:
      "Baustellen im Griff: Ressourcen, Sperrpausen, Geräte und Kosten transparent steuern – vom Angebot bis zur Schlussrechnung.",
    metaDescription:
      "Software für Gleisbauunternehmen: Baustellen und Sperrpausen planen, Zweiwegefahrzeuge disponieren, nach LV und GAEB abrechnen, Deckungsbeiträge verfolgen.",
    icon: HardHat,
    group: "Bau & Infrastruktur",
    image: "/Gleisbauunternehmen.png",
    highlights: [
      {
        title: "Sperrpausen planbar",
        text: "Knappe Zeitfenster werden mit Personal, Technik und Material zusammen geplant.",
      },
      {
        title: "Technik disponiert",
        text: "Zweiwegefahrzeuge und Geräte laufen in derselben Planung wie die Trupps.",
      },
      {
        title: "Kosten im Blick",
        text: "Leistungen nach LV und GAEB abrechnen und Deckungsbeiträge laufend sehen.",
      },
    ],
    bullets: [
      "Baustellen- und Sperrpausenplanung",
      "Geräte- und Fahrzeugdisposition (z. B. Zweiwege-Technik)",
      "Leistungsnachweise und Abrechnung nach LV/GAEB",
      "Sicherheits- und Qualifikationsmanagement",
      "Projekt- und Kostencontrolling über Reports",
    ],
    challenges: [
      {
        problem:
          "Die Sperrpause verschiebt sich um eine Woche. Personalplan, Gerätedisposition und Materialbestellung hängen an drei getrennten Stellen.",
        solution:
          "Sperrpause und Bauabschnitt gehören zum Projekt. Wer und was im Zeitfenster eingeplant ist, verschiebt sich mit – in einer Planung statt in dreien.",
      },
      {
        problem:
          "Ein Zweiwegefahrzeug steht für zwei Baustellen gleichzeitig im Plan. Bemerkt wird das, wenn es an der falschen Stelle steht.",
        solution:
          "Fahrzeuge und Geräte laufen in derselben Planung wie die Trupps. Doppelbelegungen meldet Gleistrix beim Zuweisen.",
      },
      {
        problem:
          "Ob ein Projekt gedeckt hat, zeigt sich erst nach der Schlussrechnung – dann ist für Gegenmaßnahmen kein Spielraum mehr.",
        solution:
          "Leistungen, Stunden und Kosten laufen ins selbe Projekt. Der Deckungsbeitrag ist während der Bauzeit sichtbar, nicht erst danach.",
      },
    ],
    steps: [
      {
        title: "Angebot und Leistungsverzeichnis",
        text: "Positionen und Mengen kommen über GAEB ins Projekt, statt für das Angebot abgetippt zu werden.",
      },
      {
        title: "Baustelle und Sperrpause planen",
        text: "Bauabschnitte und Zeitfenster werden hinterlegt und bilden den Rahmen für alle Schichten darin.",
      },
      {
        title: "Ressourcen zuweisen",
        text: "Trupps, Zweiwegefahrzeuge, Geräte und Material werden gemeinsam eingeplant – mit Qualifikationsprüfung beim Personal.",
      },
      {
        title: "Nachweisen und abrechnen",
        text: "Erbrachte Leistungen gehen nach LV in die Abrechnung, Reports zeigen Projektstatus und Kosten.",
      },
    ],
    faqs: [
      {
        question: "Lassen sich Sperrpausen mit Personal und Technik zusammen planen?",
        answer:
          "Ja, das ist der Kern der Baustellenplanung. Das Zeitfenster gehört zum Projekt, und Personal, Fahrzeuge und Geräte werden direkt darin disponiert statt in getrennten Listen.",
      },
      {
        question: "Können Zweiwegefahrzeuge und Geräte mitgeplant werden?",
        answer:
          "Ja. Fahrzeuge und Technik laufen in derselben Disposition wie die Trupps, inklusive Verfügbarkeiten und Prüffristen.",
      },
      {
        question: "Wie funktioniert die Abrechnung nach LV und GAEB?",
        answer:
          "Leistungsverzeichnisse lassen sich im GAEB-Format einlesen und wieder ausgeben. Erbrachte Leistungen werden gegen die Positionen abgerechnet, ohne die Mengen erneut zu erfassen.",
      },
      {
        question: "Wann ist der Deckungsbeitrag eines Projekts sichtbar?",
        answer:
          "Laufend. Weil Stunden, Leistungen und Kosten in dasselbe Projekt laufen, entsteht die Auswertung aus dem operativen Betrieb und nicht erst aus der Schlussrechnung.",
      },
    ],
  },
  {
    slug: "subunternehmen-db",
    crossLinks: [
      { text: "Welche Nachweise und Formate erwartet werden, steht unter", href: "/integrationen/deutsche-bahn", label: "Anforderungen der Deutschen Bahn" },
      { text: "Die X-Rechnung und den Weg dorthin beschreibt", href: "/produkt/rechnungsstellung", label: "Rechnungsstellung für Bahndienstleister" },
      { text: "Qualifikationen und ihre Gültigkeit verwaltet", href: "/produkt/mitarbeiterverwaltung", label: "die Mitarbeiterverwaltung" },
    ],
    title: "Subunternehmen der DB",
    tagline: "Anforderungen erfüllen, Daten sauber liefern",
    description:
      "Daten sauber liefern und Anforderungen erfüllen – mit strukturierten Nachweisen, Exporten und revisionssicherer Ablage.",
    metaDescription:
      "Software für Subunternehmen der DB: Nachweise vollständig halten, Leistungen und Stunden rückmelden, X-Rechnung stellen und revisionssicher ablegen.",
    icon: Building2,
    group: "Bau & Infrastruktur",
    image: "/subunternehmer.png",
    highlights: [
      {
        title: "Formate, die passen",
        text: "Exporte und Schnittstellen liefern das, was der Auftraggeber tatsächlich anfordert.",
      },
      {
        title: "Nachweise vollständig",
        text: "Qualifikationen und Dokumente sind zum Prüfzeitpunkt vorhanden und gültig.",
      },
      {
        title: "Status transparent",
        text: "Freigaben und Rückmeldungen sind für beide Seiten nachvollziehbar.",
      },
    ],
    bullets: [
      "Standardisierte Exporte und individuelle Schnittstellen",
      "Qualifikations- und Dokumentennachweise",
      "Leistungs- und Stundenrückmeldungen",
      "X-Rechnung und revisionssichere Ablage",
      "Transparente Status- und Freigabeprozesse",
    ],
    challenges: [
      {
        problem:
          "Der Auftraggeber erwartet die Daten in einer bestimmten Struktur. Aufbereitet wird sie jedes Mal von Hand aus mehreren Quellen.",
        solution:
          "Standardisierte Exporte liefern das angeforderte Format aus dem Projekt heraus; für wiederkehrende Übergaben lassen sich Schnittstellen einrichten.",
      },
      {
        problem:
          "Zum Prüfzeitpunkt fehlt ein Qualifikationsnachweis. Der Einsatz wird nicht anerkannt, obwohl die Leistung erbracht wurde.",
        solution:
          "Qualifikationen und Dokumente liegen mit ihrer Gültigkeit am Mitarbeiter. Was zum Prüfzeitpunkt nicht mehr gilt, fällt vorher auf – nicht danach.",
      },
      {
        problem:
          "Rückmeldungen und Freigaben laufen über Mail. Was bereits bestätigt ist und was noch offen, weiß keine der beiden Seiten sicher.",
        solution:
          "Leistungs- und Stundenrückmeldungen tragen ihren Status im System. Freigaben sind für Auftraggeber und Auftragnehmer gleichermaßen nachvollziehbar.",
      },
    ],
    steps: [
      {
        title: "Auftrag und Anforderungen erfassen",
        text: "Was der Auftraggeber an Nachweisen und Formaten erwartet, wird einmal hinterlegt und gilt für alle Einsätze darin.",
      },
      {
        title: "Nachweise aktuell halten",
        text: "Qualifikationen und Dokumente liegen zentral mit Gültigkeitsdatum, statt vor jeder Prüfung eingesammelt zu werden.",
      },
      {
        title: "Leistungen rückmelden",
        text: "Erbrachte Leistungen und Stunden gehen strukturiert zurück, mit nachvollziehbarem Freigabestatus.",
      },
      {
        title: "Abrechnen und ablegen",
        text: "Geprüfte Leistungen werden als X-Rechnung gestellt und revisionssicher abgelegt.",
      },
    ],
    faqs: [
      {
        question: "In welchen Formaten lassen sich Daten übergeben?",
        answer:
          "Über standardisierte Exporte aus dem Projekt, für Ausschreibung und Abrechnung unter anderem im GAEB-Format und als X-Rechnung. Für wiederkehrende Übergaben lassen sich zusätzlich Schnittstellen einrichten.",
      },
      {
        question: "Was passiert, wenn ein Nachweis abläuft?",
        answer:
          "Qualifikationen und Dokumente tragen ihr Gültigkeitsdatum. Die Einsatzplanung prüft es gegen den geplanten Tag, sodass ein abgelaufener Nachweis vor dem Einsatz auffällt und nicht bei der Prüfung.",
      },
      {
        question: "Wie werden Freigaben nachvollziehbar?",
        answer:
          "Rückmeldungen und Freigaben hängen am jeweiligen Vorgang und tragen ihren Status. Beide Seiten sehen denselben Stand, ohne ihn aus einem Mailverlauf rekonstruieren zu müssen.",
      },
      {
        question: "Unterstützt Gleistrix die X-Rechnung?",
        answer:
          "Ja. Geprüfte Leistungen und Stunden lassen sich ohne erneute Erfassung als X-Rechnung ausgeben und werden revisionssicher abgelegt.",
      },
    ],
  },
  {
    slug: "auftragsbasierte-dienstleister",
    crossLinks: [
      { text: "Vom geprüften Stundenzettel zur Rechnung führt", href: "/produkt/rechnungsstellung", label: "die Rechnungsstellung" },
      { text: "Die Übergabe an die Buchhaltung übernimmt", href: "/integrationen/lexoffice", label: "die lexoffice-Anbindung" },
      { text: "Wie Zeiten am Einsatz erfasst und freigegeben werden, zeigt", href: "/produkt/zeiterfassung-stundenzettel", label: "Zeiterfassung und Stundenzettel" },
    ],
    title: "Auftragsbasierte Dienstleister",
    tagline: "Vom Angebot bis zur Abrechnung",
    description:
      "Von der Anfrage bis zur Abrechnung: Angebot, Auftrag, Schichtplanung, Zeiterfassung, Stundenzettel und Rechnung in einer Kette.",
    metaDescription:
      "Software für auftragsbasierte Dienstleister: Angebot, Auftrag, Einsatzplanung, Zeiterfassung und Rechnung in einer Kette – ohne Übertragen zwischen Werkzeugen.",
    icon: Briefcase,
    group: "Service & Dienstleistung",
    image: "/Auftragsbasierter dienstleister.png",
    highlights: [
      {
        title: "Eine Kette, kein Bruch",
        text: "Jeder Schritt übernimmt die Daten des vorherigen – kein Übertragen zwischen Werkzeugen.",
      },
      {
        title: "Angebote schneller",
        text: "Wiederkehrende Leistungen sind hinterlegt und stehen beim nächsten Angebot bereit.",
      },
      {
        title: "Lohn ohne Umweg",
        text: "Freigegebene Stunden gehen direkt in Abrechnung und Lohnvorbereitung.",
      },
    ],
    bullets: [
      "Flexible Auftragsverwaltung",
      "Integrierte Angebotserstellung",
      "Einsatzplanung und -steuerung",
      "Automatisierte Lohnabrechnung",
      "Effiziente Rechnungsstellung",
    ],
    challenges: [
      {
        problem:
          "Das Angebot entsteht im Textprogramm, der Auftrag in einer Tabelle, die Stunden auf Papier. Dieselbe Angabe wird dreimal erfasst.",
        solution:
          "Jeder Schritt übernimmt die Daten des vorherigen. Aus dem Angebot wird der Auftrag, aus dem Einsatz die Stunden, aus den Stunden die Rechnung.",
      },
      {
        problem:
          "Leistungen, die in fast jedem Auftrag vorkommen, werden für jedes Angebot neu zusammengestellt und neu kalkuliert.",
        solution:
          "Wiederkehrende Leistungen sind hinterlegt und stehen beim nächsten Angebot bereit, statt jedes Mal rekonstruiert zu werden.",
      },
      {
        problem:
          "Für die Rechnung und für den Lohn werden dieselben Stunden zweimal aufbereitet – mit dem Risiko, dass beide Auswertungen auseinanderlaufen.",
        solution:
          "Freigegebene Stunden gehen aus derselben Erfassung in Abrechnung und Lohnvorbereitung. Es gibt nur einen Stand.",
      },
    ],
    steps: [
      {
        title: "Anfrage und Angebot",
        text: "Hinterlegte Leistungen machen aus einer Anfrage ein Angebot, ohne Positionen neu zusammenzusuchen.",
      },
      {
        title: "Auftrag und Einsatzplanung",
        text: "Aus dem angenommenen Angebot entsteht der Auftrag, aus dem Auftrag die Einsatzplanung.",
      },
      {
        title: "Zeiten erfassen und freigeben",
        text: "Das Team erfasst Zeiten am Einsatz, die Verwaltung prüft und gibt sie frei.",
      },
      {
        title: "Abrechnen und Lohn vorbereiten",
        text: "Freigegebene Stunden gehen ohne erneute Eingabe in Rechnungsstellung und Lohnvorbereitung.",
      },
    ],
    faqs: [
      {
        question: "Lassen sich wiederkehrende Leistungen hinterlegen?",
        answer:
          "Ja. Leistungen, die regelmäßig angeboten werden, sind hinterlegt und stehen bei der Angebotserstellung zur Auswahl. Das verkürzt vor allem den Weg von der Anfrage zum Angebot.",
      },
      {
        question: "Müssen Stunden für Rechnung und Lohn getrennt erfasst werden?",
        answer:
          "Nein. Beide greifen auf dieselbe freigegebene Erfassung zu, sodass Abrechnung und Lohnvorbereitung nicht auseinanderlaufen können.",
      },
      {
        question: "Wie hängen Angebot, Auftrag und Rechnung zusammen?",
        answer:
          "Als durchgehende Kette: Das Angebot wird zum Auftrag, der Auftrag trägt die Einsätze, die Einsätze liefern die Stunden, und aus den geprüften Stunden entsteht die Rechnung – ohne Übertragen zwischen Werkzeugen.",
      },
      {
        question: "Eignet sich das auch für viele kleine Aufträge?",
        answer:
          "Ja. Gerade dann zahlt sich die Kette aus, weil der Aufwand pro Auftrag vor allem in den Übergängen zwischen Angebot, Einsatz und Rechnung steckt und nicht in der Größe des einzelnen Auftrags.",
      },
    ],
  },
];

export const INDUSTRY_CATALOG: Catalog = {
  basePath: "/branchen",
  singular: "Branche",
  plural: "Branchen",
  menuNote: `${INDUSTRIES.length} Branchen · passend zu deinem Alltag`,
  scopeHeading: "Was Gleistrix für {title} übernimmt",
  ctaHeading: "Gleistrix für {title} sehen?",
  overviewHref: "/branchen",
  overviewLabel: "Alle Branchenlösungen ansehen",
  entries: INDUSTRIES,
};
