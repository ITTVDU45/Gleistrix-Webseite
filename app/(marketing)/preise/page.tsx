import type { Metadata } from "next";
import PricingSection from "@/components/pricing/pricing-section";

export const metadata: Metadata = {
  title: "Preise",
  description:
    "Konfiguriere Gleistrix nach Nutzern, Projektvolumen und Modulen. Transparente Monats- und Implementierungspreise für Bahndienstleister.",
};

export default function Page() {
  return (
    <main className="bg-white">
      <PricingSection />
    </main>
  );
}
