const escapeIcs = (value: string) => value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
const stamp = (value: string) => new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export async function GET() {
  const start = "2026-10-03T20:00:00-04:00";
  const end = "2026-10-03T23:00:00-04:00";
  const ics = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//CANDIDA-ALBERTO//UNA-NOCHE//ES","CALSCALE:GREGORIAN","METHOD:PUBLISH","BEGIN:VEVENT",
    "UID:ca-una-noche-20261003@wild-one.vercel.app",`DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(start)}`,`DTEND:${stamp(end)}`,`SUMMARY:${escapeIcs("C · A — UNA NOCHE")}`,
    `LOCATION:${escapeIcs("8261 SW 8th St, North Lauderdale, FL 33068")}`,`DESCRIPTION:${escapeIcs("UNA FECHA · DOS HISTORIAS")}`,
    "END:VEVENT","END:VCALENDAR"
  ].join("\r\n");
  return new Response(ics,{headers:{"Content-Type":"text/calendar; charset=utf-8","Content-Disposition":'attachment; filename="candida-alberto-una-noche.ics"',"Cache-Control":"public, max-age=3600"}});
}
