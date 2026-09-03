"use client";

import { useEffect } from "react";
import type { JourneyStep } from "@/lib/types";

export function JourneyController({ onStep }: { onStep: (step: JourneyStep) => void }) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-journey-step]"));
    const observer = new IntersectionObserver((entries) => {
      const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const step = active?.target.getAttribute("data-journey-step") as JourneyStep | null;
      if (step) onStep(step);
    }, { threshold: [0.3, 0.5, 0.7], rootMargin: "-12% 0px -12% 0px" });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [onStep]);
  return null;
}

