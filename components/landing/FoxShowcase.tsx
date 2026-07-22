"use client";
import { useCallback, useRef } from "react";
import Image from "next/image";
import {
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Sparkles } from "lucide-react";
import { HERO_MODULES, HERO_SLIDES } from "@/data/heroSlides";

type FoxShowcaseProps = {
  /** Index des aktiven Slides – wird vom Hero gesteuert */
  active: number;
};

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Animierte Maskottchen-Bühne: 2.5D-Parallax auf Mausbewegung,
 * Crossfade zwischen den Gewerke-Füchsen und schwebende UI-Chips.
 */
export default function FoxShowcase({ active }: FoxShowcaseProps) {
  const shouldReduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  // Normalisierte Mausposition (-0.5 … 0.5) mit Feder-Glättung
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });

  // Ebenen mit unterschiedlicher Tiefe
  const foxX = useTransform(sx, (v) => v * 14);
  const foxY = useTransform(sy, (v) => v * 10);
  const foxRotate = useTransform(sx, (v) => v * 4);
  const chipX = useTransform(sx, (v) => v * -22);
  const chipY = useTransform(sy, (v) => v * -16);
  const glowX = useTransform(sx, (v) => v * 30);
  const glowY = useTransform(sy, (v) => v * 22);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (shouldReduceMotion || event.pointerType !== "mouse") return;
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set((event.clientX - rect.left) / rect.width - 0.5);
      my.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [mx, my, shouldReduceMotion]
  );

  const handlePointerLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const slide = HERO_SLIDES[active];
  const fade = shouldReduceMotion ? { duration: 0 } : undefined;

  return (
    <div
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto h-[440px] w-full max-w-[560px] select-none sm:h-[520px] lg:h-[600px]"
      style={{ perspective: 1200 }}
    >
      {/* Licht hinter dem Maskottchen */}
      <motion.div
        aria-hidden
        style={shouldReduceMotion ? undefined : { x: glowX, y: glowY }}
        className="absolute left-1/2 top-[42%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.22),rgba(139,92,246,0.10),transparent)] blur-2xl"
      />
      {/* Bodenschatten unter der Plattform */}
      <div
        aria-hidden
        className="absolute bottom-[4%] left-1/2 h-14 w-[68%] -translate-x-1/2 rounded-[100%] bg-slate-900/12 blur-2xl"
      />

      {/* Fuchs-Ebene mit Parallax */}
      <motion.div
        className="absolute inset-0"
        style={
          shouldReduceMotion
            ? undefined
            : { x: foxX, y: foxY, rotateY: foxRotate, transformStyle: "preserve-3d" }
        }
      >
        {HERO_SLIDES.map((s, i) => (
          <motion.div
            key={s.id}
            className="absolute inset-x-0 bottom-0 top-2"
            initial={false}
            animate={
              i === active
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.96, y: 10 }
            }
            transition={fade ?? { duration: 0.65, ease: EASE_OUT }}
            style={{ pointerEvents: "none" }}
          >
            <Image
              src={s.image}
              alt={i === active ? s.alt : ""}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 560px, 84vw"
              className="object-contain object-bottom"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Schwebende Chips – gegenläufige Parallax-Tiefe */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={shouldReduceMotion ? undefined : { x: chipX, y: chipY }}
      >
        {/* Status-Chip oben links */}
        <div className="glass animate-float absolute left-0 top-6 flex items-center gap-2 rounded-full px-3.5 py-1.5 shadow-soft-sm sm:left-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">
            Einsatzbereit
          </span>
        </div>

        {/* Gewerke-Badge oben rechts */}
        <motion.div
          key={`audience-${slide.id}`}
          initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={fade ?? { duration: 0.45, ease: EASE_OUT, delay: 0.15 }}
          className="glass animate-float-delayed absolute right-0 top-16 flex items-center gap-2.5 rounded-full py-2 pl-2 pr-4 shadow-soft sm:top-20"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white">
            <slide.audienceIcon className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-semibold text-slate-800">{slide.audience}</span>
        </motion.div>

        {/* Chat-Blase unten links */}
        <motion.div
          key={`message-${slide.id}`}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={fade ?? { duration: 0.5, ease: EASE_OUT, delay: 0.25 }}
          className="glass absolute bottom-24 left-0 w-[min(78%,300px)] rounded-2xl rounded-bl-md p-3.5 shadow-soft sm:bottom-28 sm:left-2"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white">
              <Sparkles className="h-3 w-3" />
            </span>
            <span className="text-xs font-bold text-slate-900">Gleistrix</span>
            <span className="text-[10px] font-medium text-slate-400">jetzt</span>
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-slate-600">{slide.message}</p>
        </motion.div>
      </motion.div>

      {/* Modul-Leiste unten mittig */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 flex justify-center">
        <LayoutGroup>
          <motion.div
            layout
            className="glass flex items-center gap-1.5 rounded-full p-1.5 shadow-soft"
          >
            {HERO_MODULES.map((mod) => {
              const isActive = mod.id === slide.moduleId;
              const Icon = mod.icon;
              return (
                <motion.span
                  key={mod.id}
                  layout
                  transition={fade ?? { duration: 0.45, ease: EASE_OUT }}
                  className={
                    "flex h-9 items-center gap-2 rounded-full px-3 " +
                    (isActive ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500")
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {isActive && (
                    <motion.span
                      initial={shouldReduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={fade ?? { duration: 0.3, delay: 0.15 }}
                      className="whitespace-nowrap text-xs font-semibold"
                    >
                      {mod.label}
                    </motion.span>
                  )}
                </motion.span>
              );
            })}
          </motion.div>
        </LayoutGroup>
      </div>
    </div>
  );
}
