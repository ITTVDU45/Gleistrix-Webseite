import type { BlogArticle, BlogCategory } from "@/types/blog";

/**
 * Auslieferungszustand des Blogs.
 *
 * Wie bei den Startseiten-Modulen (data/landingModules.ts): solange niemand im
 * Adminbereich gepflegt hat, stehen diese Artikel. Damit ist /blog vom ersten
 * Aufruf an vollständig und die Sektion auf der Startseite bleibt gefüllt.
 *
 * Es sind dieselben sechs Anrisse, die vorher fest in BlogSection.tsx standen –
 * jetzt mit Adresse, Text und SEO-Feldern, damit sie eine eigene Seite haben.
 */

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Auslieferungszustand der Rubriken.
 *
 * Wie bei den Artikeln: leere Ablage ⇒ diese Liste. Gepflegt wird sie unter
 * /admin/blog/kategorien. Die Beschreibung geht in den Prompt der Auswertung
 * ein – daran erkennt das Modell, wohin eine Quelle gehört. Eine Rubrik ohne
 * Beschreibung ist deshalb eine schlechtere Rubrik.
 */
export const DEFAULT_BLOG_CATEGORIES: BlogCategory[] = (
  [
    ["Disposition", "Einsatzplanung, Plantafel, Truppzuordnung, Anfahrt und kurzfristige Umplanung."],
    ["Sicherung", "Sicherungsposten, Sperrpausen, Bahnübergänge, Nachweise und Qualifikationen."],
    ["Fuhrpark", "Fahrzeuge, Zweiwegetechnik, Messtechnik, Verfügbarkeit, Wartung und Prüffristen."],
    ["Zeiterfassung", "Stundenzettel, Zuschläge, Freigabe, Kostenstellen und mobile Erfassung."],
    ["Abrechnung", "Leistungsnachweis, Nachträge, E-Rechnung und öffentliche Auftraggeber."],
    ["Auswertung", "Auslastung, Deckungsbeitrag, Soll-Ist-Vergleich und Controlling."],
    ["Dokumentation", "Bautagebuch, Fotos, Mängel, Übergaben und Ablage von Nachweisen."],
    ["Digitalisierung", "Medienbrüche, Einführung, Schnittstellen und Arbeit ohne Netz im Gleisbereich."],
  ] as const
).map(([name, description]) => ({
  id: slugifyName(name),
  name,
  slug: slugifyName(name),
  description,
  createdAt: "2026-06-01T08:00:00.000Z",
}));

/**
 * Was Gleistrix kann – Grundlage für den Produktbezug in jedem Artikel.
 *
 * Steht hier und nicht im Prompt-Text, weil es sich ändert, sobald ein Modul
 * dazukommt: eine Stelle zum Pflegen statt drei Stellen zum Suchen. Bewusst als
 * nüchterne Aufzählung – das Modell soll daraus ableiten, nicht abschreiben.
 * Der Abschnitt „Was Gleistrix NICHT ist“ steht dort gegen erfundene
 * Fähigkeiten: ein Blogartikel, der etwas verspricht, was das Produkt nicht
 * kann, kostet im Vertriebsgespräch mehr, als er vorher eingebracht hat.
 */
export const GLEISTRIX_CONTEXT = `Gleistrix ist eine ERP-Plattform für Bahndienstleister, Gleisbau- und
Infrastrukturbetriebe. Alles läuft auf einem Datenstand, damit zwischen Planung,
Einsatz und Abrechnung keine Medienbrüche entstehen.

Module:
- Projektplanung und Disposition: Projekte mit Auftraggeber, Baustelle, Auftrags- und
  SAP-Nummer, Leistungen mit Positionen; Projektanlage aus DB-Leistungsanfragen per KI;
  ATWS-Einsatz mit Anzahl und Meterlänge.
- Plantafel: Tages-, Wochen-, Monats- und Jahresansicht; Personal und Fahrzeuge per
  Drag-and-drop; Konfliktprüfung bei Doppelbelegung, Urlaub, Krankheit und Feiertag
  (je Bundesland); Besprechungen.
- Mitarbeiterverwaltung: Funktionen je Mitarbeiter (SIPO, Sakra, BüP, HiBa, SAS, HFE,
  Bahnerder, Monteur/Bediener), ElBa-Kennung, Abwesenheiten (Urlaub, AU, Freistellung,
  Fortbildung). KEINE Ablaufdaten oder Fristenwarnung für Qualifikationen eigener Mitarbeiter.
- Nachunternehmer: eigenes Portal mit Einsätzen, Nachweisen (Status fehlt/läuft ab/
  abgelaufen, Erneuerungsintervall), Bestellscheinen mit digitaler Unterschrift,
  Rechnungen und Mahnungen; Tagessätze je Funktion.
- Zeiterfassung: Zeiten je Einsatz mit Funktion, Arbeits- und Fahrtzeit; Nacht- und
  Sonntagszuschläge; monatlicher Stundennachweis per E-Mail an Mitarbeiter und Lohnbüro.
- Fahrzeuge: Kilometer-, Tankstand, Schäden, Status, Tageskosten, Zuordnung zu Mitarbeiter
  oder Projekt.
- Lager: Bestände, Mindestmengen, Wareneingang, Lieferscheine, Ausgabe mit Rückgabe,
  Inventur, Wartungen (TÜV, Prüfung, Kalibrierung) mit Fälligkeit, mobile Lager-App mit QR-Code.
- Dokumente: Ablage am Projekt nach Dokumenttyp, Anbindung an OneDrive und SharePoint.
- Abrechnung: aus freigegebenen Stunden, Positionen nach Tag und Funktion, PDF-Ausgabe,
  Eingangsrechnungen, DATEV-Buchungsdatenexport und Belegübertragung.
- Finanzen: Soll- und Ist-Umsatz, Personal-, Nachunternehmer- und weitere Kosten,
  Ergebnis und Marge je Projekt.
- GAEB: Import von GAEB-DA-XML (X81–X89) mit Schemaprüfung; KI wertet das LV aus und
  beantwortet Fragen dazu. KEINE GAEB-Ausgabe.

Nicht vorhanden und deshalb nie zu behaupten: X-Rechnung/E-Rechnungsausgabe,
Bautagesbericht, Aufmaß, revisionssichere Archivierung, Offline-Zeiterfassung per App,
lexoffice-, sevdesk-, Stripe- oder PayPal-Anbindung.

Was Gleistrix NICHT ist: kein Planungsbüro, keine Vermessungssoftware, kein Ersatz für
betriebliche Regelwerke. Fähigkeiten, die oben nicht stehen, werden nicht behauptet.`;

/** Wörter je Minute für die Lesezeit – bewusst konservativ für Fachtexte. */
export const WORDS_PER_MINUTE = 200;

function seed(
  article: Omit<BlogArticle, "createdAt" | "updatedAt" | "status" | "sourceIds" | "generatedByAi"> & {
    /** Nur für inhaltlich überarbeitete Artikel – sonst gilt das Veröffentlichungsdatum. */
    updatedAt?: string;
  },
): BlogArticle {
  const published = article.publishedAt ?? "2026-06-01T08:00:00.000Z";
  return {
    ...article,
    status: "veroeffentlicht",
    sourceIds: [],
    generatedByAi: false,
    createdAt: published,
    updatedAt: article.updatedAt ?? published,
  };
}

export const DEFAULT_BLOG_ARTICLES: BlogArticle[] = [
  seed({
    id: "plantafel-statt-excel",
    slug: "plantafel-statt-excel",
    title: "Plantafel statt Excel: Trupps in Minuten disponieren",
    teaser: "Warum standortbezogene Einsatzplanung Fahrtwege und Leerlauf spürbar reduziert.",
    category: "Disposition",
    tags: ["Disposition", "Plantafel", "Einsatzplanung"],
    imageSrc: "/standortbezogene-disposition.webp",
    imageAlt: "Standortbezogene Disposition auf der Gleistrix-Plantafel",
    publishedAt: "2026-07-03T06:00:00.000Z",
    seo: {
      title: "Plantafel statt Excel – Trupps schneller disponieren",
      description:
        "Standortbezogene Einsatzplanung senkt Fahrtwege und Leerlauf. So läuft die Disposition auf einer Plantafel statt in verteilten Tabellen.",
      keyword: "Einsatzplanung Bahnbau",
    },
    content: `<p>In vielen Bahnbaubetrieben entsteht der Wochenplan noch in einer Tabelle, die per Mail wandert. Sobald ein Trupp umdisponiert wird, existieren zwei Wahrheiten – eine beim Disponenten, eine auf der Baustelle.</p>
<h2>Was die Tabelle nicht leisten kann</h2>
<p>Eine Tabelle kennt weder Qualifikationen noch Verfügbarkeiten. Ob ein Mitarbeiter die nötige Berechtigung besitzt, ob das Fahrzeug bereits verplant ist und wie weit die Anfahrt tatsächlich ist, steht an drei verschiedenen Stellen.</p>
<ul>
<li>Doppelbelegungen fallen erst am Einsatztag auf.</li>
<li>Abgelaufene Nachweise bleiben unbemerkt.</li>
<li>Änderungen erreichen nicht alle Beteiligten gleichzeitig.</li>
</ul>
<h2>Standortbezogen planen</h2>
<p>Auf einer Plantafel liegen Einsätze, Personal und Technik auf derselben Zeitachse. Der Disponent sieht beim Ziehen eines Trupps sofort, ob eine Qualifikation fehlt oder ein Fahrzeug kollidiert. Die Anfahrt wird zum Auswahlkriterium statt zur nachträglichen Überraschung.</p>
<p><strong>Der spürbare Effekt:</strong> weniger Leerkilometer, kürzere Rüstzeiten und ein Plan, den alle Beteiligten in derselben Fassung sehen.</p>`,
  }),
  seed({
    id: "sipo-einsaetze-dokumentieren",
    // Die Adresse bleibt, obwohl "rechtssicher" nicht mehr im Titel steht: Sie
    // ist verlinkt und indexiert. Der Titel verspricht keine Rechtssicherheit
    // mehr, weil ein Artikel sie nicht garantieren kann.
    slug: "sipo-einsaetze-rechtssicher-dokumentieren",
    title: "SiPo-Einsätze nachvollziehbar dokumentieren: ein Leitfaden für Sicherungsunternehmen",
    teaser:
      "Was zur Dokumentation eines SiPo-Einsatzes gehört – von der Anordnung der BzS über Besetzung und Arbeitszeiten bis zum prüfbaren Leistungsnachweis.",
    category: "Sicherung",
    tags: ["Sicherung", "SIPO", "Dokumentation", "Leistungsnachweis", "ElBa"],
    imageSrc: "/sicherungsmassnahmen-bahnuebergaenge.webp",
    imageAlt: "Sicherungsmaßnahmen an Bahnübergängen",
    publishedAt: "2026-06-26T06:00:00.000Z",
    updatedAt: "2026-09-22T08:00:00.000Z",
    seo: {
      title: "SiPo-Einsätze dokumentieren: Leitfaden für die Praxis",
      description:
        "Was zur Dokumentation eines SiPo-Einsatzes gehört: Sicherungsplan, Besetzung, Funktionen, ElBa, Arbeitszeiten, Änderungen und prüfbare Leistungsnachweise.",
      keyword: "SiPo Einsatz dokumentieren",
    },
    content: `<p>Ein Einsatz als Sicherungsposten ist schnell erzählt: Posten steht, warnt, Arbeit läuft. Nachweisen lässt er sich schwerer. Spätestens wenn der Auftraggeber Wochen später nach einer einzelnen Schicht fragt oder eine Abrechnung prüft, zeigt sich, ob die Dokumentation beim Einsatz entstanden ist – oder erst danach aus Erinnerungen zusammengesetzt wird.</p>
<p>Dieser Leitfaden beschreibt, welche Angaben zu einem SiPo-Einsatz gehören, wann sie entstehen und wie sie prüfbar bleiben. Er ersetzt weder das Regelwerk noch die Vorgaben des Auftraggebers; maßgeblich sind die DGUV Vorschrift 78, die Richtlinie 132.0118 der DB InfraGO und die Anordnungen im konkreten Sicherungsplan.</p>

<h2>Was gehört zur Dokumentation eines SiPo-Einsatzes?</h2>
<p>Die Dokumentation beantwortet vier Fragen: Welche Sicherungsmaßnahme galt? Wer war eingesetzt, in welcher Funktion? Wann wurde gearbeitet? Und was davon wurde gegenüber dem Auftraggeber abgerechnet? Dazu gehören typischerweise:</p>
<ul>
<li>der Auftrag mit Auftraggeber, Baustelle, Streckenabschnitt sowie Auftrags- und SAP-Nummer,</li>
<li>der Bezug zum Sicherungsplan, der die Maßnahme festlegt,</li>
<li>die Besetzung: wer als Sicherungsposten, Sicherungsaufsicht oder Bahnübergangsposten eingesetzt war,</li>
<li>Beginn, Ende, Pausen und Fahrtzeiten je Person,</li>
<li>eingesetzte Technik, etwa automatische Warnsysteme mit Anzahl und Meterlänge,</li>
<li>Änderungen gegenüber der Planung – und wer sie wann vorgenommen hat.</li>
</ul>

<h2>Welche Informationen werden vor dem Einsatz benötigt?</h2>
<p>Welche Sicherungsmaßnahme angewendet wird, entscheidet nicht das Sicherungsunternehmen. Nach der Darstellung der DB InfraGO legt die für den Bahnbetrieb zuständige Stelle (BzS) die Maßnahmen fest; präqualifizierte Sicherungsunternehmen planen und führen sie aus. Die Arbeiten dürfen erst beginnen, wenn die festgelegten Maßnahmen umgesetzt sind. Grundlage ist der Sicherungsplan, der vorab eingereicht und freigegeben wird.</p>
<p>Für die Dokumentation heißt das: Der Einsatz sollte von Anfang an mit dem Auftrag und dem Sicherungsplan verbunden sein. Wer die Angaben aus der Leistungsanfrage einmal sauber erfasst, muss sie später nicht aus Mails rekonstruieren.</p>

<h2>Wie werden Mitarbeiter und Qualifikationen zugeordnet?</h2>
<p>Ein Sicherungsposten ist keine Sicherungsaufsicht, ein Bahnübergangsposten kein Bediener. Die Besetzung muss deshalb nicht nur Namen enthalten, sondern die Funktion, in der jemand eingesetzt war. Seit dem 1. Januar 2025 ist nach Angaben der DB InfraGO zudem der elektronische Befähigungsausweis ElBa für Sicherungspersonal verbindlich; ebenfalls seit Anfang 2025 liegt das Mindestalter für Sicherungspersonal nach der DGUV Vorschrift 78 bei 18 statt bisher 21 Jahren.</p>
<p>Praktisch bewährt sich, Funktionen und ElBa-Kennung am Mitarbeiter zu führen und beim Einteilen sichtbar zu haben – statt sie für jede Schicht neu nachzuschlagen. Ebenso wichtig: Abwesenheiten wie Urlaub oder Krankmeldungen gehören in dieselbe Planung, damit niemand eingeteilt wird, der nicht verfügbar ist.</p>

<h2>Wie lassen sich Arbeitszeiten dokumentieren?</h2>
<p>Arbeitszeiten sind der Teil der Dokumentation, der am häufigsten nachträglich entsteht – auf Zetteln im Fahrzeug, in Messenger-Nachrichten, am Monatsende abgetippt. Belastbarer ist es, die Zeiten je Einsatz und Person am Auftrag zu erfassen: Beginn, Ende, Pausen, Fahrtzeit und die Funktion. Nacht- und Sonntagsanteile ergeben sich dann aus den Zeiten selbst und müssen nicht separat nachgerechnet werden.</p>

<h2>Wie werden Änderungen nachvollziehbar festgehalten?</h2>
<p>Pläne ändern sich: Sperrpausen verschieben sich, ein Posten fällt aus, eine Schicht wird verlängert. Entscheidend ist nicht, dass sich nichts ändert, sondern dass erkennbar bleibt, was sich wann geändert hat und wer die Änderung vorgenommen hat. Eine Datei, die überschrieben wird, leistet das nicht. Ein System, das Änderungen protokolliert, schon.</p>
<p>Genauso wichtig ist eine klare Freigabe: Stunden werden geprüft und freigegeben, bevor sie abgerechnet werden. So ist der abgerechnete Stand eindeutig – und von dem Stand unterscheidbar, der noch in Arbeit ist.</p>

<h2>Wie entstehen prüfbare Leistungsnachweise?</h2>
<p>Ein Leistungsnachweis ist prüfbar, wenn jede Zeile auf einen Einsatz, eine Person, eine Funktion und einen Auftrag zurückgeführt werden kann. Das gelingt fast nie, wenn der Nachweis erst am Monatsende zusammengestellt wird. Es gelingt fast immer, wenn er aus den Daten entsteht, die beim Einsatz ohnehin erfasst werden: aus der Besetzung, den erfassten Zeiten und der Freigabe.</p>
<ul>
<li>Jeder Eintrag hängt am Auftrag – nicht in einer getrennten Tabelle.</li>
<li>Die Funktion steht am Eintrag, nicht nur in der Personalakte.</li>
<li>Abgerechnet wird nur, was freigegeben ist.</li>
</ul>

<h2>Wie unterstützt Gleistrix den Prozess?</h2>
<p>Gleistrix führt Auftrag, Besetzung, Zeiten und Abrechnung auf einem Datenstand zusammen:</p>
<ul>
<li>Leistungsanfragen aus dem DB-Lieferantenportal füllen die Projektanlage vor – mit Auftrags- und SAP-Nummer, Baustelle und Zeitraum. Am Projekt lässt sich festhalten, ob ATWS im Einsatz ist, wie viele Anlagen und welche Meterlänge.</li>
<li>In der <a href="/produkt/mitarbeiterverwaltung">Mitarbeiterverwaltung</a> stehen Funktionen wie SIPO, Sakra, BüP oder HiBa, die ElBa-Kennung und Abwesenheiten.</li>
<li>Die <a href="/produkt/kalender-einsatzuebersicht">Plantafel</a> meldet beim Einteilen Doppelbelegungen, Urlaub, Krankmeldungen und Feiertage.</li>
<li>Die <a href="/produkt/zeiterfassung-stundenzettel">Zeiterfassung</a> hält Arbeitszeit, Fahrtzeit und Funktion je Einsatz fest und berechnet Nacht- und Sonntagszuschläge. Der Stundennachweis geht monatlich per E-Mail an Mitarbeiter und Lohnbüro.</li>
<li>Änderungen an Projekten, Mitarbeitern und Zeiten werden in einem Aktivitätsprotokoll mit Nutzer und Zeitpunkt festgehalten; abgerechnet wird nach Freigabe.</li>
</ul>
<p>Wie das im Alltag eines Sicherungsunternehmens zusammenspielt, beschreibt die Seite <a href="/branchen/sicherungsunternehmen">Software für Sicherungsunternehmen</a>.</p>

<h2>Quellen</h2>
<ul>
<li><a href="https://www.dbinfrago.com/web/schienennetz/dienstleistende/arbeitsschutz/arbeiten_im_gleisbereich-11161686">DB InfraGO: Arbeiten im Gleisbereich</a> (Regelwerk, Rolle der BzS, Sicherungsplan, ElBa)</li>
<li><a href="https://bauportal.bgbau.de/bauportal-22025/tiefbau/ueberarbeitete-dguv-vorschriften-77-78">BG BAU: Überarbeitete DGUV Vorschriften 77/78</a> (Mindestalter Sicherungspersonal ab 1. Januar 2025)</li>
<li><a href="https://publikationen.dguv.de/widgets/pdf/download/article/1529">DGUV Vorschrift 78 „Arbeiten im Bereich von Gleisen“</a></li>
</ul>
<p><em>Hinweis: Dieser Beitrag gibt einen praktischen Überblick und ist keine Rechtsberatung. Verbindlich sind das aktuelle Regelwerk und die Vorgaben des Auftraggebers.</em></p>`,
  }),
  seed({
    id: "fahrzeuge-ohne-doppelbelegung",
    slug: "fahrzeuge-und-technik-ohne-doppelbelegung-planen",
    title: "Fahrzeuge und Technik ohne Doppelbelegung planen",
    teaser: "Verfügbarkeiten, Wartung und Einsatzzuordnung an einem Ort zusammenführen.",
    category: "Fuhrpark",
    tags: ["Fuhrpark", "Technik", "Wartung", "Verfügbarkeit"],
    imageSrc: "/fahrzeugplanung.webp",
    imageAlt: "Fahrzeug- und Technikplanung in Gleistrix",
    publishedAt: "2026-06-18T06:00:00.000Z",
    seo: {
      title: "Fahrzeuge und Technik ohne Doppelbelegung planen",
      description:
        "Verfügbarkeit, Wartungsfenster und Einsatzzuordnung in einer Ansicht – so entstehen keine Doppelbelegungen mehr.",
      keyword: "Fahrzeugdisposition Bahnbau",
    },
    content: `<p>Zweiwegebagger, Anhänger und Messtechnik sind knapp. Sobald ihre Belegung getrennt von der Einsatzplanung geführt wird, entstehen Doppelbuchungen – und die fallen am Einsatzmorgen auf.</p>
<h2>Eine Zeitachse für alles</h2>
<p>Fahrzeuge gehören auf dieselbe Zeitachse wie Personal und Projekte. Ein Fahrzeug, das in Wartung steht, ist dann nicht wählbar, statt als frei zu erscheinen.</p>
<h2>Wartung ist Planung</h2>
<p>Prüftermine und Wartungsfenster sind planbare Belegungen, keine Ausnahmen. Wer sie als solche führt, sieht Engpässe Wochen vorher statt am selben Tag.</p>
<ul>
<li>Anstehende Prüfungen als Belegung im Plan.</li>
<li>Zuordnung von Technik zum Einsatz statt zum Mitarbeiter.</li>
<li>Übergaben mit Zustand und Kilometerstand dokumentiert.</li>
</ul>`,
  }),
  seed({
    id: "stunde-zur-x-rechnung",
    slug: "von-der-erfassten-stunde-zur-x-rechnung",
    title: "Von der erfassten Stunde zur Rechnung",
    teaser: "Wie geprüfte Stunden ohne Abtippen in die Projektabrechnung fließen.",
    category: "Abrechnung",
    tags: ["Abrechnung", "Projektabrechnung", "Leistungsnachweis"],
    imageSrc: "/rechnungen.webp",
    imageAlt: "Rechnungsstellung und Abrechnung in Gleistrix",
    publishedAt: "2026-06-11T06:00:00.000Z",
    updatedAt: "2026-09-22T08:00:00.000Z",
    seo: {
      title: "Projektabrechnung: von der Stunde zur Rechnung",
      description:
        "Wie geprüfte Stunden ohne Abtippen in die Projektabrechnung fließen – mit Freigabe, Abrechnung je Tag und Funktion und Übergabe an die Buchhaltung.",
      keyword: "Projektabrechnung Bahnbau",
    },
    content: `<p>Zwischen der erfassten Stunde und der gestellten Rechnung liegen in vielen Betrieben drei Medienbrüche: Stundenzettel, Tabelle, Rechnungsprogramm. Jeder davon kostet Zeit und erzeugt Abweichungen.</p>
<h2>Ein Datensatz, mehrere Sichten</h2>
<p>Die erfasste Leistung ist bereits alles, was die Rechnung braucht: Projekt, Position, Menge, Satz. Der Rechnungsentwurf ist eine Sicht darauf – keine Neueingabe.</p>
<h2>Freigabe vor Abrechnung</h2>
<p>Abgerechnet wird, was geprüft ist. In Gleistrix werden Stunden freigegeben, bevor sie als Abrechnungsposition nach Tag und Funktion in die <a href="/produkt/rechnungsstellung">Projektabrechnung</a> gehen. Die Abrechnung lässt sich als PDF ausgeben, Buchungsdaten und Belege gehen über die DATEV-Anbindung an die Steuerberatung.</p>
<p>Wer an öffentliche Auftraggeber fakturiert, sollte zusätzlich die Vorgaben zur elektronischen Rechnung prüfen – welches Format gefordert ist, legt der Auftraggeber fest.</p>
<ul>
<li>Freigabe der Leistung geht der Rechnung voraus, nicht umgekehrt.</li>
<li>Nachträge bleiben mit ihrem Ursprung verbunden.</li>
<li>Der Rechnungsstand ist jederzeit auf die Stunde zurückführbar.</li>
</ul>`,
  }),
  seed({
    id: "stundenzettel-mobil-erfassen",
    slug: "stundenzettel-mobil-und-prueffaehig-erfassen",
    title: "Stundenzettel mobil und prüffähig erfassen",
    teaser: "Digitale Zeiterfassung senkt Rückfragen und beschleunigt die Freigabe.",
    category: "Zeiterfassung",
    tags: ["Zeiterfassung", "Stundenzettel", "Mobil"],
    imageSrc: "/zeiterfassung.webp",
    imageAlt: "Mobile Zeiterfassung und Stundenzettel",
    publishedAt: "2026-06-04T06:00:00.000Z",
    seo: {
      title: "Stundenzettel mobil und prüffähig erfassen",
      description:
        "Mobile Zeiterfassung im Gleisbau: weniger Rückfragen, schnellere Freigabe und ein Nachweis, der der Prüfung standhält.",
      keyword: "mobile Zeiterfassung Gleisbau",
    },
    content: `<p>Ein Stundenzettel, der erst am Freitag entsteht, ist eine Rekonstruktion. Die Rückfragen, die daraus folgen, kosten in der Verwaltung mehr Zeit als die Erfassung selbst.</p>
<h2>Am Einsatzort erfassen</h2>
<p>Wird die Zeit dort erfasst, wo sie anfällt, stimmen Projekt und Position auf Anhieb. Der Mitarbeiter wählt aus seinen eigenen Einsätzen, statt sie aus dem Gedächtnis zu benennen.</p>
<h2>Freigabe statt Nacherfassung</h2>
<p>Die Bauleitung prüft, was bereits vorliegt, und gibt frei. Was auffällt, geht mit Kommentar zurück – ohne dass jemand einen zweiten Zettel schreibt.</p>
<ul>
<li>Offline nutzbar, weil im Gleisbereich nicht überall Netz ist.</li>
<li>Zuschläge und Pausen nach hinterlegten Regeln statt von Hand.</li>
<li>Freigabestand jederzeit sichtbar – auch für den Mitarbeiter.</li>
</ul>`,
  }),
  seed({
    id: "deckungsbeitrag-pro-projekt",
    slug: "deckungsbeitrag-pro-projekt-sichtbar-machen",
    title: "Deckungsbeitrag pro Projekt sichtbar machen",
    teaser: "Kennzahlen zu Auslastung und Marge in Echtzeit statt am Monatsende.",
    category: "Auswertung",
    tags: ["Auswertung", "Deckungsbeitrag", "Controlling"],
    imageSrc: "/reports.webp",
    imageAlt: "Reports und Auswertungen in Gleistrix",
    publishedAt: "2026-05-28T06:00:00.000Z",
    seo: {
      title: "Deckungsbeitrag pro Projekt sichtbar machen",
      description:
        "Auslastung und Marge je Projekt in Echtzeit statt in der Monatsauswertung – auf Basis erfasster Leistungen und Kosten.",
      keyword: "Deckungsbeitrag Bauprojekt",
    },
    content: `<p>Wer den Deckungsbeitrag erst in der Monatsauswertung sieht, erfährt vom Verlustprojekt, wenn es abgeschlossen ist. Die Zahlen dafür liegen längst vor – sie sind nur nicht zusammengeführt.</p>
<h2>Kosten entstehen im Einsatz</h2>
<p>Personalstunden, Fahrzeugzeiten und Material fallen im Einsatz an. Sind sie dort erfasst, ist die Projektkalkulation eine laufende Rechnung statt einer nachträglichen.</p>
<h2>Früh gegensteuern</h2>
<p>Eine Abweichung in der zweiten Projektwoche lässt sich noch beeinflussen. Dafür braucht es keine tiefe Analyse, sondern einen sichtbaren Sollwert neben dem Ist.</p>
<ul>
<li>Auslastung je Trupp und Woche.</li>
<li>Ist-Kosten gegen kalkulierte Positionen.</li>
<li>Nachträge als eigener Beitrag, nicht als Rauschen.</li>
</ul>`,
  }),
];
