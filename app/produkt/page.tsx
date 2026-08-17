import Image from "next/image";
import Link from "next/link";
import { BENEFITS } from "@/app/produkt/benefits";
import BenefitsSlider from "@/components/sections/BenefitsSlider";
import FeaturesAccordion from "@/components/sections/FeaturesAccordion";
import PageHero from "@/components/landing/PageHero";
import ScreensGallery from "@/components/landing/ScreensGallery";
import SectionHeading from "@/components/landing/SectionHeading";
import Reveal from "@/components/landing/Reveal";
import MediaFrame from "@/components/media/MediaFrame";
import CTASection from "@/components/sections/CTASection";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata({
  title: "ERP Plattform für Bahnbau: Planung, Zeiterfassung & Abrechnung",
  description:
    "Gleistrix bündelt Projektmanagement, Disposition, Mitarbeiter, Fahrzeuge, Zeiterfassung, Dokumente, Reports und Rechnungsstellung für Bahndienstleister.",
  path: "/produkt",
});

export default function ProduktPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Plattform"
        title={
          <>
            Das All-in-One-ERP für <span className="text-gradient-accent">sichere Bahnprojekte</span>
          </>
        }
        description="Von Angebots- und Projektmanagement bis Disposition, Stundenzettel, Lohn und X-Rechnung – effizient, transparent und prüffähig."
        breadcrumbs={[{ label: "Startseite", href: "/" }, { label: "Plattform" }]}
        ctas={[
          { label: "Demo anfragen", href: "/demo-buchen" },
          { label: "Funktionen ansehen", href: "#features", variant: "outline" },
        ]}
      >
        <Reveal>
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-slate-900/8 bg-[#f8fafc] shadow-soft">
            <Image
              src="/standortbezogene-disposition.webp"
              alt="Gleistrix Standortbezogene Disposition"
              fill
              sizes="(min-width: 768px) 960px, 100vw"
              className="object-contain p-6"
              priority
            />
          </div>
        </Reveal>
      </PageHero>

      <section id="features" className="scroll-mt-24 bg-[#f8fafc] py-16 md:py-24">
        <div className="page-container">
          <SectionHeading
            eyebrow="Funktionen"
            title="Alles, was du brauchst – in einem System"
            description="Acht Kernbereiche, die nahtlos ineinandergreifen. Klick dich durch die Module."
          />
          <div className="mt-12 md:mt-16"><FeaturesAccordion /></div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="page-container">
          <SectionHeading
            eyebrow="Vorteile"
            title="Warum Teams Gleistrix in Produktion einsetzen"
            description="Weniger Abstimmung, mehr Output – Gleistrix zahlt sich im Tagesgeschäft aus."
          />
          {/* Der Slider zeigt nur Text; ein Motiv davor verankert die Vorteile
              im Baustellenalltag, statt sie als Behauptung stehen zu lassen. */}
          <MediaFrame
            src="/placeholders/szene-bauleitung-tablet.svg"
            alt="Bauleitung mit Tablet auf der Baustelle"
            ratio="banner"
            caption="Dieselben Daten – auf der Strecke wie im Büro"
            sizes="(min-width: 768px) 1100px, 100vw"
            className="mt-10 md:mt-14"
          />
          <div className="mt-12 md:mt-16"><BenefitsSlider items={BENEFITS} autoMs={12000} /></div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-16 md:py-24">
        <div className="page-container">
          <SectionHeading
            eyebrow="Einblicke"
            title="Gleistrix in Action"
            description="Ein Blick auf Oberflächen und Workflows aus dem echten Betrieb."
          />
          <div className="mt-12 md:mt-16"><ScreensGallery /></div>
        </div>
      </section>

      <section aria-labelledby="produkt-erklaerung" className="bg-white py-14 md:py-20">
        <div className="page-container">
          <h2 id="produkt-erklaerung" className="max-w-3xl text-[1.75rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
            Warum eine Plattform statt neun Werkzeuge
          </h2>
          <div className="mt-6 grid gap-8 md:mt-8 md:grid-cols-2 md:gap-10">
            <div className="max-w-prose space-y-4 text-[15px] leading-7 text-slate-600 sm:text-base">
              <p>
                Die Module sind keine Sammlung einzelner Programme, sondern Sichten auf denselben Datenstand. Ein
                Auftrag, der in der Projektplanung angelegt wird, trägt seine Bauabschnitte und Sperrpausen in die
                Plantafel. Wer dort eine Schicht besetzt, greift auf die Qualifikationen aus der Mitarbeiterverwaltung
                zu. Die Stunden, die auf dieser Schicht erfasst werden, sind dieselben, die später in der Rechnung
                stehen.
              </p>
              <p>
                Der Unterschied wird an den Übergängen sichtbar. In getrennten Werkzeugen entsteht an jeder Grenze
                Arbeit: Daten werden exportiert, geprüft, neu eingegeben. Jeder dieser Schritte kann schiefgehen, und
                jeder erzeugt eine zweite Fassung derselben Information. Genau daraus entstehen die Rückfragen, die im
                Bahnbau erst am Einsatztag auffallen.
              </p>
              <p>
                Deshalb erkennt Gleistrix Doppelbelegungen über Projektgrenzen hinweg, hält Nachweise am Einsatz statt
                in einer allgemeinen Personalakte und rechnet gegen die Positionen des Leistungsverzeichnisses ab, das
                schon im Projekt liegt.
              </p>
            </div>
            <div className="max-w-prose space-y-4 text-[15px] leading-7 text-slate-600 sm:text-base">
              <h3 className="text-lg font-bold text-slate-900">Was das im Alltag bedeutet</h3>
              <p>
                Für die Disposition heißt es: eine Plantafel, in der Personal, Fahrzeuge und Sicherungstechnik
                gemeinsam liegen, statt drei Listen, die von Hand abgeglichen werden. Konflikte meldet das System beim
                Zuweisen, nicht am Einsatztag.
              </p>
              <p>
                Für die Baustelle heißt es: Zeiten und Vorkommnisse werden dort erfasst, wo sie entstehen, mit
                Signatur. Für das Backoffice: geprüfte Stunden gehen ohne erneute Eingabe in Abrechnung und
                Lohnvorbereitung. Für die Geschäftsführung: Auslastung und Deckungsbeitrag entstehen aus dem laufenden
                Betrieb und nicht erst aus der Schlussrechnung.
              </p>
              <p>
                Welche Module ein Unternehmen braucht, hängt vom Gewerk ab. Die Detailseiten beschreiben jedes
                einzeln, die <Link className="font-semibold text-indigo-700" href="/branchen">Branchenseiten</Link>{" "}
                zeigen typische Zusammenstellungen, und unter{" "}
                <Link className="font-semibold text-indigo-700" href="/integrationen">Integrationen</Link> steht, wie
                Gleistrix an vorhandene Buchhaltungs-, Kalender- und Ausschreibungssysteme anschließt.
              </p>
              <p>
                Die KI-Agenten sind dabei durchgängig optional. Sie lassen sich pro Unternehmen zuschalten oder
                abschalten, und die Plattform funktioniert vollständig ohne sie – das ist eine bewusste Entscheidung,
                weil im Bahnumfeld nachvollziehbar bleiben muss, wer eine Freigabe erteilt hat.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Bereit für effiziente Bahnsicherung?"
        description="Lass dir Gleistrix live zeigen – 20 Minuten genügen, um den Mehrwert zu sehen."
      />
    </main>
  );
}
