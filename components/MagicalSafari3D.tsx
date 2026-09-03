"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import styles from "./MagicalSafari.module.css";

type Locale = "en" | "es";
type Attendance = "yes" | "no";
type RoleKey = "lion" | "elephant" | "giraffe" | "monkey" | "parrot" | "tiger";

type SafariRole = {
  key: RoleKey;
  animal: string;
  animalEs: string;
  role: string;
  roleEs: string;
  line: string;
  lineEs: string;
  model: string;
  accent: string;
};

const EVENT_START = new Date("2026-09-20T17:00:00-04:00");
const EVENT_END = new Date("2026-09-20T20:00:00-04:00");
const SUPABASE_URL = "https://sqchlnhkceztcznkjctg.supabase.co";
const SUPABASE_KEY = "sb_publishable_eyhxdWjBo_b65URp-R4l7w_4q4Ltxkc";
const WHATSAPP_NUMBER = "17546106574";
const MAP_URL = "https://www.google.com/maps/search/?api=1&query=581%20Kathy%20Lane%2C%20Margate%2C%20FL%2033068";
const MODEL_ROOT = "https://raw.githubusercontent.com/xiaojilele-glitch/WhyBuddy/main/client/public/kenney_cube-pets_1.0/Models/GLB%20format/";

const ROLES: SafariRole[] = [
  { key: "lion", animal: "Lion", animalEs: "León", role: "Pride Guardian", roleEs: "Guardián de la Manada", line: "You carry courage into every trail.", lineEs: "Llevas valentía a cada sendero.", model: "animal-lion.glb", accent: "#b8733e" },
  { key: "elephant", animal: "Elephant", animalEs: "Elefante", role: "Memory Keeper", roleEs: "Guardián de los Recuerdos", line: "You protect the moments worth remembering.", lineEs: "Proteges los momentos que merecen recordarse.", model: "animal-elephant.glb", accent: "#808781" },
  { key: "giraffe", animal: "Giraffe", animalEs: "Jirafa", role: "Sky Watcher", roleEs: "Vigía del Cielo", line: "You see the wonder before everyone else.", lineEs: "Ves la maravilla antes que los demás.", model: "animal-giraffe.glb", accent: "#c58b4b" },
  { key: "monkey", animal: "Monkey", animalEs: "Mono", role: "Canopy Messenger", roleEs: "Mensajero del Dosel", line: "You bring movement, laughter and surprise.", lineEs: "Llevas movimiento, alegría y sorpresa.", model: "animal-monkey.glb", accent: "#78503a" },
  { key: "parrot", animal: "Parrot", animalEs: "Loro", role: "Voice of the Wild", roleEs: "Voz de la Selva", line: "You make sure the whole jungle hears the celebration.", lineEs: "Te aseguras de que toda la selva escuche la celebración.", model: "animal-parrot.glb", accent: "#557d5c" },
  { key: "tiger", animal: "Wild Cat", animalEs: "Felino Salvaje", role: "Golden Trail Scout", roleEs: "Explorador del Sendero Dorado", line: "You move through the adventure with fearless curiosity.", lineEs: "Recorres la aventura con curiosidad sin miedo.", model: "animal-tiger.glb", accent: "#d0a04d" },
];

const copy = {
  en: {
    enterTop: "A PRIVATE WILD ONE EXPERIENCE",
    enterTitle: "Alexis Alessandro's jungle is ready.",
    enterBody: "Step through the balloon arch. Your safari identity will be chosen as the world opens around you.",
    enter: "ENTER THE SAFARI",
    loading: "PREPARING THE JUNGLE",
    revealTop: "THE JUNGLE HAS CHOSEN YOU",
    revealBody: "This companion is yours for every return to the invitation.",
    continue: "BEGIN MY EXPEDITION",
    heroTop: "ONE YEAR · ONE EXTRAORDINARY WORLD",
    heroTitle: "Wild One",
    heroBody: "A daylight safari celebration created for Alexis Alessandro.",
    date: "SEPTEMBER 20 · 2026 · 5:00 PM",
    identity: "YOUR JUNGLE IDENTITY",
    itineraryTop: "YOUR INVITATION IS INSIDE THE WORLD",
    itineraryTitle: "Follow the golden trail.",
    itineraryBody: "Every stop unlocks a piece of Alexis' celebration: the destination, your calendar, the countdown and your private Safari Pass.",
    when: "WHEN",
    where: "WHERE",
    dress: "SAFARI CHIC",
    dateValue: "Sunday · September 20, 2026 · 5:00 PM",
    whereValue: "581 Kathy Lane · Margate, Florida 33068",
    dressValue: "Sage · Sand · Ivory · Khaki · Earth tones",
    map: "OPEN THE ROUTE",
    calendarTop: "LOCK THE ADVENTURE INTO YOUR DAY",
    calendarTitle: "Add Alexis' Wild One to your calendar.",
    calendarBody: "One tap and the date, time and destination travel with you.",
    apple: "APPLE / ICS",
    google: "GOOGLE CALENDAR",
    outlook: "OUTLOOK",
    countdownTop: "THE JUNGLE IS COUNTING WITH YOU",
    countdownTitle: "The Wild One begins in",
    days: "DAYS", hours: "HOURS", minutes: "MINUTES", seconds: "SECONDS",
    rsvpTop: "YOUR FINAL CHECKPOINT",
    rsvpTitle: "Forge your Safari Pass.",
    rsvpBody: "Confirm your attendance and your assigned animal becomes part of your personal pass.",
    name: "EXPLORER NAME",
    placeholder: "Your name",
    yes: "I WILL ATTEND",
    no: "I CAN'T ATTEND",
    submit: "FORGE MY PASS",
    sending: "FORGING…",
    whatsapp: "CONFIRM THROUGH WHATSAPP",
    share: "SHARE MY SAFARI ROLE",
    passTop: "ALEXIS ALESSANDRO · WILD ONE",
    passAccess: "PRIVATE SAFARI PASS",
    passStatusYes: "CLEARED FOR THE EXPEDITION",
    passStatusNo: "WITH THE JUNGLE FROM AFAR",
    close: "RETURN TO THE JUNGLE",
    finaleTop: "YOUR TRAIL IS COMPLETE",
    finaleTitle: "See you in the wild.",
    finaleBody: "Your animal, your pass and your invitation will be waiting whenever you return.",
    soundOn: "SOUND ON",
    soundOff: "SOUND OFF",
  },
  es: {
    enterTop: "UNA EXPERIENCIA WILD ONE PRIVADA",
    enterTitle: "La selva de Alexis Alessandro está lista.",
    enterBody: "Cruza el arco de globos. Tu identidad safari será elegida mientras el mundo se abre a tu alrededor.",
    enter: "ENTRAR AL SAFARI",
    loading: "PREPARANDO LA SELVA",
    revealTop: "LA SELVA TE HA ELEGIDO",
    revealBody: "Este compañero será tuyo cada vez que regreses a la invitación.",
    continue: "COMENZAR MI EXPEDICIÓN",
    heroTop: "UN AÑO · UN MUNDO EXTRAORDINARIO",
    heroTitle: "Wild One",
    heroBody: "Una celebración safari luminosa creada para Alexis Alessandro.",
    date: "20 DE SEPTIEMBRE · 2026 · 5:00 PM",
    identity: "TU IDENTIDAD DE LA SELVA",
    itineraryTop: "TU INVITACIÓN VIVE DENTRO DE ESTE MUNDO",
    itineraryTitle: "Sigue el sendero dorado.",
    itineraryBody: "Cada parada desbloquea una parte de la celebración de Alexis: destino, calendario, cuenta regresiva y tu Safari Pass privado.",
    when: "CUÁNDO",
    where: "DÓNDE",
    dress: "SAFARI CHIC",
    dateValue: "Domingo · 20 de septiembre de 2026 · 5:00 PM",
    whereValue: "581 Kathy Lane · Margate, Florida 33068",
    dressValue: "Salvia · Arena · Marfil · Caqui · Tonos tierra",
    map: "ABRIR LA RUTA",
    calendarTop: "GUARDA LA AVENTURA EN TU DÍA",
    calendarTitle: "Añade el Wild One de Alexis a tu calendario.",
    calendarBody: "Un toque y la fecha, hora y destino viajan contigo.",
    apple: "APPLE / ICS",
    google: "GOOGLE CALENDAR",
    outlook: "OUTLOOK",
    countdownTop: "LA SELVA CUENTA CONTIGO",
    countdownTitle: "El Wild One comienza en",
    days: "DÍAS", hours: "HORAS", minutes: "MINUTOS", seconds: "SEGUNDOS",
    rsvpTop: "TU ÚLTIMO PUNTO DE CONTROL",
    rsvpTitle: "Crea tu Safari Pass.",
    rsvpBody: "Confirma tu asistencia y tu animal asignado formará parte de tu pase personal.",
    name: "NOMBRE DEL EXPLORADOR",
    placeholder: "Tu nombre",
    yes: "ASISTIRÉ",
    no: "NO PODRÉ ASISTIR",
    submit: "CREAR MI PASE",
    sending: "CREANDO…",
    whatsapp: "CONFIRMAR POR WHATSAPP",
    share: "COMPARTIR MI ROL SAFARI",
    passTop: "ALEXIS ALESSANDRO · WILD ONE",
    passAccess: "SAFARI PASS PRIVADO",
    passStatusYes: "AUTORIZADO PARA LA EXPEDICIÓN",
    passStatusNo: "CON LA SELVA DESDE LA DISTANCIA",
    close: "VOLVER A LA SELVA",
    finaleTop: "TU SENDERO ESTÁ COMPLETO",
    finaleTitle: "Nos vemos en la selva.",
    finaleBody: "Tu animal, tu pase y tu invitación estarán esperándote cada vez que regreses.",
    soundOn: "SONIDO ACTIVO",
    soundOff: "SONIDO APAGADO",
  },
} as const;

function createToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function hashToken(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) h = Math.imul(h ^ value.charCodeAt(i), 16777619);
  return Math.abs(h >>> 0);
}

function pad(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function escapeICS(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

function utcStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export default function MagicalSafari3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [locale, setLocale] = useState<Locale>("en");
  const [entered, setEntered] = useState(false);
  const [worldReady, setWorldReady] = useState(false);
  const [roleReveal, setRoleReveal] = useState(false);
  const [attendance, setAttendance] = useState<Attendance>("yes");
  const [guestName, setGuestName] = useState("");
  const [guestToken, setGuestToken] = useState("");
  const [role, setRole] = useState<SafariRole>(ROLES[0]);
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [soundOn, setSoundOn] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [trail, setTrail] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const t = copy[locale];
  const roleAnimal = locale === "es" ? role.animalEs : role.animal;
  const roleName = locale === "es" ? role.roleEs : role.role;
  const roleLine = locale === "es" ? role.lineEs : role.line;

  useEffect(() => {
    const initialLocale: Locale = (localStorage.getItem("wild-one-locale") as Locale) || (navigator.language.toLowerCase().startsWith("es") ? "es" : "en");
    setLocale(initialLocale);
    let token = localStorage.getItem("wild-one-guest-token");
    if (!token) {
      token = createToken();
      localStorage.setItem("wild-one-guest-token", token);
    }
    setGuestToken(token);
    const storedRole = localStorage.getItem("wild-one-animal") as RoleKey | null;
    const chosen = storedRole ? ROLES.find((item) => item.key === storedRole) : ROLES[hashToken(token) % ROLES.length];
    const selected = chosen || ROLES[0];
    setRole(selected);
    localStorage.setItem("wild-one-animal", selected.key);
    const savedName = localStorage.getItem("wild-one-guest-name");
    if (savedName) setGuestName(savedName);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const total = Math.max(0, EVENT_START.getTime() - Date.now());
      setRemaining({
        days: Math.floor(total / 86400000),
        hours: Math.floor(total / 3600000) % 24,
        minutes: Math.floor(total / 60000) % 60,
        seconds: Math.floor(total / 1000) % 60,
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      setTrail(Math.min(5, Math.max(1, Math.floor((scrollY / max) * 5) + 1)));
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mountRef.current || !guestToken) return;
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xefe4cf);
    scene.fog = new THREE.FogExp2(0xe9ddc6, 0.018);

    const camera = new THREE.PerspectiveCamera(43, innerWidth / innerHeight, 0.1, 140);
    camera.position.set(0, 3.2, 17);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance", alpha: false });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.55));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff7df, 0x66745c, 2.3));
    const sun = new THREE.DirectionalLight(0xfff0c7, 4.6);
    sun.position.set(7, 13, 11);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1536, 1536);
    sun.shadow.camera.left = -14;
    sun.shadow.camera.right = 14;
    sun.shadow.camera.top = 14;
    sun.shadow.camera.bottom = -8;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xb9d2a5, 2.0);
    fill.position.set(-8, 7, 3);
    scene.add(fill);
    const sparkle = new THREE.PointLight(0xffd78c, 28, 22);
    sparkle.position.set(0, 5.5, 3.5);
    scene.add(sparkle);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(34, 96),
      new THREE.MeshStandardMaterial({ color: 0xcdbb9f, roughness: 0.98 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = -31;
    floor.receiveShadow = true;
    scene.add(floor);

    const rug = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 72),
      new THREE.MeshStandardMaterial({ color: 0xe9ddca, roughness: 1 })
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.015, -27);
    rug.receiveShadow = true;
    scene.add(rug);

    const backdrop = new THREE.Mesh(
      new THREE.BoxGeometry(10.8, 6.4, 0.3),
      new THREE.MeshPhysicalMaterial({ color: 0xfffbef, roughness: 0.72, clearcoat: 0.16 })
    );
    backdrop.position.set(0, 3.35, 0.2);
    backdrop.receiveShadow = true;
    scene.add(backdrop);

    const greenCurtain = new THREE.Mesh(
      new THREE.BoxGeometry(11.6, 6.8, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x3f764f, roughness: 0.9 })
    );
    greenCurtain.position.set(0, 3.4, 0.5);
    scene.add(greenCurtain);
    backdrop.position.z = 0.7;

    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(7.6, 3.4, 0.18),
      new THREE.MeshPhysicalMaterial({ color: 0xfffdf5, roughness: 0.7, clearcoat: 0.22 })
    );
    sign.position.set(0, 3.65, 1.0);
    sign.castShadow = true;
    scene.add(sign);

    const makeCanvasTexture = (text: string, subtitle: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#fffdf4";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#315a3f";
      for (let i = 0; i < 34; i++) {
        const x = ((i * 137) % 1024) - 60;
        const y = ((i * 83) % 512) - 20;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((i % 7) * 0.17);
        ctx.beginPath();
        ctx.ellipse(0, 0, 25 + (i % 4) * 8, 65 + (i % 3) * 13, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = "rgba(255,253,244,.92)";
      ctx.fillRect(120, 115, 784, 270);
      ctx.textAlign = "center";
      ctx.fillStyle = "#b7793f";
      ctx.font = "700 72px Georgia";
      ctx.fillText(text, 512, 240);
      ctx.fillStyle = "#4d6a50";
      ctx.font = "600 38px Georgia";
      ctx.fillText(subtitle, 512, 305);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };
    sign.material = new THREE.MeshBasicMaterial({ map: makeCanvasTexture("ALEXIS ALESSANDRO", "WILD ONE · 20.09.2026") });

    const table = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 1.35, 2.0),
      new THREE.MeshStandardMaterial({ color: 0xf5ecda, roughness: 0.92 })
    );
    table.position.set(0, 1.05, 3.6);
    table.castShadow = true;
    scene.add(table);

    const cakeBase = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.88, 0.75, 48), new THREE.MeshPhysicalMaterial({ color: 0xf8e9cc, roughness: 0.55, clearcoat: 0.25 }));
    cakeBase.position.set(0, 2.08, 3.45);
    cakeBase.castShadow = true;
    scene.add(cakeBase);
    const cakeTop = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.64, 0.58, 48), new THREE.MeshPhysicalMaterial({ color: 0xf2ddba, roughness: 0.55, clearcoat: 0.25 }));
    cakeTop.position.set(0, 2.72, 3.45);
    cakeTop.castShadow = true;
    scene.add(cakeTop);
    const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.55, 16), new THREE.MeshStandardMaterial({ color: 0xd7b25d, metalness: 0.45, roughness: 0.4 }));
    candle.position.set(0, 3.25, 3.45);
    scene.add(candle);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffc75a }));
    flame.scale.set(0.7, 1.4, 0.7);
    flame.position.set(0, 3.6, 3.45);
    flame.userData.flame = true;
    scene.add(flame);

    const giftColors = [0x9eb48f, 0xe8d7b6, 0xb98750, 0x607a5d];
    for (let i = 0; i < 9; i++) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.7 + (i % 3) * 0.18, 0.55 + (i % 2) * 0.3, 0.72), new THREE.MeshStandardMaterial({ color: giftColors[i % giftColors.length], roughness: 0.82 }));
      box.position.set(-3.2 + (i % 5) * 1.55, 1.95, 3.15 + Math.floor(i / 5) * 0.35);
      box.castShadow = true;
      scene.add(box);
    }

    const spotsCanvas = document.createElement("canvas");
    spotsCanvas.width = spotsCanvas.height = 256;
    const sctx = spotsCanvas.getContext("2d")!;
    sctx.fillStyle = "#d7aa67";
    sctx.fillRect(0, 0, 256, 256);
    sctx.fillStyle = "#7a4d32";
    for (let i = 0; i < 18; i++) {
      const x = (i * 73) % 256;
      const y = (i * 117) % 256;
      sctx.beginPath();
      sctx.ellipse(x, y, 18 + (i % 3) * 5, 22 + (i % 4) * 4, (i % 5) * 0.35, 0, Math.PI * 2);
      sctx.fill();
    }
    const giraffeTexture = new THREE.CanvasTexture(spotsCanvas);
    giraffeTexture.wrapS = giraffeTexture.wrapT = THREE.RepeatWrapping;
    giraffeTexture.repeat.set(1.3, 1.3);

    const balloonColors = [0x839b78, 0xaab99a, 0xf2e6d1, 0xd8b579, 0xb77842, 0x6d4934, 0x345f46];
    const balloonGroup = new THREE.Group();
    const random = (seed: number) => {
      const x = Math.sin(seed * 999.71) * 43758.5453;
      return x - Math.floor(x);
    };
    const addBalloon = (x: number, y: number, z: number, seed: number, printed = false) => {
      const size = 0.42 + random(seed + 2) * 0.55;
      const geo = new THREE.SphereGeometry(size, 22, 18);
      const material = printed
        ? new THREE.MeshPhysicalMaterial({ map: giraffeTexture, roughness: 0.48, clearcoat: 0.55, clearcoatRoughness: 0.28 })
        : new THREE.MeshPhysicalMaterial({ color: balloonColors[Math.floor(random(seed + 8) * balloonColors.length)], roughness: 0.48, clearcoat: 0.62, clearcoatRoughness: 0.25 });
      const mesh = new THREE.Mesh(geo, material);
      mesh.scale.set(0.95 + random(seed + 5) * 0.28, 1.08 + random(seed + 6) * 0.26, 0.96 + random(seed + 7) * 0.18);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.userData.balloon = true;
      mesh.userData.baseY = y;
      mesh.userData.phase = random(seed + 10) * Math.PI * 2;
      balloonGroup.add(mesh);
    };

    let seed = 1;
    for (let i = 0; i < 38; i++) {
      const a = Math.PI * (1.02 + (i / 37) * 0.96);
      const x = Math.cos(a) * 7.8;
      const y = 4.5 - Math.sin(a) * 4.0;
      for (let j = 0; j < (i % 4 === 0 ? 3 : 2); j++) {
        const dx = (random(seed++) - 0.5) * 1.15;
        const dy = (random(seed++) - 0.5) * 0.85;
        addBalloon(x + dx, y + dy, 2.3 + (random(seed++) - 0.5) * 1.2, seed++, (i + j) % 11 === 0);
      }
    }
    for (let i = 0; i < 16; i++) {
      const side = i % 2 ? 1 : -1;
      addBalloon(side * (7.4 + random(seed++) * 0.8), 1.0 + random(seed++) * 3.5, 2.3 + random(seed++) * 1.2, seed++, i % 7 === 0);
    }
    scene.add(balloonGroup);

    const makeLeaf = (x: number, y: number, z: number, ry: number, scale: number, color = 0x3d744d) => {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.72, 16, 10), new THREE.MeshStandardMaterial({ color, roughness: 0.92 }));
      leaf.scale.set(0.38 * scale, 1.2 * scale, 0.18 * scale);
      leaf.position.set(x, y, z);
      leaf.rotation.z = ry;
      leaf.castShadow = true;
      leaf.userData.leaf = true;
      leaf.userData.baseRotation = ry;
      scene.add(leaf);
    };
    for (let i = 0; i < 28; i++) {
      const side = i % 2 ? 1 : -1;
      makeLeaf(side * (5.2 + random(i) * 3.2), 0.8 + random(i + 30) * 6.7, 2.0 + random(i + 50) * 2.2, (random(i + 80) - 0.5) * 2.8, 0.75 + random(i + 100) * 1.4, i % 3 === 0 ? 0x59845b : 0x315f42);
    }

    const oneMat = new THREE.MeshPhysicalMaterial({ color: 0xd8b05c, metalness: 0.72, roughness: 0.24, clearcoat: 0.6 });
    const oneVertical = new THREE.Mesh(new THREE.BoxGeometry(0.85, 4.5, 0.8), oneMat);
    oneVertical.position.set(0.3, 2.35, -10.8);
    oneVertical.castShadow = true;
    scene.add(oneVertical);
    const oneTop = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.78, 0.8), oneMat);
    oneTop.position.set(-0.15, 4.08, -10.8);
    oneTop.rotation.z = -0.55;
    oneTop.castShadow = true;
    scene.add(oneTop);
    const oneBase = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.75, 0.8), oneMat);
    oneBase.position.set(0.3, 0.42, -10.8);
    oneBase.castShadow = true;
    scene.add(oneBase);
    const roleLight = new THREE.SpotLight(new THREE.Color(role.accent), 48, 18, 0.58, 0.72, 1.1);
    roleLight.position.set(0, 8, -6);
    roleLight.target.position.set(0, 2, -11);
    scene.add(roleLight, roleLight.target);

    const loader = new GLTFLoader();
    const animatedAnimals: THREE.Object3D[] = [];
    const loadAnimal = (item: SafariRole, position: [number, number, number], targetHeight: number, rotation: number, companion = false) => {
      loader.load(`${MODEL_ROOT}${item.model}`, (gltf) => {
        const object = gltf.scene;
        object.traverse((node) => {
          const mesh = node as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            const material = mesh.material as THREE.MeshStandardMaterial;
            if (material && !Array.isArray(material)) {
              material.roughness = Math.min(0.78, material.roughness ?? 0.7);
              material.metalness = 0;
            }
          }
        });
        let bounds = new THREE.Box3().setFromObject(object);
        const size = bounds.getSize(new THREE.Vector3());
        const factor = targetHeight / Math.max(size.y, 0.001);
        object.scale.setScalar(factor);
        bounds = new THREE.Box3().setFromObject(object);
        object.position.set(position[0], position[1] - bounds.min.y, position[2]);
        object.rotation.y = rotation;
        object.userData.animal = true;
        object.userData.baseY = object.position.y;
        object.userData.phase = Math.random() * Math.PI * 2;
        object.userData.companion = companion;
        animatedAnimals.push(object);
        scene.add(object);
      });
    };

    loadAnimal(ROLES[2], [-5.4, 0, 5.2], 5.3, 0.4);
    loadAnimal(ROLES[1], [5.0, 0, 5.3], 2.9, -0.62);
    loadAnimal(ROLES[0], [-3.4, 0, 4.0], 2.15, 0.32);
    loadAnimal(ROLES[4], [4.0, 4.9, 1.4], 1.0, -0.5);
    loadAnimal(ROLES[3], [5.2, 0, -5.8], 1.8, -0.68);
    loadAnimal(ROLES[5], [-4.7, 0, -19.5], 2.3, 0.5);
    loadAnimal(role, [2.3, 0, -11.3], 3.1, -0.42, true);

    const archLight = new THREE.PointLight(0xffd69a, 22, 16);
    archLight.position.set(0, 5.5, 6.3);
    scene.add(archLight);

    const firefliesGeometry = new THREE.BufferGeometry();
    const fireflyCount = 180;
    const positions = new Float32Array(fireflyCount * 3);
    for (let i = 0; i < fireflyCount; i++) {
      positions[i * 3] = (random(i + 400) - 0.5) * 20;
      positions[i * 3 + 1] = 1 + random(i + 600) * 7;
      positions[i * 3 + 2] = 9 - random(i + 800) * 62;
    }
    firefliesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const fireflies = new THREE.Points(firefliesGeometry, new THREE.PointsMaterial({ color: 0xf2c968, size: 0.055, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(fireflies);

    const clock = new THREE.Clock();
    let pointerX = 0;
    let pointerY = 0;
    let intro = 0;
    let raf = 0;
    const pointer = (event: PointerEvent) => {
      pointerX = (event.clientX / innerWidth - 0.5) * 2;
      pointerY = (event.clientY / innerHeight - 0.5) * 2;
    };
    addEventListener("pointermove", pointer);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const now = clock.getElapsedTime();
      if (entered) intro = Math.min(1, intro + 0.012);
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const scrollProgress = entered ? Math.min(1, scrollY / maxScroll) : 0;
      const introEase = 1 - Math.pow(1 - intro, 3);
      const startZ = 17 - introEase * 6;
      const z = startZ - scrollProgress * 54;
      const x = Math.sin(scrollProgress * Math.PI * 3.4) * 1.45 + pointerX * 0.42;
      const y = 3.05 + Math.sin(scrollProgress * Math.PI * 2.1) * 0.45 - pointerY * 0.17;
      camera.position.lerp(new THREE.Vector3(x, y, z), 0.06);
      camera.lookAt(new THREE.Vector3(pointerX * 0.16, 2.55 - pointerY * 0.12, z - 8.8));

      balloonGroup.children.forEach((child) => {
        child.position.y = child.userData.baseY + Math.sin(now * 0.75 + child.userData.phase) * 0.055;
        child.rotation.y += 0.0007;
      });
      animatedAnimals.forEach((animal) => {
        animal.position.y = animal.userData.baseY + Math.sin(now * 0.8 + animal.userData.phase) * (animal.userData.companion ? 0.035 : 0.018);
        if (animal.userData.companion) animal.rotation.y += Math.sin(now * 0.4) * 0.0008;
      });
      scene.traverse((object) => {
        if (object.userData.leaf) object.rotation.z = object.userData.baseRotation + Math.sin(now * 0.7 + object.position.x) * 0.035;
        if (object.userData.flame) {
          object.scale.y = 1.25 + Math.sin(now * 7) * 0.16;
          object.position.x = Math.sin(now * 5) * 0.025;
        }
      });
      fireflies.rotation.y = now * 0.012;
      fireflies.position.y = Math.sin(now * 0.35) * 0.08;
      renderer.render(scene, camera);
    };
    animate();
    setWorldReady(true);

    const resize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.55));
    };
    addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", pointer);
      renderer.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((material) => material.dispose());
        }
      });
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, [guestToken, role, entered]);

  useEffect(() => {
    if (!entered) return;
    const timer = window.setTimeout(() => setRoleReveal(true), 1900);
    return () => window.clearTimeout(timer);
  }, [entered]);

  const whatsappHref = useMemo(() => {
    const name = guestName.trim() || (locale === "es" ? "_____" : "_____");
    const message = locale === "es"
      ? `Hola, confirmo mi asistencia al Wild One de Alexis Alessandro. Soy ${name}. La selva me asignó: ${roleAnimal} — ${roleName}.`
      : `Hi, I'm confirming my attendance for Alexis Alessandro's Wild One. I'm ${name}. The jungle assigned me: ${roleAnimal} — ${roleName}.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [guestName, locale, roleAnimal, roleName]);

  function toggleLocale() {
    const next: Locale = locale === "en" ? "es" : "en";
    setLocale(next);
    localStorage.setItem("wild-one-locale", next);
  }

  function toggleSound() {
    if (soundOn) {
      audioRef.current?.pause();
      setSoundOn(false);
      return;
    }
    if (!audioRef.current) {
      const audio = new Audio("https://actions.google.com/sounds/v1/ambiences/jungle_atmosphere_morning.ogg");
      audio.loop = true;
      audio.volume = 0.25;
      audioRef.current = audio;
    }
    audioRef.current.play().then(() => setSoundOn(true)).catch(() => setSoundOn(false));
  }

  function enterWorld() {
    setEntered(true);
    if (!soundOn) toggleSound();
  }

  function downloadICS() {
    const title = "Alexis Alessandro — Wild One";
    const description = locale === "es" ? `Celebración Wild One de Alexis Alessandro. Tu compañero safari: ${roleAnimal} — ${roleName}.` : `Alexis Alessandro's Wild One celebration. Your safari companion: ${roleAnimal} — ${roleName}.`;
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Alexis Wild One//Safari Invitation//EN", "BEGIN:VEVENT",
      `UID:${guestToken || "alexis-wild-one"}@wild-one`, `DTSTAMP:${utcStamp(new Date())}`, `DTSTART:${utcStamp(EVENT_START)}`, `DTEND:${utcStamp(EVENT_END)}`,
      `SUMMARY:${escapeICS(title)}`, `DESCRIPTION:${escapeICS(description)}`, `LOCATION:${escapeICS("581 Kathy Lane, Margate, FL 33068")}`,
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "alexis-alessandro-wild-one.ics";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function openGoogleCalendar() {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Alexis Alessandro — Wild One",
      dates: `${utcStamp(EVENT_START)}/${utcStamp(EVENT_END)}`,
      location: "581 Kathy Lane, Margate, FL 33068",
      details: `${roleAnimal} — ${roleName} · Alexis Alessandro's Wild One`,
    });
    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, "_blank", "noopener,noreferrer");
  }

  function openOutlook() {
    const params = new URLSearchParams({
      path: "/calendar/action/compose",
      rru: "addevent",
      subject: "Alexis Alessandro — Wild One",
      startdt: EVENT_START.toISOString(),
      enddt: EVENT_END.toISOString(),
      location: "581 Kathy Lane, Margate, FL 33068",
      body: `${roleAnimal} — ${roleName}`,
    });
    window.open(`https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`, "_blank", "noopener,noreferrer");
  }

  async function shareRole() {
    const text = locale === "es"
      ? `La selva me asignó ${roleAnimal} — ${roleName} para el Wild One de Alexis Alessandro.`
      : `The jungle assigned me ${roleAnimal} — ${roleName} for Alexis Alessandro's Wild One.`;
    if (navigator.share) {
      await navigator.share({ title: "Alexis Alessandro — Wild One", text, url: location.href }).catch(() => undefined);
    } else {
      await navigator.clipboard.writeText(`${text} ${location.href}`).catch(() => undefined);
    }
  }

  async function submitRSVP(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = guestName.trim();
    if (name.length < 2) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/wild_one_rsvps`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          guest_name: name,
          attendance,
          locale,
          event_slug: "alexis-wild-one",
          animal_key: role.key,
          animal_role: roleName,
          guest_token: guestToken,
        }),
      });
      if (!response.ok) throw new Error("RSVP failed");
      localStorage.setItem("wild-one-guest-name", name);
      localStorage.setItem("wild-one-rsvp", attendance);
      setPassOpen(true);
    } catch {
      setError(locale === "es" ? "No pudimos guardar el RSVP. Puedes confirmar por WhatsApp." : "We couldn't save the RSVP. You can still confirm through WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.experience} style={{ ["--role" as string]: role.accent }}>
      <div ref={mountRef} className={styles.webgl} aria-hidden="true" />

      {!entered && (
        <div className={styles.gate}>
          <div className={styles.gateGlass}>
            <div className={styles.monogram}><span>A</span><b>1</b></div>
            <p className={styles.kicker}>{t.enterTop}</p>
            <h1>{t.enterTitle}</h1>
            <p className={styles.body}>{t.enterBody}</p>
            <button className={styles.primary} onClick={enterWorld} disabled={!worldReady}>{worldReady ? t.enter : t.loading}</button>
          </div>
        </div>
      )}

      <div className={styles.hud}>
        <div className={styles.roleChip}><span>{roleAnimal}</span><b>{roleName}</b></div>
        <div className={styles.hudActions}>
          <button onClick={toggleLocale}>{locale === "en" ? "ES" : "EN"}</button>
          <button onClick={toggleSound}>{soundOn ? t.soundOff : t.soundOn}</button>
        </div>
      </div>

      <div className={styles.trailHud} aria-label="Expedition progress">
        {[1,2,3,4,5].map((step) => <i key={step} className={step <= trail ? styles.trailOn : ""} />)}
      </div>

      {roleReveal && (
        <div className={styles.revealOverlay}>
          <div className={styles.revealCard}>
            <p className={styles.kicker}>{t.revealTop}</p>
            <div className={styles.animalName}>{roleAnimal}</div>
            <h2>{roleName}</h2>
            <p className={styles.roleQuote}>{roleLine}</p>
            <p className={styles.body}>{t.revealBody}</p>
            <button className={styles.primary} onClick={() => setRoleReveal(false)}>{t.continue}</button>
          </div>
        </div>
      )}

      <main className={styles.story}>
        <section className={`${styles.scene} ${styles.centerScene}`}>
          <div className={`${styles.panel} ${styles.heroPanel}`}>
            <p className={styles.kicker}>{t.heroTop}</p>
            <h2 className={styles.wildOne}>{t.heroTitle}</h2>
            <p className={styles.body}>{t.heroBody}</p>
            <p className={styles.date}>{t.date}</p>
            <div className={styles.identityInline}><span>{t.identity}</span><strong>{roleAnimal}</strong><em>{roleName}</em></div>
          </div>
        </section>

        <section className={`${styles.scene} ${styles.leftScene}`}>
          <div className={styles.panel}>
            <p className={styles.kicker}>{t.itineraryTop}</p>
            <h3>{t.itineraryTitle}</h3>
            <p className={styles.body}>{t.itineraryBody}</p>
            <div className={styles.details}>
              <div><span>{t.when}</span><strong>{t.dateValue}</strong></div>
              <div><span>{t.where}</span><strong>{t.whereValue}</strong></div>
              <div><span>{t.dress}</span><strong>{t.dressValue}</strong></div>
            </div>
            <a className={styles.secondary} href={MAP_URL} target="_blank" rel="noreferrer">{t.map}</a>
          </div>
        </section>

        <section className={`${styles.scene} ${styles.rightScene}`}>
          <div className={styles.panel}>
            <p className={styles.kicker}>{t.calendarTop}</p>
            <h3>{t.calendarTitle}</h3>
            <p className={styles.body}>{t.calendarBody}</p>
            <div className={styles.calendarGrid}>
              <button onClick={downloadICS}>{t.apple}</button>
              <button onClick={openGoogleCalendar}>{t.google}</button>
              <button onClick={openOutlook}>{t.outlook}</button>
            </div>
          </div>
        </section>

        <section className={`${styles.scene} ${styles.centerScene}`}>
          <div className={styles.panel}>
            <p className={styles.kicker}>{t.countdownTop}</p>
            <h3>{t.countdownTitle}</h3>
            <div className={styles.countdown}>
              <div><strong>{pad(remaining.days)}</strong><span>{t.days}</span></div>
              <div><strong>{pad(remaining.hours)}</strong><span>{t.hours}</span></div>
              <div><strong>{pad(remaining.minutes)}</strong><span>{t.minutes}</span></div>
              <div><strong>{pad(remaining.seconds)}</strong><span>{t.seconds}</span></div>
            </div>
          </div>
        </section>

        <section className={`${styles.scene} ${styles.rightScene}`}>
          <div className={styles.panel}>
            <p className={styles.kicker}>{t.rsvpTop}</p>
            <h3>{t.rsvpTitle}</h3>
            <p className={styles.body}>{t.rsvpBody}</p>
            <div className={styles.rolePassportPreview}>
              <span>{roleAnimal}</span><strong>{roleName}</strong><em>A1 · {role.key.toUpperCase()} · 20.09.26</em>
            </div>
            <form onSubmit={submitRSVP} className={styles.form}>
              <label>{t.name}</label>
              <input value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder={t.placeholder} minLength={2} maxLength={120} required />
              <div className={styles.choice}>
                <button type="button" className={attendance === "yes" ? styles.choiceActive : ""} onClick={() => setAttendance("yes")}>{t.yes}</button>
                <button type="button" className={attendance === "no" ? styles.choiceActive : ""} onClick={() => setAttendance("no")}>{t.no}</button>
              </div>
              <button className={styles.primary} type="submit" disabled={submitting}>{submitting ? t.sending : t.submit}</button>
              <a className={styles.whatsapp} href={whatsappHref} target="_blank" rel="noreferrer">{t.whatsapp}</a>
              {error && <p className={styles.error}>{error}</p>}
            </form>
          </div>
        </section>

        <section className={`${styles.scene} ${styles.centerScene}`}>
          <div className={`${styles.panel} ${styles.finalePanel}`}>
            <p className={styles.kicker}>{t.finaleTop}</p>
            <h3>{t.finaleTitle}</h3>
            <p className={styles.body}>{t.finaleBody}</p>
            <button className={styles.secondaryButton} onClick={shareRole}>{t.share}</button>
          </div>
        </section>
      </main>

      {passOpen && (
        <div className={styles.passOverlay}>
          <div className={styles.passCard}>
            <p className={styles.kicker}>{t.passTop}</p>
            <div className={styles.passSeal}><span>A</span><b>1</b></div>
            <small>{t.passAccess}</small>
            <h2>{guestName}</h2>
            <div className={styles.passAnimal}><strong>{roleAnimal}</strong><span>{roleName}</span></div>
            <p>{attendance === "yes" ? t.passStatusYes : t.passStatusNo}</p>
            <div className={styles.passMeta}>20 · 09 · 2026 · MARGATE, FL</div>
            <div className={styles.passActions}>
              <button onClick={downloadICS}>{t.apple}</button>
              <button onClick={shareRole}>{t.share}</button>
            </div>
            <button className={styles.primary} onClick={() => setPassOpen(false)}>{t.close}</button>
          </div>
        </div>
      )}
    </div>
  );
}
