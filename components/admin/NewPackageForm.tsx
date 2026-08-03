"use client";

import { useActionState } from "react";

import { createPackageAction, type FormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TIER_LABEL, type CatalogModule, type ModuleTier } from "@/lib/admin/modules";

const TIER_ORDER: ModuleTier[] = ["standard", "complex", "ai"];

/** Der Katalog kommt als Prop: der Preis-Store liest das Dateisystem und ist im Client nicht ladbar. */
type Props = { modules: CatalogModule[] };

export default function NewPackageForm({ modules }: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    createPackageAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="pkg-name">Paketname</Label>
          <Input id="pkg-name" name="name" required placeholder="Professional Plus" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="pkg-description">Beschreibung</Label>
          <Input
            id="pkg-description"
            name="description"
            placeholder="Für Bahndienstleister mit eigener Disposition."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pkg-price">Monatspreis (EUR)</Label>
          <Input
            id="pkg-price"
            name="monthlyPrice"
            type="number"
            min={0}
            step="10"
            defaultValue={390}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pkg-seats">Enthaltene Benutzer</Label>
          <Input
            id="pkg-seats"
            name="includedSeats"
            type="number"
            min={1}
            defaultValue={15}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pkg-projects">Projektlimit</Label>
          <Input
            id="pkg-projects"
            name="projectLimit"
            type="number"
            min={1}
            step="100"
            defaultValue={1000}
            required
          />
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Enthaltene Module</legend>
        {TIER_ORDER.map((tier) => {
          const tierModules = modules.filter((m) => m.tier === tier);
          if (tierModules.length === 0) return null;

          return (
            <div key={tier}>
              <p className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                {TIER_LABEL[tier]}
              </p>
              <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {tierModules.map((module) => (
                  <label
                    key={module.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted/50 has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5"
                  >
                    <input
                      type="checkbox"
                      name="moduleIds"
                      value={module.id}
                      className="size-4 accent-[var(--primary)]"
                    />
                    {module.title}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </fieldset>

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-inset ring-rose-600/20"
        >
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          {state.success}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Wird angelegt …" : "Paket anlegen"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Neue Pakete sind zunächst nicht freigegeben.
        </p>
      </div>
    </form>
  );
}
