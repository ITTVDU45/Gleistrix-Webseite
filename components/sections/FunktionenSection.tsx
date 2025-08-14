"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Truck, Folder, CalendarClock, FileText, Clock, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import FeaturesAccordion from "@/components/sections/FeaturesAccordion";
import dynamic from "next/dynamic";

const Squares = dynamic(() => import("@/components/visuals/Squares"), { ssr: false });

type Feature = { icon: LucideIcon; title: string; desc: string };

export default function FunktionenSection() {
  const features: Feature[] = [
    { icon: Users, title: "Mitarbeiterverwaltung", desc: "Anlegen, bearbeiten und verwalten – inkl. Urlaubsplanung und Abwesenheiten." },
    { icon: Truck, title: "Fahrzeug- & Technikmanagement", desc: "Fahrzeuge und Geräte zentral erfassen, warten und Einsätzen zuordnen." },
    { icon: Folder, title: "Projektplanung & Disposition", desc: "Projekte anlegen, Ressourcen wie Technik, Fahrzeuge und Personal präzise zuweisen." },
    { icon: CalendarClock, title: "Kalender & Einsatzübersicht", desc: "Alle Termine und Schichten übersichtlich in der App – jederzeit aktuell." },
    { icon: FileText, title: "Rechnungsstellung", desc: "Schnell, korrekt und auf Wunsch automatisiert erstellen." },
    { icon: FileText, title: "Dokumentenmanagement", desc: "Wichtige Unterlagen zentral speichern, teilen und revisionssicher archivieren." },
    { icon: Clock, title: "Zeiterfassung & Stundenzettel", desc: "Digital, mobil und prüffähig – direkt mit Projekten verknüpft." },
    { icon: CheckCircle2, title: "Reports & Auswertungen", desc: "Echtzeitdaten für fundierte Entscheidungen und transparente Abläufe." },
  ];

  const renderCard = (f: Feature, idx: number) => {
    const Icon = f.icon;
    return (
      <motion.div
        key={f.title}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.4, delay: idx * 0.04 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col bg-white/10 backdrop-blur ring-1 ring-white/10 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/20 ring-1 ring-white/20">
                <Icon className="h-5 w-5 text-white" />
              </span>
              {f.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-auto">
            <p className="text-white/80">{f.desc}</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <section className="relative w-full py-24 bg-gradient-to-b from-gray-900 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Squares direction="diagonal" speed={0.35} squareSize={52} borderColor="#223" hoverFillColor="#0b1020" />
      </div>
      <div className="page-container relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold">Eine Lösung für alle Prozesse.</h2>
        </div>
        <FeaturesAccordion />
      </div>
    </section>
  );
}


