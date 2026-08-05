import Link from "next/link";

import NewCompanyForm from "@/components/admin/NewCompanyForm";
import {
  CompanyStatusPill,
  EmptyState,
  Mono,
  Section,
  formatDate,
  formatNumber,
} from "@/components/admin/ui";
import { effectiveModuleIds } from "@/lib/admin/modules";
import { getDraftPricing } from "@/lib/admin/pricing";
import { readStore } from "@/lib/admin/store";

export const metadata = { title: "Unternehmen" };

/** Firmennamen vergleichbar machen – Groß-/Kleinschreibung und Ränder ignorieren. */
function nameKey(value: string): string {
  return value.trim().toLowerCase();
}

export default async function CompaniesPage() {
  // Entwurfsstand wie auf den übrigen Adminseiten: neu angelegte Module zählen sofort mit.
  const [{ companies, packages, contacts, demoAccess }, pricing] = await Promise.all([
    readStore(),
    getDraftPricing(),
  ]);
  const publishedPackages = packages.filter((p) => p.isPublished);
  const packageById = new Map(packages.map((p) => [p.id, p]));

  // Trägt der Zugang eine Mandanten-Kennung, gilt sie. Nur Altdaten und frei
  // eingegebene Empfänger werden noch über Firmenname oder Kontakt-E-Mail
  // zugeordnet – eine Demo entsteht oft, bevor es den Mandanten gibt.
  const demosByCompanyId = new Map<string, number>();
  const demosByName = new Map<string, number>();
  const demosByEmail = new Map<string, number>();
  for (const entry of demoAccess) {
    if (entry.companyId) {
      demosByCompanyId.set(entry.companyId, (demosByCompanyId.get(entry.companyId) ?? 0) + 1);
      continue;
    }
    const name = nameKey(entry.company);
    const email = nameKey(entry.email);
    demosByName.set(name, (demosByName.get(name) ?? 0) + 1);
    demosByEmail.set(email, (demosByEmail.get(email) ?? 0) + 1);
  }

  const contactsByCompanyId = new Map<string, number>();
  const contactsByName = new Map<string, number>();
  for (const contact of contacts) {
    if (contact.companyId) {
      contactsByCompanyId.set(
        contact.companyId,
        (contactsByCompanyId.get(contact.companyId) ?? 0) + 1,
      );
      continue;
    }
    const name = nameKey(contact.company);
    contactsByName.set(name, (contactsByName.get(name) ?? 0) + 1);
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Unternehmen</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Alle Mandanten arbeiten in derselben App; getrennt sind sie über eine eigene
          MongoDB-Datenbank und einen eigenen MinIO-Bucket.
        </p>
      </header>

      <Section
        title="Neues Unternehmen anlegen"
        description="Der Mandant startet in der Provisionierung und wird aktiv, sobald alle Ressourcen stehen."
      >
        <NewCompanyForm packages={publishedPackages.map((p) => ({ id: p.id, name: p.name }))} />
      </Section>

      <Section
        title={`Mandanten (${companies.length})`}
        description="Ein Klick auf einen Eintrag öffnet die Detailseite mit Modulen und Sperren."
      >
        {companies.length === 0 ? (
          <EmptyState>Noch kein Unternehmen angelegt.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Unternehmen</th>
                  <th className="pb-2 pr-4 font-medium">Kennung</th>
                  <th className="pb-2 pr-4 font-medium">Paket</th>
                  <th className="pb-2 pr-4 text-right font-medium">Module</th>
                  <th className="pb-2 pr-4 text-right font-medium">Benutzer</th>
                  <th className="pb-2 pr-4 text-right font-medium">Demos</th>
                  <th className="pb-2 pr-4 text-right font-medium">Kontakte</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 font-medium">Angelegt</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {companies.map((company) => {
                  const pkg = packageById.get(company.packageId ?? "") ?? null;
                  const modules = effectiveModuleIds(pricing, company, pkg);
                  const demos =
                    (demosByCompanyId.get(company.id) ?? 0) +
                    (demosByName.get(nameKey(company.name)) ??
                      demosByEmail.get(nameKey(company.contactEmail)) ??
                      0);
                  const contactCount =
                    (contactsByCompanyId.get(company.id) ?? 0) +
                    (contactsByName.get(nameKey(company.name)) ?? 0);

                  return (
                    <tr key={company.id} className="transition-colors hover:bg-muted/40">
                      <td className="py-3 pr-4">
                        <Link
                          href={`/admin/unternehmen/${company.id}`}
                          className="font-medium underline-offset-4 hover:underline"
                        >
                          {company.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">{company.contactEmail}</p>
                      </td>
                      <td className="py-3 pr-4">
                        <Mono>{company.slug}</Mono>
                      </td>
                      <td className="py-3 pr-4">
                        {pkg ? pkg.name : <span className="text-muted-foreground">–</span>}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">{modules.length}</td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {formatNumber(company.seats)}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {demos > 0 ? (
                          formatNumber(demos)
                        ) : (
                          <span className="text-muted-foreground">–</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {contactCount > 0 ? (
                          formatNumber(contactCount)
                        ) : (
                          <span className="text-muted-foreground">–</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <CompanyStatusPill status={company.status} />
                      </td>
                      <td className="py-3 text-muted-foreground">{formatDate(company.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
}
