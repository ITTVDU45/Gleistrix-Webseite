import Link from "next/link";

import CardMedia from "@/components/media/CardMedia";
import MediaFrame from "@/components/media/MediaFrame";
import { SCENES } from "@/lib/placeholders";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata({
  title: "Disposition Software für Bahnbau & Gleisbau",
  description:
    "Disposition im Bahnbau digitalisieren: Personal, Schichten, Fahrzeuge, Technik und Projekte mit Gleistrix zentral planen und Verfügbarkeiten überblicken.",
  path: "/disposition-bahnbau",
});

export default function DispositionBahnbauPage(){return <main className="bg-white">
  <section className="page-container pb-12 pt-28 sm:pb-16 sm:pt-32 md:pb-24 md:pt-40">
    <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 sm:text-sm">Disposition Bahnbau</p>
    <h1 className="mt-4 max-w-4xl text-[2rem] font-bold leading-[1.1] tracking-tight text-slate-900 min-[375px]:text-[2.2rem] sm:mt-5 sm:text-5xl md:text-6xl">Disposition Software für Bahnbau: Personal, Fahrzeuge und Einsätze zentral planen</h1>
    <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">Mit Gleistrix koordinieren Bahndienstleister Projekte, Schichten, Mitarbeiter, Fahrzeuge und Technik in einer gemeinsamen Planung. Verfügbarkeiten und Überschneidungen werden dort sichtbar, wo disponiert wird.</p>
    <Link href="/demo-buchen" className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white sm:mt-8 sm:w-auto sm:text-base">Disposition live ansehen</Link>
    <MediaFrame src="/placeholders/seo-disposition.svg" alt="Plantafel mit Trupps, Fahrzeugen und Schichten" ratio="wide" priority caption="Personal, Fahrzeuge und Technik in einer Planung" sizes="(min-width: 768px) 1100px, 100vw" className="mt-10 sm:mt-12" />
  </section>
  <section className="bg-slate-50 py-12 sm:py-16 md:py-24"><div className="page-container"><h2 className="text-[1.75rem] font-bold leading-tight text-slate-900 sm:text-3xl">Von der Projektplanung bis zum Einsatz</h2><div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-3">{[["Ressourcen gemeinsam planen","Mitarbeiter, Fahrzeuge und Technik nicht in getrennten Listen, sondern direkt am Projekt disponieren."],["Qualifikationen berücksichtigen","Personalinformationen und Qualifikationsfristen stehen für die Einsatzplanung zur Verfügung."],["Änderungen transparent halten","Disposition und Team arbeiten mit einem aktuellen Planungsstand statt mit verschiedenen Dateiversionen."]].map(([h,p],index)=>{ const scene = SCENES[(index + 4) % SCENES.length]; return <article key={h} className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white"><CardMedia src={scene.src} alt={scene.alt} aspect="aspect-[3/2]" sizes="(min-width: 768px) 33vw, 100vw" /><div className="p-5 sm:p-6"><h3 className="font-bold text-slate-900">{h}</h3><p className="mt-3 leading-7 text-slate-600">{p}</p></div></article>; })}</div></div></section>
  <section className="page-container py-12 sm:py-16 md:py-24"><h2 className="text-[1.75rem] font-bold leading-tight text-slate-900 sm:text-3xl">Disposition speziell für projektbasierte Bahndienstleister</h2><p className="mt-4 max-w-3xl leading-7 text-slate-600 sm:mt-5">Bahnprojekte verbinden enge Zeitfenster mit wechselnden Ressourcen und Qualifikationsanforderungen. Eine zentrale Plantafel reduziert den Abstimmungsaufwand und schafft eine gemeinsame Grundlage für Einsatzplanung, Zeiterfassung und spätere Abrechnung.</p><p className="mt-5 max-w-3xl leading-7 text-slate-600 sm:mt-6">Mehr Details findest du unter <Link className="font-semibold text-indigo-700" href="/produkt/projektplanung-disposition">Projektplanung & Disposition</Link>, <Link className="font-semibold text-indigo-700" href="/produkt/kalender-einsatzuebersicht">Plantafel & Einsatzübersicht</Link> und <Link className="font-semibold text-indigo-700" href="/produkt">der ERP-Plattform im Überblick</Link>.</p><MediaFrame src="/placeholders/szene-nachtbaustelle.svg" alt="Nachtbaustelle während einer Sperrpause" ratio="banner" caption="Enge Zeitfenster, wechselnde Ressourcen – ein Planungsstand" sizes="(min-width: 768px) 1100px, 100vw" className="mt-10" /></section>
</main>}
