import type { UsageEvent } from "../lib/types";
import { isCompliant } from "../lib/midnightClient";

export function StatsCards({ events }: { events: UsageEvent[] }) {
  const total = events.length;
  const compliant = events.filter(isCompliant).length;
  const complianceRate = total === 0 ? 0 : Math.round((compliant / total) * 100);
  const piiViolations = events.filter((e) => e.private.hasPII).length;
  const unapprovedTool = events.filter((e) => !isCompliant(e) && !e.private.hasPII).length;

  const cards = [
    { label: "Événements enregistrés", value: total, tone: "neutral" as const },
    { label: "Taux de conformité", value: `${complianceRate}%`, tone: complianceRate >= 90 ? "good" : complianceRate >= 75 ? "warn" : "bad" },
    { label: "Violations PII", value: piiViolations, tone: piiViolations === 0 ? "good" : "bad" as const },
    { label: "Outils non approuvés", value: unapprovedTool, tone: unapprovedTool === 0 ? "good" : "warn" as const },
  ];

  return (
    <div className="stats-grid">
      {cards.map((c) => (
        <div key={c.label} className={`stat-card tone-${c.tone}`}>
          <div className="stat-value">{c.value}</div>
          <div className="stat-label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
