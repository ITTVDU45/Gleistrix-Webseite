import {
  BadgeCheck,
  Bot,
  Boxes,
  Building2,
  CalendarClock,
  ChartNoAxesCombined,
  Copy,
  FileArchive,
  Network,
  PanelsTopLeft,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Truck,
  Umbrella,
  Warehouse,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/**
 * Kuratierte Icon-Auswahl für Module.
 *
 * Lucide-Komponenten lassen sich nicht in JSON speichern, deshalb hält der
 * Store nur den Schlüssel und diese Registry löst ihn auf. Der Adminbereich
 * bietet ausschließlich diese Schlüssel an – so kann keine Konfiguration
 * entstehen, die im Frontend kein Icon findet.
 */
export const MODULE_ICONS: Record<string, { label: string; icon: LucideIcon }> = {
  boxes: { label: "Material", icon: Boxes },
  umbrella: { label: "Abwesenheit", icon: Umbrella },
  truck: { label: "Fahrzeug", icon: Truck },
  "badge-check": { label: "Qualifikation", icon: BadgeCheck },
  "file-archive": { label: "Dokumente", icon: FileArchive },
  building: { label: "Auftraggeber", icon: Building2 },
  network: { label: "Netzwerk", icon: Network },
  "calendar-clock": { label: "Termine", icon: CalendarClock },
  copy: { label: "Vorlagen", icon: Copy },
  board: { label: "Einsatztafel", icon: PanelsTopLeft },
  receipt: { label: "Abrechnung", icon: ReceiptText },
  warehouse: { label: "Lager", icon: Warehouse },
  chart: { label: "Finanzen", icon: ChartNoAxesCombined },
  bot: { label: "KI", icon: Bot },
  workflow: { label: "Workflow", icon: Workflow },
  shield: { label: "Sicherheit", icon: ShieldCheck },
  sparkles: { label: "Allgemein", icon: Sparkles },
};

export const ICON_KEYS = Object.keys(MODULE_ICONS);

export const FALLBACK_ICON_KEY = "sparkles";

export function isIconKey(value: string): boolean {
  return value in MODULE_ICONS;
}

/** Nie undefined – ein unbekannter Schlüssel fällt sichtbar auf das Sparkles-Icon zurück. */
export function moduleIcon(iconKey: string): LucideIcon {
  return MODULE_ICONS[iconKey]?.icon ?? MODULE_ICONS[FALLBACK_ICON_KEY].icon;
}
