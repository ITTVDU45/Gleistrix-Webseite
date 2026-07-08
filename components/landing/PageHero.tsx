import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Reveal from "./Reveal";

type Breadcrumb = {
  label: string;
  href?: string;
};

type CTA = {
  label: string;
  href: string;
  variant?: "primary" | "outline";
};

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  ctas?: CTA[];
  children?: ReactNode;
};

/** Heller Seiten-Hero im Glassmorphism-Stil – für alle Unterseiten. */
export default function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  ctas,
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-white pb-14 pt-32 md:pb-20 md:pt-40">
      {/* Weiche Hintergrund-Verläufe */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.13),transparent)]" />
        <div className="absolute -right-32 top-24 h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.10),transparent)]" />
      </div>

      <div className="page-container relative">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-400">
            <ol className="flex items-center gap-2">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition-colors hover:text-indigo-600">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-slate-600">
                      {crumb.label}
                    </span>
                  )}
                  {index < breadcrumbs.length - 1 && <span aria-hidden>/</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <Reveal className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-700">
            {eyebrow}
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-[3.25rem] md:leading-[1.08]">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
              {description}
            </p>
          )}

          {ctas && ctas.length > 0 && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {ctas.map((cta) => {
                const isOutline = cta.variant === "outline";
                return (
                  <Button
                    key={cta.label}
                    asChild
                    size="lg"
                    variant={isOutline ? "outline" : "default"}
                    className={
                      isOutline
                        ? "h-12 rounded-xl border-slate-200 bg-white/70 px-7 text-base text-slate-700 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:text-slate-900"
                        : "h-12 rounded-xl bg-indigo-600 px-7 text-base text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-indigo-500"
                    }
                  >
                    <Link href={cta.href}>{cta.label}</Link>
                  </Button>
                );
              })}
            </div>
          )}
        </Reveal>

        {children && <div className="mt-12 md:mt-16">{children}</div>}
      </div>
    </section>
  );
}
