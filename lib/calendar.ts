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
    "PRODID:-//NEXORA//Wild One//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:wild-one-20260920@${new URL(eventConfig.canonicalUrl).hostname}`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(eventConfig.startsAt)}`,
    `DTEND:${stamp(eventConfig.provisionalEnd)}`,
    `SUMMARY:${escapeIcs("Alexis Alessandro — Wild One")}`,
    `LOCATION:${escapeIcs(eventConfig.address.full)}`,
    `DESCRIPTION:${escapeIcs("A daylight magical safari celebration.")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

