import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Gleistrix – ERP Software für Bahnbau und Bahndienstleister";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Seitenverhältnis von public/logos/gleistrix-logo-weiss.svg (1664 × 326). */
const LOGO_HEIGHT = 64;
const LOGO_WIDTH = Math.round((LOGO_HEIGHT * 1664) / 326);

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logos/gleistrix-logo-weiss.svg"));
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "84px",
        background: "linear-gradient(135deg, #000F3B 0%, #012695 60%, #1823FD 100%)",
        color: "white",
      }}
    >
      <img src={logoSrc} width={LOGO_WIDTH} height={LOGO_HEIGHT} alt="" />
      <div style={{ marginTop: 40, maxWidth: 950, fontSize: 42, lineHeight: 1.18, fontWeight: 650 }}>
        ERP Software für Bahnbau & Bahndienstleister
      </div>
      <div style={{ marginTop: 30, maxWidth: 920, fontSize: 25, lineHeight: 1.45, opacity: 0.88 }}>
        Projektplanung · Disposition · Personal · Zeiterfassung · Dokumente · Abrechnung
      </div>
      <div style={{ marginTop: 54, fontSize: 23, opacity: 0.72 }}>www.gleistrix.de</div>
    </div>,
    size,
  );
}
