import type { Metadata } from "next";
import Image from "next/image";
import { Cpu, Target, Sparkles, History, X, Check } from "lucide-react";
import PageHero from "@/components/landing/PageHero";
import Reveal from "@/components/landing/Reveal";
import SectionHeading from "@/components/landing/SectionHeading";
import CTASection from "@/components/sections/CTASection";
import ProfileCard from "@/components/visuals/ProfileCard";

export const metadata: Metadata = {
  title: "Über uns",
  description:
    "Gleistrix verbindet präzise Prozesse mit moderner Technologie – für Unternehmen, in denen Sicherheit, Nachvollziehbarkeit und Effizienz entscheidend sind.",
};

const TECH_TAGS = ["APIs", "Events", "Modularer Kern"] as const;

const BEFORE_ITEMS = [
  "Zersplitterte Tools und Systeme",
  "Manuelle Stundenzettel mit Fehlern",
  "Aufwändige Korrekturen und Nacharbeit",
  "Rückläufer bei Rechnungen",
  "Fehlende Transparenz in Projekten",
  "Hoher administrativer Aufwand",
] as const;

const AFTER_ITEMS = [
  "Zentrale Steuerung aller Prozesse",
  "Digitale Nachweise und Dokumentation",
  "Automatisierte Lohn- und Rechnungslogik",
  "Schnellere Durchlaufzeiten",
  "Klare Reports und Dashboards",
  "Belegbare Effizienzgewinne",
] as const;

export default function Page() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Über uns"
        title={
          <>
            Präzise Prozesse, <span className="text-gradient-accent">moderne Technologie</span>
          </>
        }
        description="Gleistrix verbindet die Realität von Bahndienstleistern mit einer Plattform, in der Sicherheit, Nachvollziehbarkeit und Effizienz an erster Stelle stehen."
      />

      {/* Tech-Vision */}
      <section className="bg-[#f8fafc] py-16 md:py-20">
        <div className="page-container">
          <Reveal>
            <div className="glass rounded-3xl p-7 shadow-soft-sm md:p-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-soft-sm">
                  <Cpu className="h-5 w-5" />
                </span>
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Unsere Tech-Vision</h2>
              </div>
              <p className="mt-4 max-w-4xl leading-relaxed text-slate-500">
                Wir bauen ein ERP, das sich nahtlos an den Alltag anfühlt: klar strukturiert, robust, schnell und
                durchdacht. APIs, Events und ein modularer Kern sorgen dafür, dass Gleistrix mit deinen Anforderungen
                wächst – nicht umgekehrt.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {TECH_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-slate-900/8 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-16 md:py-20">
        <div className="page-container grid gap-5 md:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-3xl border border-slate-900/8 bg-[#f8fafc] p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-soft-sm">
                <Target className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">Mission</h3>
              <p className="mt-3 leading-relaxed text-slate-500">
                Effizienz durch Präzision. Gleistrix befreit Unternehmen mit sicherheitskritischen Einsätzen von
                überflüssiger Komplexität. Herausragende Prozesse beruhen auf klaren Strukturen, verlässlichen Daten
                und einfacher Bedienung.
              </p>
            </article>
          </Reveal>
          <Reveal delay={0.08}>
            <article className="h-full rounded-3xl border border-slate-900/8 bg-[#f8fafc] p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-soft-sm">
                <Sparkles className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">Vision</h3>
              <p className="mt-3 leading-relaxed text-slate-500">
                Ein ERP, das nicht im Weg steht, sondern Leistung freisetzt – von der Schichtplanung bis zur
                X-Rechnung. Transparenz, Nachvollziehbarkeit und Skalierbarkeit stehen im Mittelpunkt.
              </p>
            </article>
          </Reveal>
        </div>
      </section>

      {/* Wie es zu Gleistrix kam */}
      <section className="bg-[#f8fafc] py-16 md:py-20">
        <div className="page-container">
          <Reveal>
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-soft ring-1 ring-slate-900/8">
                <Image
                  src="/Sicherungsunternehmen.png"
                  alt="Gleistrix in der Praxis"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-soft-sm">
                    <History className="h-5 w-5" />
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Wie es zu Gleistrix kam</h2>
                </div>
                <p className="mt-4 leading-relaxed text-slate-500">
                  2022 gestartet, entstand Gleistrix aus der Praxis: Unternehmen der Bahnsicherung brauchten eine
                  Lösung, die Qualifikationen, Schichten, Nachweise, Ausfallschichten und Abrechnung in einem System
                  vereint. Statt Kompromisse einzugehen, haben wir Gleistrix speziell für diese Anforderungen
                  entwickelt – präzise, robust und zukunftssicher.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Digitale Transformation: Vorher / Nachher */}
      <section className="bg-white py-16 md:py-24">
        <div className="page-container">
          <SectionHeading
            eyebrow="Digitale Transformation"
            title="Von der Zettelwirtschaft zur zentralen Steuerung"
            description="Durchschnittlich 40 % Zeitersparnis in der Administration – so verändert Gleistrix den Alltag."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 md:mt-16">
            <Reveal>
              <div className="h-full rounded-3xl border border-rose-200/70 bg-rose-50/50 p-7">
                <h3 className="text-lg font-semibold text-rose-700">Vorher: Komplexität und Ineffizienz</h3>
                <ul className="mt-4 space-y-2.5">
                  {BEFORE_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                        <X className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-3xl border border-emerald-200/70 bg-emerald-50/40 p-7">
                <h3 className="text-lg font-semibold text-emerald-700">Mit Gleistrix: Effizienz und Kontrolle</h3>
                <ul className="mt-4 space-y-2.5">
                  {AFTER_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Check className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#f8fafc] py-16 md:py-24">
        <div className="page-container">
          <SectionHeading
            eyebrow="Team"
            title="Die Menschen hinter Gleistrix"
            description="Ein interdisziplinäres Team aus Produkt, Engineering und Branchenexperten – vereint durch die Idee, komplexe Abläufe einfach und verlässlich zu machen."
          />
          <Reveal delay={0.1} className="mt-12 flex justify-center">
            <ProfileCard
              name="Tolgahan Vardar"
              title="Geschäftsführer"
              handle="Tolgahan Vardar"
              status="Geschäftsführer"
              contactText="Kontakt"
              avatarUrl="/Tolgahan%20Vardar.jpeg"
              avatarScale={1.05}
              avatarBottomPx={-60}
              enableTilt={true}
              enableMobileTilt={false}
              showUserInfo={true}
            />
          </Reveal>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
