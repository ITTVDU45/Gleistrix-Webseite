import { NextResponse } from "next/server";

import { getPublishedPricing } from "@/lib/admin/pricing";

/**
 * Freigegebene Preiskonfiguration als JSON.
 *
 * Bewusst öffentlich und ohne Authentifizierung: es sind dieselben Daten, die
 * auf /preise stehen. Der Entwurf bleibt außen vor – hier erscheint nur, was
 * im Admin freigegeben wurde.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const config = await getPublishedPricing();

  // Ohne no-store würde eine Freigabe an zwischengeschalteten Caches hängen bleiben.
  return NextResponse.json(config, { headers: { "Cache-Control": "no-store" } });
}
