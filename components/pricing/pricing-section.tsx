"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Boxes,
  Building2,
  CalendarClock,
  ChartNoAxesCombined,
  Check,
  Code2,
  Copy,
  FileArchive,
  FileSearch,
  Mail,
  Minus,
  Network,
  PackageCheck,
  PanelsTopLeft,
  Plus,
  ReceiptText,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  Umbrella,
  Users,
  Warehouse,
  Workflow,
} from "lucide-react";
import {
  AI_MODULE,
  ARTICLE_PRICE,
  BASE_FEATURES,
  BASE_PRICE,
  COMPLEX_MODULES,
  EXTRA_USER_PRICE,
  INTEGRATION_CATEGORIES,
  PRICING_INTEGRATIONS,
  PROJECT_CAPACITIES,
  STANDARD_MODULES,
  formatPriceEUR,
  type ConfigurableModule,
  type PricingIntegration,
} from "@/data/pricing";

const STANDARD_ICONS: Record<string, LucideIcon> = {
  material: Boxes,
  absence: Umbrella,
  vehicles: Truck,
  qualifications: BadgeCheck,
  "employee-documents": FileArchive,
  clients: Building2,
  subcontractors: Network,
  deadlines: CalendarClock,
  templates: Copy,
};

const COMPLEX_ICONS: Record<string, LucideIcon> = {
  "operations-board": PanelsTopLeft,
  billing: ReceiptText,
  warehouse: Warehouse,
  finance: ChartNoAxesCombined,
};

const DEVELOPMENT_AREAS = [
  { icon: Workflow, title: "Individuelle Workflows", text: "Freigaben, Eskalationen und Abläufe passend zu deinem Betrieb." },
  { icon: Code2, title: "Eigene Tools", text: "Spezielle Funktionen für Anforderungen, die kein Standardmodul abdeckt." },
  { icon: Network, title: "Schnittstellen", text: "API-Anbindungen, Importe und Übergaben zu vorhandenen Systemen." },
  { icon: ShieldCheck, title: "Datenmigration", text: "Strukturierte Übernahme aus Tabellen, Altsystemen und Ablagen." },
] as const;

const IMPLEMENTATION_SERVICES = [
  "Unternehmensaccount einrichten",
  "Rollen und Berechtigungen konfigurieren",
  "Stammdaten und gebuchte Module anlegen",
  "Projekt- und Dokumentenstrukturen anpassen",
  "Administratoren einführen und schulen",
  "Produktivstart persönlich begleiten",
] as const;

const MIN_USERS = 1;
const ARTICLE_RANGE_MAX = 10000;

function toggleItem(items: string[], id: string) {
  return items.includes(id) ? items.filter((item) => item !== id) : [...items, id];
}

function SectionTitle({
  title,
  description,
  id,
}: {
  title: string;
  description: string;
  id: string;
}) {
  return (
    <div className="max-w-3xl">
      <h2 id={id} className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">{description}</p>
    </div>
  );
}

function ModuleCard({
  module,
  selected,
  onToggle,
  icon: Icon,
}: {
  module: ConfigurableModule;
  selected: boolean;
  onToggle: () => void;
  icon: LucideIcon;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`group flex min-h-64 w-full flex-col rounded-2xl border p-5 text-left transition duration-200 active:scale-[0.99] sm:p-6 ${
        selected
          ? "border-indigo-500 bg-indigo-50 shadow-[0_16px_40px_-24px_rgba(79,70,229,0.55)]"
          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-soft-sm"
      }`}
    >
      <span className="flex w-full items-start justify-between gap-4">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            selected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <span
          aria-hidden="true"
          className={`flex h-6 w-6 items-center justify-center rounded-lg border ${
            selected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 bg-white text-transparent"
          }`}
        >
          <Check className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </span>

      <strong className="mt-5 text-lg font-semibold tracking-tight text-slate-950">{module.title}</strong>
      <span className="mt-2 text-sm leading-relaxed text-slate-600">{module.description}</span>
      <span className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
        {module.features.map((feature) => (
          <span key={feature} className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-indigo-600" strokeWidth={2.4} />
            {feature}
          </span>
        ))}
      </span>
      <span className="mt-auto pt-5 text-sm font-semibold text-indigo-700">+ {formatPriceEUR(module.price)} / Monat</span>
    </button>
  );
}

function PricingHero() {
  return (
    <section className="relative overflow-hidden bg-[#f8fafc] pb-16 pt-28 md:pb-20 md:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-56 h-[620px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.16),transparent)]" />
        <div className="absolute -left-48 bottom-0 h-[420px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(79,70,229,0.08),transparent)]" />
      </div>

      <div className="page-container relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-indigo-700">
            Modular und transparent
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.02]">
            Preise, die mit deinem Betrieb wachsen.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Wähle Nutzer, Projektvolumen und Module. Dein Monats- und Einführungspreis aktualisiert sich sofort.
          </p>
          <div className="mt-8">
            <Link
              href="#konfigurator"
              className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-soft-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Preis konfigurieren
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-slate-200 pt-6">
            <div>
              <dt className="text-xs leading-snug text-slate-500">Basispaket</dt>
              <dd className="mt-1 text-lg font-bold text-slate-950">150 €</dd>
            </div>
            <div>
              <dt className="text-xs leading-snug text-slate-500">Implementierung ab</dt>
              <dd className="mt-1 text-lg font-bold text-slate-950">990 €</dd>
            </div>
            <div>
              <dt className="text-xs leading-snug text-slate-500">Abrechnung</dt>
              <dd className="mt-1 text-lg font-bold text-slate-950">Netto</dd>
            </div>
          </dl>
        </div>

        <figure className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-white bg-white shadow-[0_32px_100px_-40px_rgba(15,23,42,0.3)]">
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-indigo-50 to-slate-100">
            <Image
              src="/ChatGPT Image 22. Juli 2026, 15_44_00.png"
              alt="Gleistrix Maskottchen mit digitaler Streckenplanung"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="object-contain object-center"
            />
          </div>
          <figcaption className="grid grid-cols-[auto_1fr] items-center gap-4 border-t border-slate-200 px-5 py-4 sm:px-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <PackageCheck className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <span>
              <strong className="block text-sm font-semibold text-slate-950">Nur bezahlen, was du wirklich nutzt</strong>
              <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">Jede Position bleibt im Konfigurator nachvollziehbar.</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function PricingConfigurator() {
  const [users, setUsers] = useState(1);
  const [capacityId, setCapacityId] = useState(PROJECT_CAPACITIES[0].id);
  const [standardIds, setStandardIds] = useState<string[]>([]);
  const [complexIds, setComplexIds] = useState<string[]>([]);
  const [aiSelected, setAiSelected] = useState(false);
  const [articles, setArticles] = useState(0);

  const capacity = PROJECT_CAPACITIES.find((item) => item.id === capacityId) ?? PROJECT_CAPACITIES[0];
  const warehouseSelected = complexIds.includes("warehouse");
  const additionalUsersPrice = Math.max(0, users - 1) * EXTRA_USER_PRICE;
  const standardTotal = STANDARD_MODULES.filter((module) => standardIds.includes(module.id)).reduce(
    (total, module) => total + module.price,
    0
  );
  const complexTotal = COMPLEX_MODULES.filter((module) => complexIds.includes(module.id)).reduce(
    (total, module) => total + module.price,
    0
  );
  const warehouseUsageTotal = warehouseSelected ? articles * ARTICLE_PRICE : 0;
  const monthlyTotal =
    BASE_PRICE +
    additionalUsersPrice +
    capacity.monthlySurcharge +
    standardTotal +
    complexTotal +
    (aiSelected ? AI_MODULE.price : 0) +
    warehouseUsageTotal;

  const selectedModules = [
    ...STANDARD_MODULES.filter((module) => standardIds.includes(module.id)),
    ...COMPLEX_MODULES.filter((module) => complexIds.includes(module.id)),
    ...(aiSelected ? [AI_MODULE] : []),
  ];

  const requestParams = new URLSearchParams({
    source: "pricing-configurator",
    users: users.toString(),
    capacity: capacity.projects.toString(),
    monthly: monthlyTotal.toFixed(2),
  });
  if (selectedModules.length) requestParams.set("modules", selectedModules.map((module) => module.id).join(","));
  if (warehouseSelected && articles > 0) requestParams.set("articles", articles.toString());
  const requestHref = `/demo-buchen?${requestParams.toString()}`;

  const resetConfiguration = () => {
    setUsers(1);
    setCapacityId(PROJECT_CAPACITIES[0].id);
    setStandardIds([]);
    setComplexIds([]);
    setAiSelected(false);
    setArticles(0);
  };

  return (
    <section id="konfigurator" aria-labelledby="configurator-title" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="page-container">
        <SectionTitle
          id="configurator-title"
          title="Stelle dein Gleistrix zusammen"
          description="Das Basispaket ist dein Startpunkt. Ergänze genau die Kapazitäten und Funktionen, die dein Team im Alltag braucht."
        />

        <div className="mt-12 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
          <div className="min-w-0 space-y-12">
            <section aria-labelledby="base-package-title" className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
                <div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700">
                    <PackageCheck className="h-4 w-4" strokeWidth={2} />
                    Fester Startpunkt
                  </span>
                  <h3 id="base-package-title" className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                    Basispaket
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                    Die zentrale Gleistrix-Webanwendung mit Projekt-, Mitarbeiter-, Dokumenten- und Rechteverwaltung.
                  </p>
                  <div className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {BASE_FEATURES.map((feature) => (
                      <span key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" strokeWidth={2.4} />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-indigo-200 bg-white p-5">
                  <span className="block text-xs font-medium text-slate-500">Monatlicher Grundpreis</span>
                  <strong className="mt-2 block text-4xl font-bold tracking-tight text-slate-950">{formatPriceEUR(BASE_PRICE)}</strong>
                  <span className="mt-1 block text-xs text-slate-500">inklusive 1 Benutzer und 100 Projekte</span>
                </div>
              </div>
            </section>

            <fieldset>
              <legend className="text-2xl font-bold tracking-tight text-slate-950">Wie viele Benutzer arbeiten mit Gleistrix?</legend>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Ein Benutzer ist inklusive, jeder weitere kostet 10 € pro Monat.</p>
              <div className="mt-5 grid gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-soft-sm">
                    <Users className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span>
                    <strong className="block text-sm font-semibold text-slate-950">Teamgröße</strong>
                    <span className="mt-1 block text-xs text-slate-500">Rollen und sichtbare Funktionen bleiben individuell steuerbar.</span>
                  </span>
                </div>
                <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1.5 shadow-soft-sm">
                  <button
                    type="button"
                    onClick={() => setUsers((current) => Math.max(current - 1, MIN_USERS))}
                    disabled={users === MIN_USERS}
                    aria-label="Einen Benutzer entfernen"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <Minus className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <label className="mx-2 grid min-w-20 justify-items-center">
                    <span className="sr-only">Anzahl Benutzer</span>
                    <input
                      type="number"
                      min={MIN_USERS}
                      value={users}
                      onChange={(event) => setUsers(Math.max(Number(event.target.value) || MIN_USERS, MIN_USERS))}
                      className="w-20 bg-transparent text-center text-xl font-bold text-slate-950 outline-none"
                    />
                    <span className="text-[11px] text-slate-500">Benutzer</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setUsers((current) => current + 1)}
                    aria-label="Einen Benutzer hinzufügen"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-500"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-2xl font-bold tracking-tight text-slate-950">Wie viele Projekte planst du pro Monat?</legend>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Die gewählte Kapazität bestimmt auch den einmaligen Implementierungsumfang.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {PROJECT_CAPACITIES.map((option) => {
                  const selected = option.id === capacityId;
                  return (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setCapacityId(option.id)}
                      key={option.id}
                      className={`flex items-center justify-between gap-5 rounded-2xl border p-5 text-left transition active:scale-[0.99] ${
                        selected
                          ? "border-indigo-500 bg-indigo-50 shadow-[0_14px_36px_-24px_rgba(79,70,229,0.55)]"
                          : "border-slate-200 bg-white hover:border-indigo-200 hover:shadow-soft-sm"
                      }`}
                    >
                      <span>
                        <strong className="block text-base font-semibold text-slate-950">{option.label}</strong>
                        <span className="mt-1 block text-xs text-slate-500">
                          Implementierung {formatPriceEUR(option.implementationPrice)}
                        </span>
                      </span>
                      <span className={`shrink-0 text-sm font-semibold ${selected ? "text-indigo-700" : "text-slate-600"}`}>
                        {option.monthlySurcharge === 0 ? "Inklusive" : `+ ${formatPriceEUR(option.monthlySurcharge)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-2xl font-bold tracking-tight text-slate-950">Standardmodule für deinen Arbeitsalltag</legend>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Jedes Standardmodul kostet 10 € pro Monat und kann später ergänzt werden.</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {STANDARD_MODULES.map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    selected={standardIds.includes(module.id)}
                    onToggle={() => setStandardIds((current) => toggleItem(current, module.id))}
                    icon={STANDARD_ICONS[module.id] ?? Sparkles}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-2xl font-bold tracking-tight text-slate-950">Komplexe Module für durchgängige Prozesse</legend>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Umfangreiche Funktionsbereiche kosten jeweils 25 € pro Monat.</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {COMPLEX_MODULES.map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    selected={complexIds.includes(module.id)}
                    onToggle={() => {
                      setComplexIds((current) => toggleItem(current, module.id));
                      if (module.id === "warehouse" && warehouseSelected) setArticles(0);
                    }}
                    icon={COMPLEX_ICONS[module.id] ?? Sparkles}
                  />
                ))}
              </div>

              {warehouseSelected && (
                <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <label htmlFor="article-count" className="block text-sm font-semibold text-slate-950">
                        Aktiv verwaltete Artikel und QR-Codes
                      </label>
                      <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-600">
                        Kalkuliert mit 0,50 € pro aktiv verwaltetem Artikel und Monat.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        id="article-count"
                        type="number"
                        min={0}
                        step={50}
                        value={articles}
                        onChange={(event) => setArticles(Math.max(Number(event.target.value) || 0, 0))}
                        className="h-11 w-28 rounded-xl border border-indigo-200 bg-white px-3 text-right text-sm font-semibold text-slate-950 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <span className="text-sm font-semibold text-indigo-700">+ {formatPriceEUR(warehouseUsageTotal, true)}</span>
                    </div>
                  </div>
                  <input
                    aria-label="Anzahl aktiv verwalteter Artikel"
                    type="range"
                    min={0}
                    max={ARTICLE_RANGE_MAX}
                    step={50}
                    value={Math.min(articles, ARTICLE_RANGE_MAX)}
                    onChange={(event) => setArticles(Number(event.target.value))}
                    className="mt-5 w-full accent-indigo-600"
                  />
                  <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                    <span>0</span>
                    <span>10.000 Artikel, höhere Werte per Eingabe</span>
                  </div>
                </div>
              )}
            </fieldset>

            <section aria-labelledby="ai-module-title">
              <div
                className={`grid gap-6 rounded-2xl border p-6 transition sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center ${
                  aiSelected ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-slate-950 text-white"
                }`}
              >
                <div>
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${aiSelected ? "bg-indigo-600 text-white" : "bg-white/10 text-indigo-300"}`}>
                    <Bot className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h3 id="ai-module-title" className={`mt-5 text-2xl font-bold tracking-tight ${aiSelected ? "text-slate-950" : "text-white"}`}>
                    KI-Agenten für Dokumente und Projekte
                  </h3>
                  <p className={`mt-3 max-w-2xl text-sm leading-relaxed ${aiSelected ? "text-slate-600" : "text-slate-300"}`}>
                    Analysiere Ausschreibungen, bereite Dokumentationen vor und fasse relevante Projektinformationen automatisch zusammen.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {AI_MODULE.features.map((feature) => (
                      <span key={feature} className={`flex items-start gap-2 text-xs leading-relaxed ${aiSelected ? "text-slate-700" : "text-slate-300"}`}>
                        <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${aiSelected ? "text-indigo-600" : "text-indigo-300"}`} strokeWidth={2.4} />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  aria-pressed={aiSelected}
                  onClick={() => setAiSelected((current) => !current)}
                  className={`inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 text-sm font-semibold transition active:scale-[0.98] ${
                    aiSelected
                      ? "border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-100"
                      : "bg-white text-slate-950 hover:bg-indigo-50"
                  }`}
                >
                  {aiSelected ? <Check className="h-4 w-4" strokeWidth={2.4} /> : <Plus className="h-4 w-4" strokeWidth={2.2} />}
                  {aiSelected ? "Ausgewählt" : `Für ${formatPriceEUR(AI_MODULE.price)} hinzufügen`}
                </button>
              </div>
            </section>
          </div>

          <aside className="xl:sticky xl:top-24" aria-label="Zusammenfassung deiner Konfiguration">
            <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-[0_28px_80px_-36px_rgba(15,23,42,0.75)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-indigo-300">Deine Konfiguration</span>
                  <h3 className="mt-2 text-xl font-bold tracking-tight">Gleistrix nach Maß</h3>
                </div>
                <button
                  type="button"
                  onClick={resetConfiguration}
                  aria-label="Konfiguration zurücksetzen"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={1.8} />
                </button>
              </div>

              <dl className="mt-7 space-y-3 border-b border-white/10 pb-6 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-slate-300">Basispaket</dt>
                  <dd className="font-semibold">{formatPriceEUR(BASE_PRICE)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-slate-300">{users} Benutzer</dt>
                  <dd className="font-semibold">{additionalUsersPrice ? `+ ${formatPriceEUR(additionalUsersPrice)}` : "Inklusive"}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-slate-300">{capacity.shortLabel}</dt>
                  <dd className="font-semibold">{capacity.monthlySurcharge ? `+ ${formatPriceEUR(capacity.monthlySurcharge)}` : "Inklusive"}</dd>
                </div>
              </dl>

              <div className="border-b border-white/10 py-6">
                <span className="text-xs font-semibold text-slate-400">Gewählte Module</span>
                {selectedModules.length ? (
                  <ul className="mt-3 space-y-2.5">
                    {selectedModules.map((module) => (
                      <li key={module.id} className="flex items-baseline justify-between gap-4 text-xs">
                        <span className="text-slate-300">{module.title}</span>
                        <strong className="shrink-0 text-white">+ {formatPriceEUR(module.price)}</strong>
                      </li>
                    ))}
                    {warehouseSelected && articles > 0 && (
                      <li className="flex items-baseline justify-between gap-4 text-xs">
                        <span className="text-slate-300">{articles.toLocaleString("de-DE")} Lagerartikel</span>
                        <strong className="shrink-0 text-white">+ {formatPriceEUR(warehouseUsageTotal, true)}</strong>
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">Noch keine Zusatzmodule ausgewählt.</p>
                )}
              </div>

              <div className="py-6" aria-live="polite">
                <span className="text-xs font-semibold text-slate-400">Gesamt pro Monat</span>
                <strong className="mt-2 block text-4xl font-bold tracking-tight text-white">{formatPriceEUR(monthlyTotal, !Number.isInteger(monthlyTotal))}</strong>
                <span className="mt-1 block text-xs text-slate-400">netto, monatlich kalkuliert</span>
              </div>

              <div className="rounded-xl bg-white/7 p-4">
                <span className="block text-xs text-slate-400">Implementierung einmalig</span>
                <strong className="mt-1 block text-lg font-semibold text-white">{formatPriceEUR(capacity.implementationPrice)}</strong>
                <span className="mt-1 block text-[11px] leading-relaxed text-slate-400">abhängig von deiner Projektkapazität</span>
              </div>

              <Link
                href={requestHref}
                data-analytics="pricing_configurator_cta"
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-indigo-500 px-5 text-sm font-semibold text-white transition hover:bg-indigo-400 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Konfiguration anfragen
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-400">
                Unverbindliche Kalkulation. Individuelle Entwicklungen und Datenmigrationen werden separat angeboten.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ImplementationSection() {
  return (
    <section aria-labelledby="implementation-title" className="bg-slate-50 py-20 md:py-28">
      <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <h2 id="implementation-title" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Sicher vom Setup bis zum Produktivstart
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
            Die einmalige Implementierung richtet sich nach deinem Projektvolumen und umfasst die gemeinsame Einführung in Gleistrix.
          </p>
          <div className="mt-7 space-y-3">
            {PROJECT_CAPACITIES.map((item) => (
              <div key={item.id} className="flex items-baseline justify-between gap-5 border-b border-slate-200 pb-3 text-sm">
                <span className="text-slate-600">{item.label}</span>
                <strong className="shrink-0 text-slate-950">{formatPriceEUR(item.implementationPrice)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft-sm sm:p-8 lg:p-10">
          <h3 className="text-xl font-bold tracking-tight text-slate-950">Was die Einführung abdeckt</h3>
          <div className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {IMPLEMENTATION_SERVICES.map((service) => (
              <div key={service} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
                </span>
                <span className="text-sm leading-relaxed text-slate-700">{service}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 border-t border-slate-200 pt-6 text-xs leading-relaxed text-slate-500">
            Umfangreiche Datenmigrationen, zusätzliche Schnittstellen und individuelle Entwicklungen werden nach Aufwand kalkuliert.
          </p>
        </div>
      </div>
    </section>
  );
}

function IntegrationLogo({ integration }: { integration: PricingIntegration }) {
  if (integration.src && integration.width && integration.height) {
    return (
      <Image
        src={integration.src}
        alt={`${integration.title} Logo`}
        width={integration.width}
        height={integration.height}
        sizes="56px"
        className="h-9 w-14 object-contain"
      />
    );
  }

  return <span className="text-xs font-black tracking-tight text-indigo-700">{integration.initials}</span>;
}

function IntegrationsSection() {
  const [category, setCategory] = useState<(typeof INTEGRATION_CATEGORIES)[number]>("Alle");
  const [query, setQuery] = useState("");

  const filteredIntegrations = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("de-DE");
    return PRICING_INTEGRATIONS.filter((integration) => {
      const matchesCategory = category === "Alle" || integration.category === category;
      const matchesQuery =
        !normalizedQuery ||
        `${integration.title} ${integration.category} ${integration.description}`.toLocaleLowerCase("de-DE").includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <section id="integrationen" aria-labelledby="integrations-title" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="page-container">
        <SectionTitle
          id="integrations-title"
          title="Gleistrix passt in deine Systemlandschaft"
          description="Verbinde Projekt-, Finanz-, Recruiting- und Kommunikationssysteme. Den genauen Schnittstellenumfang stimmen wir im Einführungsprojekt ab."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start lg:gap-10">
          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:sticky lg:top-24" aria-label="Integrationsfilter">
            <label htmlFor="integration-search" className="block text-sm font-semibold text-slate-950">
              Integration suchen
            </label>
            <div className="mt-3 flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <Search className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
              <input
                id="integration-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name oder Bereich"
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="mt-5 space-y-1" aria-label="Kategorien">
              {INTEGRATION_CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                    category === item ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-white hover:text-slate-950"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <h3 className="text-xl font-bold tracking-tight text-slate-950">
                {category === "Alle" ? "Verfügbare Anbindungen" : category}
              </h3>
              <span className="text-xs font-medium text-slate-500" aria-live="polite">
                {filteredIntegrations.length} {filteredIntegrations.length === 1 ? "Integration" : "Integrationen"}
              </span>
            </div>

            {filteredIntegrations.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredIntegrations.map((integration) => (
                  <article key={integration.id} className="flex min-h-60 flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-soft-sm">
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200/70">
                      <IntegrationLogo integration={integration} />
                    </span>
                    <span className="mt-5 text-xs font-medium text-indigo-700">{integration.category}</span>
                    <h4 className="mt-1.5 text-lg font-semibold tracking-tight text-slate-950">{integration.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{integration.description}</p>
                    <span className="mt-auto pt-5 text-xs font-semibold text-slate-500">Umfang auf Anfrage</span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <FileSearch className="mx-auto h-7 w-7 text-indigo-600" strokeWidth={1.8} />
                <h4 className="mt-4 text-base font-semibold text-slate-950">Keine Integration gefunden</h4>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                  Wir können weitere Systeme über API, Import oder einen individuellen Workflow anbinden.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function BrochureSection() {
  return (
    <section aria-labelledby="brochure-title" className="bg-slate-50 py-20 md:py-28">
      <div className="page-container">
        <div className="grid overflow-hidden rounded-2xl border border-indigo-200 bg-indigo-50 shadow-soft-sm lg:grid-cols-[1fr_0.78fr]">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Mail className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h2 id="brochure-title" className="mt-6 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Die Preisübersicht für deine interne Abstimmung
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
              Erhalte Basispaket, Module, Projektkapazitäten und Einführungskosten kompakt als Gleistrix-Broschüre.
            </p>
            <a
              href="mailto:info@gleistrix.com?subject=Gleistrix%20Preisbrosch%C3%BCre%20anfordern"
              className="mt-8 inline-flex h-12 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-500 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Broschüre anfordern
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>

          <figure className="relative min-h-[420px] overflow-hidden bg-slate-900 lg:min-h-[540px]">
            <Image
              src="/pricing-brochure-rail.webp"
              alt="Bauleiter mit Tablet an einer modernen Gleisstrecke"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
              <span className="text-sm font-semibold text-indigo-200">Gleistrix</span>
              <strong className="mt-2 block max-w-sm text-3xl font-bold leading-tight tracking-tight">Preis- und Leistungsübersicht</strong>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function CustomDevelopmentSection() {
  return (
    <section aria-labelledby="custom-development-title" className="bg-white py-20 md:py-28">
      <div className="page-container grid items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
        <div>
          <h2 id="custom-development-title" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            Wenn ein Standardmodul nicht reicht
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Spezielle Tools, Automationen und Schnittstellen entwickeln wir passend zu deinen betrieblichen Abläufen.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {DEVELOPMENT_AREAS.map((area) => (
              <div key={area.title} className="border-l-2 border-indigo-200 pl-4">
                <area.icon className="h-5 w-5 text-indigo-600" strokeWidth={1.8} />
                <h3 className="mt-3 text-base font-semibold text-slate-950">{area.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{area.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
            Individuelle Entwicklungen werden separat angeboten. Vorab klären wir Ziel, Umfang, Schnittstellen und Wartungsbedarf.
          </p>
        </div>

        <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-soft-sm">
          <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src="/Lösungen.png"
              alt="Digitaler Gleistrix-Arbeitsplatz mit Blick auf eine Gleisbaustelle"
              fill
              sizes="(max-width: 1024px) 100vw, 44vw"
              className="object-cover"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}

export default function PricingSection() {
  return (
    <>
      <PricingHero />
      <PricingConfigurator />
      <ImplementationSection />
      <IntegrationsSection />
      <BrochureSection />
      <CustomDevelopmentSection />
    </>
  );
}
