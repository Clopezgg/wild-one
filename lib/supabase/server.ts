import "server-only";
import { createHash, randomBytes } from "node:crypto";

const projectUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://sqchlnhkceztcznkjctg.supabase.co";
const serverKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const edgeUrl = `${projectUrl}/functions/v1/wild-one-expedition`;

export const hasDirectSupabase = Boolean(serverKey);
export const hasExpeditionStore = true;
export const hasRsvpStore = true;

export function newGuestToken() {
  return randomBytes(32).toString("base64url");
}

export function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function explorerCode() {
  return `WILD-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function supabaseRequest<T>(
  path: string,
  init: RequestInit = {},
  access: "secret" | "public" = "secret",
): Promise<T> {
  const key = access === "secret" ? serverKey : serverKey ?? publishableKey;
  if (!projectUrl || !key) throw new Error("Supabase is not configured for this operation");
  const response = await fetch(`${projectUrl}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase ${response.status}: ${detail.slice(0, 240)}`);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function expeditionEdgeRequest<T>(body: Record<string, unknown>): Promise<T> {
  const response = await fetch(edgeUrl, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Expedition service ${response.status}`);
  return await response.json() as T;
}
