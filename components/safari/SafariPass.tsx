"use client";

import { useRef, useState } from "react";
import type { Expedition, Locale } from "@/lib/types";
import { eventConfig } from "@/lib/eventConfig";
import { roleForKey } from "@/lib/safariRoles";
import { AnimalGlyph } from "./AnimalGlyph";

function safeName(name: string) {
  return name.replace(/[<>\u0000-\u001f]/g, "").trim().slice(0, 80) || "EXPLORER";
}

async function buildPassPng(expedition: Expedition, locale: Locale) {
  const role = roleForKey(expedition.animalKey);
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
  gradient.addColorStop(0, expedition.rank === "GOLDEN EXPLORER" ? "#84611f" : "#173e2d");
  gradient.addColorStop(0.55, "#0d291f");
  gradient.addColorStop(1, "#061711");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1920);
  ctx.strokeStyle = expedition.rank === "GOLDEN EXPLORER" ? "#f4d275" : "#cdb56f";
  ctx.lineWidth = 4;
  ctx.strokeRect(55, 55, 970, 1810);
  ctx.strokeRect(76, 76, 928, 1768);
  ctx.textAlign = "center";
  ctx.fillStyle = "#ead69b";
  ctx.font = "600 32px Georgia";
  ctx.fillText("VIP EXPEDITION CREDENTIAL", 540, 155);
  ctx.fillStyle = "#fff8e8";
  ctx.font = "700 74px Georgia";
  ctx.fillText("ALEXIS ALESSANDRO", 540, 260);
  ctx.font = "700 128px Georgia";
  ctx.fillText("WILD ONE", 540, 400);
  ctx.beginPath(); ctx.arc(540, 760, 260, 0, Math.PI * 2); ctx.fillStyle = role.accent; ctx.globalAlpha = 0.22; ctx.fill(); ctx.globalAlpha = 1;
  ctx.fillStyle = "#fff8e8"; ctx.font = "700 170px Georgia"; ctx.fillText(role.animal[locale].slice(0, 1), 540, 825);
  ctx.fillStyle = "#ead69b"; ctx.font = "700 42px Arial"; ctx.fillText(role.animal[locale].toUpperCase(), 540, 1035);
  ctx.fillStyle = "#fff8e8"; ctx.font = "700 58px Georgia"; ctx.fillText(safeName(expedition.guestName).toUpperCase(), 540, 1160);
  ctx.fillStyle = "#d8ceb7"; ctx.font = "400 34px Arial"; ctx.fillText(`${role.role[locale]} · ${role.route[locale]}`, 540, 1235);
  ctx.fillText("SEPTEMBER 20 · 2026", 540, 1370); ctx.fillText("MARGATE · FLORIDA", 540, 1430);
  ctx.fillStyle = "#ead69b"; ctx.font = "700 46px Arial"; ctx.fillText(expedition.rank, 540, 1570);
  ctx.font = "600 28px monospace"; ctx.fillText(`EXPEDITION ${expedition.code}`, 540, 1665);
  ctx.font = "600 25px Arial"; ctx.fillText(expedition.attendance === "yes" ? "RSVP · CONFIRMED" : expedition.attendance === "no" ? "RSVP · UNABLE" : "RSVP · OPEN", 540, 1740);
  return await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("PNG failed")), "image/png"));
}

export function SafariPass({ expedition, locale, onClose }: { expedition: Expedition; locale: Locale; onClose?: () => void }) {
  const role = roleForKey(expedition.animalKey);
  const [sharing, setSharing] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  async function share() {
    setSharing(true);
    try {
      const blob = await buildPassPng(expedition, locale);
      const file = new File([blob], "alexis-wild-one-safari-pass.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: "Alexis Alessandro — Wild One", text: locale === "es" ? "Mi Safari Pass está listo." : "My Safari Pass is ready.", files: [file] });
      } else {
        const url = URL.createObjectURL(blob);
        if (linkRef.current) { linkRef.current.href = url; linkRef.current.click(); }
        window.setTimeout(() => URL.revokeObjectURL(url), 5000);
      }
      window.dispatchEvent(new CustomEvent("wild-analytics", { detail: "pass_shared" }));
    } finally { setSharing(false); }
  }
  return (
    <section className={`pass-forge ${expedition.rank === "GOLDEN EXPLORER" ? "pass-forge--golden" : ""}`} aria-label="Safari Pass">
      {onClose && <button className="close-symbol" onClick={onClose} aria-label={locale === "es" ? "Cerrar pase" : "Close pass"}>×</button>}
      <div className="pass-ribbon">VIP · EXPEDITION CREDENTIAL</div>
      <p className="eyebrow">ALEXIS ALESSANDRO · WILD ONE</p>
      <div className="pass-animal" style={{ color: role.accent }}><AnimalGlyph animal={expedition.animalKey} title={role.animal[locale]} /></div>
      <div className="pass-identity">
        <span>{locale === "es" ? "EXPLORADOR" : "GUEST"}</span>
        <h3>{safeName(expedition.guestName)}</h3>
        <p>{role.role[locale]} · {role.route[locale]}</p>
      </div>
      <div className="pass-details"><span>SEPTEMBER 20 · 2026</span><span>MARGATE · FLORIDA</span></div>
      <strong className="pass-rank">{expedition.rank}</strong>
      <div className="pass-code">{expedition.code} · {expedition.attendance === "yes" ? "CONFIRMED" : expedition.attendance === "no" ? "UNABLE" : "RSVP OPEN"}</div>
      <button className="world-action world-action--gold" onClick={share} disabled={sharing}>{sharing ? (locale === "es" ? "CREANDO…" : "FORGING…") : (locale === "es" ? "COMPARTIR MI SAFARI PASS" : "SHARE MY SAFARI PASS")}</button>
      <a ref={linkRef} download="alexis-wild-one-safari-pass.png" hidden>Download pass</a>
    </section>
  );
}

