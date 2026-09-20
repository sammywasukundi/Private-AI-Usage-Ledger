# Architecture — zkai-ledger (Private AI Usage Ledger)

## État actuel

```
contracts/    ✅ hello-world.compact compilé avec succès (compiler 0.31.1, language 0.23.0)
frontend/     ✅ Dashboard MVP fonctionnel, données 100% fictives
src/          ✅ CLI/déploiement générés par create-mn-app (network, wallet, deploy, cli)
```

Le frontend ne dépend d'aucun package `@midnight-ntwrk/*` pour l'instant —
uniquement React + Vite + TypeScript, indépendant du reste du projet. Toute
la donnée passe par `frontend/src/lib/midnightClient.ts`, le seul fichier à
remplacer plus tard pour lire l'état réel du contrat : les composants
(`Dashboard.tsx`, `AuditView.tsx`, etc.) ne connaissent que les types de
`frontend/src/lib/types.ts`, pas la source des données.

## Prochaines étapes (dans l'ordre)

1. **Remplacer `contracts/hello-world.compact`** par le vrai contrat
   `AIUsageLedger` (ledger `events: Map<Bytes<32>, PublicEventData>`,
   circuit `submitUsageEvent`), avec `pragma language_version >= 0.23;`
   pour rester sur la version déjà validée par ta toolchain.
2. **Ajouter le circuit ZK de politique** — vérification `hasPII == false`
   et `tool ∈ approvedTools` en zero-knowledge, pas encore présente.
3. **Déployer sur Preprod** via `npm run network preprod` puis
   `npm run setup -- --network preprod` (wallet 1AM existant via
   `MIDNIGHT_WALLET_MNEMONIC`, voir README).
4. **Remplacer `midnightClient.ts`** par un vrai client lisant l'indexer
   Midnight au lieu de `mockData.ts`.
5. **Viewing keys réelles** — remplacer la simulation `vk_<id>` de
   `AuditView.tsx` par un vrai chiffrement/déchiffrement.

## Pourquoi le frontend d'abord ?

Valider l'UX et la structure des données sans attendre que le contrat final
et le déploiement Preprod soient prêts. Le contrat vient ensuite parce que
`midnightClient.ts` est conçu comme point de bascule unique : aucun
composant d'affichage n'aura à changer.
