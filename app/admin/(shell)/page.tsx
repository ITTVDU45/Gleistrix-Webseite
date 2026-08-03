import type { ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

import {
  CompanyStatusPill,
  EmptyState,
  Mono,
  Section,
  StatCard,
  formatDateTime,
  formatNumber,
  formatStorage,
} from "@/components/admin/ui";
import { readStore } from "@/lib/admin/store";
import { missingProvisioningEnv } from "@/lib/admin/tenant";
import { formatPriceEUR } from "@/data/pricing";

export const metadata = { title: "Dashboard" };

export default async function AdminOverviewPage() {
  const { companies, packages, usage, leads, brochureRequests, demoAccess } = await readStore();
  const missingEnv = missingProvisioningEnv();

  const active = companies.filter((c) => c.status === "active");
  const provisioning = companies.filter((c) => c.status === "provisioning");
  const suspended = companies.filter((c) => c.status === "suspended");

  const priceById = new Map(packages.map((p) => [p.id, p.monthlyPrice]));
  const mrr = active.reduce((sum, c) => sum + (priceById.get(c.packageId ?? "") ?? 0), 0);

  const latestMonth = usage.reduce((max, entry) => (entry.month > max ? entry.month : max), "");
  const currentUsage = usage.filter((entry) => entry.month === latestMonth);
  const totalSeats = currentUsage.reduce((sum, entry) => sum + entry.activeUsers, 0);
  const totalStorage = currentUsage.reduce((sum, entry) => sum + entry.storageMb, 0);
  const totalCalls = currentUsage.reduce((sum, entry) => sum + entry.apiCalls, 0);

  const openLeads = leads.filter(
    (lead) => lead.status === "neu" || lead.status === "in-kontakt",
  );
  const openBrochure = brochureRequests.filter((request) => !request.sentAt);
  const activeDemos = demoAccess.filter((entry) => entry.status === "aktiv");
  const nextAppointment = leads
    .filter((lead) => lead.appointmentAt && new Date(lead.appointmentAt) >= new Date())
    .sort((a, b) => (a.appointmentAt ?? "").localeCompare(b.appointmentAt ?? ""))[0];

  const openWork = companies
    .map((company) => ({
      company,
      openSteps: company.provisioning.filter((step) => step.status !== "done"),
    }))
    .filter((entry) => entry.openSteps.length > 0);

  const missingEnvList = missingEnv.reduce<ReactNode[]>(
    (acc, name, index) => [
      ...acc,
      index > 0 ? ", " : null,
      <Mono key={name}>{name}</Mono>,
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Anfragen, Mandanten und Auslastung der Gleistrix-Plattform.
        </p>
      </header>

      {missingEnv.length > 0 ? (
        <div className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-50 px-4 py-3.5">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden />
          <div className="text-sm text-amber-900">
            <p className="font-medium">Automatische Provisionierung ist noch nicht angebunden.</p>
            <p className="mt-1 text-amber-800">
              Es fehlen: {missingEnvList}. Bis dahin lassen sich die Schritte je Unternehmen manuell
              abhaken.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Offene Anfragen"
          value={formatNumber(openLeads.length)}
          hint={`${leads.filter((lead) => lead.kind === "demo").length} Demoanfragen gesamt`}
          href="/admin/anfragen"
        />
        <StatCard
          label="Nächster Termin"
          value={nextAppointment ? formatDateTime(nextAppointment.appointmentAt as string) : "–"}
          hint={nextAppointment ? nextAppointment.company : "kein Termin geplant"}
          href="/admin/anfragen"
        />
        <StatCard
          label="Broschüre offen"
          value={formatNumber(openBrochure.length)}
          hint={`${brochureRequests.length} Anforderungen gesamt`}
          href="/admin/broschuere"
        />
        <StatCard
          label="Aktive Demos"
          value={formatNumber(activeDemos.length)}
          hint={`${demoAccess.length} Freigaben insgesamt`}
          href="/admin/demo-zugang"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Unternehmen"
          value={formatNumber(companies.length)}
          hint={`${active.length} aktiv · ${suspended.length} gesperrt`}
          href="/admin/unternehmen"
        />
        <StatCard
          label="Wiederkehrender Umsatz"
          value={formatPriceEUR(mrr)}
          hint="pro Monat, nur aktive Mandanten"
        />
        <StatCard
          label="Aktive Nutzer"
          value={formatNumber(totalSeats)}
          hint={latestMonth ? `Stand ${latestMonth}` : "keine Daten"}
        />
        <StatCard
          label="In Provisionierung"
          value={formatNumber(provisioning.length)}
          hint={`${openWork.length} Mandanten mit offenen Schritten`}
        />
      </div>

      <Section
        title="Offene Provisionierung"
        description="Ressourcen, die für einen Mandanten noch angelegt werden müssen."
      >
        {openWork.length === 0 ? (
          <EmptyState>Alle Mandanten sind vollständig eingerichtet.</EmptyState>
        ) : (
          <ul className="divide-y">
            {openWork.map(({ company, openSteps }) => (
              <li
                key={company.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/unternehmen/${company.id}`}
                      className="text-sm font-medium underline-offset-4 hover:underline"
                    >
                      {company.name}
                    </Link>
                    <CompanyStatusPill status={company.status} />
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {openSteps.map((step) => step.label).join(" · ")}
                  </p>
                </div>
                <Link
                  href={`/admin/unternehmen/${company.id}`}
                  className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                >
                  Öffnen
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title={`Nutzung ${latestMonth}`.trim()}
        description="Grundlage für die spätere verbrauchsabhängige Abrechnung."
      >
        {currentUsage.length === 0 ? (
          <EmptyState>Für diesen Monat liegen noch keine Nutzungsdaten vor.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Unternehmen</th>
                  <th className="pb-2 pr-4 text-right font-medium">Nutzer</th>
                  <th className="pb-2 pr-4 text-right font-medium">Projekte</th>
                  <th className="pb-2 pr-4 text-right font-medium">Speicher</th>
                  <th className="pb-2 text-right font-medium">API-Aufrufe</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentUsage.map((entry) => {
                  const company = companies.find((c) => c.id === entry.companyId);
                  return (
                    <tr key={entry.companyId}>
                      <td className="py-2.5 pr-4">
                        <Link
                          href={`/admin/unternehmen/${entry.companyId}`}
                          className="underline-offset-4 hover:underline"
                        >
                          {company?.name ?? entry.companyId}
                        </Link>
                      </td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">
                        {formatNumber(entry.activeUsers)}
                      </td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">
                        {formatNumber(entry.projects)}
                      </td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">
                        {formatStorage(entry.storageMb)}
                      </td>
                      <td className="py-2.5 text-right tabular-nums">
                        {formatNumber(entry.apiCalls)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t font-medium">
                  <td className="pt-2.5 pr-4">Gesamt</td>
                  <td className="pt-2.5 pr-4 text-right tabular-nums">{formatNumber(totalSeats)}</td>
                  <td className="pt-2.5 pr-4 text-right tabular-nums">
                    {formatNumber(currentUsage.reduce((s, e) => s + e.projects, 0))}
                  </td>
                  <td className="pt-2.5 pr-4 text-right tabular-nums">
                    {formatStorage(totalStorage)}
                  </td>
                  <td className="pt-2.5 text-right tabular-nums">{formatNumber(totalCalls)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
}
