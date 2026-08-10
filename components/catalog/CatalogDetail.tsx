import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import type { Catalog, CatalogEntry } from "@/data/catalog";
import { fillHeading, relatedEntries } from "@/data/catalog";
import Reveal from "@/components/landing/Reveal";
import CTASection from "@/components/sections/CTASection";
import { Button } from "@/components/ui/button";

type CatalogDetailProps = {
  catalog: Catalog;
  entry: CatalogEntry;
};

/**
 * Vorlage für alle Detailseiten – Module, Branchen und Integrationen.
 *
 * Der Aufbau ist bewusst überall identisch: Kopf mit Motiv, drei Nutzenpunkte,
 * Leistungsliste, Verweise auf Nachbarseiten. Es wechseln nur Inhalte und
 * Bilder. Eine neue Seite entsteht dadurch als Eintrag in einer Datendatei,
 * nicht als neue Komponente.
 */
export default function CatalogDetail({ catalog, entry }: CatalogDetailProps) {
  const Icon = entry.icon;
  const related = relatedEntries(catalog.entries, entry.slug);

  return (
    <>
      <section className="relative overflow-hidden bg-white pb-16 pt-32 md:pb-24 md:pt-40">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.13),transparent)]" />
          <div className="absolute -right-32 top-24 h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.10),transparent)]" />
        </div>

        <div className="page-container relative">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-indigo-600">
                  Startseite
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={catalog.overviewHref}
                  className="transition-colors hover:text-indigo-600"
                >
                  {catalog.plural}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-slate-600">
                {entry.title}
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-700">
                <Icon aria-hidden className="h-3.5 w-3.5" />
                {catalog.singular}
              </span>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-[2.75rem] md:leading-[1.12]">
                {entry.title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
                {entry.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-xl bg-indigo-600 px-7 text-base text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-indigo-500"
                >
                  <Link href="/demo-buchen">Demo anfragen</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-xl border-slate-200 bg-white/70 px-7 text-base text-slate-700 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:text-slate-900"
                >
                  <Link href={catalog.overviewHref}>{catalog.overviewLabel}</Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <CatalogMedia entry={entry} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Drei Nutzenpunkte */}
      <section aria-labelledby="catalog-highlights" className="bg-[#f8fafc] py-16 md:py-24">
        <div className="page-container">
          <h2 id="catalog-highlights" className="sr-only">
            Nutzen im Überblick
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {entry.highlights.map((highlight, index) => (
              <Reveal key={highlight.title} delay={index * 0.06}>
                <article className="h-full rounded-3xl border border-slate-900/8 bg-white p-7 shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">{highlight.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{highlight.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leistungsumfang */}
      <section aria-labelledby="catalog-scope" className="bg-white py-16 md:py-24">
        <div className="page-container">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-14">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Im Detail
              </span>
              <h2
                id="catalog-scope"
                className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
              >
                {fillHeading(catalog.scopeHeading, entry.title)}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-slate-500">
                {entry.tagline} – abgestimmt auf den Alltag von Bahndienstleistern und im
                Zusammenspiel mit allen anderen Bereichen der Plattform.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {entry.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 rounded-2xl border border-slate-900/8 bg-[#f8fafc] px-4 py-3.5 text-sm leading-relaxed text-slate-600"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                      <Check aria-hidden className="h-3 w-3" />
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Nachbarseiten */}
      {related.length > 0 && (
        <section aria-labelledby="catalog-related" className="bg-[#f8fafc] py-16 md:py-20">
          <div className="page-container">
            <h2
              id="catalog-related"
              className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
            >
              Weitere {catalog.plural}
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((item, index) => {
                const RelatedIcon = item.icon;
                return (
                  <Reveal key={item.slug} delay={index * 0.06}>
                    <Link
                      href={`${catalog.basePath}/${item.slug}`}
                      className="group flex h-full flex-col rounded-3xl border border-slate-900/8 bg-white p-6 shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                        <RelatedIcon aria-hidden className="h-[18px] w-[18px]" />
                      </span>
                      <h3 className="mt-4 text-base font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{item.tagline}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
                        Ansehen
                        <ArrowRight
                          aria-hidden
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <CTASection
        title={fillHeading(catalog.ctaHeading, entry.title)}
        description="In einer kurzen Demo zeigen wir dir den Bereich im Zusammenspiel mit der gesamten Plattform."
      />
    </>
  );
}

/** Motiv im Seitenkopf: Foto, wenn vorhanden – sonst die Logokarte. */
function CatalogMedia({ entry }: { entry: CatalogEntry }) {
  if (entry.image) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-900/8 bg-[#f8fafc] shadow-soft">
        <Image
          src={entry.image}
          alt={entry.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
    );
  }

  if (entry.logo) {
    return (
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-slate-900/8 bg-white shadow-soft">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(99,102,241,0.10),transparent)]"
        />
        <Image
          src={entry.logo.src}
          alt={entry.title}
          width={entry.logo.width}
          height={entry.logo.height}
          sizes="320px"
          className="relative max-h-24 w-auto max-w-[60%] object-contain"
          priority
        />
      </div>
    );
  }

  return null;
}
