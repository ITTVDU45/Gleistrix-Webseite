import Link from "next/link";
import { ExternalLink, FileText, Link2, Tags, Type } from "lucide-react";

import {
  deleteBlogSourceAction,
  deleteBlogSuggestionAction,
  setBlogArticleStatusAction,
} from "@/app/admin/blog-actions";
import {
  AnalyzeSourceButton,
  ArticleForm,
  GenerateArticleButton,
  SourceForm,
  TopicForm,
} from "@/components/admin/blog/forms";
import Modal from "@/components/admin/pricing/Modal";
import { NeutralBadge } from "@/components/admin/pricing/ui";
import {
  BlogAnalysisStatusPill,
  BlogArticleStatusPill,
  EmptyState,
  Section,
  formatDateTime,
  formatNumber,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { blogAiIssue, blogAiModel } from "@/lib/admin/blog/agent";
import {
  isPublished,
  listBlogArticles,
  listBlogCategories,
  listBlogSources,
  listBlogSuggestions,
} from "@/lib/admin/blog/store";
import type { BlogSourceKind } from "@/types/blog";

export const metadata = { title: "Blog & News" };

/**
 * Analyse und Artikelgenerierung laufen synchron in einer Server Action und
 * brauchen dafür mehr als die 60 Sekunden der Voreinstellung – ein längerer
 * Artikel liegt bei ein bis zwei Minuten.
 */
export const maxDuration = 300;

const KIND_ICON: Record<BlogSourceKind, typeof Link2> = {
  link: Link2,
  text: Type,
  datei: FileText,
};

export default async function BlogPage() {
  const [sources, suggestions, articles, categories] = await Promise.all([
    listBlogSources(),
    listBlogSuggestions(),
    listBlogArticles(),
    listBlogCategories(),
  ]);

  const aiIssue = blogAiIssue();
  const aiModel = blogAiModel();
  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const openSuggestions = suggestions.filter((entry) => entry.status !== "erledigt");

  // Nach Rubrik gruppiert statt chronologisch: bei einem Dutzend Quellen sagt
  // eine Liste nach Anlagedatum nichts mehr darueber, was man eigentlich hat.
  // Noch nicht ausgewertete Quellen stehen oben – dort ist etwas zu tun.
  const UNSORTED = "Noch nicht ausgewertet";
  const describe = new Map(categories.map((entry) => [entry.name, entry.description]));
  const grouped = new Map<string, typeof sources>();
  for (const source of sources) {
    const key = source.category || UNSORTED;
    grouped.set(key, [...(grouped.get(key) ?? []), source]);
  }
  const groups = [...grouped.entries()].sort(([a], [b]) =>
    a === UNSORTED ? -1 : b === UNSORTED ? 1 : a.localeCompare(b),
  );
  const liveCount = articles.filter((article) => isPublished(article)).length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Blog &amp; News</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quellen sammeln, daraus Themen vorschlagen lassen, Artikel schreiben und einplanen.
          Veröffentlichte Artikel stehen auf{" "}
          <Link href="/blog" className="text-primary underline-offset-4 hover:underline">
            /blog
          </Link>{" "}
          und in der Sektion der Startseite. Rubriken werden unter{" "}
          <Link
            href="/admin/blog/kategorien"
            className="text-primary underline-offset-4 hover:underline"
          >
            Kategorien
          </Link>{" "}
          gepflegt.
        </p>
      </header>

      {aiIssue ? (
        <p
          role="status"
          className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-inset ring-amber-600/20"
        >
          {aiIssue} Quellen und Artikel lassen sich weiterhin von Hand pflegen.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          KI-Anbindung aktiv: <span className="font-medium">{aiModel}</span>
        </p>
      )}

      {/* ------------------------------------------------------------ Quellen */}

      <Section
        title={`Quellen (${formatNumber(sources.length)})`}
        description="Links, eingefügte Texte und Dokumente. Die Auswertung ordnet jede Quelle einer Rubrik zu – ausgewertet wird immer nur eine Quelle, nie mehrere zusammen."
        action={
          <Modal
            label="Quelle hinzufügen"
            title="Neue Quelle"
            description="Ein Link wird beim Speichern ausgelesen, eine PDF-Datei erst bei der Analyse."
          >
            <SourceForm />
          </Modal>
        }
      >
        {sources.length === 0 ? (
          <EmptyState>
            Noch keine Quelle hinterlegt. Ein Fachartikel, eine Norm oder ein eigener
            Projektbericht reicht als Ausgangspunkt.
          </EmptyState>
        ) : (
          <div className="space-y-6">
            {groups.map(([group, entries]) => (
              <div key={group}>
                <h3 className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Tags className="size-3.5" aria-hidden />
                  {group}
                  <span className="font-normal normal-case tracking-normal">
                    ({formatNumber(entries.length)})
                  </span>
                </h3>

                {describe.get(group) ? (
                  <p className="mb-2.5 text-xs text-muted-foreground">{describe.get(group)}</p>
                ) : null}

                <ul className="space-y-3">
                  {entries.map((source) => {
                    const Icon = KIND_ICON[source.kind];
                    const derived = suggestions.filter((entry) =>
                      entry.sourceIds.includes(source.id),
                    );

                    return (
                      <li key={source.id} className="rounded-xl border p-3.5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex min-w-0 gap-3">
                            <Icon
                              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                              aria-hidden
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{source.title}</p>
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                {source.kind === "link" ? (
                                  <a
                                    href={source.origin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                  >
                                    {source.origin}
                                  </a>
                                ) : (
                                  source.origin ||
                                  `${formatNumber(source.text.length)} Zeichen Text`
                                )}
                                {" · "}
                                {formatDateTime(source.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <BlogAnalysisStatusPill status={source.status} />
                            {derived.length > 0 ? (
                              <NeutralBadge>
                                {formatNumber(derived.length)}{" "}
                                {derived.length === 1 ? "Vorschlag" : "Vorschläge"}
                              </NeutralBadge>
                            ) : null}
                          </div>
                        </div>

                        {source.summary ? (
                          <p className="mt-2 pl-7 text-xs leading-5 text-muted-foreground">
                            {source.summary}
                          </p>
                        ) : null}

                        {source.error ? (
                          <p className="mt-2 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
                            {source.error}
                          </p>
                        ) : null}

                        <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
                          <AnalyzeSourceButton
                            sourceId={source.id}
                            disabled={Boolean(aiIssue)}
                            again={source.status === "fertig"}
                          />
                          <form action={deleteBlogSourceAction}>
                            <input type="hidden" name="sourceId" value={source.id} />
                            <Button type="submit" size="sm" variant="ghost">
                              Löschen
                            </Button>
                          </form>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* --------------------------------------------------------- Vorschläge */}

      <Section
        title={`Themen (${formatNumber(openSuggestions.length)})`}
        description="Aus den Quellen erkannt oder von Hand vorgegeben. Erst beim Schreiben entsteht der eigentliche Artikel – mit Web-Recherche zur Ergänzung und Gegenprüfung."
        action={
          <Modal
            label="Thema vorgeben"
            title="Neues Thema"
            description="Titel und eine Gliederungskette. Der Artikel folgt ihr Station für Station, die Websuche recherchiert gezielt dazu."
          >
            <TopicForm categories={categories} sources={sources} />
          </Modal>
        }
      >
        {openSuggestions.length === 0 ? (
          <EmptyState>
            Keine offenen Themen. Eine Quelle auswerten lassen – oder oben ein Thema von Hand
            vorgeben.
          </EmptyState>
        ) : (
          <ul className="grid gap-3 lg:grid-cols-2">
            {openSuggestions.map((suggestion) => (
              <li key={suggestion.id} className="flex flex-col rounded-xl border p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{suggestion.title}</p>
                  <span className="flex shrink-0 items-center gap-1.5">
                    {suggestion.manual ? <NeutralBadge>vorgegeben</NeutralBadge> : null}
                    <NeutralBadge>{suggestion.category}</NeutralBadge>
                  </span>
                </div>

                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                  {suggestion.summary}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  Leitwort: <span className="font-medium">{suggestion.keyword || "—"}</span>
                </p>
                {/* Herkunft eigenstaendig und nicht als Nebensatz: bei mehreren
                    Quellen ist das die Angabe, an der man erkennt, worauf ein
                    Artikel spaeter beruht. */}
                <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground">Aus:</span>
                  {suggestion.sourceIds.map((id) => {
                    const source = sourceById.get(id);
                    return (
                      <span
                        key={id}
                        className={
                          source
                            ? "rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-700"
                            : "rounded bg-rose-50 px-1.5 py-0.5 font-medium text-rose-700"
                        }
                      >
                        {source ? source.title : "Quelle gelöscht"}
                      </span>
                    );
                  })}
                </p>

                {suggestion.instruction ? (
                  <p className="mt-2 whitespace-pre-wrap rounded-md bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600 ring-1 ring-inset ring-slate-200">
                    <span className="font-medium">Gliederung: </span>
                    {suggestion.instruction}
                  </p>
                ) : null}

                {suggestion.error ? (
                  <p className="mt-2 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
                    {suggestion.error}
                  </p>
                ) : null}

                <div className="mt-3 flex flex-wrap items-end justify-between gap-2 pt-1">
                  <GenerateArticleButton suggestionId={suggestion.id} disabled={Boolean(aiIssue)} />
                  <span className="flex items-center gap-1">
                    <Modal
                      label="Nachschärfen"
                      variant="outline"
                      title={suggestion.title}
                      description="Gliederung ergänzen oder Rubrik und Leitwort korrigieren, bevor der Artikel entsteht."
                    >
                      <TopicForm
                        suggestion={suggestion}
                        categories={categories}
                        sources={sources}
                      />
                    </Modal>
                    <form action={deleteBlogSuggestionAction}>
                      <input type="hidden" name="suggestionId" value={suggestion.id} />
                      <Button type="submit" size="sm" variant="ghost">
                        Verwerfen
                      </Button>
                    </form>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* ------------------------------------------------------------ Artikel */}

      <Section
        title={`Artikel (${formatNumber(articles.length)})`}
        description={`${formatNumber(liveCount)} davon öffentlich sichtbar. Geplante Artikel erscheinen ohne weiteres Zutun, sobald ihr Zeitpunkt erreicht ist.`}
        action={
          <Modal
            label="Artikel anlegen"
            title="Neuer Artikel"
            description="Von Hand geschrieben, ohne KI. Für einen KI-Entwurf stattdessen oben ein Thema anlegen und schreiben lassen."
          >
            {/* Dasselbe Formular wie auf der Detailseite, nur ohne Artikel –
                Anlegen und Bearbeiten unterscheiden sich fachlich nicht. */}
            <ArticleForm categories={categories} />
          </Modal>
        }
      >
        {articles.length === 0 ? (
          <EmptyState>Noch kein Artikel angelegt.</EmptyState>
        ) : (
          <ul className="divide-y">
            {articles.map((article) => {
              const live = isPublished(article);

              return (
                <li key={article.id} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="min-w-56 flex-1">
                    <Link
                      href={`/admin/blog/${article.id}`}
                      className="text-sm font-medium underline-offset-4 hover:underline"
                    >
                      {article.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {article.category || "ohne Rubrik"}
                      {article.status === "geplant" && article.publishAt
                        ? ` · für ${formatDateTime(article.publishAt)}`
                        : article.publishedAt
                          ? ` · ${formatDateTime(article.publishedAt)}`
                          : ""}
                      {article.generatedByAi ? " · KI-Entwurf" : ""}
                    </p>
                  </div>

                  <BlogArticleStatusPill status={article.status} />

                  <div className="flex items-center gap-1">
                    {live ? (
                      <Button asChild size="sm" variant="ghost">
                        <a href={`/blog/${article.slug}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="size-4" aria-hidden />
                          Ansehen
                        </a>
                      </Button>
                    ) : null}

                    <form action={setBlogArticleStatusAction}>
                      <input type="hidden" name="articleId" value={article.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={live ? "entwurf" : "veroeffentlicht"}
                      />
                      <Button type="submit" size="sm" variant="outline">
                        {live ? "Zurückziehen" : "Veröffentlichen"}
                      </Button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </div>
  );
}
