# Frontend — guide de lancement

Le dashboard tourne indépendamment du reste du projet (aucune dépendance
`@midnight-ntwrk/*`, aucun besoin du devnet ni du proof server pour cette
étape).

```bash
cd frontend
npm install
npm run dev
```

Ouvre l'URL affichée (`http://localhost:5173`). Tu dois voir :

- Un dashboard avec ~42 événements d'usage IA fictifs.
- Des cartes de statistiques (taux de conformité, violations PII, outils
  non approuvés).
- Un tableau filtrable par département / outil.
- Un onglet **Audit** simulant le déverrouillage d'un événement par
  *viewing key* (clé de démo au format `vk_<id de l'événement>`, un bouton
  "Remplir la clé de démo" est prévu pour tester rapidement).

## Prochaine étape

Une fois le vrai contrat déployé sur Preprod (voir `docs/ARCHITECTURE.md`),
`frontend/src/lib/midnightClient.ts` sera le seul fichier à modifier pour
lire l'état réel au lieu de `mockData.ts` — aucun composant n'aura à
changer.
