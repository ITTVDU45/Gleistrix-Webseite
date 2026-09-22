import Image from "next/image";
import Link from "next/link";
import { INTEGRATION_CATALOG } from "@/data/integration-pages";
import { INTEGRATIONS, SECURITY_BADGES } from "@/data/integrations";
import type { Integration } from "@/data/integrations";
import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

/**
 * Nur Anbindungen mit Produktbeleg – dieselben, die Megamenü und
 * /integrationen zeigen. Die Liste folgt dem Katalog, damit Logo-Leiste und
 * Menü nicht auseinanderlaufen, wenn eine Anbindung dazukommt.
 *
 * Früher liefen hier alle 14 Logos als Endlosband. Mit vier Logos wäre die
 * Wiederholung im Band sichtbar geworden; eine ruhige Reihe mit Links auf die
 * Detailseiten trägt mehr.
 */
const LISTED = new Set(INTEGRATION_CATALOG.entries.map((entry) => entry.slug));
const LOGOS = INTEGRATIONS.filter((item) => LISTED.has(item.id));

function LogoItem({ item }: { item: Integration }) {
  if (!item.src) {
    // Platzhalter, bis eine Logodatei vorliegt – bewusst als Wortmarke gesetzt.
    // Gewicht und Farbe sind so gewählt, dass sie neben den echten Logos nicht
    // dominieren.
    return (
      <span className="whitespace-nowrap text-lg font-medium tracking-tight text-slate-400 transition-all duration-300 hover:scale-110 hover:text-slate-600">
        {item.label}
      </span>
    );
  }

  return (
    <Image
      src={item.src}
      alt={item.label}
      width={item.width}
      height={item.height}
      // Wird nie breiter als 144px dargestellt – ohne sizes lieferte Next.js
      // Varianten bis 3840px aus.
      sizes="144px"
      className={cn(
        "w-auto max-w-36 object-contain",
        // Randlose Dateien eine Stufe kleiner: ohne Weissraum liefen sie sonst
        // bis an die Kante ihres Platzes und wirkten angeschnitten.
        item.tight ? "h-6 md:h-7" : "h-9 md:h-10",
      )}
    />
  );
}

export default function SecurityIntegrations() {
  return (
    <section
      aria-labelledby="sicherheit-heading"
      className="relative overflow-hidden border-b border-slate-900/6 bg-white py-16 md:py-20"
    >
      {/* Dezenter Verlauf, damit die Sektion nicht als weiße Fläche kippt */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(51,98,255,0.08),transparent)]" />
      </div>

      <div className="page-container relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
            Sicherheit & Datenschutz
          </span>
          <h2
            id="sicherheit-heading"
            className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Deine Daten bleiben in Deutschland
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-500">
            Gleistrix läuft auf zertifizierter Infrastruktur in deutschen
            Rechenzentren – eine Grundlage für Auftraggeber wie die Deutsche Bahn.
          </p>
        </Reveal>

        {/* Drei Nachweise */}
        <Reveal delay={0.12} className="mt-10">
          <ul className="grid gap-4 sm:grid-cols-3">
            {SECURITY_BADGES.map((badge) => (
              <li
                key={badge.id}
                className="glass flex flex-col items-center rounded-2xl px-6 py-7 text-center shadow-soft-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="flex h-20 items-center justify-center md:h-24">
                  <Image
                    src={badge.src}
                    alt={badge.alt}
                    width={badge.width}
                    height={badge.height}
                    sizes="240px"
                    className={cn(
                      "object-contain",
                      badge.shape === "seal"
                        ? "h-16 w-16 md:h-20 md:w-20"
                        : "h-11 w-auto max-w-[200px] md:h-14 md:max-w-[240px]"
                    )}
                  />
                </span>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  {badge.caption}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Anbindungen */}
        <Reveal delay={0.2} className="mt-14">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Angebunden an die Systeme, die ihr bereits nutzt
          </p>
          <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {LOGOS.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/integrationen/${item.id}`}
                  aria-label={`${item.label}: Anbindung ansehen`}
                  className="flex h-20 items-center justify-center rounded-2xl border border-slate-900/6 bg-white/70 px-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-900/10 hover:shadow-soft-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 md:h-24"
                >
                  <LogoItem item={item} />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
