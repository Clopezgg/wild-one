import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.0";

const animals = ["lion", "elephant", "giraffe", "monkey", "parrot", "zebra", "leopard"] as const;
const encoder = new TextEncoder();

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
}

async function hash(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function validToken(value: unknown): value is string {
  return typeof value === "string" && value.length >= 32 && value.length <= 128 && /^[A-Za-z0-9_-]+$/.test(value);
}

function cleanName(value: unknown) {
  return typeof value === "string" ? value.replace(/[<>\u0000-\u001f]/g, "").replace(/\s+/g, " ").trim().slice(0, 80) : "";
}

function publicRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    code: row.explorer_code,
    animalKey: row.animal_key,
    locale: row.locale,
    guestName: row.guest_name ?? "",
    attendance: row.rsvp_status,
    leaves: row.golden_leaves ?? [],
    calendarSaved: row.calendar_saved,
    rank: row.rank,
    journeyVersion: row.journey_version,
    persistent: true,
  };
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return json({ error: "Service unavailable" }, 503);
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || typeof body.action !== "string") return json({ error: "Invalid request" }, 400);

  if (body.action === "recover") {
    const code = typeof body.explorerCode === "string" ? body.explorerCode.toUpperCase() : "";
    if (!/^WILD-[A-F0-9]{8}$/.test(code) || !validToken(body.newToken)) return json({ error: "Invalid recovery" }, 400);
    const { data: row } = await db.from("wild_one_guest_expeditions").select("*").eq("explorer_code", code).maybeSingle();
    if (!row) return json({ error: "Not found" }, 404);
    const { data: updated, error } = await db.from("wild_one_guest_expeditions").update({ guest_token_hash: await hash(body.newToken), last_seen_at: new Date().toISOString() }).eq("id", row.id).select("*").single();
    return error ? json({ error: "Recovery failed" }, 503) : json(publicRow(updated));
  }

  if (!validToken(body.token)) return json({ error: "Invalid expedition token" }, 401);
  const tokenHash = await hash(body.token);

  if (body.action === "get") {
    const locale = body.locale === "es" ? "es" : "en";
    const { data: existing } = await db.from("wild_one_guest_expeditions").select("*").eq("guest_token_hash", tokenHash).maybeSingle();
    if (existing) {
      await db.from("wild_one_guest_expeditions").update({ locale, last_seen_at: new Date().toISOString() }).eq("id", existing.id);
      return json(publicRow(existing));
    }
    const bytes = crypto.getRandomValues(new Uint8Array(4));
    const animal = animals[bytes[0] % animals.length];
    const code = `WILD-${Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
    const { data, error } = await db.from("wild_one_guest_expeditions").insert({ guest_token_hash: tokenHash, explorer_code: code, animal_key: animal, role_key: animal, route_key: animal, locale, journey_version: "living-safari-v5" }).select("*").single();
    return error ? json({ error: "Creation failed" }, 503) : json(publicRow(data));
  }

  if (body.action === "update") {
    const patch = (body.patch && typeof body.patch === "object" ? body.patch : {}) as Record<string, unknown>;
    const leaves = Array.isArray(patch.leaves) ? [...new Set(patch.leaves.filter((value): value is number => Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 3))].sort() : undefined;
    const update = {
      ...(patch.locale === "en" || patch.locale === "es" ? { locale: patch.locale } : {}),
      ...(cleanName(patch.guestName).length >= 2 ? { guest_name: cleanName(patch.guestName) } : {}),
      ...(patch.attendance === "yes" || patch.attendance === "no" || patch.attendance === null ? { rsvp_status: patch.attendance } : {}),
      ...(leaves ? { golden_leaves: leaves, rank: leaves.length === 3 ? "GOLDEN EXPLORER" : "EXPLORER" } : {}),
      ...(typeof patch.calendarSaved === "boolean" ? { calendar_saved: patch.calendarSaved } : {}),
      updated_at: new Date().toISOString(), last_seen_at: new Date().toISOString(),
    };
    const { error } = await db.from("wild_one_guest_expeditions").update(update).eq("guest_token_hash", tokenHash);
    return error ? json({ error: "Update failed" }, 503) : json({ saved: true });
  }

  if (body.action === "rsvp") {
    const payload = (body.payload && typeof body.payload === "object" ? body.payload : {}) as Record<string, unknown>;
    const guestName = cleanName(payload.guestName);
    const attendance = payload.attendance;
    const locale = payload.locale === "es" ? "es" : "en";
    const animal = typeof payload.animalKey === "string" && animals.includes(payload.animalKey as typeof animals[number]) ? payload.animalKey : null;
    const leaves = Array.isArray(payload.leaves) ? payload.leaves.filter((value) => Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 3) : [];
    if (guestName.length < 2 || (attendance !== "yes" && attendance !== "no") || !animal) return json({ error: "Invalid RSVP" }, 400);
    const { data: expedition } = await db.from("wild_one_guest_expeditions").select("id").eq("guest_token_hash", tokenHash).maybeSingle();
    if (expedition) await db.from("wild_one_guest_expeditions").update({ guest_name: guestName, rsvp_status: attendance, golden_leaves: leaves, rank: leaves.length === 3 ? "GOLDEN EXPLORER" : "EXPLORER", updated_at: new Date().toISOString() }).eq("id", expedition.id);
    const { error } = await db.from("wild_one_rsvps").insert({ guest_name: guestName, attendance, locale, event_slug: "alexis-wild-one", animal_key: animal, animal_role: String(payload.role ?? "").slice(0, 80), route_name: String(payload.route ?? "").slice(0, 80), golden_leaves: leaves.length, journey_version: "living-safari-v5", guest_expedition_id: expedition?.id ?? null });
    return error ? json({ error: "RSVP failed" }, 503) : json({ saved: true });
  }

  return json({ error: "Unknown action" }, 400);
});

