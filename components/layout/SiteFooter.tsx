"use client";
import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-white/10 bg-gradient-to-b from-gray-900 to-slate-900 text-white">
      <div className="page-container py-12 grid gap-8 md:grid-cols-12 text-sm text-white/90">
        {/* Brand */}
        <div className="md:col-span-5">
          <Link href="/" className="flex items-center gap-2" aria-label="Gleistrix Home">
            <Image
              src="/Gleistrix Logo (500 x 300 px).png"
              alt="Gleistrix Logo"
              width={500}
              height={300}
              className="h-14 md:h-16 w-auto"
            />
          </Link>
          <p className="mt-4 text-white/70 max-w-[46ch]">
            Gleistrix ist die zentrale Planungs- und Zeiterfassungsplattform für Bahndienstleister –
            effizient, sicher und skalierbar.
          </p>
          <p className="mt-6 text-white/60">© {new Date().getFullYear()} Gleistrix</p>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3">
          <h4 className="font-semibold mb-3 text-white">Quicklinks</h4>
          <ul className="space-y-2">
            <li><Link href="/produkt" className="text-white/80 hover:text-white hover:underline">Produkt</Link></li>
            <li><Link href="/#loesungen" className="text-white/80 hover:text-white hover:underline">Unsere Lösungen</Link></li>
            <li><Link href="/#vorteile" className="text-white/80 hover:text-white hover:underline">Vorteile</Link></li>
            <li><Link href="/#einsatzmoeglichkeiten" className="text-white/80 hover:text-white hover:underline">Einsatzmöglichkeiten</Link></li>
            <li><Link href="/#zielgruppe" className="text-white/80 hover:text-white hover:underline">Zielgruppen</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="md:col-span-2">
          <h4 className="font-semibold mb-3 text-white">Ressourcen</h4>
          <ul className="space-y-2">
            <li><Link href="/demo-buchen" className="text-white/80 hover:text-white hover:underline">Demo anfragen</Link></li>
          </ul>
        </div>

        {/* Legal + CTA */}
        <div className="md:col-span-2">
          <h4 className="font-semibold mb-3 text-white">Rechtliches</h4>
          <ul className="space-y-2">
            <li><Link href="/#impressum" className="text-white/80 hover:text-white hover:underline">Impressum</Link></li>
            <li><Link href="/#datenschutz" className="text-white/80 hover:text-white hover:underline">Datenschutz</Link></li>
          </ul>
          <div className="mt-6">
            <Link href="/demo-buchen" className="inline-flex items-center rounded-md bg-gradient-to-tr from-yellow-400 via-yellow-500 to-orange-400 text-black px-4 py-2 text-sm font-medium hover:brightness-105">
              Kostenlose Demo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


