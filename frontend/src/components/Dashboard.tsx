import { useUsageEvents } from "../hooks/useUsageEvents";
import { StatsCards } from "./StatsCards";
import { EventTable } from "./EventTable";

export function Dashboard() {
  const { events, policy, loading, error } = useUsageEvents();

  if (error) return <p className="error">Erreur : {error}</p>;
  if (loading || !events || !policy) return <p className="loading">Chargement des événements…</p>;

  return (
    <div>
      <div className="policy-banner">
        Politique active : <strong>v{policy.version}</strong> — {policy.approvedTools.length} outil(s) approuvé(s)
      </div>
      <StatsCards events={events} />
      <EventTable events={events} />
    </div>
  );
}
