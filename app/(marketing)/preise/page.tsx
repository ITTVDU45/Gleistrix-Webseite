import PricingSection from "@/components/pricing/pricing-section";
import Squares from "@/components/visuals/Squares";

export default function Page() {
  return (
    <main className="relative text-white overflow-hidden bg-gradient-to-b from-gray-900 to-slate-900">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Squares direction="diagonal" speed={0.35} squareSize={52} borderColor="#223" hoverFillColor="#0b1020" />
      </div>
      <div className="relative z-10">
        <PricingSection />
      </div>
    </main>
  );
}


