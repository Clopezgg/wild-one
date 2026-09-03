export type AnimalKey =
  | "lion"
  | "elephant"
  | "giraffe"
  | "monkey"
  | "parrot"
  | "zebra"
  | "leopard";

export type SafariRole = {
  key: AnimalKey;
  animal: { en: string; es: string };
  role: { en: string; es: string };
  route: { en: string; es: string };
  accent: string;
  terrain: "savanna" | "water" | "sky" | "canopy" | "echo" | "stripe" | "shadow";
};

export const safariRoles: readonly SafariRole[] = [
  { key: "lion", animal: { en: "Lion", es: "León" }, role: { en: "Pride Guardian", es: "Guardián de la Manada" }, route: { en: "Pride Trail", es: "Sendero de la Manada" }, accent: "#d49a45", terrain: "savanna" },
  { key: "elephant", animal: { en: "Elephant", es: "Elefante" }, role: { en: "Memory Keeper", es: "Guardián de los Recuerdos" }, route: { en: "Memory Trail", es: "Sendero de los Recuerdos" }, accent: "#789c91", terrain: "water" },
  { key: "giraffe", animal: { en: "Giraffe", es: "Jirafa" }, role: { en: "Sky Watcher", es: "Vigía del Cielo" }, route: { en: "Sky Trail", es: "Sendero del Cielo" }, accent: "#c78b43", terrain: "sky" },
  { key: "monkey", animal: { en: "Monkey", es: "Mono" }, role: { en: "Canopy Messenger", es: "Mensajero del Dosel" }, route: { en: "Canopy Trail", es: "Sendero del Dosel" }, accent: "#91684d", terrain: "canopy" },
  { key: "parrot", animal: { en: "Parrot", es: "Loro" }, role: { en: "Voice of the Wild", es: "Voz de la Selva" }, route: { en: "Echo Trail", es: "Sendero del Eco" }, accent: "#4d9771", terrain: "echo" },
  { key: "zebra", animal: { en: "Zebra", es: "Cebra" }, role: { en: "Stripe Trail Explorer", es: "Explorador de Rayas" }, route: { en: "Stripe Trail", es: "Sendero de Rayas" }, accent: "#d8d2c5", terrain: "stripe" },
  { key: "leopard", animal: { en: "Leopard", es: "Leopardo" }, role: { en: "Golden Trail Scout", es: "Explorador Dorado" }, route: { en: "Golden Shadow Trail", es: "Sendero de la Sombra Dorada" }, accent: "#d8a74e", terrain: "shadow" },
] as const;

export function roleForKey(key: string | null | undefined) {
  return safariRoles.find((role) => role.key === key) ?? safariRoles[0];
}

export function stableRole(token: string) {
  let hash = 2166136261;
  for (let index = 0; index < token.length; index += 1) {
    hash = Math.imul(hash ^ token.charCodeAt(index), 16777619);
  }
  return safariRoles[(hash >>> 0) % safariRoles.length];
}

