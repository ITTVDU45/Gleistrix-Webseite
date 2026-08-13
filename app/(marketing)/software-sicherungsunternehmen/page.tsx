import Link from "next/link";

import CardMedia from "@/components/media/CardMedia";
import MediaFrame from "@/components/media/MediaFrame";
import { SCENES } from "@/lib/placeholders";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata({
  title: "Software für Sicherungsunternehmen & Gleisbausicherung",
  description:
    "Software für Sicherungsunternehmen: qualifikationsbasierte Disposition, Schichtplanung, Zeiterfassung, Nachweise und Abrechnung für die Gleisbausicherung.",
  path: "/software-sicherungsunternehmen",
});

export default function SoftwareSicherungsunternehmenPage() {
  return <main className="bg-white">
    <section className="page-container pb-12 pt-28 sm:pb-16 sm:pt-32 md:pb-24 md:pt-40">
      <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 sm:text-sm">Software für Sicherungsunternehmen</p>
      <h1 className="mt-4 max-w-4xl text-[2rem] font-bold leading-[1.1] tracking-tight text-slate-900 min-[375px]:text-[2.2rem] sm:mt-5 sm:text-5xl md:text-6xl">Sicherungsunternehmen digital planen: Qualifikationen, Schichten und Nachweise verbinden</h1>
      <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">Gleistrix unterstützt Sicherungsunternehmen und die Gleisbausicherung dabei, Personal qualifikationsgerecht zu disponieren, Schichten zu koordinieren, Zeiten mobil zu erfassen und Nachweise projektbezogen bereitzuhalten.</p>
      <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap"><Link href="/demo-buchen" className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white sm:w-auto sm:text-base">Demo anfragen</Link><Link href="/branchen/sicherungsunternehmen" className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-slate-300 px-6 text-sm font-semibold sm:w-auto sm:text-base">Branchenlösung</Link></div>
      <MediaFrame src="/placeholders/seo-sicherungsunternehmen.svg" alt="Sicherungsposten im Einsatz an einer Bahnstrecke" ratio="wide" priority caption="Qualifikation, Schicht und Nachweis gehören zusammen" sizes="(min-width: 768px) 1100px, 100vw" className="mt-10 sm:mt-12" />
    </section>
    <section className="bg-slate-50 py-12 sm:py-16 md:py-24"><div className="page-container grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">{[["Qualifikationsbasierte Disposition","Personal nach Qualifikation, Gültigkeit und Verfügbarkeit für Einsätze planen."],["Schicht- & Einsatzplanung","Nacht-, Wochenend- und wechselnde Einsätze in einer gemeinsamen Plantafel koordinieren."],["Digitale Stundenzettel","Zeiten mobil erfassen, prüfen und dem jeweiligen Projekt zuordnen."],["Nachweise & Dokumente","Qualifikationen, Projektunterlagen und Einsatznachweise strukturiert bereithalten."],["Fahrzeuge & Technik","Verfügbarkeiten, Prüffristen und Zuordnungen von Fahrzeugen und Geräten mitplanen."],["Abrechnung","Geprüfte Stunden und Leistungen für die weitere Abrechnung nutzen."]].map(([h,p],index)=>{ const scene = SCENES[(index + 1) % SCENES.length]; return <article key={h} className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white"><CardMedia src={scene.src} alt={scene.alt} aspect="aspect-[3/2]" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" /><div className="p-5 sm:p-6"><h2 className="text-lg font-bold text-slate-900 sm:text-xl">{h}</h2><p className="mt-3 leading-7 text-slate-600">{p}</p></div></article>; })}</div></section>
    <section className="page-container py-12 sm:py-16 md:py-24"><h2 className="max-w-3xl text-[1.75rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">Weniger Medienbrüche zwischen Disposition, Einsatz und Verwaltung</h2><p className="mt-4 max-w-3xl leading-7 text-slate-600 sm:mt-5">Wenn Qualifikationen in einer Tabelle, Schichten im Kalender und Stundenzettel auf Papier liegen, muss dieselbe Information mehrfach geprüft und übertragen werden. Gleistrix verbindet diese Prozessschritte. Änderungen in der Planung und freigegebene Einsatzdaten stehen dadurch dort zur Verfügung, wo sie im nächsten Arbeitsschritt gebraucht werden.</p><div className="mt-6 flex flex-col gap-3 font-semibold text-indigo-700 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3"><Link href="/produkt/mitarbeiterverwaltung">Qualifikationen verwalten →</Link><Link href="/produkt/kalender-einsatzuebersicht">Plantafel ansehen →</Link><Link href="/produkt/zeiterfassung-stundenzettel">Zeiterfassung ansehen →</Link></div><MediaFrame src="/placeholders/szene-truppbesprechung.svg" alt="Truppbesprechung vor Schichtbeginn" ratio="banner" caption="Von der Disposition bis zur Verwaltung derselbe Stand" sizes="(min-width: 768px) 1100px, 100vw" className="mt-10" /></section>
  </main>;
}
