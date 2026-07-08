import type { Metadata } from "next";
import FeatureDetail from "@/components/product/FeatureDetail";

export const metadata: Metadata = {
  title: "Dokumentenmanagement",
  description: "Wichtige Unterlagen zentral speichern, teilen und revisionssicher archivieren.",
};

export default function Page() {
  return (
    <main className="bg-white">
      <FeatureDetail
        title="Dokumentenmanagement"
        description="Wichtige Unterlagen zentral speichern, teilen und revisionssicher archivieren – bei Prüfungen bist du in Sekunden auskunftsfähig."
        imageSrc="/Lösungen.png"
        features={[
          "Revisionssichere Ablage pro Projekt",
          "Freigaben und Versionen jederzeit nachvollziehbar",
          "Nachweise und Protokolle zentral statt im Postfach",
        ]}
      />
    </main>
  );
}
