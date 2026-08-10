import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata({
  title: "Über Gleistrix – ERP aus der Praxis des Bahnbaus",
  description:
    "Gleistrix entwickelt ERP-Software für Bahndienstleister. Erfahre mehr über Entstehung, Mission, Technologie und die Menschen hinter der Plattform.",
  path: "/ueber-uns",
});

export default function UeberUnsLayout({ children }: { children: ReactNode }) {
  return children;
}
