"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { FormState } from "@/app/admin/actions";
import { analyzeSource, fetchLinkText, writeArticleFromSuggestion } from "@/lib/admin/blog/agent";
import {
  MAX_SOURCE_BYTES,
  PDF_TYPE,
  deleteSourceFile,
  isTextUpload,
  saveSourceFile,
} from "@/lib/admin/blog/files";
import { sanitizeArticleHtml } from "@/lib/admin/blog/html";
import {
  deleteBlogArticle,
  deleteBlogCategory,
  deleteBlogSource,
  deleteBlogSuggestion,
  getBlogArticle,
  getBlogCategory,
  getBlogSource,
  getBlogSuggestion,
  listBlogArticles,
  listBlogCategories,
  listBlogSources,
  saveBlogArticle,
  saveBlogCategory,
  saveBlogSource,
  saveBlogSuggestion,
  slugify,
  uniqueSlug,
} from "@/lib/admin/blog/store";
import { saveImageAsset } from "@/lib/admin/db/assets";
import type { BlogArticle, BlogArticleStatus, BlogSource } from "@/types/blog";

/**
 * Server Actions des Blog-Agenten.
 *
 * Eigene Datei statt Anhang an actions.ts: die ist mit rund 2600 Zeilen ohnehin
 * über jeder vertretbaren Grenze, und der Blog teilt mit ihr nur den Typ
 * FormState. Der Adminbereich sieht keinen Unterschied – Server Actions sind
 * nicht an eine bestimmte Datei gebunden.
 *
 * Analyse und Artikelgenerierung laufen bewusst SYNCHRON, nicht als abgesetzte
 * Hintergrundaufgabe: eine nicht abgewartete Promise überlebt in einer
 * Serverless-Funktion das Ende der Antwort nicht, das Ergebnis wäre verloren.
 * Die Laufzeitgrenze steht dafür in der jeweiligen Seite (`maxDuration`).
 */

function field(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function checked(data: FormData, name: string): boolean {
  return data.get(name) === "on";
}

function message(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

/**
 * Der Blog erscheint an drei Stellen: Adminliste, öffentliche Übersicht und die
 * Sektion auf der Startseite. Ein vergessener Pfad hieße, dass eine davon den
 * alten Stand zeigt.
 */
function revalidateBlog(articleSlug?: string): void {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  if (articleSlug) revalidatePath(`/blog/${articleSlug}`);
}

/* ------------------------------------------------------------------ Quellen */

/**
 * Legt eine Quelle an: Link, eingefügter Text oder Datei.
 *
 * Bei einem Link wird der Text sofort geholt – dann steht im Adminbereich, ob
 * die Seite überhaupt lesbar war, statt dass es erst bei der Analyse auffällt.
 */
export async function saveBlogSourceAction(_prev: FormState, data: FormData): Promise<FormState> {
  const kind = field(data, "kind");
  if (kind !== "link" && kind !== "text" && kind !== "datei") {
    return { error: "Unbekannte Art der Quelle." };
  }

  // Ausdrücklich getypt: sonst weitet TypeScript `kind` im Objektliteral
  // wieder auf `string` auf und die Zuweisung an BlogSource schlägt fehl.
  const base: Pick<BlogSource, "id" | "kind" | "status" | "createdAt"> = {
    id: `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    kind,
    status: "offen",
    createdAt: new Date().toISOString(),
  };

  let source: BlogSource;

  if (kind === "link") {
    const url = field(data, "url");
    if (!url) return { error: "Bitte eine Adresse angeben." };

    try {
      const text = await fetchLinkText(url);
      source = { ...base, title: field(data, "title") || new URL(url).hostname, origin: url, text };
    } catch (error) {
      return { error: message(error, "Der Link konnte nicht gelesen werden.") };
    }
  } else if (kind === "text") {
    const text = field(data, "text");
    if (text.length < 100) return { error: "Der Text ist zu kurz für eine Auswertung." };

    source = { ...base, title: field(data, "title") || "Eingefügter Text", origin: "", text };
  } else {
    const upload = data.get("file");
    if (!(upload instanceof File) || upload.size === 0) {
      return { error: "Bitte eine Datei auswählen." };
    }
    if (upload.size > MAX_SOURCE_BYTES) return { error: "Die Datei ist größer als 8 MB." };

    const bytes = Buffer.from(await upload.arrayBuffer());
    const title = field(data, "title") || upload.name;

    if (upload.type === PDF_TYPE) {
      try {
        source = {
          ...base,
          title,
          origin: upload.name,
          text: "",
          fileAssetId: await saveSourceFile(bytes),
          fileType: PDF_TYPE,
        };
      } catch (error) {
        console.error("Quelldatei konnte nicht gespeichert werden:", error);
        return { error: "Die Datei konnte nicht gespeichert werden." };
      }
    } else if (isTextUpload(upload.type)) {
      // Textdateien werden direkt ausgelesen – für sie braucht es weder eine
      // zweite Ablage noch den Umweg über das Modell.
      const text = bytes.toString("utf8").trim();
      if (text.length < 100) return { error: "Die Datei enthält zu wenig Text." };
      source = { ...base, title, origin: upload.name, text };
    } else {
      return {
        error: "Nur PDF- und Textdateien. Word-Dokumente bitte als PDF speichern oder einfügen.",
      };
    }
  }

  await saveBlogSource(source);
  revalidatePath("/admin/blog");
  return { success: `Quelle „${source.title}“ gespeichert.` };
}

/**
 * Wertet eine Quelle aus und legt die Vorschläge an.
 *
 * Vorhandene Vorschläge derselben Quelle bleiben stehen: ein zweiter Lauf soll
 * ergänzen, nicht die Auswahl von gestern wegwerfen.
 */
export async function analyzeBlogSourceAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const source = await getBlogSource(field(data, "sourceId"));
  if (!source) return { error: "Unbekannte Quelle." };

  await saveBlogSource({ ...source, status: "laeuft", error: undefined });

  try {
    const analysis = await analyzeSource(source, await listBlogCategories());
    for (const suggestion of analysis.suggestions) await saveBlogSuggestion(suggestion);

    await saveBlogSource({
      ...source,
      category: analysis.category,
      summary: analysis.summary,
      status: "fertig",
      error: undefined,
      analyzedAt: new Date().toISOString(),
    });
    revalidatePath("/admin/blog");

    const count = analysis.suggestions.length;
    return {
      success: `„${source.title}“ eingeordnet unter ${analysis.category} – ${count} ${count === 1 ? "Vorschlag" : "Vorschläge"}.`,
    };
  } catch (error) {
    const text = message(error, "Die Analyse ist fehlgeschlagen.");
    await saveBlogSource({ ...source, status: "fehler", error: text });
    revalidatePath("/admin/blog");
    return { error: text };
  }
}

export async function deleteBlogSourceAction(data: FormData): Promise<void> {
  const source = await getBlogSource(field(data, "sourceId"));
  if (!source) return;

  await deleteBlogSource(source.id);
  if (source.fileAssetId) await deleteSourceFile(source.fileAssetId);
  revalidatePath("/admin/blog");
}

/* --------------------------------------------------------------- Vorschläge */

/**
 * Schreibt aus einem Vorschlag einen Artikelentwurf und öffnet ihn.
 *
 * Der Entwurf ist nie sofort öffentlich – die Freigabe bleibt ein bewusster
 * zweiter Schritt auf der Artikelseite.
 */
export async function generateBlogArticleAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const suggestion = await getBlogSuggestion(field(data, "suggestionId"));
  if (!suggestion) return { error: "Unbekannter Vorschlag." };

  await saveBlogSuggestion({ ...suggestion, status: "laeuft", error: undefined });

  let articleId: string;
  try {
    const sources = (await listBlogSources()).filter((entry) =>
      suggestion.sourceIds.includes(entry.id),
    );
    const taken = (await listBlogArticles()).map((article) => article.slug);

    const article = await writeArticleFromSuggestion(
      suggestion,
      sources,
      taken,
      await listBlogCategories(),
    );
    await saveBlogArticle(article);
    await saveBlogSuggestion({
      ...suggestion,
      status: "erledigt",
      error: undefined,
      articleId: article.id,
    });
    articleId = article.id;
  } catch (error) {
    const text = message(error, "Der Artikel konnte nicht erzeugt werden.");
    await saveBlogSuggestion({ ...suggestion, status: "fehler", error: text });
    revalidatePath("/admin/blog");
    return { error: text };
  }

  revalidateBlog();
  // Außerhalb des try: redirect() arbeitet mit einer geworfenen Ausnahme und
  // würde dort als fehlgeschlagene Generierung protokolliert.
  redirect(`/admin/blog/${articleId}`);
}

export async function deleteBlogSuggestionAction(data: FormData): Promise<void> {
  await deleteBlogSuggestion(field(data, "suggestionId"));
  revalidatePath("/admin/blog");
}

/* ------------------------------------------------------------------ Artikel */

/** Aus dem Formular kommt „2026-08-20T07:00“ – ohne Zeitzone. */
function toIso(local: string): string | null {
  if (!local) return null;
  const date = new Date(local);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/**
 * Legt Status und Zeitpunkte widerspruchsfrei fest.
 *
 * Ein Artikel, der als Entwurf gespeichert wird, aber noch einen
 * Planungszeitpunkt trägt, wäre öffentlich unsichtbar und im Adminbereich
 * trotzdem „für Freitag geplant“ – genau diese Abweichung fängt das hier ab.
 */
function schedule(
  status: BlogArticleStatus,
  publishAt: string | null,
  previous: BlogArticle | null,
): { publishAt?: string; publishedAt?: string } | { error: string } {
  if (status === "entwurf") return { publishedAt: previous?.publishedAt };
  if (status === "veroeffentlicht") {
    return { publishedAt: previous?.publishedAt ?? new Date().toISOString() };
  }

  if (!publishAt) return { error: "Für einen geplanten Artikel fehlt der Zeitpunkt." };
  // Das öffentliche Datum ist der geplante Termin – sonst stünde am Erscheinen
  // ein Datum aus der Vergangenheit.
  return { publishAt, publishedAt: publishAt };
}

/**
 * Speichert einen Artikel – neu oder bearbeitet.
 *
 * Die Adresse (slug) wird nur beim Anlegen vergeben. Sie nachträglich zu
 * ändern hieße, jeden bereits geteilten Link ins Leere laufen zu lassen.
 */
export async function saveBlogArticleAction(_prev: FormState, data: FormData): Promise<FormState> {
  const title = field(data, "title");
  if (!title) return { error: "Titel fehlt." };

  const status = field(data, "status") as BlogArticleStatus;
  if (!["entwurf", "geplant", "veroeffentlicht"].includes(status)) {
    return { error: "Unbekannter Status." };
  }

  const articleId = field(data, "articleId");
  const existing = articleId ? await getBlogArticle(articleId) : null;
  if (articleId && !existing) return { error: "Unbekannter Artikel." };

  const timing = schedule(status, toIso(field(data, "publishAt")), existing);
  if ("error" in timing) return { error: timing.error };

  const content = sanitizeArticleHtml(field(data, "content"));
  if (!content) return { error: "Der Artikeltext ist leer." };

  // Wie beim Modulbild: ein neuer Upload gewinnt, sonst entscheidet das
  // Häkchen, sonst bleibt das bisherige Bild stehen.
  let imageSrc = existing?.imageSrc;
  const upload = data.get("imageFile");
  if (upload instanceof File && upload.size > 0) {
    try {
      const stored = await saveImageAsset(upload);
      if (!stored.ok) return { error: stored.error };
      imageSrc = stored.src;
    } catch (error) {
      console.error("Titelbild konnte nicht gespeichert werden:", error);
      return { error: "Das Bild konnte nicht gespeichert werden." };
    }
  } else if (checked(data, "removeImage")) {
    imageSrc = undefined;
  }

  const now = new Date().toISOString();
  const article: BlogArticle = {
    id: existing?.id ?? `${slugify(title).slice(0, 40) || "artikel"}-${Date.now().toString(36)}`,
    slug:
      existing?.slug ?? uniqueSlug(title, (await listBlogArticles()).map((entry) => entry.slug)),
    title,
    teaser: field(data, "teaser"),
    content,
    category: field(data, "category"),
    tags: field(data, "tags")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 8),
    seo: {
      title: field(data, "seoTitle"),
      description: field(data, "seoDescription"),
      keyword: field(data, "seoKeyword"),
    },
    imageSrc,
    imageAlt: field(data, "imageAlt") || title,
    status,
    publishAt: timing.publishAt,
    publishedAt: timing.publishedAt,
    suggestionId: existing?.suggestionId,
    sourceIds: existing?.sourceIds ?? [],
    generatedByAi: existing?.generatedByAi ?? false,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await saveBlogArticle(article);
  revalidateBlog(article.slug);

  const label =
    status === "veroeffentlicht"
      ? "veröffentlicht"
      : status === "geplant"
        ? "eingeplant"
        : "als Entwurf gespeichert";
  return { success: `„${title}“ ${label}.` };
}

/** Schnellwechsel aus der Liste – veröffentlichen oder zurückziehen. */
export async function setBlogArticleStatusAction(data: FormData): Promise<void> {
  const status = field(data, "status") as BlogArticleStatus;
  if (status !== "entwurf" && status !== "veroeffentlicht") return;

  const article = await getBlogArticle(field(data, "articleId"));
  if (!article) return;

  await saveBlogArticle({
    ...article,
    status,
    // Zurückgezogen heißt: nicht mehr geplant. Sonst käme der Artikel beim
    // nächsten Erreichen des Zeitpunkts von selbst zurück.
    publishAt: undefined,
    publishedAt:
      status === "veroeffentlicht"
        ? (article.publishedAt ?? new Date().toISOString())
        : article.publishedAt,
    updatedAt: new Date().toISOString(),
  });
  revalidateBlog(article.slug);
}

/* ----------------------------------------------------------------- Rubriken */

/**
 * Legt eine Rubrik an oder benennt sie um.
 *
 * Die Kennung bleibt beim Umbenennen erhalten, der Name zieht auf Artikel und
 * Quellen durch (siehe saveBlogCategory in store.ts). Zwei Rubriken mit
 * demselben Namen wären in der Auswahl nicht unterscheidbar – deshalb der
 * Namensabgleich vorab.
 */
export async function saveBlogCategoryAction(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  const name = field(data, "name");
  if (!name) return { error: "Name fehlt." };

  const categoryId = field(data, "categoryId");
  const existing = categoryId ? await getBlogCategory(categoryId) : null;
  if (categoryId && !existing) return { error: "Unbekannte Rubrik." };

  const all = await listBlogCategories();
  const clash = all.find(
    (entry) => entry.id !== categoryId && entry.name.toLowerCase() === name.toLowerCase(),
  );
  if (clash) return { error: `Die Rubrik „${clash.name}“ gibt es bereits.` };

  const slug = slugify(name);
  if (!slug) return { error: "Aus dem Namen lässt sich keine Adresse bilden." };

  await saveBlogCategory({
    id: existing?.id ?? uniqueSlug(name, all.map((entry) => entry.id), "rubrik"),
    name,
    slug: existing?.slug ?? uniqueSlug(name, all.map((entry) => entry.slug), "rubrik"),
    description: field(data, "description"),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  });

  revalidateBlog();
  revalidatePath("/admin/blog/kategorien");
  return {
    success: existing
      ? `Rubrik „${name}“ gespeichert.${existing.name !== name ? " Artikel und Quellen wurden mitgezogen." : ""}`
      : `Rubrik „${name}“ angelegt.`,
  };
}

export async function deleteBlogCategoryAction(data: FormData): Promise<void> {
  await deleteBlogCategory(field(data, "categoryId"));
  revalidatePath("/admin/blog/kategorien");
  revalidatePath("/admin/blog");
}

/* ------------------------------------------------------------------ Artikel */

export async function deleteBlogArticleAction(data: FormData): Promise<void> {
  const id = field(data, "articleId");
  const article = await getBlogArticle(id);
  await deleteBlogArticle(id);
  revalidateBlog(article?.slug);
  redirect("/admin/blog");
}
