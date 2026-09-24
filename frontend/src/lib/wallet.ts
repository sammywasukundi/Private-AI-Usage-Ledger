// Connexion au wallet Midnight (1AM) depuis le navigateur.
// Suit le pattern officiel @midnight-ntwrk/dapp-connector-api :
// les wallets s'injectent sous window.midnight, avec une clé fixe pour
// 1AM ("1am") et une clé UUID pour les wallets plus récents (scan par nom).

export interface ConnectedWallet {
  address: string;
}

function findProvider(): any {
  const mw = (window as any).midnight;
  if (!mw) return null;

  // Clé fixe historique pour 1AM
  if (mw['1am']) return mw['1am'];

  // Repli : scan des entrées façon v4 (clés UUID), par nom
  for (const p of Object.values(mw)) {
    const name = (p as any)?.name?.toLowerCase?.() ?? '';
    if (name.includes('1am')) return p;
  }
  return null;
}

export async function isWalletAvailable(): Promise<boolean> {
  return findProvider() !== null;
}

export async function connectWallet(): Promise<ConnectedWallet> {
  const provider = findProvider();
  if (!provider) {
    throw new Error(
      "Aucun wallet 1AM détecté. Vérifie que l'extension est installée dans CE navigateur (pas dans WSL) et actualise la page."
    );
  }

  const api = await provider.connect('preprod');
  const addresses = await api.getShieldedAddresses();

  if (!addresses || addresses.length === 0) {
    throw new Error("Wallet connecté mais aucune adresse renvoyée.");
  }

  return { address: addresses[0] };
}
