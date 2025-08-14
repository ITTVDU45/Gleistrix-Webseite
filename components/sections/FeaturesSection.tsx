"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, Users, Truck, Clock, FileText, CalendarClock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
const Squares = dynamic(() => import("@/components/visuals/Squares"), { ssr: false });

export default function FeaturesSection() {
  const features: { icon: LucideIcon; title: string; desc: string }[] = [
    { icon: Folder, title: "Projekte", desc: "Alle Projekte zentral organisiert – vom Entwurf bis zur Abnahme." },
    { icon: Users, title: "Mitarbeiter", desc: "Teams, Rollen und Berechtigungen im Griff – transparent und sicher." },
    { icon: Truck, title: "Fahrzeuge", desc: "Ressourcenplanung und Verfügbarkeit von Maschinen und Fahrzeugen." },
    { icon: Clock, title: "Zeiterfassung", desc: "Einsätze mobil erfassen – in Echtzeit und normgerecht dokumentiert." },
    { icon: FileText, title: "Dokumente", desc: "Alle projektbezogenen Unterlagen – jederzeit griffbereit und revisionssicher archiviert." },
    { icon: CalendarClock, title: "Einsatzplanung", desc: "Schichten, Aufgaben und Ressourcen intelligent koordinieren – übersichtlich und effizient." },
  ];

  // Cooperative Design: dezent, blau-violett
  const gradients = [
    "from-sky-50 to-violet-50",
    "from-sky-50 to-indigo-50",
    "from-indigo-50 to-violet-50",
    "from-sky-50 to-violet-50",
    "from-sky-50 to-indigo-50",
    "from-indigo-50 to-violet-50",
  ];
  const iconColors = [
    "text-sky-600",
    "text-indigo-600",
    "text-violet-600",
    "text-sky-600",
    "text-indigo-600",
    "text-violet-600",
  ];

  const renderCard = (f: { icon: LucideIcon; title: string; desc: string }, idx: number) => {
    const Icon = f.icon;
    const g = gradients[idx % gradients.length];
    const iconColor = iconColors[idx % iconColors.length];
    return (
      <Card className={`h-full flex flex-col bg-white/10 backdrop-blur ring-1 ring-white/10 border-0 shadow-sm hover:shadow-md transition-shadow`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/20 ring-1 ring-white/20`}>
              <Icon className={`h-5 w-5 text-white`} />
            </span>
            {f.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-auto">
          <p className="text-white/80">{f.desc}</p>
        </CardContent>
      </Card>
    );
  };
  return (
    <section className="relative z-[1] w-full pt-24 sm:pt-20 md:pt-16 lg:pt-16 xl:pt-16 pb-20 bg-gradient-to-b from-gray-900 to-slate-900 text-white overflow-hidden" id="loesungen">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Squares direction="diagonal" speed={0.4} squareSize={48} borderColor="#223" hoverFillColor="#0b1020" />
      </div>
      <div className="page-container relative z-10">
        {/* Top row: image left, copy right */}
        <div className="grid gap-8 md:grid-cols-2 items-center mb-10">
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100">
            <Image
              src="/Lösungen.png"
              alt="Produkt-Illustration"
              fill
              className="object-cover object-center"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-white mb-3">Planen. Disponieren. Abrechnen.</h2>
            <p className="text-white/90 max-w-[60ch]">
              Gleistrix bündelt Planung, Disposition und Zeiterfassung – zentral, transparent und in Echtzeit steuerbar.
            </p>
          </div>
        </div>

        {/* centered section title above cards */}
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-semibold">Warum als Unternehmen Gleistrix wählen</h3>
          <p className="text-white/80 max-w-3xl mx-auto mt-2">
            Gleistrix ist mehr als eine Software – es ist die zentrale Plattform für Branchen, in denen Präzision,
            Sicherheit und Effizienz entscheidend sind.
          </p>
        </div>

        {/* Cards grid: 3 / 2 / 1 layout */}
        <div className="space-y-6">
          {/* first row: 3 */}
          <div className="grid gap-6 md:grid-cols-3 items-stretch">
            {features.slice(0, 3).map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="h-full"
              >
                {renderCard(f, i)}
              </motion.div>
            ))}
          </div>
          {/* second row: 2 */}
          <div className="grid gap-6 md:grid-cols-2 items-stretch">
            {features.slice(3, 5).map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="h-full"
              >
                {renderCard(f, 3 + i)}
              </motion.div>
            ))}
          </div>
          {/* third row: 1 */}
          <div className="grid gap-6 items-stretch">
            {features.slice(5, 6).map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="h-full"
              >
                {renderCard(f, 5 + i)}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


