import PricingSection from "@/components/pricing/pricing-section";
import { getPublishedPricing } from "@/lib/admin/pricing";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata({
  title: "ERP Preise für Bahndienstleister",
  description:
    "Gleistrix Preise für Bahndienstleister: Konfiguration nach Nutzern, Projektvolumen und Modulen mit transparenten Monats- und Implementierungskosten.",
  path: "/preise",
});

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
