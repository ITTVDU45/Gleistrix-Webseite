import Image from "next/image";
import { INTEGRATIONS, SECURITY_BADGES } from "@/data/integrations";
import type { Integration } from "@/data/integrations";
import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

/** Zwei Reihen, die gegenläufig laufen */
const ROW_A = INTEGRATIONS.slice(0, Math.ceil(INTEGRATIONS.length / 2));
const ROW_B = INTEGRATIONS.slice(Math.ceil(INTEGRATIONS.length / 2));

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
      // Wird nie breiter als 128px dargestellt – ohne sizes lieferte Next.js
      // Varianten bis 3840px aus.
      sizes="128px"
      className="h-7 w-auto max-w-32 object-contain transition-transform duration-300 hover:scale-110 md:h-8"
    />
  );
}

/**
 * Endlose Logo-Reihe.
 *
 * Aufbau: ein Wrapper mit exakt zwei identischen Hälften wandert um -50 %,
 * also um genau eine Hälfte – dadurch liegt am Ende des Durchlaufs die zweite
 * Hälfte pixelgenau auf der Startposition der ersten (nahtloser Loop).
 *
 * Damit rechts keine Lücke entsteht, muss jede Hälfte mindestens so breit sein
 * wie der Container (max. 1152 px). Sieben Logos ergeben ~890 px, deshalb wird
 * die Liste je Hälfte verdoppelt.
 */
function MarqueeRow({
  items,
  reverse = false,
}: {
  items: Integration[];
  reverse?: boolean;
}) {
  // 4 Gruppen = 2 Hälften à 2 Durchläufe. Ohne Bewegung bleibt nur die erste
  // Gruppe stehen, damit die Logos dort nicht doppelt erscheinen.
  const groups = [0, 1, 2, 3];

  return (
    <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] motion-reduce:[mask-image:none]">
      <div
        className={cn(
          "flex w-max group-hover:[animation-play-state:paused]",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          "motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center"
        )}
      >
        {groups.map((group) => (
          <div
            key={group}
            aria-hidden={group > 0}
            className={cn(
              "flex shrink-0 items-center gap-12 pr-12 md:gap-14 md:pr-14",
              "motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-10 motion-reduce:gap-y-6 motion-reduce:pr-0",
              group > 0 && "motion-reduce:hidden"
            )}
          >
            {items.map((item) => (
              <LogoItem key={item.id} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
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
        <div className="absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.08),transparent)]" />
      </div>

      <div className="page-container relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
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
            Rechenzentren – rechtssicher für Auftraggeber wie die Deutsche Bahn.
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
          <div className="space-y-8">
            <MarqueeRow items={ROW_A} />
            <MarqueeRow items={ROW_B} reverse />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
