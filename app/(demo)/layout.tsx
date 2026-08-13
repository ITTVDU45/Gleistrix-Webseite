import "../globals.css";
import Providers from "../providers";
import { pageMetadata } from "@/lib/seo-metadata";

// Ohne Marke im Titel: das Template im Root-Layout hängt "| Gleistrix"
// bereits an, sonst steht sie doppelt im Suchergebnis.
export const metadata = pageMetadata({
  title: "Demo buchen",
  description:
    "14 Tage Gleistrix testen: Termin auswählen, kurz die eigenen Abläufe schildern – danach steht die ERP-Plattform für Bahndienstleister zum Ausprobieren bereit.",
  path: "/demo-buchen",
});

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  // Custom layout without SiteHeader/SiteFooter
  return (
    <>{children}</>
  );
}


