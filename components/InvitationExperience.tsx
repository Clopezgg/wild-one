"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Locale = "en" | "es";
type Attendance = "yes" | "no";

type AudioSession = {
  ctx: AudioContext;
  master: GainNode;
  timers: number[];
};

const EVENT_TIME = new Date("2026-09-20T17:00:00-04:00").getTime();
const SUPABASE_URL = "https://sqchlnhkceztcznkjctg.supabase.co";
const SUPABASE_KEY = "sb_publishable_eyhxdWjBo_b65URp-R4l7w_4q4Ltxkc";
const MAP_URL = "https://www.google.com/maps/search/?api=1&query=581%20Kathy%20Lane%2C%20Margate%2C%20FL%2033068";
const WHATSAPP_NUMBER = "17546106574";

const copy = {
  en: {
    gateKicker: "PRIVATE EXPEDITION · ACCESS 01",
    gateTitle: "A rare celebration is about to awaken",
    gateSub: "Beyond the leaves, one extraordinary little explorer is waiting.",
    enter: "ENTER THE WILD",
    switch: "ES",
    soundOn: "SOUND ON",
    soundOff: "SOUND OFF",
    heroKicker: "THE JUNGLE PRESENTS",
    heroName: "Alexis Alessandro",
    heroWild: "WILD ONE",
    heroDate: "SEPTEMBER 20 · 2026 · 5:00 PM",
    scroll: "DESCEND INTO THE STORY",
    proclamationTop: "THE PROCLAMATION",
    proclamationA: "The jungle has chosen its little king.",
    proclamationB: "One year of wonder. One unforgettable celebration.",
    proclamationNote: "No photographs. No ordinary invitation. Only a world created for Alexis Alessandro.",
    routeTop: "COORDINATES REVEALED",
    routeTitle: "The expedition has a destination",
    dateLabel: "DATE",
    timeLabel: "TIME",
    locationLabel: "RENDEZVOUS",
    dateValue: "SEPTEMBER 20, 2026",
    timeValue: "5:00 PM",
    locationValue: "581 KATHY LANE · MARGATE, FLORIDA 33068",
    map: "REVEAL THE ROUTE",
    dressTop: "THE SAFARI CODE",
    dressTitle: "Arrive as part of the scenery",
    dressBody: "Safari Chic · linen, sage, sand, cream, khaki and quiet earth tones.",
    countdownTop: "THE FORBIDDEN SAFARI OPENS IN",
    days: "DAYS",
    hours: "HOURS",
    minutes: "MINUTES",
    seconds: "SECONDS",
    today: "THE GATES ARE OPEN",
    rsvpTop: "THE FINAL RITUAL",
    rsvpTitle: "Claim your Safari Pass",
    rsvpBody: "Your name becomes part of the expedition. A private pass is forged the moment you confirm.",
    name: "EXPLORER NAME",
    placeholder: "Your name",
    yes: "I WILL ATTEND",
    no: "I CANNOT ATTEND",
    submit: "FORGE MY PASS",
    sending: "FORGING ACCESS…",
    whatsapp: "CONFIRM THROUGH WHATSAPP",
    error: "The expedition ledger could not be reached. WhatsApp confirmation is still available.",
    passTop: "WILD ONE · PRIVATE SAFARI PASS",
    passGuest: "EXPLORER",
    passStatus: "STATUS",
    confirmed: "CLEARED FOR EXPEDITION",
    declined: "WITH US FROM AFAR",
    passDate: "20 · 09 · 2026",
    passClose: "RETURN TO THE EXPERIENCE",
    gifts: "OPTIONAL GIFTS",
    giftsBody: "Your presence is the rarest gift. Additional gift details may be revealed here later.",
    finaleTop: "ONE YEAR · ONE WILD LEGEND",
    finaleTitle: "The first chapter begins here",
    finaleLine: "ALEXIS ALESSANDRO · WILD ONE · 2026",
  },
  es: {
    gateKicker: "EXPEDICIÓN PRIVADA · ACCESO 01",
    gateTitle: "Una celebración extraordinaria está por despertar",
    gateSub: "Más allá de las hojas espera un pequeño explorador extraordinario.",
    enter: "ENTRAR A LA SELVA",
    switch: "EN",
    soundOn: "SONIDO ACTIVO",
    soundOff: "SONIDO APAGADO",
    heroKicker: "LA JUNGLA PRESENTA",
    heroName: "Alexis Alessandro",
    heroWild: "WILD ONE",
    heroDate: "20 DE SEPTIEMBRE · 2026 · 5:00 PM",
    scroll: "DESCENDER A LA HISTORIA",
    proclamationTop: "LA PROCLAMACIÓN",
    proclamationA: "La jungla ha elegido a su pequeño rey.",
    proclamationB: "Un año de magia. Una celebración inolvidable.",
    proclamationNote: "Sin fotografías. Sin una invitación ordinaria. Solo un mundo creado para Alexis Alessandro.",
    routeTop: "COORDENADAS REVELADAS",
    routeTitle: "La expedición tiene un destino",
    dateLabel: "FECHA",
    timeLabel: "HORA",
    locationLabel: "PUNTO DE ENCUENTRO",
    dateValue: "20 DE SEPTIEMBRE, 2026",
    timeValue: "5:00 PM",
    locationValue: "581 KATHY LANE · MARGATE, FLORIDA 33068",
    map: "REVELAR LA RUTA",
    dressTop: "EL CÓDIGO SAFARI",
    dressTitle: "Llega como parte del paisaje",
    dressBody: "Safari Chic · lino, verde salvia, arena, crema, caqui y tonos tierra serenos.",
    countdownTop: "EL SAFARI PROHIBIDO ABRE EN",
    days: "DÍAS",
    hours: "HORAS",
    minutes: "MINUTOS",
    seconds: "SEGUNDOS",
    today: "LAS PUERTAS ESTÁN ABIERTAS",
    rsvpTop: "EL RITUAL FINAL",
    rsvpTitle: "Reclama tu Safari Pass",
    rsvpBody: "Tu nombre pasa a formar parte de la expedición. El pase privado se crea al confirmar.",
    name: "NOMBRE DEL EXPLORADOR",
    placeholder: "Tu nombre",
    yes: "ASISTIRÉ",
    no: "NO PODRÉ ASISTIR",
    submit: "CREAR MI PASE",
    sending: "CREANDO ACCESO…",
    whatsapp: "CONFIRMAR POR WHATSAPP",
    error: "No pudimos conectar con el registro de expedición. La confirmación por WhatsApp sigue disponible.",
    passTop: "WILD ONE · SAFARI PASS PRIVADO",
    passGuest: "EXPLORADOR",
    passStatus: "ESTADO",
    confirmed: "AUTORIZADO PARA LA EXPEDICIÓN",
    declined: "CON NOSOTROS DESDE LA DISTANCIA",
    passDate: "20 · 09 · 2026",
    passClose: "VOLVER A LA EXPERIENCIA",
    gifts: "REGALOS OPCIONALES",
    giftsBody: "Tu presencia es el regalo más especial. Más adelante se puede revelar aquí cualquier detalle adicional.",
    finaleTop: "UN AÑO · UNA LEYENDA SALVAJE",
    finaleTitle: "El primer capítulo comienza aquí",
    finaleLine: "ALEXIS ALESSANDRO · WILD ONE · 2026",
  },
} as const;

function pad(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 190 310" aria-hidden="true">
      <path d="M94 302C55 260 23 192 25 116 27 55 53 15 94 5c42 13 68 54 70 111 3 74-31 145-70 186Z" fill="currentColor" />
      <path d="M95 24v253M95 66 54 38M95 95l53-36M95 128 45 96M95 158l56-36M95 190 48 156M95 221l48-31M95 252l-38-23" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function Giraffe({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 420" aria-hidden="true">
      <defs>
        <linearGradient id="giraffeGold" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f0c57a"/><stop offset="1" stopColor="#b97843"/></linearGradient>
      </defs>
      <path d="M81 400c12-84 2-169 12-247 5-45 17-83 31-112 8-17 28-27 47-20 25 9 37 35 27 58-9 22-31 31-59 25-3 83 10 200 18 296Z" fill="url(#giraffeGold)" />
      <path d="M142 25 132 3M177 30l13-22" stroke="#6d4930" strokeWidth="9" strokeLinecap="round" />
      <path d="M125 72q-31 13-45-16" fill="none" stroke="#6d4930" strokeWidth="7" strokeLinecap="round" />
      <circle cx="180" cy="60" r="6" fill="#241a14" />
      <g fill="#7d5235" opacity=".95"><ellipse cx="144" cy="99" rx="15" ry="11"/><ellipse cx="125" cy="148" rx="13" ry="22"/><ellipse cx="142" cy="207" rx="17" ry="12"/><ellipse cx="125" cy="267" rx="13" ry="23"/><ellipse cx="146" cy="326" rx="16" ry="11"/><ellipse cx="118" cy="365" rx="11" ry="18"/></g>
    </svg>
  );
}

function Lion({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 300" aria-hidden="true">
      <defs><radialGradient id="mane"><stop stopColor="#c78b4f"/><stop offset="1" stopColor="#74442d"/></radialGradient></defs>
      <circle cx="150" cy="148" r="117" fill="url(#mane)" />
      <circle cx="150" cy="151" r="78" fill="#e3b576" />
      <path d="M101 105Q74 66 65 114M199 105q27-39 36 9" fill="#d79b60" stroke="#7a4b30" strokeWidth="7" />
      <circle cx="123" cy="143" r="7" fill="#241b16"/><circle cx="178" cy="143" r="7" fill="#241b16"/>
      <path d="M139 169h23l-12 13Z" fill="#4b3025" />
      <path d="M123 192q27 22 55 0" fill="none" stroke="#4b3025" strokeWidth="6" strokeLinecap="round" />
      <g stroke="#6b4b34" strokeWidth="3" opacity=".65"><path d="M109 175 57 161"/><path d="M111 184 55 186"/><path d="M190 175l52-14"/><path d="M188 184l56 2"/></g>
    </svg>
  );
}

function Elephant({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 360 280" aria-hidden="true">
      <defs><linearGradient id="elephantSkin" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b2aaa0"/><stop offset="1" stopColor="#706a65"/></linearGradient></defs>
      <ellipse cx="171" cy="161" rx="112" ry="88" fill="url(#elephantSkin)" />
      <circle cx="268" cy="135" r="64" fill="#a39b92" />
      <ellipse cx="222" cy="135" rx="49" ry="61" fill="#777069" opacity=".9" />
      <path d="M310 150c20 45 7 84-20 103-13 9-27-5-18-18 24-31 13-55-5-82Z" fill="#9a938a" />
      <circle cx="286" cy="121" r="6" fill="#22201d" />
      <path d="M103 212v55M155 224v43M211 219v48" stroke="#67615c" strokeWidth="24" strokeLinecap="round" />
    </svg>
  );
}

function Leopard({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 330 220" aria-hidden="true">
      <path d="M40 153c21-71 88-111 169-95 48 9 80 40 89 73-7 43-46 72-96 72H86c-35 0-55-17-46-50Z" fill="#c69650" />
      <circle cx="258" cy="82" r="43" fill="#d8aa64" />
      <path d="M231 53 218 29l32 15M277 53l19-22 6 34" fill="#b77e3e" />
      <circle cx="247" cy="79" r="5" fill="#221b16"/><circle cx="273" cy="79" r="5" fill="#221b16"/>
      <path d="M253 96h15l-7 8Z" fill="#3a261c" />
      <g fill="#5c402e"><circle cx="105" cy="101" r="10"/><circle cx="146" cy="83" r="8"/><circle cx="176" cy="117" r="12"/><circle cx="211" cy="91" r="8"/><circle cx="90" cy="144" r="8"/><circle cx="137" cy="152" r="10"/><circle cx="206" cy="154" r="9"/></g>
      <path d="M42 145C11 129 3 94 29 75" fill="none" stroke="#c69650" strokeWidth="18" strokeLinecap="round" />
    </svg>
  );
}

function Monkey({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 260" aria-hidden="true">
      <path d="M53 105c-14-58 35-93 75-76 39-27 92 7 82 59 20 25 8 70-28 78-13 55-105 61-126 8-39-10-43-50-3-69Z" fill="#6e4934" />
      <ellipse cx="128" cy="126" rx="58" ry="63" fill="#b9825a" />
      <circle cx="107" cy="119" r="6" fill="#261a14"/><circle cx="150" cy="119" r="6" fill="#261a14"/>
      <path d="M117 143h22l-11 9Z" fill="#4b3025"/><path d="M108 165q20 16 41 0" fill="none" stroke="#4b3025" strokeWidth="5" strokeLinecap="round" />
      <path d="M70 193c-49 8-59 52-25 58" fill="none" stroke="#6e4934" strokeWidth="15" strokeLinecap="round" />
    </svg>
  );
}

function BalloonConstellation({ className = "" }: { className?: string }) {
  return <div className={`balloon-constellation ${className}`} aria-hidden="true">{Array.from({ length: 22 }, (_, i) => <i key={i} />)}</div>;
}

function Compass() {
  return (
    <svg className="compass" viewBox="0 0 320 320" aria-hidden="true">
      <circle cx="160" cy="160" r="142" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".35" />
      <circle cx="160" cy="160" r="112" fill="none" stroke="currentColor" strokeWidth="1" opacity=".25" />
      <circle cx="160" cy="160" r="72" fill="none" stroke="currentColor" strokeWidth="1" opacity=".2" />
      <path d="M160 36 181 141 160 160 139 141Z" fill="currentColor" opacity=".92" />
      <path d="m160 284-21-105 21-19 21 19Z" fill="currentColor" opacity=".3" />
      <path d="M36 160 141 139 160 160 141 181Z" fill="currentColor" opacity=".28" />
      <path d="m284 160-105 21-19-21 19-21Z" fill="currentColor" opacity=".28" />
      <text x="160" y="25" textAnchor="middle" fill="currentColor" fontSize="14" letterSpacing="4">N</text>
      <text x="160" y="307" textAnchor="middle" fill="currentColor" fontSize="14" letterSpacing="4">S</text>
      <text x="15" y="166" textAnchor="middle" fill="currentColor" fontSize="14" letterSpacing="4">W</text>
      <text x="306" y="166" textAnchor="middle" fill="currentColor" fontSize="14" letterSpacing="4">E</text>
    </svg>
  );
}

function SoundGlyph() {
  return <span className="sound-glyph" aria-hidden="true"><i/><i/><i/><i/></span>;
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
    const detected: Locale = navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
    const saved = localStorage.getItem("wild-one-locale") as Locale | null;
    const initial = saved === "en" || saved === "es" ? saved : detected;
    setLocale(initial);
    document.documentElement.lang = initial;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: 0.16 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    const pointer = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - .5) * 2;
      const y = (event.clientY / window.innerHeight - .5) * 2;
      document.documentElement.style.setProperty("--px", x.toFixed(3));
      document.documentElement.style.setProperty("--py", y.toFixed(3));
    };
    window.addEventListener("pointermove", pointer, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", pointer);
      stopSound();
    };
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
    localStorage.setItem("wild-one-locale", next);
    document.documentElement.lang = next;
  }

  function startSound() {
    if (audioRef.current) return;
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    const ctx = new AudioCtor();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    master.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 1.8);

    const ambience = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const ambData = ambience.getChannelData(0);
    for (let i = 0; i < ambData.length; i += 1) ambData[i] = (Math.random() * 2 - 1) * 0.22;
    const amb = ctx.createBufferSource();
    amb.buffer = ambience;
    amb.loop = true;
    const low = ctx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 520;
    const ambGain = ctx.createGain();
    ambGain.gain.value = 0.13;
    amb.connect(low); low.connect(ambGain); ambGain.connect(master); amb.start();

    const tone = (frequency: number, duration: number, volume: number, type: OscillatorType = "sine", delay = 0) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      const start = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + Math.min(.12, duration * .2));
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain); gain.connect(master); osc.start(start); osc.stop(start + duration + .03);
    };

    const drum = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(115, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(46, ctx.currentTime + .22);
      gain.gain.setValueAtTime(.24, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .34);
      osc.connect(gain); gain.connect(master); osc.start(); osc.stop(ctx.currentTime + .36);
    };

    const chime = () => {
      const scale = [220, 261.63, 329.63, 392, 523.25];
      const f = scale[Math.floor(Math.random() * scale.length)];
      tone(f, 2.8, .04, "sine");
      tone(f * 2, 1.6, .012, "triangle", .08);
    };

    const bird = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      const base = 1200 + Math.random() * 650;
      osc.frequency.setValueAtTime(base, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(base * 1.55, ctx.currentTime + .09);
      osc.frequency.exponentialRampToValueAtTime(base * .92, ctx.currentTime + .28);
      gain.gain.setValueAtTime(.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.035, ctx.currentTime + .04);
      gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .32);
      osc.connect(gain); gain.connect(master); osc.start(); osc.stop(ctx.currentTime + .34);
    };

    const chord = () => {
      [110, 164.81, 220, 293.66].forEach((f, i) => tone(f, 5.8, i === 0 ? .035 : .018, i % 2 ? "triangle" : "sine", i * .04));
    };

    drum(); tone(440, 2.2, .035, "triangle", .25); chord();
    const timers = [
      window.setInterval(drum, 3100),
      window.setInterval(chime, 4700),
      window.setInterval(chord, 6200),
      window.setInterval(bird, 7900),
    ];
    audioRef.current = { ctx, master, timers };
    setSoundOn(true);
  }

  function stopSound() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.timers.forEach(timer => window.clearInterval(timer));
    audio.master.gain.setTargetAtTime(0.0001, audio.ctx.currentTime, .12);
    window.setTimeout(() => audio.ctx.close(), 700);
    audioRef.current = null;
    setSoundOn(false);
  }

  function toggleSound() {
    if (soundOn) stopSound(); else startSound();
  }

  function enterExperience() {
    setEntered(true);
    startSound();
    window.setTimeout(() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" }), 1050);
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
      if (!response.ok) throw new Error("rsvp_failed");
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
    <main className="experience">
      <div className={`gate ${entered ? "gate--open" : ""}`} aria-hidden={entered}>
        <div className="gate__veil gate__veil--left"><Leaf className="gate__leaf gate__leaf--a"/><Leaf className="gate__leaf gate__leaf--b"/></div>
        <div className="gate__veil gate__veil--right"><Leaf className="gate__leaf gate__leaf--c"/><Leaf className="gate__leaf gate__leaf--d"/></div>
        <div className="gate__stars" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i}/>)}</div>
        <div className="gate__content">
          <div className="seal seal--gate"><span>A</span><b>01</b><i>WILD</i></div>
          <p className="micro">{t.gateKicker}</p>
          <h1>{t.gateTitle}</h1>
          <p className="gate__sub">{t.gateSub}</p>
          <button className="ritual-button" onClick={enterExperience}><span>{t.enter}</span><i aria-hidden="true"/></button>
        </div>
      </div>

      <div className="hud">
        <button className="hud__lang" onClick={switchLocale} aria-label="Switch language">{t.switch}</button>
        <button className={`hud__sound ${soundOn ? "is-on" : ""}`} onClick={toggleSound} aria-label={soundOn ? t.soundOn : t.soundOff}><SoundGlyph/><span>{soundOn ? t.soundOn : t.soundOff}</span></button>
      </div>

      <section className="hero" id="hero">
        <div className="hero__aurora"/><div className="hero__mist hero__mist--a"/><div className="hero__mist hero__mist--b"/>
        <div className="hero__particles" aria-hidden="true">{Array.from({ length: 34 }, (_, i) => <i key={i}/>)}</div>
        <BalloonConstellation className="hero__balloons" />
        <Leaf className="hero__leaf hero__leaf--1"/><Leaf className="hero__leaf hero__leaf--2"/><Leaf className="hero__leaf hero__leaf--3"/><Leaf className="hero__leaf hero__leaf--4"/>
        <Giraffe className="hero__giraffe"/><Elephant className="hero__elephant"/><Lion className="hero__lion"/><Leopard className="hero__leopard"/><Monkey className="hero__monkey"/>
        <div className="hero__center">
          <p className="micro hero__kicker">{t.heroKicker}</p>
          <div className="hero__monolith" aria-hidden="true"><span>1</span><i/><b/></div>
          <h2><span>{t.heroName.split(" ")[0]}</span><em>{t.heroName.split(" ").slice(1).join(" ")}</em></h2>
          <div className="hero__wild"><i/><strong>{t.heroWild}</strong><i/></div>
          <p className="hero__date">{t.heroDate}</p>
          <a className="hero__descend" href="#proclamation"><span>{t.scroll}</span><b aria-hidden="true"/></a>
        </div>
      </section>

      <section className="proclamation" id="proclamation">
        <div className="proclamation__halo"/>
        <Leaf className="proclamation__leaf proclamation__leaf--l"/><Leaf className="proclamation__leaf proclamation__leaf--r"/>
        <div className="proclamation__number" aria-hidden="true">01</div>
        <div className="proclamation__content reveal">
          <p className="micro micro--gold">{t.proclamationTop}</p>
          <h2>{t.proclamationA}</h2>
          <p className="proclamation__line">{t.proclamationB}</p>
          <div className="proclamation__sigil"><span>A</span><i/><b>W1</b></div>
          <p className="proclamation__note">{t.proclamationNote}</p>
        </div>
      </section>

      <section className="route-scene">
        <div className="route-scene__map" aria-hidden="true">
          <Compass />
          <svg className="route-line" viewBox="0 0 900 480">
            <path d="M95 370C180 280 247 392 343 300S501 104 602 202 730 271 817 107" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="9 12" />
            <circle cx="95" cy="370" r="7" fill="currentColor"/><circle cx="817" cy="107" r="11" fill="currentColor"/>
          </svg>
          <div className="route-scene__coordinates">26.2445° N<br/>80.2064° W</div>
        </div>
        <div className="route-scene__content reveal">
          <p className="micro micro--gold">{t.routeTop}</p>
          <h2>{t.routeTitle}</h2>
          <div className="coordinates-list">
            <div><span>{t.dateLabel}</span><strong>{t.dateValue}</strong></div>
            <div><span>{t.timeLabel}</span><strong>{t.timeValue}</strong></div>
            <div><span>{t.locationLabel}</span><strong>{t.locationValue}</strong></div>
          </div>
          <a className="outline-button" href={MAP_URL} target="_blank" rel="noreferrer"><span>{t.map}</span><i/></a>
        </div>
      </section>

      <section className="safari-code">
        <div className="safari-code__texture"/>
        <div className="safari-code__copy reveal">
          <p className="micro micro--forest">{t.dressTop}</p>
          <h2>{t.dressTitle}</h2>
          <p>{t.dressBody}</p>
        </div>
        <div className="fabric-ribbons reveal" aria-label="Safari chic color palette">
          <div className="fabric-ribbon fabric-ribbon--forest"><span>FOREST</span></div>
          <div className="fabric-ribbon fabric-ribbon--sage"><span>SAGE</span></div>
          <div className="fabric-ribbon fabric-ribbon--sand"><span>SAND</span></div>
          <div className="fabric-ribbon fabric-ribbon--ivory"><span>IVORY</span></div>
          <div className="fabric-ribbon fabric-ribbon--khaki"><span>KHAKI</span></div>
        </div>
      </section>

      <section className="chamber">
        <div className="chamber__rings" aria-hidden="true"><i/><i/><i/><i/></div>
        <Leaf className="chamber__leaf chamber__leaf--1"/><Leaf className="chamber__leaf chamber__leaf--2"/>
        <div className="chamber__content reveal">
          <p className="micro micro--gold">{t.countdownTop}</p>
          {remaining.total > 0 ? (
            <div className="time-orbit">
              <div><strong>{pad(remaining.days)}</strong><span>{t.days}</span></div>
              <div><strong>{pad(remaining.hours)}</strong><span>{t.hours}</span></div>
              <div><strong>{pad(remaining.minutes)}</strong><span>{t.minutes}</span></div>
              <div><strong>{pad(remaining.seconds)}</strong><span>{t.seconds}</span></div>
              <div className="time-orbit__core"><span>A</span><b>1</b></div>
            </div>
          ) : <h2 className="chamber__today">{t.today}</h2>}
        </div>
      </section>

      <section className="rsvp-scene" id="rsvp">
        <div className="rsvp-scene__stage" aria-hidden="true">
          <BalloonConstellation />
          <Giraffe className="rsvp-scene__giraffe"/><Lion className="rsvp-scene__lion"/><Leaf className="rsvp-scene__leaf rsvp-scene__leaf--a"/><Leaf className="rsvp-scene__leaf rsvp-scene__leaf--b"/>
          <div className="rsvp-scene__one">1</div>
        </div>
        <div className="rsvp-panel reveal">
          <p className="micro micro--forest">{t.rsvpTop}</p>
          <h2>{t.rsvpTitle}</h2>
          <p className="rsvp-panel__body">{t.rsvpBody}</p>
          <form onSubmit={submitRsvp}>
            <label htmlFor="guest-name">{t.name}</label>
            <input id="guest-name" value={guestName} onChange={e => setGuestName(e.target.value)} placeholder={t.placeholder} minLength={2} maxLength={120} required />
            <div className="choice" role="group" aria-label="Attendance">
              <button type="button" onClick={() => setAttendance("yes")} className={attendance === "yes" ? "active" : ""}>{t.yes}</button>
              <button type="button" onClick={() => setAttendance("no")} className={attendance === "no" ? "active" : ""}>{t.no}</button>
            </div>
            <button className="forge-button" disabled={submitting} type="submit"><span>{submitting ? t.sending : t.submit}</span><i/></button>
            {error && <p className="form-error">{t.error}</p>}
            <a className="whatsapp-link" href={whatsappUrl} target="_blank" rel="noreferrer">{t.whatsapp}<i/></a>
          </form>
        </div>
      </section>

      <section className="gifts">
        <details className="reveal"><summary><span>{t.gifts}</span><i/></summary><p>{t.giftsBody}</p></details>
      </section>

      <footer className="finale">
        <div className="finale__sun"/><div className="finale__mist"/>
        <BalloonConstellation className="finale__balloons" />
        <Giraffe className="finale__giraffe"/><Elephant className="finale__elephant"/><Lion className="finale__lion"/><Leopard className="finale__leopard"/><Monkey className="finale__monkey"/>
        <Leaf className="finale__leaf finale__leaf--1"/><Leaf className="finale__leaf finale__leaf--2"/><Leaf className="finale__leaf finale__leaf--3"/>
        <div className="finale__content reveal">
          <p className="micro micro--gold">{t.finaleTop}</p>
          <h2>{t.finaleTitle}</h2>
          <div className="finale__seal"><span>1</span><b>WILD ONE</b></div>
          <p>{t.finaleLine}</p>
        </div>
      </footer>

      {submitted && (
        <div className="pass-modal" role="dialog" aria-modal="true" aria-label="Safari Pass">
          <div className="pass-modal__backdrop" onClick={() => setSubmitted(false)} />
          <div className="safari-pass">
            <div className="safari-pass__glow"/>
            <Leaf className="safari-pass__leaf safari-pass__leaf--1"/><Leaf className="safari-pass__leaf safari-pass__leaf--2"/>
            <div className="safari-pass__header"><span>{t.passTop}</span><b>01</b></div>
            <div className="safari-pass__seal"><span>A</span><b>1</b></div>
            <div className="safari-pass__main">
              <span>{t.passGuest}</span>
              <h3>{guestName.trim()}</h3>
              <div><span>{t.passStatus}</span><strong>{attendance === "yes" ? t.confirmed : t.declined}</strong></div>
            </div>
            <div className="safari-pass__footer"><span>{t.passDate}</span><b>MARGATE · FL</b></div>
            <button onClick={() => setSubmitted(false)}>{t.passClose}</button>
          </div>
        </div>
      )}
    </main>
  );
}
