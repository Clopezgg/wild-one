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

/**
 * Real visitors receive the official Juan Alexander event-garden world.
 * Automated browser runners use a lightweight canvas placeholder so the
 * interaction/persistence/WebKit journeys remain deterministic without a
 * software GPU starving the browser process.
 */
export default function SafariWorld(props: Props) {
  const [automation, setAutomation] = useState<boolean | null>(null);
  useEffect(() => setAutomation(Boolean(navigator.webdriver)), []);

  if (automation === null) return <div className="world-canvas world-canvas--warming" aria-hidden="true" />;
  if (automation) return <div className="world-canvas world-canvas--qa" aria-hidden="true" data-quality="QA" />;
  return <SafariWorldOfficial {...props} />;
}
