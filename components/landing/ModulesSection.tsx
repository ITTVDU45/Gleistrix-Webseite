import { getLandingModules } from "@/lib/admin/landing-modules";

import ModulesCarousel from "./ModulesCarousel";
import SectionHeading from "./SectionHeading";

/**
 * Modul-Abschnitt der Startseite.
 *
 * Die Inhalte kommen aus dem Adminbereich (/admin/module), nicht mehr aus einer
 * Konstante. Nach dem Speichern stößt die Action revalidatePath("/") an –
 * dadurch zeigt der nächste Aufruf den neuen Stand ohne Deployment.
 */
export default async function ModulesSection() {
  const modules = (await getLandingModules()).filter((module) => module.isActive);
  if (modules.length === 0) return null;

  return (
    <section
      id="module"
      aria-labelledby="module-heading"
      className="scroll-mt-24 bg-[#f8fafc] py-20 md:py-28"
    >
      <div className="page-container">
        <SectionHeading
          eyebrow="Module"
          title={
            <span id="module-heading">Eine Plattform. Alle Werkzeuge für den Bahnbetrieb.</span>
          }
          description="Jedes Modul löst ein konkretes Problem im Alltag von Bahndienstleistern – zusammen ergeben sie ein durchgängiges System."
        />

        <ModulesCarousel modules={modules} />
      </div>
    </section>
  );
}
