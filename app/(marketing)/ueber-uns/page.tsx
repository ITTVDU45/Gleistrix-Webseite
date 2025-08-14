import Squares from "@/components/visuals/Squares";
import CTASection from "@/components/sections/CTASection";
import { Cpu, Target, Sparkles, History } from "lucide-react";
import Image from "next/image";
import ProfileCard from "@/components/visuals/ProfileCard";

export default function Page() {
  return (
    <main className="relative text-white overflow-hidden bg-gradient-to-b from-gray-900 to-slate-900">
      {/* Global animated background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Squares direction="diagonal" speed={0.35} squareSize={52} borderColor="#223" hoverFillColor="#0b1020" />
      </div>

      <div className="relative z-10">
        {/* Banner */}
        <section className="page-container pt-28 md:pt-32 pb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-500 to-violet-600">
            Über uns
          </h1>
          <p className="mt-3 text-lg text-white/90 max-w-3xl">
            Gleistrix verbindet präzise Prozesse mit moderner Technologie – für Unternehmen, in denen Sicherheit,
            Nachvollziehbarkeit und Effizienz entscheidend sind.
          </p>
        </section>

        {/* Über Techvision */}
        <section className="page-container py-12">
          <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.04] backdrop-blur p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <Cpu className="h-5 w-5" />
              </span>
              <h2 className="text-2xl md:text-3xl font-semibold">Unsere Tech‑Vision</h2>
            </div>
            <p className="mt-4 text-white/85 max-w-4xl">
              Wir bauen ein ERP, das sich nahtlos an Ihren Alltag anfühlt: klar strukturiert, robust, schnell und
              durchdacht. APIs, Events und ein modularer Kern sorgen dafür, dass Gleistrix mit Ihren Anforderungen
              wächst – nicht umgekehrt.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["APIs", "Events", "Modularer Kern"].map((b) => (
                <span key={b} className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/85">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="page-container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.04] backdrop-blur p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <Target className="h-5 w-5" />
                </span>
                <h3 className="text-xl font-semibold">Mission</h3>
              </div>
              <p className="mt-3 text-white/85">
                Unsere Mission: Effizienz durch Präzision. Gleistrix wurde entwickelt, um Unternehmen mit
                sicherheitskritischen Einsätzen von überflüssiger Komplexität zu befreien. Wir glauben, dass
                herausragende Prozesse auf klaren Strukturen, verlässlichen Daten und einfacher Bedienung beruhen.
              </p>
            </div>
            <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.06] backdrop-blur p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <Sparkles className="h-5 w-5" />
                </span>
                <h3 className="text-xl font-semibold">Vision</h3>
              </div>
              <p className="mt-3 text-white/85">
                Unsere Vision ist ein ERP, das nicht im Weg steht, sondern Leistung freisetzt – von der Schichtplanung
                bis zur X‑Rechnung. Transparenz, Nachvollziehbarkeit und Skalierbarkeit stehen im Mittelpunkt.
              </p>
            </div>
          </div>
        </section>

        {/* Wie es zu Gleistrix kam */}
        <section className="page-container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Image left */}
            <div className="order-1">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-white/10 bg-white/5">
                <Image src="/Sicherungsunternehmen.png" alt="Gleistrix in der Praxis" fill className="object-cover" />
              </div>
            </div>
            {/* Text right */}
            <div className="order-2">
              <div className="h-full rounded-2xl ring-1 ring-white/10 bg-white/[0.04] backdrop-blur p-6 md:p-7 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                    <History className="h-5 w-5" />
                  </span>
                  <h2 className="text-2xl md:text-3xl font-semibold">Wie es zu Gleistrix kam</h2>
                </div>
                <p className="mt-4 text-white/85 text-base sm:text-lg leading-relaxed max-w-4xl">
                  2022 gestartet, entstand Gleistrix aus der Praxis: Unternehmen der Bahnsicherung benötigten eine
                  Lösung, die Qualifikationen, Schichten, Nachweise, Ausfallschichten und Abrechnung in einem System
                  vereint. Statt Kompromisse einzugehen, haben wir Gleistrix speziell für diese Anforderungen
                  entwickelt – präzise, robust und zukunftssicher.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Digitale Transformation */}
        <section className="page-container py-12">
          <h2 className="text-2xl md:text-3xl font-semibold">Die digitale Transformation mit Gleistrix</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl ring-1 ring-red-500/25 bg-red-500/10 backdrop-blur p-5">
              <h3 className="font-semibold text-red-300">Vorher: Komplexität und Ineffizienz</h3>
              <ul className="mt-3 space-y-2 text-white/85 text-sm">
                <li>• Zersplitterte Tools und Systeme</li>
                <li>• Manuelle Stundenzettel mit Fehlern</li>
                <li>• Aufwändige Korrekturen und Nacharbeit</li>
                <li>• Rückläufer bei Rechnungen</li>
                <li>• Fehlende Transparenz in Projekten</li>
                <li>• Hoher administrativer Aufwand</li>
              </ul>
            </div>
            <div className="rounded-2xl ring-1 ring-emerald-500/25 bg-emerald-500/10 backdrop-blur p-5">
              <h3 className="font-semibold text-emerald-300">Mit Gleistrix: Effizienz und Kontrolle</h3>
              <ul className="mt-3 space-y-2 text-white/85 text-sm">
                <li>• Zentrale Steuerung aller Prozesse</li>
                <li>• Digitale Nachweise und Dokumentation</li>
                <li>• Automatisierte Lohn- und Rechnungslogik</li>
                <li>• Schnellere Durchlaufzeiten</li>
                <li>• Klare Reports und Dashboards</li>
                <li>• Belegbare Effizienzgewinne</li>
              </ul>
              <p className="mt-3 text-white/80 text-sm">🚀 Durchschnittlich 40% Zeitersparnis in der Administration</p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="page-container py-12">
          <h2 className="text-2xl md:text-3xl font-semibold">Unser Team</h2>
          <p className="mt-3 text-white/85 max-w-3xl">
            Hinter Gleistrix steht ein interdisziplinäres Team aus Produkt, Engineering und Branchenexperten – vereint
            durch die Idee, komplexe Abläufe einfach und verlässlich zu machen.
          </p>
          <div className="mt-8 flex justify-center">
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
          </div>
        </section>

        {/* CTA */}
        <CTASection />
      </div>
    </main>
  );
}


