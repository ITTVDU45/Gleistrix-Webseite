import type { ReactNode } from "react";
import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
};

/** Einheitlicher Section-Kopf: Eyebrow-Badge, Titel, optionale Beschreibung. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <Reveal className={isCentered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <span className="inline-flex items-center rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-700">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed text-slate-500 sm:text-lg ${isCentered ? "mx-auto" : ""} max-w-2xl`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
