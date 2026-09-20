import type { UsageEvent, Department, Tool, DataCategory, PolicySummary } from "./types";
import { APPROVED_TOOLS } from "./types";

// Générateur déterministe (pas de Math.random direct) pour que la démo soit
// stable d'un rendu à l'autre. Remplace `scripts/generate-mock-events.ts`
// pour ce premier passage frontend — ce script-là servira plus tard côté
// backend pour rejouer des logs plus réalistes.

const DEPARTMENTS: Department[] = ["engineering", "hr", "finance", "marketing", "legal"];
const TOOLS: Tool[] = ["chatgpt-enterprise", "copilot-business", "claude-team", "chatgpt.com", "gemini"];
const CATEGORIES: DataCategory[] = ["code", "pii", "financial", "customer_data", "general"];

const FIRST_NAMES = ["Alice", "Baraka", "Chidi", "Diane", "Eloise", "Farid", "Grace", "Hugo", "Imani", "Jamal"];

function seededHash(seed: number): number {
  // petit générateur pseudo-aléatoire déterministe (xorshift-like), suffisant pour de la démo
  let x = seed * 2654435761 + 1;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return Math.abs(x) % 1000;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seededHash(seed) % arr.length];
}

const NOW = Math.floor(new Date("2026-09-19T12:00:00Z").getTime() / 1000);
const DAY = 24 * 60 * 60;

function buildEvent(i: number): UsageEvent {
  const department = pick(DEPARTMENTS, i * 7 + 1);
  const tool = pick(TOOLS, i * 13 + 2);
  const daysAgo = seededHash(i * 3 + 5) % 30;
  const timestamp = NOW - daysAgo * DAY - (seededHash(i * 11) % DAY);

  // Règles fictives de la politique v3 : PII un peu plus fréquent en RH/finance ;
  // certains départements utilisent parfois des outils non approuvés.
  const piiRoll = seededHash(i * 17 + 9) % 100;
  const hasPII = (department === "hr" || department === "finance") ? piiRoll < 22 : piiRoll < 8;

  const nCategories = 1 + (seededHash(i * 19) % 2);
  const dataCategories: DataCategory[] = [];
  for (let c = 0; c < nCategories; c++) {
    const cat = pick(CATEGORIES, i * 23 + c * 29);
    if (!dataCategories.includes(cat)) dataCategories.push(cat);
  }
  if (hasPII && !dataCategories.includes("pii")) dataCategories.push("pii");

  const user = pick(FIRST_NAMES, i * 31 + 4);

  return {
    id: `evt_${i.toString(16).padStart(6, "0")}`,
    public: { tool, department, timestamp, policyVersion: 3 },
    private: {
      userId: `u_${user.toLowerCase()}_${100 + (i % 37)}`,
      dataCategories,
      hasPII,
      promptHash: `0x${(i * 2654435761).toString(16).padStart(16, "0")}`,
    },
  };
}

export const MOCK_EVENTS: UsageEvent[] = Array.from({ length: 42 }, (_, i) => buildEvent(i)).sort(
  (a, b) => b.public.timestamp - a.public.timestamp,
);

export const MOCK_POLICY: PolicySummary = {
  version: 3,
  approvedTools: APPROVED_TOOLS,
  rules: [
    "Seuls les outils approuvés (ChatGPT Enterprise, Copilot Business, Claude Team) peuvent traiter des données de l'entreprise.",
    "Aucune donnée personnelle (PII) ne doit être envoyée à un outil IA, même approuvé.",
    "Le code source propriétaire ne doit pas être partagé avec des outils IA non approuvés.",
  ],
};

/** Un événement est "conforme" s'il utilise un outil approuvé et ne contient pas de PII. */
export function isCompliant(event: UsageEvent): boolean {
  return APPROVED_TOOLS.includes(event.public.tool) && !event.private.hasPII;
}
