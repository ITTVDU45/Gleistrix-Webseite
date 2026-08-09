"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  name: string;
  initial: string[];
  suggestions: string[];
};

export default function FeaturesPicker({ name, initial, suggestions }: Props) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [draft, setDraft] = useState("");

  const available = useMemo(
    () => suggestions.filter((s) => !selected.includes(s)),
    [suggestions, selected],
  );

  function add(value: string) {
    const trimmed = value.trim();
    if (!trimmed || selected.includes(trimmed)) return;
    setSelected([...selected, trimmed]);
  }

  function remove(value: string) {
    setSelected(selected.filter((s) => s !== value));
  }

  function onDraftKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      add(draft);
      setDraft("");
    }
  }

  return (
    <div className="space-y-3">
      {selected.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {selected.map((feature) => (
            <li key={feature}>
              <span className="inline-flex items-center gap-1 rounded-full border bg-accent/40 py-1 pl-3 pr-1 text-sm">
                {feature}
                <button
                  type="button"
                  onClick={() => remove(feature)}
                  aria-label={`${feature} entfernen`}
                  className="rounded-full p-0.5 text-muted-foreground hover:bg-background hover:text-foreground"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">Noch keine Leistung ausgewählt.</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onDraftKey}
          placeholder="Neue Leistung – Enter zum Hinzufügen"
          className="min-w-56 flex-1"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            add(draft);
            setDraft("");
          }}
          disabled={!draft.trim()}
        >
          <Plus className="size-4" aria-hidden />
          Hinzufügen
        </Button>
      </div>

      {available.length > 0 ? (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">Aus dem Katalog übernehmen:</p>
          <ul className="flex flex-wrap gap-1.5">
            {available.map((feature) => (
              <li key={feature}>
                <button
                  type="button"
                  onClick={() => add(feature)}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Plus className="size-3.5" aria-hidden />
                  {feature}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <textarea name={name} value={selected.join("\n")} readOnly hidden />
    </div>
  );
}
