import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import { ConsentSettingsButton } from "@/components/consent/consent-settings-button";
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
    <footer className="relative isolate overflow-hidden bg-[#f6f8fb] pt-14 sm:pt-20 md:pt-28">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden justify-center overflow-hidden md:flex">
        <span className="animate-drift translate-y-[42%] select-none whitespace-nowrap text-[200px] font-black leading-none tracking-tighter text-slate-900/[0.04] lg:text-[300px]">Gleistrix</span>
      </div>

      <div className="page-container relative pb-16 sm:pb-28 md:pb-44">
        <FooterCTA />

        <Reveal delay={0.05} className="mt-6 sm:mt-8 md:mt-10">
          <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:rounded-[2rem] sm:p-8 md:p-14">
            <div className="grid min-w-0 gap-9 sm:gap-12 lg:grid-cols-12">
              <div className="min-w-0 lg:col-span-4">
                <Link href="/" className="inline-flex max-w-full items-center rounded-xl outline-none ring-indigo-500/30 transition focus-visible:ring-4" aria-label="Gleistrix Startseite">
                  <BrandLogo markClassName="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11" wordmarkClassName="text-[1.3rem] sm:text-[1.45rem] md:text-[1.65rem]" />
                </Link>
                <p className="mt-4 max-w-[42ch] text-sm leading-6 text-slate-500 sm:mt-5 sm:leading-relaxed">
                  Gleistrix ist die moderne ERP- und SaaS-Plattform für Bahndienstleister. Von Projektmanagement über Plantafel und Dokumentation bis zur Abrechnung.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-6">
                  {SOCIAL_LINKS.map((social) => (
                    <Link key={social.label} href={social.href} aria-label={social.label} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900">
                      <social.icon className="h-[18px] w-[18px]" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-8 min-[430px]:grid-cols-2 sm:gap-y-10 md:grid-cols-4 lg:col-span-8">
                {FOOTER_COLUMNS.map((column, index) => (
                  <Reveal key={column.heading} delay={0.1 + index * 0.06} className="min-w-0">
                    <nav aria-label={column.heading} className="min-w-0">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">{column.heading}</h4>
                      <ul className="mt-3 space-y-2.5 sm:mt-4">
                        {column.links.map((link) => (
                          <li key={link.label} className="min-w-0">
                            <Link href={link.href} className="block min-w-0 hyphens-auto text-sm leading-snug text-slate-500 transition-colors duration-200 [overflow-wrap:anywhere] hover:text-indigo-600">{link.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="mt-9 flex min-w-0 flex-col gap-4 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-400 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
              <p>© {new Date().getFullYear()} Gleistrix. Alle Rechte vorbehalten.</p>
              <ul className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
                {FOOTER_LEGAL.map((link) => (
                  <li key={link.label} className="min-w-0">
                    {link.action === "consent" ? (
                      <ConsentSettingsButton className="transition-colors duration-200 hover:text-slate-700" />
                    ) : (
                      <Link href={link.href} className="transition-colors duration-200 hover:text-slate-700">{link.label}</Link>
                    )}
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
