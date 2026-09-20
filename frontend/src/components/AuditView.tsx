import { useMemo, useState } from "react";
import { useUsageEvents } from "../hooks/useUsageEvents";

// Dans cette démo, le format de la viewing key est simulé comme `vk_<id>`.
// À l'étape "viewing keys" du projet (Level 5), ceci sera remplacé par un
// vrai déchiffrement basé sur une clé dérivée, plutôt qu'une simple
// correspondance de chaîne.
function keyUnlocksEvent(key: string, eventId: string): boolean {
  return key.trim() === `vk_${eventId}`;
}

export function AuditView() {
  const { events } = useUsageEvents();
  const [selectedId, setSelectedId] = useState("");
  const [key, setKey] = useState("");
  const [revealed, setRevealed] = useState<string | null>(null);
  const [attemptError, setAttemptError] = useState<string | null>(null);

  const selectedEvent = useMemo(() => events?.find((e) => e.id === selectedId) ?? null, [events, selectedId]);

  function handleUnlock() {
    setAttemptError(null);
    setRevealed(null);
    if (!selectedEvent) {
      setAttemptError("Choisis d'abord un événement à auditer.");
      return;
    }
    if (!keyUnlocksEvent(key, selectedEvent.id)) {
      setAttemptError("Viewing key invalide pour cet événement.");
      return;
    }
    setRevealed(selectedEvent.id);
  }

  if (!events) return <p className="loading">Chargement…</p>;

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Audit — déverrouillage par viewing key</h2>
      </div>
      <p className="hint">
        Démo : chaque événement a une viewing key fictive au format <code>vk_&lt;id de l'événement&gt;</code>.
        Choisis un événement, colle sa clé, et déverrouille ses détails privés.
      </p>

      <div className="audit-form">
        <select value={selectedId} onChange={(e) => { setSelectedId(e.target.value); setRevealed(null); setAttemptError(null); }}>
          <option value="">— Choisir un événement —</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.id} · {e.public.department} · {new Date(e.public.timestamp * 1000).toLocaleDateString("fr-FR")}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder={selectedId ? `vk_${selectedId}` : "vk_..."}
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button onClick={handleUnlock} disabled={!selectedId}>Déverrouiller</button>
        {selectedId ? (
          <button className="secondary" onClick={() => setKey(`vk_${selectedId}`)}>
            Remplir la clé de démo
          </button>
        ) : null}
      </div>

      {attemptError ? <p className="error">{attemptError}</p> : null}

      {revealed && selectedEvent ? (
        <div className="revealed-card">
          <h3>Détails déchiffrés — {selectedEvent.id}</h3>
          <dl>
            <dt>Utilisateur</dt>
            <dd>{selectedEvent.private.userId}</dd>
            <dt>Catégories de données</dt>
            <dd>{selectedEvent.private.dataCategories.join(", ")}</dd>
            <dt>PII détectée</dt>
            <dd>{selectedEvent.private.hasPII ? "Oui" : "Non"}</dd>
            <dt>Hash du prompt</dt>
            <dd className="mono">{selectedEvent.private.promptHash}</dd>
          </dl>
        </div>
      ) : null}
    </div>
  );
}
