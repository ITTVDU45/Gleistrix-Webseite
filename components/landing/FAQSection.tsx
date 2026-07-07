"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type FAQ = {
  question: string;
  answer: string;
};

const FAQS: FAQ[] = [
  {
    question: "Für wen ist Gleistrix geeignet?",
    answer:
      "Gleistrix richtet sich an Bahndienstleister jeder Größe: Sicherungsunternehmen (SIPO), Gleisbauunternehmen, Subunternehmer und Dienstleister rund um Bahninfrastruktur. Vom Zwei-Mann-Betrieb bis zum Unternehmen mit mehreren Standorten.",
  },
  {
    question: "Welche Module sind enthalten?",
    answer:
      "Projektmanagement, Plantafel & Einsatzplanung, Mitarbeiter- und Fahrzeugverwaltung, Dokumentenmanagement, Lagerverwaltung sowie Abrechnung mit vorbereitender Buchhaltung. KI-Agenten lassen sich optional zuschalten.",
  },
  {
    question: "Können bestehende Prozesse abgebildet werden?",
    answer:
      "Ja. Gleistrix wird auf deine Abläufe eingerichtet – von der Schichtplanung über Freigabeprozesse bis zu Abrechnungszyklen. In der Demo schauen wir uns deine konkreten Prozesse gemeinsam an.",
  },
  {
    question: "Gibt es Rollen und Berechtigungen?",
    answer:
      "Ja. Jede Rolle – Disposition, Projektleitung, Monteur, Backoffice, Geschäftsführung – sieht genau die Daten und Funktionen, die sie braucht. Berechtigungen sind pro Modul und Projekt steuerbar.",
  },
  {
    question: "Können Dokumente und Abrechnungen verwaltet werden?",
    answer:
      "Ja. Dokumente liegen revisionssicher in der Projektakte, mit Versionen und Freigaben. Erfasste Leistungen und Stunden fließen direkt in Rechnungsentwürfe – inklusive sauberer Übergabe an die Buchhaltung.",
  },
  {
    question: "Sind KI-Agenten optional?",
    answer:
      "Ja, vollständig. Alle KI-Agenten – vom LV-Agenten bis zum Abrechnungsagenten – lassen sich pro Unternehmen aktivieren oder deaktivieren. Gleistrix funktioniert auch komplett ohne KI-Funktionen.",
  },
];

function FAQItem({ faq, isOpen, onToggle, panelId }: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
  panelId: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-900/8 bg-white shadow-soft-sm transition-shadow hover:shadow-soft">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-sm font-semibold text-slate-900 sm:text-base">{faq.question}</span>
        <ChevronDown
          aria-hidden
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-500" : ""}`}
        />
      </button>
      <div
        id={panelId}
        role="region"
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-relaxed text-slate-500">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-heading" className="bg-white py-20 md:py-28">
      <div className="page-container">
        <SectionHeading
          eyebrow="FAQ"
          title={<span id="faq-heading">Häufige Fragen</span>}
          description="Alles Wichtige rund um Einführung, Module und den Betrieb von Gleistrix."
        />

        <Reveal delay={0.08} className="mx-auto mt-12 max-w-3xl space-y-3 md:mt-14">
          {FAQS.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              panelId={`faq-panel-${index}`}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
