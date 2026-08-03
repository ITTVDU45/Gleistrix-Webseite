import { Mail } from "lucide-react";

import { setBrochureSentAction } from "@/app/admin/actions";
import BrochureSendForm from "@/components/admin/BrochureSendForm";
import {
  EmptyState,
  Section,
  StatCard,
  formatDate,
  formatNumber,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { brochureFile, mailConfigIssue } from "@/lib/admin/mail";
import { getBrochureRequests } from "@/lib/admin/store";
import type { BrochureRequest } from "@/types/admin";

export const metadata = { title: "Broschüre" };

const SUBJECT = "Ihre Gleistrix-Broschüre";

/**
 * Vorschlagstext je Anfrage – im Formular überschreibbar.
 *
 * Liegt eine Datei auf dem Server (BROCHURE_FILE_PATH), hängt die Action sie an;
 * sonst geht der Link mit (BROCHURE_FILE_URL). Fehlen beide, bleibt es beim Text.
 */
function defaultBody(request: BrochureRequest, url: string | null, hasFile: boolean): string {
  const lines = [
    `Guten Tag ${request.contactName},`,
    "",
    "vielen Dank für Ihr Interesse an Gleistrix.",
  ];

  if (hasFile) lines.push("Die Broschüre finden Sie im Anhang dieser E-Mail.");
  else if (url) lines.push(`Die Broschüre können Sie hier herunterladen: ${url}`);

  lines.push(
    "",
    "Bei Fragen melden Sie sich gerne – wir zeigen Ihnen das System auch live.",
    "",
    "Freundliche Grüße",
    "Ihr Gleistrix-Team",
  );

  return lines.join("\n");
}

export default async function AdminBrochurePage() {
  const requests = await getBrochureRequests();
  const open = requests.filter((request) => !request.sentAt);

  const smtpIssue = mailConfigIssue();
  const { path, url } = brochureFile();
  const hasFile = Boolean(path);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Broschüre</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Wer die Produktbroschüre angefordert hat und was davon noch offen ist.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Anfragen" value={formatNumber(requests.length)} hint="gesamt" />
        <StatCard label="Offen" value={formatNumber(open.length)} hint="noch nicht versendet" />
        <StatCard
          label="Versendet"
          value={formatNumber(requests.length - open.length)}
          hint="als erledigt markiert"
        />
      </div>

      {smtpIssue ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-inset ring-amber-600/20">
          {smtpIssue} Solange bleibt nur die Markierung von Hand – gesendet werden kann nichts.
        </p>
      ) : null}

      {!hasFile && !url ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-inset ring-amber-600/20">
          Es ist keine Broschüre hinterlegt: Setzen Sie BROCHURE_FILE_PATH (Datei wird angehängt)
          oder BROCHURE_FILE_URL (Link im Text). Sonst geht nur der Anschreibtext raus.
        </p>
      ) : null}

      <Section
        title="Anforderungen"
        description={
          smtpIssue
            ? "Ohne SMTP-Zugang lässt sich hier nur festhalten, was außerhalb versendet wurde."
            : "Direkt aus dem Adminbereich versenden – Betreff und Text sind vor dem Senden änderbar."
        }
      >
        {requests.length === 0 ? (
          <EmptyState>Bisher hat niemand die Broschüre angefordert.</EmptyState>
        ) : (
          <ul className="divide-y">
            {requests.map((request) => (
              <li key={request.id} className="py-3.5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{request.company}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {request.contactName} · angefordert {formatDate(request.createdAt)}
                      {request.sentAt ? ` · versendet ${formatDate(request.sentAt)}` : ""}
                    </p>
                    <a
                      href={`mailto:${request.email}?subject=${encodeURIComponent(SUBJECT)}`}
                      className="mt-1 inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline"
                    >
                      <Mail className="size-3.5" aria-hidden />
                      {request.email}
                    </a>
                  </div>

                  <form action={setBrochureSentAction}>
                    <input type="hidden" name="requestId" value={request.id} />
                    <input type="hidden" name="sent" value={request.sentAt ? "false" : "true"} />
                    <Button type="submit" variant="outline" size="sm">
                      {request.sentAt ? "Als offen markieren" : "Als versendet markieren"}
                    </Button>
                  </form>
                </div>

                {smtpIssue ? null : (
                  <div className="mt-3">
                    <BrochureSendForm
                      requestId={request.id}
                      recipient={request.email}
                      defaultSubject={SUBJECT}
                      defaultBody={defaultBody(request, url, hasFile)}
                      sent={Boolean(request.sentAt)}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
