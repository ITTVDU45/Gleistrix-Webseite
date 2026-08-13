import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import PageHero from "@/components/landing/PageHero";
import MediaFrame from "@/components/media/MediaFrame";
import { listPublicArticles } from "@/lib/admin/blog/store";

/**
 * Öffentliche Blogübersicht.
 *
 * `revalidate` ist der Preis dafür, dass geplante Artikel ohne Hintergrundlauf
 * erscheinen: die Seite wird zwischengespeichert und höchstens zehn Minuten alt
 * ausgeliefert – ein geplanter Artikel ist also spätestens zehn Minuten nach
 * seinem Zeitpunkt sichtbar. Beim Speichern im Adminbereich wird zusätzlich
 * sofort revalidiert (siehe revalidateBlog in app/admin/blog-actions.ts).
 */
export const revalidate = 600;

export const metadata: Metadata = {
  title: "News & Ratgeber",
  description:
    "Fachbeiträge zu Disposition, Sicherung, Zeiterfassung, Fuhrpark und Abrechnung im Bahnbau.",
};

const dateFormat = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function BlogIndexPage() {
  const articles = await listPublicArticles();
  const [lead, ...rest] = articles;

  return (
    <main>
      <PageHero
        eyebrow="News & Ratgeber"
        title={
          <>
            Wissen für den <span className="text-gradient-accent">Bahnbau</span>
          </>
        }
        description="Fachbeiträge zu Disposition, Sicherung, Zeiterfassung, Fuhrpark und Abrechnung – aus der Praxis von Gleisbaubetrieben."
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "News & Ratgeber" }]}
      >
        <MediaFrame
          src="/placeholders/uebersicht-blog.svg"
          alt="Fachwissen aus der Bahnbranche"
          ratio="strip"
          priority
          sizes="(min-width: 768px) 1100px, 100vw"
        />
      </PageHero>

      <section className="page-container pb-20 pt-14 md:pb-28 md:pt-16">
        {articles.length === 0 ? (
          <p className="rounded-2xl border border-dashed px-6 py-16 text-center text-slate-500">
            Zurzeit sind keine Beiträge veröffentlicht.
          </p>
        ) : (
          <>
            {/* Der neueste Beitrag bekommt die volle Breite – ohne diese
                Abstufung wirkt eine gleichförmige Kartenreihe wie ein Katalog. */}
            <Link
              href={`/blog/${lead.slug}`}
              className="group relative block overflow-hidden rounded-3xl border border-slate-900/8 bg-white shadow-soft-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[22rem]">
                  {lead.imageSrc ? (
                    <Image
                      src={lead.imageSrc}
                      alt={lead.imageAlt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      priority
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="size-full bg-gradient-to-br from-indigo-50 to-slate-100" />
                  )}
                </div>

                <div className="flex flex-col justify-center p-7 md:p-10">
                  <span className="inline-flex w-fit rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700">
                    {lead.category}
                  </span>
                  <h2 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-3xl">
                    {lead.title}
                  </h2>
                  <p className="mt-4 text-base leading-7 text-slate-500">{lead.teaser}</p>
                  <p className="mt-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-400">
                    <time dateTime={lead.date}>{dateFormat.format(new Date(lead.date))}</time>
                    <span aria-hidden>·</span>
                    <span>{lead.readMinutes} Min. Lesezeit</span>
                  </p>
                </div>
              </div>
            </Link>

            {rest.length > 0 ? (
              <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-900/8 bg-white shadow-soft-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft"
                    >
                      <div className="relative aspect-[16/10]">
                        {article.imageSrc ? (
                          <Image
                            src={article.imageSrc}
                            alt={article.imageAlt}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="size-full bg-gradient-to-br from-indigo-50 to-slate-100" />
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <span className="inline-flex w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                          {article.category}
                        </span>
                        <h3 className="mt-4 text-lg font-bold leading-snug tracking-tight text-slate-900">
                          {article.title}
                        </h3>
                        <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-slate-500">
                          {article.teaser}
                        </p>
                        <p className="mt-auto flex flex-wrap items-center gap-2 pt-5 text-sm font-semibold text-slate-400">
                          <time dateTime={article.date}>
                            {dateFormat.format(new Date(article.date))}
                          </time>
                          <span aria-hidden>·</span>
                          <span>{article.readMinutes} Min. Lesezeit</span>
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
