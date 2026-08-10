import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./mobile.css";
import AppChrome from "@/components/layout/AppChrome";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { SITE, SITE_URL } from "@/lib/constants";
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/seo";
import Providers from "./providers";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultTitle = `${SITE.name} – ERP-Software für Bahndienstleister`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: {
    google: "6HlbxFfA3vZBIREdh7cFGMPeFJgpXcy6S3JWDMmEUx4",
  },
  alternates: {
    canonical: "./",
  },
  title: {
    default: defaultTitle,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  creator: SITE.name,
  publisher: SITE.name,
  category: "Business Software",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    url: SITE_URL,
    siteName: SITE.name,
    title: defaultTitle,
    description: SITE.description,
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: SITE.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = [localBusinessJsonLd(), websiteJsonLd()];

  return (
    <html lang="de">
      <body className={`${inter.variable} ${geistMono.variable} antialiased overflow-x-hidden bg-background text-foreground`}>
        {structuredData.map((data) => (
          <script
            key={data["@id"]}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
        <Providers>
          <ConsentProvider>
            <AppChrome>{children}</AppChrome>
          </ConsentProvider>
        </Providers>
      </body>
    </html>
  );
}
