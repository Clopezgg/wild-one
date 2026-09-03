import { eventConfig } from "./eventConfig";

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

function stamp(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function createIcs() {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NEXORA//Juan Alexander Wild One//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:juan-alexander-wild-one-20260926@${new URL(eventConfig.canonicalUrl).hostname}`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(eventConfig.startsAt)}`,
    `DTEND:${stamp(eventConfig.provisionalEnd)}`,
    `SUMMARY:${escapeIcs("Juan Alexander — Wild One")}`,
    `LOCATION:${escapeIcs(eventConfig.address.full)}`,
    `DESCRIPTION:${escapeIcs("Juan Alexander te invita a celebrar su primer cumpleaños. ¡Te esperamos, no faltes!")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
