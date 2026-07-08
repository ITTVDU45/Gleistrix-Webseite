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
      whileHover={{ y: -4 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      className="h-full rounded-3xl border border-slate-900/8 bg-white p-5 shadow-soft-sm transition-shadow hover:shadow-soft sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <CheckCircle2 className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-semibold leading-snug text-slate-900">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">{desc}</p>
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
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-indigo-600" : "w-3 bg-slate-300"}`}
              aria-label={`Seite ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}


