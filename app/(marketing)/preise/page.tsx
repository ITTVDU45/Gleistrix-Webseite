import type { Metadata } from "next";
import PricingSection from "@/components/pricing/pricing-section";
import { getPublishedPricing } from "@/lib/admin/pricing";

export const metadata: Metadata = {
  title: "Preise",
  description:
    "Konfiguriere Gleistrix nach Nutzern, Projektvolumen und Modulen. Transparente Monats- und Implementierungspreise für Bahndienstleister.",
};

/**
 * Die Preise kommen aus dem Admin-Store, nicht aus dem Build.
 * Ohne dynamisches Rendern würde eine Freigabe erst beim nächsten Deploy sichtbar.
 */
export const dynamic = "force-dynamic";

export default async function Page() {
  const config = await getPublishedPricing();

  return (
    <main className="bg-white">
      <PricingSection config={config} />
    </main>
  );
}
