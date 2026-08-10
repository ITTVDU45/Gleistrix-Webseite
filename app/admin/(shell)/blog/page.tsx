import Link from "next/link";
import { ExternalLink, FileText, Link2, Type } from "lucide-react";

import {
  deleteBlogSourceAction,
  deleteBlogSuggestionAction,
  setBlogArticleStatusAction,
} from "@/app/admin/blog-actions";
import {
  AnalyzeSourceButton,
  GenerateArticleButton,
  SourceForm,
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
import { blogAiIssue } from "@/lib/admin/blog/agent";
import {
  isPublished,
  listBlogArticles,
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
  const [sources, suggestions, articles] = await Promise.all([
    listBlogSources(),
    listBlogSuggestions(),
    listBlogArticles(),
  ]);

  const aiIssue = blogAiIssue();
  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const openSuggestions = suggestions.filter((entry) => entry.status !== "erledigt");
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
          und in der Sektion der Startseite.
        </p>
      </header>

      {aiIssue ? (
        <p
          role="status"
          className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-inset ring-amber-600/20"
        >
          {aiIssue} Quellen und Artikel lassen sich weiterhin von Hand pflegen.
        </p>
      ) : null}

      {/* ------------------------------------------------------------ Quellen */}

      <Section
        title={`Quellen (${formatNumber(sources.length)})`}
        description="Links, eingefügte Texte und Dokumente, aus denen Themen entstehen."
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
          <ul className="space-y-3">
            {sources.map((source) => {
              const Icon = KIND_ICON[source.kind];
              const derived = suggestions.filter((entry) => entry.sourceIds.includes(source.id));

              return (
                <li key={source.id} className="rounded-xl border p-3.5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
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
                            source.origin || `${formatNumber(source.text.length)} Zeichen Text`
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
        )}
      </Section>

      {/* --------------------------------------------------------- Vorschläge */}

      <Section
        title={`Themenvorschläge (${formatNumber(openSuggestions.length)})`}
        description="Aus den Quellen erkannte Themen. Erst beim Schreiben entsteht der eigentliche Artikel."
      >
        {openSuggestions.length === 0 ? (
          <EmptyState>
            Keine offenen Vorschläge. Eine Quelle auswerten lassen, um welche zu bekommen.
          </EmptyState>
        ) : (
          <ul className="grid gap-3 lg:grid-cols-2">
            {openSuggestions.map((suggestion) => (
              <li key={suggestion.id} className="flex flex-col rounded-xl border p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{suggestion.title}</p>
                  <NeutralBadge>{suggestion.category}</NeutralBadge>
                </div>

                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                  {suggestion.summary}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  Leitwort: <span className="font-medium">{suggestion.keyword || "—"}</span>
                  {" · Quelle: "}
                  {suggestion.sourceIds
                    .map((id) => sourceById.get(id)?.title ?? "gelöscht")
                    .join(", ")}
                </p>

                {suggestion.error ? (
                  <p className="mt-2 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
                    {suggestion.error}
                  </p>
                ) : null}

                <div className="mt-3 flex flex-wrap items-end justify-between gap-2 pt-1">
                  <GenerateArticleButton suggestionId={suggestion.id} disabled={Boolean(aiIssue)} />
                  <form action={deleteBlogSuggestionAction}>
                    <input type="hidden" name="suggestionId" value={suggestion.id} />
                    <Button type="submit" size="sm" variant="ghost">
                      Verwerfen
                    </Button>
                  </form>
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
