"use client";

import { useState } from "react";
import { eventConfig } from "@/lib/eventConfig";

export default function HomePage() {
  const [opened,setOpened]=useState(false);

  return (
    <main className={"invitation-experience " + (opened ? "opened" : "")}>
      <section className="envelope-stage" aria-label="Invitación Cándida y Alberto">
        <div className="stars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <p className="envelope-kicker">C · A</p>
        <p className="envelope-label">UNA INVITACIÓN ESPECIAL</p>
        <div className="envelope-wrap">
          <button className={"envelope " + (opened ? "is-opening" : "")} type="button" onClick={() => setOpened(true)} aria-label="Abrir invitación tocando el sello">
            <div className="envelope-back" />
            <div className="envelope-paper">
              <div className="paper-lines">
                <span>UNA FECHA · DOS HISTORIAS</span>
                <strong>CÁNDIDA &amp; ALBERTO</strong>
                <small>03 · OCTUBRE · 2026</small>
              </div>
            </div>
            <div className="envelope-flap"><span className="flap-monogram">C · A</span></div>
            <div className="envelope-front">
              <span className="corner corner-a" /><span className="corner corner-b" /><span className="corner corner-c" /><span className="corner corner-d" />
              <div className="envelope-address"><small>PARA TI</small><strong>UNA NOCHE ESPECIAL</strong></div>
            </div>
            <div className="wax-seal"><span>C</span><i>·</i><span>A</span></div>
          </button>
        </div>
        <div className="open-prompt">
          <span className="prompt-line" /><span>{opened ? "LA INVITACIÓN SE ESTÁ ABRIENDO" : "TOCA EL SELLO PARA ABRIR"}</span><span className="prompt-line" />
        </div>
      </section>

      {opened && (
        <div className="revealed-invitation">
          <section className="reveal-hero">
            <div className="reveal-frame">
              <p className="eyebrow">UNA FECHA · DOS HISTORIAS</p>
              <div className="ornament-line"><span aria-hidden="true" /></div>
              <h1 className="script-title">Cándida <span>&amp;</span> Alberto</h1>
              <p className="hero-copy">Con mucha alegría queremos compartir contigo una noche muy especial. Nos encantaría que nos acompañes a celebrar sus 66 y 38 años.</p>
              <div className="hero-date"><strong>03</strong><div><span>OCTUBRE</span><b>2026</b></div></div>
              <p className="hero-time">SÁBADO · 8:00 PM</p>
              <p className="hero-note">Dos historias · una noche para recordar</p>
            </div>
          </section>
          <section className="story-section light-paper">
            <div className="paper-card">
              <p className="eyebrow">CELEBRAMOS A</p>
              <div className="celebrants">
                <article><span>C</span><small>CÁNDIDA</small><strong>66</strong><em>AÑOS</em></article>
                <div className="celebrants-divider" aria-hidden="true" />
                <article><span>A</span><small>ALBERTO</small><strong>38</strong><em>AÑOS</em></article>
              </div>
              <div className="ornament-line"><span aria-hidden="true" /></div>
              <p className="story-copy">Una fecha. Dos historias. Dos edades. Y una noche para reunir a quienes forman parte de nuestros recuerdos.</p>
            </div>
          </section>
          <section className="event-section">
            <div className="event-panel">
              <p className="eyebrow">EL GRAN ENCUENTRO</p>
              <h2 className="script-title">Guarda la fecha</h2>
              <div className="big-date"><strong>03</strong><span>OCTUBRE<br /><b>2026</b></span></div>
              <div className="event-details">
                <div><small>SÁBADO</small><strong>8:00 PM</strong></div>
                <div><small>LUGAR</small><strong>8261 SW 8th St</strong><span>North Lauderdale, FL 33068</span></div>
              </div>
              <a className="gold-button" href={eventConfig.maps} target="_blank" rel="noreferrer">VER UBICACIÓN <b>ABRIR</b></a>
              <a className="text-link" href="/api/calendar">AGREGAR AL CALENDARIO</a>
            </div>
          </section>
          <footer className="final-card">
            <div className="final-seal">C <span>·</span> A</div>
            <p className="eyebrow">CON CARIÑO</p>
            <h2 className="script-title">Cándida &amp; Alberto</h2>
            <p>03 · 10 · 2026</p>
            <small>UNA FECHA · DOS HISTORIAS</small>
          </footer>
        </div>
      )}
    </main>
  );
}
