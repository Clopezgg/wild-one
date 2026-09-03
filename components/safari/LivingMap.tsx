"use client";

import type { Expedition, JourneyStep, Locale } from "@/lib/types";
import { roleForKey } from "@/lib/safariRoles";
import { AnimalGlyph } from "./AnimalGlyph";

const stops: Array<{ step: JourneyStep; en: string; es: string }> = [
  { step: "ENTER", en: "Balloon Gate", es: "Portal de Globos" },
  { step: "ANIMAL_REVEAL", en: "Animal Reveal", es: "Revelación Animal" },
  { step: "TRAIL", en: "Golden Leaf Grove", es: "Arboleda Dorada" },
  { step: "COORDINATES", en: "Coordinates", es: "Coordenadas" },
  { step: "SAFARI_CHIC", en: "Safari Chic", es: "Safari Chic" },
  { step: "CALENDAR", en: "Calendar Observatory", es: "Observatorio" },
  { step: "COUNTDOWN", en: "Countdown Temple", es: "Templo del Tiempo" },
  { step: "RSVP", en: "RSVP Outpost", es: "Puesto RSVP" },
  { step: "PASS", en: "Pass Forge", es: "Forja del Pase" },
  { step: "FINALE", en: "Grand Clearing", es: "Gran Claro" },
];

const order: JourneyStep[] = ["ENTER", "ANIMAL_REVEAL", "MAP", "TRAIL", "CELEBRATION", "COORDINATES", "SAFARI_CHIC", "CALENDAR", "COUNTDOWN", "QUEST", "RSVP", "PASS", "FINALE"];

export function LivingMap({ expedition, locale, current, onClose }: { expedition: Expedition; locale: Locale; current: JourneyStep; onClose: () => void }) {
  const role = roleForKey(expedition.animalKey);
  const currentIndex = order.indexOf(current);
  const mapIndex = Math.max(0, Math.min(stops.length - 1, Math.round((currentIndex / (order.length - 1)) * (stops.length - 1))));
  return (
    <section className="map-sheet" role="dialog" aria-modal="true" aria-label={locale === "es" ? "Mapa vivo del safari" : "Living Safari Map"}>
      <button className="close-symbol" onClick={onClose} aria-label={locale === "es" ? "Cerrar mapa" : "Close map"}>×</button>
      <header>
        <span>{locale === "es" ? "MAPA VIVO DEL SAFARI" : "LIVING SAFARI MAP"}</span>
        <h2>{role.route[locale]}</h2>
        <p>{expedition.leaves.length}/3 {locale === "es" ? "hojas doradas encontradas" : "Golden Leaves found"}</p>
      </header>
      <div className="expedition-map">
        <svg viewBox="0 0 680 940" preserveAspectRatio="none" aria-hidden="true">
          <path className="map-river" d="M86 38C580 100 97 220 570 305S95 470 554 560 88 720 592 895" />
          <path className="map-route" d="M110 55C510 120 162 225 530 315S150 470 515 570 130 720 560 885" />
        </svg>
        <ol>
          {stops.map((stop, index) => (
            <li key={stop.step} className={index < mapIndex ? "visited" : index === mapIndex ? "current" : "future"}>
              <span className="map-node">{index + 1}</span>
              <strong>{locale === "es" ? stop.es : stop.en}</strong>
              {index === 2 && <small>{role.route[locale]}</small>}
              {index === mapIndex && <span className="map-companion" style={{ color: role.accent }}><AnimalGlyph animal={expedition.animalKey} /></span>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

