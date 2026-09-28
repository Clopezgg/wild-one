"use client";

import { useEffect, useState } from "react";
import { eventConfig } from "@/lib/eventConfig";
import type { Invitation } from "@/lib/types";

function tokenFromPath() {
  const p = window.location.pathname.split("/").filter(Boolean);
  return p[0] === "i" ? (p[1] ?? "").toLowerCase() : "";
}

function Spark({ className = "" }: { className?: string }) {
  return <span className={"spark " + className} aria-hidden="true">✦</span>;
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

  if (l) return <main className="loading invitation-loading"><div><div className="monogram-mark">C<span>·</span>A</div><div className="eyebrow">PREPARANDO TU NOCHE</div></div></main>;
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
      <section className="invite-cover">
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><Spark className="spark-a" /><Spark className="spark-b" />
        {!open ? (
          <div className="invite-cover-card">
            <div className="eyebrow">UNA FECHA · DOS HISTORIAS</div>
            <div className="monogram-mark">C<span>·</span>A</div>
            <div className="invite-cover-rule" />
            <p className="invite-for">UNA INVITACIÓN PARA CELEBRAR A</p>
            <h1 className="display invite-name">{p.name}</h1>
            <div className="invite-age"><strong>{p.age}</strong><span>AÑOS</span></div>
            <button className="cta cta-large" onClick={() => setOpen(true)}>ABRIR INVITACIÓN <span>↓</span></button>
            <div className="invite-date">03 OCTUBRE 2026 · 8:00 PM</div>
          </div>
        ) : (
          <div className="invite-open">
            <div className="eyebrow">C · A — UNA NOCHE</div>
            <h1 className="display invite-open-title">DOS HISTORIAS<br /><em>UNA NOCHE</em></h1>
            <p>Una celebración compartida para Cándida y Alberto.</p>
            <div className="hero-rule"><span /></div>
            <span className="scroll-note">DESLIZA ↓</span>
          </div>
        )}
      </section>

      {open && <>
        <section className="editorial-section invite-intro">
          <div className="section-number">01</div>
          <div className="editorial-grid">
            <div><div className="eyebrow">PARA TI</div><h2 className="display section-title">Esta noche<br /><em>es especial.</em></h2></div>
            <div className="editorial-copy"><div className="gold-mark">{p.name}</div><p>Has sido invitado a compartir una noche pensada para celebrar una historia, una familia y un nuevo recuerdo.</p><p>Guarda la fecha y acompáñanos.</p></div>
          </div>
        </section>

        <section className="celebration-section">
          <div className="section-number">02</div>
          <div className="people-grid">
            <article className="person-card candida"><div className="person-watermark">C</div><div className="person-top"><span>CÁNDIDA</span><span>66</span></div><div className="person-bottom"><div className="person-name display">CÁNDIDA</div><div className="person-age"><strong>66</strong><span>AÑOS</span></div></div></article>
            <article className="person-card alberto"><div className="person-watermark">A</div><div className="person-top"><span>ALBERTO</span><span>38</span></div><div className="person-bottom"><div className="person-name display">ALBERTO</div><div className="person-age"><strong>38</strong><span>AÑOS</span></div></div></article>
          </div>
        </section>

        <section className="editorial-section details-section">
          <div className="section-number">03</div>
          <div className="detail-frame">
            <div className="eyebrow">LA NOCHE</div>
            <div className="big-date display">03<span>·</span>10<span>·</span>26</div>
            <div className="detail-meta">
              <div><small>SÁBADO</small><strong>8:00 PM</strong></div>
              <div><small>LUGAR</small><strong>8261 SW 8th St</strong><span>North Lauderdale, FL 33068</span></div>
            </div>
            <div className="detail-actions"><a className="cta" href={eventConfig.maps} target="_blank" rel="noreferrer">VER UBICACIÓN ↗</a><a className="text-link" href="/api/calendar">AGREGAR AL CALENDARIO ↓</a></div>
          </div>
        </section>

        <section className="rsvp-section">
          <div className="section-number">04</div>
          <div className="rsvp-card">
            <div className="eyebrow">RSVP</div>
            <h2 className="display section-title">¿NOS<br /><em>ACOMPAÑAS?</em></h2>
            <form onSubmit={submit}>
              <div className="field"><label>Nombre</label><input required value={name} onChange={x => setName(x.target.value)} placeholder="Tu nombre" /></div>
              <div className="field"><label>¿Asistirás?</label><div className="radio-row"><button type="button" className={"radio " + (att === true ? "active" : "")} onClick={() => setAtt(true)}>SÍ, ESTARÉ</button><button type="button" className={"radio " + (att === false ? "active" : "")} onClick={() => setAtt(false)}>NO PODRÉ</button></div></div>
              {att === true && <div className="field"><label>Cantidad de personas</label><select value={party} onChange={x => setParty(Number(x.target.value))}>{Array.from({ length: invitation.max_guests }, (_, n) => <option key={n + 1} value={n + 1}>{n + 1} {n === 0 ? "persona" : "personas"}</option>)}</select></div>}
              <div className="field"><label>Mensaje opcional</label><textarea rows={4} maxLength={500} value={msg} onChange={x => setMsg(x.target.value)} placeholder="Déjanos un mensaje…" /></div>
              <button className="cta cta-large" disabled={saving || att === null}>{saving ? "GUARDANDO…" : "CONFIRMAR RESPUESTA"}</button>
              {saved && <div className="notice">✓ GRACIAS POR {att ? "CONFIRMAR" : "AVISARNOS"}. NOS VEMOS ESA NOCHE.</div>}
            </form>
          </div>
        </section>

        <section className="final-section invite-final">
          <div className="final-glow" /><div className="eyebrow">03 · 10 · 26</div><div className="final-mark display">C · A</div><h2 className="display final-title">Nos vemos<br /><em>esa noche.</em></h2><div className="hero-rule"><span /></div>
        </section>
      </>}
    </main>
  );
}
