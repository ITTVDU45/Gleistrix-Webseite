export type SecurityBadge = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  /** "seal" = quadratisches Siegel, "wide" = liegendes Logo */
  shape: "seal" | "wide";
  caption: string;
};

export const SECURITY_BADGES: SecurityBadge[] = [
  {
    id: "hosting-de",
    src: "/badges/hosted-in-germany.png",
    alt: "Hetzner – Hosted in Germany",
    width: 556,
    height: 170,
    shape: "wide",
    caption: "Server ausschließlich in deutschen Rechenzentren",
  },
  {
    id: "iso-27001",
    src: "/badges/iso-27001.png",
    alt: "Hetzner – ISO/IEC 27001:2022 certified",
    width: 556,
    height: 170,
    shape: "wide",
    caption: "Zertifiziertes Informationssicherheits-Management",
  },
  {
    id: "dsgvo",
    src: "/badges/dsgvo.webp",
    alt: "100 % DSGVO-konform",
    width: 320,
    height: 320,
    shape: "seal",
    caption: "Auftragsverarbeitung und Löschkonzept inklusive",
  },
];

/**
 * Anbindung an bestehende Systeme. Einträge ohne `src` werden als Wortmarke
 * gesetzt – sobald eine Logodatei vorliegt, `src` samt `width`/`height`
 * ergänzen, dann rendert automatisch das Bild.
 */
export type Integration = {
  id: string;
  label: string;
  src?: string;
  width?: number;
  height?: number;
};

export const INTEGRATIONS: Integration[] = [
  { id: "gaeb", label: "GAEB" },
  { id: "deutsche-bahn", label: "Deutsche Bahn" },
  { id: "microsoft", label: "Microsoft 365", src: "/logos/microsoft-365.png", width: 500, height: 550 },
  { id: "datev", label: "DATEV", src: "/logos/datev.png", width: 500, height: 493 },
  { id: "lexoffice", label: "lexoffice" },
  { id: "sevdesk", label: "sevdesk", src: "/logos/sevdesk.svg", width: 400, height: 100 },
  { id: "agenda", label: "Agenda" },
  { id: "stripe", label: "Stripe", src: "/logos/stripe.png", width: 500, height: 209 },
  { id: "paypal", label: "PayPal" },
  { id: "indeed", label: "Indeed", src: "/logos/indeed.png", width: 1280, height: 345 },
  { id: "stepstone", label: "StepStone", src: "/logos/stepstone.png", width: 1920, height: 329 },
  { id: "cal-com", label: "Cal.com", src: "/logos/cal-com.png", width: 512, height: 512 },
  { id: "calendly", label: "Calendly", src: "/logos/calendly.png", width: 666, height: 375 },
  { id: "telegram", label: "Telegram", src: "/logos/telegram.png", width: 1280, height: 1280 },
];
