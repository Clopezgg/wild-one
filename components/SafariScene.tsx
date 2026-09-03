"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Float,
  RoundedBox,
  Sparkles,
  useGLTF,
} from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";

const MODEL_ROOT =
  "https://raw.githubusercontent.com/xiaojilele-glitch/WhyBuddy/main/client/public/kenney_cube-pets_1.0/Models/GLB%20format";

const MODELS = {
  giraffe: `${MODEL_ROOT}/animal-giraffe.glb`,
  elephant: `${MODEL_ROOT}/animal-elephant.glb`,
  lion: `${MODEL_ROOT}/animal-lion.glb`,
  monkey: `${MODEL_ROOT}/animal-monkey.glb`,
  tiger: `${MODEL_ROOT}/animal-tiger.glb`,
  parrot: `${MODEL_ROOT}/animal-parrot.glb`,
};

const trees: Array<[number, number, number, number]> = [
  [-8, 0, 5, 1.2], [8, 0, 3, 1.35], [-7, 0, -3, 1.5], [7.5, 0, -6, 1.2],
  [-9, 0, -12, 1.45], [8, 0, -15, 1.5], [-7.5, 0, -21, 1.15], [8.8, 0, -24, 1.35],
  [-9, 0, -30, 1.55], [7.3, 0, -33, 1.25], [-8.5, 0, -39, 1.4], [9, 0, -43, 1.6],
  [-6.5, 0, -49, 1.15], [7, 0, -52, 1.25], [-9.3, 0, -57, 1.4], [8.7, 0, -60, 1.5],
];

function Tree({ x, z, s }: { x: number; z: number; s: number }) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <mesh castShadow receiveShadow position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.28, 0.48, 4.4, 8]} />
        <meshStandardMaterial color="#4a2f23" roughness={0.95} />
      </mesh>
      <mesh castShadow position={[-0.75, 4.7, 0.2]}>
        <icosahedronGeometry args={[1.45, 1]} />
        <meshStandardMaterial color="#244c38" roughness={0.88} />
      </mesh>
      <mesh castShadow position={[0.75, 4.9, -0.15]}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial color="#315f44" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 5.65, 0]}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial color="#3f7552" roughness={0.88} />
      </mesh>
    </group>
  );
}

function Animal({
  url,
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}) {
  const { scene } = useGLTF(url);
  const clone = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clone.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        if (object.material instanceof THREE.MeshStandardMaterial) {
          object.material.roughness = Math.min(0.86, object.material.roughness ?? 0.8);
        }
      }
    });
  }, [clone]);

  return (
    <Float speed={1.1} rotationIntensity={0.035} floatIntensity={0.12}>
      <primitive object={clone} position={position} rotation={rotation} scale={scale} />
    </Float>
  );
}

function GoldenOne({ position = [0, 0, -1] as [number, number, number] }) {
  const material = (
    <meshPhysicalMaterial
      color="#d8b35e"
      metalness={0.86}
      roughness={0.2}
      clearcoat={1}
      clearcoatRoughness={0.12}
      emissive="#6f4b18"
      emissiveIntensity={0.12}
    />
  );
  return (
    <group position={position} rotation={[0, -0.08, 0]}>
      <RoundedBox args={[1.05, 4.25, 0.85]} radius={0.16} smoothness={5} position={[0.15, 2.2, 0]} castShadow>
        {material}
      </RoundedBox>
      <RoundedBox args={[2.45, 0.8, 0.9]} radius={0.15} smoothness={5} position={[0.15, 0.25, 0]} castShadow>
        {material}
      </RoundedBox>
      <RoundedBox args={[1.9, 0.8, 0.88]} radius={0.14} smoothness={5} position={[-0.3, 4.05, 0]} rotation={[0, 0, -0.55]} castShadow>
        {material}
      </RoundedBox>
      <pointLight color="#e9c979" intensity={16} distance={8} position={[0, 3.2, 2]} />
    </group>
  );
}

function Portal({ z, scale = 1 }: { z: number; scale?: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.z += delta * 0.07;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.08;
  });
  return (
    <group ref={group} position={[0, 3, z]} scale={scale}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.72]}>
          <torusGeometry args={[3.1 + i * 0.38, 0.035 + i * 0.012, 12, 96]} />
          <meshStandardMaterial
            color={i === 0 ? "#d7b56a" : "#9d8150"}
            metalness={0.88}
            roughness={0.28}
            emissive="#5a411c"
            emissiveIntensity={0.14}
          />
        </mesh>
      ))}
      <Sparkles count={38} scale={[7, 7, 2]} size={2.8} speed={0.18} color="#f4db9a" />
    </group>
  );
}

function Shrine({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      <mesh receiveShadow position={[0, 0.35, 0]}>
        <cylinderGeometry args={[3.6, 4.3, 0.7, 32]} />
        <meshStandardMaterial color="#1c3328" roughness={0.9} />
      </mesh>
      {[-2.9, 2.9].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh castShadow position={[0, 2.2, 0]}>
            <cylinderGeometry args={[0.28, 0.38, 4.4, 12]} />
            <meshStandardMaterial color="#8f7650" metalness={0.25} roughness={0.62} />
          </mesh>
          <mesh castShadow position={[0, 4.3, 0]}>
            <sphereGeometry args={[0.62, 20, 20]} />
            <meshPhysicalMaterial color="#d6b35f" metalness={0.8} roughness={0.2} emissive="#5f431a" emissiveIntensity={0.13} />
          </mesh>
        </group>
      ))}
      <Portal z={0.15} scale={0.72} />
    </group>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
    const z = 13 - p * 60;
    const sway = Math.sin(p * Math.PI * 3.2) * 1.15;
    target.set(sway + pointer.x * 0.55, 3.0 + pointer.y * 0.28, z);
    camera.position.lerp(target, 1 - Math.pow(0.0001, delta));
    look.set(pointer.x * 0.25, 2.2 + pointer.y * 0.18, z - 8.4);
    camera.lookAt(look);
  });

  return null;
}

function World() {
  return (
    <>
      <color attach="background" args={["#06110d"]} />
      <fog attach="fog" args={["#071710", 11, 42]} />
      <hemisphereLight color="#c6d5b1" groundColor="#15100c" intensity={1.25} />
      <directionalLight
        castShadow
        color="#f7dc9a"
        intensity={2.8}
        position={[5, 12, 8]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight castShadow color="#d6b76a" intensity={40} distance={38} angle={0.45} penumbra={0.85} position={[0, 12, 6]} />
      <spotLight color="#79a786" intensity={18} distance={45} angle={0.6} penumbra={1} position={[-8, 7, -22]} />

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -25]}>
        <planeGeometry args={[38, 90, 1, 1]} />
        <meshStandardMaterial color="#0d281e" roughness={0.97} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -26]}>
        <planeGeometry args={[4.8, 88]} />
        <meshStandardMaterial color="#5d533e" roughness={0.98} />
      </mesh>

      {trees.map(([x, _y, z, s]) => <Tree key={`${x}-${z}`} x={x} z={z} s={s} />)}

      <GoldenOne position={[0, 0, -2.8]} />
      <Portal z={-17} />
      <Shrine z={-39} />

      <Suspense fallback={null}>
        <Animal url={MODELS.giraffe} position={[-4.7, 0.05, -1.4]} rotation={[0, 0.45, 0]} scale={2.25} />
        <Animal url={MODELS.elephant} position={[4.5, 0.02, -3.2]} rotation={[0, -0.55, 0]} scale={2.15} />
        <Animal url={MODELS.lion} position={[-2.8, 0.04, -7.2]} rotation={[0, 0.28, 0]} scale={1.95} />
        <Animal url={MODELS.parrot} position={[3.7, 4.8, -9.5]} rotation={[0, -0.3, 0]} scale={1.25} />
        <Animal url={MODELS.monkey} position={[4.3, 0.1, -20.4]} rotation={[0, -0.6, 0]} scale={1.85} />
        <Animal url={MODELS.tiger} position={[-4.1, 0.06, -27.8]} rotation={[0, 0.45, 0]} scale={1.9} />
        <Animal url={MODELS.lion} position={[3.8, 0.05, -42.2]} rotation={[0, -0.45, 0]} scale={2.05} />
        <Animal url={MODELS.elephant} position={[-4.3, 0.04, -45.2]} rotation={[0, 0.42, 0]} scale={2.0} />
      </Suspense>

      <Sparkles count={170} scale={[28, 12, 68]} position={[0, 4, -24]} size={2.4} speed={0.16} noise={1.8} color="#e8cc87" />
      <ContactShadows position={[0, 0.03, -10]} opacity={0.42} scale={30} blur={2.4} far={14} />
      <CameraRig />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.85} luminanceThreshold={0.55} luminanceSmoothing={0.45} mipmapBlur />
        <Noise opacity={0.018} />
        <Vignette eskil={false} offset={0.08} darkness={0.82} />
      </EffectComposer>
    </>
  );
}

export default function SafariScene() {
  return (
    <div className="webgl-stage" aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 1.65]}
        camera={{ position: [0, 3, 13], fov: 46, near: 0.1, far: 120 }}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      >
        <World />
      </Canvas>
    </div>
  );
}

Object.values(MODELS).forEach((url) => useGLTF.preload(url));
