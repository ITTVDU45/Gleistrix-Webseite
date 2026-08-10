import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata({
  title: "Bahnbau Ratgeber: Disposition, Zeiterfassung & Abrechnung",
  description:
    "Praxiswissen für Bahndienstleister zu Disposition, Sicherung, Zeiterfassung, Fuhrpark, Nachweisen, Projektsteuerung und Abrechnung im Bahnbau.",
  path: "/blog",
});

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}
