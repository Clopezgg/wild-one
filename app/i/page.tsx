"use client";

import { useEffect, useState } from "react";
import { eventConfig } from "@/lib/eventConfig";
import type { Invitation } from "@/lib/types";

function tokenFromPath() {
  const p = window.location.pathname.split("/").filter(Boolean);
  return p[0] === "i" ? (p[1] ?? "").toLowerCase() : "";
}

export default function Page() {
  const [token,setToken]=useState("");
  const [invitation,setInvitation]=useState<Invitation|null>(null);
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const t=tokenFromPath();
    setToken(t);
    (async()=>{
      if(!/^[a-z0-9]{16,40}$/.test(t)){setError("Esta invitación no es válida.");setLoading(false);return;}
      try{
        const r=await fetch("/api/invitation/"+encodeURIComponent(t),{cache:"no-store"});
        const d=await r.json();
        if(!r.ok) throw new Error(d.error);
        setInvitation(d.invitation);
      }catch(x){setError(x instanceof Error?x.message:"No fue posible abrir la invitación.");}
      finally{setLoading(false);}
    })();
  },[]);

  if(loading) return <main className="invitation-canvas loading"><div className="mini-card"><div className="crest"><span>C</span><i>·</i><span>A</span></div><p>PREPARANDO TU INVITACIÓN</p></div></main>;
  if(!invitation) return <main className="invitation-canvas error"><div><p className="card-eyebrow">C · A — UNA NOCHE</p><h1 className="display card-title">INVITACIÓN<br/>NO DISPONIBLE</h1><p>{error}</p></div></main>;
  return <PersonalInvitation invitation={invitation} token={token}/>;
}

function PersonalInvitation({invitation,token}:{invitation:Invitation;token:string}){
  const [open,setOpen]=useState(false);
  const [att,setAtt]=useState<boolean|null>(invitation.attendance);
  const [name,setName]=useState(invitation.guest_name??"");
  const [party,setParty]=useState(invitation.party_size??1);
  const [message,setMessage]=useState(invitation.message??"");
  const [saved,setSaved]=useState(false);
  const [saving,setSaving]=useState(false);
  const person=invitation.honoree==="candida"?eventConfig.candida:eventConfig.alberto;

  async function submit(ev:React.FormEvent){
    ev.preventDefault();setSaving(true);
    try{
      const r=await fetch("/api/rsvp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,guest_name:name,attendance:att,party_size:party,message})});
      const d=await r.json();if(!r.ok)throw new Error(d.error);
      setSaved(true);setAtt(d.invitation.attendance);
    }catch(x){alert(x instanceof Error?x.message:"No fue posible guardar");}
    finally{setSaving(false);}
  }

  return <main className="personal-site">
    <section className="personal-hero">
      <article className={"luxury-card personal-card "+(open?"is-open":"")}>
        <div className="card-border" aria-hidden="true"/>
        {!open?<>
          <header className="card-header"><span>C · A</span><span>INVITACIÓN PERSONAL</span></header>
          <div className="crest"><span>C</span><i>·</i><span>A</span></div>
          <p className="card-eyebrow">UNA INVITACIÓN PARA CELEBRAR A</p>
          <h1 className="display card-title personal-title">{person.name}</h1>
          <div className="personal-age"><strong>{person.age}</strong><span>AÑOS</span></div>
          <div className="gold-line"><b/></div>
          <p className="card-intro">Una noche especial.<br/>Una invitación preparada para ti.</p>
          <button className="card-button open-card" onClick={()=>setOpen(true)}>ABRIR INVITACIÓN <b>↓</b></button>
          <p className="cover-date">SÁBADO · 03 OCTUBRE 2026 · 8:00 PM</p>
          <footer className="card-footer"><span>C · A</span><b>66 · 38</b><span>UNA NOCHE</span></footer>
        </>:<>
          <header className="card-header"><span>C · A</span><span>03 · 10 · 26</span></header>
          <p className="card-eyebrow">UNA FECHA · DOS HISTORIAS</p>
          <div className="gold-line"><b/></div>
          <h1 className="display opening-title">DOS HISTORIAS<br/><em>UNA NOCHE</em></h1>
          <p className="opening-copy">Has sido invitado a compartir la celebración de Cándida y Alberto.</p>
          <div className="opening-date"><strong>03</strong><span>OCTUBRE 2026<br/><b>8:00 PM</b></span></div>
          <span className="scroll-hint">DESLIZA PARA DESCUBRIR ↓</span>
        </>}
      </article>
    </section>

    {open&&<div className="personal-content">
      <section className="content-section welcome">
        <p className="card-eyebrow">PARA TI</p>
        <h2 className="display content-title">Esta noche<br/><em>es especial.</em></h2>
        <p>Esta invitación ha sido preparada especialmente para ti. El 3 de octubre nos reunimos para celebrar dos vidas, dos edades y todos los recuerdos que las acompañan.</p>
      </section>

      <section className="content-section">
        <p className="card-eyebrow">LOS PROTAGONISTAS</p>
        <div className="duo-cards">
          <div className="duo-card"><span>C</span><small>CELEBRAMOS</small><strong className="display">CÁNDIDA</strong><em>66 AÑOS</em></div>
          <div className="duo-card duo-alberto"><span>A</span><small>CELEBRAMOS</small><strong className="display">ALBERTO</strong><em>38 AÑOS</em></div>
        </div>
      </section>

      <section className="content-section event-block">
        <p className="card-eyebrow">GUARDA LA FECHA</p>
        <div className="event-date display">03<span>·</span>10<span>·</span>26</div>
        <div className="event-info"><div><small>SÁBADO</small><strong>8:00 PM</strong></div><div><small>LUGAR</small><strong>8261 SW 8th St</strong><span>North Lauderdale, FL 33068</span></div></div>
        <div className="action-row"><a className="card-button" href={eventConfig.maps} target="_blank" rel="noreferrer">VER UBICACIÓN ↗</a><a className="gold-link" href="/api/calendar">AGREGAR AL CALENDARIO ↓</a></div>
      </section>

      <section className="content-section rsvp-block">
        <div className="crest small"><span>C</span><i>·</i><span>A</span></div>
        <p className="card-eyebrow">RSVP</p>
        <h2 className="display content-title">¿NOS<br/><em>ACOMPAÑAS?</em></h2>
        <p>Confirma tu asistencia para preparar la noche especialmente para ti.</p>
        <form onSubmit={submit}>
          <label>Tu nombre<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Escribe tu nombre"/></label>
          <label>¿Asistirás?<span className="radio-row"><button type="button" className={att===true?"selected":""} onClick={()=>setAtt(true)}>SÍ, ESTARÉ</button><button type="button" className={att===false?"selected":""} onClick={()=>setAtt(false)}>NO PODRÉ</button></span></label>
          {att===true&&<label>Cantidad de personas<select value={party} onChange={e=>setParty(Number(e.target.value))}>{Array.from({length:invitation.max_guests},(_,n)=><option key={n+1} value={n+1}>{n+1} {n===0?"persona":"personas"}</option>)}</select></label>}
          <label>Mensaje opcional<textarea rows={4} maxLength={500} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Déjanos unas palabras…"/></label>
          <button className="card-button submit" disabled={saving||att===null}>{saving?"GUARDANDO…":"CONFIRMAR ASISTENCIA"} <b>→</b></button>
          {saved&&<div className="success">✓ {att?"ASISTENCIA CONFIRMADA":"HEMOS RECIBIDO TU RESPUESTA"}<br/><span>Gracias. Nos vemos esa noche.</span></div>}
        </form>
      </section>

      <section className="closing-card">
        <p className="card-eyebrow">UNA FECHA · DOS HISTORIAS</p>
        <div className="display closing-mark">C <span>·</span> A</div>
        <h2 className="display content-title">Nos vemos<br/><em>esa noche.</em></h2>
        <div className="gold-line"><b/></div>
        <small>03 · 10 · 2026</small>
      </section>
    </div>}
  </main>;
}
