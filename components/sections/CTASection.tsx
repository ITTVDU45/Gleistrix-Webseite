import Link from "next/link";
import { Button } from "@/components/ui/button";

type CTASectionProps = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function CTASection({
  title = "Bereit für digitale Bahninfrastruktur?",
  description = "Wir zeigen dir Gleistrix live – in 30 Minuten und mit echten Anwendungsfällen aus dem Bahnbetrieb.",
  ctaLabel = "Demo anfragen",
  ctaHref = "/demo-buchen",
}: CTASectionProps) {
  return (
    <section aria-labelledby="shared-cta-heading" className="bg-[#f8fafc] py-20 md:py-24">
      <div className="page-container">
        <div className="glass relative overflow-hidden rounded-[2rem] px-6 py-14 text-center shadow-soft md:px-16 md:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.16),transparent)]" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.16),transparent)]" />
          </div>

          <div className="relative">
            <h2
              id="shared-cta-heading"
              className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
              {description}
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl bg-indigo-600 px-8 text-base text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-indigo-500"
              >
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
