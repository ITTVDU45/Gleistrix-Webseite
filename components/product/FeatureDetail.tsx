import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/landing/Reveal";
import CTASection from "@/components/sections/CTASection";

export type FeatureDetailProps = {
  title: string;
  description: string;
  imageSrc: string;
  features?: string[];
  backHref?: string;
};

export default function FeatureDetail({
  title,
  description,
  imageSrc,
  features,
  backHref = "/produkt#features",
}: FeatureDetailProps) {
  return (
    <>
      <section className="relative overflow-hidden bg-white pb-16 pt-32 md:pb-24 md:pt-40">
        {/* Weiche Hintergrund-Verläufe */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.13),transparent)]" />
          <div className="absolute -right-32 top-24 h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.10),transparent)]" />
        </div>

        <div className="page-container relative">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zu den Funktionen
          </Link>

          <div className="mt-8 grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-700">
                Modul
              </span>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-[2.75rem] md:leading-[1.12]">
                {title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
                {description}
              </p>

              {features && features.length > 0 && (
                <ul className="mt-6 space-y-2.5">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <Check className="h-3 w-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

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
                  <Link href="/produkt#features">Weitere Module</Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-900/8 bg-[#f8fafc] shadow-soft">
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection
        title={`Bereit, ${title} zu erleben?`}
        description="In einer kurzen Demo zeigen wir dir das Modul im Zusammenspiel mit der gesamten Plattform."
      />
    </>
  );
}
