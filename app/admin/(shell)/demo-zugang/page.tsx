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
  DEFAULT_DEMO_DAYS,
  DEMO_ISSUE_TEXT,
  MAX_DEMO_DAYS,
  demoConfigIssue,
} from "@/lib/admin/demo";
import { readStore } from "@/lib/admin/store";

export const metadata = { title: "Demo-Zugang" };

export default async function AdminDemoAccessPage() {
  // readStore statt getDemoAccess + getLeads: das Formular braucht zusätzlich
  // die angelegten Unternehmen, und readStore holt ohnehin alles parallel.
  const { demoAccess, leads, companies } = await readStore();
  const access = [...demoAccess].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const issue = demoConfigIssue();

  const active = access.filter((entry) => entry.status === "aktiv");
  const failed = access.filter((entry) => entry.status === "fehlgeschlagen");

  // Vorschläge fürs Formular: offene Anfragen, für die noch keine Demo läuft.
  const activeEmails = new Set(active.map((entry) => entry.email));
  const candidates = leads
    .filter((lead) => lead.status !== "verloren" && !activeEmails.has(lead.email.toLowerCase()))
    .map((lead) => ({
      id: lead.id,
      company: lead.company,
      contactName: lead.contactName,
      email: lead.email,
    }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Demo-Zugang</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Demoversionen über die Schnittstelle der Gleistrix-App freischalten und wieder entziehen.
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
        description="Die Gleistrix-App legt den Zugang an und meldet Login-Adresse und Ablaufdatum zurück."
      >
        <DemoReleaseForm
          candidates={candidates}
          companies={companies.map((company) => ({
            id: company.id,
            name: company.name,
            contactEmail: company.contactEmail,
          }))}
          defaultDays={DEFAULT_DEMO_DAYS}
          maxDays={MAX_DEMO_DAYS}
          configIssue={issue ? DEMO_ISSUE_TEXT[issue] : null}
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
            {access.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-start justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{entry.company}</p>
                    <DemoStatusPill status={entry.status} />
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    <Mono>{entry.email}</Mono> · angelegt {formatDate(entry.createdAt)}
                    {entry.status === "aktiv"
                      ? ` · läuft bis ${formatDateTime(entry.expiresAt)}`
                      : ""}
                  </p>
                  {entry.error ? <p className="mt-1 text-sm text-rose-700">{entry.error}</p> : null}
                  {entry.url ? (
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
                    >
                      Demo öffnen
                      <ExternalLink className="size-3.5" aria-hidden />
                    </a>
                  ) : null}
                </div>

                {entry.status === "aktiv" ? (
                  <form action={revokeDemoAction}>
                    <input type="hidden" name="accessId" value={entry.id} />
                    <Button type="submit" variant="outline" size="sm">
                      Zugang entziehen
                    </Button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
