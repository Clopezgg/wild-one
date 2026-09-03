import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { rsvpSchema, cleanGuestName } from "@/lib/validation";
import { expeditionEdgeRequest, hasDirectSupabase, hasRsvpStore, supabaseRequest, tokenHash } from "@/lib/supabase/server";

const attempts = new Map<string, { count: number; reset: number }>();

function limited(request: Request) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.reset < now) {
    attempts.set(key, { count: 1, reset: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 8;
}

export async function POST(request: Request) {
  if (limited(request)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const parsed = rsvpSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid RSVP" }, { status: 400 });
  if (!hasRsvpStore) return NextResponse.json({ error: "RSVP store unavailable", whatsappFallback: true }, { status: 503 });
  const data = { ...parsed.data, guestName: cleanGuestName(parsed.data.guestName) };
  const token = (await cookies()).get("wild_one_expedition")?.value;
  try {
    if (!hasDirectSupabase) {
      if (!token) throw new Error("Missing expedition token");
      await expeditionEdgeRequest({ action: "rsvp", token, payload: data });
      return NextResponse.json({ saved: true });
    }
    if (token && !data.expeditionId.startsWith("local-")) {
      await supabaseRequest(`wild_one_guest_expeditions?guest_token_hash=eq.${tokenHash(token)}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ guest_name: data.guestName, rsvp_status: data.attendance, golden_leaves: data.leaves, rank: data.leaves.length === 3 ? "GOLDEN EXPLORER" : "EXPLORER", updated_at: new Date().toISOString() }),
      });
    }
    const fullRow = {
      guest_name: data.guestName,
      attendance: data.attendance,
      locale: data.locale,
      animal_key: data.animalKey,
      animal_role: data.role,
      route_name: data.route,
      guest_expedition_id: data.expeditionId.startsWith("local-") ? null : data.expeditionId,
      golden_leaves: data.leaves.length,
      journey_version: data.journeyVersion,
    };
    try {
      await supabaseRequest("wild_one_rsvps", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(fullRow) }, "public");
    } catch {
      await supabaseRequest("wild_one_rsvps", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ guest_name: data.guestName, attendance: data.attendance }) }, "public");
    }
    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json({ error: "RSVP store unavailable", whatsappFallback: true }, { status: 503 });
  }
}
