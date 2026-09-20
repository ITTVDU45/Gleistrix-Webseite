"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Bot } from "lucide-react";

/**
 * Beispielausgabe des LV-Agenten, die sich beim Hereinscrollen aufbaut.
 *
 * Die Zeilen erscheinen nacheinander und die Zahlen zählen hoch – der
 * Abschnitt zeigt damit, was der Agent tut, statt es nur zu behaupten.
 * Bei „Bewegung reduzieren“ steht sofort das Endergebnis.
 */
type Finding = {
  /** Zahl, die hochzählt. Ohne Wert steht die Zeile nur für sich. */
  value?: number;
  label: string;
};

const FINDINGS: Finding[] = [
  { value: 84, label: "Positionen erkannt" },
  { value: 12, label: "sicherungsrelevante Leistungen markiert" },
  { label: "Angebotsdaten zur Kalkulation übergeben" },
];

const LINE_DELAY = 0.45;
const COUNT_DURATION = 1.1;

export default function AgentAnalysis() {
  const boxRef = useRef<HTMLDivElement>(null);
  // once: Die Analyse läuft einmal – ein Neustart bei jedem Scrollen wirkt wie
  // ein Ladefehler.
  const isInView = useInView(boxRef, { once: true, margin: "-80px" });

  return (
    <div ref={boxRef} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
      <div className="flex items-center gap-2 text-xs font-semibold text-white">
        <Bot className="h-3.5 w-3.5" />
        Analyse · Ausschreibung 2026-114
      </div>
      <ul className="mt-3 space-y-1.5 text-[11px] text-indigo-100">
        {FINDINGS.map((finding, index) => (
          <FindingLine key={finding.label} finding={finding} index={index} isActive={isInView} />
        ))}
      </ul>
    </div>
  );
}

function FindingLine({
  finding,
  index,
  isActive,
}: {
  finding: Finding;
  index: number;
  isActive: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const delay = index * LINE_DELAY;

  return (
    <motion.li
      initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
      animate={isActive ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-baseline gap-1.5"
    >
      <span aria-hidden className="text-emerald-300">
        ✓
      </span>
      <span>
        {finding.value !== undefined && (
          <CountUp target={finding.value} start={isActive} delay={delay} />
        )}{" "}
        {finding.label}
      </span>
    </motion.li>
  );
}

function CountUp({ target, start, delay }: { target: number; start: boolean; delay: number }) {
  const shouldReduceMotion = useReducedMotion();
  const [value, setValue] = useState(shouldReduceMotion ? target : 0);

  useEffect(() => {
    if (!start || shouldReduceMotion) return;
    const controls = animate(0, target, {
      duration: COUNT_DURATION,
      delay,
      ease: "easeOut",
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [start, target, delay, shouldReduceMotion]);

  // tabular-nums: Sonst springt die Zeile beim Hochzählen in der Breite.
  return <span className="font-semibold tabular-nums text-white">{value}</span>;
}
