"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const balloons: Array<[number, number, number, number, string, number]> = [
  [-4.6, 1.0, 0.2, 0.72, "#788b61", -0.15], [-4.8, 2.0, -0.1, 0.88, "#e8ddc7", 0.08], [-4.35, 3.0, 0.18, 0.66, "#aa7748", -0.1],
  [-4.68, 4.0, -0.2, 0.92, "#a2aa7d", 0.14], [-4.1, 4.85, 0.2, 0.7, "#f0e6d0", -0.15], [-3.58, 5.55, -0.1, 0.82, "#836342", 0.12],
  [-2.72, 6.0, 0.12, 0.72, "#8f9b68", -0.2], [-1.82, 6.38, -0.14, 0.9, "#eadcc1", 0.12], [-0.82, 6.58, 0.1, 0.7, "#c28b50", -0.1],
  [0.18, 6.66, -0.08, 0.94, "#8c9869", 0.08], [1.2, 6.5, 0.15, 0.74, "#f1e7d4", -0.18], [2.15, 6.17, -0.12, 0.88, "#9c6b40", 0.14],
  [3.1, 5.75, 0.16, 0.68, "#9ca47b", -0.14], [3.86, 5.12, -0.16, 0.88, "#e9dcc5", 0.1], [4.38, 4.28, 0.16, 0.68, "#bb8050", -0.1],
  [4.68, 3.25, -0.16, 0.91, "#77875c", 0.12], [4.85, 2.16, 0.14, 0.7, "#eadcc4", -0.08], [4.65, 1.1, -0.1, 0.86, "#98704e", 0.1],
  [-3.85, 2.35, 0.58, 0.55, "#c38c4f", 0.22], [-3.65, 4.1, 0.55, 0.58, "#6e7c55", -0.18], [-2.4, 5.45, 0.56, 0.54, "#eee3ce", 0.2],
  [-0.3, 6.08, 0.58, 0.6, "#a87344", -0.18], [1.75, 5.75, 0.55, 0.55, "#79875b", 0.2], [3.55, 4.45, 0.58, 0.63, "#e7d8bb", -0.18],
  [3.95, 2.65, 0.54, 0.52, "#bd8450", 0.18], [-4.0, 1.35, 0.62, 0.48, "#e9ddc7", -0.2], [4.05, 1.32, 0.6, 0.5, "#869367", 0.15],
];

function Balloon({ item, entered }: { item: (typeof balloons)[number]; entered: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const [x, y, z, size, color, tilt] = item;
  useFrame((state) => {
    if (!ref.current) return;
    const ripple = entered ? Math.max(0, 1.3 - Math.abs(state.camera.position.z - z)) : 0;
    ref.current.rotation.z = tilt + Math.sin(state.clock.elapsedTime * 0.7 + x) * 0.018 + ripple * 0.03 * Math.sign(x || 1);
  });
  return (
    <mesh ref={ref} position={[x, y, z]} scale={[size * 0.9, size * 1.08, size * 0.9]} castShadow>
      <sphereGeometry args={[0.75, 28, 22]} />
      <meshPhysicalMaterial color={color} roughness={0.28} clearcoat={0.42} clearcoatRoughness={0.36} />
    </mesh>
  );
}

function LeafFan({ position, rotation = 0, scale = 1 }: { position: [number, number, number]; rotation?: number; scale?: number }) {
  return (
    <group position={position} rotation={[0, 0, rotation]} scale={scale}>
      {[-0.7, 0, 0.7].map((angle) => (
        <mesh key={angle} rotation={[0.2, angle, angle * 0.55]} position={[Math.sin(angle) * 0.55, Math.cos(angle) * 0.32, 0]} scale={[0.42, 1.25, 0.14]}>
          <sphereGeometry args={[0.7, 18, 12]} />
          <meshStandardMaterial color={angle === 0 ? "#315b3e" : "#446d49"} roughness={0.72} />
        </mesh>
      ))}
    </group>
  );
}

export function BalloonGate({ entered }: { entered: boolean }) {
  return (
    <group position={[0, 0, 1.2]}>
      {balloons.map((item, index) => <Balloon key={index} item={item} entered={entered} />)}
      <LeafFan position={[-4.85, 0.72, 0.55]} rotation={-0.35} scale={1.1} />
      <LeafFan position={[4.85, 0.72, 0.55]} rotation={0.35} scale={1.1} />
      <group position={[-2.2, 6.05, 0.66]} rotation={[0, 0, -0.25]}>
        {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[Math.sin(i * 1.2) * 0.28, Math.cos(i * 1.2) * 0.28, 0.05]} scale={0.09 + (i % 2) * 0.025}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#84532e" /></mesh>)}
      </group>
    </group>
  );
}

