import type { Metadata } from "next";
import PageHero from "@/components/landing/PageHero";
import Reveal from "@/components/landing/Reveal";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung von Gleistrix.",
};

export default function Page() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Rechtliches"
        title="Impressum"
        description="Angaben zum Diensteanbieter gemäß den gesetzlichen Informationspflichten."
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Impressum" }]}
      />

      <section className="bg-[#f8fafc] py-16 md:py-20">
        <div className="page-container">
          <Reveal>
            <article className="mx-auto max-w-3xl rounded-3xl border border-slate-900/8 bg-white p-7 shadow-soft-sm md:p-10">
              <h2 id="diensteanbieter" className="text-xl font-semibold text-slate-900">
                Diensteanbieter
              </h2>
              <p className="mt-3 leading-relaxed text-slate-500">
                Tolgahan Vardar
                <br />
                Hauffstr. 55
                <br />
                47166 Duisburg
              </p>

              <h2 id="kontakt" className="mt-10 text-xl font-semibold text-slate-900">
                Kontaktmöglichkeiten
              </h2>
              <p className="mt-3 leading-relaxed text-slate-500">
                E-Mail-Adresse:{" "}
                <a href="mailto:info@gleistrix.de" className="text-indigo-600 hover:underline">
                  info@gleistrix.de
                </a>
              </p>
              <p className="mt-2 leading-relaxed text-slate-500">Telefon: 01785428363</p>
              <p className="mt-2 leading-relaxed text-slate-500">Kontaktformular: gleistrix.de/kontakt</p>

              <h2 id="verbraucherstreitbeilegung" className="mt-10 text-xl font-semibold text-slate-900">
                Verbraucherstreitbeilegung
              </h2>
              <p className="mt-3 leading-relaxed text-slate-500">
                Wir sind nicht bereit und nicht verpflichtet an einem Streitbeilegungsverfahren vor einer
                Verbraucherstreitschlichtungsstelle teilzunehmen.
              </p>

              <h2 id="text-und-data-mining" className="mt-10 text-xl font-semibold text-slate-900">
                Vorbehalt der Nutzung für Text und Data Mining
              </h2>
              <p className="mt-3 leading-relaxed text-slate-500">
                Vorbehalt der Nutzung für Text und Data Mining: Der Inhaber dieser Website gestattet die Nutzung oder
                das Herunterladen von Inhalten dieser Website durch Dritte für die Entwicklung, das Training oder den
                Betrieb von künstlicher Intelligenz oder anderen maschinellen Lernsystemen („Text und Data Mining“)
                ausschließlich mit ausdrücklicher schriftlicher Zustimmung des Inhabers. Ohne eine solche Zustimmung ist
                es untersagt, die Inhalte für Text und Data Mining zu verwenden. Dies gilt auch, wenn auf der Website
                keine Meta-Angaben vorhanden sind, die entsprechende Verfahren aussperren, und selbst dann, wenn Bots,
                die den Zweck haben, die Website zu Zwecken des Text und Data Mining auszulesen, nicht ausgesperrt
                werden.
              </p>

              <h2 id="haftung" className="mt-10 text-xl font-semibold text-slate-900">
                Haftungs- und Schutzrechtshinweise
              </h2>
              <p className="mt-3 leading-relaxed text-slate-500">
                Haftungsausschluss: Die Inhalte dieses Onlineangebotes wurden sorgfältig und nach unserem aktuellen
                Kenntnisstand erstellt, dienen jedoch nur der Information und entfalten keine rechtlich bindende
                Wirkung, sofern es sich nicht um gesetzlich verpflichtende Informationen (z. B. das Impressum, die
                Datenschutzerklärung, AGB oder verpflichtende Belehrungen von Verbrauchern) handelt. Wir behalten uns
                vor, die Inhalte vollständig oder teilweise zu ändern oder zu löschen, soweit vertragliche
                Verpflichtungen unberührt bleiben. Alle Angebote sind freibleibend und unverbindlich.
              </p>

              <p className="mt-10 border-t border-slate-900/8 pt-6 text-sm text-slate-400">
                <a
                  href="https://datenschutz-generator.de/"
                  title="Rechtstext von Dr. Schwenke - für weitere Informationen bitte anklicken."
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="hover:text-indigo-600"
                >
                  Erstellt mit kostenlosem Datenschutz-Generator.de von Dr. Thomas Schwenke
                </a>
              </p>
            </article>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
