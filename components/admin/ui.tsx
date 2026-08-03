import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type {
  CompanyStatus,
  DemoAccessStatus,
  LeadStatus,
  ProvisioningStatus,
} from "@/types/admin";

/* ------------------------------------------------------------ Formatierung */

const numberFormat = new Intl.NumberFormat("de-DE");

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatStorage(mb: number): string {
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${formatNumber(mb)} MB`;
}

/* ------------------------------------------------------------------ Pillen */

const COMPANY_STATUS: Record<CompanyStatus, { label: string; className: string }> = {
  active: { label: "Aktiv", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  provisioning: { label: "Provisionierung", className: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  suspended: { label: "Gesperrt", className: "bg-rose-50 text-rose-700 ring-rose-600/20" },
};

export function CompanyStatusPill({ status }: { status: CompanyStatus }) {
  const config = COMPANY_STATUS[status];
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

const STEP_STATUS: Record<ProvisioningStatus, { label: string; className: string }> = {
  done: { label: "Erledigt", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  pending: { label: "Offen", className: "bg-slate-100 text-slate-600 ring-slate-500/20" },
  failed: { label: "Fehlgeschlagen", className: "bg-rose-50 text-rose-700 ring-rose-600/20" },
};

export function StepStatusPill({ status }: { status: ProvisioningStatus }) {
  const config = STEP_STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

const LEAD_STATUS: Record<LeadStatus, { label: string; className: string }> = {
  neu: { label: "Neu", className: "bg-sky-50 text-sky-700 ring-sky-600/20" },
  "in-kontakt": { label: "In Kontakt", className: "bg-slate-100 text-slate-600 ring-slate-500/20" },
  termin: { label: "Termin", className: "bg-violet-50 text-violet-700 ring-violet-600/20" },
  gewonnen: { label: "Gewonnen", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  verloren: { label: "Verloren", className: "bg-rose-50 text-rose-700 ring-rose-600/20" },
};

export function LeadStatusPill({ status }: { status: LeadStatus }) {
  const config = LEAD_STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

const DEMO_STATUS: Record<DemoAccessStatus, { label: string; className: string }> = {
  angefragt: { label: "Angefragt", className: "bg-slate-100 text-slate-600 ring-slate-500/20" },
  aktiv: { label: "Aktiv", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  widerrufen: { label: "Widerrufen", className: "bg-slate-100 text-slate-600 ring-slate-500/20" },
  fehlgeschlagen: { label: "Fehlgeschlagen", className: "bg-rose-50 text-rose-700 ring-rose-600/20" },
};

export function DemoStatusPill({ status }: { status: DemoAccessStatus }) {
  const config = DEMO_STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

/* --------------------------------------------------------------- Bausteine */

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  href?: string;
};

export function StatCard({ label, value, hint, href }: StatCardProps) {
  const body = (
    <>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
    </>
  );

  const className = cn(
    "block rounded-xl border bg-card p-5 shadow-soft-sm transition-colors",
    href && "hover:border-primary/40",
  );

  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

type SectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Section({ title, description, action, children, className }: SectionProps) {
  return (
    <section className={cn("rounded-xl border bg-card shadow-soft-sm", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

export function KeyValue({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b py-2.5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}

export function Mono({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px]">{children}</code>
  );
}
