import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import {
  assignPackageAction,
  setCompanyStatusAction,
  setModuleAccessAction,
  setProvisioningStepAction,
} from "@/app/admin/actions";
import {
  CompanyStatusPill,
  EmptyState,
  KeyValue,
  Mono,
  PurchaseStatusPill,
  Section,
  StepStatusPill,
  formatDate,
  formatNumber,
  formatStorage,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { formatPriceEUR } from "@/data/pricing";
import {
  TIER_LABEL,
  effectiveModuleIds,
  moduleCatalog,
  moduleGrantSource,
} from "@/lib/admin/modules";
import { getDraftPricing, getPublishedPricing } from "@/lib/admin/pricing";
import CompanyUsersPanel from "@/components/admin/CompanyUsersPanel";
import NewPurchaseForm from "@/components/admin/NewPurchaseForm";
import SendNotificationForm from "@/components/admin/SendNotificationForm";
import ProvisioningRunForm from "@/components/admin/ProvisioningRunForm";
import SupportAccessForm from "@/components/admin/SupportAccessForm";
import TenantInvitationForm from "@/components/admin/TenantInvitationForm";
import TenantActivityPanel, {
  TenantLoginStatusPill,
} from "@/components/admin/TenantActivityPanel";
import {
  APP_SYNC_ISSUE_TEXT,
  appSyncIssue,
  getTenantActivity,
} from "@/lib/admin/app-sync";
import { mailConfigIssue } from "@/lib/admin/mail";
import { MINIO_ISSUE_TEXT, minioIssue } from "@/lib/admin/provision/minio";
import { MONGO_ADMIN_ISSUE_TEXT, mongoAdminIssue } from "@/lib/admin/provision/mongo";
import { INVITE_FALLBACK_TEMPLATE } from "@/lib/admin/notification-templates";
import {
  getCompany,
  getPackage,
  getPurchasesForCompany,
  getSupportAccess,
  getUsage,
  listCompanyUsers,
  listNotificationTemplates,
  readStore,
} from "@/lib/admin/store";
import { supportAccountEmail, supportConfigIssue } from "@/lib/admin/support";
import { APP_URL } from "@/lib/admin/tenant";

type Props = { params: Promise<{ id: string }> };

const CONTROL_CLASS =
  "h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const company = await getCompany(id);
  return { title: company?.name ?? "Unternehmen" };
}

export default async function CompanyDetailPage({ params }: Props) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) notFound();
  const appSyncDone = company.provisioning.some(
    (step) => step.id === "app-sync" && step.status === "done",
  );

  // Welcher Schritt sich nicht automatisch ausfuehren laesst und warum. Fehlt
  // ein Zugang, steht der Hinweis statt des Knopfes – ein Klick ins Leere waere
  // schlimmer als gar kein Knopf.
  const mongoBlocker = mongoAdminIssue();
  const minioBlocker = minioIssue();
  const syncBlocker = appSyncIssue();
  const stepBlockers: Record<string, string | undefined> = {
    "mongo-database": mongoBlocker ? MONGO_ADMIN_ISSUE_TEXT[mongoBlocker] : undefined,
    "mongo-role": mongoBlocker ? MONGO_ADMIN_ISSUE_TEXT[mongoBlocker] : undefined,
    "minio-bucket": minioBlocker ? MINIO_ISSUE_TEXT[minioBlocker] : undefined,
    "app-sync": syncBlocker ? APP_SYNC_ISSUE_TEXT[syncBlocker] : undefined,
  };

  const [
    pkg,
    usage,
    store,
    supportLog,
    pricing,
    publishedPricing,
    purchases,
    tenantActivity,
    companyUsers,
    templates,
  ] = await Promise.all([
      getPackage(company.packageId),
      getUsage(company.id),
      readStore(),
      getSupportAccess(company.id),
      // Entwurfsstand: der Admin soll auch noch nicht freigegebene Module sehen.
      getDraftPricing(),
      // Für den Kauf dagegen der freigegebene Stand – ein Kauf darf sich nicht auf
      // ein Paket beziehen, das noch niemand sehen konnte.
      getPublishedPricing(),
      getPurchasesForCompany(company.id),
      appSyncDone ? getTenantActivity(company.slug) : Promise.resolve(null),
      listCompanyUsers(company.id),
      listNotificationTemplates(),
    ]);

  // Die Vorschau im Einladungs-Popup soll zeigen, was tatsächlich rausgeht:
  // die aktive Vorlage aus den Einstellungen, sonst der eingebaute Text.
  const inviteTemplate =
    templates.find(
      (template) => template.isActive && template.trigger === "nutzer.eingeladen",
    ) ?? INVITE_FALLBACK_TEMPLATE;

  const selectablePackages = store.packages.filter(
    (p) => p.isPublished || p.id === company.packageId,
  );
  const catalog = moduleCatalog(pricing);
  const activeModules = effectiveModuleIds(pricing, company, pkg);
  const isSuspended = company.status === "suspended";
  const isProvisioned = company.status !== "provisioning";
  const hasLoggedIn = tenantActivity?.ok ? tenantActivity.activity.hasLoggedIn : false;
  const invitationAccepted = tenantActivity?.ok
    ? tenantActivity.activity.invitation.status === "accepted"
    : false;
  const canSendInvitation =
    appSyncDone && Boolean(tenantActivity?.ok) && !hasLoggedIn && !invitationAccepted;
  const invitationCompletionHint = hasLoggedIn
    ? "Der Erstzugang ist abgeschlossen; das Unternehmen hat sich bereits angemeldet."
    : invitationAccepted
      ? "Das Passwort wurde bereits festgelegt. Die erste Anmeldung steht noch aus."
      : appSyncDone && !tenantActivity?.ok
        ? "Der Einladungsstatus ist derzeit nicht prüfbar; der Neuversand bleibt vorsorglich deaktiviert."
        : undefined;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/unternehmen"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Alle Unternehmen
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{company.name}</h1>
          <CompanyStatusPill status={company.status} />
          <TenantLoginStatusPill result={tenantActivity} isProvisioned={appSyncDone} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {company.contactName ? `${company.contactName} · ` : ""}
          {company.contactEmail} · seit {formatDate(company.createdAt)}
        </p>
      </div>

      {isSuspended ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          <strong className="font-medium">Zugang gesperrt.</strong>{" "}
          {company.suspendedReason ?? "Ohne Angabe"} – alle Module sind für diesen Mandanten
          deaktiviert.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Mandant & Infrastruktur"
          description="Feste Namen, aus der Kennung abgeleitet. Die Anwendung ist für alle Mandanten dieselbe."
        >
          <dl>
            <KeyValue label="Kennung" value={<Mono>{company.slug}</Mono>} />
            <KeyValue
              label="Anwendung"
              value={
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline"
                >
                  <Mono>{APP_URL.replace(/^https?:\/\//, "")}</Mono>
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
              }
            />
            <KeyValue
              label="MongoDB-Datenbank"
              value={<Mono>{company.tenant.mongoDatabase}</Mono>}
            />
            <KeyValue label="MongoDB-Benutzer" value={<Mono>{company.tenant.mongoUser}</Mono>} />
            <KeyValue label="MinIO-Bucket" value={<Mono>{company.tenant.minioBucket}</Mono>} />
            <KeyValue label="Benutzerplätze" value={formatNumber(company.seats)} />
          </dl>
        </Section>

        <Section
          title="Paket"
          description="Nur freigegebene Pakete lassen sich zuweisen."
          action={
            pkg ? (
              <span className="text-sm font-medium">
                {formatPriceEUR(pkg.monthlyPrice)} / Monat
              </span>
            ) : null
          }
        >
          <form action={assignPackageAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="companyId" value={company.id} />
            <div className="min-w-48 flex-1 space-y-2">
              <label htmlFor="packageId" className="text-sm font-medium">
                Zugewiesenes Paket
              </label>
              <select
                id="packageId"
                name="packageId"
                defaultValue={company.packageId ?? ""}
                className={`${CONTROL_CLASS} w-full`}
              >
                <option value="">Ohne Paket</option>
                {selectablePackages.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                    {option.isPublished ? "" : " (nicht freigegeben)"}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="outline">
              Übernehmen
            </Button>
          </form>

          {pkg ? (
            <dl className="mt-4">
              <KeyValue label="Enthaltene Benutzer" value={formatNumber(pkg.includedSeats)} />
              <KeyValue label="Projektlimit" value={formatNumber(pkg.projectLimit)} />
              <KeyValue label="Module im Paket" value={formatNumber(pkg.moduleIds.length)} />
            </dl>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Ohne Paket sind nur einzeln freigegebene Module nutzbar.
            </p>
          )}
        </Section>
      </div>

      <Section
        title="Provisionierung"
        description="Ressourcen dieses Mandanten. Solange die Zugangsdaten fehlen, werden die Schritte manuell quittiert."
      >
        <ul className="divide-y">
          {company.provisioning.map((step) => (
            <li
              key={step.id}
              className="flex flex-wrap items-start justify-between gap-3 py-4 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{step.label}</span>
                  <StepStatusPill status={step.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{step.note}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Ziel: <Mono>{step.target}</Mono>
                  {process.env[step.requiredEnv] ? null : (
                    <>
                      {" · benötigt "}
                      <Mono>{step.requiredEnv}</Mono>
                    </>
                  )}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <ProvisioningRunForm
                  companyId={company.id}
                  stepId={step.id}
                  disabledHint={stepBlockers[step.id]}
                />
              </div>

              <div className="flex gap-2">
                {step.status === "done" ? (
                  <form action={setProvisioningStepAction}>
                    <input type="hidden" name="companyId" value={company.id} />
                    <input type="hidden" name="stepId" value={step.id} />
                    <input type="hidden" name="status" value="pending" />
                    <Button type="submit" size="sm" variant="ghost">
                      Zurücksetzen
                    </Button>
                  </form>
                ) : (
                  <form action={setProvisioningStepAction}>
                    <input type="hidden" name="companyId" value={company.id} />
                    <input type="hidden" name="stepId" value={step.id} />
                    <input type="hidden" name="status" value="done" />
                    <Button type="submit" size="sm" variant="outline">
                      Erledigt
                    </Button>
                  </form>
                )}
                {step.status !== "failed" ? (
                  <form action={setProvisioningStepAction}>
                    <input type="hidden" name="companyId" value={company.id} />
                    <input type="hidden" name="stepId" value={step.id} />
                    <input type="hidden" name="status" value="failed" />
                    <Button type="submit" size="sm" variant="ghost">
                      Fehlgeschlagen
                    </Button>
                  </form>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Erstzugang & Anmeldung"
        description="Einladung, Passwortstatus und erfolgreiche Anmeldungen dieses Mandanten."
      >
        <TenantActivityPanel result={tenantActivity} isProvisioned={appSyncDone} />
        <div className="my-5 border-t" />
        <TenantInvitationForm
          companyId={company.id}
          email={company.contactEmail}
          isProvisioned={appSyncDone}
          canSend={canSendInvitation}
          completionHint={invitationCompletionHint}
          disabledHint={canSendInvitation ? (mailConfigIssue() ?? undefined) : undefined}
        />
      </Section>

      <Section
        title={`Nutzer (${companyUsers.length})`}
        description="Weitere Benutzer dieses Mandanten. Sie werden in der Gleistrix-App angelegt und erhalten einen einmaligen Link zur Passwortvergabe."
      >
        <CompanyUsersPanel
          companyId={company.id}
          companyName={company.name}
          contactName={company.contactName}
          users={companyUsers}
          canInvite={appSyncDone}
          disabledHint={
            appSyncDone
              ? undefined
              : "Nutzer lassen sich einladen, sobald der Mandant erfolgreich an die App gemeldet wurde."
          }
          inviteTemplate={inviteTemplate}
        />
      </Section>

      <Section
        title="Benachrichtigung senden"
        description="Verschickt eine Vorlage aus den Einstellungen an den Ansprechpartner oder einen eingeladenen Nutzer."
      >
        <SendNotificationForm
          companyId={company.id}
          companyName={company.name}
          contactName={company.contactName}
          contactEmail={company.contactEmail}
          templates={templates}
          recipients={companyUsers.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
          }))}
        />
      </Section>

      <Section
        title="Käufe"
        description={
          "Der Monatspreis wird beim Erfassen eingefroren. Gemeldet wird er mit dem Schritt " +
          "„Mandant an die App melden“."
        }
      >
        {purchases.length > 0 ? (
          <ul className="mb-6 divide-y">
            {purchases.map((purchase) => (
              <li key={purchase.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
                <div className="min-w-0">
                  <Link
                    href={`/admin/kaeufe/${purchase.id}`}
                    className="text-sm font-medium underline-offset-4 hover:underline"
                  >
                    {purchase.kind === "zubuchung"
                      ? "Zubuchung aus der App"
                      : (publishedPricing.packages.find((entry) => entry.id === purchase.packageId)
                          ?.name ?? purchase.packageId)}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {/* Benutzerzahl nur beim Grundkauf – eine Zubuchung sagt
                        dazu nichts, „0 Benutzer" wäre irreführend. */}
                    {purchase.kind === "paket"
                      ? `${formatNumber(purchase.users)} Benutzer · `
                      : ""}
                    {purchase.moduleIds.length}{" "}
                    {purchase.moduleIds.length === 1 ? "Modul" : "Module"} ·{" "}
                    {formatDate(purchase.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm tabular-nums">
                    {formatPriceEUR(purchase.monthlyTotal)} / Monat
                  </span>
                  <PurchaseStatusPill status={purchase.status} />
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        <NewPurchaseForm
          companyId={company.id}
          pricing={publishedPricing}
          defaultUsers={company.seats}
        />
      </Section>

      <Section
        title={`Module (${activeModules.length} aktiv)`}
        description="Paketumfang plus Einzelfreigaben, abzüglich gesperrter Module."
      >
        <ul className="grid gap-2 lg:grid-cols-2">
          {catalog.map((module) => {
            const source = moduleGrantSource(module.id, company, pkg);
            const isActive = activeModules.includes(module.id);
            const label =
              source === "package"
                ? "Im Paket enthalten"
                : source === "extra"
                  ? "Einzeln freigegeben"
                  : source === "blocked"
                    ? "Gesperrt"
                    : "Nicht freigegeben";

            return (
              <li
                key={module.id}
                className="flex items-start justify-between gap-3 rounded-lg border px-3.5 py-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{module.title}</span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                      {TIER_LABEL[module.tier]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {label}
                    {isActive ? "" : " · inaktiv"}
                  </p>
                </div>

                <div className="flex shrink-0 gap-1.5">
                  {source !== "package" && source !== "extra" ? (
                    <form action={setModuleAccessAction}>
                      <input type="hidden" name="companyId" value={company.id} />
                      <input type="hidden" name="moduleId" value={module.id} />
                      <input type="hidden" name="mode" value="grant" />
                      <Button type="submit" size="sm" variant="outline">
                        Freigeben
                      </Button>
                    </form>
                  ) : null}
                  {source === "blocked" ? (
                    <form action={setModuleAccessAction}>
                      <input type="hidden" name="companyId" value={company.id} />
                      <input type="hidden" name="moduleId" value={module.id} />
                      <input type="hidden" name="mode" value="reset" />
                      <Button type="submit" size="sm" variant="outline">
                        Entsperren
                      </Button>
                    </form>
                  ) : (
                    <form action={setModuleAccessAction}>
                      <input type="hidden" name="companyId" value={company.id} />
                      <input type="hidden" name="moduleId" value={module.id} />
                      <input type="hidden" name="mode" value="block" />
                      <Button type="submit" size="sm" variant="ghost">
                        Sperren
                      </Button>
                    </form>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title="Nutzung" description="Verbrauch je Monat – Basis für Tracking und Abrechnung.">
        {usage.length === 0 ? (
          <EmptyState>Für diesen Mandanten liegen noch keine Nutzungsdaten vor.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Monat</th>
                  <th className="pb-2 pr-4 text-right font-medium">Nutzer</th>
                  <th className="pb-2 pr-4 text-right font-medium">Projekte</th>
                  <th className="pb-2 pr-4 text-right font-medium">Speicher</th>
                  <th className="pb-2 text-right font-medium">API-Aufrufe</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {usage.map((entry) => (
                  <tr key={entry.month}>
                    <td className="py-2.5 pr-4">{entry.month}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section
        title="Support-Zugriff"
        description="Anmeldung in der Kundeninstanz als globaler Gleistrix-Support – getrennt vom Control-Plane-Konto und nur mit eigenem Passwort."
      >
        <SupportAccessForm
          companyId={company.id}
          supportEmail={supportAccountEmail()}
          configIssue={supportConfigIssue()}
          isProvisioned={isProvisioned}
        />

        {supportLog.length > 0 ? (
          <div className="mt-5 border-t pt-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Letzte Zugriffe
            </h3>
            <ul className="mt-2 divide-y">
              {supportLog.slice(0, 8).map((entry) => (
                <li key={entry.id} className="flex flex-wrap justify-between gap-2 py-2 text-sm">
                  <span>
                    <span className="font-medium">{entry.actor}</span>
                    <span className="text-muted-foreground"> — {entry.reason}</span>
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString("de-DE")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>

      <Section
        title="Zugang"
        description="Eine Sperre deaktiviert sofort alle Module, lässt Daten und Ressourcen aber unangetastet."
        className="border-rose-200"
      >
        {isSuspended ? (
          <form action={setCompanyStatusAction} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="companyId" value={company.id} />
            <input type="hidden" name="status" value="active" />
            <Button type="submit" variant="outline">
              Sperre aufheben
            </Button>
            <p className="text-sm text-muted-foreground">
              Der Mandant kann die Anwendung danach wieder nutzen.
            </p>
          </form>
        ) : (
          <form action={setCompanyStatusAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="companyId" value={company.id} />
            <input type="hidden" name="status" value="suspended" />
            <div className="min-w-56 flex-1 space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Grund der Sperre
              </label>
              <input
                id="reason"
                name="reason"
                placeholder="z. B. Zahlungsrückstand"
                className={`${CONTROL_CLASS} w-full`}
              />
            </div>
            <Button type="submit" variant="destructive">
              Zugang sperren
            </Button>
          </form>
        )}
      </Section>
    </div>
  );
}
