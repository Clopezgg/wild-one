"use client";

import { useEffect, useState } from "react";
import { eventConfig } from "@/lib/eventConfig";
import type { Invitation } from "@/lib/types";

function tokenFromPath() {
  const p = window.location.pathname.split("/").filter(Boolean);
  return p[0] === "i" ? (p[1] ?? "").toLowerCase() : "";
}

export default function Page() {
  const [token, setToken] = useState("");
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = tokenFromPath();
    setToken(t);
    (async () => {
      if (!/^[a-z0-9]{16,40}$/.test(t)) {
        setError("Esta invitación no es válida.");
        setLoading(false);
        return;
      }
      try {
        const r = await fetch("/api/invitation/" + encodeURIComponent(t), { cache: "no-store" });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        setInvitation(d.invitation);
      } catch (x) {
        setError(x instanceof Error ? x.message : "No fue posible abrir la invitación.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <main className="invitation-experience loading-screen">
        <div className="loading-seal">C <span>·</span> A</div>
        <p>PREPARANDO TU INVITACIÓN</p>
      </main>
    );
  }

  if (!invitation) {
    return (
      <main className="invitation-experience error-screen">
        <div className="inner-paper">
          <p className="eyebrow">C · A — UNA NOCHE</p>
          <h1 className="script-title">Invitación no disponible</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return <PersonalInvitation invitation={invitation} token={token} />;
}

function PersonalInvitation({ invitation, token }: { invitation: Invitation; token: string }) {
  const [opened, setOpened] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [att, setAtt] = useState<boolean | null>(invitation.attendance);
  const [name, setName] = useState(invitation.guest_name ?? "");
  const [party, setParty] = useState(invitation.party_size ?? 1);
  const [message, setMessage] = useState(invitation.message ?? "");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const person = invitation.honoree === "candida" ? eventConfig.candida : eventConfig.alberto;
  const guestLabel = invitation.guest_name?.trim() || "invitado especial";
  const places = invitation.max_guests === 1 ? "[1] lugar" : "[" + invitation.max_guests + "] lugares";

  function openInvitation() {
    if (opened) return;
    setOpened(true);
    window.setTimeout(() => {
      setRevealed(true);
      window.setTimeout(() => {
        document.getElementById("invitation-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 350);
    }, 950);
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setSaving(true);
    try {
      const r = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, guest_name: name, attendance: att, party_size: party, message }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setSaved(true);
      setAtt(d.invitation.attendance);
    } catch (x) {
      alert(x instanceof Error ? x.message : "No fue posible guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className={"invitation-experience " + (opened ? "opened" : "")}>
      <section className="envelope-stage" aria-label="Invitación">
        <div className="stars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <p className="envelope-kicker">C · A</p>
        <p className="envelope-label">INVITACIÓN PERSONAL</p>

        <div className="envelope-wrap">
          <button className={"envelope " + (opened ? "is-opening" : "")} onClick={openInvitation} aria-label="Abrir invitación tocando el sello" type="button">
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
              <div className="envelope-address"><small>PARA</small><strong>{guestLabel}</strong></div>
            </div>
            <div className="wax-seal"><span>C</span><i>·</i><span>A</span></div>
          </button>
        </div>

        <div className="open-prompt">
          <span className="prompt-line" />
          <span>{opened ? "LA INVITACIÓN SE ESTÁ ABRIENDO" : "TOCA EL SELLO PARA ABRIR"}</span>
          <span className="prompt-line" />
        </div>

        <div className="personal-hint">
          <strong>Hola, {guestLabel}.</strong>
          <span>Hemos reservado {places} para ti.</span>
        </div>
      </section>

      {revealed && (
        <div id="invitation-content" className="revealed-invitation">
          <section className="reveal-hero">
            <div className="reveal-frame">
              <p className="eyebrow">UNA FECHA · DOS HISTORIAS</p>
              <div className="ornament-line"><span>✦</span></div>
              <p className="hello">Hola, {guestLabel}.</p>
              <h1 className="script-title">Cándida <span>&amp;</span> Alberto</h1>
              <p className="hero-copy">Con mucha alegría queremos compartir contigo una noche muy especial. Nos encantaría que nos acompañes a celebrar a Cándida y Alberto.</p>
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
                <div className="celebrants-divider">✦</div>
                <article><span>A</span><small>ALBERTO</small><strong>38</strong><em>AÑOS</em></article>
              </div>
              <div className="ornament-line"><span>◆</span></div>
              <p className="story-copy">Una fecha. Dos historias. Dos edades. Y la oportunidad de reunir a las personas que forman parte de nuestros recuerdos.</p>
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
              <a className="gold-button" href={eventConfig.maps} target="_blank" rel="noreferrer">VER UBICACIÓN <b>↗</b></a>
              <a className="text-link" href="/api/calendar">AGREGAR AL CALENDARIO</a>
            </div>
          </section>

          <section className="rsvp-section">
            <div className="rsvp-card">
              <div className="mini-seal">C · A</div>
              <p className="eyebrow">TU RESPUESTA</p>
              <h2 className="script-title">¿Nos acompañas?</h2>
              <p className="rsvp-copy">Al final de la invitación encontrarás la opción para confirmar tu asistencia.</p>
              <form onSubmit={submit}>
                <label>Tu nombre<input required value={name} onChange={e => setName(e.target.value)} placeholder="Escribe tu nombre" /></label>
                <label>¿Asistirás?
                  <span className="rsvp-options">
                    <button type="button" className={att === true ? "selected" : ""} onClick={() => setAtt(true)}>SÍ, ASISTIRÉ</button>
                    <button type="button" className={att === false ? "selected" : ""} onClick={() => setAtt(false)}>NO PODRÉ ASISTIR</button>
                  </span>
                </label>
                {att === true && (
                  <label>Cantidad de personas
                    <select value={party} onChange={e => setParty(Number(e.target.value))}>
                      {Array.from({ length: invitation.max_guests }, (_, n) => <option key={n + 1} value={n + 1}>{n + 1} {n === 0 ? "persona" : "personas"}</option>)}
                    </select>
                  </label>
                )}
                <label>Mensaje para Cándida &amp; Alberto<textarea rows={4} maxLength={500} value={message} onChange={e => setMessage(e.target.value)} placeholder="Déjanos unas palabras…" /></label>
                <button className="gold-button full" disabled={saving || att === null} type="submit">{saving ? "GUARDANDO…" : "CONFIRMAR ASISTENCIA"} <b>→</b></button>
                {saved && <div className="rsvp-success"><strong>✓ RESPUESTA RECIBIDA</strong><span>{att ? "Nos vemos el 3 de octubre. Será una noche muy especial." : "Gracias por hacérnoslo saber."}</span></div>}
              </form>
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
