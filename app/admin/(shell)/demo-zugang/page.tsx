import { ExternalLink } from "lucide-react";

import { revokeDemoAction } from "@/app/admin/actions";
import DemoReleaseForm from "@/components/admin/DemoReleaseForm";
import {
  DemoStatusPill,
  EmptyState,
  Mono,
  Section,
  StatCard,
  formatDate,
  formatDateTime,
  formatNumber,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import {
  APP_SYNC_ISSUE_TEXT,
  DEFAULT_DEMO_DAYS,
  MAX_DEMO_DAYS,
  appSyncIssue,
} from "@/lib/admin/app-sync";
import { effectiveModuleIds } from "@/lib/admin/modules";
import { getPublishedPricing } from "@/lib/admin/pricing";
import { readStore } from "@/lib/admin/store";

export const metadata = { title: "Demo-Zugang" };

export default async function AdminDemoAccessPage() {
  // readStore statt getDemoAccess + getLeads: das Formular braucht zusätzlich
  // die angelegten Unternehmen und – für den Anlege-Dialog – die Pakete, und
  // readStore holt ohnehin alles parallel.
  const [{ demoAccess, leads, companies, packages }, pricing] = await Promise.all([
    readStore(),
    getPublishedPricing(),
  ]);
  const access = [...demoAccess].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const issue = appSyncIssue();

  // Ein Eintrag bleibt „aktiv", bis ihn jemand entzieht – abgelaufen ist er
  // trotzdem. Ohne diese Ableitung zählte die Übersicht Zugänge als laufend,
  // die in der App längst zu sind.
  const jetzt = Date.now();
  const istAbgelaufen = (entry: (typeof access)[number]) =>
    entry.status === "aktiv" && new Date(entry.expiresAt).getTime() <= jetzt;

  const active = access.filter((entry) => entry.status === "aktiv" && !istAbgelaufen(entry));
  const failed = access.filter((entry) => entry.status === "fehlgeschlagen");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Demo-Zugang</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ein angelegter Mandant wird auf Zeit freigeschaltet: Ressourcen einrichten, an die App
          melden, Einladung verschicken. Nach Ablauf sperrt die App den Zugang selbst.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Aktive Demos"
          value={formatNumber(active.length)}
          hint="derzeit freigeschaltet"
        />
        <StatCard
          label="Freigaben gesamt"
          value={formatNumber(access.length)}
          hint="inklusive Historie"
        />
        <StatCard
          label="Fehlgeschlagen"
          value={formatNumber(failed.length)}
          hint={failed.length > 0 ? "Fehler unten im Protokoll" : "keine Fehler"}
        />
      </div>

      <Section
        title="Demoversion freigeben"
        description="Richtet Datenbank und Speicher ein, soweit sie noch fehlen, meldet den Mandanten an die App und schickt dem Ansprechpartner seinen Einladungslink."
      >
        <DemoReleaseForm
          candidates={leads
            .filter((lead) => lead.status !== "verloren")
            .map((lead) => ({
              id: lead.id,
              company: lead.company,
              contactName: lead.contactName,
              email: lead.email,
            }))}
          companies={companies.map((company) => ({
            id: company.id,
            name: company.name,
            contactName: company.contactName,
            contactEmail: company.contactEmail,
            demoExpiresAt: company.demoExpiresAt ?? null,
            hasModules:
              effectiveModuleIds(
                pricing,
                company,
                packages.find((pkg) => pkg.id === company.packageId) ?? null,
              ).length > 0,
          }))}
          packages={packages
            .filter((pkg) => pkg.isPublished)
            .map((pkg) => ({ id: pkg.id, name: pkg.name }))}
          defaultDays={DEFAULT_DEMO_DAYS}
          maxDays={MAX_DEMO_DAYS}
          configIssue={issue ? APP_SYNC_ISSUE_TEXT[issue] : null}
        />
      </Section>

      <Section
        title="Protokoll"
        description="Jeder Freigabeversuch – auch der fehlgeschlagene – bleibt nachvollziehbar."
      >
        {access.length === 0 ? (
          <EmptyState>Es wurde noch keine Demoversion freigeschaltet.</EmptyState>
        ) : (
          <ul className="divide-y">
            {access.map((entry) => {
              const abgelaufen = istAbgelaufen(entry);
              return (
                <li
                  key={entry.id}
                  className="flex flex-wrap items-start justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{entry.company}</p>
                      {abgelaufen ? (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">
                          Abgelaufen
                        </span>
                      ) : (
                        <DemoStatusPill status={entry.status} />
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      <Mono>{entry.email}</Mono> · angelegt {formatDate(entry.createdAt)}
                      {entry.status === "aktiv"
                        ? `${abgelaufen ? " · abgelaufen am " : " · läuft bis "}${formatDateTime(entry.expiresAt)}`
                        : ""}
                    </p>
                    {entry.error ? (
                      <p className="mt-1 text-sm text-rose-700">{entry.error}</p>
                    ) : null}
                    {entry.url ? (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
                      >
                        Anmeldung der App öffnen
                        <ExternalLink className="size-3.5" aria-hidden />
                      </a>
                    ) : null}
                  </div>

                  {entry.status === "aktiv" && !abgelaufen ? (
                    <form action={revokeDemoAction}>
                      <input type="hidden" name="accessId" value={entry.id} />
                      <Button type="submit" variant="outline" size="sm">
                        Zugang entziehen
                      </Button>
                    </form>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </div>
  );
}
