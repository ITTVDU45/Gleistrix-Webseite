import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/layout/AppChrome";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { SITE, SITE_URL } from "@/lib/constants";
import { localBusinessJsonLd } from "@/lib/seo";
import Providers from "./providers";

const inter = Inter({
  // map Inter to the variable expected by globals.css
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Basis für alle relativen URLs in den Metadaten – ohne sie bleiben
  // canonical- und Open-Graph-Links relativ und damit für Google wertlos.
  metadataBase: new URL(SITE_URL),
  alternates: {
    // "./" löst Next je Route zur aktuellen Adresse auf. Unterseiten mit
    // eigener generateMetadata überschreiben das bei Bedarf.
    canonical: "./",
  },
  title: {
    default: `${SITE.name} – Die moderne ERP-Plattform für Bahndienstleister`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    url: SITE_URL,
    siteName: SITE.name,
    title: `${SITE.name} – Die moderne ERP-Plattform für Bahndienstleister`,
    description: SITE.description,
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      {/* Der Chat-Assistent lag hier als fest eingebundenes Fremdskript und
          lud bei jedem Seitenaufruf ungefragt. Er wohnt jetzt in
          components/consent/dify-chat.tsx und startet erst nach einer
          Einwilligung in die Kategorie "Funktional" (§ 25 Abs. 1 TDDDG). */}
      <body className={`${inter.variable} ${geistMono.variable} antialiased overflow-x-hidden bg-background text-foreground`}>
        {/* Auszeichnung des Unternehmens für Google. Steht im Root-Layout und
            damit auf jeder Seite – die feste @id sorgt dafür, dass Google das
            als ein Unternehmen versteht und nicht als eines je Seite. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
        <Providers>
          {/* Umschließt den gesamten Seitenrahmen: Banner, Footer-Zugang und
              die Gates für Drittinhalte lesen denselben Zustand. */}
          <ConsentProvider>
            <AppChrome>{children}</AppChrome>
          </ConsentProvider>
        </Providers>
      </body>
    </html>
  );
}
