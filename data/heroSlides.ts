import type { LucideIcon } from "lucide-react";
import {
  CalendarRange,
  ChartColumn,
  DraftingCompass,
  FileCheck2,
  Flame,
  HardHat,
  ShieldCheck,
  Truck,
} from "lucide-react";

/** Module in der Aktionsleiste unter dem Maskottchen */
export type HeroModule = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const HERO_MODULES: HeroModule[] = [
  { id: "plantafel", label: "Plantafel", icon: CalendarRange },
  { id: "technik", label: "Technik", icon: Truck },
  { id: "doku", label: "Doku", icon: FileCheck2 },
  { id: "reports", label: "Reports", icon: ChartColumn },
];

export type HeroSlide = {
  id: string;
  /** Rotierendes Wort in der Headline: "Du sparst dir …" */
  word: string;
  /** Kurzform für die Gewerke-Auswahl unter der Headline */
  audienceShort: string;
  /** Badge am Maskottchen: "Gleistrix für …" */
  audience: string;
  audienceIcon: LucideIcon;
  /** Nachricht in der Chat-Blase */
  message: string;
  /** Hervorgehobenes Modul in der Aktionsleiste */
  moduleId: HeroModule["id"];
  image: string;
  alt: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "sicherung",
    word: "Zettelchaos",
    audienceShort: "Sicherungsunternehmen",
    audience: "Gleistrix für Sicherungsunternehmen",
    audienceIcon: ShieldCheck,
    message:
      "Plant SiPo-Schichten qualifikationsbasiert – mit Nachweisen, Doku und Freigaben.",
    moduleId: "plantafel",
    image: "/mascots/fox-sicherung.webp",
    alt: "Gleistrix-Fuchs als Sicherungsposten mit Warnweste, Sicherungsfahne und Einsatz-Tablet",
  },
  {
    id: "gleisbau",
    word: "Doppelarbeit",
    audienceShort: "Gleisbau",
    audience: "Gleistrix für Gleisbauunternehmen",
    audienceIcon: HardHat,
    message:
      "Steuert Baustellen, Trupps und Zweiwege-Technik in Echtzeit – Fortschritt inklusive.",
    moduleId: "technik",
    image: "/mascots/fox-bauleitung.webp",
    alt: "Gleistrix-Fuchs als Bauleiter mit Helm und Tablet mit Baustellen-Fortschritt",
  },
  {
    id: "schweissen",
    word: "Papierkram",
    audienceShort: "Schweißtechnik",
    audience: "Gleistrix für Schweißbetriebe",
    audienceIcon: Flame,
    message:
      "Erfasst Schweißprüfungen digital – Temperatur, Durchgang und Protokoll inklusive.",
    moduleId: "doku",
    image: "/mascots/fox-schweissen.webp",
    alt: "Gleistrix-Fuchs als Schweißer mit Schweißhelm, Brenner und Prüfprotokoll-Tablet",
  },
  {
    id: "planung",
    word: "Planungschaos",
    audienceShort: "Ingenieurbüros",
    audience: "Gleistrix für Ingenieurbüros",
    audienceIcon: DraftingCompass,
    message:
      "Hält Bauabschnitte, Ressourcen, Zeitleiste und Kosten in einer Ansicht zusammen.",
    moduleId: "reports",
    image: "/mascots/fox-planung.webp",
    alt: "Gleistrix-Fuchs als Planer vor einem holografischen Streckenplan mit Bauabschnitten",
  },
];
