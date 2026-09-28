import { NextResponse } from "next/server";

const headers={"Cache-Control":"no-store, private","X-Robots-Tag":"noindex, nofollow, noarchive"};
const validToken=(value:string)=>/^[a-z0-9]{16,40}$/.test(value);
const EDGE_URL="https://sqchlnhkceztcznkjctg.supabase.co/functions/v1/birthday-invitation";

export async function GET(_request:Request,{params}:{params:Promise<{token:string}>}){
  const {token:raw}=await params;
  const token=String(raw||"").toLowerCase();
  if(!validToken(token)) return NextResponse.json({error:"Invitación no válida"},{status:400,headers});
  try{
    const r=await fetch(EDGE_URL+"?token="+encodeURIComponent(token),{cache:"no-store"});
    const data=await r.json();
    return NextResponse.json(data,{status:r.status,headers});
  }catch{
    return NextResponse.json({error:"No fue posible abrir la invitación"},{status:502,headers});
  }
}
