import type { AnimalKey } from "./safariRoles";

export type Locale = "en" | "es";
export type Attendance = "yes" | "no";

export type Expedition = {
  id: string;
  token: string;
  code: string;
  animalKey: AnimalKey;
  locale: Locale;
  guestName: string;
  attendance: Attendance | null;
  leaves: number[];
  calendarSaved: boolean;
  rank: "EXPLORER" | "GOLDEN EXPLORER";
  journeyVersion: string;
};

export type JourneyStep =
  | "ENTER"
  | "ANIMAL_REVEAL"
  | "MAP"
  | "TRAIL"
  | "CELEBRATION"
  | "COORDINATES"
  | "SAFARI_CHIC"
  | "CALENDAR"
  | "COUNTDOWN"
  | "QUEST"
  | "RSVP"
  | "PASS"
  | "FINALE";

