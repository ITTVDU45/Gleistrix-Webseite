import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Reveal from "@/components/landing/Reveal";
import FooterCTA from "./footer/FooterCTA";
import { FOOTER_COLUMNS, FOOTER_LEGAL } from "./footer/footer-nav";

const SOCIAL_LINKS = [
  { href: "#", label: "Gleistrix auf LinkedIn", icon: Linkedin },
  { href: "#", label: "Gleistrix auf X", icon: Twitter },
  { href: "#", label: "Gleistrix auf GitHub", icon: Github },
  { href: "/demo-buchen", label: "Kontakt aufnehmen", icon: Mail },
] as const;

export default function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#f6f8fb] pt-20 md:pt-28">
      {/* Riesiges, sehr transparentes Branding-Wasserzeichen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden justify-center overflow-hidden md:flex"
      >
        <span className="animate-drift translate-y-[42%] select-none whitespace-nowrap text-[200px] font-black leading-none tracking-tighter text-slate-900/[0.04] lg:text-[300px]">
          Gleistrix
        </span>
      </div>

      <div className="page-container relative pb-28 md:pb-44">
        {/* Dunkler CTA-Banner */}
        <FooterCTA />

        {/* Helle Footer-Karte */}
        <Reveal delay={0.05} className="mt-8 md:mt-10">
          <div className="rounded-[2rem] border border-slate-200/70 bg-white/85 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-14">
            <div className="grid gap-12 lg:grid-cols-12">
              {/* Branding */}
              <div className="lg:col-span-4">
                <Link
                  href="/"
                  className="inline-flex items-center"
                  aria-label="Gleistrix Startseite"
                >
                  <Image
                    src="/Gleistrix Logo (500 x 300 px).png"
                    alt="Gleistrix Logo"
                    width={500}
                    height={300}
                    className="h-11 w-auto"
                  />
                </Link>
                <p className="mt-5 max-w-[42ch] text-sm leading-relaxed text-slate-500">
                  Gleistrix ist die moderne ERP- und SaaS-Plattform für Bahndienstleister. Von
                  Projektmanagement über Plantafel und Dokumentation bis zur Abrechnung.
                </p>
                <div className="mt-6 flex items-center gap-2.5">
                  {SOCIAL_LINKS.map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <social.icon className="h-[18px] w-[18px]" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Link-Spalten */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:col-span-8">
                {FOOTER_COLUMNS.map((column, index) => (
                  <Reveal key={column.heading} delay={0.1 + index * 0.06} className="min-w-0">
                    <nav aria-label={column.heading}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        {column.heading}
                      </h4>
                      <ul className="mt-4 space-y-2.5">
                        {column.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              className="text-sm leading-snug text-slate-500 transition-colors duration-200 hover:text-indigo-600 hyphens-auto [overflow-wrap:anywhere]"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Untere Zeile */}
            <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Gleistrix. Alle Rechte vorbehalten.</p>
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {FOOTER_LEGAL.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors duration-200 hover:text-slate-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
