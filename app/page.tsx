import { eventConfig } from "@/lib/eventConfig";

function Spark({ className = "" }: { className?: string }) {
  return <span className={"spark " + className} aria-hidden="true">✦</span>;
}

export default function HomePage() {
  return (
    <main className="landing">
      <section className="landing-hero">
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
        <Spark className="spark-a" /><Spark className="spark-b" />
        <div className="hero-content">
          <div className="eyebrow reveal">C · A — UNA NOCHE</div>
          <div className="monogram-mark reveal delay-1">C<span>·</span>A</div>
          <p className="hero-kicker reveal delay-2">UNA FECHA · DOS HISTORIAS</p>
          <h1 className="display landing-title reveal delay-2">CÁNDIDA <em>&amp;</em> ALBERTO</h1>
          <p className="hero-copy reveal delay-3">Una noche. Dos generaciones. Una celebración que merece ser recordada.</p>
          <div className="hero-rule reveal delay-3"><span /></div>
          <div className="hero-date reveal delay-4">
            <strong>03</strong><span>OCTUBRE<br /><small>2026</small></span><i /><span><small>SÁBADO</small><br />8:00 PM</span>
          </div>
          <a className="cta cta-large reveal delay-4" href="#celebracion">DESCUBRIR LA NOCHE <span>↓</span></a>
        </div>
        <div className="scroll-note">DESLIZA <span>↓</span></div>
      </section>

      <section className="editorial-section intro-section">
        <div className="section-number">01</div>
        <div className="editorial-grid">
          <div><div className="eyebrow">UNA FECHA ESPECIAL</div><h2 className="display section-title">Dos nombres.<br /><em>Una historia.</em></h2></div>
          <div className="editorial-copy"><div className="gold-mark">C · A</div><p>Hay celebraciones que reúnen a la familia. Y hay noches que se convierten en memoria.</p><p>El 3 de octubre, Cándida y Alberto comparten una noche creada para celebrar sus vidas, sus caminos y a las personas que los acompañan.</p></div>
        </div>
      </section>

      <section id="celebracion" className="celebration-section">
        <div className="section-number">02</div>
        <div className="celebration-head"><div className="eyebrow">LOS PROTAGONISTAS</div><h2 className="display section-title">DOS HISTORIAS</h2></div>
        <div className="people-grid">
          <article className="person-card candida"><div className="person-watermark">C</div><div className="person-top"><span>01</span><span>CELEBRAMOS</span></div><div className="person-bottom"><div className="person-name display">CÁNDIDA</div><div className="person-age"><strong>66</strong><span>AÑOS</span></div></div></article>
          <article className="person-card alberto"><div className="person-watermark">A</div><div className="person-top"><span>02</span><span>CELEBRAMOS</span></div><div className="person-bottom"><div className="person-name display">ALBERTO</div><div className="person-age"><strong>38</strong><span>AÑOS</span></div></div></article>
        </div>
      </section>

      <section className="editorial-section details-section">
        <div className="section-number">03</div>
        <div className="detail-frame">
          <div className="eyebrow">GUARDA LA FECHA</div>
          <div className="big-date display">03<span>·</span>10<span>·</span>26</div>
          <div className="detail-meta">
            <div><small>SÁBADO</small><strong>8:00 PM</strong></div>
            <div><small>UBICACIÓN</small><strong>8261 SW 8th St</strong><span>North Lauderdale, FL 33068</span></div>
          </div>
          <div className="detail-actions"><a className="cta" href={eventConfig.maps} target="_blank" rel="noreferrer">VER UBICACIÓN ↗</a><a className="text-link" href="/api/calendar">AGREGAR AL CALENDARIO ↓</a></div>
        </div>
      </section>

      <section className="final-section">
        <div className="final-glow" aria-hidden="true" />
        <div className="eyebrow">UNA FECHA · DOS HISTORIAS</div>
        <div className="final-mark display">C · A</div>
        <h2 className="display final-title">Nos vemos<br /><em>esa noche.</em></h2>
        <div className="hero-rule"><span /></div>
        <p>Las confirmaciones se realizan desde el enlace personal de cada invitado.</p>
      </section>
    </main>
  );
}
