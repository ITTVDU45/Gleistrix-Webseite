import type { LucideIcon } from "lucide-react";
import {
  Cable,
  CalendarRange,
  ChartColumn,
  ClipboardCheck,
  DraftingCompass,
  FileCheck2,
  Flame,
  HardHat,
  Landmark,
  PackageCheck,
  RadioTower,
  Ruler,
  ShieldCheck,
  Trees,
  Truck,
  Users,
  Wrench,
  Zap,
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
  /** Rotierendes Wort in der Headline: "Du sparst dir …" – ≤ 13 Zeichen */
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
  /**
   * Nimmt am automatischen Wechsel der Bühne teil. Nur Slides mit eigenem
   * Original-Bild stehen auf `true` – der Chip-Klick funktioniert für alle.
   */
  inRotation: boolean;
  /**
   * True, solange der Slide noch das Fallback-Bild eines anderen Gewerks
   * verwendet. Sobald ein eigenes Fuchs-Rendering existiert: `image` tauschen,
   * `imageIsPlaceholder` entfernen und `inRotation` auf `true` setzen.
   */
  imageIsPlaceholder?: boolean;
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
    inRotation: true,
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
    inRotation: true,
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
    inRotation: true,
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
    inRotation: true,
  },
  {
    id: "leit-sicherungstechnik",
    word: "Rückfragen",
    audienceShort: "Leit- & Sicherungstechnik",
    audience: "Gleistrix für Leit- und Sicherungstechnik",
    audienceIcon: RadioTower,
    message:
      "Bündelt Aufträge, Personal und Nachweise für LST-Einsätze in einer Ansicht.",
    moduleId: "plantafel",
    image: "/mascots/fox-sicherung.webp",
    alt: "Gleistrix-Fuchs im LST-Einsatz",
    inRotation: false,
    imageIsPlaceholder: true,
  },
  {
    id: "oberleitung",
    word: "Abstimmung",
    audienceShort: "Oberleitungsbau",
    audience: "Gleistrix für Oberleitungsbau und Bahnstrom",
    audienceIcon: Zap,
    message:
      "Stimmt Sperrpausen, Ressourcen und Bahnstrom-Nachweise mit einem Klick ab.",
    moduleId: "technik",
    image: "/mascots/fox-bauleitung.webp",
    alt: "Gleistrix-Fuchs für Oberleitungsbau und Bahnstrom",
    inRotation: false,
    imageIsPlaceholder: true,
  },
  {
    id: "kabeltiefbau",
    word: "Excel-Chaos",
    audienceShort: "Kabeltiefbau",
    audience: "Gleistrix für Kabeltiefbau und Kabelmontage",
    audienceIcon: Cable,
    message:
      "Erfasst Trassen, Massen und Aufmaße mobil – Belege landen direkt in der Abrechnung.",
    moduleId: "technik",
    image: "/mascots/fox-bauleitung.webp",
    alt: "Gleistrix-Fuchs für Kabeltiefbau und Kabelmontage",
    inRotation: false,
    imageIsPlaceholder: true,
  },
  {
    id: "vermessung",
    word: "Handzettel",
    audienceShort: "Vermessung",
    audience: "Gleistrix für Vermessungsunternehmen",
    audienceIcon: Ruler,
    message:
      "Digitalisiert Messprotokolle und liefert Nachweise direkt an den Auftraggeber.",
    moduleId: "doku",
    image: "/mascots/fox-planung.webp",
    alt: "Gleistrix-Fuchs für Vermessungsunternehmen",
    inRotation: false,
    imageIsPlaceholder: true,
  },
  {
    id: "vegetation",
    word: "Mailfluten",
    audienceShort: "Vegetationspflege",
    audience: "Gleistrix für Vegetations- und Landschaftspflege",
    audienceIcon: Trees,
    message:
      "Bündelt Aufträge, Trupps und Nachweise für Grünpflege-Einsätze in einer Ansicht.",
    moduleId: "plantafel",
    image: "/mascots/fox-bauleitung.webp",
    alt: "Gleistrix-Fuchs für Vegetations- und Landschaftspflege",
    inRotation: false,
    imageIsPlaceholder: true,
  },
  {
    id: "spezialmaschinen",
    word: "Suchen",
    audienceShort: "Spezialmaschinen",
    audience: "Gleistrix für Stopf-, Schleif- und Spezialmaschinen",
    audienceIcon: Wrench,
    message:
      "Disponiert Stopf-, Schleif- und Spezialmaschinen inklusive Einsatzhistorie.",
    moduleId: "technik",
    image: "/mascots/fox-bauleitung.webp",
    alt: "Gleistrix-Fuchs für Stopf-, Schleif- und Spezialmaschinen",
    inRotation: false,
    imageIsPlaceholder: true,
  },
  {
    id: "pruefung",
    word: "Telefonate",
    audienceShort: "Prüf- & Gutachterbüros",
    audience: "Gleistrix für Prüf-, Inspektions- und Gutachterunternehmen",
    audienceIcon: ClipboardCheck,
    message:
      "Führt Inspektionen, Gutachten und Prüfprotokolle revisionssicher in einer Plattform.",
    moduleId: "doku",
    image: "/mascots/fox-planung.webp",
    alt: "Gleistrix-Fuchs für Prüf-, Inspektions- und Gutachterunternehmen",
    inRotation: false,
    imageIsPlaceholder: true,
  },
  {
    id: "bahnlogistik",
    word: "Wartezeiten",
    audienceShort: "Bahnlogistik",
    audience: "Gleistrix für Bahnlogistik und Materialversorgung",
    audienceIcon: PackageCheck,
    message:
      "Steuert Materialflüsse, Lager und Auslieferung – synchron zur Bauplanung.",
    moduleId: "technik",
    image: "/mascots/fox-bauleitung.webp",
    alt: "Gleistrix-Fuchs für Bahnlogistik und Materialversorgung",
    inRotation: false,
    imageIsPlaceholder: true,
  },
  {
    id: "personaldienstleister",
    word: "Missgriffe",
    audienceShort: "Personaldienstleister",
    audience: "Gleistrix für Personaldienstleister der Bahnbranche",
    audienceIcon: Users,
    message:
      "Vermittelt Personal qualifikationsbasiert – mit passgenauem Match und Nachweisen.",
    moduleId: "plantafel",
    image: "/mascots/fox-sicherung.webp",
    alt: "Gleistrix-Fuchs für Personaldienstleister der Bahnbranche",
    inRotation: false,
    imageIsPlaceholder: true,
  },
  {
    id: "generalunternehmer",
    word: "Reibung",
    audienceShort: "Generalunternehmer",
    audience: "Gleistrix für Komplettanbieter und Generalunternehmer",
    audienceIcon: Landmark,
    message:
      "Führt Subunternehmer, Leistungsphasen und Kosten in einer Übersicht zusammen.",
    moduleId: "reports",
    image: "/mascots/fox-planung.webp",
    alt: "Gleistrix-Fuchs für Komplettanbieter und Generalunternehmer",
    inRotation: false,
    imageIsPlaceholder: true,
  },
];
