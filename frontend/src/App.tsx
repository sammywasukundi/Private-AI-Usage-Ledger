import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { AuditView } from "./components/AuditView";

type Tab = "dashboard" | "audit";

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Private AI Usage Ledger</h1>
          <p className="subtitle">MVP frontend — données fictives, aucune connexion Midnight pour l'instant</p>
        </div>
        <nav>
          <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>
            Dashboard
          </button>
          <button className={tab === "audit" ? "active" : ""} onClick={() => setTab("audit")}>
            Audit
          </button>
        </nav>
      </header>

      <main>{tab === "dashboard" ? <Dashboard /> : <AuditView />}</main>

      <footer>
        <span className="badge badge-demo">Données de démonstration</span>
      </footer>
    </div>
  );
}
