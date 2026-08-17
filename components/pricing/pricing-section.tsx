"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Code2,
  FileSearch,
  Mail,
  Minus,
  Network,
  PackageCheck,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";
import {
  calculatePrice,
  defaultCapacity,
  defaultPackage,
  formatPriceEUR,
  modulesByTier,
} from "@/data/pricing";
import MediaFrame from "@/components/media/MediaFrame";
import { moduleIcon } from "@/lib/pricing/icons";
import type {
  PricingConfig,
  PricingIntegration,
  PricingModule,
  PricingPackage,
} from "@/types/pricing";

/** Individualentwicklung ist kein Preisbestandteil und bleibt bewusst im Code. */
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

function toggleItem(items: string[], id: string) {
  return items.includes(id) ? items.filter((item) => item !== id) : [...items, id];
}

/** Ganzzahlige Menge aus einem Zahlenfeld – „1,5 Benutzer" gibt es nicht. */
function toCount(value: string, min: number) {
  return Math.max(Math.floor(Number(value)) || min, min);
}

/** Preisniveau einer Modulstufe: einheitlich („kostet X") oder gestaffelt („ab X"). */
function tierPricing(modules: PricingModule[]) {
  if (!modules.length) return undefined;
  const lowest = Math.min(...modules.map((module) => module.price));
  return { lowest, uniform: modules.every((module) => module.price === lowest) };
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
}: {
  module: PricingModule;
  selected: boolean;
  onToggle: () => void;
}) {
  const Icon = moduleIcon(module.iconKey);

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

      {module.imageSrc ? (
        <span className="relative mt-5 block aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={module.imageSrc}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover"
          />
        </span>
      ) : null}

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
      {module.extras.length > 0 && (
        <span className="mt-3 flex flex-wrap gap-1.5">
          {module.extras.map((extra) => (
            <span
              key={extra}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
            >
              {extra}
            </span>
          ))}
        </span>
      )}
      <span className="mt-auto pt-5 text-sm font-semibold text-indigo-700">+ {formatPriceEUR(module.price)} / Monat</span>
    </button>
  );
}

/** Auswählbares Paket – visuell an den Projektkapazitäten ausgerichtet. */
function PackageCard({
  pkg,
  selected,
  onSelect,
}: {
  pkg: PricingPackage;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex flex-col gap-4 rounded-2xl border p-5 text-left transition active:scale-[0.99] ${
        selected
          ? "border-indigo-500 bg-indigo-50 shadow-[0_14px_36px_-24px_rgba(79,70,229,0.55)]"
          : "border-slate-200 bg-white hover:border-indigo-200 hover:shadow-soft-sm"
      }`}
    >
      <span className="flex items-start justify-between gap-5">
        <span>
          <strong className="block text-base font-semibold text-slate-950">{pkg.name}</strong>
          <span className="mt-1 block text-xs leading-relaxed text-slate-600">{pkg.description}</span>
        </span>
        <span className={`shrink-0 text-sm font-semibold ${selected ? "text-indigo-700" : "text-slate-600"}`}>
          {formatPriceEUR(pkg.price)}
        </span>
      </span>
      <span className="block text-xs text-slate-500">
        {pkg.includedUsers} Benutzer inklusive · Implementierung {formatPriceEUR(pkg.implementationPrice)}
      </span>
      {pkg.features.length > 0 && (
        <span className="mt-auto grid gap-1.5">
          {pkg.features.map((feature) => (
            <span key={feature} className="flex items-start gap-2 text-xs text-slate-700">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-600" strokeWidth={2.4} />
              {feature}
            </span>
          ))}
        </span>
      )}
    </button>
  );
}

/**
 * Mengenabhängiger Zusatzpreis eines Moduls (früher fest das Lagermodul).
 *
 * Führend ist das Zahlenfeld: der Regler bildet nur den Bereich bis `sliderMax`
 * ab und ist darüber gesperrt, damit ein höherer getippter Wert nicht durch eine
 * Berührung des Reglers stillschweigend zurückfällt.
 */
function UsagePanel({
  module,
  amount,
  onChange,
}: {
  module: PricingModule;
  amount: number;
  onChange: (amount: number) => void;
}) {
  const usage = module.usage;
  if (!usage) return null;

  const inputId = `usage-${module.id}`;
  const withinSlider = amount <= usage.sliderMax;

  return (
    <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label htmlFor={inputId} className="block text-sm font-semibold text-slate-950">
            {usage.label}
          </label>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-600">
            {formatPriceEUR(usage.unitPrice, true)} – {usage.hint}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            id={inputId}
            type="number"
            min={0}
            step={usage.step}
            value={amount}
            onChange={(event) => onChange(toCount(event.target.value, 0))}
            className="h-11 w-28 rounded-xl border border-indigo-200 bg-white px-3 text-right text-sm font-semibold text-slate-950 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          {amount > 0 && (
            <span className="text-sm font-semibold text-indigo-700">+ {formatPriceEUR(amount * usage.unitPrice, true)}</span>
          )}
        </div>
      </div>
      <input
        aria-label={`${usage.label} – Schieberegler`}
        type="range"
        min={0}
        max={usage.sliderMax}
        step={usage.step}
        value={withinSlider ? amount : usage.sliderMax}
        disabled={!withinSlider}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-5 w-full accent-indigo-600 disabled:opacity-40"
      />
      <div className="mt-2 flex justify-between text-[11px] text-slate-500">
        <span>0</span>
        <span>
          {withinSlider
            ? `${usage.sliderMax.toLocaleString("de-DE")} über den Regler, höhere Werte per Eingabe`
            : `Über ${usage.sliderMax.toLocaleString("de-DE")} nur per Eingabe änderbar`}
        </span>
      </div>
    </div>
  );
}

function PricingHero({ config }: { config: PricingConfig }) {
  // Grund- und Implementierungspreis hängen jetzt am Paket. Bei mehreren Paketen
  // zeigt der Hero jeweils den günstigsten Einstieg.
  const hasPackages = config.packages.length > 0;
  const cheapestPrice = hasPackages ? Math.min(...config.packages.map((pkg) => pkg.price)) : undefined;
  const cheapestImplementation = hasPackages
    ? Math.min(...config.packages.map((pkg) => pkg.implementationPrice))
    : undefined;

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] pb-16 pt-28 md:pb-20 md:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-56 h-[620px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.16),transparent)]" />
        <div className="absolute -left-48 bottom-0 h-[420px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(79,70,229,0.08),transparent)]" />
      </div>

      <div className="page-container relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-indigo-700">
            {config.texts.heroEyebrow}
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.02]">
            {config.texts.heroTitle}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {config.texts.heroDescription}
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
            {cheapestPrice !== undefined && (
              <div>
                <dt className="text-xs leading-snug text-slate-500">
                  {config.packages.length > 1 ? "Grundpreis ab" : "Basispaket"}
                </dt>
                <dd className="mt-1 text-lg font-bold text-slate-950">{formatPriceEUR(cheapestPrice)}</dd>
              </div>
            )}
            {cheapestImplementation !== undefined && (
              <div>
                <dt className="text-xs leading-snug text-slate-500">Implementierung ab</dt>
                <dd className="mt-1 text-lg font-bold text-slate-950">{formatPriceEUR(cheapestImplementation)}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs leading-snug text-slate-500">Abrechnung</dt>
              <dd className="mt-1 text-lg font-bold text-slate-950">Netto</dd>
            </div>
          </dl>
        </div>

        <figure className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-white bg-white shadow-[0_32px_100px_-40px_rgba(15,23,42,0.3)]">
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-indigo-50 to-slate-100">
            <Image
              src="/preise-vorschau.webp"
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

function PricingConfigurator({ config }: { config: PricingConfig }) {
  const standardModules = modulesByTier(config, "standard");
  const complexModules = modulesByTier(config, "complex");
  const aiModules = modulesByTier(config, "ai");
  const baseCapacity = defaultCapacity(config);
  const basePackage = defaultPackage(config);

  const [packageId, setPackageId] = useState(basePackage?.id ?? "");
  const [users, setUsers] = useState(MIN_USERS);
  const [capacityId, setCapacityId] = useState(baseCapacity?.id ?? "");
  const [moduleIds, setModuleIds] = useState<string[]>([]);
  const [usageAmounts, setUsageAmounts] = useState<Record<string, number>>({});

  const capacity = config.capacities.find((item) => item.id === capacityId) ?? baseCapacity;
  const pkg = config.packages.find((item) => item.id === packageId) ?? basePackage;
  const selectedModules = config.modules.filter(
    (module) => module.isActive && moduleIds.includes(module.id),
  );
  const breakdown = calculatePrice(config, { packageId, users, capacityId, moduleIds, usageAmounts });

  const standardPricing = tierPricing(standardModules);
  const complexPricing = tierPricing(complexModules);
  const includedUsers = pkg?.includedUsers ?? 0;
  const includedUsersNote =
    includedUsers === 1 ? "Ein Benutzer ist inklusive" : `${includedUsers} Benutzer sind inklusive`;

  const setUsageAmount = (moduleId: string, amount: number) =>
    setUsageAmounts((current) => ({ ...current, [moduleId]: amount }));

  const toggleModule = (module: PricingModule) => {
    const isSelected = moduleIds.includes(module.id);
    setModuleIds((current) => toggleItem(current, module.id));
    // Beim Abwählen die Menge verwerfen, damit ein erneutes Anwählen bei 0 startet.
    if (isSelected && module.usage) setUsageAmount(module.id, 0);
  };

  const usagePanels = (modules: PricingModule[]) =>
    modules
      .filter((module) => module.usage && moduleIds.includes(module.id))
      .map((module) => (
        <UsagePanel
          key={module.id}
          module={module}
          amount={usageAmounts[module.id] ?? 0}
          onChange={(amount) => setUsageAmount(module.id, amount)}
        />
      ));

  const requestParams = new URLSearchParams({
    source: "pricing-configurator",
    ...(pkg ? { package: pkg.id } : {}),
    users: users.toString(),
    ...(capacity ? { capacity: capacity.projects.toString() } : {}),
    monthly: breakdown.monthlyTotal.toFixed(2),
  });
  if (selectedModules.length) requestParams.set("modules", selectedModules.map((module) => module.id).join(","));
  selectedModules.forEach((module) => {
    const amount = usageAmounts[module.id] ?? 0;
    if (module.usage && amount > 0) requestParams.set(`usage_${module.id}`, amount.toString());
  });
  const requestHref = `/demo-buchen?${requestParams.toString()}`;

  const resetConfiguration = () => {
    setPackageId(basePackage?.id ?? "");
    setUsers(MIN_USERS);
    setCapacityId(baseCapacity?.id ?? "");
    setModuleIds([]);
    setUsageAmounts({});
  };

  return (
    <section id="konfigurator" aria-labelledby="configurator-title" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="page-container">
        <SectionTitle
          id="configurator-title"
          title={config.texts.configuratorTitle}
          description={config.texts.configuratorDescription}
        />

        <div className="mt-12 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
          <div className="min-w-0 space-y-12">
            {/* Mehrere Pakete werden zur Auswahl gestellt; bei genau einem bleibt der
                bisherige feste Basispaket-Block stehen. */}
            {config.packages.length > 1 ? (
              <fieldset>
                <legend className="text-2xl font-bold tracking-tight text-slate-950">{config.texts.packagesTitle}</legend>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{config.texts.packagesDescription}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={config.texts.packagesTitle}>
                  {config.packages.map((option) => (
                    <PackageCard
                      key={option.id}
                      pkg={option}
                      selected={option.id === pkg?.id}
                      onSelect={() => setPackageId(option.id)}
                    />
                  ))}
                </div>
              </fieldset>
            ) : (
              pkg && (
                <section aria-labelledby="base-package-title" className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 sm:p-8">
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
                    <div>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700">
                        <PackageCheck className="h-4 w-4" strokeWidth={2} />
                        Fester Startpunkt
                      </span>
                      <h3 id="base-package-title" className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                        {pkg.name}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">{pkg.description}</p>
                      <div className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                        {/* Enthaltene Benutzer und Projekte stehen nicht in der Merkmalsliste,
                            sondern werden abgeleitet – sonst müsste der Admin sie doppelt pflegen. */}
                        {[
                          `${pkg.includedUsers} Benutzer`,
                          ...(baseCapacity
                            ? [`Bis zu ${baseCapacity.projects.toLocaleString("de-DE")} Projekte pro Monat`]
                            : []),
                          ...pkg.features,
                        ].map((feature) => (
                          <span key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" strokeWidth={2.4} />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-indigo-200 bg-white p-5">
                      <span className="block text-xs font-medium text-slate-500">Monatlicher Grundpreis</span>
                      <strong className="mt-2 block text-4xl font-bold tracking-tight text-slate-950">{formatPriceEUR(pkg.price)}</strong>
                      <span className="mt-1 block text-xs text-slate-500">
                        inklusive {pkg.includedUsers} Benutzer
                        {baseCapacity ? ` und ${baseCapacity.shortLabel}` : ""}
                      </span>
                    </div>
                  </div>
                </section>
              )
            )}

            <fieldset>
              <legend className="text-2xl font-bold tracking-tight text-slate-950">{config.texts.usersTitle}</legend>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {includedUsersNote}, jeder weitere kostet {formatPriceEUR(config.extraUserPrice)} pro Monat.
              </p>
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
                      onChange={(event) => setUsers(toCount(event.target.value, MIN_USERS))}
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
              <legend className="text-2xl font-bold tracking-tight text-slate-950">{config.texts.capacityTitle}</legend>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{config.texts.capacityDescription}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={config.texts.capacityTitle}>
                {config.capacities.map((option) => {
                  const selected = option.id === capacity?.id;
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
                      </span>
                      <span className={`shrink-0 text-sm font-semibold ${selected ? "text-indigo-700" : "text-slate-600"}`}>
                        {option.monthlySurcharge === 0 ? "Inklusive" : `+ ${formatPriceEUR(option.monthlySurcharge)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {standardModules.length > 0 && (
              <fieldset>
                <legend className="text-2xl font-bold tracking-tight text-slate-950">{config.texts.standardModulesTitle}</legend>
                {standardPricing && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {standardPricing.uniform
                      ? `Jedes Standardmodul kostet ${formatPriceEUR(standardPricing.lowest)} pro Monat und kann später ergänzt werden.`
                      : `Standardmodule kosten ab ${formatPriceEUR(standardPricing.lowest)} pro Monat und können später ergänzt werden.`}
                  </p>
                )}
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {standardModules.map((module) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      selected={moduleIds.includes(module.id)}
                      onToggle={() => toggleModule(module)}
                    />
                  ))}
                </div>

                {usagePanels(standardModules)}
              </fieldset>
            )}

            {complexModules.length > 0 && (
              <fieldset>
                <legend className="text-2xl font-bold tracking-tight text-slate-950">{config.texts.complexModulesTitle}</legend>
                {complexPricing && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {complexPricing.uniform
                      ? `Umfangreiche Funktionsbereiche kosten jeweils ${formatPriceEUR(complexPricing.lowest)} pro Monat.`
                      : `Umfangreiche Funktionsbereiche kosten ab ${formatPriceEUR(complexPricing.lowest)} pro Monat.`}
                  </p>
                )}
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {complexModules.map((module) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      selected={moduleIds.includes(module.id)}
                      onToggle={() => toggleModule(module)}
                    />
                  ))}
                </div>

                {usagePanels(complexModules)}
              </fieldset>
            )}

            {aiModules.length > 0 && (
              <section aria-label={config.texts.aiModuleTitle} className="space-y-6">
                {aiModules.map((module) => {
                  const selected = moduleIds.includes(module.id);
                  const Icon = moduleIcon(module.iconKey);

                  return (
                    <div key={module.id}>
                      <div
                        className={`grid gap-6 rounded-2xl border p-6 transition sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center ${
                          selected ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-slate-950 text-white"
                        }`}
                      >
                        <div>
                          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${selected ? "bg-indigo-600 text-white" : "bg-white/10 text-indigo-300"}`}>
                            <Icon className="h-5 w-5" strokeWidth={1.8} />
                          </span>
                          {module.imageSrc ? (
                            <div className="relative mt-5 aspect-[21/9] w-full overflow-hidden rounded-xl bg-slate-100">
                              <Image
                                src={module.imageSrc}
                                alt=""
                                fill
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                className="object-cover"
                              />
                            </div>
                          ) : null}
                          <h3 className={`mt-5 text-2xl font-bold tracking-tight ${selected ? "text-slate-950" : "text-white"}`}>
                            {module.title}
                          </h3>
                          <p className={`mt-3 max-w-2xl text-sm leading-relaxed ${selected ? "text-slate-600" : "text-slate-300"}`}>
                            {module.description}
                          </p>
                          <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {module.features.map((feature) => (
                              <span key={feature} className={`flex items-start gap-2 text-xs leading-relaxed ${selected ? "text-slate-700" : "text-slate-300"}`}>
                                <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${selected ? "text-indigo-600" : "text-indigo-300"}`} strokeWidth={2.4} />
                                {feature}
                              </span>
                            ))}
                          </div>
                          {module.extras.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {module.extras.map((extra) => (
                                <span
                                  key={extra}
                                  className={`rounded-full px-2.5 py-1 text-xs ${selected ? "bg-white text-slate-600" : "bg-white/10 text-slate-300"}`}
                                >
                                  {extra}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleModule(module)}
                          className={`inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 text-sm font-semibold transition active:scale-[0.98] ${
                            selected
                              ? "border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-100"
                              : "bg-white text-slate-950 hover:bg-indigo-50"
                          }`}
                        >
                          {selected ? <Check className="h-4 w-4" strokeWidth={2.4} /> : <Plus className="h-4 w-4" strokeWidth={2.2} />}
                          {selected ? "Ausgewählt" : `Für ${formatPriceEUR(module.price)} hinzufügen`}
                        </button>
                      </div>

                      {selected && module.usage && (
                        <UsagePanel
                          module={module}
                          amount={usageAmounts[module.id] ?? 0}
                          onChange={(amount) => setUsageAmount(module.id, amount)}
                        />
                      )}
                    </div>
                  );
                })}
              </section>
            )}
          </div>

          <aside className="xl:sticky xl:top-24" aria-label="Zusammenfassung deiner Konfiguration">
            <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-[0_28px_80px_-36px_rgba(15,23,42,0.75)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-indigo-300">{config.texts.summaryTitle}</span>
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
                  <dt className="text-slate-300">{pkg?.name ?? "Paket"}</dt>
                  <dd className="font-semibold">{formatPriceEUR(breakdown.basePrice)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-slate-300">{users} Benutzer</dt>
                  <dd className="font-semibold">
                    {breakdown.extraUsersPrice ? `+ ${formatPriceEUR(breakdown.extraUsersPrice)}` : "Inklusive"}
                  </dd>
                </div>
                {capacity && (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-slate-300">{capacity.shortLabel}</dt>
                    <dd className="font-semibold">
                      {breakdown.capacitySurcharge ? `+ ${formatPriceEUR(breakdown.capacitySurcharge)}` : "Inklusive"}
                    </dd>
                  </div>
                )}
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
                    {selectedModules.map((module) => {
                      const amount = usageAmounts[module.id] ?? 0;
                      if (!module.usage || amount <= 0) return null;

                      return (
                        <li key={`${module.id}-usage`} className="flex items-baseline justify-between gap-4 text-xs">
                          <span className="text-slate-300">
                            {module.title}: {amount.toLocaleString("de-DE")}
                          </span>
                          <strong className="shrink-0 text-white">
                            + {formatPriceEUR(amount * module.usage.unitPrice, true)}
                          </strong>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">Noch keine Zusatzmodule ausgewählt.</p>
                )}
              </div>

              <div className="py-6" aria-live="polite">
                <span className="text-xs font-semibold text-slate-400">Gesamt pro Monat</span>
                <strong className="mt-2 block text-4xl font-bold tracking-tight text-white">
                  {formatPriceEUR(breakdown.monthlyTotal, !Number.isInteger(breakdown.monthlyTotal))}
                </strong>
                <span className="mt-1 block text-xs text-slate-400">netto, monatlich kalkuliert</span>
              </div>

              <div className="rounded-xl bg-white/7 p-4">
                <span className="block text-xs text-slate-400">Implementierung einmalig</span>
                <strong className="mt-1 block text-lg font-semibold text-white">{formatPriceEUR(breakdown.implementationPrice)}</strong>
                <span className="mt-1 block text-[11px] leading-relaxed text-slate-400">abhängig von deinem gewählten Paket</span>
              </div>

              <Link
                href={requestHref}
                data-analytics="pricing_configurator_cta"
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-indigo-500 px-5 text-sm font-semibold text-white transition hover:bg-indigo-400 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                {config.texts.ctaLabel}
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

function ImplementationSection({ config }: { config: PricingConfig }) {
  return (
    <section aria-labelledby="implementation-title" className="bg-slate-50 py-20 md:py-28">
      <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <h2 id="implementation-title" className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {config.texts.implementationTitle}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
            {config.texts.implementationDescription}
          </p>
          <div className="mt-7 space-y-3">
            {config.packages.map((item) => (
              <div key={item.id} className="flex items-baseline justify-between gap-5 border-b border-slate-200 pb-3 text-sm">
                <span className="text-slate-600">{item.name}</span>
                <strong className="shrink-0 text-slate-950">{formatPriceEUR(item.implementationPrice)}</strong>
              </div>
            ))}
          </div>
          {/* Einzige Sektion der Preisseite ohne Bild: links standen bisher nur
              Überschrift und Preisliste, rechts eine Häkchenliste. */}
          <MediaFrame
            src="/placeholders/uebersicht-preise.svg"
            alt="Einführung und Betreuung durch das Gleistrix-Team"
            ratio="landscape"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="mt-8"
          />
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

function IntegrationsSection({ config }: { config: PricingConfig }) {
  /** Der erste Eintrag ist der „Alle"-Filter – er filtert nicht, sondern zeigt alles. */
  const allCategory = config.integrationCategories[0] ?? "";
  const [category, setCategory] = useState(allCategory);
  const [query, setQuery] = useState("");

  const filteredIntegrations = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("de-DE");
    return config.integrations.filter((integration) => {
      const matchesCategory = category === allCategory || integration.category === category;
      const matchesQuery =
        !normalizedQuery ||
        `${integration.title} ${integration.category} ${integration.description}`.toLocaleLowerCase("de-DE").includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [allCategory, category, config.integrations, query]);

  return (
    <section id="integrationen" aria-labelledby="integrations-title" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="page-container">
        <SectionTitle
          id="integrations-title"
          title={config.texts.integrationsTitle}
          description={config.texts.integrationsDescription}
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
              {config.integrationCategories.map((item) => (
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
                {category === allCategory ? "Verfügbare Anbindungen" : category}
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
              src="/loesungen.webp"
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

export default function PricingSection({ config }: { config: PricingConfig }) {
  return (
    <>
      <PricingHero config={config} />
      <PricingConfigurator config={config} />
      <ImplementationSection config={config} />
      <IntegrationsSection config={config} />
      <BrochureSection />
      <CustomDevelopmentSection />
    </>
  );
}
