import type { Metadata } from "next";
import Image from "next/image";
import { BENEFITS } from "@/app/produkt/benefits";
import BenefitsSlider from "@/components/sections/BenefitsSlider";
import FeaturesAccordion from "@/components/sections/FeaturesAccordion";
import PageHero from "@/components/landing/PageHero";
import ScreensGallery from "@/components/landing/ScreensGallery";
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
          <div className="mt-12 md:mt-16">
            <ScreensGallery />
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
