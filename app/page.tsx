import { eventConfig } from "@/lib/eventConfig";

function Ornament({ className = "" }: { className?: string }) {
  return <span className={"ornament " + className} aria-hidden="true">✦</span>;
}

export default function HomePage() {
  return (
    <main className="card-site">
      <section className="master-card">
        <div className="silk silk-one" aria-hidden="true" />
        <div className="silk silk-two" aria-hidden="true" />
        <div className="bokeh bokeh-one" aria-hidden="true" />
        <div className="bokeh bokeh-two" aria-hidden="true" />
        <Ornament className="ornament-one" /><Ornament className="ornament-two" />

        <div className="card-frame">
          <div className="card-top">
            <span className="micro">C · A</span>
            <span className="micro">UNA NOCHE</span>
          </div>

          <div className="seal"><span>C</span><i>·</i><span>A</span></div>

          <p className="kicker">UNA FECHA · DOS HISTORIAS</p>
          <div className="light-motif"><span /></div>

          <h1 className="display master-title">CÁNDIDA <em>&amp;</em><br />ALBERTO</h1>

          <p className="master-subtitle">Dos historias que se encuentran<br />en una noche para recordar.</p>

          <div className="date-plaque">
            <span className="date-day">03</span>
            <div><small>SÁBADO</small><strong>OCTUBRE 2026</strong></div>
            <span className="date-divider" />
            <div><small>A LAS</small><strong>8:00 PM</strong></div>
          </div>

          <div className="honorees">
            <div><span className="initial">C</span><div><small>CELEBRAMOS A</small><strong>CÁNDIDA</strong><em>66 AÑOS</em></div></div>
            <span className="honoree-line" />
            <div><span className="initial">A</span><div><small>CELEBRAMOS A</small><strong>ALBERTO</strong><em>38 AÑOS</em></div></div>
          </div>

          <div className="location-block">
            <span className="location-icon">⌖</span>
            <div><small>LA NOCHE SERÁ EN</small><strong>8261 SW 8th St</strong><span>North Lauderdale, FL 33068</span></div>
          </div>

          <div className="card-actions">
            <a className="gold-button" href={eventConfig.maps} target="_blank" rel="noreferrer">VER UBICACIÓN <b>↗</b></a>
            <a className="gold-text" href="/api/calendar">AGREGAR AL CALENDARIO ↓</a>
          </div>

          <div className="card-message">
            <Ornament />
            <p>Una noche para celebrar dos historias,<br />dos edades y una fecha especial.</p>
            <Ornament />
          </div>

          <div className="card-footer">
            <span>03 · 10 · 26</span>
            <span className="footer-monogram">C · A</span>
            <span>UNA FECHA · DOS HISTORIAS</span>
          </div>
        </div>
      </section>
    </main>
  );
}
