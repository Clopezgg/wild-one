"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Locale = "en" | "es";
type Attendance = "yes" | "no";

const EVENT_TIME = new Date("2026-09-20T17:00:00-04:00").getTime();
const SUPABASE_URL = "https://sqchlnhkceztcznkjctg.supabase.co";
const SUPABASE_KEY = "sb_publishable_eyhxdWjBo_b65URp-R4l7w_4q4Ltxkc";
const MAP_URL = "https://www.google.com/maps/search/?api=1&query=581%20Kathy%20Lane%2C%20Margate%2C%20FL%2033068";
const WHATSAPP_NUMBER = "17546106574";

const words = {
  en: {
    gateTop: "ALEXIS ALESSANDRO'S FIRST ADVENTURE",
    gateTitle: "Something wild is waiting for you",
    enter: "OPEN INVITATION",
    switch: "ES",
    heroTop: "OUR LITTLE EXPLORER IS TURNING",
    one: "ONE",
    wild: "WILD ONE",
    date: "SEPTEMBER 20 · 2026 · 5:00 PM",
    journey: "BEGIN THE JOURNEY",
    storyTop: "365 DAYS OF WONDER",
    storyTitle: "One tiny explorer. One unforgettable year.",
    storyBody: "From the very first smile to every little discovery, Alexis Alessandro has filled an entire year with magic. Now the jungle is calling for his biggest adventure yet.",
    photoSoon: "Alexis photo coming soon",
    detailTop: "THE EXPEDITION",
    detailTitle: "Meet us in the wild",
    when: "WHEN",
    whenValue: "Sunday, September 20, 2026 · 5:00 PM",
    where: "WHERE",
    whereValue: "581 Kathy Lane · Margate, Florida 33068",
    dress: "SAFARI CHIC",
    dressValue: "Sage · Sand · Cream · Khaki · Earth tones",
    map: "OPEN MAP",
    countdown: "THE ADVENTURE BEGINS IN",
    days: "DAYS",
    hours: "HOURS",
    minutes: "MINUTES",
    seconds: "SECONDS",
    today: "THE ADVENTURE IS HERE",
    rsvpTop: "YOUR SAFARI PASS",
    rsvpTitle: "Will you join Alexis in the wild?",
    name: "GUEST NAME",
    placeholder: "Your name",
    yes: "I'LL BE THERE",
    no: "I CAN'T MAKE IT",
    submit: "GET MY SAFARI PASS",
    sending: "PREPARING YOUR PASS…",
    error: "We couldn't save your RSVP. You can still confirm instantly by WhatsApp.",
    whatsapp: "CONFIRM BY WHATSAPP",
    pass: "OFFICIAL SAFARI PASS",
    explorer: "EXPLORER",
    status: "STATUS",
    confirmed: "CONFIRMED",
    declined: "SENDING LOVE FROM AFAR",
    share: "SHARE INVITATION",
    gifts: "GIFTS",
    giftsBody: "Your presence is the greatest gift. Additional gift details can be added here later if desired.",
    finaleSmall: "ONE YEAR · ONE WILD ADVENTURE",
    finale: "See you in the wild",
  },
  es: {
    gateTop: "LA PRIMERA AVENTURA DE ALEXIS ALESSANDRO",
    gateTitle: "Algo salvaje te está esperando",
    enter: "ABRIR INVITACIÓN",
    switch: "EN",
    heroTop: "NUESTRO PEQUEÑO EXPLORADOR CUMPLE",
    one: "UNO",
    wild: "WILD ONE",
    date: "20 DE SEPTIEMBRE · 2026 · 5:00 PM",
    journey: "COMENZAR LA AVENTURA",
    storyTop: "365 DÍAS DE MAGIA",
    storyTitle: "Un pequeño explorador. Un año inolvidable.",
    storyBody: "Desde su primera sonrisa hasta cada pequeño descubrimiento, Alexis Alessandro ha llenado un año entero de magia. Ahora la selva lo llama para su aventura más grande.",
    photoSoon: "Aquí irá una foto de Alexis",
    detailTop: "LA EXPEDICIÓN",
    detailTitle: "Nos vemos en la selva",
    when: "CUÁNDO",
    whenValue: "Domingo 20 de septiembre de 2026 · 5:00 PM",
    where: "DÓNDE",
    whereValue: "581 Kathy Lane · Margate, Florida 33068",
    dress: "SAFARI CHIC",
    dressValue: "Salvia · Arena · Crema · Caqui · Tonos tierra",
    map: "ABRIR MAPA",
    countdown: "LA AVENTURA COMIENZA EN",
    days: "DÍAS",
    hours: "HORAS",
    minutes: "MINUTOS",
    seconds: "SEGUNDOS",
    today: "LA AVENTURA YA ESTÁ AQUÍ",
    rsvpTop: "TU SAFARI PASS",
    rsvpTitle: "¿Acompañarás a Alexis en esta aventura?",
    name: "NOMBRE DEL INVITADO",
    placeholder: "Tu nombre",
    yes: "AHÍ ESTARÉ",
    no: "NO PODRÉ ASISTIR",
    submit: "OBTENER MI SAFARI PASS",
    sending: "PREPARANDO TU PASE…",
    error: "No pudimos guardar tu confirmación. También puedes confirmar de inmediato por WhatsApp.",
    whatsapp: "CONFIRMAR POR WHATSAPP",
    pass: "SAFARI PASS OFICIAL",
    explorer: "EXPLORADOR",
    status: "ESTADO",
    confirmed: "CONFIRMADO",
    declined: "ENVIANDO CARIÑO DESDE LEJOS",
    share: "COMPARTIR INVITACIÓN",
    gifts: "REGALOS",
    giftsBody: "Tu presencia es el mejor regalo. Si más adelante desean agregar información de regalos, aparecerá aquí.",
    finaleSmall: "UN AÑO · UNA GRAN AVENTURA",
    finale: "Nos vemos en la selva",
  },
} as const;

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 280" aria-hidden="true">
      <path d="M88 270C48 218 20 153 27 86 32 41 57 11 88 4c33 13 56 43 61 84 7 63-18 128-61 182Z" fill="currentColor"/>
      <path d="M89 23v229M89 68 50 42M89 101l52-35M89 137 40-19M89 164l-49-29M89 205l38-25" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function Animal({ type, className = "" }: { type: "lion" | "giraffe" | "elephant"; className?: string }) {
  if (type === "lion") {
    return (
      <svg className={className} viewBox="0 0 220 220" aria-hidden="true">
        <circle cx="110" cy="108" r="78" fill="#b97843"/>
        <circle cx="110" cy="110" r="55" fill="#dba76c"/>
        <circle cx="91" cy="102" r="5" fill="#3d2b22"/><circle cx="129" cy="102" r="5" fill="#3d2b22"/>
        <path d="M103 120h14l-7 9Z" fill="#493126"/>
        <path d="M91 135q19 13 38 0" fill="none" stroke="#493126" strokeWidth="4" strokeLinecap="round"/>
        <path d="M73 74Q55 51 48 77M147 74q18-23 25 3" fill="#dba76c" stroke="#8d5a37" strokeWidth="4"/>
      </svg>
    );
  }
  if (type === "giraffe") {
    return (
      <svg className={className} viewBox="0 0 180 320" aria-hidden="true">
        <path d="M75 285c7-43 2-102 9-149 4-30 10-60 18-91 3-12 15-21 29-21 18 0 31 14 31 31 0 21-15 34-38 35-5 56 3 128 10 195Z" fill="#d9a15e"/>
        <path d="M111 21 104 5M139 22l8-17" stroke="#6d4c33" strokeWidth="7" strokeLinecap="round"/>
        <circle cx="145" cy="54" r="5" fill="#2f2a24"/>
        <path d="M103 50q-20 8-30-9" fill="none" stroke="#6d4c33" strokeWidth="5" strokeLinecap="round"/>
        <g fill="#8f603b"><ellipse cx="114" cy="76" rx="13" ry="9"/><ellipse cx="105" cy="117" rx="11" ry="18"/><ellipse cx="115" cy="160" rx="13" ry="10"/><ellipse cx="107" cy="205" rx="10" ry="17"/><ellipse cx="120" cy="246" rx="12" ry="9"/></g>
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 260 210" aria-hidden="true">
      <ellipse cx="126" cy="118" rx="83" ry="68" fill="#9b9185"/>
      <circle cx="190" cy="101" r="46" fill="#a69b8e"/>
      <ellipse cx="164" cy="100" rx="35" ry="45" fill="#81776d"/>
      <path d="M221 117c12 31 4 57-13 72-8 7-18-2-12-11 15-22 9-38-1-57Z" fill="#a69b8e"/>
      <circle cx="204" cy="91" r="4" fill="#292622"/>
      <path d="M73 157v42M108 168v31M154 166v33" stroke="#756d65" strokeWidth="18" strokeLinecap="round"/>
    </svg>
  );
}

function BalloonArch() {
  const balloons = [
    [8, 67, 72, "sage"], [14, 47, 58, "cream"], [22, 30, 68, "camel"], [34, 18, 54, "forest"], [47, 11, 62, "sand"],
    [61, 12, 54, "cream"], [73, 20, 68, "sage"], [84, 34, 56, "camel"], [91, 53, 70, "forest"], [94, 70, 55, "cream"],
    [4, 82, 52, "camel"], [97, 84, 50, "sage"], [27, 14, 38, "cream"], [78, 16, 40, "sand"], [11, 58, 37, "forest"],
  ];
  return (
    <div className="balloon-arch" aria-hidden="true">
      {balloons.map(([x, y, size, tone], i) => (
        <i key={i} className={`balloon balloon--${tone}`} style={{ left: `${x}%`, top: `${y}%`, width: size, height: size * 1.12, animationDelay: `${-i * 0.34}s` }} />
      ))}
    </div>
  );
}

export default function InvitationExperience() {
  const [locale, setLocale] = useState<Locale>("en");
  const [entered, setEntered] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("yes");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const t = words[locale];

  useEffect(() => {
    const saved = window.localStorage.getItem("wild-one-locale") as Locale | null;
    const detected: Locale = navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
    const next = saved === "en" || saved === "es" ? saved : detected;
    setLocale(next);
    document.documentElement.lang = next;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible"));
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
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
    const next = locale === "en" ? "es" : "en";
    setLocale(next);
    window.localStorage.setItem("wild-one-locale", next);
    document.documentElement.lang = next;
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

  const whatsappText = locale === "es"
    ? `Hola, confirmo mi asistencia al Wild One de Alexis Alessandro. Mi nombre es ${guestName.trim() || "_____"}.`
    : `Hi! I'm confirming my attendance for Alexis Alessandro's Wild One. My name is ${guestName.trim() || "_____"}.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

  async function shareInvitation() {
    if (navigator.share) {
      await navigator.share({ title: "Alexis Alessandro — Wild One", text: locale === "es" ? "Acompáñanos a la primera gran aventura de Alexis Alessandro." : "Join Alexis Alessandro's first wild adventure.", url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <main className="experience">
      <div className={`opening ${entered ? "opening--gone" : ""}`}>
        <div className="opening__glow" />
        <Leaf className="opening__leaf opening__leaf--1" />
        <Leaf className="opening__leaf opening__leaf--2" />
        <Leaf className="opening__leaf opening__leaf--3" />
        <Leaf className="opening__leaf opening__leaf--4" />
        <div className="opening__card">
          <div className="monogram"><span>A</span><small>1</small></div>
          <p className="micro">{t.gateTop}</p>
          <h1>{t.gateTitle}</h1>
          <div className="opening__rule"><i /><span>WILD ONE</span><i /></div>
          <button className="cta cta--gold" onClick={() => setEntered(true)}>{t.enter}</button>
        </div>
      </div>

      <button className="language" onClick={switchLocale} aria-label="Switch language">{t.switch}</button>

      <section className="hero" id="hero">
        <div className="hero__sun" />
        <div className="hero__mist" />
        <Leaf className="hero__leaf hero__leaf--a" />
        <Leaf className="hero__leaf hero__leaf--b" />
        <Leaf className="hero__leaf hero__leaf--c" />
        <Leaf className="hero__leaf hero__leaf--d" />
        <BalloonArch />
        <Animal type="giraffe" className="animal animal--giraffe" />
        <Animal type="lion" className="animal animal--lion" />
        <Animal type="elephant" className="animal animal--elephant" />

        <div className="hero__center">
          <p className="micro hero__micro">{t.heroTop}</p>
          <div className="hero__one">1</div>
          <h2>Alexis <span>Alessandro</span></h2>
          <div className="wild-mark">{t.wild}</div>
          <p className="hero__date">{t.date}</p>
          <a className="journey" href="#story">{t.journey}<span>↓</span></a>
        </div>
      </section>

      <section className="story" id="story">
        <div className="story__vine" aria-hidden="true" />
        <div className="story__copy reveal">
          <p className="micro micro--forest">{t.storyTop}</p>
          <h2>{t.storyTitle}</h2>
          <p>{t.storyBody}</p>
        </div>
        <div className="memory-grid">
          {["01", "02", "03"].map((number, i) => (
            <figure className={`memory-card memory-card--${i + 1} reveal`} key={number}>
              <div className="memory-card__art">
                <span className="memory-card__number">{number}</span>
                <Leaf className="memory-card__leaf" />
                {i === 0 && <Animal type="lion" className="memory-card__animal" />}
                {i === 1 && <Animal type="giraffe" className="memory-card__animal memory-card__animal--giraffe" />}
                {i === 2 && <Animal type="elephant" className="memory-card__animal" />}
              </div>
              <figcaption>{t.photoSoon}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="details">
        <div className="details__head reveal">
          <p className="micro">{t.detailTop}</p>
          <h2>{t.detailTitle}</h2>
        </div>
        <div className="details__cards">
          <article className="detail reveal"><span>01</span><p>{t.when}</p><h3>{t.whenValue}</h3></article>
          <article className="detail reveal"><span>02</span><p>{t.where}</p><h3>{t.whereValue}</h3><a href={MAP_URL} target="_blank" rel="noreferrer">{t.map} ↗</a></article>
          <article className="detail reveal"><span>03</span><p>{t.dress}</p><h3>{t.dressValue}</h3><div className="palette"><i/><i/><i/><i/><i/></div></article>
        </div>
      </section>

      <section className="countdown">
        <Leaf className="countdown__leaf countdown__leaf--l" />
        <Leaf className="countdown__leaf countdown__leaf--r" />
        <div className="countdown__inner reveal">
          <p className="micro">{remaining.total === 0 ? t.today : t.countdown}</p>
          {remaining.total > 0 && (
            <div className="clock">
              {[[remaining.days, t.days], [remaining.hours, t.hours], [remaining.minutes, t.minutes], [remaining.seconds, t.seconds]].map(([value, label]) => (
                <div key={String(label)}><strong>{pad(Number(value))}</strong><span>{label}</span></div>
              ))}
            </div>
          )}
          <div className="countdown__seal"><span>A</span><small>09·20·26</small></div>
        </div>
      </section>

      <section className="rsvp" id="rsvp">
        <div className="rsvp__illustration reveal">
          <BalloonArch />
          <Animal type="lion" className="rsvp__lion" />
          <div className="rsvp__one">1</div>
          <Leaf className="rsvp__leaf rsvp__leaf--1" />
          <Leaf className="rsvp__leaf rsvp__leaf--2" />
        </div>
        <div className="rsvp__panel reveal">
          {!submitted ? (
            <>
              <p className="micro micro--forest">{t.rsvpTop}</p>
              <h2>{t.rsvpTitle}</h2>
              <form onSubmit={submitRsvp}>
                <label htmlFor="guest">{t.name}</label>
                <input id="guest" required minLength={2} maxLength={120} value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder={t.placeholder} />
                <div className="choice">
                  <button type="button" className={attendance === "yes" ? "active" : ""} onClick={() => setAttendance("yes")}>{t.yes}</button>
                  <button type="button" className={attendance === "no" ? "active" : ""} onClick={() => setAttendance("no")}>{t.no}</button>
                </div>
                <button className="cta cta--forest" disabled={submitting}>{submitting ? t.sending : t.submit}</button>
                {error && <p className="form-error">{t.error}</p>}
                <a className="whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">{t.whatsapp} ↗</a>
              </form>
            </>
          ) : (
            <div className="safari-pass">
              <div className="safari-pass__top"><span>{t.pass}</span><strong>01</strong></div>
              <div className="safari-pass__name"><small>{t.explorer}</small><h2>{guestName}</h2></div>
              <div className="safari-pass__status"><small>{t.status}</small><strong>{attendance === "yes" ? t.confirmed : t.declined}</strong></div>
              <div className="safari-pass__event">ALEXIS ALESSANDRO · WILD ONE · 20.09.2026</div>
              <button className="cta cta--forest" onClick={shareInvitation}>{t.share}</button>
            </div>
          )}
        </div>
      </section>

      <section className="extras">
        <details className="reveal"><summary>{t.gifts}<span>+</span></summary><p>{t.giftsBody}</p></details>
      </section>

      <footer className="finale">
        <BalloonArch />
        <Animal type="giraffe" className="finale__giraffe" />
        <Animal type="elephant" className="finale__elephant" />
        <Animal type="lion" className="finale__lion" />
        <Leaf className="finale__leaf finale__leaf--1" />
        <Leaf className="finale__leaf finale__leaf--2" />
        <div className="finale__copy reveal">
          <p className="micro">{t.finaleSmall}</p>
          <h2>{t.finale}</h2>
          <div className="finale__name">ALEXIS ALESSANDRO</div>
        </div>
      </footer>
    </main>
  );
}
