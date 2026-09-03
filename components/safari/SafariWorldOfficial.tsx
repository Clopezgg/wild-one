"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Expedition, JourneyStep } from "@/lib/types";
import { roleForKey } from "@/lib/safariRoles";
import { BalloonGate } from "./BalloonGate";
import { SafariCharacter } from "./SafariCharacter";

type Props = {
  expedition: Expedition;
  step: JourneyStep;
  entered: boolean;
  reducedMotion: boolean;
  onLeaf: (id: number) => void;
  onWebglFailure: () => void;
};

type Quality = "HIGH" | "MEDIUM" | "LOW";

const cameraStops: Record<JourneyStep, [number, number, number, number, number, number]> = {
  ENTER: [0, 3.0, 15, 0, 2.8, 0],
  ANIMAL_REVEAL: [0, 2.7, -5.5, 0, 1.75, -10],
  MAP: [-1.8, 4.8, -17, 0, 1.5, -23],
  TRAIL: [1.5, 3.0, -29, 0, 1.5, -36],
  CELEBRATION: [-1.1, 3.25, -42, 0, 2.0, -49],
  COORDINATES: [1.6, 3.0, -55, 0, 1.6, -62],
  SAFARI_CHIC: [-1.5, 2.9, -68, 0, 1.55, -75],
  CALENDAR: [0, 3.4, -81, 0, 1.9, -88],
  COUNTDOWN: [0, 3.0, -94, 0, 1.8, -101],
  QUEST: [1.2, 3.0, -107, 0, 1.65, -114],
  RSVP: [-1.0, 2.9, -120, 0, 1.6, -127],
  PASS: [0, 3.1, -133, 0, 1.85, -140],
  FINALE: [0, 3.6, -146, 0, 2.4, -154],
};

function CameraJourney({ step, reducedMotion }: { step: JourneyStep; reducedMotion: boolean }) {
  const { camera } = useThree();
  const desired = useMemo(() => new THREE.Vector3(), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);
  const currentLook = useMemo(() => new THREE.Vector3(0, 2.4, 0), []);
  useFrame((_, delta) => {
    const s = cameraStops[step];
    desired.set(s[0], s[1], s[2]);
    desiredLook.set(s[3], s[4], s[5]);
    const easing = reducedMotion ? 1 : 1 - Math.pow(0.0018, delta);
    camera.position.lerp(desired, easing);
    currentLook.lerp(desiredLook, easing * 0.9);
    camera.lookAt(currentLook);
  });
  return null;
}

function Leaf({ position, scale = 1, rotation = 0, color = "#376342" }: { position: [number, number, number]; scale?: number; rotation?: number; color?: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = rotation + Math.sin(state.clock.elapsedTime * 0.42 + position[2]) * 0.025;
  });
  return (
    <group ref={ref} position={position} rotation={[0, 0, rotation]} scale={scale}>
      <mesh scale={[0.5, 1.55, 0.12]} rotation={[0.08, 0.04, -0.16]} castShadow>
        <sphereGeometry args={[0.72, 18, 12]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0.48, 0.03, -0.04]} scale={[0.36, 1.15, 0.1]} rotation={[0.08, 0.18, 0.42]} castShadow>
        <sphereGeometry args={[0.72, 16, 10]} />
        <meshStandardMaterial color="#5a7f54" roughness={0.8} />
      </mesh>
    </group>
  );
}

function GardenFloor() {
  const islands = [0, -10, -23, -36, -49, -62, -75, -88, -101, -114, -127, -140, -154];
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, -76]} receiveShadow>
        <planeGeometry args={[44, 190]} />
        <meshStandardMaterial color="#9eaa7c" roughness={1} />
      </mesh>
      {islands.map((z, i) => (
        <group key={z} position={[0, -0.085, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[i === 0 || i === islands.length - 1 ? 9.2 : 7.3, 64]} />
            <meshStandardMaterial color={i % 3 === 0 ? "#dcc79b" : i % 3 === 1 ? "#cbb88f" : "#d7c49c"} roughness={0.98} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
            <ringGeometry args={[5.1, 5.2, 64]} />
            <meshStandardMaterial color="#f2e2b9" roughness={1} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function FoliageWalls({ quality }: { quality: Quality }) {
  const count = quality === "HIGH" ? 86 : quality === "MEDIUM" ? 62 : 42;
  const leaves = useMemo(() => Array.from({ length: count }, (_, i) => {
    const side = i % 2 ? 1 : -1;
    const z = 7 - (i / count) * 170;
    const drift = ((i * 23) % 18) / 10;
    return {
      p: [side * (5.1 + drift), 0.7 + ((i * 17) % 30) / 10, z] as [number, number, number],
      s: 0.65 + (i % 6) * 0.12,
      r: side * (0.16 + (i % 4) * 0.08),
      c: i % 5 === 0 ? "#234c34" : i % 3 === 0 ? "#3e6b45" : "#557b50",
    };
  }), [count]);
  return <>{leaves.map((l, i) => <Leaf key={i} position={l.p} scale={l.s} rotation={l.r} color={l.c} />)}</>;
}

function RoundPlinth({ position, scale = 1, color = "#eee0c3" }: { position: [number, number, number]; scale?: number; color?: string }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.18, 1.3, 1.04, 48]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.06, 0]} castShadow>
        <cylinderGeometry args={[1.08, 1.16, 0.07, 48]} />
        <meshPhysicalMaterial color="#fff8e9" roughness={0.25} clearcoat={0.3} />
      </mesh>
    </group>
  );
}

function Cake({ z, grand = false }: { z: number; grand?: boolean }) {
  return (
    <group position={[0, 0, z]}>
      <RoundPlinth position={[0, 0, 0]} scale={grand ? 1.1 : 0.95} />
      <mesh position={[0, 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.82, 0.84, 0.78, 48]} />
        <meshPhysicalMaterial color="#f3e3c7" roughness={0.3} clearcoat={0.28} />
      </mesh>
      <mesh position={[0, 2.17, 0]} castShadow>
        <cylinderGeometry args={[0.58, 0.6, 0.48, 48]} />
        <meshPhysicalMaterial color="#fff8e9" roughness={0.24} clearcoat={0.32} />
      </mesh>
      <mesh position={[0, 2.98, 0]} scale={[0.34, 1.02, 0.28]} castShadow>
        <boxGeometry />
        <meshPhysicalMaterial color="#d6aa57" roughness={0.22} metalness={0.2} clearcoat={0.55} />
      </mesh>
      <mesh position={[-1.1, 0.4, 0.35]} rotation={[0, 0.25, 0]} castShadow><boxGeometry args={[0.92, 0.7, 0.8]} /><meshStandardMaterial color="#72825d" roughness={0.6} /></mesh>
      <mesh position={[1.08, 0.35, 0.36]} rotation={[0, -0.2, 0]} castShadow><boxGeometry args={[0.82, 0.62, 0.72]} /><meshStandardMaterial color="#b97949" roughness={0.6} /></mesh>
    </group>
  );
}

function Backdrop({ z, green = false }: { z: number; green?: boolean }) {
  return (
    <group position={[0, 0, z]}>
      <mesh position={[0, 3.15, 0]} scale={[5.8, 3.9, 0.22]} castShadow>
        <boxGeometry />
        <meshStandardMaterial color={green ? "#758667" : "#eadbc0"} roughness={0.72} />
      </mesh>
      <mesh position={[0, 3.12, 0.25]} scale={[4.45, 3.15, 0.04]}>
        <boxGeometry />
        <meshStandardMaterial color={green ? "#829373" : "#f7ead1"} roughness={0.75} />
      </mesh>
      <Leaf position={[-3.75, 4.65, 0.4]} scale={1.12} rotation={-0.6} />
      <Leaf position={[3.65, 4.5, 0.42]} scale={1.05} rotation={0.65} />
      <Leaf position={[-4.35, 2.7, 0.45]} scale={0.85} rotation={-0.95} color="#294f36" />
      <Leaf position={[4.25, 2.6, 0.45]} scale={0.82} rotation={0.92} color="#294f36" />
    </group>
  );
}

function IntroInstallation() {
  return (
    <group>
      <Backdrop z={-3.5} />
      <Cake z={-1.8} grand />
      <Suspense fallback={null}>
        <SafariCharacter animal="giraffe" position={[-4.2, 0, 0.05]} scale={0.8} />
        <SafariCharacter animal="elephant" position={[3.6, 0, 0.4]} scale={0.67} />
        <SafariCharacter animal="lion" position={[1.65, 0, -1.0]} scale={0.62} />
        <SafariCharacter animal="zebra" position={[-2.1, 0, -1.8]} scale={0.56} />
        <SafariCharacter animal="monkey" position={[3.45, 3.95, -0.15]} scale={0.42} />
        <SafariCharacter animal="parrot" position={[2.45, 4.75, -0.05]} rotation={[0, -0.45, 0]} scale={0.37} />
        <SafariCharacter animal="leopard" position={[-3.45, 0, -2.25]} scale={0.48} />
      </Suspense>
    </group>
  );
}

function GardenDecor({ z, variant }: { z: number; variant: number }) {
  const colors = ["#83916d", "#efe3cb", "#b87c4b", "#6f513d"];
  return (
    <group position={[0, 0, z]}>
      {[-3.4, 3.4].map((x, i) => <Leaf key={x} position={[x, 1.2 + i * 0.25, 0]} scale={1.1} rotation={x < 0 ? -0.55 : 0.55} color={i ? "#355f3f" : "#4c744a"} />)}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <mesh key={i} position={[Math.cos(a) * 4.15, 0.42 + (i % 2) * 0.35, Math.sin(a) * 2.6]} scale={0.34 + (i % 3) * 0.09} castShadow><sphereGeometry args={[1, 18, 14]} /><meshPhysicalMaterial color={colors[(i + variant) % colors.length]} roughness={0.3} clearcoat={0.5} /></mesh>;
      })}
      <pointLight position={[0, 3.3, 0]} color="#ffe1a3" intensity={3.5} distance={9} />
    </group>
  );
}

function RoleGarden({ z, terrain }: { z: number; terrain: ReturnType<typeof roleForKey>["terrain"] }) {
  if (terrain === "water") return <group position={[0, 0.03, z]}><mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[4.4, 60]} /><meshPhysicalMaterial color="#7da19a" roughness={0.16} transmission={0.12} /></mesh><Sparkles count={15} scale={[7, 2, 6]} size={2} speed={0.2} color="#e9fff7" /></group>;
  if (terrain === "canopy") return <group position={[0, 2, z]}>{[-3.6, -1.8, 0, 1.8, 3.6].map((x, i) => <mesh key={x} position={[x, Math.sin(i) * 0.16, 0]} scale={[0.75, 0.11, 2.0]}><boxGeometry /><meshStandardMaterial color="#755038" roughness={0.92} /></mesh>)}</group>;
  if (terrain === "echo") return <group position={[0, 0.35, z]}>{Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[(i % 2 ? 1 : -1) * (2.2 + (i % 5) * 0.42), (i % 3) * 0.2, -2.5 + (i % 8) * 0.65]} scale={0.13 + (i % 4) * 0.04}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color={i % 3 === 0 ? "#d39d7a" : i % 3 === 1 ? "#efe0a6" : "#8eaa72"} /></mesh>)}</group>;
  if (terrain === "stripe") return <group position={[0, 0.02, z]}>{[-2.6, -1.3, 0, 1.3, 2.6].map((x, i) => <mesh key={x} rotation={[-Math.PI / 2, 0, i * 0.18]} position={[x, 0, 0]} scale={[0.38, 2.8, 1]}><planeGeometry /><meshStandardMaterial color={i % 2 ? "#e7e0d2" : "#474943"} /></mesh>)}</group>;
  if (terrain === "shadow") return <group position={[0, 0, z]}>{[-3.6, -2.7, 2.7, 3.6].map((x, i) => <Leaf key={x} position={[x, 1.0 + i * 0.2, 0]} scale={1.55} color="#224a33" rotation={x < 0 ? -0.5 : 0.5} />)}</group>;
  if (terrain === "sky") return <group position={[0, 0.3, z]}>{[-2.3, 0, 2.3].map((x, i) => <mesh key={x} position={[x, i * 0.22, -i * 0.5]} scale={[1.1, 0.32, 1]}><dodecahedronGeometry /><meshStandardMaterial color="#aa9e7d" roughness={0.93} /></mesh>)}</group>;
  return <group position={[0, 0.25, z]}>{[-3, -1.5, 1.5, 3].map((x, i) => <mesh key={x} position={[x, 0, -i * 0.5]} scale={[0.6, 0.38, 0.6]}><dodecahedronGeometry /><meshStandardMaterial color="#9c7f58" roughness={0.95} /></mesh>)}</group>;
}

function GoldenLeaf({ id, position, found, onFind }: { id: number; position: [number, number, number]; found: boolean; onFind: (id: number) => void }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.55;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.4 + id) * 0.13;
  });
  if (found) return null;
  return (
    <group ref={ref} position={position} onClick={(e) => { e.stopPropagation(); onFind(id); }}>
      <mesh scale={[0.55, 1.0, 0.1]} rotation={[0.14, 0, -0.45]}>
        <sphereGeometry args={[0.52, 24, 16]} />
        <meshPhysicalMaterial color="#f1c866" emissive="#a96e18" emissiveIntensity={0.7} metalness={0.32} roughness={0.2} clearcoat={1} />
      </mesh>
      <pointLight color="#ffd875" intensity={5} distance={4} />
      <Sparkles count={8} scale={2} size={2.5} speed={0.3} color="#ffe6a9" />
    </group>
  );
}

function CelebrationFinale({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      <Backdrop z={-3.4} green />
      <Cake z={-1.8} grand />
      <Suspense fallback={null}>
        <SafariCharacter animal="giraffe" position={[-4.2, 0, 0]} scale={0.75} celebrating />
        <SafariCharacter animal="elephant" position={[3.7, 0, 0.2]} scale={0.64} celebrating />
        <SafariCharacter animal="lion" position={[1.7, 0, -1.0]} scale={0.6} celebrating />
        <SafariCharacter animal="zebra" position={[-2.0, 0, -1.6]} scale={0.54} celebrating />
        <SafariCharacter animal="monkey" position={[3.1, 3.7, -0.2]} scale={0.4} celebrating />
        <SafariCharacter animal="parrot" position={[2.35, 4.55, 0]} scale={0.34} celebrating />
        <SafariCharacter animal="leopard" position={[-3.4, 0, -2.1]} scale={0.46} celebrating />
      </Suspense>
      <Sparkles count={45} scale={[12, 8, 7]} size={2.4} speed={0.28} color="#f7d995" />
    </group>
  );
}

function World({ expedition, step, entered, reducedMotion, quality, onLeaf }: { expedition: Expedition; step: JourneyStep; entered: boolean; reducedMotion: boolean; quality: Quality; onLeaf: (id: number) => void }) {
  const role = roleForKey(expedition.animalKey);
  const golden = expedition.leaves.length === 3;
  const gardenZ = -36;
  return (
    <>
      <color attach="background" args={[golden ? "#ead4a8" : "#c8ddcb"]} />
      <fog attach="fog" args={[golden ? "#e8d0a5" : "#cbdcca", 18, quality === "LOW" ? 54 : 72]} />
      <ambientLight intensity={0.5} />
      <hemisphereLight color="#fff2d4" groundColor="#5e7053" intensity={2.4} />
      <directionalLight castShadow={quality !== "LOW"} color="#ffe0a1" intensity={3.1} position={[-7, 13, 8]} shadow-mapSize={[quality === "HIGH" ? 1536 : 768, quality === "HIGH" ? 1536 : 768]} />
      <pointLight position={[0, 7, 3]} color="#ffe6b1" intensity={7} distance={18} />
      <GardenFloor />
      <FoliageWalls quality={quality} />
      <BalloonGate entered={entered} />
      <IntroInstallation />
      <GardenDecor z={-10} variant={0} />
      <GardenDecor z={-23} variant={1} />
      <GardenDecor z={-36} variant={2} />
      <RoleGarden z={gardenZ} terrain={role.terrain} />
      <GardenDecor z={-49} variant={3} />
      <GardenDecor z={-62} variant={0} />
      <GardenDecor z={-75} variant={1} />
      <GardenDecor z={-88} variant={2} />
      <GardenDecor z={-101} variant={3} />
      <GardenDecor z={-114} variant={0} />
      <GardenDecor z={-127} variant={1} />
      <GardenDecor z={-140} variant={2} />
      <Suspense fallback={null}>
        <SafariCharacter animal={expedition.animalKey} position={[0, 0, -10]} scale={0.86} active={step !== "ENTER"} />
        <SafariCharacter animal={expedition.animalKey} position={[2.3, 0, -35]} rotation={[0, -0.4, 0]} scale={0.6} active={step === "TRAIL"} />
      </Suspense>
      <GoldenLeaf id={1} position={[-2.8, 1.6, -31]} found={expedition.leaves.includes(1)} onFind={onLeaf} />
      <GoldenLeaf id={2} position={[3.0, 2.0, -78]} found={expedition.leaves.includes(2)} onFind={onLeaf} />
      <GoldenLeaf id={3} position={[-2.4, 1.35, -110]} found={expedition.leaves.includes(3)} onFind={onLeaf} />
      <CelebrationFinale z={-154} />
      {quality !== "LOW" ? <Sparkles count={quality === "HIGH" ? 70 : 40} scale={[24, 9, 174]} position={[0, 2.5, -76]} size={1.4} speed={0.16} color="#fff0be" /> : null}
      <CameraJourney step={step} reducedMotion={reducedMotion} />
      <ContactShadows opacity={0.28} scale={22} blur={2.4} far={8} position={[0, 0.01, -2]} />
    </>
  );
}

export default function SafariWorldOfficial(props: Props) {
  const [quality, setQuality] = useState<Quality>("MEDIUM");
  return (
    <div className="world-canvas" aria-hidden="true">
      <Canvas
        shadows
        dpr={quality === "HIGH" ? [1, 1.45] : quality === "MEDIUM" ? [0.9, 1.2] : [0.75, 1]}
        camera={{ position: [0, 3, 15], fov: 45, near: 0.1, far: 240 }}
        gl={{ antialias: quality !== "LOW", alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.04;
          gl.domElement.addEventListener("webglcontextlost", (event) => { event.preventDefault(); props.onWebglFailure(); }, { once: true });
        }}
      >
        <PerformanceMonitor onIncline={() => setQuality("HIGH")} onDecline={() => setQuality((q) => q === "HIGH" ? "MEDIUM" : "LOW")}>
          <World expedition={props.expedition} step={props.step} entered={props.entered} reducedMotion={props.reducedMotion} quality={quality} onLeaf={props.onLeaf} />
          {quality !== "LOW" ? <EffectComposer multisampling={quality === "HIGH" ? 4 : 0}><Bloom luminanceThreshold={0.85} mipmapBlur intensity={0.22} /><Vignette offset={0.35} darkness={0.22} /></EffectComposer> : null}
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
