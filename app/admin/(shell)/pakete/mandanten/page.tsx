import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { togglePackagePublishedAction } from "@/app/admin/actions";
import NewPackageForm from "@/components/admin/NewPackageForm";
import { EmptyState, Section, formatDate, formatNumber } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { formatPriceEUR } from "@/data/pricing";
import { moduleCatalog, moduleTitle } from "@/lib/admin/modules";
import { getDraftPricing } from "@/lib/admin/pricing";
import { readStore } from "@/lib/admin/store";

export const metadata = { title: "Mandanten-Pakete" };

export default async function TenantPackagesPage() {
  const [{ packages, companies }, config] = await Promise.all([readStore(), getDraftPricing()]);

  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/admin/pakete"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Preisseite
        </Link>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Mandanten-Pakete</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ein Paket bündelt Module, Benutzerplätze und Projektlimit. Erst nach der Freigabe lässt
          es sich einem Unternehmen zuweisen.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Diese Pakete steuern die Provisionierung von Mandanten und nicht die öffentliche
          Preisseite. Preise, Module und Texte der Preisseite werden unter{" "}
          <Link href="/admin/pakete" className="text-primary underline-offset-4 hover:underline">
            Preisseite
          </Link>{" "}
          gepflegt.
        </p>
      </header>

      <Section title="Neues Paket" description="Module aus dem Gleistrix-Katalog zusammenstellen.">
        <NewPackageForm modules={moduleCatalog(config)} />
      </Section>

      <Section title={`Pakete (${packages.length})`}>
        {packages.length === 0 ? (
          <EmptyState>Noch kein Paket angelegt.</EmptyState>
        ) : (
          <ul className="space-y-3">
            {packages.map((pkg) => {
              const assigned = companies.filter((c) => c.packageId === pkg.id);
              const lockedByAssignment = pkg.isPublished && assigned.length > 0;

              return (
                <li key={pkg.id} className="rounded-xl border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">{pkg.name}</h3>
                        <span
                          className={
                            pkg.isPublished
                              ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                              : "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20"
                          }
                        >
                          {pkg.isPublished ? "Freigegeben" : "Entwurf"}
                        </span>
                      </div>
                      {pkg.description ? (
                        <p className="mt-1 text-sm text-muted-foreground">{pkg.description}</p>
                      ) : null}
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold tabular-nums">
                        {formatPriceEUR(pkg.monthlyPrice)}
                      </p>
                      <p className="text-xs text-muted-foreground">pro Monat</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                    <span>{formatNumber(pkg.includedSeats)} Benutzer</span>
                    <span>{formatNumber(pkg.projectLimit)} Projekte</span>
                    <span>{pkg.moduleIds.length} Module</span>
                    <span>{assigned.length} Mandanten</span>
                    <span>seit {formatDate(pkg.createdAt)}</span>
                  </div>

                  {pkg.moduleIds.length > 0 ? (
                    <p className="mt-3 flex flex-wrap gap-1.5">
                      {pkg.moduleIds.map((moduleId) => (
                        <span
                          key={moduleId}
                          className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {moduleTitle(config, moduleId)}
                        </span>
                      ))}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-3">
                    <form action={togglePackagePublishedAction}>
                      <input type="hidden" name="packageId" value={pkg.id} />
                      <Button
                        type="submit"
                        size="sm"
                        variant={pkg.isPublished ? "ghost" : "default"}
                        disabled={lockedByAssignment}
                      >
                        {pkg.isPublished ? "Freigabe zurückziehen" : "Paket freigeben"}
                      </Button>
                    </form>
                    {lockedByAssignment ? (
                      <p className="text-xs text-muted-foreground">
                        Freigabe gesperrt: {assigned.length} Mandant
                        {assigned.length === 1 ? "" : "en"} nutzen dieses Paket.
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </div>
  );
}
