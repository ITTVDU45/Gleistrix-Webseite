# Medienplan: Platzhalter → Fuchs-Bilder & Motion Graphics

Stand: 17.09.2026 · Status: **Entwurf – wartet auf Freigabe**

Ziel: Alle SVG-Platzhalter der Website durch Higgsfield-Bilder und -Loops mit dem
Gleistrix-Fuchs ersetzen. Dazu kommen Motion Graphics im Code, damit die Seite
lebendiger wirkt – ohne Einbußen bei Ladezeit und Barrierefreiheit.
Außerdem fliegt „KI-Agenten“ aus der Hauptnavigation.

---

## 1. Bestand

| Was | Wo | Nutzen |
|---|---|---|
| Higgsfield-Element `gleistrix-fox` (`49763b61-92d9-4ecf-a02d-57b28db5e0db`), Status *completed* | Higgsfield-Workspace | Charakter-Konsistenz über `<<<element_id>>>` im Prompt |
| Referenzen `fuchs_front.png` (`e9111fc4…`), `fuchs_seite.png` (`893e648f…`) | `GleistrixVideo/img/Main Character/konsistenterCharackter/` | Master-Look, zusätzlich als `image_references` |
| 14 fertige Fuchs-Clips (5–10 s, 720p/1080p) | `GleistrixVideo/gleistrix-video/assets/video/` | Wiederverwendung ohne Credits (eher dunkler Look) |
| Charakter-Analyse (Farben, Proportionen, typische Abweichungen) | `GleistrixVideo/entwurf/_analyse/fox.json` | Grundlage für die Stilvorgaben unten |
| 33 Platzhalter-SVGs, davon 29 eingebunden, 4 ungenutzt (`seo-*.svg`) | `public/placeholders/` | werden ersetzt bzw. gelöscht |
| Credits | Higgsfield-Account (Plan: Ultra) | **2.381** verfügbar |

Alle Platzhalter laufen durch zwei Komponenten (`MediaFrame`, `CardMedia`) und den
Motivpool `lib/placeholders.ts`. Ein Wechsel ist daher meist nur ein Pfadtausch.

---

## 2. Stilvorgaben

### Fuchs (steht in jedem Prompt, nie abwandeln)

```
<<<49763b61-92d9-4ecf-a02d-57b28db5e0db>>> the Gleistrix fox mascot: 3D Pixar-style
anthropomorphic fox, electric-blue fur (#2A3AD6) with violet ear tips, crest and tail
(#4A20DE), white muzzle and chest, large cyan-blue eyes, thick dark eyebrows, dark navy
tech-wear zip jacket with glowing blue LED piping, grey reflective waist band, white
Gleistrix emblem on left chest, black belt with metal buckle, navy cargo pants, black
sneakers with glowing blue soles, oversized bushy tail with a glowing silver rail track
(dark sleepers with blue light inlays) winding along it in an S-curve, 3–3.5 heads tall.
```

Pflicht: Der Gleis-Schweif ist in jedem Motiv zu sehen. Der Fuchs trägt keinen
Helm und keine orange Warnweste (die tragen nur Menschen im Hintergrund).
Proportionen wie `fuchs_front.png`, also nicht die Chibi-Variante aus Szene 9.

### Website-Look (anders als der Film: hell statt blaue Stunde)

```
bright airy daylight, clean white and soft lavender (#EEF2FF) atmosphere, indigo (#4F46E5)
and violet (#7C3AED) accent rim light, soft shadows, shallow depth of field, premium SaaS
marketing look, floating frosted-glass UI cards with abstract bars and icons only
```

Negativ: `no readable text, no letters, no numbers, no logos, no Deutsche Bahn branding,
no watermark, no helmet on the fox, no extra fingers`

Dunkle Stimmung bekommen nur zwei Stellen: **Ausgangslage** (Chaos) und
**KI-Agenten** (die Karte ist ohnehin dunkel-indigo).

### Aufteilung Higgsfield ↔ Code

| Higgsfield erzeugt | Im Code animiert (framer-motion/GSAP, beide installiert) |
|---|---|
| Fuchs, Umgebung, Licht, Bewegung der Figur | alles mit **Text, Zahlen oder echten Logos**: Chips, Zähler, Häkchen, Gleislinien, Logo-Kacheln |
| Nahtlose Loops (Startbild = Endbild) | In-View-Einblendungen, Hover-Zustände, scrollgebundene Pfade |

Grund: KI-Modelle erzeugen unleserlichen Text und verzerrte Logos. Im Code bleiben
Texte scharf, übersetzbar und im Admin änderbar.

---

## 3. Technische Umsetzung

1. **`components/media/LoopVideo.tsx`** (Client-Komponente, ~40 Zeilen)
   `<video muted loop playsInline preload="none" poster>` startet und pausiert per
   IntersectionObserver. Bei `prefers-reduced-motion` oder `saveData` bleibt nur das Poster.
   Das Video ist dekorativ (`aria-hidden`), den Alt-Text liefert das Poster.
2. **`MediaFrame` / `CardMedia`** bekommen ein optionales `video`-Prop. Das Standbild bleibt
   als `next/image` (LCP, Fallback), das Video blendet darüber ein, sobald es läuft.
   Bestehende Aufrufe ändern sich nicht.
3. **Dateien** unter `public/media/<bereich>/…`
   - Stills: WebP, q80, max. 2400 px (`next/image` optimiert weiter)
   - Loops: MP4 H.264, 720p, CRF 26–28, ohne Ton, `+faststart`, **≤ 1,5 MB je 8 s**
   - Poster: erstes Frame als WebP
4. **`lib/placeholders.ts`**: Die 12 Pfade im `SCENES`-Pool werden getauscht. Damit sind alle
   Detailseiten (Module, Branchen, Integrationen) erledigt.
5. Zum Schluss: `public/placeholders/` löschen und die `unoptimized={…svg}`-Weichen entfernen.

Performance: Kein Video lädt vor dem Sichtbarwerden. Oberhalb der Falz ist das Poster
das LCP-Element. Ziel: LCP < 2,5 s, CLS < 0,1.

---

## 4. Asset-Liste

Modelle: **NB** = `nano_banana_pro` (Stills mit Element) · **SD** = `seedance_2_0` std 720p
(Loops mit Fuchs) · **KL** = `kling3_0` std (Loops ohne oder mit kleinem Fuchs) ·
**RB** = `remove_background` (Freisteller)

### A. Startseite

| # | Sektion (Platzhalter) | Neu | Quelle | Motion im Code |
|---|---|---|---|---|
| A1 | **Die Ausgangslage** (`problem-zettelwirtschaft`) | 8-s-Loop, Hochformat ~3:4: Fuchs am Schreibtisch im Sturm aus Zetteln, Ordnern und Pings | Zuerst Ausschnitt aus `fox-03-alles-gleichzeitig` testen (0 cr), sonst Keyframe NB + SD | 4 Chips schweben ein („Excel_final_v7“, „Wo bin ich morgen?“, „Stundenzettel fehlt“, „Rechnung offen“), passend zu den 4 Karten; Icons pulsieren beim Einblenden |
| A2 | **Module-Slider** (6 Module, heute CSS-Mockups) | 6 Fuchs-Freisteller, je Modul eine Pose (zeigt auf Projektliste · zieht Karte auf Plantafel · mit Fahrzeugschlüssel · mit Ordner→Tablet · scannt QR im Lager · mit Rechnung) | NB + RB | `ModuleVisual` animiert die aktive Folie: Balken wachsen, Zeilen staffeln sich, Status-Chip wechselt, Karte wird gezogen. Der Fuchs überlappt den Kartenrand mit leichtem Float |
| A3 | **KI-Agenten** (`agenten-arbeitsvorbereitung`) | 8-s-Loop: Fuchs vor Holo-Screen, Dokumentseiten fliegen herein, Scan-Strahl sortiert sie in leuchtende Karten | Keyframe NB + SD | LV-Agent: die ✓-Zeilen tippen sich nacheinander ein, Zähler läuft bis 84. „Optional zuschaltbar“: kleiner Fuchs-Freisteller und ein Schalter, der umspringt |
| A4 | **So arbeitet Gleistrix** (`workflow-durchgaengig`, 21:9) | Panorama-Loop ohne Fuchs (Büro → Gleis → Baustelle, langsame Kamerafahrt) + Freisteller „Fuchs läuft“ | KL + NB/RB | SVG-Gleislinie zeichnet sich, 6 Stationen leuchten im Takt der bestehenden `WorkflowTimeline`, der Fuchs fährt scrollgebunden mit |
| A5 | **Für wen** (6 × `zielgruppe-*`) | 6 Stills (Poster) + 6 kurze Loops (5 s): SIPO am Gleis · Bahndienstleister mit Trupp und Maschine · Projektleiter mit Tablet · Backoffice (Ordner werden digital) · Lager mit QR-Scanner · Geschäftsführung am Dashboard | NB + KL | Desktop: Loop startet bei Hover. Mobile-Karussell: aktive Karte läuft |
| A6 | TrustBand (`szene-gleisbaustelle`, Streifen) | Still | NB | – |
| A7 | Fallstudien (4 × `case-*`) | 4 Stills | NB | – |
| A8 | FAQ (`szene-bauueberwachung`) | Still | NB | – |

### B. Unterseiten

| # | Seite / Stelle | Neu | Quelle | Motion im Code |
|---|---|---|---|---|
| B1 | **/produkt** – Vorteile-Banner (`szene-bauleitung-tablet`, 21:9); gleiches Motiv auf **/demo-buchen** | 8-s-Loop: Fuchs auf der Baustelle mit Tablet, UI-Karten fliegen über ein Gleis ins Büro | Keyframe NB + SD | Caption blendet ein. Hero-Screenshot und ScreensGallery bleiben echte Produktbilder |
| B2 | **/branchen** – Hero-Banner (`uebersicht-branchen`) | 8-s-Loop: Fuchs läuft durch SIPO-Strecke → Gleisbaumaschine → Büro | 2 Keyframes NB (Start ≠ Ende) + SD | – |
| B3 | **/integrationen** – Hero-Banner (`uebersicht-integrationen`) | Fuchs-Loop in der Mitte, **ohne Logos** | Keyframe NB + SD | Leuchtende Gleislinien zu echten Logo-Kacheln aus `public/logos` (DATEV, Microsoft 365, GAEB, lexoffice, sevDesk …), Datenpakete laufen entlang |
| B4 | **/blog** – Streifen (`uebersicht-blog`) + Fallbackbild für Artikel ohne Bild | ruhiger Loop: Fuchs liest, Artikelkarten schweben + Still als Fallback | NB + KL | – |
| B5 | **/ueber-uns** – Hero (`szene-truppbesprechung`) | 8-s-Loop: Fuchs bei der Morgenbesprechung mit Trupp am Gleis | Keyframe NB + SD | – |
| B6 | /ueber-uns – 2 Karten (`szene-sicherungsposten`, `szene-gleisfeld`) | 2 Stills 21:9 | NB | – |
| B7 | /ueber-uns – letzte Sektion (`problem-zettelwirtschaft`) | Wiederverwendung A1 | – | – |
| B8 | /preise (`uebersicht-preise`), CTA-Standardbild (`szene-gleisfeld`) | 2 Stills | NB | – |
| B9 | **Detailseiten** Module/Branchen/Integrationen (Pool, 12 × `szene-*`) | 12 Stills: 6 mit Fuchs, 6 reine Bahnszenen (sonst wirkt es eintönig) | NB | – |
| B10 | `seo-*.svg` (4, ungenutzt) | löschen | – | – |

**Summe:** rund 45 Stills (plus Keyframes) · 8 Hauptloops · 6 Karten-Loops · 7 Freisteller

---

## 5. Navigation

`components/layout/nav-config.ts`: Der Eintrag `{ href: "/#ki-agenten", label: "KI-Agenten" }`
wird entfernt. Desktop, Mobile und Megamenü lesen alle `NAV_ITEMS`, damit ist alles abgedeckt.
Die Sektion `#ki-agenten` bleibt auf der Startseite, der Anker funktioniert weiter.

---

## 6. Ablauf

| Phase | Inhalt | Freigabe |
|---|---|---|
| **0 – Stilprobe** | Nav-Eintrag raus · `LoopVideo` + `video`-Prop · **A5 SIPO-Still** und **A3 Agenten-Loop** erzeugen und einbauen · Vorschau im Dev-Server | **Du prüfst Look & Konsistenz**, erst danach Serienproduktion |
| A – Startseite | A1–A8 inkl. Code-Motion | Screenshots und Sichtung je Sektion |
| B – Unterseiten | B1–B10 | Screenshots je Seite |
| C – Aufräumen & QA | Platzhalter löschen, Build, Lint, Lighthouse, Mobile (375 px), Reduced Motion | Abschlussbericht |

Pro Motiv: je 2 Varianten erzeugen, die bessere wählen. Verworfene Takes werden nicht
nachgebessert, sondern neu generiert. Alle Job-IDs, Modelle und Kosten protokolliere ich am
Ende dieses Dokuments, wie in `GleistrixVideo/entwurf/produktion.json`.

Arbeitsbranch: `feat/fuchs-medien-motion`, ein Commit pro Phase. Einen PR gibt es erst auf Zuruf.

---

## 7. Budget (Schätzung, Preflight vor jedem Batch)

| Posten | Menge | Credits |
|---|---|---|
| Stills + Keyframes (NB, je 2 Varianten) | ~55 Motive × 2 | 200–450 |
| Hauptloops SD 8 s | 7 | ~250 |
| Panorama + Karten-Loops KL | 7 | ~60 |
| Freisteller | 7 | gering |
| Puffer für Neuversuche (~40 %) | | ~200 |
| **Summe** | | **~700–950 von 2.381** |

Vorschlag: harte Obergrenze **1.000 Credits**. Wird sie erreicht, halte ich an und frage nach.

---

## 8. Offene Entscheidungen (mit Empfehlung)

1. **Lichtstimmung**: hell und tagsüber, dunkel nur bei Ausgangslage und KI-Agenten. *Empfohlen.*
2. **Filmclips wiederverwenden**: nur A1 testweise, sonst neu erzeugen, damit die Seite einheitlich wirkt. *Empfohlen.*
3. **Menschen in Szenen** (Trupp, Sicherungsposten): ja, unscharf im Hintergrund, Fuchs im Vordergrund. *Empfohlen.*
4. **Budget-Obergrenze** 1.000 Credits. *Empfohlen.*

---

## 9. Abnahmekriterien

- Keine Datei mehr aus `public/placeholders/` eingebunden (`grep` leer)
- Fuchs in allen Motiven erkennbar gleich: Farben, Outfit, Gleis-Schweif
- Kein unleserlicher KI-Text und keine Fremdmarken im Bild
- `npm run build` und `npm run lint` grün
- Lighthouse `/`, `/produkt`, `/branchen`: LCP < 2,5 s, CLS < 0,1
- Motion prüfe ich über Zustandswerte im Browser, nicht über Screenshots, weil der
  Browser-Pane `requestAnimationFrame` einfriert
- Bei `prefers-reduced-motion`: nur Standbilder, keine Bewegung
- Mobile 375 px: kein horizontales Scrollen, Loops im Karussell laufen

---

## Produktionsprotokoll

### Phase 0 – Stilprobe (20.09.2026), 44 Credits (2.381 → 2.337)

| Asset | Modell | Job-ID | Kosten | Ergebnis |
|---|---|---|---|---|
| A5 SIPO, Variante A | nano_banana_2, 16:9, 2752×1536 | `1828fe81-c03c-4128-a08e-479b949e3bc0` | ~2 cr | verworfen (Bildaufbau) |
| A5 SIPO, Variante B | nano_banana_2, 16:9 | `6b9402f7-6035-49a4-8877-092dba68782f` | ~2 cr | **gewählt** → `public/media/zielgruppen/sipo.webp` (89 KB) |
| A3 Agenten-Keyframe A | nano_banana_2, 16:9 | `91a848d7-8b22-48b0-ba19-37b882518903` | ~2 cr | verworfen |
| A3 Agenten-Keyframe B | nano_banana_2, 16:9 | `48d9a04f-bb1e-4be5-b279-32bc1831cc6d` | ~2 cr | **gewählt**, Start- und Endbild für den Loop |
| A3 Agenten-Loop | seedance_2_0, 16:9, 8 s, 720p | `d7dff437-cbcc-4740-bf55-7ed8f563b759` | ~36 cr | **gewählt** → `public/media/start/ki-agenten.mp4` (478 KB) |

Nachbearbeitung des Loops: 0,6 s Überblendung am Loop-Punkt (ffmpeg `xfade`), dadurch
Ähnlichkeit erstes/letztes Bild von SSIM 0,80 auf 0,95. Länge 7,46 s, H.264 CRF 30,
ohne Ton. Poster ist das erste Videobild, damit Standbild und Loop deckungsgleich sind.

**Erkenntnis Kosten:** nano_banana_2 kostet ~2 cr je Bild, der 8-s-Loop 36 cr. Damit
landet das Gesamtprojekt eher bei **~600 Credits** als bei den geschätzten 700–950.

**Erkenntnis Prüfung:** Der Browser-Pane friert `requestAnimationFrame` ein und pausiert
Videos als „background media“. Screenshots bleiben deshalb weiß. Geprüft wird über
Zustandswerte im DOM (`readyState`, `currentTime`, berechnete Deckkraft) – dort belegt:
Laden bei Sichtbarkeit, Abspielen, Einblenden über das Standbild.

### Phase A – Startseite (20.09.2026)

| Slot | Datei | Modell | Anmerkung |
|---|---|---|---|
| Ausgangslage | `start/ausgangslage.webp` + `.mp4` (267 KB) | nano_banana_2 3:4 + seedance_2_0 8 s | erster Versuch kam als 2D-Illustration, mit „photorealistic 3D CGI render“ im Prompt wiederholt |
| KI-Agenten | `start/ki-agenten.*` | siehe Phase 0 | Analyse-Ausgabe jetzt als `AgentAnalysis` mit Zähler |
| Modul-Slider | `module/{projekte,plantafel,team,dokumente,lager,abrechnung}.webp` | nano_banana_2 + `remove_background` | freigestellt, schwebt am Kartenrand |
| Für wen (6) | `zielgruppen/*.webp` | nano_banana_2 16:9 | – |
| TrustBand / Workflow | `start/trustband.webp`, `start/workflow.webp` | nano_banana_flash 21:9 | einzige Motive aus dem schwächeren Modell, für Streifen ausreichend |
| Fallstudien (4) | `cases/*.webp` | nano_banana_2 16:9 | dunkel gehalten, weil die Karten stark abdunkeln |
| FAQ | `start/faq.webp` | nano_banana_2 16:9 | läuft mit 20 % Deckkraft als Textur |

**Erkenntnis Modelle:** `generate_image_batch` fällt auf `nano_banana_flash` zurück
(1376 px statt 2752 px, gedrungenere Figur). Für Motive mit dem Fuchs deshalb immer
einzelne `generate_image`-Aufrufe mit `nano_banana_pro` verwenden – das löst serverseitig
auf `nano_banana_2` auf.

**Erkenntnis Prompt:** „Slender heroic proportions, 3.5 heads tall, adult build, NOT chibi“
und eine ausformulierte Kameraangabe verhindern die Reihe gleicher, knuffiger Mittelbilder.

### Phase B – Unterseiten und Detailseiten (20.09.2026)

| Slot | Datei | Anmerkung |
|---|---|---|
| /produkt, /demo-buchen | `seiten/produkt.webp` + `.mp4` | Daten fliegen vom Tablet ins Büro |
| /branchen | `seiten/branchen.webp` + `.mp4` | erster Versuch hatte ein lesbares Schild, wiederholt |
| /integrationen | `seiten/integrationen.webp` + `.mp4` | Fuchs in der Mitte, sechs Gleislinien zu leeren Kacheln |
| /blog (+ Fallback) | `seiten/blog.webp` | – |
| /ueber-uns | `seiten/ueberuns.webp` + `.mp4`, Karten aus dem Pool | letzte Sektion nutzt den Ausgangslage-Loop mit |
| /preise | `seiten/preise.webp` | – |
| Szenen-Pool (12) | 6 × neu in `szenen/`, 6 × Wiederverwendung | spart Credits, alle Detailseiten auf einmal umgestellt |

**Stand Credits:** 2.381 → 2.065, also **316 verbraucht** von 1.000 freigegebenen.
Gesamtgröße der Medien: 5,3 MB (39 Dateien).

### Phase A-Nachtrag – Hover-Loops „Für wen“ (20.09.2026)

Sechs 5-Sekunden-Loops (`zielgruppen/*.mp4`, je 60–100 KB, 960 px breit), erzeugt mit
**kling3_0** aus den vorhandenen Standbildern als Start- und Endbild – rund ein Drittel
der Kosten von seedance_2_0 und für die kleine Kartenfläche ausreichend.

`LoopVideo` hat dafür ein `trigger`-Prop bekommen:

- `"view"` (Vorgabe): Start beim Hereinscrollen – für die großen Banner.
- `"hover"`: Start erst bei `pointerenter` oder `focusin` auf der Karte, Stopp und Rücklauf
  auf Bild 1 beim Verlassen. Ohne Zeigegerät (`(hover: hover)` trifft nicht zu, also Touch)
  fällt es auf `"view"` zurück, sonst liefe der Loop auf dem Handy nie.

Nachgemessen: Beim reinen Durchscrollen der Sektion wird **kein** Video geladen
(`readyState` 0, keine Netzwerkanfrage). Erst `pointerenter` lädt die Datei – geprüft an
einer Karte 9.104 px unterhalb des Sichtfensters, dort kann der IntersectionObserver
nicht die Ursache sein.

### Phase A-Nachtrag – Fuchs auf der Workflow-Schiene (20.09.2026)

Ein freigestellter Fuchs in Seitenansicht (`workflow/fuchs-lauf.webp`, 42 KB) läuft die
Schiene der Zeitleiste ab. Er hängt am selben Fortschrittswert wie die Schienenfüllung:
`setFoxX(progress * railWidth)` direkt neben `setFill(progress)` in `render()`. Damit steht
er immer am Kopf der gefüllten Linie, also beim aktiven Schritt.

Die Scroll-Mathematik blieb unangetastet – dazugekommen sind nur eine Messgröße
(`railWidth` in `measure()`), ein `quickSetter` und das Element selbst.

Platz geschaffen hat die neue Variable `--wf-fox-room: 3.25rem`: Schiene und Karten rücken
um diesen Betrag nach unten, weil `.wf-viewport` vertikal abschneidet und der Fuchs sonst
oben angeschnitten würde. Der Bühnenkasten hat dafür Reserve – die Spur wuchs von 306 px
auf 358 px bei 544 px Bühnenhöhe.

Nachgemessen bei 1440 × 900: Füllung 0,085 → Fuchs bei 153 px; 0,450 → 810 px;
0,854 → 1537 px; 1,0 → 1800 px, also genau die Schienenbreite. Oberkante des Fuchses
15 px unterhalb der Spurkante, damit nichts abgeschnitten wird.

Der Fuchs erscheint nur dort, wo es die Schiene gibt: ab 1024 px Breite, ab 700 px Höhe,
mit Zeigegerät und ohne „Bewegung reduzieren“ – alles im selben Media-Query. Auf dem
Handy bleibt die Zeitleiste das Wisch-Karussell von vorher.

### Offen

- Animierte Balken in `ModuleVisual`.
- `public/placeholders/` (33 ungenutzte SVGs) kann gelöscht werden.
