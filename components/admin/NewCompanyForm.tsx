"use client";

import { useActionState, useState } from "react";

import { createCompanyAction, type FormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/admin/tenant";

type Props = {
  packages: { id: string; name: string }[];
};

const SELECT_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export default function NewCompanyForm({ packages }: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    createCompanyAction,
    {},
  );
  const [name, setName] = useState("");
  const [slugOverride, setSlugOverride] = useState("");

  // Die Kennung folgt dem Firmennamen, bis sie einmal von Hand geändert wurde.
  const slug = slugOverride || slugify(name);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Firmenname</Label>
          <Input
            id="name"
            name="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Muster Bau GmbH"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Kennung</Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(event) => setSlugOverride(slugify(event.target.value))}
            placeholder="muster-bau"
          />
          <p className="text-xs text-muted-foreground">
            Datenbank <code>gleistrix_{(slug || "kennung").replace(/-/g, "_")}</code>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactName">Ansprechpartner</Label>
          <Input id="contactName" name="contactName" placeholder="Sabine Ahrens" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Kontakt-E-Mail</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            placeholder="leitung@muster-bau.de"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seats">Benutzer</Label>
          <Input id="seats" name="seats" type="number" min={1} defaultValue={5} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="packageId">Paket</Label>
          <select id="packageId" name="packageId" defaultValue="" className={SELECT_CLASS}>
            <option value="">Ohne Paket</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name}
              </option>
            ))}
          </select>
          {packages.length === 0 ? (
            <p className="text-xs text-muted-foreground">Es ist noch kein Paket freigegeben.</p>
          ) : null}
        </div>
      </div>

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-inset ring-rose-600/20"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Wird angelegt …" : "Unternehmen anlegen"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Legt Mandant, Provisionierungsplan und Ressourcennamen an.
        </p>
      </div>
    </form>
  );
}
