import { eventConfig } from "@/lib/eventConfig";

export default function HomePage() {
  return (
    <main className="invitation-canvas">
      <div className="ambient ambient-a" aria-hidden="true" />
      <div className="ambient ambient-b" aria-hidden="true" />
      <article className="luxury-card">
        <div className="card-border" aria-hidden="true" />
        <header className="card-header">
          <span>C · A</span>
          <span>UNA NOCHE</span>
        </header>

        <div className="crest" aria-hidden="true">
          <span>C</span><i>·</i><span>A</span>
        </div>

        <p className="card-eyebrow">UNA FECHA · DOS HISTORIAS</p>
        <div className="gold-line"><b /></div>

        <h1 className="display card-title">
          CÁNDIDA <em>&amp;</em><br />ALBERTO
        </h1>

        <p className="card-intro">
          Una noche para celebrar<br />dos historias, dos edades y una fecha especial.
        </p>

        <div className="date-lockup">
          <div className="date-main">
            <strong>03</strong>
            <span>OCTUBRE<br /><b>2026</b></span>
          </div>
          <div className="date-rule" />
          <div className="date-time">
            <small>SÁBADO</small>
            <strong>8:00 PM</strong>
          </div>
        </div>

        <div className="names-row">
          <div><small>CELEBRAMOS A</small><strong>CÁNDIDA</strong><span>66 AÑOS</span></div>
          <i />
          <div><small>CELEBRAMOS A</small><strong>ALBERTO</strong><span>38 AÑOS</span></div>
        </div>

        <div className="venue">
          <span className="pin">⌖</span>
          <div><small>LA CELEBRACIÓN</small><strong>8261 SW 8th St</strong><span>North Lauderdale, FL 33068</span></div>
        </div>

        <a className="card-button" href={eventConfig.maps} target="_blank" rel="noreferrer">
          VER UBICACIÓN <b>↗</b>
        </a>

        <p className="card-note">Una fecha. Dos historias. Un recuerdo para siempre.</p>

        <footer className="card-footer">
          <span>03 · 10 · 26</span>
          <b>C · A</b>
          <span>UNA FECHA · DOS HISTORIAS</span>
        </footer>
      </article>
    </main>
  );
}
