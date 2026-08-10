import { SITE, SITE_URL } from "@/lib/constants";

/**
 * Strukturierte Daten für Google.
 *
 * Die Angaben sind bewusst dieselben wie im Impressum (app/(marketing)/
 * impressum/page.tsx) und im Google-Unternehmensprofil. Weichen sie
 * voneinander ab, wertet Google die Auszeichnung ab – bei Änderungen also
 * beide Stellen anfassen.
 */
const BUSINESS = {
  legalName: "Tolgahan Vardar",
  street: "Hauffstr. 55",
  postalCode: "47166",
  city: "Duisburg",
  country: "DE",
  email: "info@gleistrix.de",
  // E.164, weil Google nationale Schreibweisen nur raten kann.
  phone: "+491785428363",
} as const;

/**
 * Profile, die dasselbe Unternehmen belegen. Die URL des
 * Google-Unternehmensprofils gehört hierher, sobald sie vorliegt – sie ist die
 * Brücke zwischen Website und Karteneintrag.
 */
const SAME_AS: string[] = [];

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE.name,
    legalName: BUSINESS.legalName,
    description: SITE.description,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/gleistrix-email-logo.png`,
    image: `${SITE_URL}/brand/gleistrix-email-logo.png`,
    email: BUSINESS.email,
    telephone: BUSINESS.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.street,
      postalCode: BUSINESS.postalCode,
      addressLocality: BUSINESS.city,
      addressCountry: BUSINESS.country,
    },
    areaServed: { "@type": "Country", name: "Deutschland" },
    ...(SAME_AS.length > 0 ? { sameAs: SAME_AS } : {}),
  };
}

/** Website-Entität zur eindeutigen Zuordnung von Domain, Marke und Anbieter. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE.name,
    description: SITE.description,
    inLanguage: "de-DE",
    publisher: { "@id": `${SITE_URL}/#business` },
  };
}
