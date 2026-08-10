"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { saveLandingModuleAction, type FormState } from "@/app/admin/actions";
import FeaturesPicker from "@/components/admin/pricing/FeaturesPicker";
import { useDialogForm } from "@/components/admin/pricing/Modal";
import { CHECKBOX_CLASS, Field, FormMessage, SELECT_CLASS } from "@/components/admin/pricing/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VISUAL_KEYS, VISUAL_LABEL } from "@/data/landingModules";
import type { LandingModule } from "@/types/landing";

/** Ohne Modul legt das Formular ein neues an. */
type Props = {
  module?: LandingModule;
  /** Bereits vergebene Stichpunkte – als Auswahlvorschlag. */
  bulletSuggestions?: string[];
};

export default function LandingModuleForm({ module, bulletSuggestions = [] }: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    saveLandingModuleAction,
    {},
  );
  const [upload, setUpload] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [preview, setPreview] = useState<string | null>(module?.imageSrc ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useDialogForm(state, !module);

  // Wie im Add-on-Formular: die Blob-URL lebt nur, solange die Datei ausgewählt
  // ist – im Effekt, weil useMemo unter Strict Mode zweimal auswerten kann.
  useEffect(() => {
    if (!upload) {
      setPreview(removeImage ? null : (module?.imageSrc ?? null));
      return;
    }

    const objectUrl = URL.createObjectURL(upload);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [upload, removeImage, module?.imageSrc]);

  useEffect(() => {
    if (!state.success) return;
    setUpload(null);
    setRemoveImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [state]);

  const prefix = module ? `landing-${module.id}` : "landing-new";

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="moduleId" value={module?.id ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={`${prefix}-title`} label="Titel">
          <Input id={`${prefix}-title`} name="title" defaultValue={module?.title ?? ""} required />
        </Field>

        <Field
          id={`${prefix}-href`}
          label="Link (optional)"
          hint="Interne Adresse wie /produkt/… oder #abschnitt. Leer lässt den Link weg."
        >
          <Input
            id={`${prefix}-href`}
            name="href"
            defaultValue={module?.href ?? ""}
            placeholder="/produkt/mitarbeiterverwaltung"
          />
        </Field>

        <Field
          id={`${prefix}-visual`}
          label="Illustration"
          hint="Wird gezeigt, solange kein Bild hochgeladen ist."
        >
          <select
            id={`${prefix}-visual`}
            name="visual"
            defaultValue={module?.visual ?? VISUAL_KEYS[0]}
            className={SELECT_CLASS}
          >
            {VISUAL_KEYS.map((key) => (
              <option key={key} value={key}>
                {VISUAL_LABEL[key]}
              </option>
            ))}
          </select>
        </Field>

        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={module?.isActive ?? true}
            className={CHECKBOX_CLASS}
          />
          Im Karussell sichtbar
        </label>
      </div>

      <Field id={`${prefix}-description`} label="Beschreibung">
        <Input
          id={`${prefix}-description`}
          name="description"
          defaultValue={module?.description ?? ""}
        />
      </Field>

      <Field
        id={`${prefix}-image`}
        label="Bild"
        hint="PNG, JPEG, WebP oder AVIF bis 4 MB. Ohne Bild zeigt die Folie die Illustration."
      >
        <div className="flex flex-wrap items-start gap-4">
          {preview ? (
            // Kein next/image: die Vorschau ist eine lokale Blob-URL, bevor die
            // Datei überhaupt hochgeladen ist.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-20 w-32 rounded-md border object-cover" />
          ) : null}

          <div className="min-w-56 flex-1 space-y-2">
            <input
              id={`${prefix}-image`}
              ref={fileInputRef}
              type="file"
              name="imageFile"
              accept="image/png,image/jpeg,image/webp,image/avif"
              onChange={(event) => {
                setUpload(event.target.files?.[0] ?? null);
                setRemoveImage(false);
              }}
              className="block w-full text-sm file:mr-3 file:rounded-md file:border file:bg-background file:px-3 file:py-1.5 file:text-sm"
            />

            {module?.imageSrc ? (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="removeImage"
                  checked={removeImage}
                  onChange={(event) => {
                    setRemoveImage(event.target.checked);
                    if (event.target.checked) {
                      setUpload(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }
                  }}
                  className={CHECKBOX_CLASS}
                />
                Bild entfernen
              </label>
            ) : null}
          </div>
        </div>
      </Field>

      <Field
        id={`${prefix}-bullets`}
        label="Stichpunkte"
        hint="Drei Punkte lesen sich am besten – mehr passen, wirken aber gedrängt."
      >
        <FeaturesPicker
          name="bullets"
          initial={module?.bullets ?? []}
          suggestions={bulletSuggestions}
        />
      </Field>

      <FormMessage state={state} />

      <Button type="submit" size="sm" variant={module ? "outline" : "default"} disabled={isPending}>
        {isPending ? "Wird gespeichert …" : module ? "Speichern" : "Modul anlegen"}
      </Button>
    </form>
  );
}
