import { useMemo, useState } from "react";
import type { UsageEvent } from "../lib/types";
import { isCompliant } from "../lib/midnightClient";

export function EventTable({ events }: { events: UsageEvent[] }) {
  const [department, setDepartment] = useState<string>("all");
  const [tool, setTool] = useState<string>("all");

  const departments = useMemo(() => Array.from(new Set(events.map((e) => e.public.department))).sort(), [events]);
  const tools = useMemo(() => Array.from(new Set(events.map((e) => e.public.tool))).sort(), [events]);

  const filtered = events.filter(
    (e) => (department === "all" || e.public.department === department) && (tool === "all" || e.public.tool === tool),
  );

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Événements récents</h2>
        <div className="filters">
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="all">Tous les départements</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select value={tool} onChange={(e) => setTool(e.target.value)}>
            <option value="all">Tous les outils</option>
            {tools.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Département</th>
              <th>Outil</th>
              <th>Statut</th>
              <th>Commitment</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => {
              const ok = isCompliant(e);
              return (
                <tr key={e.id}>
                  <td>{new Date(e.public.timestamp * 1000).toLocaleString("fr-FR")}</td>
                  <td>{e.public.department}</td>
                  <td>{e.public.tool}</td>
                  <td>
                    <span className={`badge ${ok ? "badge-good" : "badge-bad"}`}>
                      {ok ? "Conforme" : e.private.hasPII ? "PII détectée" : "Outil non approuvé"}
                    </span>
                  </td>
                  <td className="mono">{e.id}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 ? <p className="empty">Aucun événement pour ces filtres.</p> : null}
      </div>
    </div>
  );
}
