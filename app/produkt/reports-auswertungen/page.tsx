import type { Metadata } from "next";
import FeatureDetail from "@/components/product/FeatureDetail";

export const metadata: Metadata = {
  title: "Reports & Auswertungen",
  description: "Echtzeitdaten für fundierte Entscheidungen und transparente Abläufe.",
};

export default function Page() {
  return (
    <main className="bg-white">
      <FeatureDetail
        title="Reports & Auswertungen"
        description="Echtzeitdaten für fundierte Entscheidungen und transparente Abläufe – von der Auslastung bis zum Deckungsbeitrag."
        imageSrc="/reports.png"
        features={[
          "Kennzahlen zu Projekten, Auslastung und Kosten",
          "Deckungsbeiträge pro Projekt und Zeitraum",
          "Transparente Abläufe für die Geschäftsführung",
        ]}
      />
    </main>
  );
}
