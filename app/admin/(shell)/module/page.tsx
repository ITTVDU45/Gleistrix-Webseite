import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

import { deleteLandingModuleAction, moveLandingModuleAction } from "@/app/admin/actions";
import LandingModuleForm from "@/components/admin/landing/LandingModuleForm";
import LandingTextsForm from "@/components/admin/landing/LandingTextsForm";
import Modal from "@/components/admin/pricing/Modal";
import { NeutralBadge } from "@/components/admin/pricing/ui";
import { EmptyState, Section, formatNumber } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { VISUAL_LABEL } from "@/data/landingModules";
import { formatPriceEUR } from "@/data/pricing";
import { getLandingModuleTexts, getLandingModules } from "@/lib/admin/landing-modules";
import {
  TIER_LABEL,
  effectiveModuleIds,
  moduleCatalog,
  type ModuleTier,
} from "@/lib/admin/modules";
import { getDraftPricing, suggestionList } from "@/lib/admin/pricing";
import { readStore } from "@/lib/admin/store";

export const metadata = { title: "Module" };

const TIER_ORDER: ModuleTier[] = ["standard", "complex", "ai"];

/**
 * Reihenfolge eines Startseiten-Moduls ändern.
 *
 * Zwei kleine Formulare statt eines Ziehgriffs – dieselbe Lösung wie bei den
 * Add-ons (components/admin/pricing/ui.tsx), nur gegen die Karussell-Action.
 */
function LandingMoveButtons({
  id,
  isFirst,
  isLast,
  label,
}: {
  id: string;
  isFirst: boolean;
  isLast: boolean;
  label: string;
}) {
  if (isFirst && isLast) return null;

  const button =
    "flex size-7 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <span className="flex items-center gap-1">
      <form action={moveLandingModuleAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="up" />
        <button type="submit" className={button} disabled={isFirst} aria-label={`${label} nach oben`}>
          <ChevronUp className="size-4" aria-hidden />
        </button>
      </form>
      <form action={moveLandingModuleAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="down" />
        <button type="submit" className={button} disabled={isLast} aria-label={`${label} nach unten`}>
          <ChevronDown className="size-4" aria-hidden />
        </button>
      </form>
    </span>
  );
}

export default async function ModulesPage() {
  // Entwurfsstand, damit ein neu angelegtes Modul hier sofort auftaucht.
  const [{ companies, packages }, pricing, landingModules, landingTexts] = await Promise.all([
    readStore(),
    getDraftPricing(),
    getLandingModules(),
    getLandingModuleTexts(),
  ]);
  const bulletSuggestions = suggestionList(landingModules.flatMap((module) => module.bullets));
  const packageById = new Map(packages.map((p) => [p.id, p]));
  const catalog = moduleCatalog(pricing);

  // Wie viele Mandanten nutzen ein Modul tatsächlich – Sperren eingerechnet.
  const activeCount = new Map<string, number>();
  for (const company of companies) {
    const pkg = packageById.get(company.packageId ?? "") ?? null;
    for (const moduleId of effectiveModuleIds(pricing, company, pkg)) {
      activeCount.set(moduleId, (activeCount.get(moduleId) ?? 0) + 1);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Module</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Der Katalog stammt aus dem öffentlichen Konfigurator. Freigeben und Sperren geschieht je
          Unternehmen auf der Detailseite.
        </p>
      </header>

      <Section
        title={`Startseite – Modul-Karussell (${formatNumber(landingModules.length)})`}
        description="Titel, Beschreibung, Bild und Reihenfolge der Folien auf der Startseite. Änderungen sind ohne Freigabe sofort öffentlich."
        action={
          <Modal
            label="Modul hinzufügen"
            title="Neues Startseiten-Modul"
            description="Erscheint als letzte Folie – die Reihenfolge lässt sich danach ändern."
          >
            <LandingModuleForm bulletSuggestions={bulletSuggestions} />
          </Modal>
        }
      >
        <div className="mb-6 border-b pb-6">
          <h3 className="text-sm font-semibold">Sektionskopf</h3>
          <p className="mb-4 mt-0.5 text-sm text-muted-foreground">
            Marke, Überschrift und Beschreibung über dem Karussell.
          </p>
          <LandingTextsForm texts={landingTexts} />
        </div>

        {landingModules.length === 0 ? (
          <EmptyState>Noch kein Modul für die Startseite angelegt.</EmptyState>
        ) : (
          <ul className="grid gap-3 lg:grid-cols-2">
            {landingModules.map((module, index) => (
              <li key={module.id} className="flex gap-3 rounded-xl border p-3.5">
                {module.imageSrc ? (
                  // Kein next/image: das Bild liegt hinter /api/assets und wird
                  // hier nur als Miniatur zur Wiedererkennung gezeigt.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={module.imageSrc}
                    alt=""
                    className="h-16 w-24 shrink-0 rounded-md border object-cover"
                  />
                ) : (
                  <span className="flex h-16 w-24 shrink-0 items-center justify-center rounded-md border border-dashed text-center text-[11px] leading-tight text-muted-foreground">
                    {VISUAL_LABEL[module.visual]}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{module.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {module.description}
                      </p>
                    </div>
                    <LandingMoveButtons
                      id={module.id}
                      isFirst={index === 0}
                      isLast={index === landingModules.length - 1}
                      label={`Modul ${module.title}`}
                    />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {module.isActive ? null : <NeutralBadge>Ausgeblendet</NeutralBadge>}
                    <NeutralBadge>{formatNumber(module.bullets.length)} Stichpunkte</NeutralBadge>

                    <span className="ml-auto flex items-center gap-1">
                      <Modal
                        label="Bearbeiten"
                        variant="outline"
                        title={module.title}
                        description="Änderungen sind sofort auf der Startseite sichtbar."
                      >
                        <LandingModuleForm
                          module={module}
                          bulletSuggestions={bulletSuggestions}
                        />
                      </Modal>

                      <form action={deleteLandingModuleAction}>
                        <input type="hidden" name="moduleId" value={module.id} />
                        <Button type="submit" size="sm" variant="ghost">
                          Löschen
                        </Button>
                      </form>
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {TIER_ORDER.map((tier) => {
        const modules = catalog.filter((m) => m.tier === tier);
        if (modules.length === 0) return null;

        return (
          <Section key={tier} title={TIER_LABEL[tier]}>
            <ul className="grid gap-2 lg:grid-cols-2">
              {modules.map((module) => {
                const count = activeCount.get(module.id) ?? 0;
                const inPackages = packages.filter((p) => p.moduleIds.includes(module.id));

                return (
                  <li key={module.id} className="rounded-lg border px-3.5 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{module.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{module.description}</p>
                      </div>
                      <span className="shrink-0 text-sm font-medium tabular-nums">
                        {formatPriceEUR(module.price)}
                      </span>
                    </div>

                    <p className="mt-2.5 text-xs text-muted-foreground">
                      Aktiv bei {formatNumber(count)} von {formatNumber(companies.length)} Mandanten
                      {inPackages.length > 0
                        ? ` · in ${inPackages.map((p) => p.name).join(", ")}`
                        : " · in keinem Paket"}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Section>
        );
      })}

      <p className="text-sm text-muted-foreground">
        Zum Freigeben oder Sperren ein{" "}
        <Link href="/admin/unternehmen" className="text-primary underline-offset-4 hover:underline">
          Unternehmen
        </Link>{" "}
        öffnen.
      </p>
    </div>
  );
}
