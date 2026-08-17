"use client";

import { useEffect, useRef, useState } from "react";
import { ImageUp, X } from "lucide-react";

import { CHECKBOX_CLASS } from "@/components/admin/pricing/ui";
import { cn } from "@/lib/utils";

/**
 * Logo-Upload per Ziehen und Ablegen.
 *
 * Die Datei geht als Teil des Formulars an die Server Action und von dort in
 * den Bildspeicher (MinIO); zurück kommt eine Adresse unter /api/assets/<id>.
 *
 * Breite und Höhe schickt dieses Feld verdeckt mit: next/image braucht auf der
 * Preisseite beide Werte für das Seitenverhältnis. Sie aus der Datei zu lesen
 * ist verlässlicher als sie abzutippen – die Anzeigegröße steckt ohnehin in der
 * CSS-Klasse, nicht in diesen Zahlen.
 */

/** Was der Bildspeicher annimmt (lib/admin/db/assets.ts). */
const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/svg+xml",
];
const MAX_BYTES = 4 * 1024 * 1024;

type Props = {
  /** Feldname der Datei; die Server Action liest ihn aus dem FormData. */
  name: string;
  id: string;
  /** Bisheriges Logo – bleibt stehen, solange nichts Neues abgelegt wird. */
  currentSrc?: string;
  currentWidth?: number;
  currentHeight?: number;
  /**
   * Nach jedem erfolgreichen Speichern ein neues Objekt (der Zustand aus
   * `useActionState`). Ein `boolean` genügt hier nicht: der bliebe beim zweiten
   * Speichern unverändert `true`, und der Effekt liefe kein zweites Mal.
   */
  savedSignal?: object | null;
};

export default function LogoDropzone({
  name,
  id,
  currentSrc,
  currentWidth,
  currentHeight,
  savedSignal,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [remove, setRemove] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentSrc ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Blob-URL nur so lange halten, wie die Datei ausgewählt ist – im Effekt,
  // damit der Strict Mode keine URL ohne Cleanup zurücklässt.
  useEffect(() => {
    if (!file) {
      setPreview(remove ? null : (currentSrc ?? null));
      setSize(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Die natürlichen Maße stehen erst nach dem Dekodieren fest. Ein SVG, das
    // nur ein viewBox mitbringt, hat keine – dann bleiben die Felder leer und
    // die Preisseite nimmt das Seitenverhältnis ihrer Anzeigefläche.
    const probe = new window.Image();
    probe.onload = () => {
      if (probe.naturalWidth > 0 && probe.naturalHeight > 0) {
        setSize({ width: probe.naturalWidth, height: probe.naturalHeight });
      }
    };
    probe.src = objectUrl;

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, remove, currentSrc]);

  // Nach dem Speichern liegt das Logo auf dem Server; die lokale Auswahl darf
  // nicht als ungespeicherte Änderung stehen bleiben.
  useEffect(() => {
    if (!savedSignal) return;
    setFile(null);
    setRemove(false);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [savedSignal]);

  function clearSelection() {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  /** Serverseitig wird dasselbe noch einmal geprüft – hier geht es nur um die schnelle Rückmeldung. */
  function accept(candidate: File | undefined) {
    if (!candidate) return;

    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      setError("Nur PNG, JPEG, WebP, AVIF oder SVG.");
      clearSelection();
      return;
    }
    if (candidate.size > MAX_BYTES) {
      setError("Die Datei ist größer als 4 MB.");
      clearSelection();
      return;
    }

    setError(null);
    setRemove(false);
    setFile(candidate);
  }

  /**
   * Die abgelegte Datei muss auch im nativen <input> landen: nur von dort nimmt
   * sie das Formular mit. `DataTransfer` ist der einzige Weg, eine FileList zu
   * bauen – zuweisen lässt sich `input.files` sonst nicht.
   */
  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);

    const dropped = event.dataTransfer.files?.[0];
    if (!dropped || !inputRef.current) return;

    const transfer = new DataTransfer();
    transfer.items.add(dropped);
    inputRef.current.files = transfer.files;
    accept(dropped);
  }

  // Ein neuer Upload gewinnt, sonst gelten die bisherigen Maße weiter.
  const width = size?.width ?? currentWidth;
  const height = size?.height ?? currentHeight;

  return (
    <div className="space-y-2">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-wrap items-center gap-4 rounded-lg border border-dashed px-4 py-3 transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-input",
        )}
      >
        {preview ? (
          // Kein next/image: die Vorschau ist vor dem Hochladen eine Blob-URL.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            className="h-10 w-16 shrink-0 rounded border bg-white object-contain p-1"
          />
        ) : (
          <span className="flex h-10 w-16 shrink-0 items-center justify-center rounded border bg-muted text-muted-foreground">
            <ImageUp className="size-4" aria-hidden />
          </span>
        )}

        <div className="min-w-48 flex-1 space-y-1">
          <input
            ref={inputRef}
            id={id}
            type="file"
            name={name}
            accept={ACCEPTED_TYPES.join(",")}
            onChange={(event) => accept(event.target.files?.[0])}
            className="block w-full text-sm file:mr-3 file:rounded-md file:border file:bg-background file:px-3 file:py-1.5 file:text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Datei hierher ziehen oder auswählen. PNG, JPEG, WebP, AVIF oder SVG bis 4 MB.
          </p>
        </div>

        {file ? (
          <button
            type="button"
            onClick={clearSelection}
            className="flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            <X className="size-3.5" aria-hidden />
            Auswahl verwerfen
          </button>
        ) : null}
      </div>

      {/* Maße reisen verdeckt mit – sichtbare Felder wären nur eine Fehlerquelle. */}
      <input type="hidden" name="width" value={width ?? ""} />
      <input type="hidden" name="height" value={height ?? ""} />

      {error ? (
        <p role="alert" className="text-xs text-rose-600">
          {error}
        </p>
      ) : null}

      {currentSrc ? (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="removeLogo"
            checked={remove}
            onChange={(event) => {
              setRemove(event.target.checked);
              if (event.target.checked) clearSelection();
            }}
            className={CHECKBOX_CLASS}
          />
          Logo entfernen – stattdessen die Initialen zeigen
        </label>
      ) : null}
    </div>
  );
}
