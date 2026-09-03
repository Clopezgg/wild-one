"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AnimalKey } from "@/lib/safariRoles";

type Props = {
  animal: AnimalKey;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  active?: boolean;
};

const satin = (color: string, roughness = 0.42) => ({ color, roughness, metalness: 0.03 });

function Eyes({ y = 0, z = 0.48, spread = 0.24, scale = 1 }: { y?: number; z?: number; spread?: number; scale?: number }) {
  return (
    <>
      {[-spread, spread].map((x) => (
        <group key={x} position={[x, y, z]} scale={scale}>
          <mesh><sphereGeometry args={[0.105, 24, 18]} /><meshPhysicalMaterial color="#fbf8ed" roughness={0.2} /></mesh>
          <mesh position={[0, 0, 0.075]}><sphereGeometry args={[0.055, 20, 16]} /><meshPhysicalMaterial color="#201812" roughness={0.1} clearcoat={1} /></mesh>
          <mesh position={[0.018, 0.02, 0.123]}><sphereGeometry args={[0.014, 12, 10]} /><meshBasicMaterial color="white" /></mesh>
        </group>
      ))}
    </>
  );
}

function Paws({ color, z = 0 }: { color: string; z?: number }) {
  return (
    <>
      {[-0.38, 0.38].map((x) => (
        <group key={x} position={[x, 0.25, z]}>
          <mesh scale={[0.34, 0.62, 0.34]}><capsuleGeometry args={[0.34, 0.62, 8, 20]} /><meshStandardMaterial {...satin(color)} /></mesh>
          <mesh position={[0, -0.48, 0.16]} scale={[0.44, 0.2, 0.52]}><sphereGeometry args={[0.6, 24, 18]} /><meshStandardMaterial {...satin(color, 0.5)} /></mesh>
        </group>
      ))}
    </>
  );
}

function Lion() {
  return (
    <group>
      <mesh position={[0, 1.03, 0]} scale={[0.78, 0.95, 0.72]} castShadow><sphereGeometry args={[0.72, 32, 24]} /><meshStandardMaterial {...satin("#c98b42")} /></mesh>
      <Paws color="#c98b42" z={0.15} />
      <group position={[0, 2.05, 0.15]}>
        <mesh scale={[1.12, 1.12, 0.52]} castShadow><sphereGeometry args={[0.83, 40, 30]} /><meshStandardMaterial {...satin("#80502f", 0.58)} /></mesh>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2;
          return <mesh key={i} position={[Math.cos(a) * 0.76, Math.sin(a) * 0.76, 0.04]} scale={0.42}><sphereGeometry args={[0.5, 20, 16]} /><meshStandardMaterial {...satin("#8e5933", 0.6)} /></mesh>;
        })}
        <mesh position={[0, 0, 0.42]} scale={[0.68, 0.67, 0.56]}><sphereGeometry args={[0.72, 32, 24]} /><meshStandardMaterial {...satin("#d9a45e")} /></mesh>
        <mesh position={[0, -0.16, 0.86]} scale={[0.43, 0.28, 0.28]}><sphereGeometry args={[0.55, 24, 18]} /><meshStandardMaterial {...satin("#f0cf9a")} /></mesh>
        <mesh position={[0, -0.04, 1.08]} scale={[0.18, 0.12, 0.1]}><sphereGeometry args={[0.55, 20, 16]} /><meshStandardMaterial {...satin("#35231b", 0.3)} /></mesh>
        <Eyes y={0.14} z={0.88} spread={0.25} />
        {[-0.56, 0.56].map((x) => <mesh key={x} position={[x, 0.5, 0.32]} rotation={[0, 0, x * 0.4]}><sphereGeometry args={[0.24, 20, 16]} /><meshStandardMaterial {...satin("#c98b42")} /></mesh>)}
      </group>
    </group>
  );
}

function Elephant() {
  return (
    <group>
      <mesh position={[0, 1.1, -0.08]} scale={[0.98, 1.05, 0.88]} castShadow><sphereGeometry args={[0.78, 36, 26]} /><meshStandardMaterial {...satin("#8ea09a")} /></mesh>
      <Paws color="#879994" z={0.08} />
      <group position={[0, 2.03, 0.25]}>
        <mesh scale={[0.82, 0.8, 0.7]}><sphereGeometry args={[0.78, 36, 26]} /><meshStandardMaterial {...satin("#9baca5")} /></mesh>
        {[-0.72, 0.72].map((x) => <mesh key={x} position={[x, 0.02, -0.02]} scale={[0.52, 0.68, 0.16]} rotation={[0, x * -0.34, x * 0.12]}><sphereGeometry args={[0.74, 32, 24]} /><meshStandardMaterial {...satin("#aebdb4", 0.52)} /></mesh>)}
        <Eyes y={0.18} z={0.61} spread={0.25} />
        <group position={[0, -0.26, 0.64]} rotation={[0.18, 0, 0]}>
          {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0, -i * 0.27, i * 0.055]} scale={[0.24 - i * 0.025, 0.3, 0.24 - i * 0.025]}><sphereGeometry args={[0.62, 24, 18]} /><meshStandardMaterial {...satin("#91a39d")} /></mesh>)}
        </group>
        {[-0.33, 0.33].map((x) => <mesh key={x} position={[x, -0.42, 0.67]} rotation={[0.18, 0, x * -0.18]}><coneGeometry args={[0.07, 0.42, 18]} /><meshStandardMaterial color="#f2ead6" roughness={0.36} /></mesh>)}
      </group>
    </group>
  );
}

function Giraffe() {
  const spots = useMemo(() => Array.from({ length: 17 }, (_, i) => ({ y: 0.35 + (i % 7) * 0.34, a: i * 2.399, s: 0.11 + (i % 3) * 0.025 })), []);
  return (
    <group>
      <mesh position={[0, 0.95, -0.12]} scale={[0.72, 0.78, 0.88]}><sphereGeometry args={[0.7, 32, 24]} /><meshStandardMaterial {...satin("#d9ae61")} /></mesh>
      <Paws color="#d2a45a" z={0} />
      <mesh position={[0, 2.18, 0]} scale={[0.44, 1.85, 0.44]}><capsuleGeometry args={[0.42, 1.25, 10, 28]} /><meshStandardMaterial {...satin("#ddb466")} /></mesh>
      {spots.map((spot, i) => <mesh key={i} position={[Math.sin(spot.a) * 0.39, 1.05 + spot.y, Math.cos(spot.a) * 0.39]} scale={spot.s}><sphereGeometry args={[1, 15, 12]} /><meshStandardMaterial {...satin("#9b6737", 0.52)} /></mesh>)}
      <group position={[0, 4.0, 0.18]}>
        <mesh scale={[0.58, 0.6, 0.63]}><sphereGeometry args={[0.68, 32, 24]} /><meshStandardMaterial {...satin("#ddb466")} /></mesh>
        <mesh position={[0, -0.18, 0.62]} scale={[0.47, 0.26, 0.43]}><sphereGeometry args={[0.65, 28, 20]} /><meshStandardMaterial {...satin("#f0d69d")} /></mesh>
        <Eyes y={0.12} z={0.59} spread={0.22} scale={0.9} />
        {[-0.3, 0.3].map((x) => <group key={x} position={[x, 0.67, 0]}><mesh><cylinderGeometry args={[0.055, 0.075, 0.35, 14]} /><meshStandardMaterial {...satin("#9a6739")} /></mesh><mesh position={[0, 0.21, 0]}><sphereGeometry args={[0.09, 18, 14]} /><meshStandardMaterial {...satin("#80522f")} /></mesh></group>)}
        {[-0.56, 0.56].map((x) => <mesh key={x} position={[x, 0.23, 0]} rotation={[0, 0, x]} scale={[0.35, 0.17, 0.1]}><sphereGeometry args={[0.62, 20, 16]} /><meshStandardMaterial {...satin("#d5a658")} /></mesh>)}
      </group>
    </group>
  );
}

function Zebra() {
  return (
    <group>
      <mesh position={[0, 1.05, -0.08]} scale={[0.8, 0.94, 0.76]}><sphereGeometry args={[0.72, 36, 26]} /><meshStandardMaterial {...satin("#eee9dd")} /></mesh>
      <Paws color="#eee9dd" z={0.08} />
      {[-0.48, -0.2, 0.12, 0.42].map((y, i) => <mesh key={y} position={[0, 1.2 + y, 0.58]} scale={[0.57 - i * 0.04, 0.08, 0.16]}><torusGeometry args={[0.5, 0.16, 14, 36, Math.PI]} /><meshStandardMaterial {...satin("#242321", 0.55)} /></mesh>)}
      <group position={[0, 2.12, 0.25]}>
        <mesh scale={[0.59, 0.66, 0.6]}><sphereGeometry args={[0.72, 32, 24]} /><meshStandardMaterial {...satin("#f1eee5")} /></mesh>
        <mesh position={[0, -0.22, 0.62]} scale={[0.48, 0.3, 0.4]}><sphereGeometry args={[0.62, 26, 20]} /><meshStandardMaterial {...satin("#c6b9a5")} /></mesh>
        <Eyes y={0.11} z={0.61} spread={0.22} />
        {[-0.32, 0, 0.32].map((x) => <mesh key={x} position={[x, 0.26, 0.57]} rotation={[0, 0, x]} scale={[0.075, 0.42, 0.08]}><capsuleGeometry args={[0.5, 0.2, 6, 12]} /><meshStandardMaterial {...satin("#242321")} /></mesh>)}
        {[-0.54, 0.54].map((x) => <mesh key={x} position={[x, 0.4, 0]} rotation={[0, 0, x * 0.8]} scale={[0.34, 0.52, 0.15]}><sphereGeometry args={[0.48, 20, 16]} /><meshStandardMaterial {...satin("#eee9dd")} /></mesh>)}
        <mesh position={[0, 0.66, -0.04]} scale={[0.12, 0.6, 0.18]}><capsuleGeometry args={[0.5, 0.5, 6, 12]} /><meshStandardMaterial {...satin("#242321")} /></mesh>
      </group>
    </group>
  );
}

function Monkey() {
  return (
    <group>
      <mesh position={[0, 1.02, 0]} scale={[0.72, 0.9, 0.65]}><sphereGeometry args={[0.72, 34, 24]} /><meshStandardMaterial {...satin("#79523d")} /></mesh>
      <Paws color="#704936" z={0.1} />
      <group position={[0, 2.05, 0.22]}>
        <mesh scale={[0.72, 0.73, 0.65]}><sphereGeometry args={[0.72, 34, 24]} /><meshStandardMaterial {...satin("#7e5540")} /></mesh>
        <mesh position={[0, -0.08, 0.55]} scale={[0.56, 0.55, 0.38]}><sphereGeometry args={[0.65, 28, 20]} /><meshStandardMaterial {...satin("#d0a276")} /></mesh>
        <Eyes y={0.14} z={0.71} spread={0.22} />
        {[-0.64, 0.64].map((x) => <mesh key={x} position={[x, 0.05, 0]}><sphereGeometry args={[0.28, 22, 16]} /><meshStandardMaterial {...satin("#9a6c50")} /></mesh>)}
      </group>
      <mesh position={[0.76, 1.3, -0.18]} rotation={[0.3, 0.1, -0.7]}><torusGeometry args={[0.56, 0.09, 14, 40, Math.PI * 1.55]} /><meshStandardMaterial {...satin("#704936")} /></mesh>
    </group>
  );
}

function Parrot() {
  return (
    <group>
      <mesh position={[0, 1.08, 0]} scale={[0.64, 1.02, 0.62]}><sphereGeometry args={[0.72, 34, 24]} /><meshStandardMaterial {...satin("#3f8268")} /></mesh>
      <mesh position={[0, 2.0, 0.12]} scale={[0.62, 0.62, 0.58]}><sphereGeometry args={[0.7, 32, 24]} /><meshStandardMaterial {...satin("#d6aa4c")} /></mesh>
      <Eyes y={2.14} z={0.6} spread={0.22} scale={0.9} />
      <mesh position={[0, 1.93, 0.72]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.18, 0.5, 4]} /><meshStandardMaterial {...satin("#3b2a22")} /></mesh>
      {[-0.63, 0.63].map((x) => <mesh key={x} position={[x, 1.15, -0.02]} rotation={[0, 0, x * 0.74]} scale={[0.28, 1.0, 0.12]}><sphereGeometry args={[0.7, 26, 18]} /><meshStandardMaterial {...satin(x < 0 ? "#4a9b7e" : "#356e84")} /></mesh>)}
      {[-0.18, 0.18].map((x) => <mesh key={x} position={[x, 0.13, -0.08]} rotation={[0, 0, x * 0.8]}><capsuleGeometry args={[0.08, 0.72, 6, 12]} /><meshStandardMaterial {...satin("#b56d36")} /></mesh>)}
    </group>
  );
}

function Leopard() {
  const spots = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ x: ((i * 37) % 100) / 100 * 1.18 - 0.59, y: 0.55 + ((i * 61) % 100) / 100 * 1.1, z: 0.58 + (i % 3) * 0.035, s: 0.055 + (i % 4) * 0.012 })), []);
  return (
    <group>
      <mesh position={[0, 1.03, 0]} scale={[0.79, 0.92, 0.72]}><sphereGeometry args={[0.72, 36, 26]} /><meshStandardMaterial {...satin("#d6a24f")} /></mesh>
      <Paws color="#cc9546" z={0.1} />
      {spots.map((spot, i) => <mesh key={i} position={[spot.x, spot.y, spot.z]} scale={spot.s}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial {...satin("#4f3825")} /></mesh>)}
      <group position={[0, 2.08, 0.22]}>
        <mesh scale={[0.69, 0.68, 0.62]}><sphereGeometry args={[0.72, 34, 24]} /><meshStandardMaterial {...satin("#daa955")} /></mesh>
        <mesh position={[0, -0.17, 0.61]} scale={[0.48, 0.3, 0.36]}><sphereGeometry args={[0.62, 26, 20]} /><meshStandardMaterial {...satin("#efd19a")} /></mesh>
        <Eyes y={0.13} z={0.65} spread={0.24} />
        <mesh position={[0, -0.04, 0.86]} scale={[0.15, 0.11, 0.1]}><sphereGeometry args={[0.55, 20, 14]} /><meshStandardMaterial {...satin("#32251e")} /></mesh>
        {[-0.52, 0.52].map((x) => <mesh key={x} position={[x, 0.48, 0.03]}><sphereGeometry args={[0.23, 20, 15]} /><meshStandardMaterial {...satin("#c58f43")} /></mesh>)}
      </group>
      <mesh position={[0.7, 1.15, -0.2]} rotation={[0.2, 0.2, -0.65]}><torusGeometry args={[0.58, 0.085, 14, 44, Math.PI * 1.5]} /><meshStandardMaterial {...satin("#c79043")} /></mesh>
    </group>
  );
}

export function SoftSafariAnimal({ animal, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, active = true }: Props) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current || !active) return;
    const t = state.clock.elapsedTime;
    group.current.position.y = position[1] + Math.sin(t * 1.2 + position[0]) * 0.035;
    group.current.rotation.y = rotation[1] + Math.sin(t * 0.48 + position[2]) * 0.055;
    group.current.rotation.z = rotation[2] + Math.sin(t * 0.75) * (animal === "parrot" ? 0.04 : 0.008);
    group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 1 - Math.pow(0.001, delta));
  });
  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      {animal === "lion" && <Lion />}
      {animal === "elephant" && <Elephant />}
      {animal === "giraffe" && <Giraffe />}
      {animal === "monkey" && <Monkey />}
      {animal === "parrot" && <Parrot />}
      {animal === "zebra" && <Zebra />}
      {animal === "leopard" && <Leopard />}
    </group>
  );
}

