import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { deleteBlogArticleAction } from "@/app/admin/blog-actions";
import { ArticleForm } from "@/components/admin/blog/forms";
import { NeutralBadge } from "@/components/admin/pricing/ui";
import {
  BlogArticleStatusPill,
  KeyValue,
  Mono,
  Section,
  formatDateTime,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { getBlogArticle, isPublished, listBlogSources, readMinutes } from "@/lib/admin/blog/store";

/** Wie in der Übersicht: das Speichern kann einen Bild-Upload anstoßen. */
export const maxDuration = 300;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const article = await getBlogArticle((await params).id);
  return { title: article ? article.title : "Artikel" };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const article = await getBlogArticle((await params).id);
  if (!article) notFound();

  const sources = (await listBlogSources()).filter((source) =>
    article.sourceIds.includes(source.id),
  );
  const live = isPublished(article);

  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Zurück zur Übersicht
        </Link>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">{article.title}</h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <BlogArticleStatusPill status={article.status} />
              {article.generatedByAi ? <NeutralBadge>KI-Entwurf</NeutralBadge> : null}
              <span>{readMinutes(article.content)} Min. Lesezeit</span>
            </p>
          </div>

          {live ? (
            <Button asChild size="sm" variant="outline">
              <a href={`/blog/${article.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" aria-hidden />
                Öffentliche Seite
              </a>
            </Button>
          ) : null}
        </div>
      </header>

      <Section title="Artikel bearbeiten">
        <ArticleForm article={article} />
      </Section>

      <Section
        title="Vorschau"
        description="So wird der gespeicherte Text ausgeliefert – nach dem Entfernen nicht erlaubter Elemente."
      >
        {/* Der Text ist beim Speichern durch sanitizeArticleHtml gelaufen; hier
            steht also derselbe geprüfte Stand wie auf der öffentlichen Seite. */}
        <div
          className="prose-blog max-w-2xl"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </Section>

      <Section title="Herkunft und Adresse">
        <dl>
          <KeyValue label="Adresse" value={<Mono>/blog/{article.slug}</Mono>} />
          <KeyValue label="Angelegt" value={formatDateTime(article.createdAt)} />
          <KeyValue label="Zuletzt geändert" value={formatDateTime(article.updatedAt)} />
          {article.publishAt ? (
            <KeyValue label="Geplant für" value={formatDateTime(article.publishAt)} />
          ) : null}
          {article.publishedAt ? (
            <KeyValue label="Öffentliches Datum" value={formatDateTime(article.publishedAt)} />
          ) : null}
          <KeyValue
            label="Quellen"
            value={
              sources.length > 0
                ? sources.map((source) => source.title).join(", ")
                : article.sourceIds.length > 0
                  ? "gelöscht"
                  : "ohne Quelle angelegt"
            }
          />
        </dl>
      </Section>

      <Section
        title="Artikel löschen"
        description="Entfernt den Artikel dauerhaft. Bereits geteilte Links laufen danach ins Leere."
      >
        <form action={deleteBlogArticleAction}>
          <input type="hidden" name="articleId" value={article.id} />
          <Button type="submit" size="sm" variant="outline">
            Löschen
          </Button>
        </form>
      </Section>
    </div>
  );
}
