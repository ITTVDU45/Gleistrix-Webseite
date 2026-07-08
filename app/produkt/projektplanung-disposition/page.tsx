import type { Metadata } from "next";
import FeatureDetail from "@/components/product/FeatureDetail";

export const metadata: Metadata = {
  title: "Projektplanung & Disposition",
  description: "Projekte anlegen, Ressourcen wie Technik, Fahrzeuge und Personal präzise zuweisen.",
};

export default function Page() {
  return (
    <main className="bg-white">
      <FeatureDetail
        title="Projektplanung & Disposition"
        description="Projekte anlegen und Ressourcen wie Technik, Fahrzeuge und Personal präzise zuweisen – ohne Doppelbelegungen."
        imageSrc="/Einsatzvorbereitung & Logistik.png"
        features={[
          "Projekte mit Status, Meilensteinen und Verantwortlichen",
          "Ressourcen per Drag-and-drop disponieren",
          "Konflikte werden automatisch erkannt",
        ]}
      />
    </main>
  );
}
