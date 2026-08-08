import { Clock3, KeyRound, LogIn } from "lucide-react";

import { formatDateTime } from "@/components/admin/ui";
import type {
  TenantActivityResult,
  TenantInvitationStatus,
} from "@/lib/admin/app-sync";
import { cn } from "@/lib/utils";

type Props = {
  result: TenantActivityResult | null;
  isProvisioned: boolean;
};

function invitationLabel(status: TenantInvitationStatus): string {
  switch (status) {
    case "accepted":
      return "Passwort festgelegt";
    case "pending":
      return "Einladung offen";
    case "expired":
      return "Einladung abgelaufen";
    default:
      return "Keine Einladung vorhanden";
  }
}

export function TenantLoginStatusPill({ result, isProvisioned }: Props) {
  const config = !isProvisioned
    ? { label: "Noch nicht bereit", className: "bg-slate-100 text-slate-600 ring-slate-500/20" }
    : !result?.ok
      ? { label: "Loginstatus unbekannt", className: "bg-slate-100 text-slate-600 ring-slate-500/20" }
      : result.activity.hasLoggedIn
        ? { label: "Angemeldet", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" }
        : { label: "Noch nicht angemeldet", className: "bg-amber-50 text-amber-800 ring-amber-600/20" };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        config.className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {config.label}
    </span>
  );
}

export default function TenantActivityPanel({ result, isProvisioned }: Props) {
  if (!isProvisioned) {
    return (
      <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
        Loginstatus und Aktivitäten sind nach erfolgreicher App-Provisionierung verfügbar.
      </p>
    );
  }

  if (!result?.ok) {
    return (
      <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-inset ring-rose-600/20">
        {result?.error ?? "Der Loginstatus konnte nicht geladen werden."}
      </p>
    );
  }

  const { activity } = result;
  const invitationDetail = activity.invitation.acceptedAt
    ? `am ${formatDateTime(activity.invitation.acceptedAt)}`
    : activity.invitation.expiresAt && activity.invitation.status === "pending"
      ? `gültig bis ${formatDateTime(activity.invitation.expiresAt)}`
      : null;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="size-4" aria-hidden />
            Letzte Anmeldung
          </div>
          <p className="mt-2 font-medium">
            {activity.lastLoginAt ? formatDateTime(activity.lastLoginAt) : "Noch keine Anmeldung"}
          </p>
          {activity.lastLoginUser ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {activity.lastLoginUser.name || activity.lastLoginUser.email}
              {activity.lastLoginUser.name && activity.lastLoginUser.email
                ? ` · ${activity.lastLoginUser.email}`
                : ""}
            </p>
          ) : null}
        </div>

        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <KeyRound className="size-4" aria-hidden />
            Erstzugang
          </div>
          <p className="mt-2 font-medium">{invitationLabel(activity.invitation.status)}</p>
          {invitationDetail ? (
            <p className="mt-1 text-xs text-muted-foreground">{invitationDetail}</p>
          ) : null}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <LogIn className="size-4 text-muted-foreground" aria-hidden />
          <h3 className="text-sm font-medium">Anmeldeaktivitäten</h3>
        </div>

        {activity.activities.length === 0 ? (
          <p className="rounded-lg border border-dashed px-4 py-5 text-center text-sm text-muted-foreground">
            Noch keine erfolgreiche Anmeldung erfasst.
          </p>
        ) : (
          <ul className="divide-y rounded-xl border">
            {activity.activities.map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{entry.description}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {entry.name || entry.email || "Unbekannter Benutzer"}
                    {entry.name && entry.email ? ` · ${entry.email}` : ""}
                    {entry.historical ? " · historischer Zeitstempel" : ""}
                  </p>
                </div>
                <time
                  dateTime={entry.timestamp}
                  className="shrink-0 text-xs tabular-nums text-muted-foreground"
                >
                  {formatDateTime(entry.timestamp)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
