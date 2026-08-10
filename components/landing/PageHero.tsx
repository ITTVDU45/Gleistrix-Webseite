import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Reveal from "./Reveal";

type Breadcrumb = { label: string; href?: string };
type CTA = { label: string; href: string; variant?: "primary" | "outline" };
type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  ctas?: CTA[];
  children?: ReactNode;
};

export default function PageHero({ eyebrow, title, description, breadcrumbs, ctas, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-white pb-12 pt-28 sm:pb-14 sm:pt-32 md:pb-20 md:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[420px] w-[680px] max-w-[150vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.13),transparent)] sm:h-[480px] sm:w-[820px]" />
        <div className="absolute -right-40 top-20 h-[280px] w-[280px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.10),transparent)] sm:-right-32 sm:top-24 sm:h-[360px] sm:w-[360px]" />
      </div>

      <div className="page-container relative">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5 overflow-hidden text-xs text-slate-400 sm:mb-6 sm:text-sm">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex min-w-0 items-center gap-2">
                  {crumb.href ? (
                    <Link href={crumb.href} className="max-w-full truncate transition-colors hover:text-indigo-600">{crumb.label}</Link>
                  ) : (
                    <span aria-current="page" className="max-w-full text-slate-600">{crumb.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && <span aria-hidden className="shrink-0">/</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <Reveal className="max-w-3xl">
          <span className="inline-flex max-w-full items-center rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-[11px] font-semibold leading-5 tracking-wide text-indigo-700 sm:px-3.5 sm:text-xs">{eyebrow}</span>
          <h1 className="mt-4 text-[2rem] font-bold leading-[1.08] tracking-tight text-slate-900 min-[375px]:text-[2.2rem] sm:mt-5 sm:text-5xl md:text-[3.25rem] md:leading-[1.08]">{title}</h1>
          {description && <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-500 sm:mt-5 sm:text-lg sm:leading-relaxed">{description}</p>}

          {ctas && ctas.length > 0 && (
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              {ctas.map((cta) => {
                const isOutline = cta.variant === "outline";
                return (
                  <Button key={cta.label} asChild size="lg" variant={isOutline ? "outline" : "default"} className={`h-12 w-full rounded-xl px-5 text-sm sm:w-auto sm:px-7 sm:text-base ${isOutline ? "border-slate-200 bg-white/70 text-slate-700 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:text-slate-900" : "bg-indigo-600 text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-indigo-500"}`}>
                    <Link href={cta.href}>{cta.label}</Link>
                  </Button>
                );
              })}
            </div>
          )}
        </Reveal>

        {children && <div className="mt-9 sm:mt-12 md:mt-16">{children}</div>}
      </div>
    </section>
  );
}
