"use client";
import { useCallback, useRef } from "react";
import Image from "next/image";
import { LayoutGroup, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { HERO_MODULES, HERO_SLIDES } from "@/data/heroSlides";

type FoxShowcaseProps = { active: number };
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export default function FoxShowcase({ active }: FoxShowcaseProps) {
  const shouldReduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });
  const foxX = useTransform(sx, (v) => v * 14);
  const foxY = useTransform(sy, (v) => v * 10);
  const foxRotate = useTransform(sx, (v) => v * 4);
  const chipX = useTransform(sx, (v) => v * -22);
  const chipY = useTransform(sy, (v) => v * -16);
  const glowX = useTransform(sx, (v) => v * 30);
  const glowY = useTransform(sy, (v) => v * 22);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || event.pointerType !== "mouse") return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  }, [mx, my, shouldReduceMotion]);

  const handlePointerLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);
  const slide = HERO_SLIDES[active];
  const fade = shouldReduceMotion ? { duration: 0 } : undefined;

  return (
    <div ref={stageRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} className="relative mx-auto h-[360px] w-full max-w-[560px] select-none min-[375px]:h-[400px] sm:h-[520px] lg:h-[600px]" style={{ perspective: 1200 }}>
      <motion.div aria-hidden style={shouldReduceMotion ? undefined : { x: glowX, y: glowY }} className="absolute left-1/2 top-[42%] h-[300px] w-[300px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.22),rgba(139,92,246,0.10),transparent)] blur-2xl sm:h-[420px] sm:w-[420px]" />
      <div aria-hidden className="absolute bottom-[4%] left-1/2 h-10 w-[68%] -translate-x-1/2 rounded-[100%] bg-slate-900/12 blur-2xl sm:h-14" />

      <motion.div className="absolute inset-0" style={shouldReduceMotion ? undefined : { x: foxX, y: foxY, rotateY: foxRotate, transformStyle: "preserve-3d" }}>
        {/* Kein scale-Unterschied zwischen aktiv und inaktiv: Ein inaktives
            Motiv mit scale 0.96 malt eine kleinere Fläche als das aktive
            (534x568 gegen 556x592 px). Beim Wechsel wüchse das einrotierende
            Element über die bisher größte sichtbare Fläche hinaus, und Chrome
            protokolliert dann einen neuen, späteren Largest Contentful Paint –
            alle fünf Sekunden erneut. Der Übergang läuft jetzt über Deckkraft
            und eine leichte Verschiebung, die die gemalte Fläche nicht
            verändern. */}
        {HERO_SLIDES.map((s, i) => (
          <motion.div key={s.id} className="absolute inset-x-0 bottom-0 top-2" initial={false} animate={i === active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={fade ?? { duration: 0.65, ease: EASE_OUT }} style={{ pointerEvents: "none" }}>
            {/* priority auf dem ersten Motiv: Auf breiten Viewports steht es
                neben der Überschrift und ist dort das LCP-Element. Chrome
                meldete den Preload zwischenzeitlich als ungenutzt – das lag
                aber nicht an der Position, sondern daran, dass die
                Einblend-Animation des Heros das Bild sekundenlang mit
                opacity:0 verdeckte. Ohne diese Animation wird er sofort
                verwendet. */}
            <Image src={s.image} alt={i === active ? s.alt : ""} fill priority={i === 0} sizes="(min-width: 1024px) 560px, 92vw" className="object-contain object-bottom" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div aria-hidden className="absolute inset-0" style={shouldReduceMotion ? undefined : { x: chipX, y: chipY }}>
        <div className="glass animate-float absolute left-0 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 shadow-soft-sm sm:left-2 sm:top-6 sm:gap-2 sm:px-3.5 sm:py-1.5">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-600 sm:text-[11px] sm:tracking-[0.14em]">Einsatzbereit</span>
        </div>

        <motion.div key={`audience-${slide.id}`} initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={fade ?? { duration: 0.45, ease: EASE_OUT, delay: 0.15 }} className="glass animate-float-delayed absolute right-0 top-12 flex max-w-[70%] items-center gap-1.5 rounded-full py-1.5 pl-1.5 pr-2.5 shadow-soft sm:top-20 sm:gap-2.5 sm:py-2 sm:pl-2 sm:pr-4">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white sm:h-7 sm:w-7"><slide.audienceIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" /></span>
          <span className="truncate text-[10px] font-semibold text-slate-800 sm:text-xs">{slide.audience}</span>
        </motion.div>

        <motion.div key={`message-${slide.id}`} initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={fade ?? { duration: 0.5, ease: EASE_OUT, delay: 0.25 }} className="glass absolute bottom-20 left-0 w-[min(82%,280px)] rounded-2xl rounded-bl-md p-3 shadow-soft sm:bottom-28 sm:left-2 sm:w-[min(78%,300px)] sm:p-3.5">
          <div className="flex items-center gap-2"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white"><Sparkles className="h-3 w-3" /></span><span className="text-[11px] font-bold text-slate-900 sm:text-xs">Gleistrix</span><span className="text-[9px] font-medium text-slate-400 sm:text-[10px]">jetzt</span><span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" /></div>
          <p className="mt-2 line-clamp-3 text-[10px] leading-4 text-slate-600 sm:text-[12px] sm:leading-relaxed">{slide.message}</p>
        </motion.div>
      </motion.div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 flex justify-center px-1">
        <LayoutGroup>
          <motion.div layout className="glass flex max-w-full items-center gap-0.5 overflow-hidden rounded-full p-1 shadow-soft sm:gap-1.5 sm:p-1.5">
            {HERO_MODULES.map((mod) => {
              const isActive = mod.id === slide.moduleId;
              const Icon = mod.icon;
              return (
                <motion.span key={mod.id} layout transition={fade ?? { duration: 0.45, ease: EASE_OUT }} className={"flex h-8 min-w-0 items-center gap-1.5 rounded-full px-2 sm:h-9 sm:gap-2 sm:px-3 " + (isActive ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500")}>
                  <Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                  {isActive && <motion.span initial={shouldReduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={fade ?? { duration: 0.3, delay: 0.15 }} className="max-w-[110px] truncate text-[10px] font-semibold sm:max-w-none sm:whitespace-nowrap sm:text-xs">{mod.label}</motion.span>}
                </motion.span>
              );
            })}
          </motion.div>
        </LayoutGroup>
      </div>
    </div>
  );
}
