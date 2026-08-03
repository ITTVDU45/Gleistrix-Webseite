"use client";

import { useActionState } from "react";
import { ExternalLink } from "lucide-react";

import {
  discardPricingDraftAction,
  publishPricingAction,
  type FormState,
} from "@/app/admin/actions";
import { FormMessage } from "@/components/admin/pricing/ui";
import { Button } from "@/components/ui/button";

type Props = {
  hasChanges: boolean;
  /** Zeitpunkt der letzten Freigabe. */
  publishedAt: string;
  /** Zeitpunkt der letzten Entwurfsänderung. */
  draftAt: string;
};

export default function PublishBar({ hasChanges, publishedAt, draftAt }: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    publishPricingAction,
    {},
  );

  return (
    <div className="rounded-xl border bg-card p-5 shadow-soft-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={
                hasChanges
                  ? "rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20"
                  : "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
              }
            >
              {hasChanges ? "Entwurf weicht ab" : "Freigegeben"}
            </span>
            <p className="text-sm text-muted-foreground">
              Letzte Freigabe: {publishedAt}
              {hasChanges ? ` · Entwurf zuletzt geändert: ${draftAt}` : ""}
            </p>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Änderungen wirken erst nach der Freigabe auf der öffentlichen Preisseite.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/preise#konfigurator"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Öffentliche Preisseite
            <ExternalLink className="size-3.5" aria-hidden />
          </a>

          <form action={discardPricingDraftAction}>
            <Button type="submit" variant="ghost" size="sm" disabled={!hasChanges}>
              Entwurf verwerfen
            </Button>
          </form>

          <form action={formAction}>
            <Button type="submit" size="sm" disabled={isPending || !hasChanges}>
              {isPending ? "Wird freigegeben …" : "Freigeben"}
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-3 empty:mt-0">
        <FormMessage state={state} />
      </div>
    </div>
  );
}
