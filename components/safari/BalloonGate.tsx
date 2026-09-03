"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type BalloonSpec = {
  p: [number, number, number];
  s: number;
  color: string;
  squash?: number;
  giraffe?: boolean;
  seed: number;
};

const palette = ["#83916d", "#9aa47d", "#efe3cb", "#e7d6b8", "#b87c4b", "#8b6447", "#6f513d"];

function buildArch(): BalloonSpec[] {
  const specs: BalloonSpec[] = [];
  let seed = 1;
  const push = (x: number, y: number, z: number, s: number, color: string, giraffe = false, squash = 1) => {
    specs.push({ p: [x, y, z], s, color, giraffe, squash, seed: seed++ });
  };

  // Dense asymmetric columns: deliberately irregular, like a premium event install.
  const left = [
    [-5.05,.7,.18,.9],[-4.72,1.55,-.08,.72],[-5.08,2.22,.28,1.02],[-4.56,3.04,-.18,.7],[-4.92,3.78,.14,.92],[-4.32,4.55,.35,.66],[-4.38,5.16,-.2,.92],[-3.74,5.72,.24,.72],[-3.15,6.18,-.12,.88],[-2.38,6.52,.15,.67],[-1.55,6.78,-.15,.91],[-.72,6.96,.18,.62]
  ];
  const right = [
    [5.02,.72,.1,.82],[4.76,1.48,-.18,1.02],[5.06,2.38,.22,.68],[4.55,3.13,.42,.84],[4.88,3.92,-.1,.67],[4.36,4.64,.18,.94],[3.82,5.32,-.22,.66],[3.12,5.84,.25,.82],[2.32,6.28,-.1,.68],[1.48,6.58,.18,.88],[.62,6.76,-.12,.64]
  ];
  [...left, ...right].forEach((v, index) => {
    const [x,y,z,s] = v as number[];
    const color = palette[(index * 3 + 2) % palette.length];
    push(x,y,z,s,color,index % 8 === 4, index % 4 === 0 ? 1.14 : .96);
  });

  // Secondary clusters create depth instead of a single mathematical ring.
  [
    [-4.25,1.18,.72,.55],[-4.02,2.64,.76,.48],[-3.92,4.24,.68,.62],[-3.0,5.58,.72,.5],[-1.95,6.2,.66,.48],[-.12,6.42,.7,.58],
    [4.23,1.14,.7,.58],[4.0,2.75,.72,.52],[3.82,4.2,.72,.58],[2.95,5.5,.66,.48],[1.78,6.12,.7,.54],[.92,6.35,.68,.48]
  ].forEach((v,index) => {
    const [x,y,z,s] = v as number[];
    push(x,y,z,s,palette[(index+4)%palette.length], index === 3 || index === 8, 1.05);
  });

  // Tiny filler balloons make the installation read as hand-composed.
  for (let i=0;i<18;i+=1) {
    const side = i % 2 ? 1 : -1;
    const t = (i % 9) / 8;
    const y = .9 + t * 5.35;
    const x = side * (4.55 - Math.sin(t * Math.PI) * 1.1 + (i%3)*.12);
    push(x,y,1.0 + (i%2)*.15,.28 + (i%4)*.045,palette[(i+1)%palette.length],false,1.08);
  }
  return specs;
}

const balloons = buildArch();

function GiraffeSpots({ scale }: { scale: number }) {
  const spots = useMemo(() => [
    [-.28,.22,.62,.13],[.19,.31,.65,.11],[.31,-.12,.64,.09],[-.12,-.29,.66,.12],[.03,.02,.72,.1]
  ] as const, []);
  return <>{spots.map((spot,index)=><mesh key={index} position={[spot[0]*scale,spot[1]*scale,spot[2]*scale]} scale={spot[3]*scale}><sphereGeometry args={[1,14,10]}/><meshStandardMaterial color="#735039" roughness={.52}/></mesh>)}</>;
}

function Balloon({ spec, entered }: { spec: BalloonSpec; entered: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const phase = spec.seed * .71;
  useFrame((state,delta)=>{
    if(!ref.current) return;
    const t = state.clock.elapsedTime;
    const portalPulse = entered ? Math.max(0,1.6-Math.abs(state.camera.position.z-2)) : 0;
    ref.current.rotation.z = Math.sin(t*.48+phase)*.018 + portalPulse*Math.sign(spec.p[0]||1)*.02;
    ref.current.rotation.y += delta*.004*Math.sign(spec.p[0]||1);
  });
  return <group ref={ref} position={spec.p}>
    <mesh scale={[spec.s*.88,spec.s*1.08*(spec.squash??1),spec.s*.84]} castShadow>
      <sphereGeometry args={[.78,28,22]}/>
      <meshPhysicalMaterial color={spec.giraffe ? "#d6ab68" : spec.color} roughness={.25} clearcoat={.6} clearcoatRoughness={.25} sheen={.25} sheenColor="#fff0d0"/>
    </mesh>
    {spec.giraffe && <GiraffeSpots scale={spec.s}/>} 
    <mesh position={[0,spec.s*1.02,-spec.s*.05]} scale={spec.s*.12}><sphereGeometry args={[.32,12,8]}/><meshBasicMaterial color="#fff7e8" transparent opacity={.28}/></mesh>
  </group>;
}

function PalmFrond({ position, rotation=0, scale=1, dark=false }: { position:[number,number,number]; rotation?:number; scale?:number; dark?:boolean }) {
  return <group position={position} rotation={[0,0,rotation]} scale={scale}>
    <mesh rotation={[0,0,.04]} scale={[.08,1.55,.08]}><capsuleGeometry args={[.5,1.7,6,10]}/><meshStandardMaterial color="#355b3e" roughness={.9}/></mesh>
    {[-1.05,-.7,-.35,0,.35,.7,1.05].map((a,index)=><mesh key={a} position={[Math.sin(a)*.72,Math.cos(a)*.35,0]} rotation={[.1,a,a*.55]} scale={[.38,1.15-(Math.abs(index-3)*.06),.11]} castShadow><sphereGeometry args={[.66,16,10]}/><meshStandardMaterial color={dark ? "#254a35" : index%2 ? "#3f704b" : "#547e55"} roughness={.76}/></mesh>)}
  </group>;
}

export function BalloonGate({ entered }: { entered:boolean }) {
  return <group position={[0,0,1.25]}>
    {balloons.map((spec,index)=><Balloon key={index} spec={spec} entered={entered}/>)}
    <PalmFrond position={[-5.1,.65,.9]} rotation={-.5} scale={1.35} dark/>
    <PalmFrond position={[-4.55,3.8,1.0]} rotation={-.9} scale={.92}/>
    <PalmFrond position={[5.05,.65,.9]} rotation={.5} scale={1.35} dark/>
    <PalmFrond position={[4.55,3.9,1.0]} rotation={.9} scale={.92}/>
    <PalmFrond position={[-2.85,6.1,.94]} rotation={-1.25} scale={.75}/>
    <PalmFrond position={[2.75,6.08,.94]} rotation={1.25} scale={.72}/>
    <pointLight position={[0,4.8,2.8]} color="#ffe6ad" intensity={entered?7:10} distance={13}/>
  </group>;
}
