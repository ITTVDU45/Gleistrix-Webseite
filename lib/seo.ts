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

/**
 * Das Unternehmen als Anbieter der Software.
 *
 * Die einzige Unternehmensentität der Website. `address` ist die Anschrift aus
 * dem Impressum, nicht die Angabe eines Ladenlokals; das Einsatzgebiet steht in
 * `areaServed`. Siehe den Hinweis weiter unten, warum hier kein LocalBusiness
 * mehr ausgeliefert wird.
 *
 * `sameAs` bleibt leer, bis die Profil-URLs vorliegen – ein erfundener Link
 * wäre eine falsche Identitätsangabe.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE.name,
    legalName: BUSINESS.legalName,
    description: SITE.description,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/gleistrix-email-logo.png`,
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

/**
 * Die Software selbst.
 *
 * `offers` wird nur gesetzt, wenn ein Preis übergeben wird – ein Angebot ohne
 * Preis ist für Google wertlos, und ein geratener Preis wäre schlimmer als
 * keiner. Den Wert liefert die Preisseite aus derselben Konfiguration, die sie
 * auch anzeigt.
 */
export function softwareApplicationJsonLd(options?: { lowPrice?: number }) {
  const lowPrice = options?.lowPrice;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: SITE.name,
    description: SITE.description,
    url: SITE_URL,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "ERP",
    // Reine Webanwendung: kein Betriebssystem, sondern ein Browser.
    operatingSystem: "Web",
    inLanguage: "de-DE",
    provider: { "@id": `${SITE_URL}/#organization` },
    ...(typeof lowPrice === "number"
      ? {
          offers: {
            "@type": "Offer",
            price: lowPrice,
            priceCurrency: "EUR",
            url: `${SITE_URL}/preise`,
            // Monatlicher Grundpreis. Die Gesamtsumme hängt von Nutzern,
            // Projektvolumen und Modulen ab und steht auf /preise.
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: lowPrice,
              priceCurrency: "EUR",
              unitCode: "MON",
            },
          },
        }
      : {}),
  };
}

/*
 * Kein LocalBusiness mehr.
 *
 * Der Typ beschreibt einen Betrieb, den Kunden aufsuchen, und verlangt dafür
 * eine Adresse als Standortangabe. Das Google-Unternehmensprofil von Gleistrix
 * ist aber bewusst ohne Adresse geführt, weil bundesweit gearbeitet wird – ein
 * LocalBusiness mit Straßenanschrift hätte etwas anderes behauptet als das
 * Profil, und abweichende Angaben wertet Google ab.
 *
 * Die Anschrift steht weiterhin in der Organization: Dort ist sie die Adresse
 * des Unternehmens, wie sie auch im Impressum steht, und kein Versprechen einer
 * Ladentheke. Das Einsatzgebiet trägt `areaServed`.
 *
 * Sollte später ein Standort dazukommen, den Kunden tatsächlich besuchen, gehört
 * LocalBusiness zurück – dann aber mit einem Profil, das dieselbe Adresse zeigt.
 */

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
    // Herausgeber ist das Unternehmen, nicht der Standort.
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
