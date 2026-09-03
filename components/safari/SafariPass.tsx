"use client";

import { useRef, useState } from "react";
import type { Expedition, Locale } from "@/lib/types";
import { roleForKey } from "@/lib/safariRoles";
import { AnimalGlyph } from "./AnimalGlyph";

function safeName(name:string){return name.replace(/[<>\u0000-\u001f]/g,"").trim().slice(0,80)||"EXPLORER"}

function roundedRect(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath()}

function drawLeaf(ctx:CanvasRenderingContext2D,x:number,y:number,s:number,rotation:number,color:string){ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(0,-s);ctx.bezierCurveTo(s*.9,-s*.45,s*.82,s*.7,0,s);ctx.bezierCurveTo(-s*.82,s*.7,-s*.9,-s*.45,0,-s);ctx.fill();ctx.strokeStyle="rgba(255,255,255,.22)";ctx.lineWidth=Math.max(1,s*.035);ctx.beginPath();ctx.moveTo(0,-s*.72);ctx.lineTo(0,s*.72);ctx.stroke();ctx.restore()}

function drawAnimalMark(ctx:CanvasRenderingContext2D,key:string,cx:number,cy:number,scale:number,accent:string){
  ctx.save();ctx.translate(cx,cy);ctx.scale(scale,scale);ctx.lineCap="round";ctx.lineJoin="round";
  const cream="#fff6e5",dark="#2b352d",brown="#6f5039";
  ctx.fillStyle=accent;ctx.strokeStyle=dark;ctx.lineWidth=8;
  const head=(rx:number,ry:number)=>{ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);ctx.fill()};
  if(key==="giraffe"){
    ctx.fillStyle=accent;roundedRect(ctx,-36,-72,72,155,34);ctx.fill();ctx.beginPath();ctx.ellipse(0,-82,72,62,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=brown;[-38,-9,24].forEach((x,i)=>{ctx.beginPath();ctx.arc(x,-42+i*25,10+i*2,0,Math.PI*2);ctx.fill()});ctx.fillStyle=accent;ctx.fillRect(-32,-154,18,62);ctx.fillRect(14,-154,18,62);ctx.fillStyle=brown;ctx.beginPath();ctx.arc(-23,-155,14,0,Math.PI*2);ctx.arc(23,-155,14,0,Math.PI*2);ctx.fill();
  }else if(key==="elephant"){
    head(86,72);ctx.beginPath();ctx.ellipse(-78,-2,47,62,-.2,0,Math.PI*2);ctx.ellipse(78,-2,47,62,.2,0,Math.PI*2);ctx.fill();ctx.lineWidth=28;ctx.strokeStyle=accent;ctx.beginPath();ctx.moveTo(0,35);ctx.bezierCurveTo(8,86,14,118,-16,148);ctx.stroke();
  }else if(key==="lion"){
    ctx.fillStyle="#8d5d38";for(let i=0;i<12;i++){const a=i/12*Math.PI*2;ctx.beginPath();ctx.arc(Math.cos(a)*67,Math.sin(a)*67,35,0,Math.PI*2);ctx.fill()}ctx.fillStyle=accent;head(72,68);
  }else if(key==="monkey"){
    ctx.fillStyle=accent;head(78,72);ctx.fillStyle="#d5a276";ctx.beginPath();ctx.ellipse(0,8,58,48,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=accent;ctx.lineWidth=20;ctx.beginPath();ctx.arc(88,60,58,-1.2,2.2);ctx.stroke();
  }else if(key==="parrot"){
    ctx.fillStyle=accent;ctx.beginPath();ctx.ellipse(0,15,64,95,-.15,0,Math.PI*2);ctx.fill();ctx.fillStyle="#d8ad4c";ctx.beginPath();ctx.arc(0,-78,50,0,Math.PI*2);ctx.fill();ctx.fillStyle=brown;ctx.beginPath();ctx.moveTo(35,-82);ctx.lineTo(88,-62);ctx.lineTo(35,-45);ctx.closePath();ctx.fill();
  }else if(key==="zebra"){
    ctx.fillStyle=cream;head(72,72);ctx.strokeStyle=dark;ctx.lineWidth=13;[-42,-12,20,46].forEach((y,i)=>{ctx.beginPath();ctx.moveTo(-55+i*4,y);ctx.lineTo(53-i*5,y+15);ctx.stroke()});ctx.fillStyle=cream;ctx.beginPath();ctx.moveTo(-58,-55);ctx.lineTo(-35,-128);ctx.lineTo(-8,-60);ctx.closePath();ctx.moveTo(58,-55);ctx.lineTo(35,-128);ctx.lineTo(8,-60);ctx.closePath();ctx.fill();
  }else{
    ctx.fillStyle=accent;head(76,70);ctx.fillStyle="#d09b47";for(const [x,y] of [[-35,-18],[12,-36],[36,6],[-15,25]]){ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill()}ctx.fillStyle=accent;ctx.beginPath();ctx.arc(-50,-62,24,0,Math.PI*2);ctx.arc(50,-62,24,0,Math.PI*2);ctx.fill();
  }
  ctx.fillStyle=cream;ctx.beginPath();ctx.arc(-23,-10,12,0,Math.PI*2);ctx.arc(23,-10,12,0,Math.PI*2);ctx.fill();ctx.fillStyle=dark;ctx.beginPath();ctx.arc(-23,-8,6,0,Math.PI*2);ctx.arc(23,-8,6,0,Math.PI*2);ctx.fill();ctx.restore();
}

async function buildPassPng(expedition:Expedition,locale:Locale){
  const role=roleForKey(expedition.animalKey);const canvas=document.createElement("canvas");canvas.width=1080;canvas.height=1920;const ctx=canvas.getContext("2d");if(!ctx)throw new Error("Canvas unavailable");
  const golden=expedition.rank==="GOLDEN EXPLORER";const gradient=ctx.createLinearGradient(0,0,1080,1920);gradient.addColorStop(0,golden?"#f4dfaa":"#f7edd8");gradient.addColorStop(.5,golden?"#d9b567":"#dfcaa5");gradient.addColorStop(1,golden?"#9d7333":"#9c8461");ctx.fillStyle=gradient;ctx.fillRect(0,0,1080,1920);
  ctx.fillStyle="rgba(255,249,234,.66)";roundedRect(ctx,54,54,972,1812,48);ctx.fill();ctx.strokeStyle=golden?"#9a6a25":"#6d765e";ctx.lineWidth=3;ctx.stroke();ctx.strokeStyle="rgba(74,66,45,.22)";ctx.lineWidth=2;roundedRect(ctx,78,78,924,1764,38);ctx.stroke();
  drawLeaf(ctx,108,220,84,-.7,"rgba(58,102,64,.45)");drawLeaf(ctx,975,260,105,.7,"rgba(72,112,70,.36)");drawLeaf(ctx,130,1660,96,-2.3,"rgba(58,91,59,.3)");drawLeaf(ctx,955,1605,92,2.25,"rgba(62,103,65,.3)");
  ctx.textAlign="center";ctx.fillStyle="#6b644e";ctx.font="700 27px Arial";ctx.letterSpacing="5px";ctx.fillText("PRIVATE SAFARI EXPEDITION",540,154);
  ctx.fillStyle="#214632";ctx.font="700 72px Georgia";ctx.fillText("ALEXIS ALESSANDRO",540,255);ctx.fillStyle="#9c6740";ctx.font="700 134px Georgia";ctx.fillText("WILD ONE",540,390);
  ctx.fillStyle=role.accent;ctx.globalAlpha=.16;ctx.beginPath();ctx.arc(540,735,270,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=golden?"#b5802d":"#7e8b6c";ctx.lineWidth=3;ctx.beginPath();ctx.arc(540,735,248,0,Math.PI*2);ctx.stroke();drawAnimalMark(ctx,expedition.animalKey,540,748,1.55,role.accent);
  ctx.fillStyle="#785f3e";ctx.font="700 30px Arial";ctx.fillText(role.animal[locale].toUpperCase(),540,1040);ctx.fillStyle="#214632";ctx.font="700 64px Georgia";ctx.fillText(safeName(expedition.guestName).toUpperCase(),540,1160);ctx.fillStyle="#645f4f";ctx.font="500 32px Arial";ctx.fillText(`${role.role[locale]} · ${role.route[locale]}`,540,1235);
  ctx.strokeStyle="rgba(97,86,61,.28)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(190,1300);ctx.lineTo(890,1300);ctx.stroke();ctx.fillStyle="#3f513f";ctx.font="700 31px Arial";ctx.fillText("SEPTEMBER 20 · 2026",540,1380);ctx.fillText("MARGATE · FLORIDA",540,1440);
  ctx.fillStyle=golden?"#7b561d":"#2c5940";ctx.font="700 44px Georgia";ctx.fillText(expedition.rank,540,1560);ctx.fillStyle="#766548";ctx.font="600 27px monospace";ctx.fillText(`EXPEDITION ${expedition.code}`,540,1640);ctx.font="700 24px Arial";ctx.fillText(expedition.attendance==="yes"?"RSVP · CONFIRMED":expedition.attendance==="no"?"RSVP · UNABLE":"RSVP · OPEN",540,1715);ctx.font="500 22px Arial";ctx.fillText("581 KATHY LANE · 5:00 PM",540,1785);
  return await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error("PNG failed")),"image/png"));
}

export function SafariPass({expedition,locale,onClose}:{expedition:Expedition;locale:Locale;onClose?:()=>void}){
  const role=roleForKey(expedition.animalKey);const [sharing,setSharing]=useState(false);const linkRef=useRef<HTMLAnchorElement>(null);
  async function share(){setSharing(true);try{const blob=await buildPassPng(expedition,locale);const file=new File([blob],"alexis-wild-one-safari-pass.png",{type:"image/png"});if(navigator.canShare?.({files:[file]})){await navigator.share({title:"Alexis Alessandro — Wild One",text:locale==="es"?"Mi Safari Pass está listo.":"My Safari Pass is ready.",files:[file]})}else{const url=URL.createObjectURL(blob);if(linkRef.current){linkRef.current.href=url;linkRef.current.click()}window.setTimeout(()=>URL.revokeObjectURL(url),5000)}window.dispatchEvent(new CustomEvent("wild-analytics",{detail:"pass_shared"}))}finally{setSharing(false)}}
  return <section className={`pass-forge ${expedition.rank==="GOLDEN EXPLORER"?"pass-forge--golden":""}`} aria-label="Safari Pass" data-animal={expedition.animalKey}>
    {onClose&&<button className="close-symbol" onClick={onClose} aria-label={locale==="es"?"Cerrar pase":"Close pass"}>×</button>}
    <div className="pass-ribbon">PRIVATE · EXPEDITION CREDENTIAL</div><p className="eyebrow">ALEXIS ALESSANDRO · WILD ONE</p>
    <div className="pass-animal" style={{color:role.accent}}><AnimalGlyph animal={expedition.animalKey} title={role.animal[locale]}/></div>
    <div className="pass-identity"><span>{locale==="es"?"EXPLORADOR":"GUEST"}</span><h3>{safeName(expedition.guestName)}</h3><p>{role.role[locale]} · {role.route[locale]}</p></div>
    <div className="pass-details"><span>SEPTEMBER 20 · 2026</span><span>MARGATE · FLORIDA</span><span>5:00 PM</span></div><strong className="pass-rank">{expedition.rank}</strong><div className="pass-code">{expedition.code} · {expedition.attendance==="yes"?"CONFIRMED":expedition.attendance==="no"?"UNABLE":"RSVP OPEN"}</div>
    <button className="world-action world-action--gold" onClick={share} disabled={sharing}>{sharing?(locale==="es"?"CREANDO…":"FORGING…"):(locale==="es"?"COMPARTIR MI SAFARI PASS":"SHARE MY SAFARI PASS")}</button><a ref={linkRef} download="alexis-wild-one-safari-pass.png" hidden>Download pass</a>
  </section>
}
