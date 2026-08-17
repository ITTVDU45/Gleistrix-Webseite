import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Check, ChevronDown } from "lucide-react";

import type { Catalog, CatalogEntry } from "@/data/catalog";
import { fillHeading, relatedEntries } from "@/data/catalog";
import Reveal from "@/components/landing/Reveal";
import CardMedia from "@/components/media/CardMedia";
import MediaFrame from "@/components/media/MediaFrame";
import CTASection from "@/components/sections/CTASection";
import { Button } from "@/components/ui/button";
import { sceneFor } from "@/lib/placeholders";
import { faqPageJsonLd } from "@/lib/seo-metadata";

type CatalogDetailProps = { catalog: Catalog; entry: CatalogEntry };

/**
 * Drei Abschnitte hängen an optionalen Feldern des Eintrags und erscheinen nur,
 * wenn er sie mitbringt: Herausforderung & Lösung, Ablauf und FAQ. Ihre
 * Überschriften stehen hier fest statt im Katalog – gepflegt sind die Felder
 * bisher nur für Module. Sobald ein zweiter Katalog sie nutzt und andere
 * Formulierungen braucht, gehören sie neben `scopeHeading` in den Katalogkopf.
 */
export default function CatalogDetail({ catalog, entry }: CatalogDetailProps) {
  const Icon = entry.icon;
  const related = relatedEntries(catalog.entries, entry.slug);
  // Vier Motive je Seite, aus dem Slug abgeleitet – so bekommt jede Unterseite
  // eine eigene Bildfolge, ohne dass der Katalog Bildfelder pflegen muss.
  const scenes = [0, 1, 2, 3].map((offset) => sceneFor(entry.slug, offset));

  return (
    <>
      <section className="relative overflow-hidden bg-white pb-12 pt-28 sm:pb-16 sm:pt-32 md:pb-24 md:pt-40">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[420px] w-[680px] max-w-[150vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.13),transparent)] sm:h-[480px] sm:w-[820px]" />
          <div className="absolute -right-40 top-20 h-[280px] w-[280px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.10),transparent)] sm:-right-32 sm:top-24 sm:h-[360px] sm:w-[360px]" />
        </div>

        <div className="page-container relative">
          <nav aria-label="Breadcrumb" className="overflow-hidden text-xs text-slate-400 sm:text-sm">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <li><Link href="/" className="transition-colors hover:text-indigo-600">Startseite</Link></li>
              <li aria-hidden>/</li>
              <li className="min-w-0"><Link href={catalog.overviewHref} className="transition-colors hover:text-indigo-600">{catalog.plural}</Link></li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="min-w-0 text-slate-600">{entry.title}</li>
            </ol>
          </nav>

          <div className="mt-7 grid min-w-0 items-center gap-8 sm:mt-8 sm:gap-10 md:grid-cols-2 md:gap-14">
            <Reveal className="min-w-0">
              <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-[11px] font-semibold tracking-wide text-indigo-700 sm:px-3.5 sm:text-xs">
                <Icon aria-hidden className="h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0">{catalog.singular}</span>
              </span>
              <h1 className="mt-4 text-[2rem] font-bold leading-[1.1] tracking-tight text-slate-900 min-[375px]:text-[2.2rem] sm:mt-5 sm:text-4xl md:text-[2.75rem] md:leading-[1.12]">{entry.title}</h1>
              <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-500 sm:text-lg sm:leading-relaxed">{entry.description}</p>

              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg" className="h-12 w-full rounded-xl bg-indigo-600 px-6 text-sm text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-indigo-500 sm:w-auto sm:px-7 sm:text-base">
                  <Link href="/demo-buchen">Demo anfragen</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 w-full rounded-xl border-slate-200 bg-white/70 px-6 text-sm text-slate-700 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:text-slate-900 sm:w-auto sm:px-7 sm:text-base">
                  <Link href={catalog.overviewHref}>{catalog.overviewLabel}</Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="min-w-0"><CatalogMedia entry={entry} /></Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="catalog-highlights" className="bg-[#f8fafc] py-12 sm:py-16 md:py-24">
        <div className="page-container">
          <h2 id="catalog-highlights" className="sr-only">Nutzen im Überblick</h2>
          <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
            {entry.highlights.map((highlight, index) => (
              <Reveal key={highlight.title} delay={index * 0.06}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-900/8 bg-white shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft sm:rounded-3xl">
                  <CardMedia src={scenes[index % scenes.length].src} alt={scenes[index % scenes.length].alt} aspect="aspect-[3/2]" sizes="(min-width: 768px) 33vw, 100vw" />
                  <div className="relative flex flex-1 flex-col p-5 sm:p-7">
                    <span className="absolute -top-5 left-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-soft ring-1 ring-slate-900/5 sm:left-7 sm:h-11 sm:w-11 sm:rounded-2xl"><Icon aria-hidden className="h-5 w-5" /></span>
                    <h3 className="mt-4 text-base font-bold text-slate-900 sm:mt-5 sm:text-lg">{highlight.title}</h3>
                    <p className="mt-2.5 text-sm leading-6 text-slate-500 sm:leading-relaxed">{highlight.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="catalog-scope" className="bg-white py-12 sm:py-16 md:py-24">
        <div className="page-container">
          <div className="grid min-w-0 gap-8 sm:gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-14">
            <Reveal className="min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Im Detail</span>
              <h2 id="catalog-scope" className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{fillHeading(catalog.scopeHeading, entry.title)}</h2>
              <p className="mt-4 max-w-md text-[15px] leading-7 text-slate-500 sm:text-base sm:leading-relaxed">{entry.tagline} – abgestimmt auf den Alltag von Bahndienstleistern und im Zusammenspiel mit allen anderen Bereichen der Plattform.</p>
              {/* Bild statt weiterer Fließtext: Die rechte Spalte ist bereits
                  eine Liste, die linke bliebe sonst halbleer. */}
              <MediaFrame src={scenes[3].src} alt={scenes[3].alt} ratio="landscape" delay={0.06} sizes="(min-width: 768px) 40vw, 100vw" className="mt-7 sm:mt-8" />
            </Reveal>

            <Reveal delay={0.08} className="min-w-0">
              <ul className="grid gap-3 sm:grid-cols-2">
                {entry.bullets.map((bullet) => (
                  <li key={bullet} className="flex min-w-0 items-start gap-3 rounded-2xl border border-slate-900/8 bg-[#f8fafc] px-4 py-3.5 text-sm leading-6 text-slate-600 sm:leading-relaxed">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"><Check aria-hidden className="h-3 w-3" /></span>
                    <span className="min-w-0">{bullet}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {entry.challenges && entry.challenges.length > 0 && (
        <section aria-labelledby="catalog-challenges" className="bg-[#f8fafc] py-12 sm:py-16 md:py-24">
          <div className="page-container">
            <Reveal className="min-w-0">
              <div className="max-w-2xl">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Herausforderung &amp; Lösung</span>
                <h2 id="catalog-challenges" className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Was sich mit {entry.title} ändert</h2>
                <p className="mt-4 text-[15px] leading-7 text-slate-500 sm:text-base sm:leading-relaxed">Situationen, die im Bahnalltag regelmäßig Zeit und Nerven kosten – und daneben, wie derselbe Vorgang in Gleistrix abläuft.</p>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:mt-14">
              {entry.challenges.map((item, index) => (
                <Reveal key={item.problem} delay={index * 0.06}>
                  <article className="grid min-w-0 overflow-hidden rounded-2xl border border-slate-900/8 shadow-soft-sm sm:rounded-3xl md:grid-cols-2">
                    {/* Die linke Hälfte liegt bewusst tiefer als die rechte: Ohne den
                        Helligkeitsunterschied lesen sich Problem und Lösung wie zwei
                        gleichrangige Absätze. */}
                    <div className="min-w-0 bg-slate-100/70 p-5 sm:p-6 md:p-8">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-inset ring-slate-900/8 sm:text-xs">
                        <AlertTriangle aria-hidden className="h-3.5 w-3.5 shrink-0" />
                        Ohne System
                      </span>
                      <p className="mt-3.5 text-[15px] leading-7 text-slate-500 sm:mt-4 sm:text-base sm:leading-relaxed">{item.problem}</p>
                    </div>
                    <div className="min-w-0 border-t border-slate-900/8 bg-white p-5 sm:p-6 md:border-l md:border-t-0 md:p-8">
                      <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700 sm:text-xs">
                        <Check aria-hidden className="h-3.5 w-3.5 shrink-0" />
                        Mit Gleistrix
                      </span>
                      <p className="mt-3.5 text-[15px] leading-7 text-slate-700 sm:mt-4 sm:text-base sm:leading-relaxed">{item.solution}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {entry.steps && entry.steps.length > 0 && (
        <section aria-labelledby="catalog-steps" className="relative overflow-hidden bg-slate-950 py-12 sm:py-16 md:py-24">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/4 h-[320px] w-[420px] max-w-[150vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.30),transparent)] sm:h-[440px] sm:w-[640px]" />
            <div className="absolute -bottom-40 right-0 h-[300px] w-[300px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.22),transparent)] sm:h-[400px] sm:w-[400px]" />
          </div>

          <div className="page-container relative">
            <div className="grid min-w-0 items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-12">
              <Reveal className="min-w-0">
                <div className="max-w-2xl">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Ablauf</span>
                  <h2 id="catalog-steps" className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">So arbeitest du mit {entry.title}</h2>
                  <p className="mt-4 text-[15px] leading-7 text-slate-300 sm:text-base sm:leading-relaxed">Jeder Schritt baut auf dem vorherigen auf. Daten, die einmal im System stehen, werden weitergereicht statt erneut erfasst.</p>
                </div>
              </Reveal>
              {/* Der dunkle Abschnitt ist der einzige Bruch im hellen Seitenlauf –
                  ein Bild hier trägt ihn, ohne die nummerierten Schritte zu stören. */}
              <MediaFrame src={scenes[2].src} alt={scenes[2].alt} ratio="wide" delay={0.08} sizes="(min-width: 768px) 45vw, 100vw" className="[&_figure]:border-white/10" />
            </div>

            <Reveal delay={0.08} className="min-w-0">
              <ol className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
                {entry.steps.map((step, index) => (
                  <li key={step.title} className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm sm:rounded-3xl sm:p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-sm font-bold tabular-nums text-indigo-200 ring-1 ring-inset ring-indigo-400/30 sm:rounded-2xl">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="mt-4 text-base font-bold text-white sm:mt-5">{step.title}</h3>
                    <p className="mt-2.5 text-sm leading-6 text-slate-300 sm:leading-relaxed">{step.text}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>
      )}

      {entry.faqs && entry.faqs.length > 0 && (
        <section aria-labelledby="catalog-faq" className="bg-white py-12 sm:py-16 md:py-24">
          {/* Auszeichnung der Fragen. Steht bewusst neben dem sichtbaren Text und
              nicht anstelle davon – Google verlangt beides deckungsgleich. */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(entry.faqs)) }} />

          <div className="page-container">
            <div className="grid min-w-0 gap-8 sm:gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-14">
              <Reveal className="min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">FAQ</span>
                <h2 id="catalog-faq" className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Häufige Fragen zu {entry.title}</h2>
                <p className="mt-4 max-w-sm text-[15px] leading-7 text-slate-500 sm:text-base sm:leading-relaxed">Das fragen Bahndienstleister vor der Einführung am häufigsten. Was offen bleibt, klären wir in einer kurzen Demo.</p>
              </Reveal>

              <Reveal delay={0.08} className="min-w-0">
                <div className="divide-y divide-slate-900/8 overflow-hidden rounded-2xl border border-slate-900/8 bg-[#f8fafc] sm:rounded-3xl">
                  {entry.faqs.map((faq) => (
                    <details key={faq.question} name="catalog-faq" className="group px-4 py-3.5 sm:px-5 sm:py-4 md:px-7 md:py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-semibold text-slate-900 transition-colors hover:text-indigo-700 sm:gap-4 sm:text-base [&::-webkit-details-marker]:hidden">
                        <span className="min-w-0">{faq.question}</span>
                        <ChevronDown aria-hidden className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180" />
                      </summary>
                      <p className="mt-3 text-sm leading-6 text-slate-600 sm:leading-relaxed md:text-base">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="catalog-related" className="bg-[#f8fafc] py-12 sm:py-16 md:py-20">
          <div className="page-container">
            <h2 id="catalog-related" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Weitere {catalog.plural}</h2>
            <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 md:grid-cols-3">
              {related.map((item, index) => {
                const RelatedIcon = item.icon;
                return (
                  <Reveal key={item.slug} delay={index * 0.06}>
                    <Link href={`${catalog.basePath}/${item.slug}`} className="group flex h-full min-w-0 flex-col rounded-2xl border border-slate-900/8 bg-white p-5 shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 sm:rounded-3xl sm:p-6">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><RelatedIcon aria-hidden className="h-[18px] w-[18px]" /></span>
                      <h3 className="mt-4 text-base font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-500 sm:leading-relaxed">{item.tagline}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">Ansehen<ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" /></span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {entry.crossLinks && entry.crossLinks.length > 0 && (
        <section aria-labelledby="catalog-crosslinks" className="bg-white py-10 sm:py-12 md:py-16">
          <div className="page-container">
            <h2 id="catalog-crosslinks" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Passt dazu</h2>
            <ul className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 md:grid-cols-2">
              {entry.crossLinks.map((link) => (
                <li key={link.href} className="min-w-0 text-[15px] leading-7 text-slate-600">
                  {link.text}{" "}
                  <Link
                    href={link.href}
                    className="font-semibold text-indigo-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CTASection title={fillHeading(catalog.ctaHeading, entry.title)} description="In einer kurzen Demo zeigen wir dir den Bereich im Zusammenspiel mit der gesamten Plattform." />
    </>
  );
}

function CatalogMedia({ entry }: { entry: CatalogEntry }) {
  if (entry.image) {
    return (
      <div className="relative aspect-[4/3] w-full min-w-0 overflow-hidden rounded-2xl border border-slate-900/8 bg-[#f8fafc] shadow-soft sm:rounded-3xl">
        <Image src={entry.image} alt={entry.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority />
      </div>
    );
  }

  if (entry.logo) {
    return (
      <div className="relative flex aspect-[4/3] w-full min-w-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-900/8 bg-white shadow-soft sm:rounded-3xl">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(99,102,241,0.10),transparent)]" />
        <Image src={entry.logo.src} alt={entry.title} width={entry.logo.width} height={entry.logo.height} sizes="320px" className="relative max-h-20 w-auto max-w-[70%] object-contain sm:max-h-24 sm:max-w-[60%]" priority />
      </div>
    );
  }

  return null;
}
