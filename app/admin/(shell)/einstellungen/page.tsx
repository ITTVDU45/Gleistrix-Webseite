import NotificationTemplateManager from "@/components/admin/NotificationTemplateManager";
import { Section } from "@/components/admin/ui";
import { mailConfigIssue } from "@/lib/admin/mail";
import { TRIGGERS } from "@/lib/admin/notification-templates";
import { listNotificationTemplates } from "@/lib/admin/store";

export const metadata = { title: "Einstellungen" };

export default async function SettingsPage() {
  const templates = await listNotificationTemplates();
  const mailIssue = mailConfigIssue();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Einstellungen</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vorlagen für Nachrichten an Kunden und deren Nutzer.
        </p>
      </div>

      {/* Ohne SMTP ginge nichts raus. Das gehört hierher, nicht erst in die
          Fehlermeldung nach dem Klick auf „Jetzt senden". */}
      {mailIssue ? (
        <div
          role="alert"
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <strong className="font-medium">Kein Mailversand möglich.</strong> {mailIssue} Vorlagen
          lassen sich trotzdem anlegen und bearbeiten.
        </div>
      ) : null}

      <Section
        title="Benachrichtigungsvorlagen"
        description="Betreff, Titel und Text mit Platzhaltern. Eine Vorlage mit Auslöser wird automatisch verschickt; jede Vorlage lässt sich auf der Unternehmensseite auch von Hand senden."
      >
        <NotificationTemplateManager templates={templates} />
      </Section>

      <Section
        title="Verfügbare Auslöser"
        description="Vorgänge in der Control-Plane, an die sich eine Vorlage hängen lässt."
      >
        <ul className="divide-y">
          {TRIGGERS.map((trigger) => {
            const active = templates.find(
              (template) => template.isActive && template.trigger === trigger.id,
            );

            return (
              <li
                key={trigger.id}
                className="flex flex-wrap items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{trigger.label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{trigger.description}</p>
                </div>
                <p className="shrink-0 text-sm">
                  {active ? (
                    <span className="font-medium">{active.name}</span>
                  ) : (
                    <span className="text-muted-foreground">keine aktive Vorlage</span>
                  )}
                </p>
              </li>
            );
          })}
        </ul>
      </Section>
    </div>
  );
}
