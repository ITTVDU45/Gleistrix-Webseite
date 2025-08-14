"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export type BenefitItem = { id?: string; title: string; desc: string };

export default function BenefitsSlider({
  items,
  autoMs = 12000,
}: {
  items: BenefitItem[];
  autoMs?: number;
}) {
  const GlassCard = ({ title, desc, delay }: { title: string; desc: string; delay: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      className="h-full rounded-xl bg-white/10 backdrop-blur ring-1 ring-white/10 p-4 sm:p-6 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-sky-400 to-violet-600 flex items-center justify-center text-white shadow-sm">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-semibold text-white leading-snug">{title}</h3>
          <p className="text-white/80 mt-1">{desc}</p>
        </div>
      </div>
    </motion.div>
  );

  const [visible, setVisible] = useState(3);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setVisible(mq.matches ? 2 : 3);
    apply();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", apply);
    } else if (typeof (mq as MediaQueryList).addListener === "function") {
      (mq as MediaQueryList).addListener(() => apply());
    }
    return () => {
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", apply);
      } else if (typeof (mq as MediaQueryList).removeListener === "function") {
        (mq as MediaQueryList).removeListener(() => apply());
      }
    };
  }, []);

  const pages = useMemo(() => {
    const out: BenefitItem[][] = [];
    for (let i = 0; i < items.length; i += visible) {
      out.push(items.slice(i, i + visible));
    }
    return out;
  }, [items, visible]);

  useEffect(() => {
    if (!pages.length) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % pages.length), autoMs);
    return () => clearInterval(id);
  }, [pages.length, autoMs]);

  useEffect(() => {
    setIndex((i) => (pages.length ? i % pages.length : 0));
  }, [pages.length]);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <motion.div
        className="flex will-change-transform min-w-full"
        animate={{ x: `-${index * 100}%` }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.6 }}
      >
        {pages.map((page, pIdx) => (
          <div key={pIdx} className="flex-none basis-full px-2 sm:px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {page.map((i, iIdx) => (
                <GlassCard key={`${i.title}-${iIdx}`} title={i.title} desc={i.desc} delay={(pIdx * visible + iIdx) * 0.03} />
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {pages.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-white/90" : "w-3 bg-white/40"}`}
              aria-label={`Seite ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}


