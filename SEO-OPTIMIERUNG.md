# SEO-Optimierung Gleistrix.de

Stand: 22.09.2026 · Branch `feat/seo-optimierung`

Dieser Bericht dokumentiert, was vorgefunden, geändert, geprüft und offen gelassen wurde. Er unterscheidet durchgehend zwischen **geprüft** (im Repository, im Build oder im Browser nachvollzogen) und **Empfehlung** (braucht externe Daten oder eine Entscheidung).

---

## 1. Ausgangssituation

### Technik
Next.js 15 (App Router), Tailwind 4, Deployment auf Vercel. Marketingseiten werden statisch vorgerendert (SSG), Blog und Sitemap per ISR (10 Minuten), `/preise` serverseitig.

**Bereits vorhanden und korrekt umgesetzt:**

| Bereich | Befund |
|---|---|
| Metadata API | `lib/seo-metadata.ts` → `pageMetadata()` mit Title, Description, Canonical, Open Graph, Twitter für alle öffentlichen Seiten |
| Canonical-Domain | `https://www.gleistrix.de` in `lib/constants.ts`; Weiterleitung `gleistrix.de → www` in `next.config.ts`; Slash-Varianten leiten per 308 auf die Fassung ohne Schrägstrich |
| robots.txt | `app/robots.ts`: alles erlaubt, `/admin` und `/api` gesperrt, Sitemap verlinkt. Der Admin-Schutz sitzt zusätzlich in der Middleware – robots.txt ist nicht der einzige Schutz |
| XML-Sitemap | `app/sitemap.ts`: statische Seiten, Module, Branchen, Integrationen (ohne kanonisierte Duplikate), Blogartikel; weitergeleitete Landingpages bewusst ausgenommen |
| Strukturierte Daten | Organization und WebSite (Root-Layout), BreadcrumbList (Katalog- und Blogseiten), FAQPage (Startseite, Katalogseiten), Article (Blog), SoftwareApplication mit echtem Preis (nur `/preise`) |
| Redirects | `/erp-bahnbau → /`, `/disposition-bahnbau → /produkt/projektplanung-disposition`, `/software-sicherungsunternehmen → /branchen/sicherungsunternehmen` (Konsolidierung doppelter Suchintentionen, bereits vor dieser Runde) |
| Bilder | `next/image` mit AVIF/WebP, `sizes`, `priority` für Hero-Motive |

**Gefundene Probleme (Auswahl):**

1. **H1 der Startseite:** Im ausgelieferten HTML lautete sie „Du sparst dir Planungschaos Zettelchaos Doppelarbeit Papierkram … ERP Software für Bahnbau: …“. `aria-hidden` blendet die rotierenden Wörter nur für Screenreader aus, nicht für Google.
2. **Schablonen-Überschriften:** Die Katalogvorlage erzeugte für Branchen Sätze wie „So arbeitest du mit Sicherungsunternehmen“ und „Was sich mit Sicherungsunternehmen ändert“. Die H1 war immer nur der Menütitel („Sicherungsunternehmen“).
3. **Doppelte Marke:** Der Social-Titel der Startseite lautete „… | Gleistrix | Gleistrix“.
4. **Blogartikel ohne Marke im Title:** Die Blog-Übersicht setzte ihren Titel als String und unterbrach damit die Vorlage für die Artikelseiten.
5. **Funktionsversprechen ohne Produktbeleg.** Der Abgleich mit der Produkt-Codebasis (`~/Desktop/Gleistrix/Gleistrix`, Stand 21.09.2026) ergab zahlreiche Aussagen ohne Implementierung – siehe Abschnitt 2.2.
6. **„Echte Zahlen aus echten Bahnprojekten“:** Die Kennzahlen der Fallstudien sind laut Quellkommentar „Platzhalter und vor dem Livegang durch belegte Werte zu ersetzen“ – standen aber live unter dieser Überschrift.

---

## 2. Durchgeführte Änderungen

### 2.1 Geänderte Dateien

| Datei | Änderung |
|---|---|
| `app/page.tsx` | Title „ERP-Software für Bahnbau & Bahndienstleister \| Gleistrix“, neue Meta-Description |
| `components/landing/Hero.tsx` | Feste, sichtbare H1 „ERP-Software für Bahnbau und Bahndienstleister“; Wortrotation („Du sparst dir …“) aus der H1 in eine eigene Zeile verschoben, Animation bleibt; neuer Beschreibungstext; Badge präzisiert |
| `components/landing/FoxShowcase.tsx` | `priority` auch für Platzhalter-Slides mit demselben LCP-Bild (behebt Next-Warnung „LCP ohne priority“) |
| `lib/seo-metadata.ts` | Keine doppelte Marke im OG-/Twitter-Titel |
| `data/catalog.ts` | Neue optionale Felder: `h1`, `headings` (eigene Überschriften je Seite), `details` (Fachtext-Abschnitte); Katalogkopf mit Vorlagen `challengesHeading`, `stepsHeading`, `faqHeading` |
| `components/catalog/CatalogDetail.tsx` | Rendert H1, Überschriften und den neuen Fachtext-Abschnitt |
| `data/industries.ts` | Sicherungsunternehmen, Gleisbauunternehmen, Gleisbausicherung & Bauüberwachung neu geschrieben; Subunternehmen der DB und Auftragsbasierte Dienstleister korrigiert, alle mit eigener H1 |
| `data/modules.ts` | Alle 9 Module: eigenes Keyword, Title, Description, H1, verifizierter Funktionsumfang, Querverweise auf Fachartikel |
| `data/integration-pages.ts` | GAEB und Deutsche Bahn neu geschrieben; H1 für GAEB, Deutsche Bahn, DATEV, Microsoft 365 |
| `components/landing/WorkflowSection.tsx` | 6 Schritte nach Vorgabe, jeder mit Link auf das Modul |
| `components/landing/AudienceSection.tsx`, `MobileAudienceCarousel.tsx` | Karten für Sicherungs- und Gleisbauunternehmen mit Link zur Landingpage, Rollenkarten mit Link zum Modul, Textlinks zu den übrigen Branchen |
| `components/landing/CaseStudiesSection.tsx`, `data/caseStudies.ts` | Überschrift „So sieht der Alltag mit Gleistrix aus“, sichtbarer Hinweis „Beispielwerte, keine Messungen einzelner Kunden“; Texte auf vorhandene Funktionen korrigiert |
| `data/faqs.ts` | Startseiten-FAQ (auch FAQPage-JSON-LD) auf vorhandene Funktionen korrigiert |
| `data/landingModules.ts` | Standardinhalt des Modul-Karussells korrigiert |
| `data/blog.ts` | SIPO-Artikel als Fachartikel neu geschrieben, X-Rechnung-Artikel korrigiert, KI-Kontext für die Artikelgenerierung auf den belegten Funktionsumfang umgestellt |
| `types/blog.ts`, `lib/admin/blog/store.ts`, `app/blog/[slug]/layout.tsx` | Neues Feld `modified` → `dateModified` im Article-Markup und `lastmod` in der Sitemap |
| `app/blog/layout.tsx` | Title-Vorlage, damit Artikel wieder „\| Gleistrix“ tragen |
| `app/sitemap.ts` | `CONTENT_REVISION` 2026-09-22, `/blog` und `/ueber-uns` mit lastmod |
| `app/(marketing)/branchen/page.tsx`, `app/produkt/page.tsx`, `app/(marketing)/impressum/page.tsx` | Zu lange Titel gekürzt, zu kurze Description verlängert |
| `app/produkt/page.tsx`, `app/produkt/features.ts`, `app/blog/page.tsx`, `app/(marketing)/ueber-uns/page.tsx`, `app/(marketing)/integrationen/page.tsx`, `components/sections/FeaturesAccordion.tsx`, `components/landing/SecurityIntegrations.tsx`, `components/landing/ModuleVisual.tsx`, `data/heroSlides.ts` | Unbelegte Aussagen (X-Rechnung, revisionssicher, „rechtssicher für Auftraggeber“) entfernt |
| `scripts/seo-check.mjs`, `package.json` | Neuer SEO-Test gegen das gebaute HTML (`npm run check:seo`) |

Keine URL wurde gelöscht, umbenannt oder weitergeleitet.

### 2.2 Abgleich der Funktionsaussagen mit dem Produkt

Grundlage: Quellcode der Produkt-Codebasis (Modelle, API-Routen, Komponenten). **Entfernt oder korrigiert**, weil nicht implementiert:

| Aussage auf der Website | Befund im Produkt |
|---|---|
| X-Rechnung (40 Stellen) | Keine XRechnung-/ZUGFeRD-Erzeugung; Abrechnung als PDF (jsPDF) |
| Qualifikationen und Tauglichkeiten mit Fristenwarnung; „schlägt nur Personal mit gültigem Nachweis vor“ | `Employee` hat Funktionen (`position`) ohne Gültigkeitsdatum. Ablauf-Status gibt es **nur für Nachweise von Nachunternehmern** |
| Sperrpausen und Bauabschnitte als eigene Objekte | Kein Sperrpausen-Modell (nur im Text-Matching des LV-Agenten) |
| GAEB-Ausgabe / Angebot im GAEB-Format zurückgeben | Nur Import, Validierung, Auswertung – kein GAEB-Writer |
| Revisionssichere Ablage, Versionen und Freigaben von Dokumenten | Keine Dokumentversionierung, kein Nachweis einer revisionssicheren Archivierung |
| Material projektbezogen, Reservierungen, Entnahmen in der Abrechnung | Ausgabe an Personen mit geplanter Rückgabe; keine Projektzuordnung |
| HU-/UVV-Fristen an Fahrzeugen | Wartungstermine (TÜV, Prüfung, Kalibrierung) an Lagerartikeln; Fahrzeuge mit Kilometer, Schäden, Status, Tageskosten |
| Mobile Zeiterfassung durch das Team, Einsätze mobil abrufen | Keine Mitarbeiter-App belegt (mobil: nur die Lager-App) |
| Auswertungen als Datei exportieren | Kein Export in den Statistiken belegt |
| Meilensteine, Aufgaben | Nicht im Projektmodell |

**Neu aufgenommen**, weil belegt und bisher nicht beworben: Projektanlage aus DB-Leistungsanfragen per KI (Link/PDF), ATWS-Einsatz mit Anzahl und Meterlänge, ElBa-Kennung am Mitarbeiter, Funktionen SIPO/Sakra/BüP/HiBa/SAS/HFE/Bahnerder, Konfliktprüfung (Doppelbelegung, Urlaub, Krankheit, Feiertag je Bundesland), Plantafel mit Tages-/Wochen-/Monats-/Jahresansicht und Besprechungen, Nacht- und Sonntagszuschläge, monatlicher Stundennachweis per E-Mail, Nachunternehmer-Portal (Nachweise mit Ablaufstatus, Bestellscheine mit digitaler Unterschrift, Rechnungen, Mahnungen, Tagessätze), mobile Lager-App mit QR-Code, Projektmarge in der Finanzübersicht, Aktivitätsprotokoll, DATEV-Buchungsdatenexport und Belegübertragung, Microsoft 365 (Outlook, OneDrive, SharePoint, Teams).

---

## 3. Keyword-Mapping

Jede Seite hat eine primäre Suchintention. Die Keywords sind redaktionelle Zuordnungen aus dem Briefing und der Wettbewerbsanalyse – **keine gemessenen Suchvolumina**.

| URL | Hauptkeyword | Nebenkeywords | SEO-Title | H1 |
|---|---|---|---|---|
| `/` | ERP Software Bahnbau | ERP Software Bahndienstleister, Bahnbau Software | ERP-Software für Bahnbau & Bahndienstleister \| Gleistrix | ERP-Software für Bahnbau und Bahndienstleister |
| `/branchen` | Branchensoftware Gleisbau | Bahnsicherung Software | Branchensoftware für Gleisbau & Bahnsicherung \| Gleistrix | Branchen, die auf Gleistrix vertrauen |
| `/branchen/sicherungsunternehmen` | Software für Sicherungsunternehmen | SiPo Einsatzplanung, SaKra Einsatzplanung, Sicherungsposten disponieren, Personalplanung Bahnsicherung | Software für Sicherungsunternehmen & SiPo-Planung \| Gleistrix | Software für Sicherungsunternehmen: SiPo-Einsätze digital planen |
| `/branchen/gleisbausicherung-bauueberwachung` | Software Gleisbausicherung | Bauüberwachung Bahn Software, Nachunternehmer Nachweise | Software für Gleisbausicherung & Bauüberwachung \| Gleistrix | Software für Gleisbausicherung und Bauüberwachung |
| `/branchen/gleisbauunternehmen` | Gleisbau Software | Einsatzplanung Gleisbau, Ressourcenplanung Bahnbau, Projektabrechnung Bahnbau | Gleisbau-Software für Planung & Abrechnung \| Gleistrix | Gleisbau-Software für Baustellen, Ressourcen und Abrechnung |
| `/branchen/subunternehmen-db` | Software Subunternehmen Deutsche Bahn | DB Leistungsanfrage, SAP-Nummer | Software für Subunternehmen der DB \| Gleistrix | Software für Subunternehmen der Deutschen Bahn |
| `/branchen/auftragsbasierte-dienstleister` | Software auftragsbasierte Dienstleister | Auftragsverwaltung Bahn | Software für auftragsbasierte Bahndienstleister \| Gleistrix | Software für auftragsbasierte Bahndienstleister |
| `/produkt` | ERP Plattform Bahnbau | Bahnprojektmanagement Software | ERP-Plattform für Bahnbau – alle Module im Überblick \| Gleistrix | Das All-in-One-ERP für sichere Bahnprojekte |
| `/produkt/projektplanung-disposition` | Einsatzplanung Bahnbau | Dispositionssoftware Bahn, Personaldisposition Gleisbau, Truppplanung | Einsatzplanung & Disposition für den Bahnbau \| Gleistrix | Projektplanung und Disposition für Bahnbau und Gleisbau |
| `/produkt/kalender-einsatzuebersicht` | Digitale Plantafel Bahnbau | Schichtplanung Sicherungsunternehmen | Digitale Plantafel für Bahnbau & Gleisbau \| Gleistrix | Digitale Plantafel für Einsätze, Schichten und Trupps |
| `/produkt/mitarbeiterverwaltung` | Mitarbeiterverwaltung Bahndienstleister | Qualifikationsmanagement Bahn, Fristenmanagement Nachweise | Mitarbeiterverwaltung für Bahndienstleister \| Gleistrix | Mitarbeiterverwaltung für Bahndienstleister |
| `/produkt/fahrzeug-technik` | Fahrzeugdisposition Bahnbau | Fuhrparkverwaltung Bahndienstleister | Fahrzeugdisposition & Fuhrpark für den Bahnbau \| Gleistrix | Fahrzeuge und Technik für Bahnbaustellen disponieren |
| `/produkt/lagerverwaltung` | Sicherungstechnik verwalten | Geräteverwaltung Gleisbau, Materialverwaltung | Lagerverwaltung für Material & Sicherungstechnik \| Gleistrix | Lagerverwaltung für Material, Geräte und Sicherungstechnik |
| `/produkt/zeiterfassung-stundenzettel` | Zeiterfassung Bahnbau | Stundenzettel Sicherungsunternehmen, Leistungsnachweis | Zeiterfassung & Stundennachweise für den Bahnbau \| Gleistrix | Zeiterfassung und Stundennachweise für Bahndienstleister |
| `/produkt/dokumentenmanagement` | Digitale Baustellendokumentation | Dokumentenmanagement Bahnprojekte | Dokumentenmanagement für Bahnprojekte \| Gleistrix | Dokumentenmanagement für Bahnprojekte und Baustellen |
| `/produkt/rechnungsstellung` | Projektabrechnung Bahnbau | Rechnungsstellung Bahndienstleister | Projektabrechnung & Rechnungsstellung im Bahnbau \| Gleistrix | Projektabrechnung für Bahndienstleister |
| `/produkt/reports-auswertungen` | Projektcontrolling Bahnbau | Marge je Projekt | Projektcontrolling & Reports für Bahnprojekte \| Gleistrix | Reports und Projektcontrolling für Bahnprojekte |
| `/integrationen/gaeb` | GAEB Software Bahnbau | GAEB Import, LV prüfen | GAEB-Import & LV-Prüfung für den Bahnbau \| Gleistrix | GAEB-Import für Bahnbau und Gleisbau |
| `/blog/sipo-einsaetze-rechtssicher-dokumentieren` | SiPo Einsatz dokumentieren | Leistungsnachweis SiPo, ElBa | SiPo-Einsätze dokumentieren: Leitfaden für die Praxis \| Gleistrix *(nach Übernahme in die Datenbank, siehe 7)* | SiPo-Einsätze nachvollziehbar dokumentieren: ein Leitfaden für Sicherungsunternehmen |

Bewusst **nicht** verwendet, weil ohne Produktbeleg: Bautagesbericht Software, Aufmaß Software, XRechnung, Sperrpausenoptimierung als Funktion, Tauglichkeiten überwachen.

---

## 4. Neue und verbesserte Inhalte

**Startseite.** Die H1 nennt das Hauptthema. Der Workflow erklärt die 6 Schritte aus dem Briefing (Projekt → Ressourcen → Einsätze bereitstellen → Dokumentieren → Prüfen und abrechnen → Auswerten), jeder mit Link zum Modul. Die Zielgruppenkarten verlinken zwei Branchenseiten und vier Module, dazu kommen Textlinks zu den übrigen Branchen. Die Fallstudien sind als Beispielszenarien gekennzeichnet.

**Sicherungsunternehmen.** Aufbau entlang des Ablaufs: warum die Planung aufwendig ist → Mitarbeiter und Funktionen (inkl. ElBa) → Einsätze und Schichten → Einsatzinformationen → Arbeitszeiten und Leistungsnachweise → Abrechnung. Dazu der Ablauf „So funktioniert die Einsatzplanung für Sicherungsunternehmen mit Gleistrix“ und 5 FAQ (u. a. DB-Leistungsanfrage). Rund 1.250 Wörter im HTML, vorher etwa 160 Wörter Kerntext.

**Gleisbauunternehmen.** Eigene Perspektive: LV-Import und KI-Auswertung → Trupps und Fahrzeuge → Material und Prüftermine → Abrechnung und Marge je Baustelle. Keine inhaltliche Überschneidung mit der Sicherungsseite.

**Überschneidung Sicherungsunternehmen / Gleisbausicherung & Bauüberwachung.** Die Seiten bedienen unterschiedliche Intentionen und wurden deshalb **differenziert statt zusammengelegt**:
- *Sicherungsunternehmen* = Personaldisposition (wer steht wann wo, Funktionen, Konflikte, Stunden).
- *Gleisbausicherung & Bauüberwachung* = Sicherungsprojekt als Ganzes (Leistungsverzeichnis, Nachunternehmer mit Nachweisen, Dokumente, Marge).

Beide Seiten verweisen aufeinander, und die FAQ der Gleisbausicherungsseite erklärt die Abgrenzung. Ob beide Seiten Impressionen für getrennte Suchanfragen bekommen, lässt sich erst mit Search-Console-Daten beurteilen (siehe 7).

**Module.** Jedes Modul hat ein eigenes Keyword, eine H1 mit Branchenbezug und Querverweise auf eine Branche, ein Nachbarmodul oder eine Integration und einen Fachartikel. Die Mitarbeiterverwaltung bekommt die Abschnitte „Qualifikationen und Funktionen im Bahnbetrieb“ und „Fristenmanagement für Nachweise von Nachunternehmern“. Eine separate Landingpage zum Qualifikationsmanagement wurde **nicht** angelegt: Ohne Gültigkeitsdaten für eigene Mitarbeiter fehlt der Funktionsumfang für eine eigenständige Seite.

**Fachartikel SIPO.** Neu gegliedert nach den 7 Fragen aus dem Briefing, mit Quellen (DB InfraGO, BG BAU, DGUV Vorschrift 78) und dem Hinweis „keine Rechtsberatung“. „Rechtssicher“ steht nicht mehr als Versprechen im Titel, die URL bleibt erhalten.

**Content-Roadmap (noch nicht umgesetzt, Priorität nach Produktpassung):**
1. SiPo und SaKra: Aufgaben und Unterschiede (Ratgeber, verlinkt auf Sicherungsunternehmen)
2. Excel-Planung durch eine digitale Plantafel ersetzen (vorhandenen Artikel „Plantafel statt Excel“ ausbauen)
3. Nachweise von Nachunternehmern im Griff behalten (belegte Funktion, bisher kein Artikel)
4. DB-Leistungsanfragen schneller in Projekte übernehmen
5. Digitale Leistungsnachweise im Bahnbau
6. Projektabrechnung für Bahndienstleister (vorhandenen Artikel ausbauen)
7. Qualifikationsmanagement in der Bahnsicherung – erst, wenn Gültigkeitsdaten im Produkt existieren

---

## 5. Technische SEO-Ergebnisse

| Bereich | Status | Art |
|---|---|---|
| Rendering | Title, Description, H1, Hauptinhalt, interne Links und JSON-LD stehen im initialen HTML aller 43 vorgerenderten Seiten | geprüft (Build + `check:seo`) |
| Metadaten | Eindeutige Titles (≤ 70 Zeichen) und Descriptions (70–170 Zeichen) auf allen indexierbaren Seiten | geprüft (`check:seo`) |
| H1 | Genau eine H1 je Seite; Startseite ohne rotierende Wörter | geprüft (`check:seo`, Browser) |
| Canonicals | Alle auf `https://www.gleistrix.de`, ohne Schrägstrich am Ende | geprüft (`check:seo`) |
| www / HTTPS | `https://gleistrix.de → www` per 308 (next.config); `http://gleistrix.de` → `https://gleistrix.de` → `www` = **zwei Sprünge** | live geprüft (curl); Behebung siehe 7 |
| Sitemap | 34 Einträge (nach Nachtrag), alle kanonisch, indexierbar und erreichbar, keine Admin-/API-URLs; lastmod aktualisiert | geprüft (`check:seo`) |
| robots.txt | Öffentlich crawlbar, `/admin` und `/api` gesperrt, Sitemap verlinkt | geprüft (live + Build) |
| Strukturierte Daten | Organization, WebSite, BreadcrumbList, FAQPage, Article (jetzt mit `dateModified`), SoftwareApplication (`/preise`); alle Blöcke parsebar | Parsing geprüft; Rich-Results-Test **extern ausstehend** |
| Interne Links | Keine Links ins Leere; Startseite → Branche → Modul → Fachartikel verknüpft | geprüft (`check:seo`) |
| Bilder | LCP-Bild mit `priority`; bestehende Alt-Texte beibehalten | geprüft (Browser-Konsole) |
| Mobile | 375 px ohne horizontales Scrollen, Hero lesbar | geprüft (Browser) |
| Core Web Vitals | Labormessung am 22.09.2026, siehe 5.1. Felddaten (CrUX) liegen für gleistrix.de noch nicht vor | Labor gemessen; Felddaten ausstehend |

### 5.1 Messungen (Nachtrag 22.09.2026)

Lighthouse und Performance-Trace im lokalen Chrome gegen die Live-Seite, mobil emuliert (412 px, Slow 4G, CPU 4× gedrosselt). Laborwerte, keine Felddaten.

| Seite | LCP | CLS | Lighthouse (Barrierefreiheit / Best Practices / SEO) |
|---|---|---|---|
| `/` | 1,39 s | 0,00 | 100 / 100 / 100 |
| `/branchen/sicherungsunternehmen` | 2,32 s | 0,00 | 100 / 100 / 100 |

**Befund Katalog- und Übersichtsseiten:** 1,1 s der LCP-Zeit waren Render-Verzögerung. Der Seitenkopf steckte in `Reveal`, das serverseitig mit `opacity: 0` rendert; Chrome zählt unsichtbare Elemente nicht für den LCP. Zusätzlich lud das Hero-Bild ohne `fetchpriority="high"`. **Behoben** in `CatalogDetail` (23 Seiten) und `PageHero` (7 Übersichtsseiten), Hero-Bilder mit `fetchPriority="high"` (auch Blogartikel). Gegenmessung lokal mit Produktions-Build: Render-Verzögerung 157 ms statt 1.104 ms, LCP 0,77 s (lokaler Server, daher nicht direkt mit dem Live-Wert vergleichbar). Nach dem Deploy erneut live messen.

**Weitere Befunde:** Lighthouse „Agentic Browsing“ auf der Startseite: Folien im Modul-Karussell waren `<article role="group">` – jetzt `<div role="group">`. Übersichtsseiten: H1 an der Suchabsicht ausgerichtet („Branchensoftware für Gleisbau, Bahnsicherung und Bahndienstleister“ statt „Branchen, die auf Gleistrix vertrauen“; `/produkt` und `/integrationen` entsprechend).

**Bewusst nicht geändert:** SoftwareApplication bleibt nur auf `/preise`. Auf anderen Seiten fehlte der Preis, und derselbe `@id`-Knoten mit und ohne `offers` wäre ein Widerspruch (Begründung steht in `app/layout.tsx`).

---

## 6. Testergebnisse

| Test | Ergebnis |
|---|---|
| `npx tsc --noEmit` | ohne Fehler |
| ESLint auf allen geänderten Dateien | 0 Fehler, 1 Warnung (bereits vorhanden: `store.ts:79` unbenutztes `_key`) |
| `npm run build` | erfolgreich |
| `npm run check:seo` (neu) | **bestanden** – 43 Seiten, 36 Sitemap-Einträge; 6 Hinweise zu Blog-Inhalten aus der Datenbank (siehe 7) |
| 15 vorhandene Selbsttests (`*.check.ts`) | alle bestanden |
| Browser (Desktop 1440 px, Mobil 375 px) | Startseite und Sicherungsunternehmen geprüft: H1, Überschriften, Links, Fachtext-Layout; keine Konsolenfehler |

`check:seo` prüft das gebaute HTML auf: Title und Länge, Description und Länge, Canonical, genau eine H1 (mit Sollwert für Startseite, Sicherungs- und Gleisbau-Seite), parsebares JSON-LD, tote interne Links, doppelte Titles und Descriptions, Sitemap-Einträge, robots.txt und unbelegte Aussagen (X-Rechnung, revisionssicher, Tauglichkeit).

---

## 7. Offene Aufgaben

### Entscheidungen (höchste Priorität – rechtliches und vertriebliches Risiko)

1. **Blogartikel in der Datenbank aktualisieren.** Die Blogartikel liegen in MongoDB, nicht in `data/blog.ts` – die Ablage ist bereits befüllt. Live stehen deshalb weiterhin „SIPO-Einsätze rechtssicher dokumentieren“ (kurze Fassung) und „Von der erfassten Stunde zur X-Rechnung“. Die neuen Fassungen liegen in `data/blog.ts` und müssen unter `/admin/blog` übernommen werden. In die Produktionsdatenbank wurde bewusst nicht geschrieben.
2. **Integrationsseiten ohne Produktbeleg – erledigt (Nachtrag 22.09.2026):** lexoffice, sevdesk, Stripe, PayPal, Agenda, Telegram, Cal.com, Calendly, Indeed und StepStone stehen jetzt mit `unlisted: true` in `data/integration-pages.ts`. Sie bleiben unter ihrer URL erreichbar, erscheinen aber nicht mehr in Megamenü, Übersicht, Verweisleisten und Sitemap und sind auf `noindex` gesetzt. Gelistet sind nur GAEB, Deutsche Bahn, DATEV und Microsoft 365. Noch offen:
   - **Logo-Leiste der Startseite – erledigt:** zeigt nur noch die vier belegten Anbindungen als ruhige Reihe; jedes Logo verlinkt auf seine Integrationsseite. Die Liste folgt `INTEGRATION_CATALOG`, das Endlosband samt CSS ist entfernt.
   - **Preisseite – Standard bereinigt, Live-Stand offen:** Im Standard (`DEFAULT_PRICING` in `data/pricing.ts`) stehen nur noch GAEB, Deutsche Bahn, Microsoft 365, DATEV und „Individuelle Schnittstelle“; die Kategorie „Recruiting“ entfällt. `/preise` zeigt aber die **veröffentlichte Fassung aus der Datenbank** – dort stehen sevdesk, Stripe, Cal.com, Calendly, Indeed, StepStone und Telegram, bis sie unter `/admin/pakete` gelöscht und die Preise neu veröffentlicht werden.
3. **KI-Agenten-Abschnitt der Startseite – erledigt (Nachtrag 22.09.2026):** Der Abschnitt nennt nur noch KI-Funktionen, die im Produkt laufen: LV-Agent (GAEB-Auswertung und Fragen an das LV), Übernahme von DB-Leistungsanfragen, Beleg-Erfassung und Finanzbericht. Dokumentations-, Mängel-, Ausschreibungs- und Abrechnungsagent sind entfernt – im Produkt sind sie Mock-Daten ohne Backend. Die Beispielausgabe ist als „Beispielanalyse“ gekennzeichnet und zeigt, was die LV-Auswertung tatsächlich liefert. Noch offen: Das Zusatzmodul „KI-Agenten“ auf der Preisseite (`data/pricing.ts`) verspricht u. a. „Projekt- und Mängeldokumentation vorbereiten“ – Angebotsentscheidung.
4. **Kundenstimmen:** Referenz-Kacheln (13 Personen) auf der Startseite und Testimonials mit 5 Sternen auf `/demo-buchen` – ob es echte Kunden mit Einwilligung sind, ist im Repository nicht belegbar. Nicht belegte Bewertungen sind nach UWG unzulässig. Bitte prüfen und belegen oder entfernen.
5. **Fallstudien:** Sind jetzt als Beispielwerte gekennzeichnet. Sobald echte Einführungen vorliegen: Fallstudie mit Ausgangslage, Unternehmensgröße, Funktionsumfang, Messzeitraum und Ergebnis.
6. **Modul-Karussell der Startseite:** Der Standardinhalt ist korrigiert. Wurde er im Adminbereich überschrieben, gilt dort noch der alte Text (Tauglichkeiten, revisionssicher) – unter `/admin/module` prüfen.

### Braucht externe Werkzeuge oder Zugänge

7. **Weiterleitungskette** `http://gleistrix.de → https://gleistrix.de → https://www.gleistrix.de`: In Vercel `www.gleistrix.de` als Primärdomain setzen und die Apex-Domain direkt auf `https://www` umleiten lassen (ein Sprung).
8. **Google Search Console:** Der hier verbundene Search-Console-Zugang enthält gleistrix.de nicht – Zugriff für die Property freigeben, dann lassen sich Suchanfragen und Indexierung auswerten. Indexierungsstatus aller URLs, Sitemap neu einreichen, Suchanfragen je Landingpage auswerten – insbesondere, ob `/branchen/sicherungsunternehmen` und `/branchen/gleisbausicherung-bauueberwachung` unterschiedliche Anfragen bedienen.
9. **Rich Results Test** für Startseite, eine Branchen-, eine Modul- und eine Blogseite.
10. **Core Web Vitals:** Labordaten liegen vor (5.1). Für PageSpeed Insights per API fehlt ein API-Schlüssel (anonymes Kontingent 0). Nach dem Deploy Startseite, eine Branchenseite und einen Blogartikel mobil und am Desktop erneut messen; Felddaten aus CrUX auswerten, sobald genug Besuche vorliegen.
11. **Suchvolumen und Wettbewerb** für die Keyword-Cluster (Keyword Planner oder SEO-Tool) – die Zuordnung in Abschnitt 3 ist eine redaktionelle Arbeitshypothese.
12. **Conversion-Tracking** für Demo-Anfragen (Analytics mit Einwilligung).
13. **Produktseitig:** Gültigkeitsdaten für Mitarbeiter-Qualifikationen (inkl. Warnung) würden „Qualifikationsmanagement Bahn“ als eigenständige Landingpage tragen – heute fehlt dafür die Funktion.

### Hinweise für die Pflege

- Neue Funktionsaussagen nur mit Beleg im Produkt. `npm run check:seo` meldet die häufigsten unbelegten Begriffe automatisch.
- Wer Katalogseiten inhaltlich ändert, hebt `CONTENT_REVISION` in `app/sitemap.ts`.
- Der KI-Kontext für neue Blogartikel (`GLEISTRIX_CONTEXT` in `data/blog.ts`) enthält eine Liste nicht vorhandener Funktionen – bei neuen Produktfunktionen dort nachziehen.
