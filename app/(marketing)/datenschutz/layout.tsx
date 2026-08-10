import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata({
  title: "Datenschutz",
  description: "Datenschutzerklärung von Gleistrix mit Informationen zur Verarbeitung personenbezogener Daten und zu deinen Datenschutzrechten.",
  path: "/datenschutz",
});

export default function DatenschutzLayout({ children }: { children: ReactNode }) {
  return children;
}
