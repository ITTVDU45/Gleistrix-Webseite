"use client";

import { usePathname } from "next/navigation";
import { ConsentManager } from "@/components/consent/consent-manager";
import { DifyChat } from "@/components/consent/dify-chat";
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
      {/* Der Adminbereich ist ein angemeldeter Arbeitsplatz, kein
          Website-Besuch: dort setzt nur das Sitzungs-Cookie auf, das für den
          Betrieb erforderlich ist. Ein Einwilligungsbanner wäre dort ohne
          Gegenstand. */}
      {!isAdmin && <ConsentManager />}
      {!isAdmin && <DifyChat />}
    </>
  );
}


