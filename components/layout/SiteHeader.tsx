"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import MegaMenu from "./MegaMenu";
import { NAV_ITEMS } from "./nav-config";
import styles from "./SiteHeader.module.css";

/**
 * Nachlauf beim Verlassen des Menüs. Ohne ihn schließt das Panel schon, wenn
 * die Maus kurz über eine Lücke fährt.
 */
const CLOSE_DELAY_MS = 140;

export default function SiteHeader() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /** Label des geöffneten Megamenüs – null heißt geschlossen. */
  const [openMega, setOpenMega] = useState<string | null>(null);
  /** Aufgeklappter Bereich im mobilen Menü. */
  const [openSection, setOpenSection] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  useEffect(() => {
    setMenuOpen(false);
    setOpenMega(null);
    setOpenSection(null);
  }, [pathname]);

  // Ein laufender Nachlauf darf die Komponente nicht überleben.
  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = (label: string) => {
    cancelClose();
    setOpenMega(label);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMega(null), CLOSE_DELAY_MS);
  };

  const closeNow = () => {
    cancelClose();
    setOpenMega(null);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.includes("#")) return false;
    return pathname.startsWith(href);
  };

  const activeItem = NAV_ITEMS.find((item) => item.label === openMega && item.catalog);

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none fixed inset-x-0 top-3 z-50 w-full md:top-4"
    >
      <div className="page-container">
        <div
          onMouseLeave={scheduleClose}
          onKeyDown={(event) => {
            if (event.key === "Escape") closeNow();
          }}
          className={`${styles.headerShell} ${
            scrolled ? styles.headerShellScrolled : ""
          } pointer-events-auto relative rounded-[1.35rem] transition-transform duration-500 md:rounded-[1.6rem]`}
        >
          <div aria-hidden className={styles.headerGlass} />
          <div aria-hidden className={styles.headerHighlights}>
            <div className="absolute -left-12 -top-16 h-36 w-36 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="absolute -right-10 -top-20 h-40 w-40 rounded-full bg-violet-400/20 blur-3xl" />
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
          </div>

          <div className="relative z-10 flex h-16 items-center justify-between px-3.5 sm:px-4 md:h-[4.5rem]">
            <Link
              href="/"
              className="group rounded-xl outline-none ring-indigo-500/30 transition focus-visible:ring-4"
              aria-label="Gleistrix Startseite"
            >
              <BrandLogo
                markClassName="h-9 w-9 md:h-10 md:w-10"
                wordmarkClassName="text-[1.35rem] md:text-[1.55rem]"
              />
            </Link>

            <nav
              aria-label="Hauptnavigation"
              className="hidden items-center rounded-full border border-white/70 bg-white/45 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl xl:flex"
            >
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                const expanded = openMega === item.label;
                const linkClass = `relative isolate whitespace-nowrap rounded-full px-2.5 py-2 text-[0.8rem] font-semibold transition-colors duration-200 ${
                  active || expanded ? "text-slate-950" : "text-slate-600 hover:text-slate-950"
                }`;

                const activeBackdrop = active && (
                  <motion.span
                    layoutId="header-active-link"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 -z-10 rounded-full border border-white/80 bg-white/80 shadow-[0_6px_18px_-12px_rgba(15,23,42,0.45)]"
                  />
                );

                if (!item.catalog) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onMouseEnter={scheduleClose}
                      className={linkClass}
                    >
                      {activeBackdrop}
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-haspopup="true"
                    aria-expanded={expanded}
                    onMouseEnter={() => openMenu(item.label)}
                    onFocus={() => openMenu(item.label)}
                    onClick={(event) => {
                      // Erster Klick öffnet, der zweite folgt dem Link zur
                      // Übersicht. Ohne JavaScript greift direkt der Link.
                      if (!expanded) {
                        event.preventDefault();
                        openMenu(item.label);
                      }
                    }}
                    className={`${linkClass} inline-flex items-center gap-0.5`}
                  >
                    {activeBackdrop}
                    <span className="relative z-10">{item.label}</span>
                    <ChevronDown
                      aria-hidden
                      className={`relative z-10 h-3 w-3 transition-transform duration-200 ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-1.5 xl:flex">
              <Button
                asChild
                variant="ghost"
                className="h-11 whitespace-nowrap rounded-full border border-white/70 bg-white/55 px-3.5 text-[0.8rem] font-semibold text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition hover:bg-white/80 hover:text-slate-950"
              >
                <Link href="https://app.gleistrix.de/login" target="_blank" rel="noopener noreferrer">
                  Anmelden
                </Link>
              </Button>
              <Button
                asChild
                className="group h-11 whitespace-nowrap rounded-full border border-white/35 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 text-[0.85rem] text-white shadow-[0_12px_28px_-14px_rgba(79,70,229,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 hover:shadow-[0_18px_34px_-14px_rgba(79,70,229,0.9)]"
              >
                <Link href="/demo-buchen">
                  Demo anfragen
                  <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>

            <button
              type="button"
              aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((isOpen) => !isOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/55 text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-xl transition hover:bg-white/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 xl:hidden"
            >
              <AnimatePresence initial={false}>
                <motion.span
                  key={menuOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -18, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 18, scale: 0.8 }}
                  transition={{ duration: 0.16 }}
                >
                  {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          {/* Megamenü. Das Polster oben ist die Brücke zwischen Leiste und
              Panel – ohne sie verlässt die Maus dazwischen den Header. */}
          <AnimatePresence>
            {activeItem?.catalog && (
              <motion.div
                key={activeItem.label}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 top-full z-30 hidden pt-2 xl:block"
              >
                <MegaMenu catalog={activeItem.catalog} onNavigate={closeNow} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="page-container pointer-events-auto mt-2 xl:hidden"
          >
            <div className={`${styles.mobileShell} rounded-[1.5rem]`}>
              <nav
                aria-label="Mobile Navigation"
                className={`${styles.mobileGlass} relative max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain rounded-[inherit] p-2.5`}
              >
                <div
                  aria-hidden
                  className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-violet-400/20 blur-3xl"
                />
                <div className="relative z-10 flex flex-col gap-1">
                  {NAV_ITEMS.map((item, index) => {
                    const catalog = item.catalog;

                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.025 }}
                      >
                        {catalog ? (
                          <div>
                            <button
                              type="button"
                              aria-expanded={openSection === item.label}
                              onClick={() =>
                                setOpenSection((current) =>
                                  current === item.label ? null : item.label,
                                )
                              }
                              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                                isActive(item.href)
                                  ? "bg-white/80 text-slate-950 shadow-sm"
                                  : "text-slate-700 hover:bg-white/60 hover:text-slate-950"
                              }`}
                            >
                              {item.label}
                              <ChevronDown
                                aria-hidden
                                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                                  openSection === item.label ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {openSection === item.label && (
                              <ul className="mb-1 ml-4 space-y-0.5 border-l border-slate-200/80 pl-3">
                                {catalog.entries.map((entry) => (
                                  <li key={entry.slug}>
                                    <Link
                                      href={`${catalog.basePath}/${entry.slug}`}
                                      onClick={() => setMenuOpen(false)}
                                      className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-white/60 hover:text-slate-950"
                                    >
                                      {entry.title}
                                    </Link>
                                  </li>
                                ))}
                                <li>
                                  <Link
                                    href={catalog.overviewHref}
                                    onClick={() => setMenuOpen(false)}
                                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-white/60"
                                  >
                                    {catalog.overviewLabel}
                                  </Link>
                                </li>
                              </ul>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                              isActive(item.href)
                                ? "bg-white/80 text-slate-950 shadow-sm"
                                : "text-slate-700 hover:bg-white/60 hover:text-slate-950"
                            }`}
                          >
                            {item.label}
                            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 opacity-60" />
                          </Link>
                        )}
                      </motion.div>
                    );
                  })}

                  <Button
                    asChild
                    variant="ghost"
                    className="mt-2 h-12 w-full rounded-xl border border-white/70 bg-white/60 text-slate-800 hover:bg-white/80 hover:text-slate-950"
                  >
                    <Link
                      href="https://app.gleistrix.de/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                    >
                      Anmelden
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-[0_14px_30px_-16px_rgba(79,70,229,0.9)] hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500"
                  >
                    <Link href="/demo-buchen" onClick={() => setMenuOpen(false)}>
                      Demo anfragen
                      <ArrowUpRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
