import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Alexis Alessandro — Wild One";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#102920",
          color: "#f6f0e5",
          padding: "70px 80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ position: "absolute", width: 520, height: 520, borderRadius: 520, border: "1px solid rgba(201,167,99,.22)", right: -150, top: -140 }} />
        <div style={{ position: "absolute", width: 360, height: 360, borderRadius: 360, border: "1px solid rgba(201,167,99,.16)", right: -10, top: -10 }} />
        <div style={{ position: "absolute", width: 190, height: 190, borderRadius: 190, background: "#7f9270", right: 96, bottom: 65, opacity: .38 }} />
        <div style={{ position: "absolute", width: 130, height: 160, borderRadius: 90, background: "#a78f63", right: 220, bottom: 48, opacity: .6 }} />
        <div style={{ position: "absolute", width: 100, height: 125, borderRadius: 70, background: "#e7dbc5", right: 40, bottom: 32, opacity: .72 }} />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: 7, fontSize: 18, color: "#d9c28d" }}>
            <span style={{ width: 46, height: 1, background: "#d9c28d" }} />
            Our little explorer is turning one
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 42, color: "#d9c28d", letterSpacing: 12, textTransform: "uppercase", marginBottom: 12 }}>Wild One</div>
            <div style={{ display: "flex", fontSize: 104, lineHeight: .88, fontWeight: 600 }}>Alexis</div>
            <div style={{ display: "flex", fontSize: 76, lineHeight: 1, fontWeight: 500 }}>Alessandro</div>
          </div>

          <div style={{ display: "flex", gap: 28, alignItems: "center", fontFamily: "sans-serif", fontSize: 22, letterSpacing: 2 }}>
            <span>SEPTEMBER 20 · 2026</span>
            <span style={{ opacity: .45 }}>•</span>
            <span>5:00 PM</span>
            <span style={{ opacity: .45 }}>•</span>
            <span>MARGATE, FL</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
