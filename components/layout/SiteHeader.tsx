"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function SiteHeader() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 64);
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full fixed top-0 md:top-3 left-0 right-0 z-50 will-change-[backdrop-filter,transform] overflow-x-hidden"
    >
      <div
        className={
          "page-container mx-4 md:mx-6 px-4 md:px-6 h-14 md:h-20 flex items-center justify-between transition-all duration-300 will-change-[backdrop-filter,transform] " +
          (scrolled
            ? "backdrop-blur bg-gradient-to-b from-gray-900 to-slate-900 border border-white/10 rounded-2xl shadow-md text-white"
            : "bg-gradient-to-b from-gray-900/80 to-slate-900/80 text-white border border-white/10 rounded-2xl")
        }
      >
        <Link href="/" className="flex items-center" aria-label="Gleistrix Home">
          <Image
            src="/Gleistrix Logo (500 x 300 px).png"
            alt="Gleistrix Logo"
            width={500}
            height={300}
            className="h-12 md:h-16 w-auto"
            priority
          />
        </Link>
		<nav className="hidden md:flex items-center gap-4 md:gap-5 text-xs md:text-sm flex-1 justify-end">
			<Link href="/">Home</Link>
			<Link href="/produkt">Produkt</Link>
			<Link href="/branchen">Branchen</Link>
			<Link href="/preise">Preise</Link>
			<Link href="/ueber-uns">Über uns</Link>
          <Link href="/demo-buchen" className="ml-2 hidden md:block">
            <Button className="bg-gradient-to-tr from-yellow-400 via-yellow-500 to-orange-400 text-black hover:brightness-105 h-9 px-4">
              Kostenlose Demo
            </Button>
          </Link>
        </nav>
        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 hover:bg-white/15 text-white"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-2">
          <div className="page-container mx-0 p-3 rounded-xl border border-white/10 bg-gradient-to-b from-gray-900/95 to-slate-900/95 text-white shadow-lg">
				<div className="flex flex-col gap-3 text-sm">
					<Link href="/#loesungen" onClick={() => setMenuOpen(false)}>Unsere Lösungen</Link>
					<Link href="/#vorteile" onClick={() => setMenuOpen(false)}>Vorteile</Link>
					<Link href="/#einsatzmoeglichkeiten" onClick={() => setMenuOpen(false)}>Einsatzmöglichkeiten</Link>
					<Link href="/#zielgruppe" onClick={() => setMenuOpen(false)}>Zielgruppe</Link>
					<Link href="/branchen" onClick={() => setMenuOpen(false)}>Branchen</Link>
					<Link href="/preise" onClick={() => setMenuOpen(false)}>Preise</Link>
					<Link href="/ueber-uns" onClick={() => setMenuOpen(false)}>Über uns</Link>
              <Link href="/produkt" onClick={() => setMenuOpen(false)}>Produkt</Link>
              <Link href="/demo-buchen" onClick={() => setMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-tr from-yellow-400 via-yellow-500 to-orange-400 text-black hover:brightness-105 h-9 px-4">
                  Kostenlose Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
}


