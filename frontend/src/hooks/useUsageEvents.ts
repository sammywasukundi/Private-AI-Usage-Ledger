import { useEffect, useState } from "react";
import { usageLedgerClient } from "../lib/midnightClient";
import type { UsageEvent, PolicySummary } from "../lib/types";

export function useUsageEvents() {
  const [events, setEvents] = useState<UsageEvent[] | null>(null);
  const [policy, setPolicy] = useState<PolicySummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([usageLedgerClient.listEvents(), usageLedgerClient.getPolicy()])
      .then(([evts, pol]) => {
        if (cancelled) return;
        setEvents(evts);
        setPolicy(pol);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { events, policy, loading: events === null && !error, error };
}
