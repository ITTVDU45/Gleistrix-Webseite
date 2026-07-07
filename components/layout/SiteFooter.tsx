import Image from "next/image";
import Link from "next/link";

const MODULE_LINKS = [
  { href: "/produkt/projektplanung-disposition", label: "Projektmanagement" },
  { href: "/produkt/kalender-einsatzuebersicht", label: "Plantafel & Einsatzplanung" },
  { href: "/produkt/mitarbeiterverwaltung", label: "Mitarbeiter & Fahrzeuge" },
  { href: "/produkt/dokumentenmanagement", label: "Dokumentenmanagement" },
  { href: "/produkt/rechnungsstellung", label: "Abrechnung" },
  { href: "/#ki-agenten", label: "KI-Agenten" },
] as const;

const COMPANY_LINKS = [
  { href: "/produkt", label: "Plattform" },
  { href: "/branchen", label: "Branchen" },
  { href: "/preise", label: "Preise" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/demo-buchen", label: "Demo anfragen" },
] as const;

const LEGAL_LINKS = [
  { href: "/#impressum", label: "Impressum" },
  { href: "/#datenschutz", label: "Datenschutz" },
] as const;

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-900/8 bg-white">
      <div className="page-container grid gap-10 py-14 text-sm md:grid-cols-12">
        {/* Marke */}
        <div className="md:col-span-5">
          <Link href="/" className="inline-flex items-center" aria-label="Gleistrix Startseite">
            <Image
              src="/Gleistrix Logo (500 x 300 px).png"
              alt="Gleistrix Logo"
              width={500}
              height={300}
              className="h-12 w-auto"
            />
          </Link>
          <p className="mt-4 max-w-[46ch] leading-relaxed text-slate-500">
            Gleistrix bündelt Projektmanagement, Einsatzplanung, Dokumente, Lager, Abrechnung
            und KI-Agenten in einer zentralen SaaS-Lösung für Bahndienstleister.
          </p>
        </div>

        {/* Module */}
        <nav aria-label="Module" className="md:col-span-3">
          <h4 className="mb-3 font-semibold text-slate-900">Module</h4>
          <ul className="space-y-2">
            {MODULE_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-slate-500 transition-colors hover:text-indigo-600">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Unternehmen */}
        <nav aria-label="Unternehmen" className="md:col-span-2">
          <h4 className="mb-3 font-semibold text-slate-900">Unternehmen</h4>
          <ul className="space-y-2">
            {COMPANY_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-slate-500 transition-colors hover:text-indigo-600">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Rechtliches */}
        <nav aria-label="Rechtliches" className="md:col-span-2">
          <h4 className="mb-3 font-semibold text-slate-900">Rechtliches</h4>
          <ul className="space-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-slate-500 transition-colors hover:text-indigo-600">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-slate-900/8">
        <div className="page-container flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Gleistrix. Alle Rechte vorbehalten.</p>
          <p>Die ERP-Plattform für den Bahn- und Infrastrukturbereich.</p>
        </div>
      </div>
    </footer>
  );
}
