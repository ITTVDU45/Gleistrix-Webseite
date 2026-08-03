"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Der Adminbereich bringt seine eigene Navigation mit.
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const hideHeader = isAdmin || (pathname?.startsWith("/demo-buchen") ?? false);

  return (
    <>
      {!hideHeader && <SiteHeader />}
      {children}
      {!isAdmin && <SiteFooter />}
    </>
  );
}


