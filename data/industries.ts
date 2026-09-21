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
      { text: "Wer vor allem Sicherungspersonal disponiert, findet die Schwerpunkte unter", href: "/branchen/sicherungsunternehmen", label: "Software für Sicherungsunternehmen" },
      { text: "Wie Leistungsverzeichnisse eingelesen und geprüft werden, erklärt", href: "/integrationen/gaeb", label: "die GAEB-Schnittstelle" },
      { text: "Wie Unterlagen am Projekt abgelegt werden, beschreibt", href: "/produkt/dokumentenmanagement", label: "Dokumentenmanagement für Bahnprojekte" },
      { text: "Kosten und Marge je Projekt zeigen", href: "/produkt/reports-auswertungen", label: "Reports und Auswertungen" },
    ],
    title: "Gleisbausicherung & Bauüberwachung",
    // Abgrenzung zu /branchen/sicherungsunternehmen: dort steht die
    // Personaldisposition im Mittelpunkt (wer steht wann wo), hier das
    // Sicherungsprojekt als Ganzes – Leistungsverzeichnis, Nachunternehmer,
    // Nachweise und Wirtschaftlichkeit. Zwei Suchintentionen, zwei Seiten.
    h1: "Software für Gleisbausicherung und Bauüberwachung",
    tagline: "Sicherungsprojekte, Nachunternehmer und Nachweise",
    description:
      "Für Unternehmen, die Sicherungsleistungen und Bauüberwachung als Projekt abwickeln: vom eingelesenen Leistungsverzeichnis über Nachunternehmer und Dokumente bis zur Abrechnung und Marge je Projekt.",
    metaTitle: "Software für Gleisbausicherung & Bauüberwachung",
    metaDescription:
      "Sicherungsprojekte und Bauüberwachung projektbezogen steuern: GAEB-Leistungsverzeichnisse, Nachunternehmer mit Nachweisen, Dokumente und Abrechnung je Projekt.",
    icon: ShieldCheck,
    group: "Sicherung & Überwachung",
    image: "/media/branchen/gleisbausicherung.webp",
    highlights: [
      {
        title: "Aus der Praxis entstanden",
        text: "Die Plattform wurde entlang echter Sicherungsaufträge gebaut, nicht am Reißbrett.",
      },
      {
        title: "Projektakte statt Ordner",
        text: "Auftrag, Dokumente, Lieferscheine, Bestellscheine und Stundennachweise hängen am Projekt.",
      },
      {
        title: "Marge je Projekt",
        text: "Umsatz, Personal- und Nachunternehmerkosten stehen sich je Projekt gegenüber – auch während der Laufzeit.",
      },
    ],
    bullets: [
      "Projekte mit Auftraggeber, Baustelle, Auftrags- und SAP-Nummer",
      "GAEB-DA-XML-Import mit Schemaprüfung und Positionserkennung",
      "Nachunternehmer mit eigenem Portal, Nachweisen und Tagessätzen",
      "Bestellscheine mit digitaler Unterschrift",
      "Dokumente nach Typ: Lieferschein, Stundennachweis, Rechnung",
      "Projektkosten und Marge in der Finanzübersicht",
    ],
    headings: {
      challenges: "Wo Sicherungsprojekte Zeit und Marge verlieren",
      steps: "So wickelst du ein Sicherungsprojekt mit Gleistrix ab",
      faq: "Häufige Fragen zu Gleisbausicherung und Bauüberwachung",
    },
    challenges: [
      {
        problem:
          "Für jedes Angebot werden die Positionen des Leistungsverzeichnisses von Hand in eine Tabelle übertragen – mit Tippfehlern bei Mengen und Ordnungszahlen.",
        solution:
          "GAEB-Dateien werden importiert und gegen das Schema geprüft, die Positionen erkannt. Kalkuliert wird am Original statt an einer Abschrift.",
      },
      {
        problem:
          "Nachunternehmer schicken Nachweise per Mail. Ob die Unterlagen einer Firma vollständig und noch gültig sind, prüft niemand systematisch.",
        solution:
          "Nachunternehmer laden ihre Nachweise im Portal hoch. Gleistrix zeigt je Firma, ob ein Nachweis fehlt, bald abläuft oder abgelaufen ist.",
      },
      {
        problem:
          "Ob ein Sicherungsprojekt Geld verdient hat, zeigt sich erst nach der letzten Rechnung – zum Gegensteuern zu spät.",
        solution:
          "Personal-, Nachunternehmer- und weitere Kosten laufen je Projekt zusammen und stehen dem Umsatz gegenüber, solange das Projekt noch läuft.",
      },
    ],
    details: [
      {
        heading: "Gleisbausicherung als Projektgeschäft",
        paragraphs: [
          "Ein Sicherungsauftrag besteht selten nur aus Schichten. Dazu gehören das Leistungsverzeichnis des Auftraggebers, eingesetzte Technik wie automatische Warnsysteme, Nachunternehmer, Bestellscheine, Lieferscheine und am Ende eine Abrechnung, die zu all dem passt.",
          "Gleistrix legt diese Bestandteile an ein Projekt: Auftraggeber, Baustelle, Auftrags- und SAP-Nummer, Ansprechpartner und Laufzeit werden einmal erfasst. Ob ATWS im Einsatz ist, wie viele Anlagen und welche Meterlänge, steht ebenfalls am Projekt.",
        ],
      },
      {
        heading: "Bauüberwachung braucht Unterlagen am Vorgang",
        paragraphs: [
          "Wer Bauüberwachung leistet, muss jederzeit zeigen können, was vereinbart, geliefert und geleistet wurde. Unterlagen, die in Postfächern und Netzlaufwerken verteilt liegen, kosten genau in diesem Moment Zeit.",
          "In Gleistrix hängen Dokumente am Projekt und tragen einen Typ – etwa Lieferschein, Stundennachweis, Bestellschein oder Rechnung. So findest du sie über das Projekt statt über den Dateinamen.",
        ],
      },
      {
        heading: "Nachunternehmer steuern ohne Mailverkehr",
        paragraphs: [
          "Nachunternehmer bekommen einen eigenen Portalzugang. Dort sehen sie ihre Projekte und Einsätze, unterschreiben Bestellscheine digital, laden Nachweise hoch und reichen Rechnungen ein.",
          "Für jede Firma legst du fest, welche Nachweise sie vorlegen muss und in welchem Rhythmus sie zu erneuern sind. Tagessätze je Funktion – etwa für SIPO – sind am Nachunternehmer hinterlegt und bilden die Grundlage, um eingereichte Rechnungen zu prüfen.",
        ],
      },
    ],
    steps: [
      {
        title: "Leistungsverzeichnis einlesen",
        text: "Die GAEB-Datei des Auftraggebers wird importiert, geprüft und in Positionen zerlegt – ohne Abtippen.",
      },
      {
        title: "Projekt und Beteiligte anlegen",
        text: "Projekt mit Baustelle und Laufzeit anlegen, Nachunternehmer einladen und Bestellscheine zur Unterschrift bereitstellen.",
      },
      {
        title: "Einsatz begleiten",
        text: "Personal und Technik auf der Einsatztafel planen, Zeiten erfassen und Unterlagen direkt am Projekt ablegen.",
      },
      {
        title: "Abrechnen und auswerten",
        text: "Leistungen freigeben, Nachunternehmerrechnungen prüfen und die Marge des Projekts in der Finanzübersicht verfolgen.",
      },
    ],
    faqs: [
      {
        question: "Für wen ist die Software für Gleisbausicherung und Bauüberwachung gedacht?",
        answer:
          "Für Unternehmen, die Sicherungsleistungen und Bauüberwachung projektbezogen erbringen und dabei mit Leistungsverzeichnissen, Nachunternehmern und Projektabrechnung arbeiten. Wer vor allem Sicherungspersonal disponiert, findet die passenden Funktionen auf der Seite Software für Sicherungsunternehmen.",
      },
      {
        question: "Welche GAEB-Dateien verarbeitet Gleistrix?",
        answer:
          "GAEB-DA-XML-Dateien zu Leistungsverzeichnis, Ausschreibung, Angebot und Rechnung. Beim Import wird die Datei gegen das Schema geprüft, die Positionen werden erkannt und jeder Import bleibt in der Historie nachvollziehbar.",
      },
      {
        question: "Wie werden Nachunternehmer eingebunden?",
        answer:
          "Über einen eigenen Portalzugang. Nachunternehmer sehen dort ihre Einsätze, unterschreiben Bestellscheine digital, laden Nachweise hoch und reichen Rechnungen ein. Fehlende oder ablaufende Nachweise zeigt Gleistrix je Firma an.",
      },
      {
        question: "Wo sehe ich, ob ein Projekt wirtschaftlich läuft?",
        answer:
          "In der Finanzübersicht. Dort stehen je Projekt Soll- und Ist-Umsatz, Personal-, Nachunternehmer- und weitere Kosten sowie Ergebnis und Marge. Die Ansicht ist der Geschäftsführung vorbehalten.",
      },
    ],
  },
  {
    slug: "sicherungsunternehmen",
    crossLinks: [
      { text: "Wie SiPo-Einsätze nachvollziehbar dokumentiert werden, erklärt der Fachartikel", href: "/blog/sipo-einsaetze-rechtssicher-dokumentieren", label: "SiPo-Einsätze sauber dokumentieren" },
      { text: "Die Einsatztafel im Detail zeigt", href: "/produkt/kalender-einsatzuebersicht", label: "Plantafel und Einsatzübersicht" },
      { text: "Wie Zeiten, Funktionen und Zuschläge erfasst werden, steht unter", href: "/produkt/zeiterfassung-stundenzettel", label: "Zeiterfassung und Stundenzettel" },
      { text: "Für Sicherungsprojekte mit Leistungsverzeichnis und Nachunternehmern passt", href: "/branchen/gleisbausicherung-bauueberwachung", label: "Software für Gleisbausicherung und Bauüberwachung" },
    ],
    title: "Sicherungsunternehmen",
    h1: "Software für Sicherungsunternehmen: SiPo-Einsätze digital planen",
    tagline: "SiPo- und SaKra-Einsätze digital disponieren",
    description:
      "Gleistrix plant Sicherungsposten, Sicherungsaufsichtskräfte und Bahnübergangsposten auf einer Einsatztafel, erkennt Doppelbelegungen und Abwesenheiten beim Zuweisen und führt die geleisteten Stunden bis in die Abrechnung.",
    // Übernimmt das Keyword der weitergeleiteten Landingpage
    // /software-sicherungsunternehmen und ergänzt die SiPo-Planung, nach der
    // Disponenten tatsächlich suchen.
    metaTitle: "Software für Sicherungsunternehmen & SiPo-Planung",
    metaDescription:
      "SiPo- und SaKra-Einsätze digital disponieren. Gleistrix verbindet Qualifikationen, Schichtplanung, Nachweise und Abrechnung in einer Plattform.",
    icon: Network,
    group: "Sicherung & Überwachung",
    image: "/media/branchen/sicherungsunternehmen.webp",
    highlights: [
      {
        title: "Nach Funktion eingesetzt",
        text: "Jeder Mitarbeiter trägt seine Funktionen – SIPO, Sakra, BüP, HiBa, SAS oder HFE. Jeder Zeiteintrag hält fest, in welcher Rolle er eingesetzt war.",
      },
      {
        title: "Konflikte vor dem Einsatz",
        text: "Doppelbelegungen, Urlaub, Krankmeldungen und Feiertage meldet die Einsatztafel beim Zuweisen – nicht erst am Einsatztag.",
      },
      {
        title: "Stunden bis zur Rechnung",
        text: "Arbeitszeit, Fahrtzeit sowie Nacht- und Sonntagszuschläge laufen ohne Abtippen in Stundennachweis und Abrechnung.",
      },
    ],
    bullets: [
      "Funktionen je Mitarbeiter: SIPO, Sakra, BüP, HiBa, SAS, HFE, Bahnerder",
      "ElBa-Kennung des Sicherungspersonals am Mitarbeiter",
      "Einsatztafel mit Drag-and-drop und Konfliktprüfung",
      "Abwesenheiten: Urlaub, Arbeitsunfähigkeit, Freistellung, Fortbildung",
      "Zeiterfassung mit Funktion, Fahrtzeit und Zuschlägen",
      "Monatlicher Stundennachweis per E-Mail an Mitarbeiter und Lohnbüro",
      "Subunternehmen mit Portal, Nachweisen und Tagessätzen",
      "ATWS-Einsatz, Anzahl und Meterlänge am Projekt",
    ],
    headings: {
      challenges: "Typische Engpässe bei der SiPo-Disposition",
      steps: "So funktioniert die Einsatzplanung für Sicherungsunternehmen mit Gleistrix",
      faq: "Häufige Fragen zur Software für Sicherungsunternehmen",
    },
    challenges: [
      {
        problem:
          "Der Wochenplan steht in einer Tabelle, Urlaube im Kalender, Krankmeldungen im Postfach. Wer kurzfristig ausfällt, fällt erst auf, wenn die Lücke schon da ist.",
        solution:
          "Einsätze, Abwesenheiten und Feiertage liegen auf derselben Einsatztafel. Beim Zuweisen meldet Gleistrix, wenn jemand bereits eingeteilt, im Urlaub oder krankgemeldet ist.",
      },
      {
        problem:
          "Ein Sicherungsposten steht für dieselbe Nacht an zwei Baustellen im Plan – aufgefallen ist es niemandem, weil die Pläne in getrennten Dateien lagen.",
        solution:
          "Alle Projekte greifen auf denselben Personalbestand zu. Doppelbelegungen erkennt die Einsatztafel projektübergreifend.",
      },
      {
        problem:
          "Am Monatsende werden Stundenzettel abgetippt, Zuschläge nachgerechnet und Stundennachweise einzeln verschickt.",
        solution:
          "Zeiteinträge tragen Funktion, Fahrtzeit und Zuschläge. Der Stundennachweis geht monatlich per E-Mail an Mitarbeiter und Lohnbüro, die geprüften Stunden gehen in die Abrechnung.",
      },
    ],
    details: [
      {
        heading: "Warum die Einsatzplanung im Sicherungsunternehmen so aufwendig ist",
        paragraphs: [
          "Sicherungsleistungen entstehen kurzfristig: Sperrpausen verschieben sich, Schichten liegen nachts und am Wochenende, und jede Baustelle braucht eine bestimmte Besetzung – Sicherungsposten, eine Sicherungsaufsicht, Bahnübergangsposten oder eine Helferin für die Handbedienung.",
          "Solange dieser Plan in Tabellen, Messenger-Gruppen und Telefonaten entsteht, hängt er an der Person, die ihn im Kopf hat. Ausfälle, Doppelbelegungen und falsch zugeordnete Funktionen fallen dann oft erst an der Strecke auf.",
        ],
      },
      {
        heading: "Mitarbeiter und Funktionen verwalten",
        paragraphs: [
          "In der Mitarbeiterverwaltung stehen Kontaktdaten, Status und die Funktionen jedes Mitarbeiters: SIPO, Sakra, BüP, HiBa, SAS, HFE, Bahnerder oder Monteur/Bediener. Ein Mitarbeiter kann mehrere Funktionen tragen. Auch die Kennung des elektronischen Befähigungsausweises ElBa, der seit 2025 für Sicherungspersonal verbindlich ist, wird am Mitarbeiter geführt.",
          "Urlaub, Arbeitsunfähigkeit, unbezahlte Freistellung und Fortbildungen werden als Abwesenheit mit Zeitraum erfasst. Sie erscheinen direkt in der Einsatztafel, sodass niemand verplant wird, der nicht verfügbar ist.",
        ],
      },
      {
        heading: "Einsätze und Schichten organisieren",
        paragraphs: [
          "Auf der Einsatztafel ziehst du Mitarbeiter per Drag-and-drop in die Einsätze der Projekte. Alle Projekte greifen auf denselben Personalbestand zu – deshalb erkennt Gleistrix eine Doppelbelegung auch dann, wenn die beiden Einsätze in unterschiedlichen Projekten liegen.",
          "Konflikte mit Urlaub, Krankmeldung oder Feiertag zeigt die Einsatztafel beim Zuweisen an. Die Entscheidung bleibt bei der Disposition; sie trifft sie nur nicht mehr im Blindflug.",
        ],
      },
      {
        heading: "Einsatzinformationen bereitstellen",
        paragraphs: [
          "Der aktuelle Plan steht in der Einsatztafel für alle berechtigten Nutzer bereit – es gibt keine zweite Fassung, die per Mail verteilt werden müsste. Besprechungen und Termine lassen sich über die Microsoft-365-Anbindung in Outlook führen.",
          "Subunternehmen sehen ihre Einsätze im eigenen Portal und unterschreiben Bestellscheine dort digital. Rückfragen, welcher Stand gilt, entfallen damit auf beiden Seiten.",
        ],
      },
      {
        heading: "Arbeitszeiten und Leistungsnachweise",
        paragraphs: [
          "Zu jedem Einsatz werden Arbeitszeit, Fahrtzeit und die Funktion erfasst, in der der Mitarbeiter eingesetzt war. Nacht- und Sonntagszuschläge berechnet Gleistrix aus den Zeiten, statt sie am Monatsende von Hand nachzurechnen.",
          "Am Monatsende erhält jeder Mitarbeiter seinen Stundennachweis per E-Mail; weitere Empfänger wie das Lohnbüro lassen sich je Mitarbeiter hinterlegen. Die Einträge bleiben dem Projekt zugeordnet und sind darüber später auffindbar.",
        ],
      },
      {
        heading: "Von den Stunden in die Abrechnung",
        paragraphs: [
          "Geprüfte Stunden gehen in die Abrechnung des Projekts. Freigaben sind vor der Abrechnung sichtbar, die Abrechnung lässt sich als PDF ausgeben.",
          "Rechnungen von Subunternehmen gehen im Portal ein und werden in Gleistrix geprüft und freigegeben. Buchungsdaten und Belege lassen sich über die DATEV-Anbindung an die Steuerberatung übergeben.",
        ],
      },
    ],
    steps: [
      {
        title: "Auftrag anlegen",
        text: "Auftraggeber, Baustelle, Zeitraum und Ansprechpartner einmal erfassen. Eine Leistungsanfrage aus dem DB-Lieferantenportal kann das Formular auf Wunsch per KI vorbefüllen.",
      },
      {
        title: "Posten einteilen",
        text: "SiPo, Sakra und BüP per Drag-and-drop auf die Einsatztafel ziehen. Doppelbelegungen, Urlaub und Krankmeldungen meldet das System sofort.",
      },
      {
        title: "Stunden erfassen",
        text: "Arbeitszeit, Fahrtzeit und Funktion je Einsatz festhalten. Nacht- und Sonntagszuschläge rechnet Gleistrix mit.",
      },
      {
        title: "Prüfen und abrechnen",
        text: "Freigegebene Stunden gehen in die Projektabrechnung, der Stundennachweis per E-Mail an Mitarbeiter und Lohnbüro.",
      },
    ],
    faqs: [
      {
        question: "Welche Funktionen lassen sich für Sicherungspersonal hinterlegen?",
        answer:
          "Gleistrix kennt die im Bahnumfeld üblichen Funktionen wie SIPO, Sakra, BüP, HiBa, SAS, HFE und Bahnerder. Ein Mitarbeiter kann mehrere Funktionen tragen; beim Zeiteintrag wird festgehalten, in welcher Funktion er eingesetzt war.",
      },
      {
        question: "Erkennt Gleistrix Doppelbelegungen und Abwesenheiten?",
        answer:
          "Ja. Die Einsatztafel prüft beim Zuweisen, ob der Mitarbeiter zur selben Zeit bereits eingeteilt ist, Urlaub hat, krankgemeldet ist oder ein Feiertag vorliegt, und zeigt den Konflikt an – auch über Projektgrenzen hinweg.",
      },
      {
        question: "Wie kommen die Stunden in die Abrechnung?",
        answer:
          "Zeiteinträge hängen am Projekt. Nach der Freigabe stehen sie der Projektabrechnung zur Verfügung. Der Stundennachweis wird monatlich per E-Mail an den Mitarbeiter und an weitere Empfänger wie das Lohnbüro verschickt.",
      },
      {
        question: "Lassen sich Subunternehmen einbinden?",
        answer:
          "Ja. Subunternehmen bekommen einen eigenen Portalzugang, sehen dort ihre Einsätze, laden Nachweise hoch, reichen Rechnungen ein und unterschreiben Bestellscheine digital. Fehlende oder ablaufende Nachweise zeigt Gleistrix je Firma an.",
      },
      {
        question: "Kann Gleistrix Leistungsanfragen der Deutschen Bahn übernehmen?",
        answer:
          "Ja. Eine Leistungsanfrage aus dem DB-Lieferantenportal lässt sich als Link oder PDF übergeben. Gleistrix liest Auftraggeber, Baustelle, Auftrags- und SAP-Nummer, Ansprechpartner und Zeitraum aus und füllt damit die Projektanlage vor; geprüft und gespeichert wird von Hand.",
      },
    ],
  },
  {
    slug: "gleisbauunternehmen",
    crossLinks: [
      { text: "Fahrzeuge und Technik auf der Einsatztafel behandelt", href: "/produkt/fahrzeug-technik", label: "Fahrzeuge und Technik disponieren" },
      { text: "Material, Lieferscheine und Prüftermine verwaltet", href: "/produkt/lagerverwaltung", label: "die Lagerverwaltung" },
      { text: "Leistungsverzeichnisse einlesen und prüfen erklärt", href: "/integrationen/gaeb", label: "die GAEB-Schnittstelle" },
      { text: "Kosten und Marge je Baustelle zeigen", href: "/produkt/reports-auswertungen", label: "Reports und Auswertungen" },
    ],
    title: "Gleisbauunternehmen",
    h1: "Gleisbau-Software für Baustellen, Ressourcen und Abrechnung",
    tagline: "Trupps, Technik, Material und Abrechnung",
    description:
      "Gleistrix bündelt Trupps, Fahrzeuge, Technik und Material einer Gleisbaustelle in einem Projekt – vom eingelesenen Leistungsverzeichnis bis zur Abrechnung und zur Marge je Baustelle.",
    metaTitle: "Gleisbau-Software für Planung & Abrechnung",
    // Sperrpausen stehen bewusst nicht in der Beschreibung: Gleistrix plant
    // Einsätze im Zeitfenster einer Sperrpause, führt Sperrpausen aber nicht
    // als eigenes Objekt. Die Beschreibung verspricht nur, was es gibt.
    metaDescription:
      "Gleisbauprojekte digital steuern: Personal, Fahrzeuge, Technik, Material, Leistungsnachweise und Abrechnung in einer zentralen Software verwalten.",
    icon: HardHat,
    group: "Bau & Infrastruktur",
    image: "/media/branchen/gleisbauunternehmen.webp",
    highlights: [
      {
        title: "Eine Planung für Trupp und Technik",
        text: "Mitarbeiter und Fahrzeuge werden auf derselben Einsatztafel disponiert. Doppelbelegungen meldet Gleistrix beim Zuweisen.",
      },
      {
        title: "Material, das ankommt",
        text: "Bestände, Mindestmengen, Lieferscheine und Rückgaben laufen im Lager – auch mobil über die Lager-App.",
      },
      {
        title: "Kosten je Baustelle",
        text: "Personal-, Nachunternehmer- und weitere Kosten stehen dem Umsatz je Projekt gegenüber.",
      },
    ],
    bullets: [
      "Projekte mit Baustelle, Auftrags- und SAP-Nummer und Laufzeit",
      "Einsatztafel für Trupps und Fahrzeuge mit Konfliktprüfung",
      "Fahrzeuge mit Kilometerstand, Schäden, Status und Tageskosten",
      "Lager mit Beständen, Lieferscheinen, Wartungs- und TÜV-Terminen",
      "GAEB-DA-XML-Import mit Positionserkennung",
      "Projektabrechnung mit Freigaben und PDF-Ausgabe",
    ],
    headings: {
      challenges: "Wo Gleisbaustellen im Alltag hängen bleiben",
      steps: "So wickelst du eine Gleisbaustelle mit Gleistrix ab",
      faq: "Häufige Fragen zur Gleisbau-Software",
    },
    challenges: [
      {
        problem:
          "Trupp und Zweiwegebagger sind für dieselbe Schicht auf zwei Baustellen eingeplant – weil Personal- und Geräteplan getrennt geführt werden.",
        solution:
          "Mitarbeiter und Fahrzeuge liegen auf derselben Einsatztafel. Ist ein Fahrzeug oder ein Mitarbeiter bereits verplant, meldet Gleistrix den Konflikt beim Zuweisen.",
      },
      {
        problem:
          "Material fehlt auf der Baustelle, weil niemand den Bestand kannte oder die Rückgabe vom letzten Projekt nie gebucht wurde.",
        solution:
          "Wareneingang, Ausgabe und Rückgabe werden im Lager gebucht – auch mobil per QR-Code. Mindestmengen und offene Rückgaben meldet Gleistrix.",
      },
      {
        problem:
          "Ob die Baustelle gedeckt hat, zeigt sich erst mit der Schlussrechnung.",
        solution:
          "Personal-, Nachunternehmer- und weitere Kosten laufen je Projekt zusammen und stehen dem Umsatz gegenüber, solange die Baustelle noch läuft.",
      },
    ],
    details: [
      {
        heading: "Gleisbauprojekte vom Leistungsverzeichnis aus aufbauen",
        paragraphs: [
          "Viele Gleisbauaufträge beginnen mit einer GAEB-Datei. Gleistrix liest GAEB-DA-XML ein, prüft sie gegen das Schema und erkennt die Positionen des Leistungsverzeichnisses. Jeder Import bleibt mit Version und Datum nachvollziehbar.",
          "Auf Wunsch wertet ein KI-Agent die Positionen aus und schlägt vor, welche Mitarbeiter, Fahrzeuge und Lagerartikel das Projekt voraussichtlich braucht. Das ersetzt keine Kalkulation, verkürzt aber den Weg vom LV zur ersten Planung.",
        ],
      },
      {
        heading: "Trupps, Fahrzeuge und Technik gemeinsam disponieren",
        paragraphs: [
          "Auf der Einsatztafel liegen Mitarbeiter und Fahrzeuge nebeneinander. Wer einen Trupp für eine Nacht- oder Wochenendschicht zusammenstellt, sieht beim Zuweisen, ob jemand schon verplant, im Urlaub oder krankgemeldet ist – und ob das Fahrzeug frei ist.",
          "Am Fahrzeug stehen Kennzeichen, Kilometerstand, Schäden, Status und Tageskosten. Wird ein Fahrzeug einem Mitarbeiter oder Projekt direkt übergeben, ist das dokumentiert.",
        ],
      },
      {
        heading: "Material und Prüftermine im Lager",
        paragraphs: [
          "Im Lager werden Artikel mit Bestand und Mindestmenge geführt, Wareneingänge und Lieferscheine erfasst und Ausgaben an Baustellen gebucht. Die Lager-App funktioniert mobil mit QR-Code, damit gebucht wird, wo das Material bewegt wird.",
          "Für Geräte und Technik lassen sich Wartungen wie TÜV, Prüfung, Kalibrierung oder Inspektion mit Fälligkeitsdatum planen und nach der Durchführung mit Ergebnis dokumentieren.",
        ],
      },
      {
        heading: "Abrechnung und Wirtschaftlichkeit je Baustelle",
        paragraphs: [
          "Erfasste Stunden werden geprüft und freigegeben und gehen dann in die Abrechnung des Projekts. Nachunternehmer reichen ihre Rechnungen im Portal ein, wo sie geprüft und freigegeben werden.",
          "In der Finanzübersicht stehen je Projekt Soll- und Ist-Umsatz, Personal-, Nachunternehmer- und weitere Kosten sowie Ergebnis und Marge. So zeigt sich während der Bauzeit, ob eine Baustelle trägt.",
        ],
      },
    ],
    steps: [
      {
        title: "Leistungsverzeichnis einlesen",
        text: "Die GAEB-Datei wird importiert und geprüft, die Positionen stehen im Projekt statt in einer Abschrift.",
      },
      {
        title: "Baustelle planen",
        text: "Trupps und Fahrzeuge für die Schichten der Baustelle einplanen – Konflikte meldet die Einsatztafel sofort.",
      },
      {
        title: "Leistungen erfassen",
        text: "Stunden, Material und Lieferscheine laufen während der Bauzeit am Projekt zusammen.",
      },
      {
        title: "Abrechnen und auswerten",
        text: "Freigegebene Leistungen gehen in die Abrechnung, die Finanzübersicht zeigt Kosten und Marge je Baustelle.",
      },
    ],
    faqs: [
      {
        question: "Kann Gleistrix Leistungsverzeichnisse im GAEB-Format einlesen?",
        answer:
          "Ja. GAEB-DA-XML-Dateien werden importiert, gegen das Schema geprüft und in Positionen zerlegt. Jeder Import bleibt mit Version in der Historie nachvollziehbar.",
      },
      {
        question: "Lassen sich Fahrzeuge und Zweiwegetechnik mitplanen?",
        answer:
          "Ja. Fahrzeuge werden auf der Einsatztafel wie Personal disponiert und Projekten oder Mitarbeitern zugeordnet. Ist ein Fahrzeug bereits verplant, meldet Gleistrix den Konflikt beim Zuweisen.",
      },
      {
        question: "Wie wird Material für die Baustelle verwaltet?",
        answer:
          "Über die Lagerverwaltung mit Beständen, Mindestmengen, Wareneingang, Lieferscheinen und Inventur. Ausgaben und Rückgaben lassen sich mobil per QR-Code buchen, an offene Rückgaben erinnert Gleistrix.",
      },
      {
        question: "Sieht die Geschäftsführung, ob eine Baustelle wirtschaftlich läuft?",
        answer:
          "Ja. Die Finanzübersicht stellt je Projekt Soll- und Ist-Umsatz den Personal-, Nachunternehmer- und weiteren Kosten gegenüber und weist Ergebnis und Marge aus.",
      },
    ],
  },
  {
    slug: "subunternehmen-db",
    crossLinks: [
      { text: "Welche Nachweise und Formate erwartet werden, steht unter", href: "/integrationen/deutsche-bahn", label: "Anforderungen der Deutschen Bahn" },
      { text: "Den Weg von geprüften Stunden zur Rechnung beschreibt", href: "/produkt/rechnungsstellung", label: "Rechnungsstellung für Bahndienstleister" },
      { text: "Funktionen und Abwesenheiten des Personals verwaltet", href: "/produkt/mitarbeiterverwaltung", label: "die Mitarbeiterverwaltung" },
    ],
    title: "Subunternehmen der DB",
    h1: "Software für Subunternehmen der Deutschen Bahn",
    tagline: "Anforderungen erfüllen, Daten sauber liefern",
    description:
      "Daten sauber liefern und Anforderungen erfüllen – von der Leistungsanfrage aus dem DB-Lieferantenportal über Stundennachweise bis zur Abrechnung je Projekt.",
    metaDescription:
      "Software für Subunternehmen der DB: Leistungsanfragen übernehmen, Einsätze planen, Stunden nachweisen und je Projekt abrechnen – Dokumente am Vorgang.",
    icon: Building2,
    group: "Bau & Infrastruktur",
    image: "/media/branchen/subunternehmen.webp",
    highlights: [
      {
        title: "Leistungsanfrage übernommen",
        text: "Eine Anfrage aus dem DB-Lieferantenportal füllt die Projektanlage auf Wunsch per KI vor.",
      },
      {
        title: "Nachweise am Vorgang",
        text: "Stundennachweise, Lieferscheine und Dokumente hängen am Projekt und sind darüber auffindbar.",
      },
      {
        title: "Freigaben nachvollziehbar",
        text: "Stunden werden vor der Abrechnung geprüft und freigegeben – offene Freigaben sind sichtbar.",
      },
    ],
    bullets: [
      "Projektanlage aus DB-Leistungsanfragen (Link oder PDF)",
      "Auftrags- und SAP-Nummer am Projekt",
      "Funktionen je Mitarbeiter, etwa SIPO, Sakra oder BüP",
      "Monatliche Stundennachweise per E-Mail",
      "Freigaben vor der Abrechnung, Ausgabe als PDF",
      "Buchungsdaten und Belege über die DATEV-Anbindung",
    ],
    challenges: [
      {
        problem:
          "Die Leistungsanfrage kommt aus dem DB-Lieferantenportal. Auftragsnummer, SAP-Nummer, Baustelle und Ansprechpartner werden von Hand ins eigene System übertragen.",
        solution:
          "Die Anfrage wird als Link oder PDF übergeben, Gleistrix liest die Angaben aus und füllt die Projektanlage vor. Geprüft und gespeichert wird von Hand.",
      },
      {
        problem:
          "Am Monatsende fragt der Auftraggeber nach den Stunden eines Einsatzes. Die Zettel liegen im Fahrzeug, die Zuordnung zum Auftrag fehlt.",
        solution:
          "Zeiteinträge hängen am Projekt mit Funktion und Fahrtzeit. Der Stundennachweis entsteht daraus und geht monatlich per E-Mail an Mitarbeiter und Lohnbüro.",
      },
      {
        problem:
          "Welche Stunden bereits geprüft sind und welche noch offen, steht in keiner Liste – abgerechnet wird trotzdem.",
        solution:
          "Stunden werden vor der Abrechnung freigegeben. Offene Freigaben sind sichtbar, bevor die Abrechnung als PDF ausgegeben wird.",
      },
    ],
    steps: [
      {
        title: "Leistungsanfrage übernehmen",
        text: "Die Anfrage aus dem DB-Lieferantenportal wird eingelesen und füllt Projektname, Auftrags- und SAP-Nummer, Baustelle und Zeitraum vor.",
      },
      {
        title: "Einsatz planen",
        text: "Personal nach Funktion auf der Einsatztafel einteilen – Doppelbelegungen und Abwesenheiten meldet das System.",
      },
      {
        title: "Stunden nachweisen",
        text: "Zeiten mit Funktion und Fahrtzeit am Projekt erfassen; der Stundennachweis geht monatlich per E-Mail raus.",
      },
      {
        title: "Freigeben und abrechnen",
        text: "Geprüfte Stunden freigeben, die Abrechnung als PDF ausgeben und Buchungsdaten über DATEV übergeben.",
      },
    ],
    faqs: [
      {
        question: "Kann eine Leistungsanfrage aus dem DB-Lieferantenportal übernommen werden?",
        answer:
          "Ja. Die Anfrage lässt sich als Link oder als PDF übergeben. Gleistrix liest Projektname, Auftraggeber, Baustelle, Auftrags- und SAP-Nummer, Ansprechpartner und Zeitraum aus und füllt damit die Projektanlage vor. Ist die Seite hinter einem Login, kann der Text auch eingefügt werden.",
      },
      {
        question: "Wie entstehen Stundennachweise für den Auftraggeber?",
        answer:
          "Aus den Zeiteinträgen am Projekt. Sie tragen Funktion, Arbeitszeit und Fahrtzeit; Nacht- und Sonntagszuschläge werden berechnet. Der monatliche Stundennachweis geht per E-Mail an den Mitarbeiter und weitere hinterlegte Empfänger.",
      },
      {
        question: "Wie werden Freigaben nachvollziehbar?",
        answer:
          "Stunden werden vor der Abrechnung geprüft und freigegeben. Offene Freigaben sind in der Abrechnung sichtbar, sodass nichts abgerechnet wird, was noch nicht bestätigt ist.",
      },
      {
        question: "In welchem Format wird abgerechnet?",
        answer:
          "Die Abrechnung eines Projekts lässt sich als PDF ausgeben. Buchungsdaten und Belege können über die DATEV-Anbindung an die Steuerberatung übergeben werden.",
      },
    ],
  },
  {
    slug: "auftragsbasierte-dienstleister",
    crossLinks: [
      { text: "Vom geprüften Stundenzettel zur Rechnung führt", href: "/produkt/rechnungsstellung", label: "die Rechnungsstellung" },
      { text: "Die Übergabe an die Steuerberatung übernimmt", href: "/integrationen/datev", label: "die DATEV-Anbindung" },
      { text: "Wie Zeiten am Einsatz erfasst und freigegeben werden, zeigt", href: "/produkt/zeiterfassung-stundenzettel", label: "Zeiterfassung und Stundenzettel" },
    ],
    title: "Auftragsbasierte Dienstleister",
    h1: "Software für auftragsbasierte Bahndienstleister",
    metaTitle: "Software für auftragsbasierte Bahndienstleister",
    tagline: "Vom Auftrag bis zur Abrechnung",
    description:
      "Von der Anfrage bis zur Abrechnung: Auftrag, Leistungen, Einsatzplanung, Zeiterfassung, Stundennachweis und Abrechnung in einer Kette.",
    metaDescription:
      "Software für auftragsbasierte Dienstleister: Auftrag, Leistungen, Einsatzplanung, Zeiterfassung und Abrechnung in einer Kette – ohne Übertragen zwischen Werkzeugen.",
    icon: Briefcase,
    group: "Service & Dienstleistung",
    image: "/media/branchen/dienstleister.webp",
    highlights: [
      {
        title: "Eine Kette, kein Bruch",
        text: "Jeder Schritt übernimmt die Daten des vorherigen – kein Übertragen zwischen Werkzeugen.",
      },
      {
        title: "Leistungen am Auftrag",
        text: "Positionen mit Menge, Einheit und Preis stehen am Projekt – eingepflegt oder aus einer GAEB-Datei importiert.",
      },
      {
        title: "Lohn ohne Umweg",
        text: "Der monatliche Stundennachweis geht per E-Mail an Mitarbeiter und Lohnbüro – aus derselben Erfassung wie die Abrechnung.",
      },
    ],
    bullets: [
      "Aufträge mit Leistungen, Positionen und Preisen",
      "Leistungsverzeichnisse per GAEB-Import",
      "Einsatzplanung mit Konfliktprüfung",
      "Stundennachweise für die Lohnabrechnung",
      "Abrechnung aus freigegebenen Stunden",
    ],
    challenges: [
      {
        problem:
          "Der Auftrag steht in einer Tabelle, die Einsätze im Kalender, die Stunden auf Papier. Dieselbe Angabe wird dreimal erfasst.",
        solution:
          "Jeder Schritt übernimmt die Daten des vorherigen. Aus dem Auftrag wird die Einsatzplanung, aus dem Einsatz die Stunden, aus den Stunden die Abrechnung.",
      },
      {
        problem:
          "Die Positionen des Auftraggebers liegen als Datei im Postfach und werden für die Abrechnung von Hand abgeglichen.",
        solution:
          "Leistungen und Positionen stehen am Projekt – aus einer GAEB-Datei importiert oder eingepflegt – und bilden die Grundlage für Soll-Umsatz und Abrechnung.",
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
        title: "Auftrag anlegen",
        text: "Projekt mit Leistungen und Positionen anlegen – eingepflegt, aus einer GAEB-Datei oder aus einer Leistungsanfrage übernommen.",
      },
      {
        title: "Einsätze planen",
        text: "Personal und Fahrzeuge auf der Einsatztafel einteilen; Konflikte meldet das System beim Zuweisen.",
      },
      {
        title: "Zeiten erfassen und freigeben",
        text: "Das Team erfasst Zeiten am Einsatz, die Verwaltung prüft und gibt sie frei.",
      },
      {
        title: "Abrechnen und Lohn vorbereiten",
        text: "Freigegebene Stunden gehen ohne erneute Eingabe in die Abrechnung, der Stundennachweis an das Lohnbüro.",
      },
    ],
    faqs: [
      {
        question: "Wie kommen Leistungen und Positionen ins Projekt?",
        answer:
          "Sie lassen sich am Projekt einpflegen oder aus einer GAEB-Datei importieren. Jede Position trägt Nummer, Bezeichnung, Menge, Einheit und Preis und fließt in den Soll-Umsatz des Projekts ein.",
      },
      {
        question: "Müssen Stunden für Rechnung und Lohn getrennt erfasst werden?",
        answer:
          "Nein. Beide greifen auf dieselbe freigegebene Erfassung zu, sodass Abrechnung und Lohnvorbereitung nicht auseinanderlaufen können.",
      },
      {
        question: "Wie hängen Auftrag, Einsatz und Abrechnung zusammen?",
        answer:
          "Als durchgehende Kette: Der Auftrag trägt die Einsätze, die Einsätze liefern die Stunden, und aus den geprüften Stunden entsteht die Abrechnung – ohne Übertragen zwischen Werkzeugen.",
      },
      {
        question: "Eignet sich das auch für viele kleine Aufträge?",
        answer:
          "Ja. Gerade dann zahlt sich die Kette aus, weil der Aufwand pro Auftrag vor allem in den Übergängen zwischen Auftrag, Einsatz und Abrechnung steckt und nicht in der Größe des einzelnen Auftrags.",
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
  // Branchen sind keine Werkzeuge: "Was sich mit Sicherungsunternehmen
  // ändert" wäre falsch. Die Vorlagen sind deshalb neutral formuliert, die
  // Einträge setzen über `headings` fachliche Überschriften.
  challengesHeading: "Typische Engpässe im Alltag – und wie Gleistrix sie löst",
  stepsHeading: "So läuft die Arbeit mit Gleistrix ab",
  faqHeading: "Häufige Fragen aus der Praxis",
  overviewHref: "/branchen",
  overviewLabel: "Alle Branchenlösungen ansehen",
  entries: INDUSTRIES,
};
