import { z } from "zod";
import { safariRoles } from "./safariRoles";

const animalKeys = safariRoles.map((role) => role.key) as [string, ...string[]];

export const expeditionPatchSchema = z.object({
  locale: z.enum(["en", "es"]).optional(),
  guestName: z.string().trim().min(1).max(80).optional(),
  attendance: z.enum(["yes", "no"]).nullable().optional(),
  leaves: z.array(z.number().int().min(1).max(3)).max(3).optional(),
  calendarSaved: z.boolean().optional(),
});

export const recoverySchema = z.object({
  explorerCode: z.string().trim().toUpperCase().regex(/^WILD-[A-F0-9]{8}$/),
});

export const rsvpSchema = z.object({
  guestName: z.string().trim().min(2).max(80),
  attendance: z.enum(["yes", "no"]),
  locale: z.enum(["en", "es"]),
  animalKey: z.enum(animalKeys),
  role: z.string().trim().min(2).max(80),
  route: z.string().trim().min(2).max(80),
  leaves: z.array(z.number().int().min(1).max(3)).max(3),
  expeditionId: z.string().uuid().or(z.string().startsWith("local-")),
  journeyVersion: z.string().max(40),
});

export function cleanGuestName(value: string) {
  return value.replace(/[<>\u0000-\u001F]/g, "").replace(/\s+/g, " ").trim().slice(0, 80);
}

