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
    title: "Projektplanung & Disposition",
    tagline: "Projekte, Ressourcen und Meilensteine",
    description:
      "Projekte anlegen und Ressourcen wie Technik, Fahrzeuge und Personal präzise zuweisen – ohne Doppelbelegungen und ohne Rückfragen per Telefon.",
    metaDescription:
      "Bahnprojekte planen und Personal, Fahrzeuge und Technik disponieren – ohne Doppelbelegung, mit Sperrpausen, Meilensteinen und Live-Status im Blick.",
    icon: KanbanSquare,
    group: "Planung & Steuerung",
    image: "/Einsatzvorbereitung & Logistik.png",
    highlights: [
      {
        title: "Eine Projektakte",
        text: "Auftrag, Beteiligte, Termine und Dokumente liegen an einem Ort statt in fünf Postfächern.",
      },
      {
        title: "Disposition per Drag-and-drop",
        text: "Personal, Fahrzeuge und Technik werden dem Einsatz direkt zugewiesen – mit Prüfung auf Konflikte.",
      },
      {
        title: "Fortschritt in Echtzeit",
        text: "Status und Meilensteine sind jederzeit sichtbar, statt erst im Wochenbericht aufzutauchen.",
      },
    ],
    bullets: [
      "Projekte mit Status, Meilensteinen und Verantwortlichen",
      "Ressourcen per Drag-and-drop disponieren",
      "Doppelbelegungen werden automatisch erkannt",
      "Sperrpausen und Bauabschnitte sauber abgebildet",
    ],
    challenges: [
      {
        problem:
          "Der Einsatzplan liegt in einer Tabelle, die per Mail wandert. Welche Fassung die aktuelle ist, weiß am Ende niemand sicher.",
        solution:
          "Alle Beteiligten planen in derselben Projektakte. Jede Änderung ist sofort für Disposition, Bauleitung und Trupp sichtbar.",
      },
      {
        problem:
          "Ein Sicherungsposten steht an zwei Baustellen gleichzeitig im Plan – auffallen tut das am Einsatztag um fünf Uhr morgens.",
        solution:
          "Doppelbelegungen erkennt Gleistrix beim Zuweisen und meldet den Konflikt, bevor der Plan überhaupt verschickt wird.",
      },
      {
        problem:
          "Sperrpausen, Bauabschnitte und Nachtarbeit stehen in drei verschiedenen Dokumenten und werden von Hand abgeglichen.",
        solution:
          "Sperrpausen und Bauabschnitte gehören zum Projekt. Die Disposition plant direkt im hinterlegten Zeitfenster.",
      },
    ],
    steps: [
      {
        title: "Projekt anlegen",
        text: "Auftrag, Auftraggeber, Bauabschnitte und Sperrpausen werden einmal erfasst und gelten für alle Beteiligten.",
      },
      {
        title: "Bedarf festlegen",
        text: "Pro Schicht steht fest, welche Qualifikationen, Fahrzeuge und Sicherungstechnik gebraucht werden.",
      },
      {
        title: "Ressourcen zuweisen",
        text: "Personal, Fahrzeuge und Technik per Drag-and-drop einplanen – Konflikte meldet das System sofort.",
      },
      {
        title: "Fortschritt verfolgen",
        text: "Status, Meilensteine und Abweichungen sind jederzeit im Projekt sichtbar, ohne Rückfrage per Telefon.",
      },
    ],
    faqs: [
      {
        question: "Lassen sich mehrere Baustellen parallel planen?",
        answer:
          "Ja. Projekte laufen unabhängig nebeneinander, greifen aber auf denselben Bestand an Personal, Fahrzeugen und Technik zu. Deshalb erkennt Gleistrix Doppelbelegungen auch über Projektgrenzen hinweg.",
      },
      {
        question: "Wie werden Sperrpausen in der Disposition abgebildet?",
        answer:
          "Sperrpausen sind Zeitfenster am Bauabschnitt. Schichten lassen sich daran ausrichten, sodass Anfahrt, Sicherung und Arbeitszeit in das freigegebene Fenster passen.",
      },
      {
        question: "Was passiert bei kurzfristigen Änderungen?",
        answer:
          "Die Änderung wird einmal in der Disposition vorgenommen und ist unmittelbar in der Plantafel und auf den Mobilgeräten des Teams sichtbar. Eine zusätzliche Rundmail entfällt.",
      },
      {
        question: "Berücksichtigt die Disposition Qualifikationen?",
        answer:
          "Ja. Die Qualifikationen und Fristen aus der Mitarbeiterverwaltung fließen in die Planung ein. Personal, dessen Nachweis am Einsatztag abgelaufen wäre, wird beim Einplanen kenntlich gemacht.",
      },
    ],
  },
  {
    slug: "kalender-einsatzuebersicht",
    title: "Plantafel & Einsatzübersicht",
    tagline: "Schichten, Termine und Trupps in einer Ansicht",
    description:
      "Alle Termine und Schichten übersichtlich in einer Plantafel – jederzeit aktuell und für jede Rolle passend gefiltert.",
    metaDescription:
      "Alle Schichten und Einsätze in einer Plantafel: gefiltert nach Trupp und Projekt, mit Nacht- und Wochenendschichten – live für Disposition und Team.",
    icon: CalendarRange,
    group: "Planung & Steuerung",
    image: "/Standortbezogene Disposition.png",
    highlights: [
      {
        title: "Woche, Monat, Trupp",
        text: "Zwischen Zeiträumen und Ansichten wechseln, ohne die Planung neu aufbauen zu müssen.",
      },
      {
        title: "Nacht und Wochenende",
        text: "Schichten über Mitternacht und an Feiertagen werden korrekt gerechnet statt manuell korrigiert.",
      },
      {
        title: "Live für alle",
        text: "Änderungen der Disposition erreichen das Team sofort – auch mobil auf der Baustelle.",
      },
    ],
    bullets: [
      "Alle Einsätze und Schichten in einer Ansicht",
      "Nacht- und Wochenendschichten sauber abgebildet",
      "Live-Aktualisierung für Disposition und Team",
      "Lücken und Überschneidungen sofort sichtbar",
    ],
    challenges: [
      {
        problem:
          "Jede Rolle bekommt ihren eigenen Ausdruck – und sobald sich etwas ändert, sind sämtliche Ausdrucke falsch.",
        solution:
          "Eine Plantafel, gefiltert nach Rolle, Trupp oder Zeitraum. Wer sie öffnet, sieht den aktuellen Stand.",
      },
      {
        problem:
          "Schichten über Mitternacht werden von Hand auf zwei Tage aufgeteilt, damit die Abrechnung damit umgehen kann.",
        solution:
          "Nachtschichten laufen als ein Einsatz durch und werden mit den richtigen Zuschlägen weitergerechnet.",
      },
      {
        problem:
          "Auf der Baustelle weiß niemand, wer im Lauf des Tages noch dazukommt oder wann die Ablösung eintrifft.",
        solution:
          "Das Team ruft seine Einsätze mobil ab – mit Treffpunkt, Zeitfenster und Ansprechpartner.",
      },
    ],
    steps: [
      {
        title: "Zeitraum wählen",
        text: "Tag, Woche oder Monat – Trupps, Projekte und Zuordnungen bleiben beim Wechsel erhalten.",
      },
      {
        title: "Ansicht filtern",
        text: "Nach Trupp, Projekt, Standort oder Qualifikation filtern, ohne die Planung neu aufzubauen.",
      },
      {
        title: "Lücken schließen",
        text: "Unbesetzte Schichten und Überschneidungen sind markiert und lassen sich direkt aus der Ansicht heraus belegen.",
      },
      {
        title: "Team informieren",
        text: "Mit der Freigabe steht der Plan im Web und auf dem Handy bereit – für alle zur selben Zeit.",
      },
    ],
    faqs: [
      {
        question: "Sieht jede Mitarbeiterin und jeder Mitarbeiter die komplette Planung?",
        answer:
          "Nicht zwangsläufig. Rollen und Berechtigungen steuern, wer die Gesamtplanung sieht und wer ausschließlich die eigenen Einsätze.",
      },
      {
        question: "Werden Nacht-, Wochenend- und Feiertagsschichten unterschieden?",
        answer:
          "Ja. Schichten über Mitternacht, an Wochenenden und an Feiertagen werden als solche erkannt und mit den passenden Zuschlägen in Abrechnung und Lohn weitergegeben.",
      },
      {
        question: "Lässt sich die Plantafel auf dem Handy nutzen?",
        answer:
          "Ja. Die Einsatzübersicht ist für mobile Geräte ausgelegt, damit Trupps ihre Schichten auch unterwegs und auf der Baustelle abrufen können.",
      },
      {
        question: "Was passiert bei Urlaub oder einer Krankmeldung?",
        answer:
          "Abwesenheiten aus der Mitarbeiterverwaltung erscheinen unmittelbar in der Plantafel. Die betroffene Schicht wird als offen markiert und kann neu besetzt werden.",
      },
    ],
  },
  {
    slug: "reports-auswertungen",
    title: "Reports & Auswertungen",
    tagline: "Kennzahlen zu Auslastung und Kosten",
    description:
      "Echtzeitdaten für fundierte Entscheidungen und transparente Abläufe – von der Auslastung bis zum Deckungsbeitrag pro Projekt.",
    metaDescription:
      "Auslastung, Kosten und Deckungsbeiträge je Bahnprojekt in Echtzeit – gebildet aus Schichten, Stunden und Rechnungen, als Bericht exportierbar.",
    icon: BarChart3,
    group: "Planung & Steuerung",
    image: "/reports.png",
    highlights: [
      {
        title: "Auslastung sehen",
        text: "Wie voll ist der nächste Monat wirklich? Die Antwort steht im Dashboard, nicht in einer Tabelle.",
      },
      {
        title: "Deckungsbeiträge",
        text: "Erlöse und Kosten je Projekt gegenübergestellt – auch während das Projekt noch läuft.",
      },
      {
        title: "Exportierbar",
        text: "Auswertungen lassen sich für Geschäftsführung, Bank oder Auftraggeber herausziehen.",
      },
    ],
    bullets: [
      "Kennzahlen zu Projekten, Auslastung und Kosten",
      "Deckungsbeiträge pro Projekt und Zeitraum",
      "Transparente Abläufe für die Geschäftsführung",
      "Auswertungen als Datei für Berichte und Termine",
    ],
    challenges: [
      {
        problem:
          "Kennzahlen entstehen am Monatsende in einer Tabelle – und sind zu dem Zeitpunkt, an dem jemand sie liest, längst überholt.",
        solution:
          "Auslastung, Kosten und Deckungsbeiträge werden laufend aus den Daten der Plattform gebildet und sind jederzeit abrufbar.",
      },
      {
        problem:
          "Ob ein Projekt am Ende Geld gebracht hat, zeigt sich erst nach der Schlussrechnung – zum Gegensteuern zu spät.",
        solution:
          "Erlöse und Kosten stehen sich schon während der Laufzeit gegenüber. Abweichungen fallen auf, solange man noch reagieren kann.",
      },
      {
        problem:
          "Für Bank, Beirat oder Auftraggeber wird jedes Mal von Hand ein Bericht zusammengestellt.",
        solution:
          "Auswertungen lassen sich als Datei ziehen und ohne Nacharbeit weitergeben.",
      },
    ],
    steps: [
      {
        title: "Daten entstehen im Betrieb",
        text: "Projekte, Schichten, Stunden, Material und Rechnungen liefern die Zahlen – ohne separate Erfassung.",
      },
      {
        title: "Umfang eingrenzen",
        text: "Auswertung nach Projekt, Team, Kunde oder Zeitraum eingrenzen.",
      },
      {
        title: "Kennzahlen lesen",
        text: "Auslastung, Stunden, Kosten und Deckungsbeitrag stehen im Dashboard nebeneinander statt in fünf Dateien.",
      },
      {
        title: "Bericht weitergeben",
        text: "Das Ergebnis geht als Datei an Geschäftsführung, Steuerberater oder Auftraggeber.",
      },
    ],
    faqs: [
      {
        question: "Woher kommen die Zahlen in den Auswertungen?",
        answer:
          "Aus dem laufenden Betrieb: geplante und geleistete Schichten, freigegebene Stunden, Materialentnahmen und gestellte Rechnungen. Eine zweite Erfassung nur für Auswertungen entfällt.",
      },
      {
        question: "Lassen sich Deckungsbeiträge je Projekt auswerten?",
        answer:
          "Ja. Erlöse und zugeordnete Kosten werden je Projekt und Zeitraum gegenübergestellt – auch, während das Projekt noch läuft.",
      },
      {
        question: "Kann ich Auswertungen exportieren?",
        answer:
          "Ja. Berichte lassen sich als Datei herausziehen und in bestehenden Unterlagen für Geschäftsführung, Bank oder Auftraggeber weiterverwenden.",
      },
      {
        question: "Wer darf kaufmännische Kennzahlen sehen?",
        answer:
          "Das steuern Rollen und Berechtigungen. Auswertungen zu Kosten und Deckungsbeiträgen lassen sich auf Geschäftsführung und Backoffice begrenzen.",
      },
    ],
  },
  {
    slug: "mitarbeiterverwaltung",
    title: "Mitarbeiterverwaltung",
    tagline: "Qualifikationen, Fristen und Abwesenheiten",
    description:
      "Personal anlegen, bearbeiten und verwalten – inklusive Qualifikationen, Urlaubsplanung und Abwesenheiten, mit Warnung vor ablaufenden Nachweisen.",
    metaDescription:
      "Personal, Qualifikationen und Abwesenheiten verwalten: Sicherungsposten, Sicherungsaufsicht und Tauglichkeiten mit Fristenwarnung, Urlaub in der Plantafel.",
    icon: Users,
    group: "Team & Ressourcen",
    image: "/Sicherungspersonal%20gleis.png",
    highlights: [
      {
        title: "Qualifikationen im Blick",
        text: "SiPo, SaKra oder HIB samt Tauglichkeiten – mit Frist und Warnung vor dem Ablauf.",
      },
      {
        title: "Abwesenheiten integriert",
        text: "Urlaub und Krankheit stehen direkt in der Plantafel, nicht in einer zweiten Liste.",
      },
      {
        title: "Rollen und Rechte",
        text: "Jede Rolle sieht genau das, was sie braucht – von der Disposition bis zum Trupp.",
      },
    ],
    bullets: [
      "Qualifikationen und Tauglichkeiten mit Fristenwarnung",
      "Urlaubs- und Abwesenheitsplanung integriert",
      "Rollen und Berechtigungen pro Team",
      "Personalakte mit Nachweisen und Dokumenten",
    ],
    challenges: [
      {
        problem:
          "Qualifikationsnachweise liegen als Kopie im Ordner. Wann sie ablaufen, hat nur eine Person im Kopf.",
        solution:
          "Jede Qualifikation trägt ihr Ablaufdatum im System. Fristen melden sich, bevor sie zum Problem werden.",
      },
      {
        problem:
          "Ein abgelaufener Nachweis fällt erst auf, wenn der Auftraggeber danach fragt – im ungünstigsten Fall auf der Baustelle.",
        solution:
          "Personal mit abgelaufenem Nachweis wird schon in der Planung kenntlich gemacht, nicht erst in der Prüfung.",
      },
      {
        problem:
          "Urlaubsanträge laufen per Mail, die Einsatzplanung weiß nichts davon und plant weiter.",
        solution:
          "Urlaub und Abwesenheiten stehen direkt in der Plantafel. Doppelplanung fällt damit weg.",
      },
    ],
    steps: [
      {
        title: "Personalakte anlegen",
        text: "Stammdaten, Vertragsdaten und Dokumente liegen an einem Ort statt in mehreren Ordnern.",
      },
      {
        title: "Qualifikationen hinterlegen",
        text: "Sicherungsposten, Sicherungsaufsicht, HIB und ärztliche Tauglichkeiten mit Gültigkeit und Nachweis erfassen.",
      },
      {
        title: "Fristen überwachen",
        text: "Ablaufende Nachweise meldet das System rechtzeitig an die Verantwortlichen.",
      },
      {
        title: "Einsatzfähigkeit nutzen",
        text: "Die Disposition greift auf gültige Qualifikationen zu und plant passend zum Bedarf der Schicht.",
      },
    ],
    faqs: [
      {
        question: "Welche Qualifikationen lassen sich abbilden?",
        answer:
          "Die im Bahnumfeld üblichen Nachweise wie Sicherungsposten, Sicherungsaufsicht und HIB sowie ärztliche Tauglichkeiten – jeweils mit Gültigkeitszeitraum und hinterlegtem Nachweis. Weitere Qualifikationen lassen sich ergänzen.",
      },
      {
        question: "Wann warnt Gleistrix vor ablaufenden Nachweisen?",
        answer:
          "Rechtzeitig vor dem Ablaufdatum, sodass Nachschulung oder Untersuchung noch planbar sind. Zusätzlich ist der Status jederzeit in der Personalakte sichtbar.",
      },
      {
        question: "Sind Urlaub und Krankheit enthalten?",
        answer:
          "Ja. Abwesenheiten werden in der Mitarbeiterverwaltung gepflegt und erscheinen automatisch in Plantafel und Disposition, damit niemand doppelt verplant wird.",
      },
      {
        question: "Wer bekommt Personaldaten zu sehen?",
        answer:
          "Nur Rollen mit entsprechender Berechtigung. Die Disposition sieht Verfügbarkeit und Qualifikation, nicht zwangsläufig die vollständige Personalakte.",
      },
    ],
  },
  {
    slug: "fahrzeug-technik",
    title: "Fahrzeuge & Technik",
    tagline: "Prüffristen, Wartung und Zuordnung",
    description:
      "Fahrzeuge und Geräte zentral erfassen, warten und Einsätzen zuordnen – inklusive Prüffristen und vollständiger Wartungshistorie.",
    metaDescription:
      "Fahrzeuge, Geräte und Sicherungstechnik zentral führen: HU, UVV und Prüffristen mit Warnung, Wartungshistorie dokumentiert, direkt disponierbar.",
    icon: Wrench,
    group: "Team & Ressourcen",
    image: "/Fahrzeugplanung.png",
    highlights: [
      {
        title: "Fristen laufen nicht ab",
        text: "HU, UVV und Prüftermine melden sich rechtzeitig, statt am Einsatztag aufzufallen.",
      },
      {
        title: "Historie dokumentiert",
        text: "Wartungen und Reparaturen bleiben nachvollziehbar – auch Jahre später.",
      },
      {
        title: "Direkt disponierbar",
        text: "Zweiwegefahrzeuge und Sicherungstechnik werden dem Einsatz zugeordnet wie Personal.",
      },
    ],
    bullets: [
      "Fahrzeuge, HU- und Prüftermine mit Fristenwarnung",
      "Geräte- und Wartungshistorie dokumentiert",
      "Direkte Zuordnung zu Projekten und Einsätzen",
      "Verfügbarkeiten und Standorte im Überblick",
    ],
    challenges: [
      {
        problem:
          "HU, UVV und Prüftermine stehen in einer Liste, die einmal im Quartal jemand durchsieht – wenn Zeit dafür bleibt.",
        solution:
          "Jedes Fahrzeug und jedes Gerät führt seine Fristen selbst mit. Warnungen kommen, ohne dass jemand danach suchen muss.",
      },
      {
        problem:
          "Am Einsatztag stellt sich heraus, dass das Zweiwegefahrzeug zur Wartung in der Werkstatt steht.",
        solution:
          "Verfügbarkeiten und Wartungsfenster stehen in derselben Ansicht wie die Einsatzplanung.",
      },
      {
        problem:
          "Reparaturhistorien stecken in Werkstattrechnungen im Aktenordner und sind Jahre später nicht mehr auffindbar.",
        solution:
          "Wartungen, Reparaturen und Prüfungen bleiben am Objekt dokumentiert und lassen sich jederzeit nachvollziehen.",
      },
    ],
    steps: [
      {
        title: "Fuhrpark und Technik erfassen",
        text: "Fahrzeuge, Anhänger, Sicherungstechnik und Geräte mit Stammdaten und Standort anlegen.",
      },
      {
        title: "Fristen hinterlegen",
        text: "Hauptuntersuchung, UVV-Prüfung, Sachkundigenprüfungen und Wartungsintervalle mit Datum eintragen.",
      },
      {
        title: "Einsätzen zuordnen",
        text: "Fahrzeuge und Technik werden dem Einsatz zugewiesen wie Personal – samt Prüfung auf Verfügbarkeit.",
      },
      {
        title: "Historie fortschreiben",
        text: "Jede Wartung und jede Reparatur wird am Objekt dokumentiert und bleibt nachvollziehbar.",
      },
    ],
    faqs: [
      {
        question: "Welche Fristen lassen sich überwachen?",
        answer:
          "Alle wiederkehrenden Termine am Objekt – etwa Hauptuntersuchung, UVV-Prüfung, Sachkundigenprüfungen sowie selbst definierte Wartungsintervalle.",
      },
      {
        question: "Können auch Geräte und Sicherungstechnik verwaltet werden?",
        answer:
          "Ja. Neben Fahrzeugen werden Anhänger, Geräte und Sicherungstechnik mit Prüf- und Wartungshistorie geführt.",
      },
      {
        question: "Sieht die Disposition, ob ein Fahrzeug frei ist?",
        answer:
          "Ja. Verfügbarkeit, Wartungsfenster und bestehende Zuordnungen sind während der Planung sichtbar, sodass Doppelbelegungen sofort auffallen.",
      },
      {
        question: "Bleibt die Historie erhalten, wenn ein Fahrzeug ausgemustert wird?",
        answer:
          "Ja. Die dokumentierte Wartungs- und Prüfhistorie bleibt am Objekt erhalten und ist auch nach dem Ausscheiden aus dem Fuhrpark abrufbar.",
      },
    ],
  },
  {
    slug: "lagerverwaltung",
    title: "Lagerverwaltung",
    tagline: "Bestände, Reservierungen und Prüfhistorie",
    description:
      "Material, Geräte und Sicherungstechnik mit Beständen und Reservierungen verwalten – damit auf der Baustelle nichts fehlt.",
    metaDescription:
      "Material, Geräte und Sicherungstechnik mit Beständen, Mindestmengen und Reservierungen verwalten – Entnahmen laufen projektbezogen in die Abrechnung.",
    icon: Package,
    group: "Team & Ressourcen",
    image: "/Einsatzvorbereitung & Logistik.png",
    highlights: [
      {
        title: "Bestand in Echtzeit",
        text: "Was im Lager liegt und was auf der Baustelle ist, steht in derselben Ansicht.",
      },
      {
        title: "Mindestmengen",
        text: "Unterschreitungen melden sich, bevor der Nachschub zum Engpass wird.",
      },
      {
        title: "Dem Projekt zugeordnet",
        text: "Entnahmen laufen auf das Projekt und tauchen später in der Abrechnung wieder auf.",
      },
    ],
    bullets: [
      "Bestände und Mindestmengen in Echtzeit",
      "Material direkt dem Projekt zuordnen",
      "Geräte- und Prüfhistorie dokumentiert",
      "Reservierungen für geplante Einsätze",
    ],
    challenges: [
      {
        problem:
          "Was tatsächlich im Lager liegt, weiß nur, wer zuletzt drin war. Der Rest schätzt.",
        solution:
          "Bestände werden gebucht statt geschätzt. Eine Ansicht zeigt Lagerbestand und ausgegebenes Material nebeneinander.",
      },
      {
        problem:
          "Material fehlt genau dann, wenn der Trupp bereits auf der Baustelle steht – und die Schicht wartet.",
        solution:
          "Mindestmengen melden sich früh genug, dass Nachschub noch in Ruhe geplant werden kann.",
      },
      {
        problem:
          "Entnahmen tauchen in der Abrechnung nicht auf und bleiben im Projektergebnis unsichtbar.",
        solution:
          "Jede Entnahme läuft auf ein Projekt und steht später in Abrechnung und Auswertung zur Verfügung.",
      },
    ],
    steps: [
      {
        title: "Artikel anlegen",
        text: "Material, Kleinteile, Geräte und Sicherungstechnik mit Lagerort und Mindestmenge erfassen.",
      },
      {
        title: "Bestände buchen",
        text: "Zugänge, Entnahmen und Rückgaben werden im System gebucht statt auf Zetteln notiert.",
      },
      {
        title: "Für den Einsatz reservieren",
        text: "Material lässt sich für geplante Einsätze vormerken, damit es am Einsatztag auch wirklich verfügbar ist.",
      },
      {
        title: "Verbrauch auswerten",
        text: "Projektbezogene Entnahmen stehen für Abrechnung und Auswertung bereit.",
      },
    ],
    faqs: [
      {
        question: "Lassen sich mehrere Lagerorte abbilden?",
        answer:
          "Ja. Artikel werden Lagerorten zugeordnet, sodass Bestände je Standort und je Projekt nachvollziehbar bleiben.",
      },
      {
        question: "Wie funktionieren Reservierungen?",
        answer:
          "Material wird einem geplanten Einsatz zugeordnet und im Bestand als vorgemerkt geführt. Damit kann dieselbe Menge nicht versehentlich ein zweites Mal verplant werden.",
      },
      {
        question: "Werden Prüffristen von Geräten mitgeführt?",
        answer:
          "Ja. Geräte- und Prüfhistorie werden am Artikel dokumentiert – ergänzend zur Verwaltung von Fahrzeugen und Technik.",
      },
      {
        question: "Fließt der Materialverbrauch in die Abrechnung ein?",
        answer:
          "Ja. Projektbezogene Entnahmen stehen der Abrechnung direkt zur Verfügung und müssen nicht nachträglich zusammengesucht werden.",
      },
    ],
  },
  {
    slug: "zeiterfassung-stundenzettel",
    title: "Zeiterfassung & Stundenzettel",
    tagline: "Mobil erfasst, prüffähig abgelegt",
    description:
      "Zeiten digital, mobil und prüffähig erfassen – direkt mit Projekten verknüpft und ohne Abtippen in der Verwaltung.",
    metaDescription:
      "Zeiten mobil auf der Baustelle erfassen: prüffähige Stundenzettel mit Nacht- und Wochenendzuschlägen, ohne Abtippen direkt in Abrechnung und Lohn.",
    icon: Clock,
    group: "Nachweise & Abrechnung",
    image: "/Zeiterfassung.png",
    highlights: [
      {
        title: "Erfassung vor Ort",
        text: "Das Team trägt Zeiten am Einsatzort ein – der Zettel im Auto entfällt.",
      },
      {
        title: "Freigabe statt Nacharbeit",
        text: "Die Verwaltung prüft und gibt frei, statt Zettel abzutippen und zu korrigieren.",
      },
      {
        title: "Direkt weiterverwendet",
        text: "Freigegebene Stunden fließen ohne Zwischenschritt in Abrechnung und Lohn.",
      },
    ],
    bullets: [
      "Mobile Zeiterfassung direkt auf der Baustelle",
      "Prüffähige Stundenzettel ohne Nacharbeit",
      "Nahtlose Verknüpfung mit Projekten und Abrechnung",
      "Zuschläge für Nacht, Wochenende und Feiertag",
    ],
    challenges: [
      {
        problem:
          "Stundenzettel kommen auf Papier in die Verwaltung – teils Tage später, teils kaum lesbar.",
        solution:
          "Zeiten werden am Einsatzort erfasst und liegen unmittelbar zur Prüfung in der Verwaltung vor.",
      },
      {
        problem:
          "Das Backoffice tippt Zettel ab und rechnet Nacht- und Wochenendzuschläge von Hand nach.",
        solution:
          "Zuschläge werden aus der Schicht abgeleitet, statt sie im Nachhinein zu rekonstruieren.",
      },
      {
        problem:
          "Fragt der Auftraggeber nach einer einzelnen Schicht, beginnt die Suche nach dem passenden Nachweis.",
        solution:
          "Jeder Eintrag hängt an Projekt, Schicht und Person und bleibt prüffähig dokumentiert.",
      },
    ],
    steps: [
      {
        title: "Schicht erfassen",
        text: "Das Team trägt Beginn, Pause und Ende mobil am Einsatzort ein – ohne Zettel im Fahrzeug.",
      },
      {
        title: "Leistung zuordnen",
        text: "Zeiten hängen am Projekt, an der Schicht und, wo nötig, an der Position des Leistungsverzeichnisses.",
      },
      {
        title: "Prüfen und freigeben",
        text: "Bauleitung oder Backoffice prüfen den Stundenzettel und geben ihn frei – Korrekturen bleiben nachvollziehbar.",
      },
      {
        title: "Weiterverwenden",
        text: "Freigegebene Stunden gehen ohne Zweiterfassung in Abrechnung und Lohn.",
      },
    ],
    faqs: [
      {
        question: "Können erfasste Zeiten nachträglich korrigiert werden?",
        answer:
          "Ja. Korrekturen sind vor der Freigabe möglich und bleiben nachvollziehbar, damit der Stundenzettel prüffähig bleibt.",
      },
      {
        question: "Werden Zuschläge automatisch berücksichtigt?",
        answer:
          "Ja. Nacht-, Wochenend- und Feiertagsschichten werden erkannt; die zugehörigen Zuschläge fließen in Abrechnung und Lohn ein, ohne dass jemand nachrechnet.",
      },
      {
        question: "Wie kommen die Stunden in die Abrechnung?",
        answer:
          "Freigegebene Stunden stehen der Abrechnung direkt zur Verfügung. Ein erneutes Eintippen oder der Umweg über Zwischentabellen entfällt.",
      },
      {
        question: "Sind die digitalen Stundenzettel prüffähig?",
        answer:
          "Ja. Jeder Eintrag ist Projekt, Schicht und Person zugeordnet und mit der Freigabe dokumentiert – auch für spätere Nachweise gegenüber Auftraggebern.",
      },
    ],
  },
  {
    slug: "dokumentenmanagement",
    title: "Dokumentenmanagement",
    tagline: "Revisionssicher in der Projektakte",
    description:
      "Wichtige Unterlagen zentral speichern, teilen und revisionssicher archivieren – bei Prüfungen bist du in Sekunden auskunftsfähig.",
    metaDescription:
      "Pläne, Nachweise und Protokolle revisionssicher in der Projektakte: Versionen und Freigaben dokumentiert, bei Audits in Sekunden auskunftsfähig.",
    icon: FolderOpen,
    group: "Nachweise & Abrechnung",
    image: "/Lösungen.png",
    highlights: [
      {
        title: "Alles am Projekt",
        text: "Pläne, Nachweise und Protokolle hängen an der Akte statt verstreut in Ordnern.",
      },
      {
        title: "Versionen nachvollziehbar",
        text: "Wer wann was freigegeben hat, bleibt dokumentiert – ohne Dateinamen mit _final_v3.",
      },
      {
        title: "Auskunftsfähig",
        text: "Bei Audits und Prüfungen ist der passende Nachweis in Sekunden gefunden.",
      },
    ],
    bullets: [
      "Revisionssichere Ablage pro Projekt",
      "Freigaben und Versionen jederzeit nachvollziehbar",
      "Nachweise und Protokolle zentral statt im Postfach",
      "Zugriff nach Rolle und Projekt gesteuert",
    ],
    challenges: [
      {
        problem:
          "Pläne und Nachweise verteilen sich auf Postfächer, Netzlaufwerke und Chatverläufe.",
        solution:
          "Alle Unterlagen hängen an der Projektakte und werden über das Projekt gefunden, nicht über den Dateinamen.",
      },
      {
        problem:
          "Welche Fassung freigegeben ist, verrät bestenfalls der Dateiname – Angebot_final_v3_neu.",
        solution:
          "Versionen und Freigaben sind dokumentiert. Der gültige Stand ist eindeutig und belegbar.",
      },
      {
        problem:
          "Bei Audits und Prüfungen beginnt die Suche nach dem passenden Nachweis von vorn.",
        solution:
          "Nachweise sind über Projekt, Schicht und Zeitraum in Sekunden gefunden.",
      },
    ],
    steps: [
      {
        title: "Ablegen",
        text: "Pläne, Nachweise, Protokolle und Fotos werden direkt am Projekt gespeichert.",
      },
      {
        title: "Zuordnen",
        text: "Dokumente hängen an Projekt, Schicht oder Person – eine zweite Ordnerstruktur entfällt.",
      },
      {
        title: "Freigeben",
        text: "Freigaben und Versionen werden festgehalten, sodass der gültige Stand jederzeit erkennbar bleibt.",
      },
      {
        title: "Auskunft geben",
        text: "Bei Prüfungen wird der Nachweis über das Projekt gefunden statt über die Dateisuche.",
      },
    ],
    faqs: [
      {
        question: "Was bedeutet revisionssichere Ablage in Gleistrix?",
        answer:
          "Dokumente werden versioniert, Freigaben und Änderungen bleiben nachvollziehbar. Damit ist zu jedem Zeitpunkt belegbar, welche Fassung gültig war und wer sie freigegeben hat.",
      },
      {
        question: "Wer hat Zugriff auf welche Dokumente?",
        answer:
          "Der Zugriff wird über Rollen und Projektzugehörigkeit gesteuert. Ein Trupp sieht die Unterlagen seiner Einsätze, das Backoffice die kaufmännischen Dokumente.",
      },
      {
        question: "Lassen sich Unterlagen mit Auftraggebern teilen?",
        answer:
          "Ja. Dokumente können gezielt bereitgestellt werden, statt sie als Anhang durch Postfächer zu schicken.",
      },
      {
        question: "Bleiben Dokumente nach Projektende erhalten?",
        answer:
          "Ja. Die Projektakte bleibt mit allen Nachweisen bestehen und ist auch nach Abschluss des Projekts abrufbar.",
      },
    ],
  },
  {
    slug: "rechnungsstellung",
    title: "Abrechnung & Rechnungsstellung",
    tagline: "Von der Leistung zur X-Rechnung",
    description:
      "Rechnungen schnell, korrekt und auf Wunsch automatisiert erstellen – aus geprüften Leistungen und Stunden, übergabefertig für die Buchhaltung.",
    metaDescription:
      "Aus geprüften Stunden und Leistungen zur Rechnung: X-Rechnung für öffentliche Auftraggeber, Abrechnung nach LV und GAEB, saubere Übergabe an DATEV.",
    icon: FileText,
    group: "Nachweise & Abrechnung",
    image: "/Rechnungen.png",
    highlights: [
      {
        title: "Ohne Zweiterfassung",
        text: "Freigegebene Stunden und Leistungen werden zum Rechnungsentwurf – kein erneutes Eintippen.",
      },
      {
        title: "Normkonform",
        text: "X-Rechnung und strukturierte Belege erfüllen die Anforderungen öffentlicher Auftraggeber.",
      },
      {
        title: "Saubere Übergabe",
        text: "Steuerberater und DATEV-Prozesse erhalten geprüfte Daten statt PDF-Sammlungen.",
      },
    ],
    bullets: [
      "Leistungsnachweise automatisch zusammengeführt",
      "Rechnungsentwürfe pro Projekt und Zeitraum",
      "X-Rechnung und saubere Übergabe an die Buchhaltung",
      "Abrechnung nach LV und GAEB-Positionen",
    ],
    challenges: [
      {
        problem:
          "Die Rechnung entsteht aus Zetteln, Mails und einer Tabelle – und braucht dafür Wochen.",
        solution:
          "Aus geprüften Leistungen und freigegebenen Stunden entsteht der Rechnungsentwurf, sobald die Freigabe steht.",
      },
      {
        problem:
          "Öffentliche Auftraggeber verlangen die X-Rechnung, das bisherige Rechnungsprogramm kann sie nicht liefern.",
        solution:
          "Gleistrix erzeugt strukturierte Rechnungen im X-Rechnungs-Format direkt aus dem Projekt.",
      },
      {
        problem:
          "Der Steuerberater bekommt eine Sammlung von PDF-Dateien und stellt dazu Rückfragen.",
        solution:
          "Die Buchhaltung erhält geprüfte, strukturierte Daten statt gescannter Belege.",
      },
    ],
    steps: [
      {
        title: "Leistungen sammeln",
        text: "Freigegebene Stunden, Material und Positionen laufen während des Projekts zusammen.",
      },
      {
        title: "Entwurf erzeugen",
        text: "Für Projekt und Zeitraum entsteht ein Rechnungsentwurf – auf Wunsch nach LV- und GAEB-Positionen gegliedert.",
      },
      {
        title: "Prüfen und freigeben",
        text: "Der Entwurf wird kaufmännisch geprüft und freigegeben, bevor er das Haus verlässt.",
      },
      {
        title: "Versenden und übergeben",
        text: "Die Rechnung geht als X-Rechnung an den Auftraggeber, die geprüften Daten an die Buchhaltung.",
      },
    ],
    faqs: [
      {
        question: "Was ist eine X-Rechnung und wer braucht sie?",
        answer:
          "Die X-Rechnung ist das strukturierte elektronische Rechnungsformat für öffentliche Auftraggeber in Deutschland. Wer an Bund, Länder oder kommunale Auftraggeber fakturiert, muss sie in der Regel liefern. Gleistrix erzeugt sie aus den freigegebenen Leistungen des Projekts.",
      },
      {
        question: "Kann nach LV- und GAEB-Positionen abgerechnet werden?",
        answer:
          "Ja. Leistungen lassen sich Positionen des Leistungsverzeichnisses zuordnen und entsprechend abrechnen – passend zu Angeboten im GAEB-Format.",
      },
      {
        question: "Muss ich Stunden für die Rechnung erneut erfassen?",
        answer:
          "Nein. Freigegebene Stundenzettel und Leistungsnachweise werden übernommen. Eine Zweiterfassung für die Abrechnung entfällt.",
      },
      {
        question: "Wie kommen die Daten zum Steuerberater?",
        answer:
          "Die Abrechnung stellt geprüfte Daten für die vorbereitende Buchhaltung bereit, sodass die Übergabe an Steuerberater und DATEV-Prozesse ohne Belegsammlung funktioniert.",
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
  overviewHref: "/produkt",
  overviewLabel: "Alle Module ansehen",
  entries: MODULES,
};
