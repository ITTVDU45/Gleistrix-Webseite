import { Mail, Phone } from "lucide-react";

import { deleteContactAction } from "@/app/admin/actions";
import ContactForm from "@/components/admin/ContactForm";
import {
  EmptyState,
  Section,
  StatCard,
  formatDate,
  formatNumber,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { listContacts } from "@/lib/admin/store";
import type { ContactSource } from "@/types/admin";

export const metadata = { title: "Kontakte" };

const SOURCE_LABEL: Record<ContactSource, string> = {
  lead: "aus Anfrage",
  manuell: "manuell angelegt",
};

export default async function AdminContactsPage() {
  const contacts = await listContacts();

  const fromLeads = contacts.filter((contact) => contact.source === "lead");
  const withCompany = contacts.filter((contact) => Boolean(contact.companyId));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Kontakte</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Das Verzeichnis des Vertriebs. Ein Kontakt bleibt bestehen, auch wenn die Anfrage
          dahinter längst abgeschlossen ist.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Kontakte" value={formatNumber(contacts.length)} hint="gesamt" />
        <StatCard
          label="Aus Anfragen"
          value={formatNumber(fromLeads.length)}
          hint="übernommen"
        />
        <StatCard
          label="Mit Mandant"
          value={formatNumber(withCompany.length)}
          hint="bereits Kunde"
        />
      </div>

      <Section
        title="Kontakt anlegen"
        description="Für alles, was nicht über das Formular auf der Website hereinkommt."
      >
        <ContactForm />
      </Section>

      <Section
        title={`Verzeichnis (${contacts.length})`}
        description="Neuester Kontakt zuerst. „Bearbeiten“ klappt die Felder der Zeile auf."
      >
        {contacts.length === 0 ? (
          <EmptyState>Es ist noch kein Kontakt gespeichert.</EmptyState>
        ) : (
          <ul className="divide-y">
            {contacts.map((contact) => (
              <li key={contact.id} className="space-y-3 py-5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-medium">{contact.company}</h3>
                      <span className="text-xs text-muted-foreground">
                        {SOURCE_LABEL[contact.source]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {contact.contactName}
                      {contact.role ? ` · ${contact.role}` : ""} · angelegt{" "}
                      {formatDate(contact.createdAt)}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-4 text-sm">
                      <a
                        href={`mailto:${contact.email}`}
                        className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
                      >
                        <Mail className="size-3.5" aria-hidden />
                        {contact.email}
                      </a>
                      {contact.phone ? (
                        <a
                          href={`tel:${contact.phone.replace(/\s/g, "")}`}
                          className="inline-flex items-center gap-1.5 text-muted-foreground underline-offset-4 hover:underline"
                        >
                          <Phone className="size-3.5" aria-hidden />
                          {contact.phone}
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {/* Getrenntes Formular: verschachtelte <form> sind ungültiges HTML. */}
                  <form action={deleteContactAction}>
                    <input type="hidden" name="contactId" value={contact.id} />
                    <Button type="submit" variant="outline" size="sm">
                      Löschen
                    </Button>
                  </form>
                </div>

                {contact.note ? (
                  <p className="rounded-lg bg-muted/60 px-3 py-2 text-sm">{contact.note}</p>
                ) : null}

                {/* ponytail: <details> statt Modal-State – ein Klick, kein Client-Zustand. */}
                <details className="group">
                  <summary className="cursor-pointer text-sm text-muted-foreground underline-offset-4 hover:underline">
                    Bearbeiten
                  </summary>
                  <div className="mt-4">
                    <ContactForm contact={contact} />
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
