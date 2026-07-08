import type { Metadata } from "next";
import FeatureDetail from "@/components/product/FeatureDetail";

export const metadata: Metadata = {
  title: "Rechnungsstellung",
  description: "Schnell, korrekt und auf Wunsch automatisiert erstellen – bis zur X-Rechnung.",
};

export default function Page() {
  return (
    <main className="bg-white">
      <FeatureDetail
        title="Rechnungsstellung"
        description="Rechnungen schnell, korrekt und auf Wunsch automatisiert erstellen – aus geprüften Leistungen und Stunden."
        imageSrc="/Rechnungen.png"
        features={[
          "Leistungsnachweise automatisch zusammengeführt",
          "Rechnungsentwürfe pro Projekt und Zeitraum",
          "X-Rechnung und saubere Übergabe an die Buchhaltung",
        ]}
      />
    </main>
  );
}
