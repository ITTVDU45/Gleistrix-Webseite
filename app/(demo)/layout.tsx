import type { Metadata } from "next";
import "../globals.css";
import Providers from "../providers";

export const metadata: Metadata = {
  title: "Demo buchen | Gleistrix",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  // Custom layout without SiteHeader/SiteFooter
  return (
    <>{children}</>
  );
}


