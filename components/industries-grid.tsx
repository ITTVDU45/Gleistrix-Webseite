import IndustryCard from "@/components/industry-card";
import { INDUSTRIES } from "@/data/industries";
import Reveal from "@/components/landing/Reveal";

export default function IndustriesGrid() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {INDUSTRIES.map((item, index) => (
        <Reveal key={item.id} delay={index * 0.04}>
          <IndustryCard item={item} reverse={index % 2 === 1} />
        </Reveal>
      ))}
    </div>
  );
}
