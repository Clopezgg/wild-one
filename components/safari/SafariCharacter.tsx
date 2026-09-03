"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { AnimalKey } from "@/lib/safariRoles";
import { SoftSafariAnimal } from "./SoftSafariAnimals";

type Props={animal:AnimalKey;position?:[number,number,number];rotation?:[number,number,number];scale?:number;active?:boolean;celebrating?:boolean};

export function SafariCharacter({animal,position=[0,0,0],rotation=[0,0,0],scale=1,active=false,celebrating=false}:Props){
  const ref=useRef<THREE.Group>(null);
  useFrame((state,delta)=>{
    if(!ref.current)return;const t=state.clock.elapsedTime;const intensity=active?1:.38;
    ref.current.position.x=position[0];ref.current.position.z=position[2];ref.current.position.y=position[1];
    ref.current.rotation.x=rotation[0];ref.current.rotation.y=rotation[1];ref.current.rotation.z=rotation[2];
    if(animal==="giraffe"){
      ref.current.rotation.z+=Math.sin(t*.55+position[0])*.025*intensity;ref.current.position.y+=Math.sin(t*.8)*.025*intensity;
      if(active)ref.current.rotation.x+=Math.sin(t*.35)*.018;
    }else if(animal==="elephant"){
      ref.current.rotation.y+=Math.sin(t*.6)*.04*intensity;ref.current.position.y+=Math.sin(t*1.1)*.018;
    }else if(animal==="lion"){
      const breathe=1+Math.sin(t*1.2)*.006*intensity;ref.current.scale.setScalar(scale*breathe);ref.current.rotation.y+=Math.sin(t*.42)*.025*intensity;return;
    }else if(animal==="monkey"){
      ref.current.rotation.z+=Math.sin(t*1.15)*.055*intensity;ref.current.position.y+=Math.sin(t*1.6)*.06*intensity;
    }else if(animal==="parrot"){
      ref.current.position.y+=Math.sin(t*1.8)*.075*intensity;ref.current.rotation.z+=Math.sin(t*2.1)*.05*intensity;if(active)ref.current.position.x+=Math.sin(t*.65)*.16;
    }else if(animal==="zebra"){
      ref.current.rotation.y+=Math.sin(t*.55)*.035*intensity;ref.current.position.y+=Math.abs(Math.sin(t*1.05))*.012*intensity;
    }else{
      ref.current.position.x+=Math.sin(t*.38+position[2])*.035*intensity;ref.current.rotation.y+=Math.sin(t*.48)*.025*intensity;
    }
    if(celebrating){ref.current.position.y+=Math.abs(Math.sin(t*1.7))*.045;ref.current.rotation.y+=Math.sin(t*.9)*.05}
    ref.current.scale.lerp(new THREE.Vector3(scale,scale,scale),1-Math.pow(.002,delta));
  });
  return <group ref={ref} position={position} rotation={rotation} scale={scale}><SoftSafariAnimal animal={animal} active={false}/></group>;
}
