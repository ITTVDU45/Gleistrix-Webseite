import { Briefcase, HardHat, ShieldCheck, TrainFront, Users, Warehouse } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CardMedia from "@/components/media/CardMedia";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import MobileAudienceCarousel from "./MobileAudienceCarousel";

type IconKey = "shield" | "train" | "hardhat" | "users" | "warehouse" | "briefcase";
type Audience = {
  iconKey: IconKey;
  icon: LucideIcon;
  title: string;
  description: string;
  /** Motiv am Kopf der Karte. Platzhalter, bis echte Fotos vorliegen. */
  image: { src: string; alt: string };
};

const AUDIENCES: Audience[] = [
  { iconKey: "shield", icon: ShieldCheck, title: "SIPO-Unternehmen", description: "Sicherungsposten, Qualifikationen und Einsätze rechtssicher koordinieren.", image: { src: "/placeholders/zielgruppe-sipo.svg", alt: "Sicherungsposten im Einsatz an der Strecke" } },
  { iconKey: "train", icon: TrainFront, title: "Bahndienstleister", description: "Projekte, Trupps und Maschinen über Baustellen hinweg steuern.", image: { src: "/placeholders/zielgruppe-bahndienstleister.svg", alt: "Bahndienstleister auf der Baustelle" } },
  { iconKey: "hardhat", icon: HardHat, title: "Projektleiter", description: "Fortschritt, Ressourcen und Dokumente ohne Telefonkette im Blick.", image: { src: "/placeholders/zielgruppe-projektleiter.svg", alt: "Projektleitung im Gelände" } },
  { iconKey: "users", icon: Users, title: "Backoffice", description: "Stammdaten, Nachweise und Abrechnung ohne Zettelwirtschaft.", image: { src: "/placeholders/zielgruppe-backoffice.svg", alt: "Backoffice am Arbeitsplatz" } },
  { iconKey: "warehouse", icon: Warehouse, title: "Lagerverwaltung", description: "Material und Sicherungstechnik mit Beständen und Prüffristen.", image: { src: "/placeholders/zielgruppe-lager.svg", alt: "Lagerverwaltung mit Handscanner" } },
  { iconKey: "briefcase", icon: Briefcase, title: "Geschäftsführung", description: "Auslastung, Kennzahlen und Deckungsbeiträge auf einen Blick.", image: { src: "/placeholders/zielgruppe-geschaeftsfuehrung.svg", alt: "Geschäftsführung im Auswertungsgespräch" } },
];

export default function AudienceSection() {
  const mobileItems = AUDIENCES.map(({ iconKey, title, description, image }) => ({ iconKey, title, description, image }));

  return (
    <section id="vorteile" aria-labelledby="audience-heading" className="scroll-mt-24 bg-white py-16 md:py-28">
      <div className="page-container">
        <SectionHeading eyebrow="Für wen" title={<span id="audience-heading">Gemacht für alle, die den Bahnbetrieb am Laufen halten</span>} description="Vom Sicherungsposten bis zur Geschäftsführung: Jede Rolle arbeitet mit denselben aktuellen Daten." />
        <MobileAudienceCarousel items={mobileItems} />

        {/* Jede Rolle bekommt ein eigenes Motiv – sechs identische Icon-Karten
            nebeneinander lesen sich sonst wie eine Liste. Das Icon sitzt
            überlappend auf der Bildkante und verbindet beide Ebenen. */}
        <div className="mt-12 hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
          {AUDIENCES.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <Reveal key={audience.title} delay={index * 0.05} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-900/8 bg-[#f8fafc] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-soft">
                  <CardMedia src={audience.image.src} alt={audience.image.alt} />
                  <div className="relative flex flex-1 flex-col p-6">
                    <span className="absolute -top-6 left-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-soft ring-1 ring-slate-900/5">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-base font-semibold text-slate-900">{audience.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{audience.description}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
