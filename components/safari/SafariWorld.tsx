"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Expedition, JourneyStep } from "@/lib/types";
import { roleForKey } from "@/lib/safariRoles";
import { BalloonGate } from "./BalloonGate";
import { SoftSafariAnimal } from "./SoftSafariAnimals";

const cameraStops: Record<JourneyStep, [number, number, number, number, number, number]> = {
  ENTER: [0, 3.2, 14, 0, 2.5, 0],
  ANIMAL_REVEAL: [0, 2.8, -4, 0, 1.8, -10],
  MAP: [-1.8, 5.4, -14, 0, 1.6, -22],
  TRAIL: [1.2, 3.2, -27, 0, 1.5, -35],
  CELEBRATION: [-1, 3.4, -39, 0, 1.8, -47],
  COORDINATES: [1.8, 3.2, -51, 0, 1.7, -59],
  SAFARI_CHIC: [-1.8, 3.0, -63, 0, 1.5, -71],
  CALENDAR: [0, 3.6, -76, 0, 2, -84],
  COUNTDOWN: [0, 3.2, -88, 0, 2, -96],
  QUEST: [1.2, 3.1, -101, 0, 1.8, -109],
  RSVP: [-1.1, 3.0, -114, 0, 1.6, -122],
  PASS: [0, 3.3, -127, 0, 2, -135],
  FINALE: [0, 3.5, -142, 0, 2.5, -151],
};

function CameraJourney({ step, reducedMotion }: { step: JourneyStep; reducedMotion: boolean }) {
  const { camera } = useThree();
  const position = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, delta) => {
    const stop = cameraStops[step];
    position.set(stop[0], stop[1], stop[2]);
    look.set(stop[3], stop[4], stop[5]);
    const ease = reducedMotion ? 1 : 1 - Math.pow(0.002, delta);
    camera.position.lerp(position, ease);
    const current = new THREE.Vector3();
    camera.getWorldDirection(current).multiplyScalar(8).add(camera.position);
    current.lerp(look, ease);
    camera.lookAt(current);
  });
  return null;
}

function Ground() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, -76]} receiveShadow>
        <planeGeometry args={[34, 180]} />
        <meshStandardMaterial color="#a99870" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, -75]} receiveShadow>
        <planeGeometry args={[5.3, 174]} />
        <meshStandardMaterial color="#d6bf91" roughness={0.92} />
      </mesh>
    </>
  );
}

function TropicalLeaf({ position, scale = 1, dark = false }: { position: [number, number, number]; scale?: number; dark?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => { if (ref.current) ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6 + position[2]) * 0.035; });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh rotation={[0.15, 0, -0.28]} scale={[0.72, 1.8, 0.16]} castShadow><sphereGeometry args={[0.72, 18, 12]} /><meshStandardMaterial color={dark ? "#214c35" : "#4c7650"} roughness={0.75} /></mesh>
      <mesh position={[0.65, 0.12, -0.05]} rotation={[0.1, 0.2, 0.38]} scale={[0.52, 1.4, 0.14]} castShadow><sphereGeometry args={[0.7, 18, 12]} /><meshStandardMaterial color={dark ? "#2c5b3d" : "#64875a"} roughness={0.74} /></mesh>
    </group>
  );
}

function Foliage() {
  const leaves = useMemo(() => Array.from({ length: 54 }, (_, i) => ({
    x: (i % 2 ? 1 : -1) * (5.2 + ((i * 17) % 35) / 10),
    y: 0.55 + ((i * 23) % 28) / 10,
    z: 4 - i * 3.05,
    s: 0.65 + (i % 5) * 0.14,
  })), []);
  return <>{leaves.map((leaf, i) => <TropicalLeaf key={i} position={[leaf.x, leaf.y, leaf.z]} scale={leaf.s} dark={i % 3 === 0} />)}</>;
}

function Stage({ z, finale = false }: { z: number; finale?: boolean }) {
  return (
    <group position={[0, 0, z]}>
      <mesh position={[0, 2.5, -1.4]} scale={[5.4, 3.6, 0.32]} castShadow><boxGeometry /><meshStandardMaterial color={finale ? "#69805b" : "#e4d3b4"} roughness={0.62} /></mesh>
      <mesh position={[0, 0.45, 0]} scale={[2.2, 0.34, 1.55]} castShadow><cylinderGeometry args={[1, 1.08, 1, 48]} /><meshStandardMaterial color="#9b6941" roughness={0.82} /></mesh>
      <mesh position={[0, 1.32, 0]} scale={[0.85, 1.1, 0.85]} castShadow><cylinderGeometry args={[1, 1, 1, 48]} /><meshPhysicalMaterial color="#f0e5cf" roughness={0.32} clearcoat={0.3} /></mesh>
      <mesh position={[0, 2.35, 0]} scale={[0.42, 1.15, 0.42]} castShadow><boxGeometry /><meshPhysicalMaterial color="#c9a259" metalness={0.2} roughness={0.28} /></mesh>
      {[-2.2, 2.4].map((x, i) => <mesh key={x} position={[x, 0.55, i ? 0.2 : -0.25]} scale={[0.76, 0.76, 0.76]} rotation={[0, i ? 0.25 : -0.22, 0]} castShadow><boxGeometry /><meshStandardMaterial color={i ? "#7f9367" : "#c58b54"} roughness={0.6} /></mesh>)}
    </group>
  );
}

function Terrain({ terrain }: { terrain: ReturnType<typeof roleForKey>["terrain"] }) {
  if (terrain === "water") return <group position={[0, 0.02, -33]}><mesh rotation={[-Math.PI / 2, 0, 0]} scale={[4.8, 8, 1]}><circleGeometry args={[1, 48]} /><meshPhysicalMaterial color="#729e95" roughness={0.12} metalness={0.05} transmission={0.18} /></mesh>{[-2.2, 2.1].map((x) => <mesh key={x} position={[x, 0.38, -1]} scale={[1.1, 0.45, 0.8]}><dodecahedronGeometry /><meshStandardMaterial color="#7c806f" roughness={0.9} /></mesh>)}</group>;
  if (terrain === "canopy") return <group position={[0, 2.2, -34]}>{[-4, -2, 0, 2, 4].map((x, i) => <mesh key={x} position={[x, Math.sin(i) * 0.2, 0]} scale={[0.82, 0.18, 2]}><boxGeometry /><meshStandardMaterial color="#7a5438" roughness={0.9} /></mesh>)}</group>;
  if (terrain === "echo") return <group position={[0, 0.4, -34]}>{Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[(i % 2 ? 1 : -1) * (2.6 + (i % 4) * 0.55), (i % 3) * 0.25, -i * 0.55]} scale={0.2 + (i % 3) * 0.05}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color={i % 2 ? "#d49e76" : "#efe0a5"} /></mesh>)}</group>;
  if (terrain === "stripe") return <group position={[0, 0.01, -34]}>{Array.from({ length: 12 }, (_, i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -i * 1.2]} scale={[2.3, 0.38, 1]}><planeGeometry /><meshStandardMaterial color={i % 2 ? "#ded7c7" : "#3a3934"} /></mesh>)}</group>;
  if (terrain === "shadow") return <group position={[0, 0, -34]}>{[-3.8, -2.8, 2.8, 3.8].map((x, i) => <TropicalLeaf key={x} position={[x, 1 + i * 0.25, -i]} scale={1.75} dark />)}</group>;
  if (terrain === "sky") return <group position={[0, 0, -34]}>{[-2, 0, 2].map((x, i) => <mesh key={x} position={[x, 0.35 + i * 0.32, -i]} scale={[1.3, 0.35, 1]}><dodecahedronGeometry /><meshStandardMaterial color="#aa9a79" roughness={0.9} /></mesh>)}</group>;
  return <group position={[0, 0, -34]}>{[-3, -1.5, 1.5, 3].map((x, i) => <mesh key={x} position={[x, 0.28, -i * 0.8]} scale={[0.7, 0.42, 0.7]}><dodecahedronGeometry /><meshStandardMaterial color="#9f8055" roughness={0.94} /></mesh>)}</group>;
}

function Observatory({ z }: { z: number }) {
  const ring = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (ring.current) ring.current.rotation.z += delta * 0.12; });
  return (
    <group position={[0, 2.4, z]} ref={ring}>
      {[2.2, 2.75, 3.3].map((radius, i) => <mesh key={radius} rotation={[i * 0.55, i * 0.2, 0]}><torusGeometry args={[radius, 0.055 + i * 0.018, 12, 80]} /><meshPhysicalMaterial color="#cbaa63" metalness={0.68} roughness={0.26} emissive="#6b4c1e" emissiveIntensity={0.1} /></mesh>)}
      <pointLight color="#ffd990" intensity={10} distance={10} />
    </group>
  );
}

function GoldenLeaf({ id, position, found, onFind }: { id: number; position: [number, number, number]; found: boolean; onFind: (id: number) => void }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.65;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.7 + id) * 0.15;
  });
  if (found) return null;
  return (
    <group ref={ref} position={position} onClick={(event) => { event.stopPropagation(); onFind(id); }} onPointerOver={() => { document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = ""; }}>
      <mesh scale={[0.6, 1.08, 0.12]} rotation={[0.15, 0, -0.45]}>
        <sphereGeometry args={[0.52, 24, 16]} />
        <meshPhysicalMaterial color="#f2c75c" emissive="#b77718" emissiveIntensity={0.8} metalness={0.34} roughness={0.22} clearcoat={1} />
      </mesh>
      <pointLight color="#ffd36e" intensity={7} distance={4} />
      <Sparkles count={12} scale={2.2} size={3} speed={0.4} color="#ffe29a" />
    </group>
  );
}

function World({ expedition, step, entered, reducedMotion, quality, onLeaf }: { expedition: Expedition; step: JourneyStep; entered: boolean; reducedMotion: boolean; quality: "HIGH" | "MEDIUM" | "LOW"; onLeaf: (id: number) => void }) {
  const role = roleForKey(expedition.animalKey);
  const golden = expedition.leaves.length === 3;
  return (
    <>
      <color attach="background" args={[golden ? "#f0d8a5" : "#c9dfcd"]} />
      <fog attach="fog" args={[golden ? "#ead1a1" : "#c9d9c8", 18, quality === "LOW" ? 58 : 74]} />
      <hemisphereLight color="#fff4d5" groundColor="#65745b" intensity={2.1} />
      <directionalLight castShadow={quality !== "LOW"} color="#ffe2a1" intensity={3.2} position={[-6, 12, 8]} shadow-mapSize={[quality === "HIGH" ? 1536 : 768, quality === "HIGH" ? 1536 : 768]} />
      <Ground />
      <Foliage />
      <BalloonGate entered={entered} />
      <Stage z={-2} />
      <Suspense fallback={null}>
        <SoftSafariAnimal animal="giraffe" position={[-4.2, 0, -0.6]} scale={0.9} />
        <SoftSafariAnimal animal="elephant" position={[3.55, 0, 0.2]} scale={0.72} />
        <SoftSafariAnimal animal="lion" position={[1.75, 0, -1.0]} scale={0.68} />
        <SoftSafariAnimal animal="zebra" position={[-2.2, 0, -2]} scale={0.62} />
        <SoftSafariAnimal animal="monkey" position={[3.6, 4.25, -0.2]} scale={0.52} />
        <SoftSafariAnimal animal="parrot" position={[2.7, 4.9, 0]} rotation={[0, -0.4, 0]} scale={0.45} />
        <SoftSafariAnimal animal="leopard" position={[-3.6, 0, -2.2]} scale={0.55} />
        <SoftSafariAnimal animal={expedition.animalKey} position={[0, 0, -10.5]} scale={0.92} active={step !== "ENTER"} />
        <SoftSafariAnimal animal={expedition.animalKey} position={[2.4, 0, -30]} rotation={[0, -0.45, 0]} scale={0.62} />
      </Suspense>
      <Terrain terrain={role.terrain} />
      {expedition.leaves.includes(1) && (
        <Float speed={1.4} rotationIntensity={0.16} floatIntensity={0.25}>
          <group position={[2.4, 2.1, -30]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.5, 0.045, 12, 72]} /><meshPhysicalMaterial color="#f2cd72" emissive="#a56c16" emissiveIntensity={0.55} metalness={0.6} /></mesh>
            <Sparkles count={18} scale={4} size={2.4} speed={0.35} color="#ffe2a0" />
          </group>
        </Float>
      )}
      {expedition.leaves.includes(2) && (
        <group position={[0, 2.8, -70]}>
          {[2.1, 2.55].map((radius, index) => <mesh key={radius} rotation={[index * 0.7, index * 0.25, 0]}><torusGeometry args={[radius, 0.06, 12, 72]} /><meshPhysicalMaterial color="#e6c56d" emissive="#8c641e" emissiveIntensity={0.45} metalness={0.65} /></mesh>)}
          <pointLight color="#ffdc88" intensity={8} distance={9} />
        </group>
      )}
      <GoldenLeaf id={1} position={[-2.6, 2.0, -26]} found={expedition.leaves.includes(1)} onFind={onLeaf} />
      <GoldenLeaf id={2} position={[2.9, 2.6, -68]} found={expedition.leaves.includes(2)} onFind={onLeaf} />
      <GoldenLeaf id={3} position={[-2.4, 2.2, -104]} found={expedition.leaves.includes(3)} onFind={onLeaf} />
      <Observatory z={-83} />
      <Observatory z={-96} />
      <Stage z={-151} finale />
      <Suspense fallback={null}>
        {(["giraffe", "elephant", "lion", "monkey", "parrot", "zebra", "leopard"] as const).map((animal, i) => (
          <SoftSafariAnimal key={animal} animal={animal} position={[-4.8 + i * 1.6, 0, -149 + (i % 2) * 1.1]} rotation={[0, i < 3 ? 0.3 : -0.3, 0]} scale={animal === "giraffe" ? 0.55 : animal === "parrot" ? 0.42 : 0.52} />
        ))}
      </Suspense>
      <Sparkles count={quality === "HIGH" ? 110 : quality === "MEDIUM" ? 60 : 24} scale={[24, 10, 170]} position={[0, 3.5, -76]} size={2.2} speed={0.14} color={golden ? "#ffe39a" : "#f4deb2"} />
      {quality !== "LOW" && <ContactShadows position={[0, 0.02, -15]} scale={28} opacity={0.3} blur={2.5} far={16} />}
      <CameraJourney step={step} reducedMotion={reducedMotion} />
      {quality === "HIGH" && <EffectComposer multisampling={0}><Bloom intensity={golden ? 0.95 : 0.45} luminanceThreshold={0.75} mipmapBlur /></EffectComposer>}
    </>
  );
}

function detectQuality(): "HIGH" | "MEDIUM" | "LOW" {
  if (typeof navigator === "undefined") return "MEDIUM";
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  if (memory <= 2 || navigator.hardwareConcurrency <= 4) return "LOW";
  if (memory >= 8 && navigator.hardwareConcurrency >= 8) return "HIGH";
  return "MEDIUM";
}

export default function SafariWorld({ expedition, step, entered, reducedMotion, onLeaf, onWebglFailure }: { expedition: Expedition; step: JourneyStep; entered: boolean; reducedMotion: boolean; onLeaf: (id: number) => void; onWebglFailure: () => void }) {
  const [quality, setQuality] = useState<"HIGH" | "MEDIUM" | "LOW">(detectQuality);
  const dpr = quality === "HIGH" ? [1, 1.5] : quality === "MEDIUM" ? [0.9, 1.25] : [0.75, 1];
  return (
    <div className="world-canvas" aria-hidden="true" data-quality={quality}>
      <Canvas
        shadows={quality !== "LOW"}
        dpr={dpr as [number, number]}
        camera={{ position: [0, 3.2, 14], fov: 43, near: 0.1, far: 220 }}
        gl={{ antialias: quality !== "LOW", powerPreference: quality === "LOW" ? "low-power" : "high-performance", alpha: true }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.06;
          gl.domElement.addEventListener("webglcontextlost", (event) => { event.preventDefault(); onWebglFailure(); }, { once: true });
        }}
      >
        <PerformanceMonitor
          flipflops={2}
          onDecline={() => setQuality((current) => current === "HIGH" ? "MEDIUM" : "LOW")}
          onIncline={() => setQuality((current) => current === "LOW" ? "MEDIUM" : current)}
        />
        <World expedition={expedition} step={step} entered={entered} reducedMotion={reducedMotion} quality={quality} onLeaf={onLeaf} />
      </Canvas>
    </div>
  );
}
