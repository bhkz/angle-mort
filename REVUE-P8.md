# Revue adverse P8

Revue effectuée par un subagent à contexte neuf, sans modification des fichiers. Périmètre initial : du premier commit `bdde6169` au commit `2637abd`. Les observations de style étaient exclues ; les modifications UX répondent séparément au retour du joueur.

| Exigence | Résultat de la revue |
| --- | --- |
| 1. Frontière sim/planner | Recherche `rg` et graphe d'imports exécutables : aucun Three, DOM ou window ; imports runtime internes à chaque noyau. |
| 2. Déterminisme | Aucun Math.random ou Date.now dans src/sim. |
| 3. Vue joueur seulement | Three dépend du paquet joueur ; moteur isolé dans le worker. Aucun chemin vers un lecteur auteur depuis le rendu. |
| 4. Tests d'or | Six J 18, 34, 27, 47, 44, 34 et cinq scores 1200, 1100, 1000, 1000, 800 testés et réussis. |
| 5. Pertes | Seuils appliqués par sim/scoring.ts et sim/engine.ts ; validation 8/10 dans le moteur. L'interface n'applique pas les pertes. |
| 6. Optimalité | Un écart trouvé : « Optimal selon les observations » ne précisait pas le domaine de transport ni l'horizon maximal de dix impulsions. |

Le subagent a exécuté **85 tests ciblés et le typecheck**, tous réussis. Les recherches interrompues par budget étaient correctement marquées meilleurTrouve ; l'écart portait sur la portée du libellé utilisateur.

## Correction

L'interface affiche désormais **« Plan proposé selon les informations reçues »** et la durée prévue, sans qualificatif optimal. Les garanties internes du planificateur restent disponibles pour les tests et ne sont pas altérées pour masquer une recherche incomplète.

Le subagent a relu le working tree après les changements du rendu et du guide pour les points 3 et 6 : aucun écart supplémentaire. Les silhouettes visibles devant le décor et les animations restent construites uniquement à partir des rapports de positions reçus. Le nouveau module de noms contient uniquement des constantes publiques.

## Vérification UX distincte

La demande du joueur a conduit à un apprentissage explicite, une séparation du panneau et du quai, des destinations nommées, des contrôles décrits et un retour de tour. Les tests rejouent deux livraisons et un poste complet guidé. Le guidage du défi marque l'essai comme entraînement et n'écrit pas de meilleur record. Le reçu tardif qui explique les 100 points manquants du parcours guidé apparaît dans le bilan, après la fin uniquement.
