"use client";

import dynamic from "next/dynamic";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { eventConfig, destinationLinks, calendarLinks } from "@/lib/eventConfig";
import { roleForKey, stableRole } from "@/lib/safariRoles";
import type { Attendance, Expedition, JourneyStep, Locale } from "@/lib/types";
import { JourneyController } from "./JourneyController";
import { LivingMap } from "./LivingMap";
import { SafariPass } from "./SafariPass";
import { AnimalGlyph } from "./AnimalGlyph";

const SafariWorld = dynamic(() => import("./SafariWorld"), { ssr: false });

const text = {
  en: {
    enter: "ENTER THE SAFARI", enterAlt: "ENTRAR AL SAFARI", date: "SEPTEMBER 20 · 2026", language: "Cambiar a español",
    soundOn: "SOUND ON", soundOff: "SOUND OFF", chosen: "THE JUNGLE HAS CHOSEN YOU", companion: "Your companion will remember this expedition.", continue: "FOLLOW THE TRAIL",
    map: "LIVING SAFARI MAP", openMap: "OPEN THE LIVING MAP", trail: "YOUR TRAIL HAS AWAKENED", trailBody: "A path shaped by your companion. Follow its light and discover what the jungle has been guarding.",
    coordinates: "EXPEDITION COORDINATES", destination: "MARGATE, FLORIDA", navigate: "CHOOSE YOUR COMPASS", google: "GOOGLE MAPS", apple: "APPLE MAPS", waze: "WAZE",
    chic: "SAFARI CHIC", chicBody: "Linen, quiet earth tones and warm natural textures. Dress as though the expedition itself invited you.", gifts: "Gifts are welcome, never expected.",
    observatory: "CALENDAR OBSERVATORY", observatoryBody: "The twentieth day of September is aligned. Mark the expedition in your sky.", saved: "DATE SAVED", ics: "APPLE / ICS", outlook: "OUTLOOK", googleCalendar: "GOOGLE CALENDAR",
    countdown: "COUNTDOWN TEMPLE", opens: "THE ADVENTURE BEGINS IN", days: "DAYS", hours: "HOURS", minutes: "MINUTES", seconds: "SECONDS", today: "THE ADVENTURE IS TODAY", begun: "THE ADVENTURE HAS BEGUN",
    quest: "GOLDEN LEAF QUEST", questBody: "Three living leaves are hidden along the trail. Touch their glow. The invitation remains yours with or without the quest.", found: "GOLDEN LEAVES FOUND", unlocked: "GOLDEN EXPLORER UNLOCKED",
    rsvp: "RSVP OUTPOST", rsvpBody: "Transmit your answer through the expedition radio and your private pass will be forged.", name: "GUEST NAME", placeholder: "Your name", yes: "I'LL BE THERE", no: "I CAN'T MAKE IT", submit: "TRANSMIT RSVP", sending: "TRANSMITTING…", success: "TRANSMISSION RECEIVED", failure: "The outpost could not store the signal. WhatsApp remains available.", whatsapp: "RADIO WHATSAPP",
    pass: "EXPLORER PASS FORGE", passBody: "Your route, companion and expedition mark become one collectible credential.", openPass: "REVEAL MY SAFARI PASS",
    finale: "GRAND CELEBRATION CLEARING", finaleLine: "SEE YOU IN THE WILD", finalFallback: "THE JUNGLE WILL BE WAITING.", recover: "Recover another expedition", recoveryPlaceholder: "WILD-XXXXXXXX", recoveryAction: "RECOVER", recoveryError: "Explorer code not found.",
  },
  es: {
    enter: "ENTRAR AL SAFARI", enterAlt: "ENTER THE SAFARI", date: "20 DE SEPTIEMBRE · 2026", language: "Switch to English",
    soundOn: "SONIDO ACTIVO", soundOff: "SONIDO APAGADO", chosen: "LA SELVA TE HA ELEGIDO", companion: "Tu compañero recordará esta expedición.", continue: "SEGUIR EL SENDERO",
    map: "MAPA VIVO DEL SAFARI", openMap: "ABRIR EL MAPA VIVO", trail: "TU SENDERO HA DESPERTADO", trailBody: "Un camino creado por tu compañero. Sigue su luz y descubre lo que la selva ha protegido.",
    coordinates: "COORDENADAS DE EXPEDICIÓN", destination: "MARGATE, FLORIDA", navigate: "ELIGE TU BRÚJULA", google: "GOOGLE MAPS", apple: "APPLE MAPS", waze: "WAZE",
    chic: "SAFARI CHIC", chicBody: "Lino, tonos tierra serenos y texturas naturales cálidas. Vístete como si la expedición misma te hubiera invitado.", gifts: "Los regalos son bienvenidos, nunca esperados.",
    observatory: "OBSERVATORIO DEL CALENDARIO", observatoryBody: "El día veinte de septiembre está alineado. Marca la expedición en tu cielo.", saved: "FECHA GUARDADA", ics: "APPLE / ICS", outlook: "OUTLOOK", googleCalendar: "GOOGLE CALENDAR",
    countdown: "TEMPLO DE LA CUENTA REGRESIVA", opens: "LA AVENTURA COMIENZA EN", days: "DÍAS", hours: "HORAS", minutes: "MINUTOS", seconds: "SEGUNDOS", today: "LA AVENTURA ES HOY", begun: "LA AVENTURA YA COMENZÓ",
    quest: "MISIÓN DE LAS HOJAS DORADAS", questBody: "Tres hojas vivas están ocultas en el sendero. Toca su brillo. La invitación sigue siendo tuya con o sin la misión.", found: "HOJAS DORADAS ENCONTRADAS", unlocked: "EXPLORADOR DORADO DESBLOQUEADO",
    rsvp: "PUESTO DE RSVP", rsvpBody: "Transmite tu respuesta por la radio de expedición y tu pase privado será forjado.", name: "NOMBRE DEL INVITADO", placeholder: "Tu nombre", yes: "ASISTIRÉ", no: "NO PODRÉ ASISTIR", submit: "TRANSMITIR RSVP", sending: "TRANSMITIENDO…", success: "TRANSMISIÓN RECIBIDA", failure: "El puesto no pudo guardar la señal. WhatsApp sigue disponible.", whatsapp: "RADIO WHATSAPP",
    pass: "FORJA DEL EXPLORER PASS", passBody: "Tu ruta, compañero y marca de expedición se convierten en una credencial coleccionable.", openPass: "REVELAR MI SAFARI PASS",
    finale: "GRAN CLARO DE CELEBRACIÓN", finaleLine: "NOS VEMOS EN LA SELVA", finalFallback: "LA SELVA ESTARÁ ESPERANDO.", recover: "Recuperar otra expedición", recoveryPlaceholder: "WILD-XXXXXXXX", recoveryAction: "RECUPERAR", recoveryError: "Código de explorador no encontrado.",
  },
} as const;

const localKey = "wild-one-expedition-v5";

function initialExpedition(): Expedition {
  return { id: "local-initial", token: "initial", code: "WILD-LOADING", animalKey: "lion", locale: "en", guestName: "", attendance: null, leaves: [], calendarSaved: false, rank: "EXPLORER", journeyVersion: eventConfig.journeyVersion };
}

function webglAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch { return false; }
}

export default function LivingSafariExperience() {
  const [locale, setLocale] = useState<Locale>("en");
  const [expedition, setExpedition] = useState<Expedition>(initialExpedition);
  const [step, setStep] = useState<JourneyStep>("ENTER");
  const [entered, setEntered] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [attendance, setAttendance] = useState<Attendance>("yes");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [rsvpState, setRsvpState] = useState<"idle" | "success" | "error">("idle");
  const [now, setNow] = useState(() => Date.now());
  const [recoverOpen, setRecoverOpen] = useState(false);
  const [recoverCode, setRecoverCode] = useState("");
  const [recoverError, setRecoverError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const t = text[locale];
  const role = roleForKey(expedition.animalKey);

  const persistLocal = useCallback((next: Expedition) => {
    setExpedition(next);
    try { localStorage.setItem(localKey, JSON.stringify(next)); } catch { /* private browsing */ }
  }, []);

  useEffect(() => {
    const detected: Locale = navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
    const savedLocale = localStorage.getItem("wild-one-locale") as Locale | null;
    const selected = savedLocale === "en" || savedLocale === "es" ? savedLocale : detected;
    setLocale(selected);
    document.documentElement.lang = selected;
    setReducedMotion(matchMedia("(prefers-reduced-motion: reduce)").matches);
    setWebgl(webglAvailable());
    const cached = localStorage.getItem(localKey);
    if (cached) {
      try { const parsed = JSON.parse(cached) as Expedition; setExpedition(parsed); setName(parsed.guestName ?? ""); setAttendance(parsed.attendance ?? "yes"); } catch { /* ignore malformed local data */ }
    }
    fetch(`/api/expedition?locale=${selected}`, { credentials: "same-origin" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((server: Expedition) => {
        const local = cached ? JSON.parse(cached) as Expedition : null;
        const merged = { ...server, guestName: server.guestName || local?.guestName || "", attendance: server.attendance ?? local?.attendance ?? null, leaves: server.leaves?.length ? server.leaves : local?.leaves ?? [], calendarSaved: server.calendarSaved || local?.calendarSaved || false, rank: (server.leaves?.length === 3 || local?.leaves?.length === 3 ? "GOLDEN EXPLORER" : "EXPLORER") as Expedition["rank"] };
        persistLocal(merged); setName(merged.guestName); setAttendance(merged.attendance ?? "yes");
      }).catch(() => {
        if (!cached) {
          const token = crypto.randomUUID(); const fallbackRole = stableRole(token);
          persistLocal({ ...initialExpedition(), id: `local-${token.slice(0, 12)}`, token, code: `WILD-${token.replaceAll("-", "").slice(0, 8).toUpperCase()}`, animalKey: fallbackRole.key, locale: selected });
        }
      });
  }, [persistLocal]);

  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(id); }, []);
  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const countdown = useMemo(() => {
    const event = new Date(eventConfig.startsAt).getTime();
    const total = event - now;
    return { total, days: Math.max(0, Math.floor(total / 86400000)), hours: Math.max(0, Math.floor(total / 3600000) % 24), minutes: Math.max(0, Math.floor(total / 60000) % 60), seconds: Math.max(0, Math.floor(total / 1000) % 60) };
  }, [now]);

  const whatsappUrl = useMemo(() => {
    const message = locale === "es" ? `Hola, confirmo para Alexis Alessandro — Wild One. Nombre: ${name || "____"}. Respuesta: ${attendance === "yes" ? "Asistiré" : "No podré asistir"}.` : `Hello, confirming for Alexis Alessandro — Wild One. Name: ${name || "____"}. RSVP: ${attendance === "yes" ? "I'll be there" : "I can't make it"}.`;
    return `https://wa.me/${eventConfig.whatsapp}?text=${encodeURIComponent(message)}`;
  }, [attendance, locale, name]);

  function switchLocale() {
    const next = locale === "en" ? "es" : "en";
    setLocale(next); document.documentElement.lang = next; localStorage.setItem("wild-one-locale", next);
    persistLocal({ ...expedition, locale: next });
    fetch("/api/expedition", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale: next }) }).catch(() => undefined);
  }

  function toggleSound() {
    if (!audioRef.current) { audioRef.current = new Audio("/audio/living-safari-soundscape.mp3"); audioRef.current.loop = true; audioRef.current.volume = 0; }
    if (!soundOn) {
      void audioRef.current.play().then(() => {
        let volume = 0; const fade = window.setInterval(() => { volume = Math.min(0.32, volume + 0.025); if (audioRef.current) audioRef.current.volume = volume; if (volume >= 0.32) clearInterval(fade); }, 80);
      }).catch(() => undefined);
    } else audioRef.current.pause();
    setSoundOn(!soundOn);
  }

  function enterWorld() {
    setEntered(true); setStep("ANIMAL_REVEAL"); toggleSound();
    window.setTimeout(() => document.querySelector("[data-journey-step='ANIMAL_REVEAL']")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }), 500);
    window.dispatchEvent(new CustomEvent("wild-analytics", { detail: "safari_entered" }));
  }

  function findLeaf(id: number) {
    if (expedition.leaves.includes(id)) return;
    const leaves = [...expedition.leaves, id].sort();
    const next = { ...expedition, leaves, rank: (leaves.length === 3 ? "GOLDEN EXPLORER" : "EXPLORER") as Expedition["rank"] };
    persistLocal(next);
    fetch("/api/expedition", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leaves }) }).catch(() => undefined);
    if (soundOn) { const audio = new Audio("/audio/leaf-stinger.mp3"); audio.volume = 0.55; void audio.play().catch(() => undefined); }
  }

  async function saveCalendar() {
    const next = { ...expedition, calendarSaved: true };
    persistLocal(next);
    await fetch("/api/expedition", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ calendarSaved: true }) }).catch(() => undefined);
    if (soundOn) { const audio = new Audio("/audio/calendar-stinger.mp3"); audio.volume = 0.5; void audio.play().catch(() => undefined); }
  }

  async function submitRsvp(event: FormEvent) {
    event.preventDefault(); if (name.trim().length < 2) return;
    setSubmitting(true); setRsvpState("idle");
    const next = { ...expedition, guestName: name.trim(), attendance };
    persistLocal(next);
    try {
      const response = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ guestName: name, attendance, locale, animalKey: expedition.animalKey, role: role.role[locale], route: role.route[locale], leaves: expedition.leaves, expeditionId: expedition.id, journeyVersion: expedition.journeyVersion }) });
      if (!response.ok) throw new Error("unavailable");
      setRsvpState("success"); setPassOpen(true);
      if (soundOn) { const audio = new Audio("/audio/pass-stinger.mp3"); audio.volume = 0.55; void audio.play().catch(() => undefined); }
    } catch { setRsvpState("error"); }
    finally { setSubmitting(false); }
  }

  async function recover() {
    setRecoverError(false);
    const response = await fetch("/api/expedition", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ explorerCode: recoverCode }) });
    if (!response.ok) { setRecoverError(true); return; }
    const restored = await response.json() as Expedition;
    persistLocal(restored); setName(restored.guestName); setAttendance(restored.attendance ?? "yes"); setRecoverOpen(false);
  }

  const onStep = useCallback((next: JourneyStep) => { if (entered) setStep(next); }, [entered]);

  return (
    <main className={`living-safari ${entered ? "is-entered" : ""} ${expedition.rank === "GOLDEN EXPLORER" ? "is-golden" : ""}`}>
      <a className="skip-link" href="#event-details">Skip to event details</a>
      <div className="instant-world" />
      {webgl && <SafariWorld expedition={expedition} step={step} entered={entered} reducedMotion={reducedMotion} onLeaf={findLeaf} onWebglFailure={() => setWebgl(false)} />}
      <JourneyController onStep={onStep} />

      <header className="world-controls">
        <button className="icon-control" onClick={switchLocale} aria-label={t.language}>{locale === "en" ? "ES" : "EN"}</button>
        <button className="icon-control icon-control--sound" onClick={toggleSound} aria-label={soundOn ? t.soundOff : t.soundOn} aria-pressed={soundOn}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10H4Zm12-1c1.5 1.7 1.5 4.3 0 6m2.5-8.5c3 3 3 8 0 11" /></svg>
        </button>
        {entered && <button className="map-control" onClick={() => setMapOpen(true)}><span>{expedition.leaves.length}/3</span>{t.map}</button>}
      </header>

      <section className={`gate-copy ${entered ? "gate-copy--departed" : ""}`} aria-label="Invitation entrance">
        <p className="eyebrow">ALEXIS ALESSANDRO</p><h1>WILD ONE</h1><p className="gate-date">{t.date}</p>
        <button className="enter-safari" onClick={enterWorld}><span>{t.enter}</span><small>{t.enterAlt}</small></button>
      </section>

      <div className="journey-scroll">
        <section className="journey-station station-reveal" data-journey-step="ANIMAL_REVEAL">
          <div className="world-inscription"><p className="eyebrow">{t.chosen}</p><div className="identity-seal" style={{ color: role.accent }}><AnimalGlyph animal={expedition.animalKey} title={role.animal[locale]} /></div><h2>{role.animal[locale]}</h2><strong>{role.role[locale]}</strong><p>{role.route[locale]}</p><small>{t.companion}</small></div>
        </section>
        <section className="journey-station station-map" data-journey-step="MAP">
          <div className="map-plinth"><p className="eyebrow">{t.map}</p><button className="world-action" onClick={() => setMapOpen(true)}>{t.openMap}</button></div>
        </section>
        <section className="journey-station station-trail" data-journey-step="TRAIL">
          <div className="trail-marker"><span>01</span><p className="eyebrow">{role.route[locale]}</p><h2>{t.trail}</h2><p>{t.trailBody}</p><div className="leaf-counter"><i /><i /><i /> {expedition.leaves.length}/3</div></div>
        </section>
        <section className="journey-station station-celebration" data-journey-step="CELEBRATION"><div className="quiet-mark"><span>ALEXIS</span><strong>1</strong><span>WILD ONE</span></div></section>
        <section className="journey-station station-coordinates" data-journey-step="COORDINATES" id="event-details">
          <div className="coordinates-beacon"><p className="eyebrow">{t.coordinates}</p><h2>{t.destination}</h2><address>{eventConfig.address.street}<br />{eventConfig.address.city}, {eventConfig.address.region} {eventConfig.address.postalCode}<br />{eventConfig.address.country}</address><p>{t.navigate}</p><nav><a href={destinationLinks.google} target="_blank" rel="noreferrer">{t.google}</a><a href={destinationLinks.apple} target="_blank" rel="noreferrer">{t.apple}</a><a href={destinationLinks.waze} target="_blank" rel="noreferrer">{t.waze}</a></nav></div>
        </section>
        <section className="journey-station station-chic" data-journey-step="SAFARI_CHIC">
          <div className="chic-camp"><p className="eyebrow">{t.chic}</p><h2>SAFARI CHIC</h2><p>{t.chicBody}</p><div className="fabric-swatches" aria-label="Sage, sand, ivory, cream, khaki, caramel and earth tones">{["#788b61","#d7c39e","#f1eadb","#e8ddc8","#a99670","#b57b4b","#6d513c"].map((color) => <i key={color} style={{ background: color }} />)}</div><small>{t.gifts}</small></div>
        </section>
        <section className="journey-station station-calendar" data-journey-step="CALENDAR">
          <div className={`observatory-dial ${expedition.calendarSaved ? "is-saved" : ""}`}><div className="calendar-orbit"><span>20</span><small>SEP · 2026</small></div><p className="eyebrow">{t.observatory}</p><h2>{expedition.calendarSaved ? t.saved : eventConfig.date[locale]}</h2><p>{t.observatoryBody}</p><nav><a href="/api/calendar" onClick={saveCalendar}>{t.ics}</a><a href={calendarLinks.google} target="_blank" rel="noreferrer" onClick={saveCalendar}>{t.googleCalendar}</a><a href={calendarLinks.outlook} target="_blank" rel="noreferrer" onClick={saveCalendar}>{t.outlook}</a></nav></div>
        </section>
        <section className="journey-station station-countdown" data-journey-step="COUNTDOWN">
          <div className="time-temple"><p className="eyebrow">{t.countdown}</p><h2>{countdown.total > 0 ? t.opens : countdown.total > -86400000 ? t.today : t.begun}</h2><div className="time-rings">{[[countdown.days,t.days],[countdown.hours,t.hours],[countdown.minutes,t.minutes],[countdown.seconds,t.seconds]].map(([value,label]) => <div key={String(label)}><strong>{String(value).padStart(2,"0")}</strong><span>{label}</span></div>)}</div></div>
        </section>
        <section className="journey-station station-quest" data-journey-step="QUEST">
          <div className="quest-stone"><p className="eyebrow">{t.quest}</p><h2>{expedition.leaves.length === 3 ? t.unlocked : `${expedition.leaves.length}/3 ${t.found}`}</h2><p>{t.questBody}</p><div className="quest-leaves">{[1,2,3].map((id) => <i key={id} className={expedition.leaves.includes(id) ? "found" : ""} />)}</div></div>
        </section>
        <section className="journey-station station-rsvp" data-journey-step="RSVP">
          <form className="radio-outpost" onSubmit={submitRsvp}><div className="radio-antenna" /><p className="eyebrow">{t.rsvp}</p><h2>5:00 PM</h2><p>{t.rsvpBody}</p><label htmlFor="guest-name">{t.name}</label><input id="guest-name" value={name} onChange={(event) => setName(event.target.value)} placeholder={t.placeholder} minLength={2} maxLength={80} required autoComplete="name" /><div className="attendance-choice"><button type="button" className={attendance === "yes" ? "active" : ""} onClick={() => setAttendance("yes")}>{t.yes}</button><button type="button" className={attendance === "no" ? "active" : ""} onClick={() => setAttendance("no")}>{t.no}</button></div><button className="world-action world-action--gold" disabled={submitting}>{submitting ? t.sending : t.submit}</button>{rsvpState === "success" && <p className="form-status success">{t.success}</p>}{rsvpState === "error" && <p className="form-status error">{t.failure}</p>}<a className="whatsapp-radio" href={whatsappUrl} target="_blank" rel="noreferrer">{t.whatsapp} · +1 754 610 6574</a></form>
        </section>
        <section className="journey-station station-pass" data-journey-step="PASS"><div className="pass-pedestal"><p className="eyebrow">{t.pass}</p><h2>{expedition.code}</h2><p>{t.passBody}</p><button className="world-action" onClick={() => setPassOpen(true)}>{t.openPass}</button></div></section>
        <section className="journey-station station-finale" data-journey-step="FINALE"><div className="finale-title"><p className="eyebrow">{t.finale}</p><h2>ALEXIS ALESSANDRO</h2><strong>WILD ONE</strong><p>{expedition.guestName ? `${t.finaleLine}, ${expedition.guestName.toUpperCase()}.` : t.finalFallback}</p><small>{t.date}</small></div></section>
      </div>

      {!webgl && <div className="fallback-note" role="status">{locale === "es" ? "Modo ilustrado activo" : "Illustrated journey active"}</div>}
      {mapOpen && <LivingMap expedition={expedition} locale={locale} current={step} onClose={() => setMapOpen(false)} />}
      {passOpen && <div className="pass-overlay" role="dialog" aria-modal="true"><SafariPass expedition={expedition} locale={locale} onClose={() => setPassOpen(false)} /></div>}
      <footer className="expedition-footer"><button onClick={() => setRecoverOpen(!recoverOpen)}>{t.recover}</button>{recoverOpen && <div className="recovery-form"><input value={recoverCode} onChange={(event) => setRecoverCode(event.target.value.toUpperCase())} placeholder={t.recoveryPlaceholder} aria-label={t.recover} /><button onClick={recover}>{t.recoveryAction}</button>{recoverError && <small>{t.recoveryError}</small>}</div>}</footer>
    </main>
  );
}

