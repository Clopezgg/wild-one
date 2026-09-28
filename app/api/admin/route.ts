const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, character => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" })[character]!);

export async function GET(request: Request) {
  const supplied = request.headers.get("x-admin-token") || "";
  const expected = process.env.BIRTHDAY_ADMIN_TOKEN || "";
  const common = { "Cache-Control":"no-store, private", "X-Robots-Tag":"noindex, nofollow, noarchive" };
  if (!expected || !supplied || supplied.length < 24 || supplied !== expected) return new Response("No autorizado",{status:401,headers:common});

  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return new Response("Servicio no configurado",{status:503,headers:common});

  const response = await fetch(base + "/rest/v1/birthday_invitations?select=token,honoree,max_guests,guest_name,attendance,party_size,message,updated_at&order=honoree,token",
    {headers:{apikey:key,Authorization:`Bearer ${key}`},cache:"no-store"});
  if (!response.ok) return new Response("Error de base de datos",{status:502,headers:common});

  const rows = await response.json() as Array<Record<string,unknown>>;
  const body = rows.map(row => `<tr><td><code>${escapeHtml(row.token)}</code></td><td>${row.honoree==="candida"?"Cándida":"Alberto"}</td><td>${escapeHtml(row.guest_name||"—")}</td><td>${row.attendance===true?"Sí":row.attendance===false?"No":"Pendiente"}</td><td>${escapeHtml(row.party_size??"—")}</td><td>${escapeHtml(row.message||"")}</td></tr>`).join("");
  const candida=rows.filter(x=>x.honoree==="candida").length, alberto=rows.filter(x=>x.honoree==="alberto").length, confirmed=rows.filter(x=>x.attendance===true).length;
  return new Response(`<!doctype html><html lang="es"><head><meta name="robots" content="noindex,nofollow,noarchive"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin · C · A</title><style>body{margin:0;background:#080a10;color:#eee;font:14px Arial}.w{max-width:1200px;margin:auto;padding:28px}table{width:100%;border-collapse:collapse;margin-top:22px}th,td{text-align:left;padding:9px;border-bottom:1px solid #263044}code{color:#d4b36a}</style></head><body><div class="w"><div style="color:#d4b36a;letter-spacing:.2em">ÁREA PRIVADA · C · A</div><h1 style="font:52px Georgia">Cándida & Alberto</h1><p>${rows.length} invitaciones · ${candida} Cándida · ${alberto} Alberto · ${confirmed} confirmadas</p><table><thead><tr><th>Token</th><th>Persona</th><th>Invitado</th><th>RSVP</th><th>Lugares</th><th>Mensaje</th></tr></thead><tbody>${body}</tbody></table></div></body></html>`,{headers:{"Content-Type":"text/html; charset=utf-8",...common}});
}
