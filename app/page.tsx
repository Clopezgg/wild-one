"use client";

import { useState } from "react";
import { eventConfig } from "@/lib/eventConfig";

export default function HomePage() {
  const [opened, setOpened] = useState(false);

  return (
    <main className={"lux-invitation " + (opened ? "is-open" : "")}>
      <section className="lux-opening" aria-label="Invitación Cándida y Alberto">
        <div className="lux-orbit orbit-one" aria-hidden="true" />
        <div className="lux-orbit orbit-two" aria-hidden="true" />
        <div className="lux-stars" aria-hidden="true"><i /><i /><i /><i /><i /></div>

        <div className="lux-brand">
          <span>C</span><b>·</b><span>A</span>
        </div>
        <p className="lux-kicker">UNA NOCHE</p>

        <div className="lux-envelope-scene">
          <button
            className={"lux-envelope " + (opened ? "opening" : "")}
            type="button"
            onClick={() => setOpened(true)}
            aria-label="Abrir la invitación"
          >
            <div className="lux-envelope-shadow" />
            <div className="lux-envelope-body" />
            <div className="lux-envelope-liner">
              <span>C · A</span>
              <small>03 · 10 · 2026</small>
            </div>
            <div className="lux-envelope-card">
              <small>UNA FECHA · DOS HISTORIAS</small>
              <strong>CÁNDIDA</strong>
              <em>&amp;</em>
              <strong>ALBERTO</strong>
              <span>03 OCTUBRE 2026</span>
            </div>
            <div className="lux-envelope-flap">
              <span>C · A</span>
            </div>
            <div className="lux-envelope-front">
              <span className="lux-corner tl" /><span className="lux-corner tr" />
              <span className="lux-corner bl" /><span className="lux-corner br" />
              <div className="lux-address">
                <small>INVITACIÓN ESPECIAL</small>
                <strong>C · A</strong>
              </div>
            </div>
            <div className="lux-seal"><span>C</span><i>·</i><span>A</span></div>
          </button>
        </div>

        <div className="lux-open-label">
          <span />
          <p>{opened ? "ABRIENDO" : "TOCA EL SELLO"}</p>
          <span />
        </div>
      </section>

      {opened && (
        <div className="lux-content">
          <section className="lux-card-scene hero-scene">
            <article className="hero-card">
              <div className="hero-card-border" />
              <p className="lux-overline">C · A — UNA NOCHE</p>
              <div className="hero-rule"><i /></div>
              <p className="hero-greeting">Tenemos el gusto de invitarte</p>
              <h1><span>Cándida</span><b>&amp;</b><span>Alberto</span></h1>
              <p className="hero-subtitle">UNA FECHA · DOS HISTORIAS</p>
              <div className="hero-date-lockup">
                <strong>03</strong>
                <span>OCTUBRE<br /><b>2026</b></span>
              </div>
              <p className="hero-time">SÁBADO · 8:00 PM</p>
              <div className="hero-bottom-line">CELEBRAMOS 66 · 38 AÑOS</div>
            </article>
          </section>

          <section className="lux-card-scene paper-scene">
            <article className="lux-paper-card">
              <p className="lux-overline">LA CELEBRACIÓN</p>
              <div className="paper-monogram">C · A</div>
              <h2>Dos historias.<br /><i>Una noche.</i></h2>
              <div className="age-grid">
                <div><small>CÁNDIDA</small><strong>66</strong><span>AÑOS</span></div>
                <div className="age-divider" />
                <div><small>ALBERTO</small><strong>38</strong><span>AÑOS</span></div>
              </div>
              <p className="paper-copy">Una noche para celebrar la vida, compartir recuerdos y reunir a quienes queremos cerca.</p>
            </article>
          </section>

          <section className="lux-card-scene date-scene">
            <article className="lux-dark-card">
              <p className="lux-overline">GUARDA LA FECHA</p>
              <div className="date-display">
                <strong>03</strong>
                <div><span>OCTUBRE</span><b>2026</b></div>
              </div>
              <div className="date-details">
                <div><small>SÁBADO</small><strong>8:00 PM</strong></div>
                <div><small>LUGAR</small><strong>8251 SW 5th Ct</strong><span>North Lauderdale, FL 33068</span></div>
              </div>
              <div className="lux-actions">
                <a href={eventConfig.maps} target="_blank" rel="noreferrer">VER UBICACIÓN</a>
                <a href="/api/calendar">AÑADIR AL CALENDARIO</a>
              </div>
            </article>
          </section>

          <footer className="lux-closing">
            <div className="closing-monogram">C <i>·</i> A</div>
            <p>03 · 10 · 2026</p>
            <small>UNA FECHA · DOS HISTORIAS</small>
          </footer>
        </div>
      )}
    </main>
  );
}
