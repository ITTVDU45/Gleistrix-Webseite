import type { Metadata } from "next";
import FeatureDetail from "@/components/product/FeatureDetail";

export const metadata: Metadata = {
  title: "Fahrzeug- & Technikmanagement",
  description: "Fahrzeuge und Geräte zentral erfassen, warten und Einsätzen zuordnen.",
};

export default function Page() {
  return (
    <main className="bg-white">
      <FeatureDetail
        title="Fahrzeug- & Technikmanagement"
        description="Fahrzeuge und Geräte zentral erfassen, warten und Einsätzen zuordnen – inklusive Prüffristen und Wartungshistorie."
        imageSrc="/Fahrzeugplanung.png"
        features={[
          "Fahrzeuge, HU- und Prüftermine mit Fristenwarnung",
          "Geräte- und Wartungshistorie dokumentiert",
          "Direkte Zuordnung zu Projekten und Einsätzen",
        ]}
      />
    </main>
  );
}
