// midnightClient.ts
// Point de branchement unique entre l'UI et la source de données.
//
// Aujourd'hui : renvoie les données fictives de mockData.ts.
// Demain : lira l'état réel du contrat AIUsageLedger via le SDK Midnight.js
// (indexer + wallet Lace), sans que les composants Dashboard/AuditView aient
// à changer — ils ne connaissent que les types de lib/types.ts.

import { MOCK_EVENTS, MOCK_POLICY, isCompliant } from "./mockData";
import type { UsageEvent, PolicySummary } from "./types";

export interface UsageLedgerClient {
  listEvents(): Promise<UsageEvent[]>;
  getPolicy(): Promise<PolicySummary>;
}

class MockUsageLedgerClient implements UsageLedgerClient {
  async listEvents(): Promise<UsageEvent[]> {
    // simule une petite latence réseau pour que l'état de chargement soit visible
    await new Promise((r) => setTimeout(r, 250));
    return MOCK_EVENTS;
  }

  async getPolicy(): Promise<PolicySummary> {
    return MOCK_POLICY;
  }
}

// À remplacer par un vrai client une fois le contrat déployé, ex. :
// class MidnightUsageLedgerClient implements UsageLedgerClient { ... }
export const usageLedgerClient: UsageLedgerClient = new MockUsageLedgerClient();

export { isCompliant };
