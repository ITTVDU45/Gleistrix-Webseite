import type { Metadata } from "next";
import PricingSection from "@/components/pricing/pricing-section";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Preise",
  description:
    "Faire, transparente und skalierbare Preise für Gleistrix – die ERP-Plattform für Bahndienstleister. Alle Features in jedem Plan.",
};

export default function Page() {
  return (
    <main className="bg-white">
      <PricingSection />
      <CTASection
        title="Noch unsicher, welcher Plan passt?"
        description="In einer kurzen Demo finden wir gemeinsam die richtige Konfiguration für deinen Betrieb."
      />
    </main>
  );
}
