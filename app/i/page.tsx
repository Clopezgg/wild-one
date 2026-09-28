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
    <main className={"lux-invitation " + (opened ? "is-open" : "")}>
      <section className="lux-opening" aria-label="Invitación personal">
        <div className="lux-orbit orbit-one" aria-hidden="true" /><div className="lux-orbit orbit-two" aria-hidden="true" />
        <div className="lux-stars" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="lux-brand"><span>C</span><b>·</b><span>A</span></div>
        <p className="lux-kicker">INVITACIÓN PERSONAL</p>
        <div className="lux-envelope-scene">
          <button className={"lux-envelope " + (opened ? "opening" : "")} onClick={openInvitation} aria-label="Abrir la invitación" type="button">
            <div className="lux-envelope-shadow" /><div className="lux-envelope-body" />
            <div className="lux-envelope-liner"><span>C · A</span><small>03 · 10 · 2026</small></div>
            <div className="lux-envelope-card"><small>PARA {guestLabel.toUpperCase()}</small><strong>CÁNDIDA</strong><em>&amp;</em><strong>ALBERTO</strong><span>03 OCTUBRE 2026</span></div>
            <div className="lux-envelope-flap"><span>C · A</span></div>
            <div className="lux-envelope-front"><span className="lux-corner tl" /><span className="lux-corner tr" /><span className="lux-corner bl" /><span className="lux-corner br" /><div className="lux-address"><small>Hemos reservado {places}</small><strong>C · A</strong></div></div>
            <div className="lux-seal"><span>C</span><i>·</i><span>A</span></div>
          </button>
        </div>
        <div className="lux-open-label"><span /><p>{opened ? "ABRIENDO" : "TOCA EL SELLO"} </p><span /></div>
      </section>
      {revealed && (
        <div id="invitation-content" className="lux-content">
          <section className="lux-card-scene hero-scene">
            <article className="hero-card">
              <div className="hero-card-border" />
              <p className="lux-overline">C · A — UNA NOCHE</p><div className="hero-rule"><i /></div>
              <p className="hero-greeting">Esta invitación está reservada para ti</p>
              <h1><span>Cándida</span><b>&amp;</b><span>Alberto</span></h1>
              <p className="hero-subtitle">UNA FECHA · DOS HISTORIAS</p>
              <div className="hero-date-lockup"><strong>03</strong><span>OCTUBRE<br /><b>2026</b></span></div>
              <p className="hero-time">SÁBADO · 8:00 PM</p>
              <div className="hero-bottom-line">PARA {guestLabel.toUpperCase()} · {places.toUpperCase()}</div>
            </article>
          </section>
          <section className="lux-card-scene paper-scene">
            <article className="lux-paper-card">
              <p className="lux-overline">LA CELEBRACIÓN</p><div className="paper-monogram">C · A</div>
              <h2>Dos historias.<br /><i>Una noche.</i></h2>
              <div className="age-grid"><div><small>CÁNDIDA</small><strong>66</strong><span>AÑOS</span></div><div className="age-divider" /><div><small>ALBERTO</small><strong>38</strong><span>AÑOS</span></div></div>
              <p className="paper-copy">Una noche para celebrar la vida, compartir recuerdos y reunir a quienes queremos cerca.</p>
            </article>
          </section>
          <section className="lux-card-scene date-scene">
            <article className="lux-dark-card">
              <p className="lux-overline">GUARDA LA FECHA</p><div className="date-display"><strong>03</strong><div><span>OCTUBRE</span><b>2026</b></div></div>
              <div className="date-details"><div><small>SÁBADO</small><strong>8:00 PM</strong></div><div><small>LUGAR</small><strong>8261 SW 8th St</strong><span>North Lauderdale, FL 33068</span></div></div>
              <div className="lux-actions"><a href={eventConfig.maps} target="_blank" rel="noreferrer">VER UBICACIÓN</a><a href="/api/calendar">AÑADIR AL CALENDARIO</a></div>
            </article>
          </section>
          <section className="lux-card-scene rsvp-scene">
            <article className="lux-rsvp-card">
              <div className="rsvp-monogram">C · A</div><p className="lux-overline">TU RESPUESTA</p><h2>¿Nos acompañas?</h2>
              <p>Hemos reservado {places} para ti.</p>
              <form onSubmit={submit}>
                <label>Tu nombre<input required value={name} onChange={e => setName(e.target.value)} placeholder="Escribe tu nombre" /></label>
                <label>Asistencia<span className="lux-rsvp-options"><button type="button" className={att === true ? "selected" : ""} onClick={() => setAtt(true)}>SÍ, ASISTIRÉ</button><button type="button" className={att === false ? "selected" : ""} onClick={() => setAtt(false)}>NO PODRÉ ASISTIR</button></span></label>
                {att === true && <label>Cantidad de personas<select value={party} onChange={e => setParty(Number(e.target.value))}>{Array.from({length: invitation.max_guests},(_,n)=><option key={n+1} value={n+1}>{n+1}</option>)}</select></label>}
                <label>Un mensaje<textarea rows={4} maxLength={500} value={message} onChange={e => setMessage(e.target.value)} placeholder="Tus palabras para Cándida y Alberto" /></label>
                <button className="lux-submit" disabled={saving || att === null} type="submit">{saving ? "GUARDANDO…" : "CONFIRMAR ASISTENCIA"}</button>
                {saved && <div className="lux-success"><strong>RESPUESTA RECIBIDA</strong><span>{att ? "Nos vemos el 3 de octubre." : "Gracias por hacérnoslo saber."}</span></div>}
              </form>
            </article>
          </section>
          <footer className="lux-closing"><div className="closing-monogram">C <i>·</i> A</div><p>03 · 10 · 2026</p><small>UNA FECHA · DOS HISTORIAS</small></footer>
        </div>
      )}
    </main>
  );
}
