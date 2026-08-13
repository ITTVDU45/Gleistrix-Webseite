import Link from "next/link";

import CardMedia from "@/components/media/CardMedia";
import MediaFrame from "@/components/media/MediaFrame";
import { SCENES } from "@/lib/placeholders";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata({
  title: "ERP Software für Bahnbau & Bahndienstleister",
  description:
    "ERP Software für Bahnbau, Gleisbau und Bahndienstleister: Projekte, Disposition, Personal, Fahrzeuge, Zeiterfassung, Nachweise und Abrechnung in Gleistrix.",
  path: "/erp-bahnbau",
});

const features = [
  ["Projektplanung & Disposition", "Aufträge, Sperrpausen, Personal, Fahrzeuge und Technik gemeinsam planen – mit transparenten Verfügbarkeiten."],
  ["Personal & Qualifikationen", "Qualifikationen, Tauglichkeiten, Abwesenheiten und Fristen zentral verwalten und bei der Einsatzplanung berücksichtigen."],
  ["Mobile Zeiterfassung", "Arbeitszeiten und Stundenzettel direkt am Einsatz erfassen, prüfen und dem richtigen Projekt zuordnen."],
  ["Dokumentation & Nachweise", "Projektunterlagen, Protokolle und Nachweise strukturiert an einem Ort ablegen und schnell wiederfinden."],
  ["Abrechnung & X-Rechnung", "Geprüfte Leistungen und Stunden ohne erneute Dateneingabe für Rechnungen und Buchhaltung weiterverwenden."],
  ["Controlling", "Auslastung, Projektstatus und Kosten auf Basis derselben Daten auswerten, mit denen das operative Team arbeitet."],
] as const;

export default function ErpBahnbauPage() {
  const faq = [
    ["Was ist ein ERP für den Bahnbau?", "Ein ERP bündelt zentrale Unternehmensprozesse wie Auftragsverwaltung, Projektplanung, Disposition, Personal, Zeiterfassung, Dokumentation und Abrechnung in einem System. Gleistrix richtet diese Abläufe speziell auf Bahndienstleister aus."],
    ["Für welche Unternehmen eignet sich Gleistrix?", "Gleistrix richtet sich unter anderem an Gleisbauunternehmen, Sicherungsunternehmen, Unternehmen der Gleisbausicherung und weitere auftragsbasierte Bahndienstleister."],
    ["Kann Gleistrix Qualifikationen bei der Planung berücksichtigen?", "Ja. Qualifikationen und deren Gültigkeit können zentral verwaltet und für die Einsatz- und Personalplanung genutzt werden."],
    ["Kann ich Gleistrix vorab ansehen?", "Ja. Über die Demo-Anfrage können Unternehmen die für ihre Abläufe relevanten Funktionen gemeinsam mit dem Gleistrix-Team ansehen."],
  ] as const;
  const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };

  return <main className="bg-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    <section className="page-container pb-12 pt-28 sm:pb-16 sm:pt-32 md:pb-24 md:pt-40">
      <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 sm:text-sm">ERP für Bahnbau & Bahndienstleister</p>
      <h1 className="mt-4 max-w-4xl text-[2rem] font-bold leading-[1.1] tracking-tight text-slate-900 min-[375px]:text-[2.2rem] sm:mt-5 sm:text-5xl md:text-6xl">ERP Software für Bahnbau: Projekte, Personal und Abrechnung in einem System</h1>
      <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">Gleistrix verbindet die operativen und kaufmännischen Abläufe von Bahndienstleistern. Statt Projektinformationen zwischen Excel, Kalender, Papier-Stundenzetteln und einzelnen Fachprogrammen zu verteilen, arbeiten Disposition, Baustelle und Verwaltung mit einem gemeinsamen Datenstand.</p>
      <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap"><Link href="/demo-buchen" className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white sm:w-auto sm:text-base">Demo anfragen</Link><Link href="/produkt" className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-slate-300 px-6 text-sm font-semibold text-slate-900 sm:w-auto sm:text-base">Module ansehen</Link></div>
      <MediaFrame src="/placeholders/seo-erp-bahnbau.svg" alt="Bahnprojekt mit Disposition, Personal und Abrechnung in einem System" ratio="wide" priority caption="Ein Datenstand für Disposition, Baustelle und Verwaltung" sizes="(min-width: 768px) 1100px, 100vw" className="mt-10 sm:mt-12" />
    </section>
    <section className="bg-slate-50 py-12 sm:py-16 md:py-24"><div className="page-container"><h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">ERP-Funktionen für den Arbeitsalltag im Bahnbau</h2><p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 sm:text-base">Gleistrix bildet Prozesse nicht isoliert ab. Informationen aus Auftrag und Planung werden für Einsatz, Nachweis, Zeiterfassung und Abrechnung weiterverwendet.</p><div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">{features.map(([title,text], index) => { const scene = SCENES[index % SCENES.length]; return <article key={title} className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white"><CardMedia src={scene.src} alt={scene.alt} aspect="aspect-[3/2]" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" /><div className="p-5 sm:p-6"><h3 className="font-bold text-slate-900">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></div></article>; })}</div></div></section>
    <section className="page-container py-12 sm:py-16 md:py-24"><div className="grid min-w-0 gap-9 sm:gap-12 lg:grid-cols-2"><div className="min-w-0"><h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">Warum branchenspezifisches ERP statt allgemeiner Insellösungen?</h2><p className="mt-4 leading-7 text-slate-600 sm:mt-5">Im Bahnumfeld hängen Personalqualifikation, Einsatzzeit, Technik, Nachweise und Abrechnung eng zusammen. Werden diese Informationen getrennt gepflegt, entstehen Medienbrüche und zusätzlicher Abstimmungsaufwand. Gleistrix führt die zusammengehörigen Daten entlang des Projekts.</p><p className="mt-4 leading-7 text-slate-600">Das macht die Plattform besonders für Unternehmen interessant, die viele wechselnde Einsätze, Schichten, Mitarbeiter und Nachweise koordinieren.</p><MediaFrame src="/placeholders/seo-prozesskette.svg" alt="Verbundene Prozesskette von der Planung bis zur Abrechnung" ratio="landscape" sizes="(min-width: 1024px) 45vw, 100vw" className="mt-8" /></div><div className="min-w-0"><h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">Für Bahndienstleister entwickelt</h2><p className="mt-4 leading-7 text-slate-600 sm:mt-5">Entdecke die Lösungen für <Link className="font-semibold text-indigo-700" href="/branchen/gleisbauunternehmen">Gleisbauunternehmen</Link>, <Link className="font-semibold text-indigo-700" href="/branchen/sicherungsunternehmen">Sicherungsunternehmen</Link> und <Link className="font-semibold text-indigo-700" href="/branchen/gleisbausicherung-bauueberwachung">Gleisbausicherung & Bauüberwachung</Link>. Für einzelne Prozesse gibt es außerdem Detailseiten zu <Link className="font-semibold text-indigo-700" href="/produkt/projektplanung-disposition">Projektplanung & Disposition</Link> und <Link className="font-semibold text-indigo-700" href="/produkt/zeiterfassung-stundenzettel">Zeiterfassung & Stundenzetteln</Link>.</p></div></div></section>
    <section className="bg-slate-50 py-12 sm:py-16"><div className="page-container max-w-4xl"><h2 className="text-[1.75rem] font-bold leading-tight text-slate-900 sm:text-3xl">Häufige Fragen zu ERP im Bahnbau</h2><div className="mt-6 space-y-5 sm:mt-8">{faq.map(([q,a]) => <article key={q} className="min-w-0"><h3 className="font-bold text-slate-900">{q}</h3><p className="mt-2 leading-7 text-slate-600">{a}</p></article>)}</div></div></section>
  </main>;
}
