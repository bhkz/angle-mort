# Spécification technique de la simulation — Angle Mort

Statut : **à arbitrer avant implémentation**. Les règles établies ci-dessous traduisent les sources ; les lacunes ne sont pas complétées implicitement. Les décisions ouvertes sont identifiées par `PT-xx` dans la dernière section. Cette version ne constitue pas encore un contrat intégralement implémentable pour le poste complet.

Suivi d'implémentation : la demande suivante porte sur le moteur des sections 1–5 et 7, ainsi que les scores des cinq témoins. Les choix retenus pour ce périmètre et ses limites sont explicités dans [src/sim/README.md](src/sim/README.md). Les autres arbitrages restent ouverts ; la présente spécification conserve leur contexte.

## 1. Autorité, périmètre et conventions

Sources actives, avec abréviations utilisées dans ce document :

- **D** : [DOSSIER-V2.md](conception/DOSSIER-V2.md), sections 6, 14, 15, 16 et 20.
- **G** : [V2-01-GAMEPLAY.md](conception/contributions/V2-01-GAMEPLAY.md), particulièrement §4.
- **T** : [V2-04-TRAJETS.md](conception/contributions/V2-04-TRAJETS.md), sections 1 à 4.
- **S** : [V2-04-TRAJETS.mjs](conception/contributions/V2-04-TRAJETS.mjs), vérificateur de cinq témoins depuis t4.

`DOSSIER.md` et `ANNEXES.md` sont des archives V1. Aucun fichier de conception ne doit être modifié. `image.png` est une référence de direction artistique ; elle ne définit ni la visibilité simulée, ni les horaires, ni les règles physiques.

Trois périmètres doivent rester distincts :

| Périmètre | Départ et horizon | Ce qui est établi |
| --- | --- | --- |
| Microcas des objectifs, G §4 | Robot au dépôt O, six impulsions maximum | Six optima de la fonction J, un seul robot, pas d'obstacle caché |
| Témoins du Dernier passage, T et S | Checkpoint à la fin de t4, exécution de t5 à t16 | Cinq trajets et scores conditionnels ; phase 1 supposée réussie |
| Poste prototype complet, D §§15–16 | t0 à t16, trois services | Barème et contraintes générales ; préfixe, interactions et paramètres encore incomplets |

Le défi complet à six phases, six services et 3 600 points est un autre contrat : il ne remplace pas le prototype à 1 200 points. Les témoins T ne démontrent pas un optimum global du poste complet.

`t` est un indice entier d'impulsion. Une position notée « à t5 » est la position après la résolution des déplacements de l'impulsion 5. Exécuter depuis la pause à t4 résout t5. La préparation, la lecture, la caméra de présentation et le nombre d'images affichées ne font jamais avancer `t`.

Une fenêtre `(a,b]` accepte uniquement les instants entiers `a < t <= b`. Pour le prototype, chaque impulsion représente trente minutes fictives : t0 = 22 h, t4 = 00 h, t8 = 02 h, t12 = 04 h, t16 = 06 h. Les minutes de mise en scène de D §15 ne sont pas des impulsions.

## 2. Types TypeScript — contrat de données

Les types sont décrits ici par leurs champs en notation TypeScript, sans code d'implémentation. Les noms de champs, identifiants distincts et unions sont des **choix de représentation proposés par cette spécification**, pas des décisions de gameplay attribuées aux sources. Tous les champs et toutes les collections exposés en lecture sont `readonly`. Les variantes ci-dessous sont des unions discriminées : seuls les champs de la variante choisie existent.

### 2.1 Primitives et références

| Type | Représentation et invariant |
| --- | --- |
| `Impulsion` | `number`, entier sûr, positif ou nul ; validation à l'entrée, car `number` seul ne garantit pas un entier |
| `Quantite` | `number`, entier sûr positif ou nul ; aucune quantité négative |
| `SommetId`, `AreteId`, `RobotId`, `ColisId`, `ServiceId`, `BesoinId`, `EquipementId`, `SourceId`, `MissionId`, `DroitId`, `EvenementId` | Identifiants textuels stables, distingués par leur type ; aucune régénération aléatoire à l'affichage |
| `Fenetre` | `{ debutExclu: Impulsion; finIncluse: Impulsion }`, avec début strictement inférieur à fin |
| `IntervalleValidite` | `{ debutInclus: Impulsion; finIncluse: Impulsion }` ; convention de représentation, bornes de mission à valider en PT-06 |
| `Position3D` | `{ x: number; y: number; z: number }`, coordonnées finies de géométrie logique ; aucun `Vector3` de Three.js |
| `Cible` | Union de références `{ type: 'sommet' / 'arete' / 'robot' / 'colis' / 'service' / 'equipement'; id: identifiant correspondant }` ; chaque variante a le bon type d'identifiant |
| `ChampObserve` | Nom stable d'une propriété d'une cible, avec une valeur typée pour cette propriété ; pas de copie de l'entité complète |

Les références doivent résoudre vers une entité existante du scénario. Un besoin ou un colis conserve son identité pendant toute la tentative, même après expiration ou déplacement. Un numéro de phase n'est pas un identifiant de colis.

### 2.2 Graphe, sommet et arête

| Type | Champs |
| --- | --- |
| `Graphe` | `sommets: Readonly<Record<SommetId, Sommet>>; aretes: Readonly<Record<AreteId, Arete>>` |
| `Sommet` | `id: SommetId; position: Position3D; niveau: string; roles: readonly RoleSommet[]; capaciteRobots: 1` |
| `RoleSommet` | `'depot' / 'transfert' / 'reception' / 'passage' / 'observation' / 'casier'` ; plusieurs rôles possibles au même sommet |
| `Arete` | `id: AreteId; extremites: readonly [SommetId, SommetId]; bidirectionnelle: true; duree: 1; controlePar: readonly EquipementId[]; coutEnergie: Quantite` |

Une arête joint deux sommets distincts. La géométrie statique connue et l'adjacence ne prouvent pas l'ouverture actuelle d'un passage. Les positions graphiques exactes et la couverture ne sont pas fournies par les graphes textuels : PT-09. Le coût vaut 1 dans G ; son usage dans le Dernier passage reste à trancher, PT-05.

### 2.3 Robot et colis

| Type | Champs |
| --- | --- |
| `Robot` | `id: RobotId; sommet: SommetId; capaciteColis: 2; activite: ActiviteRobot; energie: EnergieRobot; mission: MissionId \| null; sourceLocale: SourceId` |
| `ActiviteRobot` | `'disponible' / 'transport' / 'observationFixe' / 'reparation'` ; une seule activité exclusive, transitions à préciser en PT-07 |
| `EnergieRobot` | Union `{ type: 'limitee'; restante: Quantite }` ou `{ type: 'nonModelisee' }` ; le second cas est une abstraction déclarée du scénario, pas une recharge infinie physique |
| `Colis` | `id: ColisId; nature: 'commercial' / 'medical' / 'batterie' / 'fourniture'; destination: SommetId; disponibleDepuis: Impulsion; localisation: LocalisationColis; besoin: BesoinId \| null` |
| `LocalisationColis` | Union `{ type: 'auSol'; sommet: SommetId }`, `{ type: 'porte'; robot: RobotId }` ou `{ type: 'recu'; sommet: SommetId; impulsion: Impulsion }` |

La localisation du colis est l'autorité pour l'inventaire ; le chargement d'un robot se déduit des colis qui le référencent. Cela évite deux inventaires contradictoires. Il n'existe qu'une localisation par colis, et jamais plus de deux colis portés par robot. Une batterie transportée est un colis ; elle n'est pas l'énergie de locomotion du robot.

La clôture selon la mesure d'EVA est un registre distinct des réceptions physiques. Déposer en T laisse le colis au sol ; ce n'est pas une réception chez son destinataire. La représentation minimale ci-dessus couvre les témoins. Consommation d'une batterie, destruction et échanges avec une équipe locale exigent les décisions PT-12/PT-13 avant extension.

### 2.4 Service, besoin, équipement

| Type | Champs |
| --- | --- |
| `Service` | `id: ServiceId; nature: 'pompage' / 'traversee' / 'fournitures'; besoins: readonly BesoinId[]; dependances: readonly DependanceService[]` |
| `DependanceService` | Union d'une référence à une alimentation, un équipement ou un accès requis ; le prédicat exact et les alternatives de secours sont à fixer, PT-02/PT-12 |
| `Besoin` | `id: BesoinId; service: ServiceId; phase: 1 \| 2 \| 3 \| 4; fenetre: Fenetre; condition: ConditionBesoin; points: 100; operationnelALaCloture: boolean; revelation: Impulsion` |
| `ConditionBesoin` | Union `{ type: 'reception'; colis: ColisId; destination: SommetId }`, `{ type: 'traversee'; evenement: EvenementId; horaire: Impulsion }`, `{ type: 'operationnel'; controle: Impulsion }` ou `{ type: 'chargeInitiale'; controle: Impulsion }` |
| `ResultatBesoin` | Union `{ etat: 'enAttente' }`, `{ etat: 'satisfait'; preuve: EvenementId; impulsion: Impulsion }` ou `{ etat: 'expire' }` ; attribution de points unique séparée du fait candidat |
| `Equipement` | `id: EquipementId; nature: 'porte' / 'passerelle' / 'pompe' / 'alimentation' / 'camera' / 'lecteurTransfert'; cible: Cible; etat: EtatEquipement; dependances: readonly EquipementId[]` |
| `EtatEquipement` | Union spécifique à la nature : porte `'ouverte' / 'bloquee'` ; passerelle `'abaissée' / 'relevée'` ; caméra `'disponible' / 'maintenance'` ; pompe `'operationnelle' / 'arretee' / 'reparationExterieureRequise'` ; alimentation/lecteur `'disponible' / 'indisponible'` |

Les états d'équipement ci-dessus ne sont pas un catalogue de pannes inventées : seules les transitions spécifiées pour chaque scénario sont autorisées. Les états du stock (`'utilisable' / 'perduPourLePoste'`) et de l'atelier au poste suivant (`'intact' / 'repriseLimitee' / 'ferme'`) sont des conséquences physiques distinctes de l'état de la pompe.

`Besoin.operationnelALaCloture` est vrai pour P4, F4 et Q4 conformément à D §16. Pour F4 et Q4, le prédicat reste incomplet dans les sources, PT-02. `Besoin.revelation` ne peut pas être fixé définitivement avant PT-01.

### 2.5 Source d'observation, observations et croyances

| Type | Champs |
| --- | --- |
| `SourceObservation` | `id: SourceId; nature: 'cameraFixe' / 'robotLocal' / 'capteurPassage' / 'lecteurTransfert'; support: Cible; equipementsRequis: readonly EquipementId[]; couverture: readonly CouvertureObservation[]; origineCommune: SourceId \| null` |
| `CouvertureObservation` | `cible: Cible; champs: readonly ChampObserve[]; regleVisibilite: string` ; référence à une règle déterministe de géométrie/capacité du scénario, à définir en PT-09 |
| `FaitObserve<V>` | `cible: Cible; champ: ChampObserve; valeur: V; source: SourceId; capture: { impulsion: Impulsion; etape: 'observations' }; reception: Impulsion` |
| `Observation<V>` | Union `{ etat: 'maintenant'; fait: FaitObserve<V> }`, `{ etat: 'datee'; fait: FaitObserve<V> }` ou `{ etat: 'inconnu' }` |
| `Prevision<V>` | `valeurPrevue: V; sources: readonly SourceId[]; observationsUtilisees: readonly FaitObserve<unknown>[]; hypothese: string` ; toujours séparée d'un fait |
| `CroyancesPlanificateur` | Géométrie connue, observations reçues par EVA et hypothèses explicitement marquées ; aucune référence accessible à l'état réel caché |

`inconnu` ne contient pas de valeur cachée, de position réelle, de cause de panne ni de date inventée. La portée d'un fait est un champ d'une cible ; voir une porte ne révèle pas automatiquement les colis ou le niveau d'eau derrière elle. La connaissance du joueur et celle d'EVA peuvent différer : routage, latence et fusion des sources sont ouverts en PT-10.

### 2.6 Contrat de mission et droit

| Type | Champs |
| --- | --- |
| `ContratMission` | `id: MissionId; parent: MissionId \| null; objectif: ObjectifMission; zone: readonly SommetId[]; duree: IntervalleValidite; acces: readonly DroitId[]; ressources: RessourcesMission` |
| `ObjectifMission` | `mesure: 'receptionDestination' / 'transfertOuReception' / 'disponibiliteEquipement'; priorites: readonly PrioriteMission[]; contraintes: readonly ContrainteMission[]` |
| `PrioriteMission` | `poids: number` fini et non négatif, avec une cible discriminée : nature de colis, identifiant de service ou identifiant de besoin. G utilise commercial=1 et médical=w ; aucune fusion de priorités superposées n'est implicite, PT-14 |
| `ContrainteMission` | Réception d'un colis chez son destinataire avant une échéance, ressource à réserver ou accès à préserver ; chaque variante référence les entités et la limite concernées |
| `RessourcesMission` | `robots: readonly RobotId[]; colis: readonly ColisId[]; equipements: readonly EquipementId[]; reserveEnergie: Quantite \| null` ; règles d'allocation partagée en PT-06 |
| `Droit` | `id: DroitId; beneficiaire: MissionId; action: ActionAutorisee; cibles: readonly Cible[]; validite: IntervalleValidite; canal: string` |
| `ActionAutorisee` | `'traverser' / 'charger' / 'deposerTransfert' / 'reprendreTransfert' / 'livrer' / 'observer' / 'commanderEquipement' / 'reparer'` ; vocabulaires techniques à relier aux capacités physiques |
| `EtatMission` | `'preparee' / 'active' / 'suspensionDemandee' / 'suspendue' / 'terminee' / 'expiree'` ; statut séparé du contrat |

Un droit de dépôt en T n'est pas un droit de traversée de T. Les missions filles ne peuvent pas étendre les zones, durées, accès ou ressources autorisés par le parent. La politique d'héritage lors d'une révocation et les points d'arrêt exacts relèvent de PT-06/PT-07.

### 2.7 État réel, événements et lectures

Le stockage doit séparer : état réel simulé ; observations par source ; croyances d'EVA ; propositions et ordres ; projection accessible au joueur. Le journal réel contient les événements datés, réceptions, refus, clôtures uniques, pertes et résultats de besoins. Le journal présenté au joueur ne contient que leurs versions autorisées par les observations.

Les cinq couches ne partagent pas un objet mutable que le rendu pourrait modifier. `src/sim/` et `src/planner/` fonctionnent sous Node sans `three`, DOM ou `window`. Les composants de rendu lisent la projection autorisée et n'écrivent jamais dans la simulation. Les ordres du joueur entrent par le système de commandes, avec validation physique et de droits.

## 3. Temps et résolution exacte d'une impulsion

Source : T §1, complété par les réceptions avant échéance de D §15. L'ordre obligatoire est :

**événements programmés → déplacements admissibles → réceptions → observations → échéances**.

Les décisions prises après une observation de t ne peuvent modifier rétroactivement le déplacement de t. Elles s'appliquent au plus tôt à t+1. L'intégralité d'une impulsion consomme une unité de temps du monde, y compris si un ou tous les robots attendent ou sont bloqués.

### 3.1 Événements programmés

1. Résoudre les événements du scénario prévus au début de t, avant de tester les déplacements.
2. Appliquer les états physiques qui affectent l'admissibilité : porte, passerelle, maintenance, disponibilités annoncées.
3. Rendre disponibles les colis dont le scénario fixe l'accès à cet instant : Q3 dès t9 et Q4 dès t13 dans le cas T.
4. Les annonces connues restent publiques ; un résultat caché d'événement n'est pas transmis par cette étape. Il devient accessible seulement par une source autorisée.

Le cycle de porte intervient au début de t4, au même moment que la maintenance. Sa variante est fixée au lancement : ouverte après le cycle ou bloquée jusqu'à la fin du poste. Elle n'est pas choisie en fonction de la prudence du joueur.

La passerelle est relevée pendant les impulsions 5, 6, 9, 10, 13 et 14, puis traversable aux autres impulsions. La première traversée du ferry F1 est supposée dans le checkpoint ; les suivantes ont pour horaires 6, 10 et 14. La règle physique de réalisation des ferries et les conflits entre événements simultanés restent PT-08/PT-12 : une traversée ne doit pas être confondue avec son annonce.

### 3.2 Déplacements admissibles

1. Partir des positions de fin de t−1 et des ordres déjà engagés. Résoudre les déplacements comme un ensemble simultané, pas en déplaçant successivement les robots dans leur ordre de stockage.
2. Pour chaque commande de déplacement : exiger une arête adjacente, un droit encore valable et les conditions physiques de passage. Vérifier les contraintes matérielles définies par le scénario.
3. Appliquer les fermetures effectives de t, même si le planificateur connaît seulement une ancienne observation d'ouverture.
4. Résoudre les occupations finales et l'interdiction d'échange. Une destination « libérée » doit être réellement libérée par un déplacement admis ; la seule intention de départ de son occupant ne suffit pas.
5. Appliquer simultanément les déplacements retenus. Pour une commande bloquée, conserver la position, consommer l'impulsion et enregistrer un refus local qui sera transmis à l'étape d'observation par le canal autorisé.

Les invariants de collision sont certains ; le choix entre deux demandes concurrentes et la politique de propagation des refus ne sont pas définis par T. S rejette ses propres traces en collision par assertion ; il ne fournit pas de résolveur de conflits. Voir PT-03. Une erreur structurelle de commande, un droit absent et un obstacle non connu doivent être distingués, PT-04.

### 3.3 Réceptions et manutention

1. À la position résultante, appliquer les opérations locales admissibles : livraison à destination, dépôt/reprise autorisés, chargement prévu.
2. Une livraison est un fait matériel daté t. L'enregistrer une seule fois pour ce colis ; son transport ou un reçu répété ne crée pas une nouvelle livraison.
3. Décharger les colis effectivement reçus de l'inventaire porté. Appliquer l'effet physique connu de la réception, notamment les seuils de batterie en §7.
4. Appliquer les chargements sans impulsion supplémentaire et sans jamais dépasser deux colis.
5. Enregistrer séparément les clôtures de la mesure d'EVA : un dépôt au transfert peut clôturer selon cette mesure sans satisfaire un besoin physique.

Dans S, au sommet P, l'ordre local est précisément : recevoir la batterie, retirer cette batterie du chargement, prendre Q3 si disponible et pas déjà prise, puis Q4 si disponible et pas déjà prise, enfin contrôler la capacité. Au sommet Q, recevoir tous les colis de fourniture portés et les retirer du chargement. Cet ordre explique qu'un robot arrivé en P avec batterie + Q2 puisse repartir avec Q2 + Q3.

S applique ces opérations à chaque impulsion où le robot est en P ou Q, même sans nouvelle arrivée. G et T parlent de manutention instantanée « à l'arrivée ». Ce décalage, le chargement initial à O et les choix entre colis concurrents sont ouverts en PT-05. Ne pas généraliser le chargement automatique du vérificateur : D §14 précise que chargements et dépôts sont des choix du calcul.

### 3.4 Observations

1. Évaluer les sources réellement disponibles après les déplacements et réceptions de t.
2. Calculer les seules cibles/propriétés couvertes, compte tenu de la géométrie et des capacités de la source.
3. Produire des faits datés et sourcés ; transmettre également les constats locaux autorisés, dont un refus de franchissement.
4. Alimenter les connaissances des destinataires autorisés. Conserver les anciennes observations lorsque la source cesse de couvrir ; ne pas rafraîchir leur valeur depuis l'état réel.

Une arrivée en C à t5 donne l'observation de la porte à la fin de t5, utilisable pour le choix de t6. La caméra fixe ne fournit rien à t4, t5 et t6 ; elle donne une nouvelle observation à la fin de t7. Une observation ne répare ni stock ni pompe.

Les échéances surviennent ensuite : l'observation de t peut précéder une perte survenue à l'étape finale du même t. Il faut conserver l'ordre intra-impulsion et définir la présentation de cette fraîcheur sans fuite ; point ouvert PT-11. Ne pas déplacer silencieusement les observations après les échéances.

### 3.5 Échéances, dégâts et clôture

1. Évaluer les besoins qui arrivent au contrôle ou à la clôture de leur fenêtre, en tenant compte des réceptions de t.
2. Appliquer les pertes irréversibles aux seuils : absence de batterie à t8, puis à t10, selon §7.
3. Clore les besoins échus sans remplacement ni points rétroactifs. Une réception tardive conserve ses effets physiques autorisés.
4. À t16, appliquer également la condition finale opérationnelle de chaque service de dernière phase, puis calculer le bilan définitif de la tentative.

Les contraintes entre contrôles de disponibilité et dégâts simultanés doivent être fixées pour les cas généraux, PT-08. Les témoins T n'ont pas de conflit de ce type à t12/t16. Aucune fin anticipée dans la tranche A : une perte de stock ou de pompe ne saute pas directement au bilan ; on atteint t16.

## 4. Mouvement et manutention : invariants

Sources : G §4, T §1 et D §6.

- Un déplacement réussi franchit exactement une arête par impulsion. Un trajet de plusieurs arêtes possède plusieurs étapes ; aucune animation ne peut raccourcir sa durée simulée.
- Attendre conserve la position et consomme une impulsion du monde. Dans G, attendre ne coûte aucune énergie.
- Au plus un robot par sommet après chaque résolution. Charger, livrer, observer ou attendre ne libère pas le sommet.
- Interdiction de l'échange simultané `u→v` et `v→u` sur la même arête.
- Autorisation d'entrer dans un sommet effectivement libéré à la même impulsion. Exemple admissible : R1 quitte T pour D, R2 quitte O pour T, si D est libre et les deux traversées sont légales.
- Si R1 ne peut finalement pas quitter T, R2 ne peut pas entrer dans T. Il ne faut pas conserver un mouvement devenu incompatible.
- Deux colis au maximum par robot, batterie comprise. Ni duplication ni disparition du chargement lors d'un refus ou d'une suspension.
- Chargement et déchargement ne demandent pas d'impulsion supplémentaire à l'arrivée. Ils laissent le robot sur place.
- Un dépôt au transfert nécessite son propre droit ; le transit à travers T peut rester légal sans ce droit.
- Une commande bloquée consomme l'impulsion, conserve la position et produit un constat local. Le constat ne révèle pas le contenu de la zone au-delà du passage.
- Transport, observation en poste fixe et réparation ne se cumulent pas comme activités simultanées d'un même robot. Observer après avoir rejoint C est explicitement permis par T §2.

Dans G, chaque déplacement réussi coûte une unité d'énergie et le plan est borné à six impulsions. Aucun coût de refus, budget énergétique complet du Dernier passage, déplacement multi-arête en une impulsion, action diagonale ou téléportation n'est autorisé implicitement.

## 5. Observation et règle de non-fuite

### 5.1 Les trois états

| État | Données accessibles | Présentation autorisée |
| --- | --- | --- |
| Observé maintenant | Fait reçu pour l'étape d'observation courante depuis une source couvrante | État observé, provenance et instant de capture ; fraîcheur intra-impulsion à résoudre en PT-11 |
| Dernière observation datée | Dernier fait effectivement reçu, conservé sans actualisation clandestine | Silhouette/état distinct, position et date de ce fait ; âge calculé à partir de t |
| Inconnu | Aucune observation de cette propriété | Absence de valeur ; géométrie statique déjà connue seulement |

Les états s'appliquent aux propriétés, pas seulement à un lieu entier. Un lecteur qui confirme un dépôt ne confirme pas une réception distante. Plusieurs validations issues du même lecteur ne constituent pas plusieurs confirmations indépendantes. Une trajectoire future affichée est une intention ou une prévision, pas un déplacement constaté.

### 5.2 Contrat de non-fuite

Pendant la tentative, **aucune information actualisée sur l'état d'un lieu non observé ne doit atteindre le joueur par un quelconque canal**. Les anciennes observations, événements annoncés et géométrie connue restent accessibles avec leur statut réel. Un refus local constitue une observation limitée, pas une exception omnisciente.

Pour deux mondes ayant la même information publique et le même historique d'observations reçues, la projection joueur et les décisions d'EVA, à entrées autorisées identiques, doivent rester identiques tant qu'aucune nouvelle observation ne les distingue. Leurs états physiques peuvent différer.

Cette obligation couvre : modèles et silhouettes, déplacements interpolés, ombres, reflets, éclairage réactif, eau, particules, sons, sélection/raycast, collisions du pointeur, surbrillance, infobulles, menus d'action, notifications, nombres, barres d'état, journaux, DOM/accessibilité, prévisualisation des itinéraires et explications du planificateur. Un bouton ne devient pas désactivé parce qu'une porte cachée est réellement bloquée ; il peut l'être pour une restriction déjà connue. Un compteur de score pendant le jeu ne doit pas révéler les réussites physiques cachées.

La caméra de présentation, sa rotation, son zoom et les réglages graphiques n'acquièrent aucune connaissance. Les collisions de simulation consultent le monde réel ; les interactions de présentation consultent la projection autorisée. Le rendu ne reçoit pas les champs cachés pour les masquer ensuite par du CSS ou par un matériau transparent.

Le bilan définitif révélé **après** la tentative est expressément permis par D §16 ; c'est une exception de débriefing à borner en PT-17. Cela ne justifie aucune fuite en cours de tentative ni révélation narrative gratuite.

### 5.3 Cas de la porte du Dernier passage

- Observation ancienne : porte ouverte à t2.
- Au début de t4 : cycle mécanique annoncé ; variante ouverte ou bloquée fixée au lancement, résultat non reçu ; caméra fixe en maintenance.
- Sans robot observateur en C, les deux variantes ont exactement la même information accessible à t4.
- Observateur déjà en C à t4 : résultat disponible à la fin de t4.
- Observateur initialement en H, déplacement H→C à t5 : résultat disponible à la fin de t5.
- Depuis G, le robot transporteur ne voit pas la porte A derrière le coude du hangar. Une tentative G→A refusée à t6 donne une télémétrie de refus à t6.
- La caméra fixe reprend une observation à la fin de t7. Cette observation ne peut changer le déplacement de t7.
- Maintenir la vue depuis C immobilise le second transporteur. Il peut repartir après une observation suffisante ; cette observation devient alors historique si aucune autre source ne prend le relais.

Si la géométrie finale permet de voir A depuis G, la découverte intervient à t5 et le cinquième témoin doit être recalculé. On ne peut conserver son score de 800 en cachant artificiellement une vue que le modèle de capteur autorise.

## 6. Missions, droits, planification et suspension

Source : D §§6, 14, 20 et G §2.

Un contrat précise obligatoirement **objectif, zone, durée, accès et ressources**. L'objectif distingue la mesure de clôture, les priorités et les contraintes. La fonction locale du planificateur, la satisfaction humaine physique et le score de défi sont trois notions séparées.

Le générateur construit les plans depuis les observations d'EVA, les équipements connus et ses droits. Le sélecteur compare les résultats prévus. Le moteur physique vérifie chaque action dans l'état réel à son exécution, sans livrer préalablement cet état au planificateur.

Un droit valide à la création du plan ne suffit pas : cible, action, mission, canal, durée et limites héritées doivent encore autoriser l'action quand elle s'applique. Les limites des sous-missions ne peuvent dépasser celles du parent. Les commandes directes utilisent leur canal identifié et ne suppriment pas les contraintes matérielles.

Une contrainte « médical reçu en B avant l'échéance » élimine les plans qui ne prévoient pas cette réception. Sous information partielle, elle ne garantit pas que la porte sera franchissable. L'accès interdit est une limite effectivement imposée à l'exécution ; le résultat exigé est une condition sur le résultat prévu, à comparer ensuite au fait réel.

EVA conserve sa mission et peut recalculer lors d'une demande ou observation nouvelle. Le budget de recherche est fini ; départage stable et limites sont enregistrés. « Aucune solution trouvée » ne prouve pas l'impossibilité globale si la recherche est bornée. PT-14 doit fixer l'horizon, les hypothèses sur l'inconnu, les déclencheurs et le départage avant d'implémenter le planificateur général.

Suspendre empêche les prochaines actions de la mission au prochain point d'arrêt défini. Une action atomique déjà appliquée reste appliquée : ni annulation d'une livraison, ni remboursement automatique d'énergie, ni retour d'un robot au départ. Un trajet long comporte plusieurs points d'arrêt ; leur placement exact et l'atomicité déplacement/manutention sont PT-07. Une mission suspendue n'arrête pas automatiquement un équipement alimenté par une autre dépendance.

Une équipe de dernier kilomètre peut rendre le transfert réellement utile, avec présence, capacité et délai physiques. Elle est absente du microcas G. Le checkpoint T ne démontre pas cette mécanique ; ses règles complètes relèvent de PT-13.

La sélection de politiques destinataire/guide/balise de D §14 est une seconde mécanique, ultérieure : sélectionner d'après des erreurs sur exemples et un départage stable, tester la politique gelée, puis réentraîner explicitement si les exemples changent. Elle ne doit pas être simulée par un simple changement de texte ou confondue avec J. Son contrat numérique manque, PT-18.

## 7. Dernier passage : instance physique et pertes

### 7.1 Graphe et checkpoint

Arêtes bidirectionnelles, toutes de durée 1 : `OT`, `TG`, `GA`, `AP`, `PQ`, `TD`, `DE`, `EF`, `FP`, `TH`, `HC`. Les sommets sont O, T, G, A, P, Q, D, E, F, H et C. Le sommet F du détour n'est pas le service ferry F : utiliser des types d'identifiants distincts.

- O : dépôt ; T : jonction/transfert ; G–A : porte ; A–P : passerelle mobile.
- P : pompe et casier ; Q : réception de fournitures.
- D–E–F : détour au niveau bas, évitant porte et passerelle.
- H : accès haut ; C : coursive avec observation indépendante de la porte A.

À la fin de t4, R est en T avec la batterie destinée à P et Q2 destinée à Q. Le second robot est en C pour les témoins précoces, en H pour les autres. Le préfixe local compatible place les robots en O et H à t3 ; il ne démontre pas la réalisation de P1/F1/Q1.

Q3 est dans le casier P, accessible dès t9 ; Q4 dans le même casier, accessible dès t13. Les créneaux de passerelle sont fixes dans les témoins. Le contrôle manuel de la passerelle appartient au poste complet encore incomplet.

### 7.2 Seuils irréversibles

La date pertinente est la **réception physique de la batterie en P**, pas sa clôture au transfert, l'arrivée d'un rapport ou une promesse du plan.

| Réception batterie | Stock pendant le poste | Pompe | Atelier au poste suivant | Points P2 |
| --- | --- | --- | --- | --- |
| Avant ou à t8 | Sauvé | Sauvée | Intact au regard de cet incident | 100 seulement si réception dans `(4,8]` |
| t9 ou t10 | Déjà perdu, jamais restauré par cette batterie | Sauvée | Reprise limitée possible | 0 |
| t11 ou après, ou aucune réception | Perdu | Réparation extérieure requise, indisponible pendant ce poste | Reste fermé au suivant | 0 |

À l'étape d'échéances de t8, si aucune réception admissible n'a eu lieu avant ou pendant t8, le stock devient inutilisable pour le reste du poste. À l'étape d'échéances de t10, si la batterie n'a toujours pas été reçue, une livraison à partir de t11 ne peut plus sauver la pompe pendant ce poste. Une batterie à t10 passe donc avant le seuil de perte de pompe.

Une observation, un meilleur critère, une suspension ou la réparation d'un autre équipement ne répare pas rétroactivement ces pertes. Les reprises de campagne ultérieures ne sont pas spécifiées par ces seuils : PT-16.

## 8. Barème physique du prototype

### 8.1 Principes

Quatre fenêtres, trois services et **douze identifiants de besoins**. Chaque besoin rapporte exactement 100 points au plus une fois ; score entier de 0 à 1 200 par incréments de 100. Le score est la somme des besoins physiquement satisfaits selon leurs conditions, jamais la somme des clôtures d'EVA.

Une livraison hors fenêtre ne satisfait pas le besoin, même si elle aide physiquement. Une livraison anticipée ne remplace pas un besoin futur. Aucun besoin de remplacement n'apparaît après une échéance. Répéter un reçu, reclasser un colis, déplacer un dépôt ou réparer ne crée pas de points supplémentaires.

P3 et P4 sont deux contrôles de disponibilité distincts, annoncés comme tels ; une même batterie peut permettre leur réussite. Cela ne constitue pas deux réceptions récompensées. Une fourniture Q2 tardive ne devient jamais Q3.

### 8.2 Les douze conditions

| Fenêtre | Besoin | Condition physique nécessaire |
| --- | --- | --- |
| `(0,4]` | P1 | Charge initiale suffisante au contrôle t4 ; seuil exact non fourni, PT-12 |
| `(0,4]` | F1 | Première traversée accomplie dans la phase ; horaire exact non fourni, PT-12 |
| `(0,4]` | Q1 | Fourniture initiale reçue pendant cette phase ; préfixe absent, PT-12 |
| `(4,8]` | P2 | Nouvelle batterie physiquement reçue en P à t5, t6, t7 ou t8 |
| `(4,8]` | F2 | Traversée physiquement accomplie à t6 |
| `(4,8]` | Q2 | Colis Q2 physiquement reçu en Q à t5, t6, t7 ou t8 |
| `(8,12]` | P3 | Pompe opérationnelle au contrôle t12 |
| `(8,12]` | F3 | Traversée physiquement accomplie à t10 |
| `(8,12]` | Q3 | Colis Q3 physiquement reçu en Q à t9, t10, t11 ou t12 |
| `(12,16]` | P4 | Pompe opérationnelle au contrôle t16 |
| `(12,16]` | F4 | Traversée physiquement accomplie à t14 **et service ferry opérationnel à t16** |
| `(12,16]` | Q4 | Colis Q4 physiquement reçu en Q à t13, t14, t15 ou t16 **et service fournitures opérationnel à t16** |

La condition finale de D §16 s'applique aux trois services : pour P4, elle est déjà contenue dans le contrôle t16. Pour F4/Q4, un fait candidat de traversée/réception ne suffit pas à rendre les 100 points définitifs avant ce contrôle.

### 8.3 Limites du score vérifié par S

S importe P1, F1 et Q1 comme vrais : **300 points supposés**. Il considère F2, F3 et F4 vrais avec les créneaux de ferry maintenus. Il calcule P3/P4 uniquement par une réception de batterie avant ou à t10. Il ne simule ni consommation de pompe, ni indisponibilité du service fournitures, ni condition finale du ferry/fournitures.

Les scores de S sont donc des oracles conditionnels du sous-cas, avec ces hypothèses déclarées. Le moteur général devra reproduire ces scores dans une fixture compatible, puis tester les conditions supplémentaires de D. PT-02 interdit de supprimer la condition finale pour faire coïncider artificiellement les modèles.

## 9. Tests d'or et validation à implémenter

Cette section prescrit les futurs tests ; elle n'ajoute aucun code de test. Le script existant S a été exécuté en lecture seule pendant la rédaction et a reproduit les cinq résultats ci-dessous.

### 9.1 Six optima du microcas G §4

Fixture : graphe bidirectionnel `OT`, `TA`, `TX`, `XY`, `YB` ; un robot en O ; deux colis commerciaux C1/C2 destinés à A et un médical M destiné à B ; tout commence au dépôt ; capacité 2 ; six impulsions maximum ; aucune équipe de dernier kilomètre ni obstacle caché. Le chargement initial fait partie des paramètres à confirmer en PT-05, comme l'exigent les témoins.

`J = 10 × (nombre de clôtures commerciales + w × nombre de clôtures médicales) − nombre de déplacements`.

Une clôture commerciale par colis commercial au plus ; une clôture médicale au plus. La mesure « transfert ou réception » reconnaît le premier de ces événements admissibles pour un colis, sans compter une seconde fois la livraison finale. Une attente coûte du temps mais pas de déplacement ni d'énergie. Un plan peut se terminer avant six impulsions.

| Test | Mesure, poids et limites | Itinéraire optimal témoin | Déplacements | J maximal | Réceptions physiques avant l'échéance |
| --- | --- | --- | ---: | ---: | --- |
| OR-G1 | Réception réelle, w=1 | O→T→A, avec C1+C2 | 2 | 18 | C1 et C2 en A ; M non reçu |
| OR-G2 | Réception réelle, w=3 | O→T→A→T→X→Y→B, avec C1+M | 6 | 34 | Un commercial en A et M en B |
| OR-G3 | Transfert ou réception, dépôt T autorisé, w=1 | O→T→O→T, deux colis puis le troisième | 3 | 27 | Aucune ; trois colis déposés en T |
| OR-G4 | Transfert ou réception, dépôt T autorisé, w=3 | O→T→O→T, deux colis puis le troisième | 3 | 47 | Aucune ; trois colis déposés en T |
| OR-G5 | Réglage OR-G4 avec contrainte M reçu en B | O→T→O→T→X→Y→B | 6 | 44 | M en B ; deux commerciaux toujours en T |
| OR-G6 | Transfert ou réception, w=3, dépôt T interdit | O→T→A→T→X→Y→B, avec C1+M | 6 | 34 | Un commercial en A et M en B |

OR-G5 : déposer C1+C2 au premier T, revenir en O chercher M, puis livrer M en B. Qu'il soit clôturé lors d'un dépôt autorisé intermédiaire ou seulement à B, M ne rapporte qu'une clôture. Aucun coût de manutention supplémentaire ne doit être introduit silencieusement.

Chaque test doit vérifier le maximum par exploration de toutes les marches de zéro à six arêtes et de tous les choix admissibles de manutention sous capacité 2, ainsi que la faisabilité du témoin. Tester seulement J sur le trajet écrit ne prouve pas l'optimalité. Les permutations de C1/C2 ou les plans ex æquo doivent rester admissibles ; l'itinéraire témoin n'est pas une animation imposée. Les attentes sont à inclure ou à justifier comme dominées dans ce microcas sans événements.

### 9.2 Cinq témoins T §3, complétés jusqu'à t16 par S

Tous les trajets de R commencent en T à t4, avec batterie + Q2. Les cellules ci-dessous sont des **positions effectives**, une par impulsion. Les commandes sont identiques à ces positions sauf OR-T5 à t6 : commande vers A, refus, position effective G. Le second robot reste en C après son observation, ou en H dans OR-T5 sans observateur.

| Test | Variante ; second robot | t5 | t6 | t7 | t8 | t9 | t10 | t11 | t12 | t13 | t14 | t15 | t16 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OR-T1 | Porte ouverte ; déjà en C à t4 | G | A | P | Q | P | Q | Q | Q | P | Q | Q | Q |
| OR-T2 | Porte bloquée ; déjà en C à t4 | D | E | F | P | Q | P | Q | Q | P | Q | Q | Q |
| OR-T3 | Porte bloquée ; H→C à t5, R attend | T | D | E | F | P | Q | Q | Q | P | Q | Q | Q |
| OR-T4 | Porte bloquée ; H→C à t5, R commence court | G | T | D | E | F | P | Q | Q | P | Q | Q | Q |
| OR-T5 | Porte bloquée ; second robot reste en H | G | G | T | D | E | F | P | Q | P | Q | Q | Q |

| Test | Réception batterie | Q2 | Q3 | Q4 | Besoins perdus | Score conditionnel | Conséquence |
| --- | ---: | ---: | ---: | ---: | --- | ---: | --- |
| OR-T1 | t7 | t8 | t10 | t14 | Aucun | **1 200** | Stock et pompe sauvés |
| OR-T2 | t8 | t9 | t11 | t14 | Q2 | **1 100** | Stock et pompe sauvés |
| OR-T3 | t9 | t10 | t10 | t14 | P2, Q2 | **1 000** | Stock perdu, pompe sauvée |
| OR-T4 | t10 | t11 | t11 | t14 | P2, Q2 | **1 000** | Stock perdu, pompe sauvée |
| OR-T5 | t11 | t12 | t12 | t14 | P2, Q2, P3, P4 | **800** | Stock perdu, pompe hors service ; atelier fermé au suivant |

Pour chaque témoin, vérifier toutes les positions, l'adjacence, les créneaux de passerelle, la capacité après manutention, les dates de réception, les identités de besoins, le score et les pertes. Aucun témoin ne traverse la passerelle relevée ; OR-T1 la franchit à t7. Q2 peut être physiquement reçue sans marquer ses points ; Q3 est un autre colis et garde sa propre fenêtre.

Vérifications d'information supplémentaires à écrire : OR-T1/OR-T2 doivent disposer d'une observation à t4 ; OR-T3/OR-T4 ne disposent du nouveau fait qu'après leur action de t5 ; OR-T5 découvre le refus à t6 et repart vers T à t7 avant la nouvelle observation fixe de fin t7. S ne teste pas ces observations : sa liste de positions du second robot ne prouve ni sa couverture ni l'absence de fuite.

### 9.3 Autres tests de conformité nécessaires

- **Temps/limites** : réception batterie exactement à t8, t9, t10, t11 et absence de réception ; bornes ouvertes/fermées de chaque fenêtre ; aucune avance par attente réelle, lecture ou animation.
- **Simultanéité** : entrée dans un sommet effectivement libéré admise ; sommet occupé interdit ; échange d'arête interdit ; conflit vers une même destination et départ bloqué conformément à la décision PT-03.
- **Manutention** : conservation des identifiants ; capacité 2 ; décharger batterie avant charger Q3 ; un dépôt et sa reprise ne doublent pas une clôture ; droits de dépôt distincts du transit.
- **Droits/suspension** : droit retiré entre planification et exécution ; limites de sous-mission ; action atomique déjà appliquée conservée ; autres circuits toujours alimentés si leur état le permet.
- **Non-fuite** : même projection à t4 dans les deux variantes sans C, y compris DOM, sélection, son, score et explications d'EVA ; état daté inchangé ; rotation/qualité graphique sans information nouvelle ; absence de vue A depuis G.
- **Barème** : chaque besoin vaut au plus 100 ; Q2 tardive ne devient pas Q3 ; P3/P4 restent deux contrôles distincts ; F4/Q4 privés de points si leur condition opérationnelle finale échoue, après PT-02.
- **Déterminisme** : même scénario, version, graine et journal d'ordres donnent le même état et les mêmes observations ; permutation de l'ordre de stockage sans changement de résolution ; sérialisation/reprise sans avance de temps ni nouveau tirage.
- **Contrefactuels de D §15** : observation maintenue conserve la vue ; bon critère peut éviter la clôture prématurée ; retrait du droit empêche l'action ; réception à temps empêche les dégâts. Aucun incident compensatoire ne punit ces réussites.

## 10. Déterminisme, replay et continuité

Dans `src/sim/`, aucun `Math.random` ni `Date.now`. Tout aléa provient d'un RNG à graine explicite ; événements et variantes sont indexés par le scénario, sa version et les impulsions. La caméra, la fréquence de rendu et le temps d'exécution de la recherche ne doivent pas changer le résultat.

Une sauvegarde conserve version du format, version du scénario/moteur, graine et état du RNG, impulsion, état réel, observations reçues, missions et droits, registres de réceptions/clôtures/besoins, conséquences et journal ordonné des actions. Le format concret, l'algorithme RNG et la migration sont PT-15. Revenir d'arrière-plan ne rattrape pas des heures par des impulsions automatiques.

La préparation est annulable ; une impulsion exécutée appartient à la tentative. En défi classé, pas d'annulation d'impulsion ; recommencer crée une nouvelle tentative au même départ. En campagne, rejouer crée une branche ou remplace explicitement sa suite, sans fusionner les bénéfices de deux tentatives. Une aide révélant la solution marque l'entraînement, qui ne modifie pas le record d'une tentative complète.

Le bilan ajoute au score les services encore opérationnels et l'heure fictive atteinte ; deux résultats identiques sont ex æquo. Comparer seulement les contrats ayant mêmes situation, version, difficulté, ressources et possibilités d'aide. Le score local est déclaratif ; aucun serveur ni publication automatique n'est requis ici.

## 11. Points à trancher

**Aucune proposition de cette section n'est adoptée automatiquement.** Les règles connues des sections précédentes restent valables ; les extensions dépendantes attendent un arbitrage. Les points distinguent une contradiction apparente, une omission du vérificateur et une règle simplement absente. Une réponse peut référencer les identifiants ci-dessous.

### PT-01 — Quand les besoins sont-ils connus ?

**Ambiguïté :** D §16 annonce des échéances/conditions connues au départ puis précise, pour le prototype, que chaque besoin est révélé au début de sa fenêtre. T §4 annonce explicitement P3/P4 au départ. Est-ce le catalogue complet, la seule règle générique, ou l'instance qui est différée ?

**Proposition à valider :** publier les douze identifiants, fenêtres et conditions dès t0 ; « révéler au début de fenêtre » signifie activer le besoin et afficher sa notification, sans cacher une règle future. Aucun résultat physique caché n'est révélé avec cette activation.

### PT-02 — État opérationnel final de F et Q

**Écart de couverture :** D §16 exige une condition opérationnelle finale pour les trois services. T §4 ne la détaille pas pour F4/Q4 et S force les ferries vrais, sans état opérationnel F/Q. Ce n'est pas une démonstration que la condition générale est inutile.

**À décider :** quelles alimentations, installations et voies rendent F et Q opérationnels à t16, notamment quand la pompe est perdue dans OR-T5 ? **Proposition :** garder F et Q indépendants de la pompe dans la fixture T, avec leurs équipements requis fonctionnels, afin de préserver 800 ; définir séparément les dépendances du poste complet. F4/Q4 ne deviennent définitifs qu'à t16.

### PT-03 — Arbitrage des collisions simultanées

**Incomplet :** T fixe occupation, non-échange et libération simultanée ; S se contente d'assertions. Rien ne choisit le gagnant de deux entrées concurrentes, ni ne définit les cycles de trois robots dans une extension.

**Proposition :** refuser tous les mouvements partageant une destination et tous les échanges opposés ; propager les refus tant qu'un mouvement vise un sommet dont l'occupant reste finalement sur place. Autoriser les autres mouvements, dont les cycles d'au moins trois sommets. Appliquer ce calcul sans dépendance à l'ordre des robots ; les robots refusés consomment l'impulsion et émettent un constat local limité. Cette politique doit être confirmée avant le résolveur général.

### PT-04 — Ordre illégal et portée d'un refus

**Incomplet :** « commande bloquée » ne distingue pas un obstacle caché, une destination non adjacente, un droit déjà absent lors de la préparation ou révoqué après engagement. La cause détaillée du refus peut elle-même révéler trop d'information.

**Proposition :** rejeter sans engagement les erreurs structurelles et restrictions déjà connues ; une action engagée devenue impossible consomme l'impulsion. La télémétrie confirme le refus de traversée, sans diagnostiquer des causes qu'aucun capteur n'a mesurées. Un refus n'entraîne pas un détour automatique dans la même impulsion. Confirmer le coût énergétique associé avec PT-05.

### PT-05 — Chargement initial, manutention stationnaire et énergie

**Ambiguïtés :** G suppose un robot pouvant partir chargé de O, mais dit « à l'arrivée » ; S manipule à chaque présence en P/Q. Les sources ne donnent ni arbitrage de colis lorsque la capacité manque, ni coût d'une tentative bloquée, ni autonomie des robots du Dernier passage.

**Proposition :** autoriser le chargement initial à t0 sans impulsion ; ensuite, exécuter une liste explicite d'opérations locales à l'étape de réceptions, même après attente, déchargements avant chargements. Refuser un chargement qui dépasse la capacité, sans faire disparaître le colis. L'automatisme de S n'est que la liste d'ordres de ses témoins. G utilise un budget de six unités, coût 1 par déplacement réussi, 0 pour attente/refus ; ne pas modéliser l'énergie de traction dans la fixture T. Le budget et les opérations de recharge du poste complet restent à fournir.

### PT-06 — Validité, héritage et ressources de mission

**Incomplet :** D donne les cinq dimensions mais pas les bornes d'expiration, le moment de révocation, les conflits mission/commande directe, les ressources partagées ou la propagation d'une suspension parentale.

**Proposition :** autoriser l'action à t si t appartient à l'intervalle inclusif du contrat et du droit ; appliquer les modifications faites en pause avant la prochaine exécution ; intersections des limites parentes à chaque action ; une même ressource active ne reçoit qu'un ordre engagé ; conflit connu signalé avant engagement. Expiration/suspension du parent bloque les futures actions des enfants sans annuler les effets passés. La reprise requiert de revalider les allocations.

### PT-07 — Point d'arrêt, atomicité et activité d'observation

**Incomplet :** D dit « prochain point d'arrêt défini » sans le définir. T autorise déplacement vers C puis observation dans la même impulsion, malgré l'exclusion des activités de D §6.

**Proposition :** aucun point d'arrêt au milieu d'une impulsion ; arrêt à sa frontière après toutes ses étapes. La prochaine impulsion ne reçoit plus d'ordre de cette mission. Déplacement et manutention engagée de l'impulsion finissent ensemble ; l'observation locale après arrivée ne constitue pas un second travail de transport. Maintenir l'observation en C immobilise ensuite le robot ; son départ met fin à cette couverture. Durée et points d'arrêt des réparations restent à définir avant leur ajout.

### PT-08 — Événements concurrents, contrôles et commandes d'équipement

**Incomplet :** l'ordre des cinq étapes est fixé, mais pas celui d'événements simultanés contradictoires, d'une commande de passerelle et d'un ferry, ni d'un dégât et d'un contrôle de disponibilité simultanés.

**Proposition :** dans les fixtures, refuser les scénarios contenant deux écritures incompatibles sur un équipement au même instant ; ordonner les autres événements par identifiant stable. Dans l'étape finale, appliquer les dégâts de seuil après les réceptions puis évaluer les contrôles de disponibilité. Ne pas ajouter de commande manuelle de passerelle au sous-cas T ; ses interverrouillages et délais doivent être spécifiés pour le poste complet.

### PT-09 — Géométrie et couverture des sources

**Incomplet :** le graphe ne fournit pas dimensions, hauteur, volumes occultants, champ visuel, portée ni règles de visibilité partielle. T exige C→A visible et G→A invisible, sans calcul 3D. L'image de DA ne fixe pas ces propriétés.

**Proposition :** formaliser d'abord une table de couverture logique pour la fixture T (caméra/robot en C observent la porte ; G ne reçoit que le refus local), puis définir une géométrie simplifiée garantissant exactement ces relations. Choisir unités, volumes, portées et règles d'occlusion avant la scène jouable. Les différents niveaux de qualité graphique doivent conserver la même couverture simulée.

### PT-10 — Transmission, fraîcheur, croyances et sources contradictoires

**Incomplet :** D mentionne un accusé distant éventuellement tardif ; T suppose des observations disponibles à la fin de certaines impulsions. Aucun protocole ne précise quels faits arrivent à EVA, au joueur, avec quel délai, ni comment fusionner deux sources divergentes. L'âge maximal de validité d'une observation n'est pas défini.

**Proposition :** latence nulle et routage explicite vers joueur/EVA pour les sources de la fixture T ; conserver les faits datés indéfiniment sans en faire une certitude actuelle. Une couverture perdue donne immédiatement une dernière observation datée. Conserver séparément les rapports divergents et leur origine commune ; ne pas écraser par une « vérité » obtenue hors observation. Définir les latences et la politique de croyance du cas général avant le planificateur partiel.

### PT-11 — Observations avant pertes de fin d'impulsion

**Tension réelle :** T place les observations avant les échéances. Une source peut donc observer à t8 un stock encore utilisable, puis le seuil le détruire à la fin de t8. D ne dit pas comment « observé maintenant » décrit cet instant.

**Proposition :** dater les faits avec l'étape de capture, présenter l'état comme observé à cette étape, et attendre la prochaine acquisition autorisée pour montrer le dégât. Ne pas rafraîchir les observations après les échéances ni invalider seulement les faits secrètement modifiés, ce qui serait une fuite. Confirmer si cette précision de fraîcheur suffit ou s'il faut une convention d'affichage datée uniforme à la frontière de l'impulsion.

### PT-12 — Poste complet et mécanique physique des services

**Manquant :** trajectoires t0–t4, horaire F1, emplacement/acheminement Q1, seuil de charge P1, consommation de pompe, autonomie après réparation, niveau d'eau, disponibilité de chaque équipement, mission concurrente du second robot et fonctionnement détaillé des ferries. S fixe les succès du ferry sans les simuler ; la seule passerelle relevée ne définit pas toutes les conditions d'une traversée.

**Proposition de périmètre :** valider d'abord le checkpoint T avec 300 points de préfixe explicitement importés, les traversées ultérieures imposées par sa fixture et une batterie à t10 au plus rendant la pompe disponible jusqu'à t16. Ne pas présenter ce sous-cas comme un poste complet validé. Fournir ensuite un scénario t0–t16 avec toutes ces données pour supprimer les hypothèses. Préciser aussi si la batterie livrée est consommée et devient irrécupérable.

### PT-13 — Transfert, équipe locale et récupération

**Incomplet :** G permet dépôt/reprise en T sous droit et sans manutention supplémentaire ; D exige un cas utile avec équipe de dernier kilomètre. Capacité du transfert, cohabitation équipe/robots, trajets, disponibilité, délais, droits de reprise et traitement d'un colis déjà reçu ne sont pas définis.

**Proposition :** microcas G sans équipe ; dépôt T ouvert aux trois colis de l'essai et reprise des colis non reçus si le droit le permet. Une réception finale ferme la livraison et n'est pas récupérable dans ce microcas. Ne pas implémenter l'équipe locale à partir de ces seules hypothèses ; spécifier ses ressources et actions pour le cas utile de D.

### PT-14 — Planificateur borné et politique sur l'inconnu

**Manquant :** horizon du poste complet, budget de recherche, déclencheurs exacts de replanification, départage total entre plans ex æquo, traitement d'une porte inconnue/périmée, gestion des contraintes devenues irréalisables, combinaison de priorités portant sur des cibles superposées et comptage des clôtures si la mesure change en cours de mission.

**Proposition :** exploration exhaustive indépendante pour les six tests G, priorité médicale 1 ou 3, déduplication par identité du colis. Pour le poste complet, faire approuver une politique explicite de croyance et un budget déterministe en nombre d'états, jamais en millisecondes. Ne pas sélectionner implicitement une politique optimiste ou pessimiste : elle détermine précisément les décisions que l'observation doit permettre d'améliorer.

### PT-15 — Graine, sauvegarde et journal

**Manquant :** format/domaine de graine, algorithme et version RNG, ordre des tirages, format des identifiants, sérialisation, migrations, gestion d'un journal invalide et récupération après interruption d'une écriture.

**Proposition :** versionner scénario et RNG, enregistrer leur état et n'utiliser que des tirages du noyau avec ordre stable ; publier le journal d'ordres après tentative selon PT-17. Choisir l'algorithme et les formats avant l'implémentation du replay ; aucune compatibilité interversion implicite.

### PT-16 — Suite de campagne et portée des pertes

**Incomplet :** stock perdu pour le poste et atelier fermé au suivant sont établis, mais le coût de remplacement, la reprise limitée, la réparation extérieure et les conditions de départ d'équipe ne sont pas chiffrés.

**Proposition :** le prototype produit uniquement les conséquences persistantes décrites en §7, sans inventer une économie de campagne. Les règles d'application au poste suivant, de branche/remplacement et de départ d'Alma doivent être spécifiées avant la campagne ; aucun départ automatique à cause d'un simple retard.

### PT-17 — Frontière de non-fuite et bilan de fin

**Tension de portée :** la non-fuite demandée est absolue en cours de jeu, tandis que D §16 autorise un bilan définitif après tentative. Une sauvegarde locale ou une graine publiquement décodable peut révéler le monde à quelqu'un qui inspecte les fichiers, sans passer par l'interface.

**Proposition :** garantir l'indiscernabilité dans tous les canaux de jeu, interface et planification inclus ; révéler les résultats physiques de score seulement après t16. Ne pas promettre un secret résistant à l'inspection d'un moteur local. Définir séparément les éléments narratifs et traces autorisés au débriefing/partage ; aucune publication automatique.

### PT-18 — Seconde mécanique de généralisation

**Manquant :** D §14 décrit trois politiques, une sélection sur exemples et un départage stable, sans types d'exemples, fonction d'erreur, jeux d'essai ni règle totale de sélection.

**Proposition :** la déclarer hors de l'implémentation initiale du transport et des témoins, tout en conservant les exigences de test gelé/réentraînement de §6. Écrire sa propre fixture et ses tests d'or avant de l'ajouter ; les six optima J ne la valident pas.
