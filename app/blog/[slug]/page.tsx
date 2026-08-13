import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getPublicArticle, listPublicArticles } from "@/lib/admin/blog/store";
import { pageMetadata } from "@/lib/seo-metadata";

/** Wie die Übersicht: geplante Artikel erscheinen ohne Hintergrundlauf. */
export const revalidate = 600;

const dateFormat = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * Vorbauen, was schon veröffentlicht ist.
 *
 * `dynamicParams` bleibt eingeschaltet (Voreinstellung): ein Artikel, der erst
 * nach dem Bauen fällig wird, muss trotzdem erreichbar sein.
 */
export async function generateStaticParams() {
  return (await listPublicArticles()).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const article = await getPublicArticle((await params).slug);
  if (!article) return { title: "Beitrag nicht gefunden" };

  return pageMetadata({
    title: article.seo.title || article.title,
    description: article.seo.description || article.teaser,
    path: `/blog/${article.slug}`,
    image: article.imageSrc || undefined,
    type: "article",
    publishedTime: article.date,
  });
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getPublicArticle((await params).slug);
  if (!article) notFound();

  const more = (await listPublicArticles())
    .filter((entry) => entry.slug !== article.slug)
    .slice(0, 3);

  return (
    <main>
      <article>
        <header className="relative overflow-hidden bg-white pb-10 pt-32 md:pt-40">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.13),transparent)]" />
          </div>

          <div className="page-container relative">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 underline-offset-4 transition-colors hover:text-slate-900"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Alle Beiträge
            </Link>

            <div className="mx-auto mt-6 max-w-3xl">
              <span className="inline-flex rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700">
                {article.category}
              </span>
              <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
                {article.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-500">{article.teaser}</p>
              <p className="mt-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-400">
                <time dateTime={article.date}>{dateFormat.format(new Date(article.date))}</time>
                <span aria-hidden>·</span>
                <span>{article.readMinutes} Min. Lesezeit</span>
              </p>
            </div>
          </div>
        </header>

        {article.imageSrc ? (
          <div className="page-container">
            <div className="relative mx-auto aspect-[16/9] max-w-4xl overflow-hidden rounded-3xl border border-slate-900/8 shadow-soft-sm">
              <Image
                src={article.imageSrc}
                alt={article.imageAlt}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                priority
                className="object-cover"
              />
            </div>
          </div>
        ) : null}

        <div className="page-container py-14 md:py-20">
          {/* Der Text ist beim Speichern durch sanitizeArticleHtml gelaufen –
              erlaubt ist nur ein festes Tag-Set ohne Attribute außer href. */}
          <div
            className="prose-blog mx-auto max-w-3xl"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {article.tags.length > 0 ? (
            <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap gap-2">
              {article.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </article>

      {more.length > 0 ? (
        <section aria-labelledby="weitere-beitraege" className="bg-[#f8fafc] py-16 md:py-24">
          <div className="page-container">
            <h2
              id="weitere-beitraege"
              className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
            >
              Weitere Beiträge
            </h2>

            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {more.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/blog/${entry.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-slate-900/8 bg-white p-6 shadow-soft-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft"
                  >
                    <span className="inline-flex w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {entry.category}
                    </span>
                    <h3 className="mt-4 text-lg font-bold leading-snug tracking-tight text-slate-900">
                      {entry.title}
                    </h3>
                    <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-slate-500">
                      {entry.teaser}
                    </p>
                    <p className="mt-auto pt-5 text-sm font-semibold text-slate-400">
                      {entry.readMinutes} Min. Lesezeit
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </main>
  );
}
