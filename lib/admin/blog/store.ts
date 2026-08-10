import { DEFAULT_BLOG_ARTICLES, WORDS_PER_MINUTE } from "@/data/blog";
import type { AdminStore } from "@/types/admin";
import type { BlogArticle, BlogSource, BlogSuggestion, PublicBlogArticle } from "@/types/blog";

import { bootstrap } from "../db/bootstrap";
import { COLLECTIONS, col, fromDoc, toDoc } from "../db/collections";
import { patchFileStore, readFileStore } from "../db/file-store";
import { isMongoConfigured } from "../mongo";

/**
 * Ablage für Quellen, Vorschläge und Artikel.
 *
 * Dieselbe Zweigleisigkeit wie überall im Adminbereich: gegen MongoDB je eine
 * Collection, ohne Datenbank die JSON-Datei. Statt drei mal derselben zwanzig
 * Zeilen macht `bucket()` daraus eine Fabrik – die Repositories darunter sind
 * nur noch benannte Aufrufe.
 *
 * Bewusst OHNE Entwurf/Freigabe-Zyklus wie bei den Preisen: der Entwurfsstand
 * steckt schon im Artikelstatus.
 */

type Entity = { id: string };
type StoreKey = "blogSources" | "blogSuggestions" | "blogArticles";

/**
 * Ein Eimer je Entität.
 *
 * `save` ist ein Upsert: vorhandene Kennung ⇒ ersetzen, sonst anhängen. Damit
 * braucht keine Server Action zwei Pfade für Anlegen und Bearbeiten.
 */
function bucket<T extends Entity>(collectionName: string, key: StoreKey) {
  /** Neueste zuerst – die Ablage schreibt in Anlagereihenfolge. */
  const newestFirst = (items: T[]): T[] => [...items].reverse();

  /**
   * Die Liste aus dem Dateispeicher.
   *
   * Der Umweg über `unknown` ist nötig, weil `store[key]` für TypeScript die
   * Vereinigung aller drei Listentypen ist – welcher davon zutrifft, weiß nur
   * der Aufrufer, der Collection und Schlüssel zusammen wählt.
   */
  const fromStore = (store: AdminStore): T[] => (store[key] ?? []) as unknown as T[];

  async function list(): Promise<T[]> {
    if (!isMongoConfigured()) {
      const store = await readFileStore();
      return newestFirst(fromStore(store));
    }

    await bootstrap();
    const docs = await (await col(collectionName)).find({}).sort({ createdAt: 1 }).toArray();
    return newestFirst(docs.map((doc) => fromDoc<T>(doc)));
  }

  async function get(id: string): Promise<T | null> {
    if (!id) return null;

    if (!isMongoConfigured()) {
      const store = await readFileStore();
      return fromStore(store).find((entry) => entry.id === id) ?? null;
    }

    await bootstrap();
    const doc = await (await col(collectionName)).findOne({ _id: id });
    return doc ? fromDoc<T>(doc) : null;
  }

  async function save(entity: T): Promise<void> {
    if (isMongoConfigured()) {
      await bootstrap();
      // _id gehört nicht in das Ersatzdokument – der Filter setzt ihn ohnehin,
      // und MongoDB lehnt ein abweichendes _id-Feld ab.
      const { _id: _key, ...replacement } = toDoc(entity);
      await (await col(collectionName)).replaceOne({ _id: entity.id }, replacement, {
        upsert: true,
      });
      return;
    }

    await patchFileStore((store) => {
      const current = fromStore(store);
      const exists = current.some((entry) => entry.id === entity.id);
      return {
        next: {
          ...store,
          [key]: exists
            ? current.map((entry) => (entry.id === entity.id ? entity : entry))
            : [...current, entity],
        },
        result: undefined,
      };
    });
  }

  async function remove(id: string): Promise<void> {
    if (isMongoConfigured()) {
      await bootstrap();
      await (await col(collectionName)).deleteOne({ _id: id });
      return;
    }

    await patchFileStore((store) => ({
      next: { ...store, [key]: fromStore(store).filter((entry) => entry.id !== id) },
      result: undefined,
    }));
  }

  return { list, get, save, remove };
}

/* ------------------------------------------------------------------ Quellen */

const sources = bucket<BlogSource>(COLLECTIONS.blogSources, "blogSources");

export const listBlogSources = sources.list;
export const getBlogSource = sources.get;
export const saveBlogSource = sources.save;
export const deleteBlogSource = sources.remove;

/* --------------------------------------------------------------- Vorschläge */

const suggestions = bucket<BlogSuggestion>(COLLECTIONS.blogSuggestions, "blogSuggestions");

export const listBlogSuggestions = suggestions.list;
export const getBlogSuggestion = suggestions.get;
export const saveBlogSuggestion = suggestions.save;
export const deleteBlogSuggestion = suggestions.remove;

/* ------------------------------------------------------------------ Artikel */

const articles = bucket<BlogArticle>(COLLECTIONS.blogArticles, "blogArticles");

export const getBlogArticle = articles.get;

/**
 * Alle Artikel für den Adminbereich – neueste zuerst.
 *
 * Leere Ablage ⇒ Auslieferungszustand. Sonst stünde der Adminbereich nach dem
 * Umstieg vor einer leeren Liste, während auf /blog noch die sechs
 * Standardartikel liegen; genau diese Abweichung wäre nicht erklärbar.
 */
export async function listBlogArticles(): Promise<BlogArticle[]> {
  try {
    const stored = await articles.list();
    return stored.length > 0 ? stored : [...DEFAULT_BLOG_ARTICLES].reverse();
  } catch (error) {
    console.error("Blogartikel konnten nicht gelesen werden:", error);
    return [...DEFAULT_BLOG_ARTICLES].reverse();
  }
}

/**
 * Schreibt den Auslieferungszustand einmalig in die Ablage.
 *
 * Nötig vor JEDEM Schreibvorgang: solange die Ablage leer ist, liefert
 * listBlogArticles die Konstanten aus data/blog.ts. Der erste eigene Artikel
 * würde die Liste damit nicht ergänzen, sondern ersetzen – und ein gelöschter
 * Standardartikel käme beim nächsten Lesen zurück.
 *
 * Bewusst hier und nicht in den Server Actions: die Regel gilt für jeden
 * Schreiber, und eine Stelle, die man vergessen kann, wird vergessen. Der
 * Selbsttest in store.check.ts prüft genau das.
 */
async function materializeDefaults(): Promise<void> {
  if ((await articles.list()).length > 0) return;
  // articles.save, nicht saveBlogArticle: sonst riefe sich das hier selbst auf.
  for (const article of DEFAULT_BLOG_ARTICLES) await articles.save(article);
}

export async function saveBlogArticle(article: BlogArticle): Promise<void> {
  await materializeDefaults();
  await articles.save(article);
}

export async function deleteBlogArticle(id: string): Promise<void> {
  await materializeDefaults();
  await articles.remove(id);
}

/* -------------------------------------------------------- Öffentliche Sicht */

/**
 * Ist der Artikel öffentlich sichtbar?
 *
 * Geplante Artikel gehen ohne Hintergrundlauf live: der Vergleich passiert
 * beim Lesen. Damit gibt es keinen Cron, der ausfallen kann, keinen zweiten
 * Zustand, der vom Status abweicht, und kein Zeitfenster, in dem ein Artikel
 * fällig ist, aber noch nicht umgeschrieben wurde. Preis dafür ist die
 * Zwischenspeicherung der Seite – siehe `revalidate` in app/blog.
 */
export function isPublished(article: BlogArticle, now: Date = new Date()): boolean {
  if (article.status === "veroeffentlicht") return true;
  if (article.status !== "geplant" || !article.publishAt) return false;
  return new Date(article.publishAt).getTime() <= now.getTime();
}

/** Datum, das öffentlich steht: Veröffentlichung, sonst Planung, sonst Anlage. */
export function articleDate(article: BlogArticle): string {
  return article.publishedAt ?? article.publishAt ?? article.createdAt;
}

/** Lesezeit aus der reinen Textlänge – mindestens eine Minute. */
export function readMinutes(html: string): number {
  const words = html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function toPublicArticle(article: BlogArticle): PublicBlogArticle {
  return {
    slug: article.slug,
    title: article.title,
    teaser: article.teaser,
    content: article.content,
    category: article.category,
    tags: article.tags,
    imageSrc: article.imageSrc,
    imageAlt: article.imageAlt,
    seo: article.seo,
    date: articleDate(article),
    readMinutes: readMinutes(article.content),
  };
}

/** Veröffentlichte Artikel, neueste zuerst. */
export async function listPublicArticles(limit?: number): Promise<PublicBlogArticle[]> {
  const live = (await listBlogArticles())
    .filter((article) => isPublished(article))
    .sort((a, b) => articleDate(b).localeCompare(articleDate(a)))
    .map(toPublicArticle);

  return typeof limit === "number" ? live.slice(0, limit) : live;
}

export async function getPublicArticle(slug: string): Promise<PublicBlogArticle | null> {
  const match = (await listBlogArticles()).find(
    (article) => article.slug === slug && isPublished(article),
  );
  return match ? toPublicArticle(match) : null;
}

/* ---------------------------------------------------------------- Kennungen */

/** Titel → Adressbestandteil. Umlaute ausgeschrieben, sonst bliebe nichts übrig. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/** Hängt -2, -3 … an, solange die Kennung schon vergeben ist. */
export function uniqueSlug(title: string, taken: string[], fallback = "artikel"): string {
  const base = slugify(title) || fallback;
  if (!taken.includes(base)) return base;

  let suffix = 2;
  while (taken.includes(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}
