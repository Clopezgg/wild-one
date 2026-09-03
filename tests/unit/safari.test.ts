import { describe, expect, it } from "vitest";
import { createIcs } from "@/lib/calendar";
import { roleForKey, safariRoles, stableRole } from "@/lib/safariRoles";
import { expeditionPatchSchema, rsvpSchema } from "@/lib/validation";

describe("safari identity", () => {
  it("keeps an animal stable for the same opaque token", () => {
    expect(stableRole("fixed-private-token").key).toBe(stableRole("fixed-private-token").key);
  });

  it("contains seven visually routed companions including a real zebra", () => {
    expect(safariRoles).toHaveLength(7);
    expect(safariRoles.map((role) => role.key)).toEqual(["lion", "elephant", "giraffe", "monkey", "parrot", "zebra", "leopard"]);
    expect(new Set(safariRoles.map((role) => role.terrain)).size).toBe(7);
    expect(roleForKey("zebra").route.en).toBe("Stripe Trail");
  });
});

describe("payload validation", () => {
  it("rejects unsafe guest names and impossible leaves", () => {
    expect(rsvpSchema.safeParse({ guestName: "<", attendance: "yes" }).success).toBe(false);
    expect(expeditionPatchSchema.safeParse({ leaves: [4] }).success).toBe(false);
  });

  it("accepts a complete RSVP contract", () => {
    expect(rsvpSchema.safeParse({ guestName: "Sofia Lopez", attendance: "yes", locale: "es", animalKey: "zebra", role: "Explorador de Rayas", route: "Sendero de Rayas", leaves: [1, 3], expeditionId: "local-123", journeyVersion: "living-safari-v5" }).success).toBe(true);
  });
});

describe("calendar", () => {
  it("publishes only the confirmed start while isolating the provisional end", () => {
    const ics = createIcs();
    expect(ics).toContain("DTSTART:20260920T210000Z");
    expect(ics).toContain("DTEND:20260921T000000Z");
    expect(ics).toContain("581 Kathy Lane");
  });
});

