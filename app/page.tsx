import { eventConfig } from "@/lib/eventConfig";

export default function HomePage() {
  return (
    <main className="section center">
      <div className="section-inner">
        <div className="eyebrow">{eventConfig.title}</div>
        <h1 className="display hero-title">CÁNDIDA<br />&amp; ALBERTO</h1>
        <p className="eyebrow">{eventConfig.tagline}</p>
        <div className="light-line" />
        <p className="intro">Una noche para celebrar dos historias, dos edades y una fecha especial.</p>
        <div className="event-card">
          <div><strong>03</strong><span>OCTUBRE 2026</span></div>
          <div><strong>8:00 PM</strong><span>SÁBADO</span></div>
        </div>
        <p className="intro">{eventConfig.address}</p>
        <a className="button" href={eventConfig.maps} target="_blank" rel="noreferrer">VER UBICACIÓN</a>
        <p className="muted intro">Las confirmaciones de asistencia se realizan desde el enlace personal de cada invitado.</p>
      </div>
    </main>
  );
}
