/**
 * Selbsttest für Blog-Ablage und Terminlogik.
 *
 * Warum es diesen Check gibt: Die geplante Veröffentlichung hat bewusst KEINEN
 * Hintergrundlauf – ein Artikel wird öffentlich, weil beim Lesen sein Zeitpunkt
 * verglichen wird. Genau daran hängen die Fehler, die man nicht sofort sieht:
 * ein Entwurf, der doch ausgeliefert wird, ein geplanter Artikel, der nie
 * erscheint, und ein gelöschter Standardartikel, der beim nächsten Lesen wieder
 * da ist. Dazu die Bereinigung des Artikel-HTML, die als einzige Stelle
 * zwischen Modellausgabe und dangerouslySetInnerHTML steht.
 *
 * Läuft gegen den Dateispeicher in einem Wegwerf-Verzeichnis, nie gegen eine
 * Datenbank.
 *
 * Ausführen: `node lib/admin/blog/store.check.ts`
 */
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { registerHooks } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";

// Wie in landing-modules.check.ts: der @/-Alias und endungslose Pfade sind für
// den Bundler richtig, für ein nacktes `node` aber nicht auflösbar.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith("@/")) {
      return next(new URL(`../../../${specifier.slice(2)}.ts`, import.meta.url).href, context);
    }
    const relative = specifier.startsWith("./") || specifier.startsWith("../");
    const fromProject = !context.parentURL?.includes("/node_modules/");
    return next(
      relative && fromProject && !specifier.endsWith(".ts") ? `${specifier}.ts` : specifier,
      context,
    );
  },
});

const dataDir = await mkdtemp(path.join(tmpdir(), "gleistrix-blog-"));
process.env.GLEISTRIX_DATA_DIR = dataDir;
// Der Check darf unter keinen Umständen an einer echten Datenbank landen.
delete process.env.MONGODB_URI;
delete process.env.MONGODB_HOST;

try {
  const { DEFAULT_BLOG_ARTICLES, DEFAULT_BLOG_CATEGORIES } = await import("../../../data/blog.ts");
  const {
    deleteBlogArticle,
    getPublicArticle,
    isPublished,
    listBlogArticles,
    listPublicArticles,
    readMinutes,
    saveBlogArticle,
    saveBlogCategory,
    deleteBlogCategory,
    listBlogCategories,
    articleCountByCategory,
    uniqueSlug,
  } = await import("./store.ts");
  const { sanitizeArticleHtml } = await import("./html.ts");

  const hour = 60 * 60 * 1000;
  const template = DEFAULT_BLOG_ARTICLES[0];

  /* ----------------------------------------------------- Auslieferungsstand */

  // 1. Leere Ablage ⇒ Auslieferungszustand. Ohne diesen Rückfall stünde /blog
  // vor der ersten Pflege leer da, obwohl die Startseite darauf verlinkt.
  assert.equal((await listBlogArticles()).length, DEFAULT_BLOG_ARTICLES.length);
  assert.equal((await listPublicArticles()).length, DEFAULT_BLOG_ARTICLES.length);

  /* ------------------------------------------------------------ Terminlogik */

  const base = {
    ...template,
    id: "test-artikel",
    slug: "test-artikel",
    title: "Testartikel",
    sourceIds: [],
    generatedByAi: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };

  // 2. Ein Entwurf ist nie öffentlich – auch nicht mit gesetztem Zeitpunkt.
  assert.equal(
    isPublished({ ...base, status: "entwurf", publishAt: "2020-01-01T00:00:00.000Z" }),
    false,
    "Ein Entwurf darf nie ausgeliefert werden",
  );

  // 3. Geplant in der Zukunft ⇒ noch nicht sichtbar.
  const future = new Date(Date.now() + hour).toISOString();
  assert.equal(isPublished({ ...base, status: "geplant", publishAt: future }), false);

  // 4. Geplant in der Vergangenheit ⇒ sichtbar, ohne dass jemand etwas
  // umgeschrieben hat. Das ist der Kern der Planung ohne Hintergrundlauf.
  const past = new Date(Date.now() - hour).toISOString();
  assert.equal(isPublished({ ...base, status: "geplant", publishAt: past }), true);

  // 5. Geplant ohne Zeitpunkt bleibt unsichtbar, statt sofort live zu gehen.
  assert.equal(isPublished({ ...base, status: "geplant", publishAt: undefined }), false);

  /* ------------------------------------------------- Ablage und Sichtbarkeit */

  // 6. Ein gespeicherter Entwurf taucht im Adminbereich auf, öffentlich nicht.
  await saveBlogArticle({ ...base, status: "entwurf" });
  assert.equal(
    (await listBlogArticles()).length,
    DEFAULT_BLOG_ARTICLES.length + 1,
    "Speichern darf den Auslieferungszustand nicht ersetzen",
  );
  assert.equal(await getPublicArticle("test-artikel"), null, "Entwürfe haben keine Seite");

  // 7. Auf geplant-in-der-Zukunft umgestellt: weiterhin keine Seite.
  await saveBlogArticle({ ...base, status: "geplant", publishAt: future, publishedAt: future });
  assert.equal(await getPublicArticle("test-artikel"), null);

  // 8. Zeitpunkt erreicht ⇒ Seite da, mit dem geplanten Datum.
  await saveBlogArticle({ ...base, status: "geplant", publishAt: past, publishedAt: past });
  const live = await getPublicArticle("test-artikel");
  assert.ok(live, "Ein fälliger geplanter Artikel muss ausgeliefert werden");
  assert.equal(live.date, past, "Öffentlich steht der geplante Zeitpunkt");
  assert.ok(live.readMinutes >= 1, "Die Lesezeit ist mindestens eine Minute");

  // 9. Löschen wirkt dauerhaft – auch bei einem Standardartikel, der nur im
  // Code existiert. Ohne Verankerung käme er beim nächsten Lesen zurück.
  await deleteBlogArticle(template.id);
  assert.equal(
    (await listBlogArticles()).some((article) => article.id === template.id),
    false,
    "Ein gelöschter Standardartikel darf nicht wiederkommen",
  );

  /* ---------------------------------------------------------------- Adressen */

  // 10. Gleicher Titel ⇒ eigene Adresse, sonst überschriebe der zweite Artikel
  // die Seite des ersten.
  assert.equal(uniqueSlug("Plantafel statt Excel", []), "plantafel-statt-excel");
  assert.equal(
    uniqueSlug("Plantafel statt Excel", ["plantafel-statt-excel"]),
    "plantafel-statt-excel-2",
  );
  assert.equal(uniqueSlug("Zeiterfassung für Züge", []), "zeiterfassung-fuer-zuege");

  /* -------------------------------------------------------------- Bereinigung */

  // 11. Skript und Attribute überleben nicht. Der Text kommt aus einem Modell,
  // das eine Anweisung aus einem hochgeladenen Dokument befolgt haben kann.
  const dirty = sanitizeArticleHtml(
    `<p onclick="steal()">Text</p><script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">Klick</a><h2 style="color:red">Titel</h2>`,
  );
  assert.equal(dirty.includes("onclick"), false, "Ereignis-Attribute müssen weg");
  assert.equal(dirty.includes("script"), false, "Skripte müssen samt Inhalt weg");
  assert.equal(dirty.includes("alert(1)"), false, "Kein Skripttext darf übrig bleiben");
  assert.equal(dirty.includes("<img"), false, "Nicht erlaubte Elemente fallen weg");
  assert.equal(dirty.includes("javascript:"), false, "javascript:-Adressen müssen weg");
  assert.equal(dirty.includes("style="), false, "Attribute werden grundsätzlich entfernt");
  assert.ok(dirty.includes("<p>Text</p>"), "Erlaubte Elemente bleiben erhalten");
  assert.ok(dirty.includes("<h2>Titel</h2>"), "Überschriften bleiben erhalten");

  // 12. Ein erlaubter Link behält sein Ziel und bekommt den Schutz für neue Tabs.
  const link = sanitizeArticleHtml('<p><a href="https://www.gleistrix.de/preise">Preise</a></p>');
  assert.ok(link.includes('href="https://www.gleistrix.de/preise"'));
  assert.ok(link.includes('rel="noopener noreferrer"'));

  // 13. Interne Links bleiben ohne target – sonst öffnete die eigene Seite in
  // einem neuen Tab.
  const internal = sanitizeArticleHtml('<p><a href="/preise">Preise</a></p>');
  assert.ok(internal.includes('<a href="/preise">'));
  assert.equal(internal.includes("target"), false);

  // 14. Lesezeit zählt Wörter, keine Tags.
  assert.equal(readMinutes("<p>ein wort</p>"), 1);

  /* ----------------------------------------------------------------- Rubriken */

  // 15. Leere Ablage ⇒ Auslieferungszustand. Sonst stünde im Artikelformular
  // vor der ersten Pflege eine leere Auswahl.
  assert.equal((await listBlogCategories()).length, DEFAULT_BLOG_CATEGORIES.length);

  // 16. Eine neue Rubrik kommt dazu, ohne die Standardliste zu verdrängen.
  const neu = {
    id: "sperrpausen",
    name: "Sperrpausen",
    slug: "sperrpausen",
    description: "Planung und Nachweis von Sperrpausen.",
    createdAt: "2026-08-10T12:00:00.000Z",
  };
  await saveBlogCategory(neu);
  const nachAnlegen = await listBlogCategories();
  assert.equal(
    nachAnlegen.length,
    DEFAULT_BLOG_CATEGORIES.length + 1,
    "Anlegen muss den Auslieferungszustand verankern, nicht ersetzen",
  );
  assert.ok(nachAnlegen.some((entry) => entry.name === "Sperrpausen"));

  // 17. Der Kern: Umbenennen zieht auf die Artikel durch. Ohne das trüge der
  // Artikel eine Rubrik, die es in der Verwaltung nicht mehr gibt – und wäre
  // im Formular nicht mehr auswählbar.
  await saveBlogArticle({ ...base, id: "rubrik-test", slug: "rubrik-test", category: "Sperrpausen" });
  await saveBlogCategory({ ...neu, name: "Sperrzeiten" });
  const umbenannt = await listBlogArticles();
  assert.equal(
    umbenannt.find((a) => a.id === "rubrik-test")?.category,
    "Sperrzeiten",
    "Ein umbenannte Rubrik muss auf die Artikel durchziehen",
  );

  // 18. Zählung je Rubrik – Grundlage für die Warnung vor dem Löschen.
  assert.equal((await articleCountByCategory()).get("Sperrzeiten"), 1);

  // 19. Löschen entfernt die Rubrik, lässt den Artikel aber stehen. Ein
  // veröffentlichter Artikel darf nicht verschwinden, weil jemand aufgeräumt hat.
  await deleteBlogCategory(neu.id);
  assert.equal(
    (await listBlogCategories()).some((entry) => entry.id === neu.id),
    false,
    "Die gelöschte Rubrik ist weg",
  );
  assert.equal(
    (await listBlogArticles()).find((a) => a.id === "rubrik-test")?.category,
    "Sperrzeiten",
    "Der Artikel behält seine Rubrik als Text",
  );

  console.log("blog/store.check: alle Prüfungen bestanden");
} finally {
  await rm(dataDir, { recursive: true, force: true });
}
