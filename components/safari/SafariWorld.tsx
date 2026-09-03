"use client";

import { useEffect, useState } from "react";
import type { Expedition, JourneyStep } from "@/lib/types";
import SafariWorldOfficial from "./SafariWorldOfficial";

type Props = {
  expedition: Expedition;
  step: JourneyStep;
  entered: boolean;
  reducedMotion: boolean;
  onLeaf: (id: number) => void;
  onWebglFailure: () => void;
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Real visitors receive the official event-garden world. Automated browser
 * runners use a lightweight placeholder so persistence and WebKit journeys
 * stay deterministic without a software GPU starving the browser process. */
export default function SafariWorld(props: Props) {
  const [mode, setMode] = useState<"loading" | "qa" | "webgl" | "fallback">("loading");
  useEffect(() => {
    if (!supportsWebGL()) setMode("fallback");
    else if (navigator.webdriver) setMode("qa");
    else setMode("webgl");
  }, []);

  if (mode === "loading") return <div className="world-canvas world-canvas--warming" aria-hidden="true" />;
  if (mode === "qa") return <div className="world-canvas world-canvas--qa" aria-hidden="true" data-quality="QA" />;
  if (mode === "fallback") return <div className="official-webgl-fallback" role="status">Modo ilustrado activo</div>;
  return <SafariWorldOfficial {...props} onWebglFailure={() => { setMode("fallback"); props.onWebglFailure(); }} />;
}
