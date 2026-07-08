import type { Metadata } from "next";
import FeatureDetail from "@/components/product/FeatureDetail";

export const metadata: Metadata = {
  title: "Kalender & Einsatzübersicht",
  description: "Alle Termine und Schichten übersichtlich in der App – jederzeit aktuell.",
};

export default function Page() {
  return (
    <main className="bg-white">
      <FeatureDetail
        title="Kalender & Einsatzübersicht"
        description="Alle Termine und Schichten übersichtlich in der App – jederzeit aktuell und für jede Rolle sichtbar."
        imageSrc="/Standortbezogene Disposition.png"
        features={[
          "Alle Einsätze und Schichten in einer Ansicht",
          "Nacht- und Wochenendschichten sauber abgebildet",
          "Live-Aktualisierung für Disposition und Team",
        ]}
      />
    </main>
  );
}
