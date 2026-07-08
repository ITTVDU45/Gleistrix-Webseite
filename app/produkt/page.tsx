import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BENEFITS } from "@/app/produkt/benefits";
import { SCREENS } from "@/app/produkt/screens";
import BenefitsSlider from "@/components/sections/BenefitsSlider";
import FeaturesAccordion from "@/components/sections/FeaturesAccordion";
import PageHero from "@/components/landing/PageHero";
import SectionHeading from "@/components/landing/SectionHeading";
import Reveal from "@/components/landing/Reveal";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Plattform",
  description:
    "Von Angebots- und Projektmanagement bis Disposition, Stundenzettel, Lohn und X-Rechnung – effizient, transparent, prüffähig.",
  openGraph: {
    title: "Gleistrix – das All-in-One-ERP für sichere Bahnprojekte",
    description:
      "Von Angebots- und Projektmanagement bis Disposition, Stundenzettel, Lohn und X-Rechnung – effizient, transparent, prüffähig.",
    type: "website",
  },
};

export default function ProduktPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Plattform"
        title={
          <>
            Das All-in-One-ERP für <span className="text-gradient-accent">sichere Bahnprojekte</span>
          </>
        }
        description="Von Angebots- und Projektmanagement bis Disposition, Stundenzettel, Lohn und X-Rechnung – effizient, transparent und prüffähig."
        breadcrumbs={[{ label: "Startseite", href: "/" }, { label: "Plattform" }]}
        ctas={[
          { label: "Demo anfragen", href: "/demo-buchen" },
          { label: "Funktionen ansehen", href: "#features", variant: "outline" },
        ]}
      >
        <Reveal>
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-slate-900/8 bg-[#f8fafc] shadow-soft">
            <Image
              src="/Standortbezogene Disposition.png"
              alt="Gleistrix Standortbezogene Disposition"
              fill
              sizes="(min-width: 768px) 960px, 100vw"
              className="object-contain p-6"
              priority
            />
          </div>
        </Reveal>
      </PageHero>

      {/* Funktionen */}
      <section id="features" className="scroll-mt-24 bg-[#f8fafc] py-16 md:py-24">
        <div className="page-container">
          <SectionHeading
            eyebrow="Funktionen"
            title="Alles, was du brauchst – in einem System"
            description="Acht Kernbereiche, die nahtlos ineinandergreifen. Klick dich durch die Module."
          />
          <div className="mt-12 md:mt-16">
            <FeaturesAccordion />
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="bg-white py-16 md:py-24">
        <div className="page-container">
          <SectionHeading
            eyebrow="Vorteile"
            title="Warum Teams Gleistrix in Produktion einsetzen"
            description="Weniger Abstimmung, mehr Output – Gleistrix zahlt sich im Tagesgeschäft aus."
          />
          <div className="mt-12 md:mt-16">
            <BenefitsSlider items={BENEFITS} autoMs={12000} />
          </div>
        </div>
      </section>

      {/* Screens-Galerie */}
      <section className="bg-[#f8fafc] py-16 md:py-24">
        <div className="page-container">
          <SectionHeading
            eyebrow="Einblicke"
            title="Gleistrix in Action"
            description="Ein Blick auf Oberflächen und Workflows aus dem echten Betrieb."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
            {SCREENS.map((screen, index) => (
              <Reveal key={screen.src} delay={index * 0.05} className="h-full">
                <Link
                  href={screen.href}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-3xl border border-slate-900/8 bg-white shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
                >
                  <Image
                    src={screen.src}
                    alt={screen.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-slate-900/70 to-transparent p-4">
                    <span className="text-sm font-medium text-white">{screen.alt}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Bereit für effiziente Bahnsicherung?"
        description="Lass dir Gleistrix live zeigen – 20 Minuten genügen, um den Mehrwert zu sehen."
      />
    </main>
  );
}
