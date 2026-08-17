import { NextResponse } from "next/server";

import { SVG_SECURITY_POLICY, assetContentType, readImageAsset } from "@/lib/admin/db/assets";

/**
 * Liefert ein im Admin hochgeladenes Bild aus.
 *
 * Die Kennung ist der Inhaltshash: dieselbe Adresse liefert für immer dasselbe
 * Bild, deshalb darf der Cache unbegrenzt greifen. Öffentlich ohne Anmeldung –
 * genau diese Bilder stehen auf der Preisseite.
 *
 * SVG bekommt zusätzlich eine CSP mit `sandbox`: als Bild eingebunden ist es
 * harmlos, direkt aufgerufen wäre es ausführbares Dokument in unserer Origin
 * (siehe SVG_SECURITY_POLICY in lib/admin/db/assets.ts).
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const contentType = assetContentType(id);
  if (!contentType) return new NextResponse("Not found", { status: 404 });

  const bytes = await readImageAsset(id);
  if (!bytes) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(bytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      ...(contentType === "image/svg+xml"
        ? { "Content-Security-Policy": SVG_SECURITY_POLICY }
        : {}),
    },
  });
}
