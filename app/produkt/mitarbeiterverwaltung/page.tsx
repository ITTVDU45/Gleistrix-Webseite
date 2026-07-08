import type { Metadata } from "next";
import FeatureDetail from "@/components/product/FeatureDetail";

export const metadata: Metadata = {
  title: "Mitarbeiterverwaltung",
  description: "Anlegen, bearbeiten und verwalten – inkl. Urlaubsplanung und Abwesenheiten.",
};

export default function Page() {
  return (
    <main className="bg-white">
      <FeatureDetail
        title="Mitarbeiterverwaltung"
        description="Personal anlegen, bearbeiten und verwalten – inklusive Qualifikationen, Urlaubsplanung und Abwesenheiten."
        imageSrc="/Sicherungspersonal%20gleis.png"
        features={[
          "Qualifikationen und Tauglichkeiten mit Fristenwarnung",
          "Urlaubs- und Abwesenheitsplanung integriert",
          "Rollen und Berechtigungen pro Team",
        ]}
      />
    </main>
  );
}
