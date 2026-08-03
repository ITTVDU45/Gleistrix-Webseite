import { Mail } from "lucide-react";

import { setBrochureSentAction } from "@/app/admin/actions";
import {
  EmptyState,
  Section,
  StatCard,
  formatDate,
  formatNumber,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { getBrochureRequests } from "@/lib/admin/store";

export const metadata = { title: "Broschüre" };

export default async function AdminBrochurePage() {
  const requests = await getBrochureRequests();
  const open = requests.filter((request) => !request.sentAt);

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

      <Section
        title="Anforderungen"
        description="Der Versand läuft außerhalb – hier wird nur festgehalten, was raus ist."
      >
        {requests.length === 0 ? (
          <EmptyState>Bisher hat niemand die Broschüre angefordert.</EmptyState>
        ) : (
          <ul className="divide-y">
            {requests.map((request) => (
              <li
                key={request.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{request.company}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {request.contactName} · angefordert {formatDate(request.createdAt)}
                    {request.sentAt ? ` · versendet ${formatDate(request.sentAt)}` : ""}
                  </p>
                  <a
                    href={`mailto:${request.email}?subject=${encodeURIComponent("Ihre Gleistrix-Broschüre")}`}
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
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
