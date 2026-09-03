"use client";

import dynamic from "next/dynamic";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimalGlyph } from "./AnimalGlyph";
import { LivingMap } from "./LivingMap";
import { eventConfig, destinationLinks, calendarLinks } from "@/lib/eventConfig";
import { roleForKey } from "@/lib/safariRoles";
import type { Attendance, Expedition, JourneyStep, Locale } from "@/lib/types";
import { JUAN_PHOTO_1 } from "@/lib/juanPhoto1";
import { JUAN_PHOTO_2 } from "@/lib/juanPhoto2";
import { JUAN_PHOTO_3 } from "@/lib/juanPhoto3";
import { JUAN_PHOTO_4 } from "@/lib/juanPhoto4";

const SafariWorld = dynamic(() => import("./SafariWorld"), { ssr: false });
const portrait = `data:image/webp;base64,${JUAN_PHOTO_1}${JUAN_PHOTO_2}${JUAN_PHOTO_3}${JUAN_PHOTO_4}`;

const initial: Expedition = {
  id: "local-juan",
  token: "juan",
  code: "WILD-JUAN1",
  animalKey: "lion",
  locale: "es",
  guestName: "",
  attendance: null,
  leaves: [],
  calendarSaved: false,
  rank: "EXPLORER",
  journeyVersion: eventConfig.journeyVersion,
};

const copy = {
  es: {
    invite: "TE INVITO A CELEBRAR",
    hero: "MI PRIMER AÑO",
    enter: "ENTRAR A MI SAFARI",
    intro: "Una tarde llena de globos, animales y mucha aventura. ¡Te esperamos, no faltes!",
    chosen: "LA SELVA TE HA ELEGIDO",
    companion: "Tu compañero de expedición",
    location: "DONDE COMIENZA LA AVENTURA",
    date: "SÁBADO · 26 DE SEPTIEMBRE · 2026",
    time: "1:00 PM",
    maps: "ABRIR UBICACIÓN",
    calendar: "GUARDAR LA FECHA",
    countdown: "FALTA MUY POCO",
    rsvp: "CONFIRMA TU AVENTURA",
    guest: "Tu nombre",
    yes: "ASISTIRÉ",
    no: "NO PODRÉ ASISTIR",
    send: "CONFIRMAR",
    sent: "¡LISTO! TU SAFARI PASS ESTÁ PREPARADO",
    pass: "MI SAFARI PASS",
    close: "CERRAR",
    final: "¡TE ESPERAMOS, NO FALTES!",
    map: "MAPA VIVO DEL SAFARI",
  },
  en: {
    invite: "YOU'RE INVITED TO CELEBRATE",
    hero: "MY WILD ONE",
    enter: "ENTER MY SAFARI",
    intro: "An afternoon of balloons, safari friends and wild adventure. We can't wait to celebrate with you!",
    chosen: "THE JUNGLE HAS CHOSEN YOU",
    companion: "Your expedition companion",
    location: "WHERE THE ADVENTURE BEGINS",
    date: "SATURDAY · SEPTEMBER 26 · 2026",
    time: "1:00 PM",
    maps: "OPEN LOCATION",
    calendar: "SAVE THE DATE",
    countdown: "THE ADVENTURE IS ALMOST HERE",
    rsvp: "CONFIRM YOUR ADVENTURE",
    guest: "Your name",
    yes: "I'LL BE THERE",
    no: "I CAN'T MAKE IT",
    send: "CONFIRM",
    sent: "DONE! YOUR SAFARI PASS IS READY",
    pass: "MY SAFARI PASS",
    close: "CLOSE",
    final: "WE CAN'T WAIT TO SEE YOU!",
    map: "LIVING SAFARI MAP",
  },
} as const;

const balloonSpecs = Array.from({ length: 34 }, (_, i) => ({
  left: i < 17,
  x: i < 17 ? 2 + (i % 5) * 3.5 : 74 + (i % 5) * 4.5,
  y: 4 + ((i * 11) % 72),
  s: 30 + ((i * 17) % 48),
  tone: ["sage", "cream", "caramel", "olive", "brown"][i % 5],
}));

export default function JuanAlexanderOfficial() {
  const [locale, setLocale] = useState<Locale>("es");
  const [entered, setEntered] = useState(false);
  const [step, setStep] = useState<JourneyStep>("ENTER");
  const [expedition, setExpedition] = useState<Expedition>(initial);
  const [mapOpen, setMapOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("yes");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const t = copy[locale];
  const role = roleForKey(expedition.animalKey);

  useEffect(() => {
    document.documentElement.lang = locale;
    fetch(`/api/expedition?locale=${locale}`, { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Expedition) => {
        setExpedition({ ...data, journeyVersion: eventConfig.journeyVersion });
        setName(data.guestName || "");
        setAttendance(data.attendance || "yes");
      })
      .catch(() => undefined);
  }, [locale]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!entered) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const next = visible?.target.getAttribute("data-official-step") as JourneyStep | null;
        if (next) setStep(next);
      },
      { threshold: [0.35, 0.55, 0.75] },
    );
    document.querySelectorAll("[data-official-step]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entered]);

  const countdown = useMemo(() => {
    const total = new Date(eventConfig.startsAt).getTime() - now;
    return {
      total,
      days: Math.max(0, Math.floor(total / 86400000)),
      hours: Math.max(0, Math.floor(total / 3600000) % 24),
      minutes: Math.max(0, Math.floor(total / 60000) % 60),
      seconds: Math.max(0, Math.floor(total / 1000) % 60),
    };
  }, [now]);

  function toggleSound() {
    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/living-safari-soundscape.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.26;
    }
    if (soundOn) audioRef.current.pause();
    else void audioRef.current.play().catch(() => undefined);
    setSoundOn(!soundOn);
  }

  function enter() {
    setEntered(true);
    setStep("ANIMAL_REVEAL");
    if (!soundOn) toggleSound();
    window.setTimeout(() => document.querySelector("[data-official-step='ANIMAL_REVEAL']")?.scrollIntoView({ behavior: "smooth" }), 450);
  }

  function findLeaf(id: number) {
    if (expedition.leaves.includes(id)) return;
    const leaves = [...expedition.leaves, id].sort();
    const next = { ...expedition, leaves, rank: (leaves.length === 3 ? "GOLDEN EXPLORER" : "EXPLORER") as Expedition["rank"] };
    setExpedition(next);
    fetch("/api/expedition", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leaves }) }).catch(() => undefined);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) return;
    setSending(true);
    const next = { ...expedition, guestName: name.trim(), attendance };
    setExpedition(next);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: name.trim(),
          attendance,
          locale,
          animalKey: expedition.animalKey,
          role: role.role[locale],
          route: role.route[locale],
          leaves: expedition.leaves,
          expeditionId: expedition.id,
          journeyVersion: eventConfig.journeyVersion,
        }),
      });
      if (!response.ok) throw new Error("RSVP unavailable");
      setSent(true);
      setPassOpen(true);
    } catch {
      setSent(false);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className={`juan-official ${entered ? "is-entered" : ""}`}>
      <SafariWorld expedition={expedition} step={step} entered={entered} reducedMotion={false} onLeaf={findLeaf} onWebglFailure={() => undefined} />

      <header className="official-controls">
        <button onClick={() => setLocale(locale === "es" ? "en" : "es")}>{locale === "es" ? "EN" : "ES"}</button>
        <button onClick={toggleSound} aria-pressed={soundOn}>{soundOn ? "♫" : "♪"}</button>
        {entered ? <button className="official-map-button" onClick={() => setMapOpen(true)}>{t.map}</button> : null}
      </header>

      <section className={`official-hero ${entered ? "official-hero--gone" : ""}`}>
        <div className="official-balloon-field" aria-hidden="true">
          {balloonSpecs.map((b, i) => <i key={i} className={`balloon balloon--${b.tone}`} style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.s, height: b.s * 1.08 }} />)}
        </div>
        <div className="official-leaves official-leaves--left" aria-hidden="true"><i/><i/><i/></div>
        <div className="official-leaves official-leaves--right" aria-hidden="true"><i/><i/><i/></div>
        <div className="official-portrait-wrap">
          <div className="official-portrait-ring"><img src={portrait} alt="Juan Alexander" /></div>
          <span className="official-one">1</span>
        </div>
        <div className="official-hero-copy">
          <p className="official-kicker">JUAN ALEXANDER</p>
          <span>{t.invite}</span>
          <h1>{t.hero}</h1>
          <p className="official-date">{t.date}<br />{t.time}</p>
          <p className="official-intro">{t.intro}</p>
          <button className="official-enter" onClick={enter}>{t.enter}</button>
        </div>
      </section>

      <div className="official-journey">
        <section className="official-stage official-stage--chosen" data-official-step="ANIMAL_REVEAL">
          <div className="official-panel official-panel--transparent">
            <p className="official-kicker">{t.chosen}</p>
            <div className="official-animal" style={{ color: role.accent }}><AnimalGlyph animal={expedition.animalKey} title={role.animal[locale]} /></div>
            <h2>{role.animal[locale]}</h2>
            <strong>{role.role[locale]}</strong>
            <p>{t.companion} · {role.route[locale]}</p>
          </div>
        </section>

        <section className="official-stage official-stage--celebration" data-official-step="CELEBRATION">
          <div className="official-party-card">
            <div className="official-mini-photo"><img src={portrait} alt="Juan Alexander" /></div>
            <p className="official-kicker">WILD ONE</p>
            <h2>JUAN ALEXANDER</h2>
            <p>{locale === "es" ? "Te invita a celebrar su cumpleaños #1" : "Invites you to celebrate his 1st birthday"}</p>
            <strong>{locale === "es" ? "¡UNA AVENTURA SALVAJE COMIENZA!" : "A WILD ADVENTURE BEGINS!"}</strong>
          </div>
        </section>

        <section className="official-stage official-stage--location" data-official-step="COORDINATES" id="event-details">
          <div className="official-panel official-panel--light">
            <p className="official-kicker">{t.location}</p>
            <h2>SAN MIGUEL</h2>
            <p className="official-address">Lotificación Castilla<br/>Lote #13 · Polígono V<br/>San Miguel · El Salvador</p>
            <div className="official-date-block"><strong>26</strong><span>SEPTIEMBRE<br/>2026</span><em>1:00 PM</em></div>
            <div className="official-links">
              <a href={destinationLinks.google} target="_blank" rel="noreferrer">GOOGLE MAPS</a>
              <a href={destinationLinks.apple} target="_blank" rel="noreferrer">APPLE MAPS</a>
              <a href={destinationLinks.waze} target="_blank" rel="noreferrer">WAZE</a>
            </div>
          </div>
        </section>

        <section className="official-stage official-stage--calendar" data-official-step="CALENDAR">
          <div className="official-panel official-panel--dark">
            <p className="official-kicker">{t.calendar}</p>
            <div className="official-calendar-day">26<span>SEP</span></div>
            <h2>{locale === "es" ? "RESERVA ESTA AVENTURA" : "SAVE THIS WILD DAY"}</h2>
            <div className="official-links official-links--center">
              <a href="/api/calendar">APPLE / ICS</a>
              <a href={calendarLinks.google} target="_blank" rel="noreferrer">GOOGLE</a>
              <a href={calendarLinks.outlook} target="_blank" rel="noreferrer">OUTLOOK</a>
            </div>
          </div>
        </section>

        <section className="official-stage official-stage--countdown" data-official-step="COUNTDOWN">
          <div className="official-panel official-panel--transparent">
            <p className="official-kicker">{t.countdown}</p>
            <div className="official-countdown">
              {[[countdown.days, locale === "es" ? "DÍAS" : "DAYS"], [countdown.hours, locale === "es" ? "HORAS" : "HOURS"], [countdown.minutes, "MIN"], [countdown.seconds, "SEC"]].map(([value, label]) => <div key={String(label)}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}
            </div>
          </div>
        </section>

        <section className="official-stage official-stage--rsvp" data-official-step="RSVP">
          <form className="official-rsvp" onSubmit={submit}>
            <p className="official-kicker">{t.rsvp}</p>
            <h2>{locale === "es" ? "¿VIENES A MI FIESTA?" : "WILL YOU JOIN MY PARTY?"}</h2>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.guest} minLength={2} maxLength={80} required />
            <div className="official-choice">
              <button type="button" className={attendance === "yes" ? "active" : ""} onClick={() => setAttendance("yes")}>{t.yes}</button>
              <button type="button" className={attendance === "no" ? "active" : ""} onClick={() => setAttendance("no")}>{t.no}</button>
            </div>
            <button className="official-submit" disabled={sending}>{sending ? "…" : t.send}</button>
            {sent ? <p className="official-success">{t.sent}</p> : null}
          </form>
        </section>

        <section className="official-stage official-stage--finale" data-official-step="FINALE">
          <div className="official-panel official-panel--transparent">
            <p className="official-kicker">JUAN ALEXANDER · WILD ONE</p>
            <h2>{t.final}</h2>
            <p>26 · 09 · 2026 · 1:00 PM</p>
            <button className="official-enter" onClick={() => setPassOpen(true)}>{t.pass}</button>
          </div>
        </section>
      </div>

      {mapOpen ? <LivingMap expedition={expedition} locale={locale} current={step} onClose={() => setMapOpen(false)} /> : null}
      {passOpen ? (
        <div className="official-pass-overlay" role="dialog" aria-modal="true">
          <section className="official-pass">
            <button className="official-pass-close" onClick={() => setPassOpen(false)} aria-label={t.close}>×</button>
            <p className="official-kicker">JUAN ALEXANDER · WILD ONE</p>
            <div className="official-pass-photo"><img src={portrait} alt="Juan Alexander" /></div>
            <div className="official-pass-animal" style={{ color: role.accent }}><AnimalGlyph animal={expedition.animalKey} title={role.animal[locale]} /></div>
            <h2>{name.trim() || (locale === "es" ? "EXPLORADOR" : "EXPLORER")}</h2>
            <p>{role.role[locale]} · {role.route[locale]}</p>
            <strong>26 SEPTIEMBRE 2026 · 1:00 PM</strong>
            <span>SAN MIGUEL · EL SALVADOR</span>
            <small>{expedition.code}</small>
          </section>
        </div>
      ) : null}
    </main>
  );
}
