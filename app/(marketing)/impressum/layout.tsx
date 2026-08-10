import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata({
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung von Gleistrix mit Kontakt- und Unternehmensangaben.",
  path: "/impressum",
});

export default function ImpressumLayout({ children }: { children: ReactNode }) {
  return children;
}
