# Validation, pédagogie et limites — V2

Complément actif de [DOSSIER-V2.md](DOSSIER-V2.md). Les tableaux de joueurs sont des hypothèses de conception. Aucun participant humain ni appareil mobile n'a encore validé ce jeu.

## 1. Ce qui a été vérifié et ce qui ne l'a pas été

Trois agents ont proposé des changements, puis relu la consolidation. Les corrections portent notamment sur la maintenance indépendante des précautions, la différence entre tester et réentraîner, le transfert réellement utile, les seuils d'arrivée et l'utilité décisionnelle de l'observation.

Le script [objectifs-v2.mjs](verification/objectifs-v2.mjs) énumère les états atteignables du microcas à un robot sur zéro à six déplacements. Il explore les chargements, dépôts, reprises et réceptions, dans une capacité de deux colis. Les opérations locales sont gratuites dans cette simulation. Une clôture ne compte qu'une fois. Le départage conserve un témoin avec peu d'opérations locales ; cette convention n'ajoute pas une récompense pédagogique cachée.

Commande reproductible depuis la racine du projet :

```text
node conception/verification/objectifs-v2.mjs
```

| Configuration | Maximum contrôlé | États uniques explorés |
| --- | ---: | ---: |
| Réception, priorité 1 | 18 | 587 |
| Réception, priorité 3 | 34 | 587 |
| Transfert, priorité 1 | 27 | 1 866 |
| Transfert, priorité 3 | 47 | 1 866 |
| Transfert, priorité 3, médical reçu exigé | 44 | 1 866 |
| Transfert, priorité 3, dépôt T interdit | 34 | 225 |

Ces nombres sont ceux de la fonction fictive du microcas, **pas le score du défi**. Le contrôle établit qu'un objectif ou un droit modifie les optima. Il ne mesure pas le plaisir, le réalisme d'une IA, la lisibilité, l'équilibrage de la mission à deux robots ou les performances 3D.

Le [sous-cas de reprise](contributions/V2-04-TRAJETS.md) complète la vérification de trajets et de seuils. Il commence à un état intermédiaire explicite ; il ne certifie pas que chaque arrivée dans cet état est réalisable depuis tous les débuts de mission.

Son [script](contributions/V2-04-TRAJETS.mjs), exécuté avec Node, contrôle cinq trajectoires : réception batterie à 7, 8, 9, 10 ou 11, avec stock puis pompe perdus aux seuils prévus. Les scores conditionnels sont 1 200, 1 100, 1 000, 1 000 et 800, **en supposant 300 points déjà acquis à t4**. Le préfixe complet, le coût concurrent du second robot et la visibilité réelle en 3D restent à vérifier. L'égalité d'information entre états cachés est un contrat de conception à implémenter ; elle n'est pas validée par un rendu existant.

## 2. Audit des vingt premières minutes

Temps visés pour une découverte, variables selon le joueur. Le monde avance seulement sur engagement. « Nouveauté » compte une famille de commande ou de lecture, pas chaque clic. Les minutes de réutilisation sont volontaires.

| Minute | Action principale | Nouveauté | Frottement à observer / décision |
| --- | --- | --- | --- |
| 01 | Sélectionner, livrer, comparer deux départs | Sélection + engagement | Montrer un seul objet utile, puis ouvrir l'alternative |
| 02 | Choisir une priorité, voir le plan changer | Mission proposée | Deux cartes illustrées ; pas de formule |
| 03 | Placer l'observateur, constater l'état d'un passage | Observation par déplacement | Distinguer cadrage gratuit et nouvelle observation |
| 04 | Réussir la combinaison connue | Aucune | Laisser le joueur préparer et savourer l'effet |
| 05 | EVA traite une demande suivante | Persistance de mission | Même vitesse et mêmes robots ; montrer le choix autonome |
| 06 | Une équipe termine réellement le transfert | Événement de fin compté | Visualiser les deux trajets ; aucun glossaire |
| 07 | L'équipe part avant le prochain lot | Aucune commande | Donner l'information avant engagement ; accepter adaptation réussie |
| 08 | Changer le critère ou récupérer le colis | Modification du critère | Montrer quelle partie du plan change |
| 09 | Refaire sur une disposition voisine | Aucune | Observer la maîtrise, ne pas ajouter la maintenance |
| 10 | Clore le poste, choisir une nouvelle tentative | Bilan | Pas de questionnaire obligatoire pour continuer |
| 11 | Reprendre le même lieu, besoin de batterie | Aucune | Résumé du besoin et des moyens, pas de réexplication générale |
| 12 | Voir l'échéance de maintenance | Calendrier d'équipement | Exprimer impulsion et effet local en une phrase |
| 13 | Garder un robot en observation ou le réaffecter | Rôle d'observation persistante | Un coût matériel identifiable ; pas de points d'audit |
| 14 | Organiser l'autre robot et la passerelle | Aucune | Laisser trouver un séquencement plus efficace |
| 15 | Observer arrêt caméra et information vieillissante | Statuts actuel / ancien / inconnu | La date reste visible ; pas d'animation secrètement actualisée |
| 16 | Comparer rapport de transfert et dernière observation | Aucune | Si le joueur croit à une preuve de malveillance, clarifier la portée |
| 17 | Choisir route courte ou détour selon l'état de porte | Aucune | Inspection doit changer une décision, pas seulement confirmer une évidence |
| 18 | Livrer, réaffecter ou accepter une perte locale | Aucune | La pause permet la réflexion ; la deadline du monde persiste |
| 19 | Voir l'état du stock et de l'atelier confirmé | Conséquence persistante | Distinguer correction d'une commande et réparation du dommage |
| 20 | Regarder le bilan et une trace facultative | Origine d'une validation | Reporter les acteurs industriels, le réentraînement et les contrats |

Si l'entrée reste trop dense, retirer la mission persistante du premier lot et la présenter lors de la réutilisation. Ne pas comprimer les informations sous un chronomètre ni multiplier les bulles d'aide.

## 3. Où vont les vingt-huit notions ?

La [carte initiale](ANNEXES.md#1-carte-pédagogique) garde ses champs détaillés : situation, croyance possible, action, observation, compréhension, terme. La table suivante remplace son ordre de priorité. A1–A6 désignent les six acquis de la V2. « Réserve » ne crée pas une obligation de contenu.

| Notion initiale | Place en V2 | Mise en pratique / limite |
| --- | --- | --- |
| 01 Modèle, produit, système | A1 | EVA planifie, un contrôleur autorise, un équipement agit |
| 02 Capacité et connaissances | A1 / A3 | Comparer capacité à accès constants, puis contexte nouveau |
| 03 Erreur et incertitude | A4 | Ancienne observation et affirmation sourcée |
| 04 Mémoire | Réserve | Préférence périmée si utile à une mission |
| 05 Outils et accès | A1 | Droit de dépôt effectivement contrôlé |
| 06 Agent et durée d'autonomie | A1 | Mission qui continue dans son périmètre |
| 07 Sous-missions | Réserve | Pas de système supplémentaire dans la tranche A |
| 08 Intention et métrique | A2, priorité prototype | Choix de clôture et plans recalculés |
| 09 Signal de récompense | A2, carnet | Distinguer sélection de plan et apprentissage |
| 10 Généralisation du but | A3, tranche B | Politique gelée, repères séparés, réentraînement distinct |
| 11 Environnement d'essai | A3 | Essai limité avant extension, pas de garantie universelle |
| 12 Moindre privilège | A1 | Accès retiré bloque un chemin d'action, sans assurer tous les besoins |
| 13 Supervision humaine | A4 | Information, disponibilité et intervention effective |
| 14 Observation et monitoring | A4, priorité prototype | Positionner une source indépendante |
| 15 Protections complémentaires | A4 / A5 | Observation et reprise couvrent des fonctions différentes |
| 16 Réversibilité | A5, priorité prototype | Stock perdu malgré interruption ultérieure |
| 17 Acceptation d'une correction | Frontière | Ne pas réduire la corrigibilité à notre bouton de suspension |
| 18 Calibration | Réserve | Pas de pourcentage de confiance inventé dans l'entrée |
| 19 Provenance et preuve | A4 / A6 | Trois validations, une source ; essai distinct |
| 20 Confiance dans l'automatisation | A3 / A4 | Confiance adaptée aux tâches, cas sain conservé |
| 21 Usage malveillant | A6, variante campagne | Origine d'un ordre nuisible, pas accusation automatique d'EVA |
| 22 Double usage | Réserve | Partage de résultats d'inspection, si nécessaire au récit |
| 23 Échelle | A5, campagne | Plusieurs services touchés par une cause commune |
| 24 Dépendance et concentration | A5 | Même relais et secours réellement disponible ou absent |
| 25 Incitations et concurrence | A6 | Essai, contrat, intérêt et portée des preuves |
| 26 Ressources et coordination internationale | A6, campagne | Composant et migration concrets, pas simulation géopolitique générale |
| 27 Comportement stratégique | Frontière | Hypothèses testées ; une anomalie seule n'établit pas une intention |
| 28 Perte de contrôle | Frontière | Capacités et chemins d'action futurs explicités |

Le joueur n'a pas à nommer ces vingt-huit notions. Les auteurs doivent savoir ce qu'une scène permet réellement de comprendre et ce qu'elle ne démontre pas.

## 4. Trois trajectoires d'apprentissage hypothétiques

Ces profils ne sont pas des diagnostics du public ni des observations réalisées. Ils servent à chercher des échecs pédagogiques possibles.

| Croyance de départ possible | Après 10 min | Après 30 min | Après 2 h | En fin de campagne |
| --- | --- | --- | --- | --- |
| « Toute IA finira par vouloir nuire » | A utilisé une mission utile, vu un transfert sain | Distingue besoin omis et intention malveillante | Accepte une extension bornée étayée, refuse une affirmation trop large | Raconte un mécanisme conditionnel, sans attribuer tous les incidents à une volonté |
| « Il suffit de donner la bonne consigne » | Voit qu'une mesure modifie le plan | Comprend qu'une réception prévue peut échouer faute de bonne observation | Éprouve une politique gelée dans un nouveau contexte, sans confondre essai et correction | Distingue limites de spécification, généralisation et moyens de reprise |
| « Un expert ou un dirigeant doit savoir » | Compare un rapport au résultat visible | Retrouve une source commune sous plusieurs validations | Demande une pièce pertinente malgré le statut de l'interlocuteur | Peut expliquer ce qu'un ancien employé, un fournisseur ou un responsable politique sait et n'établit pas |

### Protocole de transfert

Présenter un service nouveau, par exemple une réserve de froid plutôt qu'une livraison. Observer d'abord la décision, puis demander : « Qu'est-ce qui vous a fait choisir cela ? » Inclure un cas où déléguer est raisonnable, un cas où une observation supplémentaire aide, et un cas où cette observation ne suffit pas sans possibilité d'intervention.

Pour A3, conserver la politique pendant l'évaluation. Pour A6, changer les rôles des personnages entre variantes : la bonne preuve ne doit pas toujours venir de l'évaluatrice ou de l'ancien employé. Ne pas demander seulement une définition apprise dans le carnet.

## 5. Chaînes causales et statut des scènes

Classes utilisées : A = mécanisme documenté, avec contexte terrain ou expérimental précisé ; B = extrapolation plausiblement construite ; C = hypothèse prospective ; D = fiction ou règle de jeu. **Chaque scène du port est D**, même lorsqu'elle transpose un mécanisme documenté. Les sources de contexte sont dans [RECHERCHE.md](RECHERCHE.md), [RECHERCHE-V2.md](RECHERCHE-V2.md) et les annexes initiales.

| Événement V2 | Chaîne explicite | Contrefactuel | Statut et limite |
| --- | --- | --- | --- |
| Réussite du transfert sain | Équipe disponible → prise en charge → trajet réel → réception | Sans équipe, pas de réception magique | D, règle de logistique simulée |
| Indicateur satisfait, besoin omis | Clôture au transfert + droit de dépôt + absence de dernier trajet → plan moins coûteux → clôtures sans réception | Changer mesure ou retirer droit modifie le plan | A expérimental pour le mécanisme de spécification imparfaite ; port D |
| Mauvais repère après essais réussis | Exemples corrélés → politique sélectionnée → contexte séparant les repères → bonne navigation vers mauvais but | Évaluation gelée sur un cas séparant les repères détecte la différence | A expérimental pour le mécanisme étudié ; sélecteur jouet D |
| Perte de couverture | Maintenance annoncée + absence de relève → plus d'observation actuelle de la cour | Observateur indépendant conserve sa propre vue | D ; pas besoin d'une IA hostile |
| Trois validations communes | Trois rapports reprennent le lecteur T → un fait répété → réception finale non établie | Observation de destination apporte une autre donnée | B/D pour cette organisation ; aucune intention déduite seule |
| Stock perdu | Batterie non reçue à 8 → seuil physique fictif franchi → stock inutilisable | Arrivée à 8 sauve ; à 9 sauve seulement la pompe | D ; seuil d'équilibrage, pas modèle d'inondation validé |
| Dépendance de fournisseur | Remplacement de relais → compatibilité limitée → service interrompu pendant migration | Tester une voie indépendante rend une relève possible | B/D ; pas d'accusation contre une entreprise réelle |
| Ordre humain nuisible | Acteur disposant d'un accès → ordre nuisible → exécution dans son périmètre | Retirer cet accès empêche ses futurs ordres | D ; différent d'un objectif autonome inadéquat |
| Branche de perte de contrôle | Capacités futures + autonomie prolongée + chemins d'action externes + limites de reprise → difficulté de confinement | Bornage et isolation peuvent limiter certains chemins, selon hypothèses | C/D ; ni fréquence prédite ni prolongement nécessaire de la panne du quai |

## 6. Vérifications requises sur le futur moteur

### Objectif, règles et information

- Changer un critère ou un droit recalcule les plans ; aucun événement « mauvais choix du joueur » ne lance automatiquement un incident.
- L'optimiseur ne reçoit pas les variables inconnues de ses sources. À observations identiques, propositions et aperçus restent identiques.
- Une limite d'accès est appliquée au moment de l'action. Une obligation de résultat prévue n'est pas affichée comme garantie sous information incomplète.
- La maintenance a le même horaire avec ou sans observateur ; seule la couverture restante change.
- Deux états de porte indistinguables avant inspection peuvent justifier des routes différentes après observation.
- Le cas de transfert utile reste gagnable ; la scène respecte une prévention réussie.
- Évaluer une politique gelée ne modifie pas son comportement ; réentraîner constitue une autre opération.

### Score et chronologie

- Besoin identifié par service et phase ; crédit au plus une fois, seulement si sa condition physique publiée est satisfaite : réception dans la fenêtre, traversée à l'horaire ou disponibilité au contrôle. Les trois contrats ne se confondent pas.
- Réception à 8 appliquée avant dommages ; à 9 ou 10 ne restitue ni stock ni points de la fenêtre close.
- Dernière phase : besoin satisfait et service encore opérationnel à la clôture, pour éviter le démantèlement gratuit de fin de partie.
- Même état de départ, version et difficulté ; animations, FPS, orientation et temps de lecture ne changent aucun résultat.
- Aucun bilan omniscient avant la fin ; le score ne révèle pas un état caché pendant l'enquête.
- Rejouer ou s'entraîner ne fusionne pas les bénéfices de plusieurs essais.
- Aucune publication automatique ; les révélations narratives ne figurent pas dans le partage par défaut.

### 3D et mobile

- Rotation de présentation et mode graphique réduit ne changent pas les observations.
- Une observation ancienne n'affiche ni ombre, son, hitbox ni mouvement issus de l'état actuel caché.
- La couverture utile reste fondée sur les mêmes volumes simplifiés dans tous les réglages.
- Action réalisable sans survol, glisser précis, son ou indice de luminosité.
- Pause/reprise, arrière-plan, sauvegarde et récupération de contexte graphique testés sur appareils physiques.

## 7. Validation avec joueurs : séparer quatre résultats

| Question | Observation recherchée | Ce qui ne suffit pas |
| --- | --- | --- |
| Est-ce amusant ? | Relance volontaire, recherche d'une combinaison différente | Dire que le sujet est intéressant |
| Y a-t-il du skill ? | Amélioration sur une géométrie inconnue | Reproduire une solution mémorisée |
| Le thriller fonctionne-t-il ? | Inquiétude située, hypothèse puis action, soulagement après reprise | Une note de peur sans savoir ce qui la produit |
| Apprend-on quelque chose ? | Décision pertinente sur un cas nouveau, justification causale | Réciter « métrique ≠ intention » |

Cibles de petite itération : cinq sur huit relancent ; six distinguent les états d'observation ; cinq transfèrent une correction ; cinq acceptent le cas sain. Les résultats doivent être ventilés par familiarité avec la tactique et l'IA, sans transformer huit personnes en prédiction de marché.

Le projet peut réussir une dimension et échouer aux autres. Une bonne explication ne compense pas automatiquement un mauvais jeu ; une ambiance forte ne prouve pas une compréhension correcte. Les corrections doivent répondre à l'échec effectivement observé.
