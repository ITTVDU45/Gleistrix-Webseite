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
    ["Abrechnung", "Leistungsnachweis, Nachträge, X-Rechnung und öffentliche Auftraggeber."],
    ["Auswertung", "Auslastung, Deckungsbeitrag, Soll-Ist-Vergleich und Controlling."],
    ["Dokumentation", "Bautagebuch, Fotos, Mängel, Übergaben und revisionssichere Ablage."],
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
- Projektplanung und Disposition: Einsätze, Trupps und Termine auf einer Plantafel,
  mit Prüfung von Qualifikation und Verfügbarkeit schon beim Zuordnen.
- Kalender und Einsatzübersicht: Personal, Fahrzeuge und Projekte auf derselben Zeitachse.
- Mitarbeiterverwaltung: Qualifikationen, Nachweise und Fristen mit Ablaufwarnung.
- Dokumentenmanagement: Bautagebuch, Fotos und Nachweise am Projekt statt im Ordner.
- Fahrzeuge und Technik: Belegung, Wartungsfenster und Prüftermine als planbare Zeiten.
- Zeiterfassung und Stundenzettel: mobil am Einsatzort, auch ohne Netz, mit Freigabelauf.
- Rechnungsstellung: Rechnungsentwurf aus freigegebenen Leistungen, inklusive X-Rechnung.
- Reports und Auswertungen: Auslastung und Deckungsbeitrag je Projekt, laufend statt zum Monatsende.

KI-Agenten: LV-Agent, Dokumentationsagent, Mängel-Agent, Ausschreibungsagent, Abrechnungsagent.

Was Gleistrix NICHT ist: kein Planungsbüro, keine Vermessungssoftware, kein Ersatz für
betriebliche Regelwerke. Fähigkeiten, die oben nicht stehen, werden nicht behauptet.`;

/** Wörter je Minute für die Lesezeit – bewusst konservativ für Fachtexte. */
export const WORDS_PER_MINUTE = 200;

function seed(
  article: Omit<BlogArticle, "createdAt" | "updatedAt" | "status" | "sourceIds" | "generatedByAi">,
): BlogArticle {
  return {
    ...article,
    status: "veroeffentlicht",
    sourceIds: [],
    generatedByAi: false,
    createdAt: article.publishedAt ?? "2026-06-01T08:00:00.000Z",
    updatedAt: article.publishedAt ?? "2026-06-01T08:00:00.000Z",
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
    slug: "sipo-einsaetze-rechtssicher-dokumentieren",
    title: "SIPO-Einsätze rechtssicher dokumentieren",
    teaser: "So entstehen Nachweise für Sicherungsmaßnahmen direkt aus den Projektdaten.",
    category: "Sicherung",
    tags: ["Sicherung", "SIPO", "Dokumentation", "Bahnübergang"],
    imageSrc: "/sicherungsmassnahmen-bahnuebergaenge.webp",
    imageAlt: "Sicherungsmaßnahmen an Bahnübergängen",
    publishedAt: "2026-06-26T06:00:00.000Z",
    seo: {
      title: "SIPO-Einsätze rechtssicher dokumentieren",
      description:
        "Nachweise für Sicherungsmaßnahmen entstehen direkt aus den Projektdaten – ohne Nacherfassung und mit vollständiger Historie.",
      keyword: "SIPO Dokumentation",
    },
    content: `<p>Sicherungsmaßnahmen sind nachweispflichtig. Wer sie nachträglich aus Notizen rekonstruiert, riskiert Lücken genau dort, wo die Prüfung ansetzt.</p>
<h2>Der Nachweis entsteht beim Einsatz</h2>
<p>Wenn Sicherungsposten, Zeitraum und Maßnahme bereits im Einsatz hinterlegt sind, ist der Nachweis ein Nebenprodukt der Planung. Es gibt keinen zweiten Erfassungsschritt, der vergessen werden kann.</p>
<ul>
<li>Wer war wann als SIPO eingeteilt.</li>
<li>Welche Maßnahme galt für welchen Streckenabschnitt.</li>
<li>Welche Qualifikation lag zum Einsatzzeitpunkt vor.</li>
</ul>
<h2>Prüffähig bleiben</h2>
<p>Entscheidend ist die Unveränderlichkeit: Ein Nachweis, der sich nachträglich still ändern lässt, trägt im Zweifel nicht. Eine nachvollziehbare Historie zeigt, wann welcher Stand galt und wer ihn gesetzt hat.</p>`,
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
    title: "Von der erfassten Stunde zur X-Rechnung",
    teaser: "Wie geprüfte Leistungen ohne Abtippen in den Rechnungsentwurf fließen.",
    category: "Abrechnung",
    tags: ["Abrechnung", "X-Rechnung", "Leistungsnachweis"],
    imageSrc: "/rechnungen.webp",
    imageAlt: "Rechnungsstellung und Abrechnung in Gleistrix",
    publishedAt: "2026-06-11T06:00:00.000Z",
    seo: {
      title: "Von der erfassten Stunde zur X-Rechnung",
      description:
        "Geprüfte Leistungen fließen ohne Abtippen in den Rechnungsentwurf – inklusive X-Rechnung für öffentliche Auftraggeber.",
      keyword: "X-Rechnung Bahnbau",
    },
    content: `<p>Zwischen der erfassten Stunde und der gestellten Rechnung liegen in vielen Betrieben drei Medienbrüche: Stundenzettel, Tabelle, Rechnungsprogramm. Jeder davon kostet Zeit und erzeugt Abweichungen.</p>
<h2>Ein Datensatz, mehrere Sichten</h2>
<p>Die erfasste Leistung ist bereits alles, was die Rechnung braucht: Projekt, Position, Menge, Satz. Der Rechnungsentwurf ist eine Sicht darauf – keine Neueingabe.</p>
<h2>X-Rechnung ohne Zusatzarbeit</h2>
<p>Öffentliche Auftraggeber verlangen strukturierte Rechnungen. Sind Leitweg-ID und Positionsdaten am Projekt hinterlegt, entsteht das Format beim Erzeugen der Rechnung mit.</p>
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
