import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { AuditView } from "./components/AuditView";
import { ChainStatusPanel } from "./components/ChainStatusPanel";

type Tab = "dashboard" | "audit";

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Private AI Usage Ledger</h1>
          <p className="subtitle">Dashboard connecté au wallet 1AM — contrat AIUsageLedger live sur Preprod</p>
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

      <main>
        <ChainStatusPanel />
        {tab === "dashboard" ? <Dashboard /> : <AuditView />}
      </main>

      <footer>
        <span className="badge badge-demo">Événements ci-dessous : données de démonstration — connexion wallet et état du contrat : réels</span>
      </footer>
    </div>
  );
}
