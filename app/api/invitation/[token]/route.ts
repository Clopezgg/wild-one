import { NextResponse } from "next/server";

const headers = {
  "Cache-Control": "no-store, private",
  "X-Robots-Tag": "noindex, nofollow, noarchive"
};

const validToken = (value: string) => /^[a-z0-9]{16,40}$/.test(value);

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token: raw } = await params;
  const token = String(raw || "").toLowerCase();
  if (!validToken(token)) return NextResponse.json({ error: "Invitación no válida" }, { status: 400, headers });

  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return NextResponse.json({ error: "Servicio temporalmente no disponible" }, { status: 503, headers });

  const response = await fetch(
    base + "/rest/v1/birthday_invitations?select=id,token,honoree,max_guests,guest_name,attendance,party_size,message&token=eq." +
      encodeURIComponent(token) + "&limit=1",
    { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" }
  );

  if (!response.ok) return NextResponse.json({ error: "No fue posible abrir la invitación" }, { status: 502, headers });
  const rows = (await response.json()) as unknown[];
  if (!rows.length) return NextResponse.json({ error: "Invitación no encontrada" }, { status: 404, headers });
  return NextResponse.json({ invitation: rows[0] }, { headers });
}
