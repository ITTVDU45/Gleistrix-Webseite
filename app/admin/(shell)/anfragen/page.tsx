import Link from "next/link";
import { Mail, Phone, UserCheck } from "lucide-react";

import { createContactFromLeadAction, setLeadStatusAction } from "@/app/admin/actions";
import AppointmentForm from "@/components/admin/AppointmentForm";
import LeadRowMenu from "@/components/admin/LeadRowMenu";
import {
  EmptyState,
  LeadStatusPill,
  Section,
  StatCard,
  formatDate,
  formatDateTime,
  formatNumber,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { getLeads, listContacts } from "@/lib/admin/store";
import type { LeadKind, LeadStatus } from "@/types/admin";

export const metadata = { title: "Anfragen" };

const KIND_LABEL: Record<LeadKind, string> = {
  demo: "Demoanfrage",
  termin: "Terminwunsch",
  kontakt: "Kontaktanfrage",
};

/** Nächster sinnvoller Schritt je Status – ein Klick statt eines Auswahlfeldes. */
const NEXT_STATUS: Record<LeadStatus, { status: LeadStatus; label: string }[]> = {
  neu: [
    { status: "in-kontakt", label: "In Kontakt" },
    { status: "verloren", label: "Verloren" },
  ],
  "in-kontakt": [
    { status: "gewonnen", label: "Gewonnen" },
    { status: "verloren", label: "Verloren" },
  ],
  termin: [
    { status: "gewonnen", label: "Gewonnen" },
    { status: "verloren", label: "Verloren" },
  ],
  gewonnen: [{ status: "in-kontakt", label: "Zurück in Kontakt" }],
  verloren: [{ status: "in-kontakt", label: "Wieder aufnehmen" }],
};

/**
 * createContactFromLeadAction ist auf useActionState zugeschnitten und erwartet
 * den vorherigen Zustand als erstes Argument. Die Statusknöpfe daneben sind
 * einfache Formulare ohne Rückmeldung – dieser bleibt es auch: gelingt die
 * Übernahme, zeigt die Zeile danach den Verweis statt des Buttons.
 */
async function saveLeadAsContact(data: FormData): Promise<void> {
  "use server";
  await createContactFromLeadAction({}, data);
}

export default async function AdminLeadsPage() {
  const [leads, contacts] = await Promise.all([getLeads(), listContacts()]);

  // Welche Anfrage schon im Verzeichnis steht – zweimal derselbe Kontakt hilft
  // niemandem, deshalb ersetzt der Hinweis den Button.
  const savedLeadIds = new Set(
    contacts.map((contact) => contact.leadId).filter((id): id is string => Boolean(id)),
  );

  const open = leads.filter((lead) => lead.status === "neu" || lead.status === "in-kontakt");
  const demos = leads.filter((lead) => lead.kind === "demo");
  const upcoming = leads
    .filter((lead) => lead.appointmentAt && new Date(lead.appointmentAt) >= new Date())
    .sort((a, b) => (a.appointmentAt ?? "").localeCompare(b.appointmentAt ?? ""));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Anfragen</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Demoanfragen, Terminwünsche und Kontaktformulare von der Website.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Offen" value={formatNumber(open.length)} hint="neu oder in Kontakt" />
        <StatCard label="Demoanfragen" value={formatNumber(demos.length)} hint="gesamt" />
        <StatCard
          label="Anstehende Termine"
          value={formatNumber(upcoming.length)}
          hint={
            upcoming[0]?.appointmentAt
              ? `nächster ${formatDateTime(upcoming[0].appointmentAt)}`
              : "keiner geplant"
          }
        />
      </div>

      <Section
        title="Eingang"
        description="Neueste Anfrage zuerst. Termin und Status lassen sich direkt hier pflegen."
      >
        {leads.length === 0 ? (
          <EmptyState>Es liegen noch keine Anfragen vor.</EmptyState>
        ) : (
          <ul className="divide-y">
            {leads.map((lead) => (
              <li key={lead.id} className="space-y-4 py-5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-medium">{lead.company}</h3>
                      <LeadStatusPill status={lead.status} />
                      <span className="text-xs text-muted-foreground">{KIND_LABEL[lead.kind]}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {lead.contactName} · eingegangen {formatDate(lead.createdAt)}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-4 text-sm">
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
                      >
                        <Mail className="size-3.5" aria-hidden />
                        {lead.email}
                      </a>
                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone.replace(/\s/g, "")}`}
                          className="inline-flex items-center gap-1.5 text-muted-foreground underline-offset-4 hover:underline"
                        >
                          <Phone className="size-3.5" aria-hidden />
                          {lead.phone}
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {NEXT_STATUS[lead.status].map((option) => (
                      <form key={option.status} action={setLeadStatusAction}>
                        <input type="hidden" name="leadId" value={lead.id} />
                        <input type="hidden" name="status" value={option.status} />
                        <Button type="submit" variant="outline" size="sm">
                          {option.label}
                        </Button>
                      </form>
                    ))}

                    {savedLeadIds.has(lead.id) ? (
                      <Link
                        href="/admin/kontakte"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:underline"
                      >
                        <UserCheck className="size-3.5" aria-hidden />
                        Im Verzeichnis
                      </Link>
                    ) : (
                      <form action={saveLeadAsContact}>
                        <input type="hidden" name="leadId" value={lead.id} />
                        <Button type="submit" variant="outline" size="sm">
                          Als Kontakt speichern
                        </Button>
                      </form>
                    )}

                    <LeadRowMenu lead={lead} />
                  </div>
                </div>

                {lead.message ? (
                  <p className="rounded-lg bg-muted/60 px-3 py-2 text-sm">{lead.message}</p>
                ) : null}

                {lead.appointmentAt ? (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Termin: </span>
                    <strong className="font-medium">{formatDateTime(lead.appointmentAt)}</strong>
                  </p>
                ) : null}

                <AppointmentForm
                  leadId={lead.id}
                  appointmentAt={lead.appointmentAt}
                  note={lead.note}
                />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
