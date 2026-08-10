/**
 * Blog & News – Inhalte, die im Adminbereich entstehen und öffentlich stehen.
 *
 * Drei Stufen, bewusst getrennt:
 *
 *   Quelle    – was hineingeht: ein Link, ein eingefügter Text, eine Datei.
 *   Vorschlag – was die KI daraus als Thema erkennt (Titel + Begründung).
 *   Artikel   – der fertige Text, der auf /blog erscheint.
 *
 * Getrennt, weil jede Stufe ihre eigene Lebensdauer hat: eine Quelle liefert
 * mehrere Vorschläge, ein verworfener Vorschlag lässt Quelle und Artikel
 * unberührt, und ein veröffentlichter Artikel überlebt das Löschen der Quelle.
 */

/* ------------------------------------------------------------------ Quellen */

export type BlogSourceKind = "link" | "text" | "datei";

/** Wie weit die KI-Auswertung einer Quelle ist. */
export type BlogAnalysisStatus = "offen" | "laeuft" | "fertig" | "fehler";

/**
 * Rubrik, unter der Quellen und Artikel geführt werden.
 *
 * Der Name ist die Identität – Artikel verweisen über `category` auf ihn, nicht
 * über die Kennung. Das spart einen Verweis bei jedem Lesen und hält die
 * öffentliche Seite unabhängig von der Verwaltung. Preis dafür: Umbenennen muss
 * auf die Artikel durchziehen, siehe saveBlogCategory in store.ts.
 */
export type BlogCategory = {
  /** Aus dem Namen abgeleitet, nach dem Anlegen unverändert. */
  id: string;
  name: string;
  /** Für spätere Rubrikseiten unter /blog/kategorie/<slug>. */
  slug: string;
  description: string;
  createdAt: string;
};

export type BlogSource = {
  id: string;
  title: string;
  kind: BlogSourceKind;
  /**
   * Rubrik, die die Auswertung der Quelle zugeordnet hat. Vor der Analyse leer –
   * dann steht die Quelle im Adminbereich unter „Noch nicht ausgewertet“.
   */
  category?: string;
  /** Worum es in der Quelle geht, in zwei Sätzen. Ergebnis der Auswertung. */
  summary?: string;
  /** Bei "link" die Adresse, bei "datei" der Dateiname – sonst leer. */
  origin: string;
  /**
   * Roher Ausgangstext. Bei einer Datei bleibt er leer, solange nur das
   * Original vorliegt; dann trägt `fileAssetId` den Inhalt.
   */
  text: string;
  /** Kennung in der Dateiablage (siehe lib/admin/blog/files.ts). */
  fileAssetId?: string;
  /** MIME-Typ der hochgeladenen Datei – entscheidet, wie sie zur KI geht. */
  fileType?: string;
  status: BlogAnalysisStatus;
  /** Klartext der letzten fehlgeschlagenen Auswertung. */
  error?: string;
  createdAt: string;
  analyzedAt?: string;
};

/* --------------------------------------------------------------- Vorschläge */

export type BlogSuggestionStatus = "offen" | "laeuft" | "erledigt" | "fehler";

export type BlogSuggestion = {
  id: string;
  title: string;
  /** Zwei bis drei Sätze: worum es geht und warum es für die Zielgruppe zählt. */
  summary: string;
  category: string;
  /** Leitbegriff, an dem sich Recherche und Text ausrichten. */
  keyword: string;
  /** Quellen, aus denen der Vorschlag stammt. */
  sourceIds: string[];
  status: BlogSuggestionStatus;
  error?: string;
  /** Gesetzt, sobald daraus ein Artikelentwurf entstanden ist. */
  articleId?: string;
  createdAt: string;
};

/* ------------------------------------------------------------------ Artikel */

/**
 * `geplant` heißt: veröffentlicht, sobald `publishAt` erreicht ist. Es gibt
 * keinen Hintergrundlauf, der den Status umschreibt – die öffentliche Sicht
 * vergleicht beim Lesen (siehe lib/admin/blog/store.ts).
 */
export type BlogArticleStatus = "entwurf" | "geplant" | "veroeffentlicht";

export type BlogSeo = {
  /** Title-Tag; leer ⇒ der Artikeltitel wird verwendet. */
  title: string;
  description: string;
  keyword: string;
};

export type BlogArticle = {
  id: string;
  /** Teil der öffentlichen Adresse /blog/<slug>. Nach dem Anlegen unverändert. */
  slug: string;
  title: string;
  /** Anrisstext auf Karten und in der Übersicht. */
  teaser: string;
  /** Artikeltext als HTML – begrenztes Tag-Set, siehe lib/admin/blog/html.ts. */
  content: string;
  category: string;
  tags: string[];
  seo: BlogSeo;
  /** Hochgeladenes Titelbild (/api/assets/…) oder ein Pfad unter public/. */
  imageSrc?: string;
  imageAlt: string;
  status: BlogArticleStatus;
  /** Nur bei `geplant` gefüllt: ISO-Zeitpunkt der Veröffentlichung. */
  publishAt?: string;
  /** Zeitpunkt, der öffentlich als Datum steht. */
  publishedAt?: string;
  /** Vorschlag, aus dem der Entwurf entstand – für die Rückverfolgung. */
  suggestionId?: string;
  sourceIds: string[];
  /** Vollständig von der KI geschrieben – im Adminbereich als Hinweis. */
  generatedByAi: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Öffentliche Sicht: nur, was eine Karte oder Detailseite wirklich braucht. */
export type PublicBlogArticle = Pick<
  BlogArticle,
  "slug" | "title" | "teaser" | "content" | "category" | "tags" | "imageSrc" | "imageAlt" | "seo"
> & {
  /** Bereits aufgelöst: veröffentlicht am oder geplant für. */
  date: string;
  /** Geschätzte Lesezeit in Minuten, aus der Textlänge. */
  readMinutes: number;
};
