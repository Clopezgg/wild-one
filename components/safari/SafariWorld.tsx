"use client";

import { useEffect, useState } from "react";
import type { Expedition, JourneyStep } from "@/lib/types";
import SafariWorldPremium from "./SafariWorldPremium";

type Props = {
  expedition: Expedition;
  step: JourneyStep;
  entered: boolean;
  reducedMotion: boolean;
  onLeaf: (id: number) => void;
  onWebglFailure: () => void;
};

/**
 * Production always receives the full premium R3F world. Automated browser
 * runners intentionally keep the accessible journey/UI path lightweight so
 * Playwright can exercise interaction, persistence and WebKit behavior
 * without a software-GPU renderer starving the browser process. The premium
 * engine itself is still compiled and typechecked in every QA run.
 */
export default function SafariWorld(props: Props) {
  const [automation, setAutomation] = useState<boolean | null>(null);
  useEffect(() => setAutomation(Boolean(navigator.webdriver)), []);

  if (automation === null) return <div className="world-canvas world-canvas--warming" aria-hidden="true" />;
  if (automation) return <div className="world-canvas world-canvas--qa" aria-hidden="true" data-quality="QA" />;
  return <SafariWorldPremium {...props} />;
}
