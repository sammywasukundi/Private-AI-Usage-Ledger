// Lecture publique de l'état on-chain du contrat déployé, via l'indexer
// Preprod (GraphQL). Aucun wallet requis pour lire — c'est public.
//
// Volontairement simplifié : on récupère l'état brut (hex) comme preuve
// que le contrat est vivant et a un état, sans encore le décoder en objet
// Ledger typé (ça demande de faire correspondre exactement la version du
// ledger utilisée par l'indexer avec @midnight-ntwrk/compact-runtime côté
// navigateur — zone encore mouvante dans le SDK officiel). Prochaine étape
// documentée dans docs/ARCHITECTURE.md.

const INDEXER_URL = 'https://indexer.preprod.midnight.network/api/v4/graphql';
export const DEPLOYED_CONTRACT_ADDRESS =
  '7b75364fa2ed5863aa6594f2f3f011a82974a30360783774ee0fdaa56eb0be10';

export interface ChainStatus {
  live: boolean;
  address: string;
  rawState: string | null;
}

export async function fetchChainStatus(): Promise<ChainStatus> {
  const query = `query { contractAction(address: "${DEPLOYED_CONTRACT_ADDRESS}") { address state } }`;

  const res = await fetch(INDEXER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`Indexer a répondu ${res.status}`);
  }

  const json = await res.json();
  const action = json?.data?.contractAction;

  return {
    live: Boolean(action?.state),
    address: DEPLOYED_CONTRACT_ADDRESS,
    rawState: action?.state ?? null,
  };
}
