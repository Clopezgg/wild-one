"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import SafariScene from "./SafariScene";

type Locale = "en" | "es";
type Attendance = "yes" | "no";
type AudioSession = {
  ctx: AudioContext;
  master: GainNode;
  timers: number[];
  ambient: HTMLAudioElement | null;
};

const EVENT_TIME = new Date("2026-09-20T17:00:00-04:00").getTime();
const SUPABASE_URL = "https://sqchlnhkceztcznkjctg.supabase.co";
const SUPABASE_KEY = "sb_publishable_eyhxdWjBo_b65URp-R4l7w_4q4Ltxkc";
const MAP_URL = "https://www.google.com/maps/search/?api=1&query=581%20Kathy%20Lane%2C%20Margate%2C%20FL%2033068";
const WHATSAPP_NUMBER = "17546106574";

const copy = {
  en: {
    gateTop: "PRIVATE EXPEDITION · ACCESS 01",
    gateTitle: "The jungle is already alive.",
    gateBody: "Touch the seal. The camera will take you inside Alexis Alessandro's first wild legend.",
    enter: "ENTER THE WORLD",
    switch: "ES",
    soundOn: "SOUND ON",
    soundOff: "SOUND OFF",
    heroTop: "ALEXIS ALESSANDRO · CHAPTER ONE",
    heroTitle: "WILD ONE",
    heroBody: "One year. One impossible world. One night the jungle will remember.",
    journey: "SCROLL TO MOVE THROUGH THE WORLD",
    revealTop: "THE FIRST REVEAL",
    revealTitle: "The jungle has chosen its little king.",
    revealBody: "No photographs. No template. No ordinary invitation. Every frame is part of the expedition.",
    routeTop: "COORDINATES · PORTAL II",
    routeTitle: "The route has been unlocked.",
    date: "SEPTEMBER 20, 2026",
    time: "5:00 PM",
    place: "581 KATHY LANE · MARGATE, FLORIDA 33068",
    map: "OPEN LIVE ROUTE",
    dressTop: "THE SAFARI CODE",
    dressTitle: "Become part of the scenery.",
    dressBody: "Safari Chic · forest, sage, sand, ivory, khaki and linen. Quiet luxury, wild soul.",
    countdownTop: "PORTAL III · TIME CHAMBER",
    countdownTitle: "The Forbidden Safari opens in",
    days: "DAYS",
    hours: "HOURS",
    minutes: "MINUTES",
    seconds: "SECONDS",
    today: "THE GATES ARE OPEN",
    rsvpTop: "FINAL PORTAL · ACCESS CEREMONY",
    rsvpTitle: "Claim your Safari Pass.",
    rsvpBody: "Your name becomes part of the expedition ledger and your private pass is forged instantly.",
    name: "EXPLORER NAME",
    placeholder: "Your name",
    yes: "I WILL ATTEND",
    no: "I CANNOT ATTEND",
    submit: "FORGE MY PASS",
    sending: "FORGING ACCESS…",
    whatsapp: "CONFIRM THROUGH WHATSAPP",
    error: "The expedition ledger is unreachable right now. WhatsApp remains available.",
    passTop: "WILD ONE · PRIVATE SAFARI PASS",
    passGuest: "EXPLORER",
    confirmed: "CLEARED FOR EXPEDITION",
    declined: "WITH US FROM AFAR",
    close: "RETURN TO THE WORLD",
    finaleTop: "THE WORLD CLOSES BEHIND YOU",
    finaleTitle: "The first legend begins here.",
    finaleBody: "ALEXIS ALESSANDRO · WILD ONE · 20.09.2026",
  },
  es: {
    gateTop: "EXPEDICIÓN PRIVADA · ACCESO 01",
    gateTitle: "La jungla ya está viva.",
    gateBody: "Toca el sello. La cámara te llevará dentro de la primera leyenda salvaje de Alexis Alessandro.",
    enter: "ENTRAR AL MUNDO",
    switch: "EN",
    soundOn: "SONIDO ACTIVO",
    soundOff: "SONIDO APAGADO",
    heroTop: "ALEXIS ALESSANDRO · CAPÍTULO UNO",
    heroTitle: "WILD ONE",
    heroBody: "Un año. Un mundo imposible. Una noche que la jungla recordará.",
    journey: "DESLIZA PARA MOVERTE DENTRO DEL MUNDO",
    revealTop: "LA PRIMERA REVELACIÓN",
    revealTitle: "La jungla ha elegido a su pequeño rey.",
    revealBody: "Sin fotografías. Sin plantilla. Sin una invitación ordinaria. Cada cuadro forma parte de la expedición.",
    routeTop: "COORDENADAS · PORTAL II",
    routeTitle: "La ruta ha sido desbloqueada.",
    date: "20 DE SEPTIEMBRE, 2026",
    time: "5:00 PM",
    place: "581 KATHY LANE · MARGATE, FLORIDA 33068",
    map: "ABRIR RUTA EN VIVO",
    dressTop: "EL CÓDIGO SAFARI",
    dressTitle: "Conviértete en parte del paisaje.",
    dressBody: "Safari Chic · bosque, salvia, arena, marfil, caqui y lino. Lujo silencioso, alma salvaje.",
    countdownTop: "PORTAL III · CÁMARA DEL TIEMPO",
    countdownTitle: "El Safari Prohibido abre en",
    days: "DÍAS",
    hours: "HORAS",
    minutes: "MINUTOS",
    seconds: "SEGUNDOS",
    today: "LAS PUERTAS ESTÁN ABIERTAS",
    rsvpTop: "PORTAL FINAL · CEREMONIA DE ACCESO",
    rsvpTitle: "Reclama tu Safari Pass.",
    rsvpBody: "Tu nombre entra al registro de la expedición y tu pase privado se crea al instante.",
    name: "NOMBRE DEL EXPLORADOR",
    placeholder: "Tu nombre",
    yes: "ASISTIRÉ",
    no: "NO PODRÉ ASISTIR",
    submit: "CREAR MI PASE",
    sending: "CREANDO ACCESO…",
    whatsapp: "CONFIRMAR POR WHATSAPP",
    error: "El registro de la expedición no responde ahora mismo. WhatsApp sigue disponible.",
    passTop: "WILD ONE · SAFARI PASS PRIVADO",
    passGuest: "EXPLORADOR",
    confirmed: "AUTORIZADO PARA LA EXPEDICIÓN",
    declined: "CON NOSOTROS DESDE LA DISTANCIA",
    close: "VOLVER AL MUNDO",
    finaleTop: "EL MUNDO SE CIERRA DETRÁS DE TI",
    finaleTitle: "La primera leyenda comienza aquí.",
    finaleBody: "ALEXIS ALESSANDRO · WILD ONE · 20.09.2026",
  },
} as const;

function pad(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}

export default function InvitationExperience() {
  const [locale, setLocale] = useState<Locale>("en");
  const [entered, setEntered] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("yes");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<AudioSession | null>(null);
  const t = copy[locale];

  useEffect(() => {
    const saved = window.localStorage.getItem("wild-one-locale") as Locale | null;
    const detected: Locale = navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
    setLocale(saved === "en" || saved === "es" ? saved : detected);
    return () => stopSoundtrack();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = useMemo(() => {
    const total = Math.max(0, EVENT_TIME - now);
    return {
      total,
      days: Math.floor(total / 86400000),
      hours: Math.floor((total / 3600000) % 24),
      minutes: Math.floor((total / 60000) % 60),
      seconds: Math.floor((total / 1000) % 60),
    };
  }, [now]);

  function switchLocale() {
    const next: Locale = locale === "en" ? "es" : "en";
    setLocale(next);
    window.localStorage.setItem("wild-one-locale", next);
    document.documentElement.lang = next;
  }

  function startSoundtrack() {
    if (audioRef.current) return;
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    master.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 1.8);

    const strike = (frequency: number, duration: number, volume: number, type: OscillatorType = "sine", delay = 0) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + delay;
      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain);
      gain.connect(master);
      osc.start(start);
      osc.stop(start + duration + 0.05);
    };

    const chord = () => {
      [73.42, 110, 146.83, 220].forEach((f, i) => strike(f, 6.2, i === 0 ? 0.05 : 0.018, i % 2 ? "triangle" : "sine", i * 0.07));
    };
    const drum = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(92, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(42, ctx.currentTime + 0.34);
      gain.gain.setValueAtTime(0.17, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.38);
      osc.connect(gain);
      gain.connect(master);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    };
    chord();
    drum();
    strike(440, 2.8, 0.025, "triangle", 0.5);

    let ambient: HTMLAudioElement | null = null;
    try {
      ambient = new Audio("https://actions.google.com/sounds/v1/ambiences/jungle_atmosphere_morning.ogg");
      ambient.loop = true;
      ambient.volume = 0.22;
      ambient.play().catch(() => undefined);
    } catch {
      ambient = null;
    }

    const timers = [
      window.setInterval(chord, 6800),
      window.setInterval(drum, 3400),
      window.setInterval(() => strike([293.66, 329.63, 392, 440, 523.25][Math.floor(Math.random() * 5)], 2.4, 0.025, "sine"), 5100),
    ];
    audioRef.current = { ctx, master, timers, ambient };
    setSoundOn(true);
  }

  function stopSoundtrack() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.timers.forEach(window.clearInterval);
    audio.ambient?.pause();
    audio.master.gain.setTargetAtTime(0.0001, audio.ctx.currentTime, 0.12);
    window.setTimeout(() => audio.ctx.close(), 500);
    audioRef.current = null;
    setSoundOn(false);
  }

  function enterWorld() {
    setEntered(true);
    startSoundtrack();
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  }

  async function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (guestName.trim().length < 2) return;
    setSubmitting(true);
    setError(false);
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/wild_one_rsvps`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ guest_name: guestName.trim(), attendance, locale, event_slug: "alexis-wild-one" }),
      });
      if (!response.ok) throw new Error("RSVP failed");
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  const whatsappMessage = locale === "es"
    ? `Hola, confirmo mi asistencia al Wild One de Alexis Alessandro. Mi nombre es ${guestName.trim() || "_____"}.`
    : `Hi, I am confirming my attendance for Alexis Alessandro's Wild One. My name is ${guestName.trim() || "_____"}.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="experience-3d">
      <SafariScene />

      <div className={`entry-screen ${entered ? "entry-screen--gone" : ""}`}>
        <div className="entry-screen__glass">
          <div className="entry-seal"><span>A</span><b>1</b></div>
          <p className="scene-kicker">{t.gateTop}</p>
          <h1>{t.gateTitle}</h1>
          <p>{t.gateBody}</p>
          <button className="enter-world" onClick={enterWorld}>{t.enter}</button>
        </div>
      </div>

      <div className="world-hud">
        <button onClick={switchLocale} className="hud-control hud-control--lang">{t.switch}</button>
        <button onClick={() => soundOn ? stopSoundtrack() : startSoundtrack()} className="hud-control hud-control--sound">
          <span className={soundOn ? "sound-orbit sound-orbit--on" : "sound-orbit"}><i /><i /><i /></span>
          <span>{soundOn ? t.soundOff : t.soundOn}</span>
        </button>
      </div>

      <div className="scroll-story">
        <section className="story-scene story-scene--hero">
          <div className="story-panel story-panel--hero">
            <p className="scene-kicker">{t.heroTop}</p>
            <h2>{t.heroTitle}</h2>
            <p className="scene-copy">{t.heroBody}</p>
            <div className="hero-date">20 · 09 · 2026</div>
            <span className="scroll-instruction">{t.journey}</span>
          </div>
        </section>

        <section className="story-scene story-scene--left">
          <div className="story-panel">
            <p className="scene-kicker">{t.revealTop}</p>
            <h3>{t.revealTitle}</h3>
            <p className="scene-copy">{t.revealBody}</p>
          </div>
        </section>

        <section className="story-scene story-scene--right">
          <div className="story-panel story-panel--route">
            <p className="scene-kicker">{t.routeTop}</p>
            <h3>{t.routeTitle}</h3>
            <div className="coordinates">
              <span>{t.date}</span>
              <span>{t.time}</span>
              <span>{t.place}</span>
            </div>
            <a className="portal-button" href={MAP_URL} target="_blank" rel="noreferrer">{t.map}</a>
          </div>
        </section>

        <section className="story-scene story-scene--left story-scene--dress">
          <div className="story-panel">
            <p className="scene-kicker">{t.dressTop}</p>
            <h3>{t.dressTitle}</h3>
            <p className="scene-copy">{t.dressBody}</p>
            <div className="dress-ribbon" aria-label="Safari Chic palette">
              <i /><i /><i /><i /><i />
            </div>
          </div>
        </section>

        <section className="story-scene story-scene--center">
          <div className="story-panel story-panel--countdown">
            <p className="scene-kicker">{t.countdownTop}</p>
            <h3>{remaining.total === 0 ? t.today : t.countdownTitle}</h3>
            {remaining.total > 0 && (
              <div className="time-code">
                <div><strong>{pad(remaining.days)}</strong><span>{t.days}</span></div>
                <div><strong>{pad(remaining.hours)}</strong><span>{t.hours}</span></div>
                <div><strong>{pad(remaining.minutes)}</strong><span>{t.minutes}</span></div>
                <div><strong>{pad(remaining.seconds)}</strong><span>{t.seconds}</span></div>
              </div>
            )}
          </div>
        </section>

        <section className="story-scene story-scene--right story-scene--rsvp">
          <div className="story-panel story-panel--form">
            <p className="scene-kicker">{t.rsvpTop}</p>
            <h3>{t.rsvpTitle}</h3>
            <p className="scene-copy">{t.rsvpBody}</p>
            <form onSubmit={submitRsvp}>
              <label htmlFor="guest-name">{t.name}</label>
              <input id="guest-name" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder={t.placeholder} minLength={2} maxLength={120} required />
              <div className="attendance-switch">
                <button type="button" className={attendance === "yes" ? "active" : ""} onClick={() => setAttendance("yes")}>{t.yes}</button>
                <button type="button" className={attendance === "no" ? "active" : ""} onClick={() => setAttendance("no")}>{t.no}</button>
              </div>
              <button className="portal-button portal-button--solid" type="submit" disabled={submitting}>{submitting ? t.sending : t.submit}</button>
              <a className="whatsapp-access" href={whatsappUrl} target="_blank" rel="noreferrer">{t.whatsapp}</a>
              {error && <p className="form-error">{t.error}</p>}
            </form>
          </div>
        </section>

        <section className="story-scene story-scene--center story-scene--finale">
          <div className="story-panel story-panel--finale">
            <p className="scene-kicker">{t.finaleTop}</p>
            <h3>{t.finaleTitle}</h3>
            <p className="finale-signature">{t.finaleBody}</p>
          </div>
        </section>
      </div>

      {submitted && (
        <div className="safari-pass-overlay" role="dialog" aria-modal="true">
          <div className="safari-pass">
            <div className="safari-pass__ring"><span>A</span><b>1</b></div>
            <p className="scene-kicker">{t.passTop}</p>
            <span className="pass-label">{t.passGuest}</span>
            <h4>{guestName}</h4>
            <strong>{attendance === "yes" ? t.confirmed : t.declined}</strong>
            <div className="pass-code">A1 · 20.09.26 · MARGATE</div>
            <button className="portal-button" onClick={() => setSubmitted(false)}>{t.close}</button>
          </div>
        </div>
      )}
    </main>
  );
}
