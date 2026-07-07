"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/produkt", label: "Plattform" },
  { href: "/#module", label: "Module" },
  { href: "/#ki-agenten", label: "KI-Agenten" },
  { href: "/#vorteile", label: "Vorteile" },
  { href: "/preise", label: "Preise" },
  { href: "/ueber-uns", label: "Kontakt" },
] as const;

export default function SiteHeader() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 md:top-4 left-0 right-0 z-50 w-full"
    >
      <div className="page-container">
        <div
          className={
            "glass flex h-14 md:h-16 items-center justify-between rounded-none md:rounded-2xl px-4 md:px-5 transition-shadow duration-300 " +
            (scrolled ? "shadow-soft-sm" : "")
          }
        >
          <Link href="/" className="flex items-center" aria-label="Gleistrix Startseite">
            <Image
              src="/Gleistrix Logo (500 x 300 px).png"
              alt="Gleistrix Logo"
              width={500}
              height={300}
              className="h-10 md:h-12 w-auto"
              priority
            />
          </Link>

          <nav aria-label="Hauptnavigation" className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-900/5 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button asChild className="rounded-xl bg-indigo-600 px-5 text-white shadow-soft-sm transition-all hover:bg-indigo-500 hover:shadow-soft">
              <Link href="/demo-buchen">Demo anfragen</Link>
            </Button>
          </div>

          {/* Mobile-Menü-Button */}
          <button
            type="button"
            aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-900/5"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile-Drawer */}
      {menuOpen && (
        <div className="lg:hidden px-4 pt-2">
          <nav
            aria-label="Mobile Navigation"
            className="glass rounded-2xl p-3 shadow-soft"
          >
            <div className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-900/5"
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild className="mt-2 w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-500">
                <Link href="/demo-buchen" onClick={() => setMenuOpen(false)}>
                  Demo anfragen
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </motion.header>
  );
}
