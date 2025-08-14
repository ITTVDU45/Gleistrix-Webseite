"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = pathname?.startsWith("/demo-buchen") ?? false;

  return (
    <>
      {!hideHeader && <SiteHeader />}
      {children}
      <SiteFooter />
    </>
  );
}


