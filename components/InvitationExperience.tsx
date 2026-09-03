"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Locale = "en" | "es";
type Attendance = "yes" | "no";

const EVENT_TIME = new Date("2026-09-20T17:00:00-04:00").getTime();
const SUPABASE_URL = "https://sqchlnhkceztcznkjctg.supabase.co";
const SUPABASE_KEY = "sb_publishable_eyhxdWjBo_b65URp-R4l7w_4q4Ltxkc";
const MAP_URL = "https://www.google.com/maps/search/?api=1&query=581%20Kathy%20Lane%2C%20Margate%2C%20FL%2033068";
const WHATSAPP_NUMBER = "17546106574";

const copy = {
  en: {
    enterEyebrow: "A first birthday expedition",
    enterTitle: "Something wild is about to begin…",
    enterButton: "Enter the wild",
    soundOn: "Safari ambience on",
    soundOff: "Safari ambience off",
    heroKicker: "Our little explorer is turning one",
    heroTitle: "Wild One",
    heroDate: "September 20, 2026 · 5:00 PM",
    scroll: "Scroll to explore",
    storyKicker: "Chapter one",
    storyTitle: "365 days of little adventures",
    storyBody: "A year of smiles, discoveries, tiny steps and unforgettable moments. Now Alexis Alessandro is ready for his wildest adventure yet.",
    photo1: "Wonder",
    photo2: "Adventure",
    photo3: "Wild at heart",
    inviteKicker: "Save the date",
    inviteTitle: "The safari begins",
    when: "When",
    whenValue: "Sunday · September 20, 2026 · 5:00 PM",
    where: "Where",
    whereValue: "581 Kathy Lane · Margate, Florida 33068",
    dress: "Dress code",
    dressValue: "Safari Chic · earthy tones, linen, sage, sand, cream & khaki",
    map: "Take me there",
    countdownKicker: "The wild adventure begins in",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    today: "The adventure is here!",
    rsvpKicker: "RSVP",
    rsvpTitle: "Will you join the adventure?",
    rsvpBody: "Confirm below and your personal Safari Pass will be ready instantly.",
    name: "Guest name",
    namePlaceholder: "Your name",
    yes: "I'll be there",
    no: "I can't make it",
    submit: "Confirm adventure",
    sending: "Preparing your pass…",
    error: "We couldn't save the RSVP right now. You can still confirm instantly on WhatsApp.",
    whatsapp: "Confirm via WhatsApp",
    passKicker: "Wild One Safari Pass",
    guest: "Explorer",
    status: "Adventure status",
    confirmed: "Confirmed",
    declined: "With love, from afar",
    passNote: "Keep this little pass as a memory of Alexis Alessandro's first wild adventure.",
    share: "Share invitation",
    giftTitle: "A little extra",
    giftBody: "Your presence is the greatest gift. Any additional gift details can be added here later.",
    finale1: "One year.",
    finale2: "One wild adventure.",
    finale3: "One very special little explorer.",
    finaleEnd: "See you in the wild.",
    language: "ES",
  },
  es: {
    enterEyebrow: "Una expedición de primer cumpleaños",
    enterTitle: "Algo salvaje está por comenzar…",
    enterButton: "Entra a la aventura",
    soundOn: "Ambiente safari activado",
    soundOff: "Ambiente safari desactivado",
    heroKicker: "Nuestro pequeño explorador cumple un año",
    heroTitle: "Wild One",
    heroDate: "20 de septiembre de 2026 · 5:00 PM",
    scroll: "Desliza para explorar",
    storyKicker: "Capítulo uno",
    storyTitle: "365 días de pequeñas aventuras",
    storyBody: "Un año de sonrisas, descubrimientos, pequeños pasos y momentos inolvidables. Ahora Alexis Alessandro está listo para su aventura más salvaje.",
    photo1: "Asombro",
    photo2: "Aventura",
    photo3: "Alma salvaje",
    inviteKicker: "Reserva la fecha",
    inviteTitle: "Comienza el safari",
    when: "Cuándo",
    whenValue: "Domingo · 20 de septiembre de 2026 · 5:00 PM",
    where: "Dónde",
    whereValue: "581 Kathy Lane · Margate, Florida 33068",
    dress: "Código de vestimenta",
    dressValue: "Safari Chic · tonos tierra, lino, verde salvia, arena, crema y caqui",
    map: "Cómo llegar",
    countdownKicker: "La aventura salvaje comienza en",
    days: "Días",
    hours: "Horas",
    minutes: "Minutos",
    seconds: "Segundos",
    today: "¡La aventura ya está aquí!",
    rsvpKicker: "Confirmación",
    rsvpTitle: "¿Te unes a la aventura?",
    rsvpBody: "Confirma aquí y tu Safari Pass personal aparecerá al instante.",
    name: "Nombre del invitado",
    namePlaceholder: "Tu nombre",
    yes: "Ahí estaré",
    no: "No podré acompañarlos",
    submit: "Confirmar aventura",
    sending: "Preparando tu pase…",
    error: "No pudimos guardar la confirmación ahora mismo. También puedes confirmar de inmediato por WhatsApp.",
    whatsapp: "Confirmar por WhatsApp",
    passKicker: "Wild One Safari Pass",
    guest: "Explorador",
    status: "Estado de la aventura",
    confirmed: "Confirmado",
    declined: "Con cariño, desde la distancia",
    passNote: "Guarda este pequeño pase como recuerdo de la primera gran aventura de Alexis Alessandro.",
    share: "Compartir invitación",
    giftTitle: "Un detalle extra",
    giftBody: "Tu presencia es el mejor regalo. Si más adelante se desea agregar información de regalos, aparecerá aquí.",
    finale1: "Un año.",
    finale2: "Una gran aventura.",
    finale3: "Un pequeño explorador muy especial.",
    finaleEnd: "Nos vemos en la selva.",
    language: "EN",
  },
} as const;

const safariImages = [
  "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=88",
  "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=88",
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=88",
];

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
  const audioRef = useRef<{ ctx: AudioContext; gain: GainNode; timer: number } | null>(null);
  const t = copy[locale];

  useEffect(() => {
    const saved = window.localStorage.getItem("wild-one-locale") as Locale | null;
    const detected: Locale = navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
    setLocale(saved === "en" || saved === "es" ? saved : detected);

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.14 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    return () => stopAudio();
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

  function startAudio() {
    if (audioRef.current) return;
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const gain = ctx.createGain();
    gain.gain.value = 0.055;
    gain.connect(ctx.destination);

    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * 0.22;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    noise.connect(filter);
    filter.connect(gain);
    noise.start();

    const notes = [261.63, 293.66, 329.63, 392, 440];
    const playNote = () => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = notes[Math.floor(Math.random() * notes.length)] / 2;
      noteGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);
      osc.connect(noteGain);
      noteGain.connect(gain);
      osc.start();
      osc.stop(ctx.currentTime + 1.7);
    };
    playNote();
    const timer = window.setInterval(playNote, 4300);
    audioRef.current = { ctx, gain, timer };
    setSoundOn(true);
  }

  function stopAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    window.clearInterval(audio.timer);
    audio.gain.gain.setTargetAtTime(0.0001, audio.ctx.currentTime, 0.08);
    window.setTimeout(() => audio.ctx.close(), 300);
    audioRef.current = null;
    setSoundOn(false);
  }

  function toggleSound() {
    if (soundOn) stopAudio();
    else startAudio();
  }

  function enterExperience() {
    setEntered(true);
    startAudio();
    window.setTimeout(() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" }), 550);
  }

  async function submitRsvp(event: FormEvent) {
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
        body: JSON.stringify({
          guest_name: guestName.trim(),
          attendance,
          locale,
          event_slug: "alexis-wild-one",
        }),
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
    ? `Hola, confirmo mi asistencia para el Wild One de Alexis Alessandro. Mi nombre es ${guestName.trim() || "_____"}.`
    : `Hi! I'm confirming my attendance for Alexis Alessandro's Wild One celebration. My name is ${guestName.trim() || "_____"}.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  async function shareInvitation() {
    if (navigator.share) {
      await navigator.share({
        title: "Alexis Alessandro — Wild One",
        text: locale === "es" ? "Acompáñanos a la primera gran aventura de Alexis Alessandro." : "Join Alexis Alessandro's first wild adventure.",
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <main className="site-shell">
      <div className={`entry-gate ${entered ? "entry-gate--open" : ""}`} aria-hidden={entered}>
        <div className="entry-leaf entry-leaf--left" />
        <div className="entry-leaf entry-leaf--right" />
        <div className="entry-content">
          <div className="crest" aria-hidden="true"><span>A</span><i>1</i></div>
          <p className="eyebrow">{t.enterEyebrow}</p>
          <h1>{t.enterTitle}</h1>
          <p className="entry-name">Alexis Alessandro</p>
          <button className="button button--gold" onClick={enterExperience}>{t.enterButton}</button>
        </div>
      </div>

      <div className="floating-controls">
        <button onClick={switchLocale} className="control-pill" aria-label="Switch language">{t.language}</button>
        <button onClick={toggleSound} className={`sound-control ${soundOn ? "is-playing" : ""}`} aria-label={soundOn ? t.soundOn : t.soundOff}>
          <span className="sound-bars" aria-hidden="true"><i /><i /><i /></span>
          <span>{soundOn ? t.soundOn : t.soundOff}</span>
        </button>
      </div>

      <section id="hero" className="hero section-dark">
        <div className="hero-photo" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-balloons hero-balloons--left" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="hero-balloons hero-balloons--right" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">{t.heroKicker}</p>
          <div className="hero-one" aria-hidden="true">1</div>
          <h2>Alexis <span>Alessandro</span></h2>
          <div className="wild-one-lockup"><span>{t.heroTitle}</span></div>
          <p className="hero-date">{t.heroDate}</p>
          <a href="#story" className="scroll-cue">{t.scroll}<span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section id="story" className="story section-cream">
        <div className="section-copy reveal">
          <p className="eyebrow">{t.storyKicker}</p>
          <h2>{t.storyTitle}</h2>
          <p className="lead">{t.storyBody}</p>
        </div>
        <div className="expedition-gallery">
          {safariImages.map((src, index) => (
            <figure className={`expedition-card reveal expedition-card--${index + 1}`} key={src}>
              <img src={src} alt="Safari placeholder photography" />
              <figcaption>
                <span>0{index + 1}</span>
                <strong>{[t.photo1, t.photo2, t.photo3][index]}</strong>
                <small>Alexis · Year One</small>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="placeholder-note reveal">Temporary safari imagery · Alexis&apos; real photos will replace these frames.</p>
      </section>

      <section className="invitation section-sage">
        <div className="section-copy section-copy--center reveal">
          <p className="eyebrow">{t.inviteKicker}</p>
          <h2>{t.inviteTitle}</h2>
        </div>
        <div className="detail-grid">
          <article className="detail-card reveal">
            <span className="detail-index">01</span>
            <p>{t.when}</p>
            <h3>{t.whenValue}</h3>
          </article>
          <article className="detail-card reveal">
            <span className="detail-index">02</span>
            <p>{t.where}</p>
            <h3>{t.whereValue}</h3>
            <a className="text-link" href={MAP_URL} target="_blank" rel="noreferrer">{t.map} ↗</a>
          </article>
          <article className="detail-card reveal">
            <span className="detail-index">03</span>
            <p>{t.dress}</p>
            <h3>{t.dressValue}</h3>
            <div className="swatches" aria-label="Safari Chic color palette"><i className="swatch swatch--forest" /><i className="swatch swatch--sage" /><i className="swatch swatch--sand" /><i className="swatch swatch--cream" /><i className="swatch swatch--khaki" /></div>
          </article>
        </div>
      </section>

      <section className="countdown section-dark">
        <div className="countdown-orbit" aria-hidden="true" />
        <div className="section-copy section-copy--center reveal">
          <p className="eyebrow hero-eyebrow">{t.countdownKicker}</p>
          {remaining.total === 0 ? <h2>{t.today}</h2> : (
            <div className="countdown-grid">
              <div><strong>{remaining.days}</strong><span>{t.days}</span></div>
              <div><strong>{pad(remaining.hours)}</strong><span>{t.hours}</span></div>
              <div><strong>{pad(remaining.minutes)}</strong><span>{t.minutes}</span></div>
              <div><strong>{pad(remaining.seconds)}</strong><span>{t.seconds}</span></div>
            </div>
          )}
          <p className="countdown-date">20 · 09 · 2026 — MARGATE, FL</p>
        </div>
      </section>

      <section className="rsvp section-cream" id="rsvp">
        <div className="rsvp-layout">
          <div className="section-copy reveal">
            <p className="eyebrow">{t.rsvpKicker}</p>
            <h2>{t.rsvpTitle}</h2>
            <p className="lead">{t.rsvpBody}</p>
            <div className="rsvp-monogram" aria-hidden="true"><span>A</span><small>Wild One · 2026</small></div>
          </div>

          {!submitted ? (
            <form className="rsvp-form reveal" onSubmit={submitRsvp}>
              <label htmlFor="guest-name">{t.name}</label>
              <input id="guest-name" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder={t.namePlaceholder} minLength={2} maxLength={120} required />
              <div className="attendance-choice" role="group" aria-label="Attendance">
                <button type="button" className={attendance === "yes" ? "active" : ""} onClick={() => setAttendance("yes")}>{t.yes}</button>
                <button type="button" className={attendance === "no" ? "active" : ""} onClick={() => setAttendance("no")}>{t.no}</button>
              </div>
              <button className="button button--forest" type="submit" disabled={submitting}>{submitting ? t.sending : t.submit}</button>
              {error && <p className="form-error">{t.error}</p>}
              <a className="whatsapp-link" href={whatsappUrl} target="_blank" rel="noreferrer">{t.whatsapp} ↗</a>
            </form>
          ) : (
            <div className="safari-pass reveal is-visible">
              <div className="pass-topline"><span>{t.passKicker}</span><strong>AA · 001</strong></div>
              <div className="pass-mark"><span>A</span><i>1</i></div>
              <p className="pass-label">{t.guest}</p>
              <h3>{guestName.trim()}</h3>
              <div className="pass-meta">
                <div><span>20 SEP 2026</span><small>DATE</small></div>
                <div><span>5:00 PM</span><small>TIME</small></div>
                <div><span>MARGATE</span><small>FLORIDA</small></div>
              </div>
              <p className="pass-label">{t.status}</p>
              <div className={`pass-status ${attendance === "yes" ? "pass-status--yes" : ""}`}>{attendance === "yes" ? t.confirmed : t.declined}</div>
              <p className="pass-note">{t.passNote}</p>
              <button type="button" className="button button--ghost" onClick={shareInvitation}>{t.share}</button>
            </div>
          )}
        </div>
      </section>

      <section className="gift-note section-sand">
        <details className="reveal">
          <summary>{t.giftTitle}<span>+</span></summary>
          <p>{t.giftBody}</p>
        </details>
      </section>

      <section className="finale section-dark">
        <div className="finale-leaves" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="finale-content reveal">
          <div className="crest crest--final" aria-hidden="true"><span>A</span><i>1</i></div>
          <p>{t.finale1}</p>
          <p>{t.finale2}</p>
          <p>{t.finale3}</p>
          <h2>{t.finaleEnd}</h2>
          <span className="finale-name">Alexis Alessandro · Wild One · 2026</span>
        </div>
      </section>
    </main>
  );
}
