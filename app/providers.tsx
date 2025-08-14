"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const ENABLE_LENIS = false; // Temporär deaktiviert für flüssigeres Scrollen
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ENABLE_LENIS || prefersReduced) return;
    const lenis: any = new Lenis({ smoothWheel: true, lerp: 0.12, duration: 1.05 });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      // @ts-expect-error lenis may not have destroy when mocked
      if (lenis?.destroy) lenis.destroy();
    };
  }, []);

  return <>{children}</>; 
}


