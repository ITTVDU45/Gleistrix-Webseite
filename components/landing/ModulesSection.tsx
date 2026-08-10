import { getLandingModuleTexts, getLandingModules } from "@/lib/admin/landing-modules";

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
  const [all, texts] = await Promise.all([getLandingModules(), getLandingModuleTexts()]);
  const modules = all.filter((module) => module.isActive);
  if (modules.length === 0) return null;

  return (
    <section
      id="module"
      aria-labelledby="module-heading"
      className="scroll-mt-24 bg-[#f8fafc] py-20 md:py-28"
    >
      <div className="page-container">
        <SectionHeading
          eyebrow={texts.eyebrow}
          title={<span id="module-heading">{texts.title}</span>}
          description={texts.description || undefined}
        />

        <ModulesCarousel modules={modules} />
      </div>
    </section>
  );
}
