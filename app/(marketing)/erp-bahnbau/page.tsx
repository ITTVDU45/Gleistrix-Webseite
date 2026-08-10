import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ERP Software für Bahnbau & Bahndienstleister",
  description: "ERP Software für Bahnbau, Gleisbau und Bahndienstleister: Projekte, Disposition, Personal, Fahrzeuge, Zeiterfassung, Nachweise und Abrechnung in Gleistrix.",
  alternates: { canonical: "/erp-bahnbau" },
  openGraph: { title: "ERP Software für Bahnbau | Gleistrix", description: "Die ERP-Plattform für Bahnbau und Bahndienstleister – von der Disposition bis zur Abrechnung.", url: "/erp-bahnbau", type: "website" },
};

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
    <section className="page-container pb-16 pt-32 md:pb-24 md:pt-40">
      <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">ERP für Bahnbau & Bahndienstleister</p>
      <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">ERP Software für Bahnbau: Projekte, Personal und Abrechnung in einem System</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">Gleistrix verbindet die operativen und kaufmännischen Abläufe von Bahndienstleistern. Statt Projektinformationen zwischen Excel, Kalender, Papier-Stundenzetteln und einzelnen Fachprogrammen zu verteilen, arbeiten Disposition, Baustelle und Verwaltung mit einem gemeinsamen Datenstand.</p>
      <div className="mt-8 flex flex-wrap gap-3"><Link href="/demo-buchen" className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white">Demo anfragen</Link><Link href="/produkt" className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-900">Module ansehen</Link></div>
    </section>
    <section className="bg-slate-50 py-16 md:py-24"><div className="page-container"><h2 className="text-3xl font-bold tracking-tight text-slate-900">ERP-Funktionen für den Arbeitsalltag im Bahnbau</h2><p className="mt-4 max-w-3xl leading-7 text-slate-600">Gleistrix bildet Prozesse nicht isoliert ab. Informationen aus Auftrag und Planung werden für Einsatz, Nachweis, Zeiterfassung und Abrechnung weiterverwendet.</p><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{features.map(([title,text]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="font-bold text-slate-900">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></article>)}</div></div></section>
    <section className="page-container py-16 md:py-24"><div className="grid gap-12 lg:grid-cols-2"><div><h2 className="text-3xl font-bold tracking-tight text-slate-900">Warum branchenspezifisches ERP statt allgemeiner Insellösungen?</h2><p className="mt-5 leading-7 text-slate-600">Im Bahnumfeld hängen Personalqualifikation, Einsatzzeit, Technik, Nachweise und Abrechnung eng zusammen. Werden diese Informationen getrennt gepflegt, entstehen Medienbrüche und zusätzlicher Abstimmungsaufwand. Gleistrix führt die zusammengehörigen Daten entlang des Projekts.</p><p className="mt-4 leading-7 text-slate-600">Das macht die Plattform besonders für Unternehmen interessant, die viele wechselnde Einsätze, Schichten, Mitarbeiter und Nachweise koordinieren.</p></div><div><h2 className="text-3xl font-bold tracking-tight text-slate-900">Für Bahndienstleister entwickelt</h2><p className="mt-5 leading-7 text-slate-600">Entdecke die Lösungen für <Link className="font-semibold text-indigo-700" href="/branchen/gleisbauunternehmen">Gleisbauunternehmen</Link>, <Link className="font-semibold text-indigo-700" href="/branchen/sicherungsunternehmen">Sicherungsunternehmen</Link> und <Link className="font-semibold text-indigo-700" href="/branchen/gleisbausicherung-bauueberwachung">Gleisbausicherung & Bauüberwachung</Link>. Für einzelne Prozesse gibt es außerdem Detailseiten zu <Link className="font-semibold text-indigo-700" href="/produkt/projektplanung-disposition">Projektplanung & Disposition</Link> und <Link className="font-semibold text-indigo-700" href="/produkt/zeiterfassung-stundenzettel">Zeiterfassung & Stundenzetteln</Link>.</p></div></div></section>
    <section className="bg-slate-50 py-16"><div className="page-container max-w-4xl"><h2 className="text-3xl font-bold text-slate-900">Häufige Fragen zu ERP im Bahnbau</h2><div className="mt-8 space-y-5">{faq.map(([q,a]) => <article key={q}><h3 className="font-bold text-slate-900">{q}</h3><p className="mt-2 leading-7 text-slate-600">{a}</p></article>)}</div></div></section>
  </main>;
}
