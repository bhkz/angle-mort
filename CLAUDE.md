# Consignes du projet

## Commandes
- `npm run dev` : démarrer le serveur de développement.
- `npm test` : exécuter les tests.
- `npm run build` : produire le build.
- `npm run typecheck` : vérifier les types.

## IMPORTANT — frontières
- `src/sim/` et `src/planner/` n'importent jamais `three`, ni le DOM, ni `window`. Ils tournent sous Node.
- Le rendu lit l'état de la simulation et n'écrit jamais dedans.

## Déterminisme
- Aucun `Math.random` ni `Date.now` dans `src/sim/`.
- Tout RNG utilise une graine explicite.
- Le temps n'avance que par impulsions entières.

## Références
- La conception fait autorité : `conception/DOSSIER-V2.md` et `conception/contributions/V2-*.md`.
- `conception/DOSSIER.md` et `conception/ANNEXES.md` sont des archives V1.
- Ne modifier aucun fichier de `conception/`.

## Validation
- Lancer `npm test` avant de déclarer une tâche terminée.
