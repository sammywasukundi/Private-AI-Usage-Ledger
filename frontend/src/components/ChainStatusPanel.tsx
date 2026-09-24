import { useEffect, useState } from 'react';
import { connectWallet, isWalletAvailable } from '../lib/wallet';
import { fetchChainStatus, DEPLOYED_CONTRACT_ADDRESS, type ChainStatus } from '../lib/chainStatus';

function truncate(s: string, n = 10) {
  return s.length > n * 2 ? `${s.slice(0, n)}…${s.slice(-n)}` : s;
}

export function ChainStatusPanel() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const [chainStatus, setChainStatus] = useState<ChainStatus | null>(null);
  const [chainError, setChainError] = useState<string | null>(null);

  useEffect(() => {
    fetchChainStatus()
      .then(setChainStatus)
      .catch((e) => setChainError(e instanceof Error ? e.message : 'Erreur indexer'));
  }, []);

  async function handleConnect() {
    setConnecting(true);
    setWalletError(null);
    try {
      const available = await isWalletAvailable();
      if (!available) {
        throw new Error("Wallet 1AM non détecté dans ce navigateur.");
      }
      const wallet = await connectWallet();
      setWalletAddress(wallet.address);
    } catch (e) {
      setWalletError(e instanceof Error ? e.message : 'Connexion échouée');
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div className="panel" style={{ marginBottom: '1.5rem' }}>
      <div className="panel-header">
        <h2>État réel — Preprod</h2>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <p className="hint" style={{ margin: '0 0 0.4rem' }}>Wallet</p>
          {walletAddress ? (
            <span className="badge badge-good">{truncate(walletAddress)}</span>
          ) : (
            <button onClick={handleConnect} disabled={connecting}>
              {connecting ? 'Connexion…' : 'Connecter le wallet 1AM'}
            </button>
          )}
          {walletError ? <p className="error" style={{ marginTop: '0.4rem' }}>{walletError}</p> : null}
        </div>

        <div>
          <p className="hint" style={{ margin: '0 0 0.4rem' }}>Contrat déployé</p>
          <p className="mono" style={{ margin: 0 }}>{truncate(DEPLOYED_CONTRACT_ADDRESS)}</p>
          {chainError ? (
            <p className="error" style={{ marginTop: '0.3rem' }}>{chainError}</p>
          ) : chainStatus ? (
            <span className={`badge ${chainStatus.live ? 'badge-good' : 'badge-bad'}`} style={{ marginTop: '0.3rem', display: 'inline-block' }}>
              {chainStatus.live ? '✅ Live on-chain' : 'Aucun état trouvé'}
            </span>
          ) : (
            <p className="loading" style={{ margin: 0 }}>Vérification…</p>
          )}
        </div>
      </div>
    </div>
  );
}
