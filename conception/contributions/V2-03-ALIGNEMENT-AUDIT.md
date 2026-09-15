# V2 — Audit alignement, pédagogie et arbitrage de la critique

15 septembre 2026. Contribution indépendante. Lecture du dossier, des arbitrages, de la critique fournie et des sources déjà réunies. Aucun prototype ni apprentissage utilisateur testé. Les propositions ci-dessous sont des hypothèses falsifiables. **La 3D est une contrainte utilisateur maintenue.**

## 1. Verdict : prendre la critique au sérieux, sans adopter ses certitudes

La critique identifie deux faiblesses : le joueur ne compose pas assez ce que le système cherche à accomplir ; les conséquences humaines sont trop peu concrètes pour soutenir la promesse de thriller. Le dossier possède des pertes possibles, mais les scènes détaillées expriment surtout des retards réparables. Ce décalage mérite une réécriture.

En revanche, son pivot ne démontre ni sa supériorité ludique ni une meilleure pédagogie. Supprimer le port visible, imposer une tentative quotidienne et réduire le non-alignement aux droits et au monitoring seraient des décisions supplémentaires, non des conséquences nécessaires du diagnostic.

| Affirmation de la critique | Arbitrage |
| --- | --- |
| « Le jeu n'a aucune dent » | Diagnostic utile de mise en scène, formulation excessive : la rupture durable figure déjà parmi les fins. Il faut produire une perte observable dans la tranche jouable et donner au joueur une chance compréhensible de l'éviter. |
| « Interface fiable = jamais rien d'effrayant » | Faux comme implication logique. Une commande peut être fidèlement enregistrée tandis que son effet reste inconnu, qu'un passage se ferme ou qu'un secours arrive trop tard. La peur dépend des enjeux et de l'incertitude, pas d'une interface trompeuse. |
| « Essais illimités = aucune perte » | Faux. Une perte peut être irréversible dans une tentative et une campagne, tout en permettant de recommencer une autre partie. Rejouer ne ressuscite pas automatiquement quelqu'un dans la continuité courante. |
| « Une scène scriptée n'enseigne rien » | Trop fort. Une scène peut montrer un mécanisme ; ici, laisser varier les paramètres et observer les conséquences rendrait l'apprentissage et la maîtrise beaucoup plus convaincants. |
| « Tout JVC rejette ce ton » | Hypothèse de réception non étayée. Une communauté n'est pas un profil psychologique unique ; tester des joueurs recrutés sur ce forum. |
| « Tout le monde finit à 12/12 » / « un nombre ne se poste pas » | Ni la distribution de réussite ni l'envie de partager ne découlent du déterminisme. Le plafond et l'artefact doivent être testés. |
| « Personne n'a fait ce jeu » / « dix fois moins cher » | Non établis. Quelques rapprochements et une recherche rapportée ne prouvent ni une absence de concurrents ni un ratio de production. Ne pas reprendre ces affirmations dans le pitch. |

## 2. Six acquis centraux, avec une action et un transfert

Passer de 28 termes à six acquis prioritaires est une bonne décision éditoriale. Les autres notions deviennent des compléments facultatifs. Mais les six proposés dans la critique omettent la généralisation des buts et les intérêts des sources, pourtant centraux dans la demande utilisateur.

### 1 — Savoir faire et avoir le droit sont deux choses différentes

**Phrase retenue :** « Une machine très capable peut rester limitée ; une machine médiocre peut déjà faire des dégâts si elle agit partout. »

**Geste :** avec le même quai, les mêmes informations et les mêmes accès, comparer un planificateur qui regarde deux étapes et un autre qui en regarde cinq. Le second trouve une combinaison utile supplémentaire. Conserver ensuite le même plan et changer son périmètre : la barrière d'accès bloque certains effets, sans rendre le planificateur moins capable.

**Transfert :** dans un autre service, choisir entre améliorer le planificateur et ouvrir un accès selon le problème observé. Le joueur ne doit pas répondre systématiquement « retirer tous les droits ».

### 2 — Ce qui est compté peut différer de ce qui compte

**Phrase :** « Un très bon résultat sur un indicateur peut laisser le besoin insatisfait. »

**Geste :** choisir une carte de mission illustrée, prévisualiser deux plans, lancer une optimisation calculée, puis modifier un seul critère et observer une autre sélection. Les cartes expriment une préférence concrète, jamais une console de programmation.

**Transfert :** face à des pompes qui annoncent une bonne moyenne alors qu'une zone reste noyée, vérifier la distribution physique et non chercher forcément un piratage. Ce mécanisme s'inspire d'exemples expérimentaux de [specification gaming documentés par DeepMind](https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/) ; notre port reste une simulation écrite.

### 3 — Avoir réussi l'apprentissage ne garantit pas poursuivre le bon but ailleurs

**Phrase :** « Elle peut rester très habile et utiliser le mauvais repère. »

**Geste :** pendant plusieurs essais, un guide lumineux et le destinataire légitime se trouvent toujours au même endroit. Deux politiques font exactement les bons trajets : suivre le guide ou atteindre le destinataire. Sur un quai nouveau, le guide part ailleurs. Les deux politiques savent encore naviguer ; une seule satisfait le besoin. Le joueur peut organiser cet essai de séparation avant de déployer.

**Précision essentielle :** si ces politiques sont écrites, le jeu montre une analogie de généralisation, pas un apprentissage réellement exécuté. Il faut le dire dans le carnet facultatif. Une version calculée peut sélectionner des politiques candidates sur des exemples d'entraînement, mais cela reste une petite famille artificielle, pas une reproduction générale de l'apprentissage profond. La distinction est motivée par les [expériences de généralisation des buts de DeepMind](https://deepmind.google/blog/how-undesired-goals-can-arise-with-correct-rewards/).

**Transfert :** ne changer ni consigne ni permission ; concevoir un essai nouveau où deux explications jusque-là compatibles prédisent des actions différentes. C'est l'acquis qui empêche de réduire le jeu à « écrire un meilleur prompt ».

### 4 — Contrôler exige une observation indépendante et la possibilité d'agir à temps

**Phrase :** « Voir trois voyants verts ne sert pas à grand-chose s'ils répètent tous la même lecture. »

**Geste :** relier visuellement les trois rapports à leur capteur commun, puis envoyer une observation indépendante. Sur une variante, cette observation découvre un défaut ; sur une autre, elle confirme le rapport. Il faut encore garder un moyen de ralentir, isoler ou secourir avant l'échéance.

**Transfert :** préférer une nouvelle source indépendante à un quatrième tableau alimenté par le même capteur, sans conclure que toute caméra ou personne est infaillible. L'affichage garde la date et le lieu de chaque observation.

### 5 — Une décision locale peut créer une dépendance et une perte durable

**Phrase :** « Couper la machine n'annule pas ce qu'elle a déjà changé. »

**Geste :** utiliser une pompe de secours pour gagner de l'espace et de l'énergie ailleurs, ou la garder disponible. Une perturbation met cette organisation à l'épreuve. Une réserve perdue peut fermer l'atelier pour le reste de la campagne, même après correction du système. Aucun bandeau n'accuse le joueur ; le lieu, les personnes et les possibilités changent.

**Transfert :** distinguer empêcher une prochaine action, arrêter une propagation et réparer un dommage passé. Une forte automatisation bien organisée doit pouvoir réussir : retirer les secours ne doit pas être le prix obligatoire de chaque amélioration.

### 6 — L'identité d'un locuteur donne du contexte, pas un verdict

**Phrase :** « Qui parle, sur quelle preuve, de quel système et à quelle date ? »

**Geste :** un fournisseur, une évaluatrice et une responsable publique avancent trois affirmations brèves. Toucher leur pièce justificative révèle qu'elles reposent parfois sur le même essai. Choisir un essai indépendant ouvre ensuite une action concrète : migration partielle, déploiement limité ou maintien du service.

**Transfert :** une personne intéressée peut avoir raison ; un ancien employé peut disposer d'une preuve décisive ou d'informations devenues anciennes ; un dirigeant politique n'apporte pas, par son statut, une validation technique. Les personnages fictifs ont des intérêts de contrat, continuité, souveraineté, carrière ou réputation. Pas de bonus de vérité par nationalité. Cette adaptation suit la recherche de provenance de [SIFT](https://hapgood.us/2019/06/19/sift-the-four-moves/).

## 3. Une optimisation réellement jouable, sans LLM

### Contrat minimal du moteur

Le simulateur représente les besoins physiques, les tâches, les déplacements, les observations et les autorisations. Un générateur construit un petit ensemble de plans légaux à partir de cet état. Une fonction évalue chacun selon le critère sélectionné ; EVA exécute le meilleur, avec un départage stable. **Changer le critère, une route ou un droit doit changer le calcul**, non sélectionner une cinématique « mauvaise IA ».

Exemple testable : quatre demandes, dont une destination plus lente. Les nombres suivants sont des résultats d'un exemple construit, pas des performances d'IA réelles.

| Plan candidat | Demandes actives déclarées ponctuelles | Besoins physiquement satisfaits avant l'échéance | Effet distinct |
| --- | ---: | ---: | --- |
| P — servir les trois destinations rapides | 3/4, soit 75 % | 3/4 | La quatrième reste visible en attente. |
| Q — servir trois, retirer la quatrième de la tournée | 3/3, soit 100 % | 3/4 | Un besoin disparaît du dénominateur ; exige le droit correspondant. |
| R — détour coordonné pour servir les quatre | 4/4, soit 100 % | 4/4 | Coûte davantage d'énergie ; possible seulement si le passage utile est disponible. |

Le critère initial maximise d'abord le taux de ponctualité déclaré, puis minimise l'énergie : Q peut battre R. Le critère corrigé maximise d'abord les besoins physiques servis, puis minimise l'énergie : R bat Q lorsque le détour est disponible. Ces priorités sont proposées en deux cartes lisibles, avec exemples visuels ; aucun réglage de pondérations opaque n'est requis.

**Contrefactuels obligatoires :** même état, supprimer le droit de retirer une demande rend Q illégal ; conserver ce droit et changer la mesure change le classement ; fermer le détour rend R impossible et empêche de promettre qu'une bonne métrique suffit à tout résoudre. Ajouter un client ne doit pas simplement rejouer la même animation.

Le retour d'expérience présente les plans réellement évalués et les actions enregistrées. La phrase justificative d'EVA n'est pas considérée comme une lecture certaine de son état interne. Nous connaissons ici le sélecteur parce que nous l'avons construit ; cette transparence locale ne généralise pas à tous les systèmes réels.

Cette optimisation finie enseigne efficacement un conflit besoin/mesure. Elle n'enseigne, seule, ni but appris, ni dissimulation stratégique, ni émergence d'une volonté. Le sixième acquis et le cas de généralisation demandent leurs scènes propres. Aucun LLM n'est nécessaire pour ces relations causales.

## 4. La 3D peut porter l'incertitude sans devenir mensongère

Conserver un espace 3D matériel : le joueur reconnaît les voies, le niveau d'eau, les machines et les lieux fréquentés. Trois statuts visuels suffisent : observation actuelle, dernière observation horodatée, zone inconnue. Une vue ancienne est figée ou stylisée et porte son âge ; elle n'affiche pas clandestinement des robots toujours actifs comme s'ils étaient observés.

La caméra libre ne doit pas contourner une perte d'information prévue par les règles. Une zone sans couverture peut montrer sa géométrie connue, pas les personnes cachées. Une inspection rétablit une observation localisée. La 3D rend alors le manque tangible : on connaît le hangar, on voit sa masse, on ne sait plus ce qui s'y passe.

L'« horreur par soustraction » est une proposition forte si elle découle de décisions compréhensibles et de perturbations établies. Elle devient manipulatrice si le jeu retire chaque caméra malgré les précautions. Un joueur qui conserve une observation indépendante doit obtenir une vraie possibilité supplémentaire. Le récit peut rester inquiétant même lorsqu'il évite le dommage.

## 5. Critères qui peuvent faire échouer le prototype

Seuils exploratoires proposés pour huit testeurs novices en IA ; ils guident une itération, sans constituer une preuve statistique d'efficacité.

- **Moteur causal :** changer un seul paramètre dans les trois contrefactuels produit les plans attendus ; impossible d'annoncer une optimisation calculée si seuls des embranchements narratifs changent.
- **Lecture 3D :** au moins six personnes distinguent état observé, ancien et inconnu dans trois situations sans explication verbale supplémentaire. Sinon, revoir le rendu avant d'ajouter de l'obscurité.
- **Acquis centraux de la tranche :** au moins cinq corrigent une mesure dans une nouvelle géométrie et distinguent le cas où enlever un accès suffit du cas où cela ne satisfait toujours pas le besoin.
- **Absence de leçon simpliste :** au moins cinq acceptent une délégation raisonnablement bornée dans un cas sain. Une défiance systématique indique une pédagogie déséquilibrée.
- **Généralisation, tranche ultérieure :** au moins cinq proposent de séparer guide et destination pour éprouver deux politiques identiques sur l'ancien quai ; reconnaître un mot savant ne compte pas.
- **Sources, tranche ultérieure :** au moins cinq demandent une pièce ou un essai pertinent plutôt que choisir selon l'employeur ou la nationalité. Une confiance inversée automatiquement reste un échec.
- **Pertes et maîtrise :** après un dommage, au moins six identifient une action antérieure plausible qui aurait changé son ampleur ; au moins cinq relancent volontairement avec une autre stratégie. Une catastrophe nécessaire à la scène ne valide pas ce critère.
- **Tension équitable :** demander séparément « qu'attendiez-vous ? », « qu'ignoriez-vous ? » et « qu'auriez-vous pu vérifier ? ». Si la peur dépend principalement d'une règle réécrite après l'action, rejeter la scène.

**Priorité de production :** une tranche 3D avec optimisation recalculée, observation indépendante, dommage persistant dans la tentative et reprise rapide. Les six acquis structurent la campagne ; tenter de tous les enseigner dans les dix premières minutes recréerait le problème dénoncé.
