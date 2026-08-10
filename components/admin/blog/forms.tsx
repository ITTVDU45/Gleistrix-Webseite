"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import type { FormState } from "@/app/admin/actions";
import {
  analyzeBlogSourceAction,
  generateBlogArticleAction,
  saveBlogArticleAction,
  saveBlogSourceAction,
} from "@/app/admin/blog-actions";
import { useDialogForm } from "@/components/admin/pricing/Modal";
import {
  CHECKBOX_CLASS,
  Field,
  FormMessage,
  SELECT_CLASS,
  TEXTAREA_CLASS,
} from "@/components/admin/pricing/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BLOG_CATEGORIES } from "@/data/blog";
import type { BlogArticle, BlogArticleStatus, BlogSourceKind } from "@/types/blog";

/* ------------------------------------------------------------------ Quellen */

const KIND_LABEL: Record<BlogSourceKind, string> = {
  link: "Link zu einer Seite",
  text: "Text einfügen",
  datei: "Datei hochladen (PDF oder Text)",
};

/**
 * Neue Quelle anlegen.
 *
 * Ein Formular für alle drei Arten statt drei Formularen: die Felder
 * unterscheiden sich nur in einem Punkt, und die Entscheidung fällt ohnehin
 * erst im Dialog.
 */
export function SourceForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    saveBlogSourceAction,
    {},
  );
  const [kind, setKind] = useState<BlogSourceKind>("link");
  const formRef = useDialogForm(state, true);

  useEffect(() => {
    if (state.success) setKind("link");
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <Field id="source-kind" label="Art">
        <select
          id="source-kind"
          name="kind"
          value={kind}
          onChange={(event) => setKind(event.target.value as BlogSourceKind)}
          className={SELECT_CLASS}
        >
          {(Object.keys(KIND_LABEL) as BlogSourceKind[]).map((value) => (
            <option key={value} value={value}>
              {KIND_LABEL[value]}
            </option>
          ))}
        </select>
      </Field>

      {kind === "link" ? (
        <Field
          id="source-url"
          label="Adresse"
          hint="Der Text wird beim Speichern geholt – so fällt eine nicht lesbare Seite sofort auf."
        >
          <Input
            id="source-url"
            name="url"
            type="url"
            placeholder="https://www.eba.bund.de/…"
            required
          />
        </Field>
      ) : null}

      {kind === "text" ? (
        <Field id="source-text" label="Text" hint="Mindestens 100 Zeichen.">
          <textarea id="source-text" name="text" rows={10} className={TEXTAREA_CLASS} required />
        </Field>
      ) : null}

      {kind === "datei" ? (
        <Field
          id="source-file"
          label="Datei"
          hint="PDF oder Textdatei bis 8 MB. Word-Dokumente bitte vorher als PDF speichern."
        >
          <input
            id="source-file"
            name="file"
            type="file"
            accept="application/pdf,text/plain,text/markdown,text/csv"
            required
            className="block w-full text-sm file:mr-3 file:rounded-md file:border file:bg-background file:px-3 file:py-1.5 file:text-sm"
          />
        </Field>
      ) : null}

      <Field id="source-title" label="Bezeichnung (optional)" hint="Leer ⇒ Dateiname bzw. Domain.">
        <Input id="source-title" name="title" placeholder="Fachbeitrag Oberbau 2026" />
      </Field>

      <FormMessage state={state} />

      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Wird gespeichert …" : "Quelle speichern"}
      </Button>
    </form>
  );
}

/* -------------------------------------------------------------- KI-Aktionen */

type ActionFormProps = {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  hiddenName: string;
  hiddenValue: string;
  label: string;
  pendingLabel: string;
  variant?: "default" | "outline";
  disabled?: boolean;
};

/**
 * Knopf für einen KI-Lauf.
 *
 * Eigene Komponente, weil beide Läufe dasselbe brauchen: einen sichtbaren
 * Wartezustand und eine Meldung an Ort und Stelle. Die Läufe dauern zwischen
 * zehn Sekunden und zwei Minuten – ohne Rückmeldung würde in dieser Zeit ein
 * zweites Mal geklickt.
 */
function ActionForm({
  action,
  hiddenName,
  hiddenValue,
  label,
  pendingLabel,
  variant = "outline",
  disabled = false,
}: ActionFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name={hiddenName} value={hiddenValue} />
      <Button type="submit" size="sm" variant={variant} disabled={isPending || disabled}>
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {pendingLabel}
          </>
        ) : (
          label
        )}
      </Button>
      {state.error ? (
        <p role="alert" className="text-xs text-rose-700">
          {state.error}
        </p>
      ) : null}
      {state.success ? <p className="text-xs text-emerald-700">{state.success}</p> : null}
    </form>
  );
}

export function AnalyzeSourceButton({
  sourceId,
  disabled,
  again,
}: {
  sourceId: string;
  disabled?: boolean;
  again?: boolean;
}) {
  return (
    <ActionForm
      action={analyzeBlogSourceAction}
      hiddenName="sourceId"
      hiddenValue={sourceId}
      label={again ? "Erneut analysieren" : "Analysieren"}
      pendingLabel="Analysiert …"
      disabled={disabled}
    />
  );
}

export function GenerateArticleButton({
  suggestionId,
  disabled,
}: {
  suggestionId: string;
  disabled?: boolean;
}) {
  return (
    <ActionForm
      action={generateBlogArticleAction}
      hiddenName="suggestionId"
      hiddenValue={suggestionId}
      label="Artikel schreiben"
      pendingLabel="Schreibt …"
      variant="default"
      disabled={disabled}
    />
  );
}

/* ------------------------------------------------------------------ Artikel */

/** ISO → Wert für <input type="datetime-local"> in Ortszeit. */
function toLocalInput(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

/**
 * Artikel bearbeiten.
 *
 * Der Text ist ein einfaches Feld mit HTML. Ein WYSIWYG-Editor wäre eine
 * weitere Abhängigkeit für einen Bereich, in dem meist ein KI-Entwurf
 * nachgeschärft wird – und das erlaubte Tag-Set ist klein genug, um es zu
 * tippen. Nicht erlaubte Elemente entfernt der Server beim Speichern.
 */
export function ArticleForm({ article }: { article?: BlogArticle }) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    saveBlogArticleAction,
    {},
  );
  const [status, setStatus] = useState<BlogArticleStatus>(article?.status ?? "entwurf");
  const [upload, setUpload] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [preview, setPreview] = useState<string | null>(article?.imageSrc ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Wie im Modulformular: die Blob-Adresse lebt nur, solange die Datei
  // ausgewählt ist – im Effekt, weil useMemo unter Strict Mode zweimal läuft.
  useEffect(() => {
    if (!upload) {
      setPreview(removeImage ? null : (article?.imageSrc ?? null));
      return;
    }
    const objectUrl = URL.createObjectURL(upload);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [upload, removeImage, article?.imageSrc]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="articleId" value={article?.id ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="article-title" label="Titel" className="sm:col-span-2">
          <Input id="article-title" name="title" defaultValue={article?.title ?? ""} required />
        </Field>

        <Field
          id="article-teaser"
          label="Anriss"
          className="sm:col-span-2"
          hint="Ein Satz. Steht auf der Karte und in der Übersicht."
        >
          <Input id="article-teaser" name="teaser" defaultValue={article?.teaser ?? ""} />
        </Field>

        <Field id="article-category" label="Rubrik">
          <Input
            id="article-category"
            name="category"
            list="blog-categories"
            defaultValue={article?.category ?? ""}
          />
          <datalist id="blog-categories">
            {BLOG_CATEGORIES.map((value) => (
              <option key={value} value={value} />
            ))}
          </datalist>
        </Field>

        <Field id="article-tags" label="Schlagwörter" hint="Mit Komma getrennt.">
          <Input
            id="article-tags"
            name="tags"
            defaultValue={article?.tags.join(", ") ?? ""}
            placeholder="Disposition, Plantafel"
          />
        </Field>
      </div>

      <Field
        id="article-content"
        label="Artikeltext (HTML)"
        hint="Erlaubt: p, h2, h3, h4, ul, ol, li, strong, em, blockquote, a. Alles andere wird beim Speichern entfernt."
      >
        <textarea
          id="article-content"
          name="content"
          rows={18}
          defaultValue={article?.content ?? ""}
          className={`${TEXTAREA_CLASS} font-mono text-[13px]`}
          required
        />
      </Field>

      <fieldset className="rounded-lg border p-4">
        <legend className="px-1 text-sm font-semibold">Veröffentlichung</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="article-status" label="Status">
            <select
              id="article-status"
              name="status"
              value={status}
              onChange={(event) => setStatus(event.target.value as BlogArticleStatus)}
              className={SELECT_CLASS}
            >
              <option value="entwurf">Entwurf – nicht öffentlich</option>
              <option value="geplant">Geplant – erscheint zum Zeitpunkt</option>
              <option value="veroeffentlicht">Veröffentlicht – sofort öffentlich</option>
            </select>
          </Field>

          {status === "geplant" ? (
            <Field
              id="article-publish-at"
              label="Zeitpunkt"
              hint="Der Artikel erscheint ohne weiteres Zutun, sobald dieser Zeitpunkt erreicht ist."
            >
              <Input
                id="article-publish-at"
                name="publishAt"
                type="datetime-local"
                defaultValue={toLocalInput(article?.publishAt)}
                required
              />
            </Field>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="rounded-lg border p-4">
        <legend className="px-1 text-sm font-semibold">Titelbild</legend>
        <div className="flex flex-wrap items-start gap-4">
          {preview ? (
            // Kein next/image: die Vorschau ist eine lokale Blob-Adresse,
            // bevor die Datei überhaupt hochgeladen ist.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-24 w-40 rounded-md border object-cover" />
          ) : null}

          <div className="min-w-56 flex-1 space-y-3">
            <input
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

            <Field id="article-image-alt" label="Bildbeschreibung">
              <Input
                id="article-image-alt"
                name="imageAlt"
                defaultValue={article?.imageAlt ?? ""}
                placeholder="Was auf dem Bild zu sehen ist"
              />
            </Field>

            {article?.imageSrc ? (
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
      </fieldset>

      <fieldset className="rounded-lg border p-4">
        <legend className="px-1 text-sm font-semibold">Suchmaschine</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="article-seo-title" label="Title-Tag" hint="Leer ⇒ der Artikeltitel.">
            <Input id="article-seo-title" name="seoTitle" defaultValue={article?.seo.title ?? ""} />
          </Field>

          <Field id="article-seo-keyword" label="Leitwort">
            <Input
              id="article-seo-keyword"
              name="seoKeyword"
              defaultValue={article?.seo.keyword ?? ""}
            />
          </Field>

          <Field
            id="article-seo-description"
            label="Meta-Beschreibung"
            className="sm:col-span-2"
            hint="Rund 155 Zeichen. Leer ⇒ der Anriss."
          >
            <textarea
              id="article-seo-description"
              name="seoDescription"
              rows={2}
              defaultValue={article?.seo.description ?? ""}
              className={TEXTAREA_CLASS}
            />
          </Field>
        </div>
      </fieldset>

      <FormMessage state={state} />

      <Button type="submit" disabled={isPending}>
        {isPending ? "Wird gespeichert …" : "Speichern"}
      </Button>
    </form>
  );
}
