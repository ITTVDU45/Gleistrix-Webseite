import { ImageResponse } from "next/og";

export const alt = "Gleistrix – ERP Software für Bahnbau und Bahndienstleister";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "84px",
        background: "linear-gradient(135deg, #0f172a 0%, #312e81 55%, #4f46e5 100%)",
        color: "white",
      }}
    >
      <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: "-2px" }}>Gleistrix</div>
      <div style={{ marginTop: 24, maxWidth: 950, fontSize: 42, lineHeight: 1.18, fontWeight: 650 }}>
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
