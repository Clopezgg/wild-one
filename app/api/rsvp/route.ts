import { NextResponse } from "next/server";

const headers={"Cache-Control":"no-store, private","X-Robots-Tag":"noindex, nofollow, noarchive"};
const EDGE_URL="https://sqchlnhkceztcznkjctg.supabase.co/functions/v1/birthday-rsvp";

export async function POST(request:Request){
  try{
    const body=await request.json();
    const r=await fetch(EDGE_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),cache:"no-store"});
    const data=await r.json();
    return NextResponse.json(data,{status:r.status,headers});
  }catch{
    return NextResponse.json({error:"Error interno"},{status:500,headers});
  }
}
