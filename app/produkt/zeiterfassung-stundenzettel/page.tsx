import type { Metadata } from "next";
import FeatureDetail from "@/components/product/FeatureDetail";

export const metadata: Metadata = {
  title: "Zeiterfassung & Stundenzettel",
  description: "Digital, mobil und prüffähig – direkt mit Projekten verknüpft.",
};

export default function Page() {
  return (
    <main className="bg-white">
      <FeatureDetail
        title="Zeiterfassung & Stundenzettel"
        description="Zeiten digital, mobil und prüffähig erfassen – direkt mit Projekten verknüpft und ohne Abtippen."
        imageSrc="/Zeiterfassung.png"
        features={[
          "Mobile Zeiterfassung direkt auf der Baustelle",
          "Prüffähige Stundenzettel ohne Nacharbeit",
          "Nahtlose Verknüpfung mit Projekten und Abrechnung",
        ]}
      />
    </main>
  );
}
