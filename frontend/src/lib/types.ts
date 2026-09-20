// Types partagés — reflètent le schéma d'événement d'usage IA défini dans le
// brief (partie publique = ce qui ira on-chain, partie privée = ce qui reste
// chiffré / hors-chaîne et n'est visible qu'avec une viewing key).

export type Department = "engineering" | "hr" | "finance" | "marketing" | "legal";

export type Tool =
  | "chatgpt-enterprise"
  | "copilot-business"
  | "claude-team"
  | "chatgpt.com" // non approuvé
  | "gemini"; // non approuvé

export const APPROVED_TOOLS: Tool[] = ["chatgpt-enterprise", "copilot-business", "claude-team"];

export type DataCategory = "code" | "pii" | "financial" | "customer_data" | "general";

/** Partie publique d'un événement — ce qui sera stocké on-chain (voir PublicEventData dans le contrat). */
export interface UsageEventPublic {
  tool: Tool;
  department: Department;
  timestamp: number; // epoch seconds
  policyVersion: number;
}

/** Partie privée — chiffrée / accessible uniquement via une viewing key (simulée ici). */
export interface UsageEventPrivate {
  userId: string;
  dataCategories: DataCategory[];
  hasPII: boolean;
  promptHash: string;
}

export interface UsageEvent {
  id: string; // = commitment (fictif, pour la démo)
  public: UsageEventPublic;
  private: UsageEventPrivate;
}

export interface PolicySummary {
  version: number;
  approvedTools: Tool[];
  rules: string[];
}
