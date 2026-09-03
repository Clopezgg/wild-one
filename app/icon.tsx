import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 64, background: "#17382e", color: "#e4cf9b", fontSize: 38, fontFamily: "serif", position: "relative" }}>
        A
        <div style={{ position: "absolute", right: 1, bottom: 1, width: 22, height: 22, borderRadius: 22, background: "#c9a763", color: "#102920", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontFamily: "sans-serif", fontWeight: 700 }}>1</div>
      </div>
    ),
    size
  );
}
