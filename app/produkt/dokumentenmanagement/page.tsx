import Squares from "@/components/visuals/Squares";
import FeatureDetail from "@/components/product/FeatureDetail";

export default function Page() {
  return (
    <main className="relative text-white overflow-hidden bg-gradient-to-b from-gray-900 to-slate-900">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Squares direction="diagonal" speed={0.35} squareSize={52} borderColor="#223" hoverFillColor="#0b1020" />
      </div>
      <FeatureDetail
        title="Dokumentenmanagement"
        description="Wichtige Unterlagen zentral speichern, teilen und revisionssicher archivieren."
        imageSrc="/Lösungen.png"
      />
    </main>
  );
}






