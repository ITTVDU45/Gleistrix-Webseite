import Link from "next/link";
import { ArrowRight, Briefcase, HardHat, ShieldCheck, TrainFront, Users, Warehouse } from "lucide-react";
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
  /** Motiv am Kopf der Karte. */
  image: { src: string; alt: string };
  /** Kurzer Loop, der laeuft, sobald die Karte im Bild ist. */
  video: string;
  /**
   * Weiterführende Seite. Branchen verlinken ihre Landingpage, Rollen das
   * Modul, mit dem sie am meisten arbeiten – echte Links mit sprechendem Text
   * statt Karten, die nirgendwohin führen.
   */
  link: { href: string; label: string };
};

const AUDIENCES: Audience[] = [
  { iconKey: "shield", icon: ShieldCheck, title: "Sicherungsunternehmen", description: "SiPo-, Sakra- und BüP-Einsätze nach Funktion planen, Konflikte vor dem Einsatz sehen und Stunden nachweisen.", image: { src: "/media/zielgruppen/sipo.webp", alt: "Sicherungsposten im Einsatz an der Strecke" }, video: "/media/zielgruppen/sipo.mp4", link: { href: "/branchen/sicherungsunternehmen", label: "Software für Sicherungsunternehmen" } },
  { iconKey: "train", icon: TrainFront, title: "Gleisbauunternehmen", description: "Trupps, Zweiwegetechnik und Material über Baustellen hinweg steuern – bis zur Marge je Baustelle.", image: { src: "/media/zielgruppen/bahndienstleister.webp", alt: "Gleisbautrupp auf der Baustelle" }, video: "/media/zielgruppen/bahndienstleister.mp4", link: { href: "/branchen/gleisbauunternehmen", label: "Gleisbau-Software" } },
  { iconKey: "hardhat", icon: HardHat, title: "Projektleiter", description: "Projekte, Ressourcen und Dokumente ohne Telefonkette im Blick.", image: { src: "/media/zielgruppen/projektleiter.webp", alt: "Projektleitung im Gelände" }, video: "/media/zielgruppen/projektleiter.mp4", link: { href: "/produkt/projektplanung-disposition", label: "Projektplanung und Disposition" } },
  { iconKey: "users", icon: Users, title: "Backoffice", description: "Stundennachweise, Freigaben und Abrechnung ohne Zettelwirtschaft.", image: { src: "/media/zielgruppen/backoffice.webp", alt: "Backoffice am Arbeitsplatz" }, video: "/media/zielgruppen/backoffice.mp4", link: { href: "/produkt/rechnungsstellung", label: "Projektabrechnung" } },
  { iconKey: "warehouse", icon: Warehouse, title: "Lagerverwaltung", description: "Material und Sicherungstechnik mit Beständen, Ausgaben und Prüfterminen.", image: { src: "/media/zielgruppen/lager.webp", alt: "Lagerverwaltung mit Handscanner" }, video: "/media/zielgruppen/lager.mp4", link: { href: "/produkt/lagerverwaltung", label: "Lagerverwaltung" } },
  { iconKey: "briefcase", icon: Briefcase, title: "Geschäftsführung", description: "Kosten, Ergebnis und Marge je Projekt auf einen Blick.", image: { src: "/media/zielgruppen/geschaeftsfuehrung.webp", alt: "Geschäftsführung im Auswertungsgespräch" }, video: "/media/zielgruppen/geschaeftsfuehrung.mp4", link: { href: "/produkt/reports-auswertungen", label: "Reports und Projektcontrolling" } },
];

/** Branchen ohne eigene Karte – als Textlinks, damit auch sie von der Startseite erreichbar sind. */
const MORE_INDUSTRIES = [
  { href: "/branchen/gleisbausicherung-bauueberwachung", label: "Gleisbausicherung & Bauüberwachung" },
  { href: "/branchen/subunternehmen-db", label: "Subunternehmen der DB" },
  { href: "/branchen/auftragsbasierte-dienstleister", label: "Auftragsbasierte Dienstleister" },
] as const;

export default function AudienceSection() {
  const mobileItems = AUDIENCES.map(({ iconKey, title, description, image, video, link }) => ({ iconKey, title, description, image, video, link }));

  return (
    <section id="vorteile" aria-labelledby="audience-heading" className="scroll-mt-24 bg-white py-16 md:py-28">
      <div className="page-container">
        <SectionHeading eyebrow="Für wen" title={<span id="audience-heading">Gemacht für alle, die den Bahnbetrieb am Laufen halten</span>} description="Für Sicherungsunternehmen, Gleisbauunternehmen und Bahndienstleister – vom Sicherungsposten bis zur Geschäftsführung arbeitet jede Rolle mit denselben aktuellen Daten." />
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
                  <CardMedia src={audience.image.src} alt={audience.image.alt} video={audience.video} />
                  <div className="relative flex flex-1 flex-col p-6">
                    <span className="absolute -top-6 left-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft ring-1 ring-slate-900/5">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-base font-semibold text-slate-900">{audience.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{audience.description}</p>
                    <Link href={audience.link.href} className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20">
                      {audience.link.label}
                      <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-slate-500 md:mt-12">
          Weitere Branchenlösungen:{" "}
          {MORE_INDUSTRIES.map((industry, index) => (
            <span key={industry.href}>
              {index > 0 && " · "}
              <Link href={industry.href} className="font-semibold text-brand-700 underline-offset-4 hover:underline">{industry.label}</Link>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
