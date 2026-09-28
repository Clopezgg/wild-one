"use client";

import { useEffect, useState } from "react";
import { eventConfig } from "@/lib/eventConfig";
import type { Invitation } from "@/lib/types";

function tokenFromPath() {
  const p = window.location.pathname.split("/").filter(Boolean);
  return p[0] === "i" ? (p[1] ?? "").toLowerCase() : "";
}

function Ornament({ className = "" }: { className?: string }) {
  return <span className={"ornament " + className} aria-hidden="true">✦</span>;
}

export default function Page() {
  const [token, setToken] = useState("");
  const [i, setI] = useState<Invitation | null>(null);
  const [e, setE] = useState("");
  const [l, setL] = useState(true);

  useEffect(() => {
    const t = tokenFromPath();
    setToken(t);
    (async () => {
      if (!/^[a-z0-9]{16,40}$/.test(t)) { setE("Esta invitación no es válida."); setL(false); return; }
      try {
        const r = await fetch("/api/invitation/" + encodeURIComponent(t), { cache: "no-store" });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        setI(d.invitation);
      } catch (x) {
        setE(x instanceof Error ? x.message : "No fue posible abrir la invitación.");
      } finally { setL(false); }
    })();
  }, []);

  if (l) return <main className="loading invitation-loading"><div className="loading-card"><div className="seal"><span>C</span><i>·</i><span>A</span></div><div className="eyebrow">PREPARANDO TU NOCHE</div></div></main>;
  if (!i) return <main className="error"><div><div className="eyebrow">C · A</div><h1 className="display hero-title">INVITACIÓN NO DISPONIBLE</h1><p className="muted">{e}</p></div></main>;
  return <Experience invitation={i} token={token} />;
}

function Experience({ invitation, token }: { invitation: Invitation; token: string }) {
  const [open, setOpen] = useState(false);
  const [att, setAtt] = useState<boolean | null>(invitation.attendance);
  const [name, setName] = useState(invitation.guest_name ?? "");
  const [party, setParty] = useState(invitation.party_size ?? 1);
  const [msg, setMsg] = useState(invitation.message ?? "");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const p = invitation.honoree === "candida" ? eventConfig.candida : eventConfig.alberto;

  async function submit(ev: React.FormEvent) {
    ev.preventDefault(); setSaving(true);
    try {
      const r = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, guest_name: name, attendance: att, party_size: party, message: msg }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setSaved(true); setAtt(d.invitation.attendance);
    } catch (x) { alert(x instanceof Error ? x.message : "No fue posible guardar"); }
    finally { setSaving(false); }
  }

  return (
    <main className="invitation">
      <section className="personal-cover">
        <div className="silk silk-one" /><div className="silk silk-two" /><div className="bokeh bokeh-one" /><div className="bokeh bokeh-two" />
        <div className="personal-envelope">
          <div className="envelope-edge" />
          {!open ? (
            <>
              <div className="micro-row"><span>C · A</span><span>UNA NOCHE</span></div>
              <div className="seal"><span>C</span><i>·</i><span>A</span></div>
              <p className="kicker">UNA INVITACIÓN PERSONAL PARA</p>
              <h1 className="display personal-name">{p.name}</h1>
              <div className="personal-age"><strong>{p.age}</strong><span>AÑOS</span></div>
              <div className="light-motif"><span /></div>
              <button className="gold-button open-button" onClick={() => setOpen(true)}>ABRIR INVITACIÓN <b>↓</b></button>
              <p className="cover-date">SÁBADO · 03 OCTUBRE 2026 · 8:00 PM</p>
            </>
          ) : (
            <div className="opening">
              <div className="micro-row"><span>C · A</span><span>03 · 10 · 26</span></div>
              <p className="kicker">UNA FECHA · DOS HISTORIAS</p>
              <div className="light-motif"><span /></div>
              <h1 className="display opening-title">DOS HISTORIAS<br /><em>UNA NOCHE</em></h1>
              <p>Has sido invitado a compartir una celebración creada para Cándida y Alberto.</p>
              <span className="scroll-cue">DESLIZA PARA DESCUBRIR <b>↓</b></span>
            </div>
          )}
        </div>
      </section>

      {open && <>
        <section className="story-section">
          <div className="section-label">01 · TU PERSONA A CELEBRAR</div>
          <div className="story-layout">
            <div><p className="kicker">PARA TI</p><h2 className="display story-title">Esta noche<br /><em>es especial.</em></h2></div>
            <div className="story-copy"><span className="gold-word">{p.name}</span><p>Esta invitación ha sido preparada especialmente para ti. El 3 de octubre nos reunimos para celebrar dos vidas, dos edades y todos los recuerdos que las acompañan.</p><p>Guarda la fecha. Queremos compartir esta noche contigo.</p></div>
          </div>
        </section>

        <section className="people-section">
          <div className="section-label">02 · DOS HISTORIAS</div>
          <div className="people-intro"><p className="kicker">LAS PERSONAS QUE CELEBRAMOS</p><h2 className="display story-title">UNA VIDA.<br /><em>DOS HISTORIAS.</em></h2></div>
          <div className="portrait-grid">
            <article className="portrait-card">
              <div className="portrait-glow" /><div className="portrait-letter">C</div>
              <div className="portrait-caption"><span>01</span><small>CELEBRAMOS</small><strong className="display">CÁNDIDA</strong><em>66 AÑOS</em></div>
            </article>
            <article className="portrait-card portrait-two">
              <div className="portrait-glow" /><div className="portrait-letter">A</div>
              <div className="portrait-caption"><span>02</span><small>CELEBRAMOS</small><strong className="display">ALBERTO</strong><em>38 AÑOS</em></div>
            </article>
          </div>
        </section>

        <section className="event-section">
          <div className="section-label">03 · LA NOCHE</div>
          <div className="event-card-premium">
            <p className="kicker">GUARDA LA FECHA</p>
            <div className="event-number display">03<span>·</span>10<span>·</span>26</div>
            <div className="event-details">
              <div><small>SÁBADO</small><strong>8:00 PM</strong></div>
              <div><small>UBICACIÓN</small><strong>8261 SW 8th St</strong><span>North Lauderdale, FL 33068</span></div>
            </div>
            <div className="event-actions"><a className="gold-button" href={eventConfig.maps} target="_blank" rel="noreferrer">VER UBICACIÓN <b>↗</b></a><a className="gold-text" href="/api/calendar">AGREGAR AL CALENDARIO ↓</a></div>
          </div>
        </section>

        <section className="rsvp-section">
          <div className="section-label">04 · TU RESPUESTA</div>
          <div className="rsvp-card">
            <div className="seal small-seal"><span>C</span><i>·</i><span>A</span></div>
            <p className="kicker">RSVP</p>
            <h2 className="display story-title">¿NOS<br /><em>ACOMPAÑAS?</em></h2>
            <p className="rsvp-intro">Confirma tu asistencia para que podamos preparar esta noche para ti.</p>
            <form onSubmit={submit}>
              <div className="field"><label>Tu nombre</label><input required value={name} onChange={x => setName(x.target.value)} placeholder="Escribe tu nombre" /></div>
              <div className="field"><label>¿Asistirás?</label><div className="radio-row"><button type="button" className={"radio " + (att === true ? "active" : "")} onClick={() => setAtt(true)}>SÍ, ESTARÉ</button><button type="button" className={"radio " + (att === false ? "active" : "")} onClick={() => setAtt(false)}>NO PODRÉ</button></div></div>
              {att === true && <div className="field"><label>Cantidad de personas</label><select value={party} onChange={x => setParty(Number(x.target.value))}>{Array.from({ length: invitation.max_guests }, (_, n) => <option key={n + 1} value={n + 1}>{n + 1} {n === 0 ? "persona" : "personas"}</option>)}</select></div>}
              <div className="field"><label>Mensaje opcional</label><textarea rows={4} maxLength={500} value={msg} onChange={x => setMsg(x.target.value)} placeholder="Déjanos unas palabras…" /></div>
              <button className="gold-button submit-button" disabled={saving || att === null}>{saving ? "GUARDANDO…" : "CONFIRMAR ASISTENCIA"} <b>→</b></button>
              {saved && <div className="notice">✓ {att ? "ASISTENCIA CONFIRMADA" : "HEMOS RECIBIDO TU RESPUESTA"}<br /><span>Gracias. Nos vemos esa noche.</span></div>}
            </form>
          </div>
        </section>

        <section className="personal-final">
          <div className="silk silk-one" /><div className="bokeh bokeh-two" />
          <p className="kicker">UNA FECHA · DOS HISTORIAS</p>
          <div className="final-monogram display">C <span>·</span> A</div>
          <h2 className="display final-title">Nos vemos<br /><em>esa noche.</em></h2>
          <div className="light-motif"><span /></div>
          <small>03 · 10 · 2026</small>
        </section>
      </>}
    </main>
  );
}
