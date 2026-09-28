import { NextResponse } from "next/server";

const headers = { "Cache-Control": "no-store, private", "X-Robots-Tag": "noindex, nofollow, noarchive" };
const clean = (value: string) => String(value ?? "").replace(/[<>\u0000-\u001F]/g, "").replace(/\s+/g, " ").trim();
const validToken = (value: string) => /^[a-z0-9]{16,40}$/.test(value);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const token = clean(String(body.token || "")).toLowerCase();
    if (!validToken(token)) return NextResponse.json({ error: "Invitación no válida" }, { status: 400, headers });

    const base = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!base || !key) return NextResponse.json({ error: "Servicio temporalmente no disponible" }, { status: 503, headers });

    const lookup = await fetch(
      base + "/rest/v1/birthday_invitations?select=token,honoree,max_guests&token=eq." +
        encodeURIComponent(token) + "&limit=1",
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" }
    );
    if (!lookup.ok) return NextResponse.json({ error: "No fue posible validar la invitación" }, { status: 502, headers });

    const rows = (await lookup.json()) as Array<{ token: string; honoree: string; max_guests: number }>;
    const invitation = rows[0];
    if (!invitation) return NextResponse.json({ error: "Invitación no encontrada" }, { status: 404, headers });
    if (!["candida", "alberto"].includes(invitation.honoree)) return NextResponse.json({ error: "Invitación no válida" }, { status: 409, headers });

    const attendance = body.attendance === true || body.attendance === false ? body.attendance : null;
    if (attendance === null) return NextResponse.json({ error: "Selecciona una respuesta" }, { status: 400, headers });

    const guestName = clean(String(body.guest_name || "")).slice(0, 100);
    if (guestName.length < 2) return NextResponse.json({ error: "Escribe tu nombre" }, { status: 400, headers });

    const requestedParty = Math.trunc(Number(body.party_size) || 1);
    const partySize = Math.max(1, Math.min(invitation.max_guests, requestedParty));
    const message = clean(String(body.message || "")).slice(0, 500);

    const write = await fetch(
      base + "/rest/v1/birthday_invitations?token=eq." + encodeURIComponent(token),
      {
        method: "PATCH",
        headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify({ guest_name: guestName, attendance, party_size: attendance ? partySize : 0, message, updated_at: new Date().toISOString() })
      }
    );
    if (!write.ok) return NextResponse.json({ error: "No fue posible guardar la respuesta" }, { status: 502, headers });
    const updated = (await write.json()) as unknown[];
    return NextResponse.json({ invitation: updated[0] }, { headers });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500, headers });
  }
}
