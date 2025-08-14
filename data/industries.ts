import type React from "react";
import { ShieldCheck, HardHat, Briefcase, Building2, Network } from "lucide-react";

export type Industry = {
  id: string;
  title: string;
  blurb: string;
  bullets: string[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  image: string;
};

export const INDUSTRIES: Industry[] = [
  {
    id: "gleisbausicherung-bauueberwachung",
    title: "Gleisbausicherung & Bauüberwachung",
    blurb:
      "Gleistrix ist aus der Gleisbausicherung entstanden – hier spielt die Plattform ihre Stärken am deutlichsten aus.",
    bullets: [
      "Qualifikationsbasierte Schichtplanung, Abrechnung und Vergütung",
      "Vereinfachte Auftragsverwaltung, Dienstplanvermittlung und Disposition",
      "Angebotserstellung auch im GAEB-Format",
      "Digitale Stundenzettel, Nachweise und Dokumente",
      "Dashboard mit allen wichtigen Kennzahlen",
      "Integrierte Kommunikation",
    ],
    icon: ShieldCheck,
    image: "/Sicherungspersonal%20gleis.png",
  },
  {
    id: "auftragsbasierte-dienstleister",
    title: "Auftragsbasierte Dienstleister",
    blurb:
      "Von der Anfrage bis zur Abrechnung: Angebot → Auftrag → Schichtplanung → Zeiterfassung → Stundenzettel → Abrechnung.",
    bullets: [
      "Flexible Auftragsverwaltung",
      "Integrierte Angebotserstellung",
      "Einsatzplanung und -steuerung",
      "Automatisierte Lohnabrechnung",
      "Effiziente Rechnungsstellung",
    ],
    icon: Briefcase,
    image: "/Auftragsbasierter dienstleister.png",
  },
  {
    id: "sicherungsunternehmen",
    title: "Sicherungsunternehmen",
    blurb:
      "Einsätze qualifikations- und regelbasiert planen – mit lückenloser Doku und Nachweisen.",
    bullets: [
      "Planung nach Qualifikationen (z. B. SiPo, SaKra, HIB)",
      "Lückenlose Dokumentation inkl. Nachweisen/Signaturen",
      "Mobile Zeiterfassung & prüffähige Stundenzettel",
      "Standardisierte Exporte & optionale Schnittstellen",
      "X-Rechnung & Compliance-Unterstützung",
    ],
    icon: Network,
    image: "/Sicherungsunternehmen.png",
  },
  {
    id: "gleisbauunternehmen",
    title: "Gleisbauunternehmen",
    blurb:
      "Baustellen im Griff: Ressourcen, Sperrpausen, Geräte und Kosten transparent steuern.",
    bullets: [
      "Baustellen- & Sperrpausenplanung",
      "Geräte- & Fahrzeugdisposition (z. B. Zweiwege-Technik)",
      "Leistungsnachweise & Abrechnung nach LV/GAEB",
      "Sicherheits- & Qualifikationsmanagement",
      "Projekt- & Kostencontrolling (Reports)",
    ],
    icon: HardHat,
    image: "/Gleisbauunternehmen.png",
  },
  {
    id: "subunternehmen-db",
    title: "Subunternehmen der DB",
    blurb:
      "Daten sauber liefern, Anforderungen erfüllen – mit strukturierten Nachweisen und Exporten.",
    bullets: [
      "Standardisierte Exporte & individuelle Schnittstellen",
      "Qualifikations- und Dokumentennachweise",
      "Leistungs- & Stundenrückmeldungen",
      "X-Rechnung & revisionssichere Ablage",
      "Transparente Status- und Freigabeprozesse",
    ],
    icon: Building2,
    image: "/subunternehmer.png",
  },
];


