import PricingSection from "@/components/pricing/pricing-section";
import { getPublishedPricing } from "@/lib/admin/pricing";
import { softwareApplicationJsonLd } from "@/lib/seo";
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

  // Der günstigste Monatspreis aus derselben Konfiguration, die die Seite
  // anzeigt. Nicht hartkodiert, weil die Preise im Adminbereich gepflegt
  // werden – ein festes Schema wäre nach der ersten Freigabe falsch.
  const prices = config.packages.map((pkg) => pkg.price).filter((price) => Number.isFinite(price));
  const lowPrice = prices.length > 0 ? Math.min(...prices) : undefined;

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd({ lowPrice })) }}
      />
      <PricingSection config={config} />
    </main>
  );
}
