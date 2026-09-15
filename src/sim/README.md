# Moteur déterministe

## API

`createSimulation(description: Scenario, graine: number)` construit un moteur isolé. La graine est un entier uint32 explicite. Les types et l'API sont exportés depuis `src/sim/index.ts`.

```ts
const simulation = createSimulation(scenario, 42);
simulation.submitOrders([{
  robot: 'R', canal: 'direct', destination: 'P',
  operations: [{ type: 'livrer', colis: 'battery' }],
}]);
simulation.advance();
const auteur = simulation.getAuthorState();
const joueur = simulation.getPlayerView();
```

- `submitOrders` prépare les ordres sans avancer le temps. Une nouvelle soumission remplace l'ordre en attente du robot concerné. Un lot contenant deux ordres pour le même robot est rejeté entièrement. Les autres ordres déjà en attente sont conservés.
- Les identifiants appartiennent au catalogue statique du scénario ; les références sont validées dans leur domaine. Les tableaux de description sont normalisés en index internes stables. Aucun objet du scénario ou d'un ordre ne reste partagé avec le moteur.
- `advance` résout exactement une impulsion : événements, mouvements simultanés, manutention/réceptions, observations, échéances. Les ordres sont consommés ; aucun ordre ne signifie attendre. À la fin du scénario, avancer ou soumettre lève une erreur sans modifier l'état.
- Les deux lectures renvoient des copies gelées récursivement. La vue auteur contient les faits physiques et le journal. La vue joueur ne contient que géométrie connue, provenance statique des sources, observations sourcées et constats locaux autorisés. Elle ne contient ni graine, score physique, résultats de besoins, événements secrets ou positions cachées. Le bilan auteur n'est pas automatiquement révélé à t16.
- La simulation ne retourne pas l'état réel depuis `submitOrders` ou `advance`. Un futur contrôleur de rendu devra recevoir uniquement la lecture joueur et les commandes autorisées ; il ne doit pas transmettre le lecteur auteur à ses composants.

## Choix d'implémentation pour les points ouverts de SPEC-SIM

La demande d'implémentation couvre le moteur et les cinq témoins. Les choix ci-dessous rendent ce périmètre concret ; ils ne complètent pas les mécaniques de campagne ou de planification encore ouvertes.

| Points | Règle utilisée |
| --- | --- |
| PT-01 | Catalogue de besoins et dates de révélation déclarés par le scénario. La lecture joueur de ce moteur se limite aux observations ; l'interface de notification des besoins reste à construire. |
| PT-02 | État opérationnel = conjonction explicite des états d'équipements requis par le service. Les besoins avec condition opérationnelle finale sont évalués à leur clôture. Dans les témoins, F et Q ont des alimentations indépendantes de la pompe. |
| PT-03 | Refus de tous les concurrents visant la même destination, refus des échanges, puis propagation jusqu'à stabilité si un occupant reste sur place. Les rotations de trois robots ou plus sont permises. Aucun départage par ordre de tableau. |
| PT-04 | La soumission vérifie uniquement le catalogue et la structure. Adjacence depuis la position réelle, droits, obstacles, inventaire et énergie sont vérifiés à l'exécution, pour éviter une fuite à la préparation. Toute action physique refusée consomme l'impulsion ; le joueur reçoit seulement un constat local « refusé », sans diagnostic caché. |
| PT-05 | Chargement initial fourni dans le scénario. Manutention commandée explicitement, possible après attente ; tous les déchargements précèdent les chargements, dont l'ordre demandé est conservé. Capacité pleine : refus local du chargement, colis conservé. Seuls les déplacements réussis consomment l'énergie déclarée par l'arête. Les robots des témoins n'ont pas de budget de traction modélisé. |
| PT-06 | Droits et durées inclusifs, vérifiés à chaque action ; les sous-missions sont limitées par les droits, ressources et zones de tous leurs parents. La révocation programmée prend effet avant les mouvements. Le cycle de vie complet de mission n'est pas implémenté. |
| PT-07 | Aucune interruption au milieu d'`advance`. Arriver en mode observation fixe est possible, sans cargaison ni manutention concurrente. Repartir quitte ce mode. Les réparations et leur suspension ne font pas partie de cette API. |
| PT-08 | Écritures concurrentes sur un équipement au même instant rejetées à la construction. Dans les événements programmés, appliquer les changements d'équipement/révocations avant de vérifier les conditions physiques des traversées. Après observations, appliquer les seuils de dégâts puis les contrôles de besoins. |
| PT-09/10 | Depuis P4 : couverture géométrique 3D pour vision/audio, télémétrie déclarative pour les canaux câblés, capteurs de franchissement. Latence nulle pour les nouvelles acquisitions. Les faits des sources différentes restent séparés, même quand leur origine est commune. Voir le contrat d'observation ci-dessous. |
| PT-11 | Une observation est datée de l'étape `observations`, avant les échéances. Le statut `maintenant` signifie « observé à cette étape de l'impulsion courante », pas « vérité après tous les dégâts ». Aucun rafraîchissement après les échéances. |
| PT-12/13 | Checkpoint fourni déjà résolu. Les événements antérieurs ou égaux au début ne sont pas rejoués. Réceptions historiques et besoins importés sont explicitement déclarés. Une batterie réceptionnée avant ou à t10 rétablit la pompe pour ce sous-cas ; une réception finale est irréversible. Pas d'équipe de dernier kilomètre. |
| PT-14 | Le registre de clôtures est dédupliqué globalement par colis pendant la tentative. Il est distinct des réceptions et du score. Aucun sélecteur de plan ni calcul d'optimum J. |
| PT-15/17 | RNG `mulberry32-v1`, variantes tirées au lancement par identifiant stable ; graine et état RNG réservés à l'auteur. Les instantanés sont sérialisables en JSON. La restauration/migration de sauvegardes et le débriefing public restent hors périmètre. |

La vérité courante d'une porte n'est jamais consultée pour rafraîchir une ancienne observation. Une source doit explicitement couvrir le champ considéré et être disponible ; pour un poste fixe robotisé, le robot doit être en mode observation avec un droit actuel. Les refus ne sont transmis que si le canal de télémétrie locale est disponible pour le joueur.

## Scénario des témoins

La description déclarative est dans `tests/fixtures/dernierPassage.ts`. Elle commence à t4 avec les trois succès de phase 1 importés (300 points), R en T avec batterie/Q2, caméra en maintenance et ancienne observation de porte à t2. Le cycle de porte de t4 est déjà incorporé au checkpoint. Depuis P4, les coordonnées et le volume du hangar définissent une géométrie d'observation simplifiée ; la future scène devra respecter cette couverture.

Hypothèses explicites du sous-cas : charge initiale épuisée à t5, alimentation de pompe ensuite rétablie par la batterie à temps et durable jusqu'à t16 ; alimentations F/Q initialement disponibles. Les traversées F2/F3/F4 ne sont pas des booléens forcés : leurs événements vérifient effectivement passerelle relevée et service alimenté. Leurs horaires sont 6/10/14. L'horaire 2 de F1 et la réception 3 de Q1 sont des preuves importées de fixture, pas un préfixe jouable démontré.

Les ordres des cinq témoins sont écrits dans `tests/temoins.test.ts`. Chaque déplacement et chaque manutention passe par l'API. Le fichier de conception `.mjs` n'est ni importé ni exécuté par les tests. Les assertions portent sur chaque position, les dates de réception, les dégâts et les scores 1200, 1100, 1000, 1000, 800.

## Contrat d'observation P4

### Acquisition géométrique

`observations.ts` est le point de lecture physique pour les acquisitions, après mouvements et réceptions, avant échéances. Chaque règle déclare les propriétés effectivement mesurables ; voir un robot n'autorise pas implicitement à lire sa cargaison ou son énergie. `depuis` définit les postes admissibles, puis `perception` applique portée, cône et occlusion. Une règle sans `perception` est un canal de télémétrie explicitement câblé, conservé pour les fixtures précédentes ; ce n'est pas une caméra sans occlusion. Les sources de nature `cameraFixe` exigent une perception visuelle.

Conventions retenues pour PT-09, sans dépendance au rendu :

- Positions en unités de scénario, axe y vertical ; portée dans ces mêmes unités. Toutes les arêtes gardent une durée d'une impulsion indépendamment de leur longueur géométrique.
- Source fixe au sommet déclaré, source mobile à la position réelle de son robot, plus `volume.offset`. Orientation fixe dans le repère du monde, angle total du cône en degrés ; 360 donne une couverture omnidirectionnelle. Portée et bord du cône inclus, tolérance numérique 1e-9.
- Cible ponctuelle : sommet réel du robot/colis, milieu de l'arête ou cible de l'équipement. Un `ancrage` explicite précise la face mesurée d'un équipement fixe ; les agrégats service/conséquences l'exigent. Les cibles mobiles et sons ne peuvent pas recevoir d'ancrage fixe.
- Occlusion par boîtes fermées alignées sur les axes, sur l'intérieur du segment optique. Les tangences bloquent ; une boîte appartenant à la cible elle-même ne cache pas sa face. `actifSi` sélectionne les boîtes selon les conditions physiques lors de l'acquisition. Ces états ne vont jamais au projecteur.
- Un robot en poste exige `observationFixe` et un droit `observer` valable maintenant. Arriver en poste donne un rapport à cette impulsion ; repartir ou perdre le droit cesse l'acquisition sans effacer le passé.
- Les sources indisponibles ne produisent ni fait, ni diagnostic de panne omniscient. L'origine commune et les destinataires sont déclarés ; joueur et EVA peuvent recevoir des informations différentes.

Dans le Dernier passage, les capteurs embarqués peuvent rechercher la porte depuis tous les sommets. Le volume du hangar bloque réellement les rayons depuis T et G. C est en hauteur et voit la face de la porte ; la caméra fixe surélevée en H la voit quand elle revient à t7. Enlever le hangar révèle effectivement la porte depuis G : un test empêche de maintenir artificiellement le score du cinquième témoin si cette géométrie change.

### Franchissements et sons

Un `capteurFranchissement` fixe est installé à une extrémité des arêtes déclarées. Il reçoit seulement les passages **réussis** de l'impulsion : arête, sens, date, et identité du robot si cette capacité est activée. Aucun état de porte, contenu de colis, attente ou refus ne découle du détecteur. Il ne rejoue pas les passages survenus pendant son indisponibilité. Le journal physique `franchissements` reste réservé à l'auteur ; `franchissementsObserves` est routé par source.

Un microphone mesure les `emissionsSonores` déclarées, avec origine physique, signal et conditions d'émission explicites. Le modèle audio utilise la même portée/occlusion que la vision (sans diffraction, atténuation ni propagation temporelle). Un signal inaudible ou absent donne `null`, sans coordonnée secrète. Un son audible est lui-même une observation autorisée de son origine. Aucun bruit n'est synthétisé à partir des dégâts ou du score cachés. Le tableau joueur `sons` ne contient que les signaux de l'étape courante ; les rapports sonores anciens restent dans `observations` sans être rejoués. La future sortie audio pourra dédupliquer par source, émission et capture.

### Projection et non-fuite

`createPlayerCatalogue` extrait uniquement le graphe public, ses coûts fixes et les schémas des sources destinées au joueur. `projectPlayerView(catalogue, information, intentions)` reçoit uniquement l'impulsion, les faits reçus et les constats/franchissements transmis. Il ne reçoit aucun état réel. `getPlayerView(intentions?)` assemble ce paquet et renvoie une copie profondément gelée.

- Trois états par source/propriété : `inconnu` sans valeur et âge `null`, `maintenant` avec âge 0, `datee` avec âge `t - capture`. Conservation sans expiration automatique ; aucune extrapolation physique ni actualisation clandestine. `maintenant` garde le sens intra-impulsion de PT-11.
- Les rapports sont triés par clé source/propriété. Le dernier fait livré est choisi par capture puis réception ; un doublon exactement simultané est départagé par ordre lexical JSON, sans consultation physique. Les rapports de sources différentes ne sont jamais fusionnés. Les positions produisent une silhouette par rapport, avec date/âge, jamais une position secrète ou une interpolation vers celle-ci. Un robot inconnu n'a pas de silhouette.
- `getPlayerView([{ id, robot, chemin }])` expose des **intentions publiques** : coût nominal en impulsions et énergie calculé sur les arêtes publiques. Le coût ne teste ni énergie restante réelle, ni occupation cachée, ni faisabilité future. Un segment hors graphe donne un coût `null`. Les indications de porte sont exclusivement observées, datées, inconnues ou contradictoires ; même `ouvertObserve` ne garantit pas l'absence d'un autre obstacle matériel.
- Le score, les besoins réellement satisfaits, les dégâts non observés, le RNG, les événements secrets et les diagnostics physiques de refus restent absents de tous ces canaux.

L'invariant exige **mêmes informations publiques, même impulsion, mêmes entrées publiques et mêmes rapports reçus**. Sous ces conditions, changer l'état caché ne change aucun octet de la vue sérialisée. Il ne prétend pas rendre identiques deux cartes publiques ou deux demandes d'aperçu différentes.

Les tests de propriété utilisent fast-check, avec réduction des contre-exemples et graines fixes : 500 paires de mondes exécutés de t4 à t16 (positions, énergie, cargaison, équipements, score, graines et émissions cachés), plus 1000 paires de charges cachées arbitraires derrière un accès qui interdit au projecteur de lire les champs physiques. Des contrôles positifs changent les observations et vérifient que silhouettes, sons et aperçus changent réellement. Ces tests vérifient le contrat de données ; le futur rendu, DOM, raycast et mixage audio devront consommer exclusivement ce contrat et recevoir leurs propres tests d'intégration.

## Vérification

`npm test` couvre témoins et invariants ; `npm run typecheck` vérifie aussi le noyau avec uniquement la bibliothèque ES2022, sans types DOM, Vite ou Node implicites. Le noyau n'importe aucune dépendance externe et ne consulte aucune horloge. Le build passe par cette double vérification des types.
