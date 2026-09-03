import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { eventConfig } from "@/lib/eventConfig";
import { roleForKey, safariRoles, stableRole } from "@/lib/safariRoles";
import { expeditionPatchSchema, recoverySchema } from "@/lib/validation";
import { expeditionEdgeRequest, explorerCode, hasDirectSupabase, hasExpeditionStore, newGuestToken, supabaseRequest, tokenHash } from "@/lib/supabase/server";

export const runtime = "nodejs";
const COOKIE = "juan_alexander_expedition";

type Row = {
  id: string;
  animal_key: string;
  locale: "en" | "es";
  guest_name: string | null;
  rsvp_status: "yes" | "no" | null;
  golden_leaves: number[] | null;
  rank: string;
  calendar_saved: boolean;
  journey_version: string;
  explorer_code: string;
};

function publicExpedition(row: Row, token: string) {
  return {
    id: row.id,
    token,
    code: row.explorer_code,
    animalKey: roleForKey(row.animal_key).key,
    locale: row.locale,
    guestName: row.guest_name ?? "",
    attendance: row.rsvp_status,
    leaves: row.golden_leaves ?? [],
    calendarSaved: row.calendar_saved,
    rank: row.rank === "GOLDEN EXPLORER" ? "GOLDEN EXPLORER" : "EXPLORER",
    journeyVersion: row.journey_version,
    persistent: hasExpeditionStore,
  };
}

function localExpedition(token: string, locale: "en" | "es") {
  const role = stableRole(token);
  return publicExpedition({
    id: `local-${token.slice(0, 12)}`,
    animal_key: role.key,
    locale,
    guest_name: null,
    rsvp_status: null,
    golden_leaves: [],
    rank: "EXPLORER",
    calendar_saved: false,
    journey_version: eventConfig.journeyVersion,
    explorer_code: `WILD-${tokenHash(token).slice(0, 8).toUpperCase()}`,
  }, token);
}

async function getOrCreate(token: string, locale: "en" | "es") {
  if (!hasExpeditionStore) return localExpedition(token, locale);
  if (!hasDirectSupabase) {
    const row = await expeditionEdgeRequest<Omit<ReturnType<typeof localExpedition>, "token">>({ action: "get", token, locale });
    return { ...row, token };
  }
  const hash = tokenHash(token);
  const existing = await supabaseRequest<Row[]>(`wild_one_guest_expeditions?guest_token_hash=eq.${hash}&select=*`);
  if (existing[0]) {
    await supabaseRequest(`wild_one_guest_expeditions?guest_token_hash=eq.${hash}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ last_seen_at: new Date().toISOString(), locale, journey_version: eventConfig.journeyVersion }),
    });
    return publicExpedition({ ...existing[0], journey_version: eventConfig.journeyVersion }, token);
  }
  const role = safariRoles[randomBytes(1)[0] % safariRoles.length];
  const [created] = await supabaseRequest<Row[]>("wild_one_guest_expeditions", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      guest_token_hash: hash,
      animal_key: role.key,
      role_key: role.key,
      route_key: role.key,
      locale,
      explorer_code: explorerCode(),
      journey_version: eventConfig.journeyVersion,
    }),
  });
  return publicExpedition(created, token);
}

function responseWithCookie(body: unknown, token: string, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.VERCEL === "1",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365 * 2,
    path: "/",
  });
  return response;
}

export async function GET(request: Request) {
  const locale = new URL(request.url).searchParams.get("locale") === "en" ? "en" : "es";
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value ?? newGuestToken();
  try {
    return responseWithCookie(await getOrCreate(token, locale), token);
  } catch {
    return responseWithCookie(localExpedition(token, locale), token);
  }
}

export async function PATCH(request: Request) {
  const parsed = expeditionPatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid expedition update" }, { status: 400 });

  const jar = await cookies();
  const existingToken = jar.get(COOKIE)?.value;
  const token = existingToken ?? newGuestToken();
  const locale = parsed.data.locale ?? "es";

  if (!existingToken) {
    try {
      await getOrCreate(token, locale);
    } catch {
      return responseWithCookie({ saved: false, localOnly: true }, token);
    }
  }

  if (!hasExpeditionStore) return responseWithCookie({ saved: false, localOnly: true }, token);

  const leaves = parsed.data.leaves ? [...new Set(parsed.data.leaves)].sort() : undefined;
  const patch = {
    ...(parsed.data.locale && { locale: parsed.data.locale }),
    ...(parsed.data.guestName && { guest_name: parsed.data.guestName }),
    ...(parsed.data.attendance !== undefined && { rsvp_status: parsed.data.attendance }),
    ...(leaves && { golden_leaves: leaves, rank: leaves.length === 3 ? "GOLDEN EXPLORER" : "EXPLORER" }),
    ...(parsed.data.calendarSaved !== undefined && { calendar_saved: parsed.data.calendarSaved }),
    journey_version: eventConfig.journeyVersion,
    last_seen_at: new Date().toISOString(),
  };

  try {
    if (!hasDirectSupabase) {
      await expeditionEdgeRequest({ action: "update", token, patch: parsed.data });
      return responseWithCookie({ saved: true }, token);
    }
    await supabaseRequest(`wild_one_guest_expeditions?guest_token_hash=eq.${tokenHash(token)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(patch),
    });
    return responseWithCookie({ saved: true }, token);
  } catch {
    return responseWithCookie({ saved: false }, token, { status: 503 });
  }
}

export async function POST(request: Request) {
  const parsed = recoverySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !hasExpeditionStore) return NextResponse.json({ error: "Explorer code unavailable" }, { status: 400 });
  try {
    if (!hasDirectSupabase) {
      const token = newGuestToken();
      const row = await expeditionEdgeRequest<Omit<ReturnType<typeof localExpedition>, "token">>({ action: "recover", explorerCode: parsed.data.explorerCode, newToken: token });
      return responseWithCookie({ ...row, token }, token);
    }
    const rows = await supabaseRequest<Row[]>(`wild_one_guest_expeditions?explorer_code=eq.${parsed.data.explorerCode}&select=*`);
    if (!rows[0]) return NextResponse.json({ error: "Explorer code not found" }, { status: 404 });
    const token = newGuestToken();
    await supabaseRequest(`wild_one_guest_expeditions?id=eq.${rows[0].id}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ guest_token_hash: tokenHash(token), journey_version: eventConfig.journeyVersion, last_seen_at: new Date().toISOString() }),
    });
    return responseWithCookie(publicExpedition({ ...rows[0], journey_version: eventConfig.journeyVersion }, token), token);
  } catch {
    return NextResponse.json({ error: "Explorer recovery failed" }, { status: 503 });
  }
}