import type { ReactNode } from "react";
import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
};

export default function SectionHeading({ eyebrow, title, description, align = "center" }: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <Reveal className={isCentered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <span className="inline-flex max-w-full items-center rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-[11px] font-semibold leading-5 tracking-wide text-indigo-700 sm:px-3.5 sm:text-xs">{eyebrow}</span>
      <h2 className="mt-3 text-[1.75rem] font-bold leading-[1.12] tracking-tight text-slate-900 min-[375px]:text-3xl sm:mt-4 sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">{title}</h2>
      {description && (
        <p className={`mt-3 text-[15px] leading-7 text-slate-500 sm:mt-4 sm:text-lg sm:leading-relaxed ${isCentered ? "mx-auto" : ""} max-w-2xl`}>{description}</p>
      )}
    </Reveal>
  );
}
