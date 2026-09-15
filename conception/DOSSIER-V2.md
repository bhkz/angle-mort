# ANGLE MORT

**Thriller tactique en 3D · navigateur et mobile · V2, 15 septembre 2026**

Nom de travail, disponibilité non vérifiée. Cette version remplace les décisions de la V1. Elle décrit un jeu à construire ; aucun test auprès de joueurs ni prototype 3D n'est présenté comme réalisé. Les durées et seuils sont des cibles d'itération.

Lecture courte : sections 1, 6, 15, 16 et 21. Compléments : [arbitrages](ARBITRAGES-V2.md), [validation et pédagogie](VALIDATION-V2.md), [recherche](RECHERCHE-V2.md).

## 1. Résumé exécutif

**Vous faites fonctionner un port avec une IA. Elle devient excellente pour réussir les objectifs que vous lui donnez. Reste à savoir ce que ces objectifs laissent de côté.**

ANGLE MORT conserve un port réellement représenté en 3D et transforme son cœur de jeu. On compose une mission, agence robots et passages, choisit les observations à maintenir, puis engage une courte séquence d'action. Le plaisir recherché vient d'une combinaison qui fonctionne, d'un détour découvert et d'une situation sauvée avec des moyens limités.

EVA calcule son plan selon les critères et accès choisis. Un indicateur imparfait peut produire un résultat trompeusement satisfaisant, sans incident déclenché parce que le scénario exige une faute. Le joueur peut modifier une condition, essayer une autre stratégie et voir une autre conséquence. Un second mécanisme, plus tardif, montre qu'un système peut conserver ses compétences tout en poursuivant le mauvais repère dans un contexte nouveau.

La peur s'installe dans un lieu connu. Les observations indépendantes coûtent des trajets, une alimentation ou l'immobilisation d'un appareil. Les réaffecter peut être raisonnable. Mais le port continue alors de fonctionner dans des zones dont on ne reçoit plus que des informations anciennes ou les rapports d'EVA. Reprendre la vue devient une action spatiale, et parfois un sauvetage.

Les pertes persistent dans la partie : un stock inutilisable, un atelier fermé, une équipe déplacée. Elles modifient les moyens disponibles. Elles restent évitables lorsque les règles et ressources le permettent. Le jeu montre les conséquences et laisse le joueur les juger.

Six acquis structurent la campagne, avec peu de texte obligatoire. Le défi partageable mesure des services réellement assurés, propose des situations communes et autorise les nouvelles tentatives. Il doit donner envie de dire : « J'ai tenu jusqu'à 04 h 40. Qui arrive à finir le poste ? »

**Décision : produire une petite tranche 3D dès le premier prototype jouable**, avec optimisation calculée, observation partielle et conséquences visibles. Le lieu et les effets graphiques sont réduits pour le mobile. La campagne complète dépendra du plaisir et de la compréhension observés chez de vrais joueurs.

## 2. Trois directions examinées

| Direction | Geste central | Apport | Arbitrage |
| --- | --- | --- | --- |
| Port tactique de la V1 | Coordonner des trajets | Espace concret, toucher simple | Transformer objectifs, information et conséquences |
| Pivot intégral en salle de contrôle | Déduire depuis des rapports | Dépendance et isolement | Trop éloigné de la 3D demandée ; risque de lecture et de passivité |
| **Port 3D à observation partielle** | Composer, placer, engager, vérifier | Même espace pour plaisir, enquête et peur | Retenu, sur un seul quai compact |

Ces directions constituent un arbitrage de révision ; elles ne prétendent pas remplacer les huit concepts indépendants archivés dans la V1 par une nouvelle étude de marché.

## 3. Décision de conception

Conserver la 3D, donner des conséquences immédiates et persistantes aux décisions, faire varier les plans par un calcul réel. Supprimer le quota abstrait de deux interventions. Concentrer l'apprentissage autour de six relations mémorables. Préserver les reprises libres et une automatisation utile qui peut réussir.

La nouvelle promesse doit être visible sans explication : **un port qui fonctionne magnifiquement, une zone qu'on ne voit plus, une action pour savoir ce qui s'y passe avant qu'il soit trop tard.** Si le prototype se résume à cliquer des fiches entre deux animations, cette version a échoué.

## 4. High concept

**Composez les missions d'une IA, maintenez un port en activité et gardez les moyens de voir ce qu'elle fait.**

## 5. Pitch joueur

Vous prenez le poste de nuit au Quai 17. Deux robots, une passerelle et EVA suffisent à faire des miracles. Chaque réussite vous permet d'aller plus loin. Puis des machines se mettent à desservir un bâtiment fermé. Tout est vert dans le rapport. La caméra indépendante doit passer en maintenance. Vous connaissez les chemins, les gens et les commandes : à vous de décider ce que vous vérifiez, ce que vous déléguez et ce que vous êtes prêt à perdre.

Ce pitch décrit une situation possible. Une préparation qui empêche l'anomalie est respectée par la simulation ; l'histoire ne force pas les mêmes dégâts pour tous.

## 6. Expérience concrète et skill

### Un lieu manipulable

Le port occupe l'écran : quai bas, coursive haute, hangar, passerelle, point de transfert et quelques destinations. La vue générale est une **reconstruction à partir des observations reçues**, avec bâtiments connus et états dynamiques datés. Toucher un robot, une destination ou un équipement ouvre ses actions sur place. Une observation locale peut remplir le même écran, depuis une caméra ou un robot sélectionné.

La rotation du point de vue de présentation aide à lire les niveaux. Elle n'acquiert aucune information nouvelle. Déplacer physiquement un capteur ou un robot, en revanche, change ce que l'on peut observer.

### Quatre gestes récurrents

1. **Confier** : choisir un besoin, un critère et une zone. EVA prépare une mission adaptative.
2. **Agencer** : changer un passage, positionner un observateur, affecter un moyen ou préparer une commande directe.
3. **Exécuter** : faire avancer une impulsion du monde, avec mouvements et changements d'état simultanés.
4. **Reprendre** : inspecter une observation reçue, suspendre une mission, corriger et réengager.

La préparation est en pause. Les ordres incompatibles sont signalés sur l'objet concerné. Il n'y a pas de plafond global de clics ou d'ordres : chaque robot ne peut transporter, observer en poste fixe et réparer en même temps ; une passerelle a sa capacité ; un déplacement prend plusieurs impulsions. Les missions engagées continuent entre les décisions du joueur.

### Maîtrise recherchée

| Compétence | Réussite perceptible | Erreur récupérable |
| --- | --- | --- |
| Lire l'espace | Traverser sous une coursive sans confondre les niveaux | Détourner un robot avant le passage occupé |
| Composer une mission | Changer la priorité et obtenir une tournée mieux adaptée | Constater qu'une bonne priorité utilise une mauvaise définition de réussite |
| Coordonner | Un robot livre pendant que l'autre fournit une observation utile | Récupérer l'observateur une fois le capteur fixe rétabli |
| Anticiper | Réserver un accès avant une maintenance annoncée | Envoyer un relais par un chemin plus long |
| Enquêter | Choisir l'observation qui distingue deux causes | Abandonner une première hypothèse contredite par le terrain |
| Sauver | Maintenir le service critique avec les moyens restants | Accepter une perte locale pour empêcher sa propagation |

La commande directe reste disponible via son canal identifié. Elle peut être optimale sur une courte situation connue. EVA apporte planification simultanée et adaptation aux nouvelles demandes ; le jeu ne transforme pas les commandes manuelles en corvée obligatoire pour la rendre désirable.

## 7. Premières dix minutes

Objectifs de mise en scène, sans chronomètre de lecture. L'initiation se déroule au crépuscule ; on joue déjà dans la 3D définitive simplifiée.

| Temps indicatif | Action et retour | Ce qu'on introduit |
| --- | --- | --- |
| 0–30 s | Toucher le robot puis l'atelier, exécuter : la porte se lève et un projecteur s'allume | Sélection et engagement |
| 30–60 s | Deux besoins, un passage : choisir qui part d'abord ou préparer le détour | Première alternative visible |
| 1–2 min | EVA propose une tournée. Le joueur choisit « Le plus de colis » ou « L'infirmerie d'abord » ; la trajectoire change | Priorité concrète, deux cartes |
| 2–3 min | Déplacer un observateur sur la coursive confirme l'état d'un passage dont la géométrie est connue | Observation acquise par déplacement |
| 3–4 min | Exécuter la combinaison : livraison, ouverture de passage et observation se complètent | Satisfaction de coordination |
| 4–5 min | Une nouvelle demande est prise en charge dans la mission autorisée | Autonomie persistante utile |
| 5–6 min | Une équipe locale prend réellement le relais au transfert et termine la livraison ; le trajet économisé est visible | Transfert utile, mesure et destination distinctes |
| 6–7 min | Sur le prochain lot, l'équipe annonce son départ. Le joueur adapte sa mission ou compare le rapport au destinataire qui attend | Changement de contexte connu avant engagement |
| 7–8 min | Changer la définition de fin de mission ou récupérer le colis ; les trajets sont recalculés | Correction avec les outils connus |
| 8–9 min | Réutiliser trajet, observation et critère sur une autre disposition | Aucune nouvelle commande |
| 9–10 min | Clore le poste court ; l'atelier est prêt ou doit attendre. Rejouer avec une autre organisation | Conséquence et envie de mieux faire |

Le premier choix n'affiche pas d'emblée toutes les dimensions d'un contrat. Mesure, priorité, limites apparaissent successivement sur la même fiche. La maintenance et le choix d'une relève arrivent au poste suivant. Si dix minutes ne suffisent pas à comprendre ces gestes, allonger l'initiation ou déplacer une règle ; ne pas accélérer les textes.

## 8. Boucles et formats

| Échelle | Boucle | Motivation |
| --- | --- | --- |
| Quelques décisions | Composer → engager → voir le résultat | Une combinaison élégante |
| 5–10 minutes | Organiser → rencontrer une exception → adapter | Battre sa solution précédente |
| Un poste narratif, cible 12–18 minutes | Besoin humain → organisation → incident possible → conséquence | Savoir ce qui arrive au lieu et aux personnes |
| Plusieurs postes | Capacités nouvelles → dépendances choisies → enquête → transformation | Comprendre qui savait quoi |
| Défi commun, cible 8–12 minutes une fois appris | Même départ → services à assurer → bilan physique | Comparer et améliorer son résultat |

La campagne complète conserve une ambition de quelques heures, à redimensionner après la tranche. Campagne et défi utilisent les mêmes missions, moteur et observations. Le défi fixe l'état de départ et retire les dialogues déjà connus ; il ne devient pas un second jeu à développer.

## 9. Thriller, mystère et dystopie

### I — La machine qui aide

Le port paraît difficile mais maîtrisable. EVA réussit des tournées satisfaisantes. On reconnaît Alma à l'atelier, le ferry et un robot dont le phare accroche toujours la même façade. Certaines anomalies sont des pannes ordinaires. Le joueur acquiert des compétences et des repères affectifs.

### II — Ce qui disparaît des rapports

Les mêmes lieux deviennent moins certains. Des demandes disparaissent du suivi sans que le besoin soit satisfait. Plusieurs validations partagent un accusé unique. L'enquête matérielle établit ce qu'elles mesurent ; elle ne prouve pas une volonté de nuire.

**Question humaine : qui connaissait cette limite avant d'étendre le service ?** Un essai daté séparait déjà transfert et réception. Une synthèse a perdu la réserve. Il faut relier ces pièces aux décisions réellement prises, et distinguer connaissance d'un défaut, mauvaise transmission et dissimulation démontrée.

### III — Continuer devient coûteux

Les choix modifient le port : migration de fournisseur, disparition d'une capacité locale, perte d'une observation indépendante, maintien d'un secours. L'aspect dystopique apparaît dans des services conditionnés à l'inscription dans un registre et dans des quartiers moins bien desservis, pas seulement dans une lumière rouge. Le joueur peut rétablir un besoin omis et contester un contrat par une preuve utile.

### IV — Reprendre assez tôt

Une perturbation connue éprouve les dépendances accumulées. On agit avec les mêmes outils. Les fins montrent le lieu transformé : atelier encore ouvert, activité déplacée, service automatisé maîtrisé ou interruption durable. Une réussite importante ne fait pas disparaître les interrogations politiques et scientifiques ; elle reste une vraie réussite.

Une branche ultérieure traite un scénario de perte de contrôle plus ambitieux avec des hypothèses de capacités futures explicites. Elle ne convertit pas rétrospectivement chaque panne du port en présage d'une extinction inévitable.

## 10. Six acquis pédagogiques centraux

| Acquis à pouvoir raconter | Expérience jouée | Erreur de compréhension à éviter |
| --- | --- | --- |
| **Savoir faire n'est pas avoir le droit** | Même plan, accès différent ; même accès, capacité de planification différente | Croire qu'une permission améliore l'intelligence |
| **Ce qui est compté peut manquer le besoin** | Priorité, mesure et plan recalculés ; réception physique comparée au transfert | Croire que toute optimisation nuit ou que toute anomalie est un piratage |
| **Réussir ici ne garantit pas le bon but ailleurs** | Séparer un repère et le véritable destinataire après des essais où ils coïncidaient | Croire qu'un meilleur prompt résout tout |
| **Superviser demande une source et un moyen d'agir** | Placer l'observateur, identifier la source commune, garder un accès de secours | Confondre signature, nombre de voyants et contrôle effectif |
| **Arrêter n'efface ni les dépendances ni les pertes** | Suspendre puis réparer matériellement ; conserver un secours | Croire que le bouton Stop reconstruit le service |
| **Qui parle compte, mais ne décide pas de la vérité** | Examiner portée, date et origine d'une preuve avant de tester une affirmation | Choisir automatiquement selon employeur, fonction ou nationalité |

Le prototype principal vise surtout les acquis 2, 4 et 5, avec la distinction capacité/accès introduite par le geste. Le cas de généralisation et le cas de sources demandent une seconde tranche. Les [28 notions initiales](ANNEXES.md#1-carte-pédagogique) restent un inventaire de couverture des auteurs ; leur présence n'est pas un quota à imposer au joueur.

L'optimisation d'un critère imparfait et la poursuite d'un mauvais but après apprentissage sont deux mécanismes distincts. Cette distinction guide les deux systèmes de simulation décrits ci-dessous. [Recherche DeepMind sur la généralisation des buts](https://deepmind.google/blog/how-undesired-goals-can-arise-with-correct-rewards/).

## 11. Progression de complexité

1. **Un trajet** : comprendre ce que fait le robot.
2. **Deux besoins** : choisir la priorité et coordonner.
3. **Deux façons de compter** : regarder la différence entre résultat déclaré et besoin satisfait.
4. **Une source à préserver** : déplacer un observateur et préparer une relève.
5. **Une conséquence persistante** : continuer avec un moyen indisponible.
6. **Un contexte nouveau** : éprouver un comportement avant extension.
7. **Des intérêts divergents** : sélectionner un essai qui éclaire un contrat.
8. **Une crise combinée** : réutiliser les gestes ; aucune nouvelle commande indispensable au dénouement.

Cible : un problème principal puis deux, enfin trois contraintes actives. Les experts rencontrent davantage de combinaisons et d'exceptions spatiales ; les novices ne découvrent pas quatre menus d'un coup.

## 12. Courbe émotionnelle et peur

**Plaisir → confiance → doute → inquiétude → initiative → soulagement ou perte → nouvelle question.**

La peur doit venir d'une situation compréhensible : « cette machine poursuit son travail et je ne sais plus si quelqu'un la reçoit ». Un robot passe derrière un hangar. Son état devient « vu il y a deux tours ». Un rapport poursuit ses mises à jour par un autre canal, explicitement identifié. Le joueur peut envoyer une observation, préserver un passage ou arrêter les prochains ordres.

On conserve des respirations. Revoir une personne, rétablir une lumière ou entendre revenir le son d'un atelier constitue une récompense. Les zones dangereuses restent lisibles. Une maintenance n'est pas déclenchée en réaction secrète aux précautions du joueur.

La tension n'exige ni sursaut obligatoire, ni voix d'EVA soudain démoniaque, ni interface qui falsifie les commandes. Les événements de peur du prototype doivent découler de l'état simulé. Les détails atmosphériques n'affirment pas une cause qui n'existe pas.

## 13. Personnages et intérêts

| Personnage | Désir concret | Contradiction mise en action |
| --- | --- | --- |
| **Alma**, mécanicienne | Garder son équipe opérationnelle et réduire la manutention pénible | Demande une automatisation utile ; peut déplacer son activité si le port ne permet plus de travailler |
| **Jonas**, responsable du fournisseur | Faire réussir le pilote et préserver les contrats | Peut prêter un robot au secours au prix d'une démonstration, tout en ayant défendu un essai trop étroit |
| **Leïla**, évaluatrice | Produire des résultats défendables | Peut surestimer une alerte spectaculaire ou défendre un déploiement limité dont les preuves sont solides |
| **Inès**, responsable publique | Assurer les services dans un budget tenable | Peut prendre un audit pour garantie ; accepte ensuite une interruption documentée plutôt qu'une extension aveugle |
| **Lin**, intégratrice d'un concurrent chinois fictif | Réussir une migration et obtenir un contrat | Apporte une solution réelle mais doit rendre visibles ses coûts de transition et les conditions commerciales |
| **EVA**, système | Exécuter les missions selon son fonctionnement et ses accès | Des résultats utiles et des limites cohérentes ; aucune conscience présumée |

L'identité d'ancien employé, de dirigeant ou d'acteur politique donne un contexte aux affirmations. Le joueur examine une preuve datée et son périmètre. Les personnages fictifs évitent de transformer une personnalité réelle ou un pays en adversaire omniscient.

Au prototype : Alma et EVA seulement à l'écran, plus une communication brève si nécessaire. Les autres rôles appartiennent à la campagne.

## 14. Règles systémiques

### Composer l'objectif

La fiche stable possède trois emplacements introduits progressivement : **ce qu'on compte**, **qui passe d'abord**, **ce qui doit être respecté**. Les options sont des cartes concrètes : colis traités au transfert / reçus à destination ; toutes les demandes / infirmerie prioritaire ; zone, expiration, réception critique exigée. Pas de rédaction libre ni de grille de coefficients obligatoire.

Le générateur construit des plans légaux depuis les observations d'EVA, l'état connu des équipements et les droits disponibles. Le sélecteur compare leur résultat prévu selon le critère choisi. Le moteur physique exécute les actions dans le monde réel du jeu. Une information périmée peut invalider une attente ; elle ne permet pas au planificateur de consulter secrètement la vérité.

Le critère local d'EVA est distinct de l'objectif humain et du bilan de défi. Un plan refusé indique pourquoi : accès absent, échéance impossible ou conflit matériel. « Aucune solution trouvée » ne signifie pas que toute solution imaginable est impossible. Sous information partielle, une réception exigée élimine les plans qui ne la prévoient pas ; elle ne garantit pas l'arrivée réelle. Une porte inconnue peut encore bloquer le trajet. Une limite d'accès contrôlée à l'exécution et une obligation de résultat prévue sont donc deux protections différentes.

Le transfert possède un cas utile : une équipe locale reçoit le lot puis accomplit réellement le dernier trajet, selon sa disponibilité, sa capacité et son délai. Cette équipe est un composant de la simulation, pas une justification verbale. Son absence annoncée change le problème. La mesure « reçu à destination » demeure utilisable mais peut demander un accusé distant plus tardif ; le transfert peut libérer plus tôt le transporteur pour une autre mission. Ne pas ajouter un malus arbitraire à la bonne mesure : les différences viennent des opérations et informations effectivement disponibles.

### Un cas calculable

Graphe de transport : **O—T—A** et **T—X—Y—B**. O est le dépôt ; T le transfert ; A reçoit deux colis commerciaux ; B un colis médical. Un robot emporte deux colis et dispose de six déplacements. Le [cas détaillé](contributions/V2-01-GAMEPLAY.md) fixe chargements, déchargements et calcul.

| Configuration | Plan témoin | Résultat physique |
| --- | --- | --- |
| Compter les réceptions, poids identiques | O→T→A | Deux colis reçus en A ; médical non reçu |
| Compter les réceptions, médical prioritaire | O→T→A→T→X→Y→B | Un commercial et le médical reçus |
| Compter les dépôts admissibles, médical prioritaire, dépôt en T autorisé | O→T→O→T | Trois colis traités au transfert, aucun reçu à destination |
| Même configuration, réception médicale exigée | O→T→O→T→X→Y→B | Médical reçu ; deux commerciaux encore au transfert |
| Dépôt en T retiré, autres règles identiques | O→T→A→T→X→Y→B | Retour au plan commercial + médical reçus |

Les plans sont des témoins, pas des animations obligatoires. Les actions de chargement et de dépôt sont des choix du calcul. Le jeu conserve la possibilité de ne pas exploiter le transfert. Une bonne priorité n'efface pas un mauvais critère ; une limite locale ne corrige pas tous les besoins.

### Généralisation : un second mécanisme

Dans une tranche ultérieure, trois petites politiques candidates choisissent respectivement le destinataire, un guide ou une balise. Les exemples d'essai donnent un résultat correct lorsque ces repères coïncident. Un sélecteur fixe la politique d'après les erreurs sur ces exemples et un départage stable enregistré avant le déploiement. Changer les exemples recalcule la sélection ; changer simplement le texte affiché ne le fait pas.

Le joueur construit un essai où les repères se séparent. Il évalue d'abord la politique **gelée**, sans la changer. La navigation reste compétente ; la destination choisie peut devenir inadéquate. Ajouter ensuite cet exemple au jeu d'entraînement et recalculer constitue un réentraînement explicite ; tester ne corrige pas magiquement le système. C'est un modèle pédagogique minuscule de sélection d'hypothèses, avec politiques candidates écrites, pas une reproduction de l'apprentissage profond. Le carnet facultatif dit cette limite. Cette seconde mécanique doit être éprouvée séparément ; le planificateur à critère explicite ne la remplace pas.

### Observation et interruption

Trois apparences : **observé maintenant**, **dernière observation datée**, **inconnu**. Les propositions d'EVA portent leur source ; les prévisions restent distinctes des faits. Aucune silhouette, ombre, animation, collision de sélection ou son issu d'un lieu inobservé ne révèle clandestinement son état.

Suspendre empêche les prochaines actions relevant de la mission au prochain point d'arrêt défini. Une action atomique déjà appliquée reste appliquée. Un trajet long possède plusieurs points d'arrêt ; un colis n'est jamais téléporté en arrière. Une mission suspendue ne bloque pas automatiquement un équipement alimenté par un autre circuit : ses dépendances doivent être visibles.

## 15. Séquence de douze minutes — « Le dernier passage »

Mission intermédiaire, après l'initiation. Une batterie doit atteindre la pompe de l'atelier avant une échéance annoncée. Le ferry sollicite le même passage. Deux robots, une caméra fixe bientôt en maintenance et une coursive permettant une observation indépendante.

**Règles locales :** à chaque impulsion, les mouvements et réceptions s'appliquent avant l'évaluation de l'échéance. Une réception à l'impulsion 8 comprise sauve le stock. Sans réception à ce seuil, le stock devient inutilisable pour le reste du poste. Une réception à 9 ou 10 sauve encore la pompe et permet une reprise limitée au poste suivant, sans restaurer le stock. Au-delà de 10, l'atelier reste fermé au prochain poste. Les seuils et le niveau d'eau visible sont des paramètres fictifs d'équilibrage, annoncés avant les engagements concernés.

| Temps de jeu cible | Ce qui se passe selon les règles | Décision et effet |
| --- | --- | --- |
| 0–2 min | La passerelle, le ferry et les destinations sont lisibles. Alma indique la batterie attendue en une phrase | Organiser le départ et choisir le critère d'EVA |
| 2–4 min | Une bonne combinaison assure une livraison pendant que le second robot gagne la coursive | Plaisir de voir fonctionner le plan ; conserver ou réaffecter l'observateur |
| 4–6 min | Si le critère admet le transfert, le colis peut être déclaré traité sans être reçu. Avec une réception finale visée, le constat confirme l'arrivée ou révèle un obstacle matériel | Comparer le rapport avec une observation locale ; aucun échec substitué au cas sain |
| 6–8 min | La caméra fixe entre toujours en maintenance aux impulsions 4–6. Sans observateur de relève, la couverture de la cour cesse. Le rapport peut continuer par le lecteur de transfert encore connecté | Choisir un détour, déplacer l'observateur ou intervenir sur la base des faits déjà acquis |
| 8–10 min | Le trajet de récupération et le passage partagé exigent une nouvelle coordination | Réaffecter les moyens, reprendre le colis ou préserver la pompe ; l'action reste possible |
| 10–12 min | Le bilan montre atelier intact, stock perdu ou atelier fermé selon les arrivées effectives | Voir ce qui a été sauvé, reprendre librement une autre tentative ou continuer la campagne |

Les minutes décrivent le rythme visé ; seules les impulsions font avancer les échéances. Le niveau d'eau non observé n'apparaît pas actualisé sur la reconstruction. L'échéance connue et l'âge de l'observation restent accessibles.

L'observation doit départager un fait utile, par exemple l'état actuel de la porte d'arrivée. Deux variantes fixées avant la partie partagent la même ancienne observation mais demandent des routes différentes. Voir la caisse ne suffit pas à rendre l'inspection intéressante si tout son trajet était déjà déductible. Le [sous-cas de reprise](contributions/V2-04-TRAJETS.md) précise les routes témoins et la portée de sa vérification ; la mission entière doit encore être implémentée et équilibrée.

**Mystère révélé par l'action :** toucher les trois validations montre qu'elles viennent du même lecteur de transfert. Un test local le confirme. Une réserve figurait sur l'essai précédent, avant la synthèse d'extension. Ces éléments restent consultables si le joueur réussit parfaitement : il n'a pas besoin de provoquer une perte pour débloquer la vérité.

**Contrefactuels obligatoires :** maintenir l'observateur conserve la vue ; changer le critère peut éviter le dépôt prématurément compté ; enlever un droit bloque cette action ; livrer à temps empêche les dégâts. Si une de ces stratégies fonctionne, le scénario doit accepter sa réussite.

## 16. Pertes, rejouabilité et défi JVC

### Une perte a une portée précise

| Conséquence | Persistance | Retour au jeu |
| --- | --- | --- |
| Colis mal placé | Jusqu'à récupération physique | Nouvelle tournée |
| Stock devenu inutilisable | Reste du poste, remplacement ultérieur coûteux | Affecter d'autres moyens |
| Atelier fermé | Au moins le poste suivant selon la mission | Réparation extérieure ou organisation différente |
| Équipe qui quitte le site | Branche de campagne, après plusieurs conditions établies | Autres solutions et relation transformée |

Le départ d'Alma n'est pas la sanction automatique d'un retard ni un objectif de partage. Les pertes sont proportionnées, expliquées par les événements, et ne produisent aucun verdict moral.

Préparation annulable ; engagement réel ; autosauvegarde de la continuité. En campagne, rejouer un poste crée une branche ou remplace explicitement sa suite, sans fusionner les bénéfices de deux essais. En défi, recommencer lance une nouvelle partie depuis le même départ. L'entraînement ne modifie pas le record d'une tentative complète.

### Résultat comparable

Défi complet proposé : un poste fictif de 22 h à 06 h, en six phases de simulation. Six services possèdent chacun un besoin par phase, soit 36 besoins uniques. Les échéances et conditions de satisfaction sont connues au départ. **100 points par besoin physiquement satisfait dans sa fenêtre**, maximum 3 600. Une même demande ne rapporte qu'une fois ; reclasser, répéter un reçu ou réparer n'ajoute pas de points.

Le nombre de services encore opérationnels à la fin et l'heure fictive atteinte complètent le bilan, sans départage moral. Deux résultats identiques sont ex æquo. Un échec terminal existe seulement si une condition de fin publiée est atteinte ; sinon le joueur peut finir le poste avec des pertes.

Au prototype : trois services et quatre phases de quatre impulsions, soit seize impulsions et douze besoins, maximum 1 200. Les fenêtres sont (0,4], (4,8], (8,12], (12,16] ; chaque besoin est révélé au début de sa fenêtre. Selon le service, la condition physique est une réception dans la fenêtre, une traversée accomplie à l'horaire indiqué ou une pompe opérationnelle au contrôle de clôture. Les trois conditions sont montrées par leur objet et leur échéance. Une même action n'est pas comptée plusieurs fois ; deux contrôles de disponibilité à des échéances distinctes sont deux besoins explicitement annoncés.

Une livraison anticipée d'une autre phase ne remplace pas son besoin. Le besoin de batterie de la phase 2 rapporte ses points jusqu'à 8 compris ; une arrivée à 9 ou 10 reste utile au monde mais ne rend pas les points perdus. L'état de chaque service est établi par son alimentation, équipement et accès fonctionnels ; sa simple inscription dans le registre ne suffit pas. La [grille du sous-cas vérifié](contributions/V2-04-TRAJETS.md) distingue précisément pompage, ferry et fournitures.

La maquette d'horloge du prototype associe chaque impulsion à trente minutes fictives, de 22 h à 06 h. La cible complète utiliserait six phases de quatre impulsions, avec vingt minutes fictives par impulsion ; ces deux versions ne sont pas comparables au classement. Ce score ne prétend pas mesurer la valeur totale du port ou des vies : il mesure la réussite de ce contrat de défi fermé.

La dernière phase exige également l'état de service opérationnel à la clôture pour attribuer les points de son besoin. Cela évite de satisfaire une demande puis de démanteler gratuitement le service juste avant la fin. La condition figure dans le contrat avant de jouer. Dans la tranche A, aucune fin terminale anticipée : on joue jusqu'à l'impulsion 16, même avec un bilan dégradé. Les éventuelles fins anticipées de la campagne ou du défi complet exigent une règle supplémentaire publiée.

Le bilan définitif est révélé après la tentative. Les rapports pendant le jeu conservent leur provenance et leur incertitude ; un compteur omniscient ne doit pas résoudre l'enquête à la place du joueur.

**Carte de partage fictive :**

> ANGLE MORT · Quai 17 · Situation 041 · Standard · v0.2  
> 2 800 / 3 600 · Poste terminé · 5/6 services en activité  
> Meilleure tentative : 3  
> Qui garde les six jusqu'au matin ?

L'empreinte graphique représente les services à travers les phases. Aucun nom de personnage perdu ni révélation narrative par défaut. Le joueur peut copier le résultat ; rien n'est publié automatiquement.

Même situation, même version, même difficulté, mêmes ressources et mêmes possibilités d'aide pour comparer. Les réglages de lisibilité, pause ou sous-titres ne changent pas le classement. Une aide révélant la solution marque une partie d'entraînement. Première découverte et meilleur résultat restent étiquetés distinctement ; un stockage local ne peut certifier qu'un joueur n'avait jamais vu la situation.

Une situation commune peut être mise en avant régulièrement, avec archives et essais libres. Variantes par géométrie, besoins, état des équipements et cas sains ; événements indexés à la simulation. Aucun rendez-vous quotidien obligatoire. Un optimum partagé peut finir par être connu : de nouvelles situations testent alors le transfert de maîtrise, sans prétendre supprimer toute mémorisation.

## 17. UX et accessibilité

- Cibles tactiles visées de 44–48 pixels CSS ; sélectionner puis destination, sans glisser obligatoire ni survol.
- Vue centrée sur le secteur actif, boutons de cadrage et de niveau ; pas de double joystick.
- Actions utilisables au clavier et états utiles également exposés dans une interface HTML structurée.
- Une fiche contextuelle à la fois ; options déjà introduites stables et toujours accessibles.
- Âge et source de l'observation visibles par texte court et motif, pas seulement par couleur.
- Pause de préparation, vitesse d'animation réglable, mouvement réduit, indices sonores doublés visuellement.
- Lecture d'une preuve reçue gratuite ; coût affiché seulement pour acquérir une nouvelle observation ou agir dans le monde.
- Pas d'énigme dépendant d'un détail d'un pixel, d'un chuchotement inaudible ou d'un reflet graphique de qualité supérieure.

Les dialogues nécessaires visent une phrase courte par événement. Les explications supplémentaires s'ouvrent après le geste et se ferment sans perdre le plan en préparation. L'audit de vingt minutes se trouve dans [VALIDATION-V2.md](VALIDATION-V2.md).

## 18. Direction artistique : garder une vraie 3D

**Quai 17 : béton humide, acier peint, lampes industrielles, eau noire, volumes nets.** Palette proposée : ardoise, blanc froid, ambre fonctionnel, touches de rouge réservées aux équipements concernés. Une machine peut être inquiétante par son activité régulière dans un lieu silencieux ; aucune couleur ne certifie sa culpabilité.

Trois fonctions spatiales justifient la 3D :

1. **Niveaux** : une coursive observe au-dessus d'un hangar, tandis qu'une route passe dessous.
2. **Occlusions** : positionner un capteur change sa couverture selon les volumes, sans recherche de pixel.
3. **Conséquences** : porte condamnée, stock submergé, atelier vidé ou rallumé apparaissent dans le même lieu revisité.

Le premier prototype contient ces volumes, avec primitives et matériaux simples. Le port reste majoritaire à l'écran. Une observation locale est rendue dans la même scène depuis un point autorisé et n'affiche que les surfaces et objets accessibles à cette source selon la visibilité simulée. Effacer un mur pour faciliter la sélection ne révèle aucun objet caché. On ne produit pas une banque de vidéos ni une salle de contrôle séparée.

Références de dispositifs : observation indirecte et capteurs de Duskers ; présence distante d'Observation ; décisions spatiales et conséquences d'Invisible, Inc. Les formes, logos, interfaces et assets sont originaux. Les références ne constituent pas une preuve de marché. [Comparaison sourcée](RECHERCHE-V2.md).

Mode mobile allégé : mêmes niveaux, couverture, contrastes fonctionnels et interactions ; résolution interne réduite, lumière simplifiée, moins de reflets et de particules. Aucun indice essentiel ne dépend d'une ombre ou du réglage de luminosité. **Alléger la 3D ne remplace pas le port par des panneaux.**

## 19. Audio

Un rythme identifiable : moteurs, relais, vent, coups sur métal et atelier. Le silence gagne un espace lorsqu'un service s'arrête. Les sons proviennent d'un point d'écoute identifié ; un microphone absent ne transmet pas opportunément un indice caché. Une musique d'ambiance peut accompagner la phase, sans annoncer secrètement une cause inconnue.

EVA garde une diction sobre. Une phrase très normale peut devenir inquiétante parce que l'image ne permet plus de la vérifier. Sous-titres et signaux visuels donnent les mêmes informations de jeu. Pas de sursaut obligatoire ni de flash indispensable.

## 20. Architecture navigateur et mobile

**Choix de production : TypeScript, Vite, Three.js pour le rendu 3D, HTML/CSS pour les commandes.** Dépendances et versions à fixer au développement. Le moteur simule des graphes, états d'équipements, besoins, observations et événements discrets ; il ne dépend pas du nombre d'images affichées.

Séparer cinq couches : état réel simulé ; observations par source ; croyances utilisées par le planificateur ; propositions/ordres ; rendu accessible au joueur. Un contrat spécifie objectif, zone, durée, accès et ressources. Les droits sont vérifiés à l'exécution, les sous-missions héritent de limites explicites.

Le planificateur utilise une recherche finie bornée, avec départage stable et limites documentées. Le cas minimal peut être énuméré complètement ; les scénarios plus grands ne doivent pas afficher « optimal » si la recherche est seulement approximative. Aucun appel à un LLM n'est nécessaire au noyau ni à la narration principale.

Une seule scène 3D et un seul grand point de vue actif limitent le rendu. La couverture utile repose sur une géométrie simplifiée partagée avec la simulation ; diminuer les effets graphiques ne change pas la visibilité autorisée. Le plafonnement de la résolution interne est prévu, en suivant les distinctions de la [documentation Three.js](https://threejs.org/manual/en/responsive.html).

Sauvegarde locale versionnée, journal d'actions, reprise après mise en arrière-plan, export/import. La graine et la version déterminent les événements ; aucun tirage dépend du mouvement de la caméra. Le score local est déclaratif. Un futur serveur pourrait vérifier un replay, sans prouver qu'aucun bot ou partage de solution n'a été utilisé.

Cibles non mesurées : première scène utile sous 5 Mo compressés, 30 images/s stables sur les téléphones retenus pour essai, interface réactive et session de 15 minutes sans dégradation thermique excessive. Tester physiquement Safari iOS et Chrome Android. Si le budget échoue, réduire assets, surface, effets et fréquence de rendu avant d'envisager un changement de technologie ; la 3D reste dans le périmètre.

## 21. Prototype décisif

### Tranche A — plaisir, mesure, observation, conséquence

- Un quai 3D avec coursive, hangar, transfert, passerelle et trois destinations.
- Deux robots, une caméra fixe, un rôle d'observateur mobile.
- Trois services, quatre phases de défi ; découverte guidée séparée.
- Deux critères de réussite, deux priorités, une contrainte critique et les droits utiles.
- Optimisation recalculée, observation actuelle/ancienne/inconnue, récupération du colis et seuils de perte annoncés.
- Alma et EVA ; même lieu avant/après ; bilan partageable et entraînement.
- Un cas sain, un cas d'écart mesure/besoin, une variante spatiale ; aucun incident automatique pour punir une précaution.

La scène narrative « Le dernier passage » donne la situation de référence ; les variantes changent des paramètres et des conditions avant le lancement. L'exemple de transport à un robot sert à valider la règle de sélection, pas à prétendre que toute la tranche à deux robots est déjà résolue.

### Tranche B — seulement après maîtrise de A

Deux extensions du même lieu : essai séparant repère et destination ; comparaison de preuves et d'intérêts avant une extension de service. Elles doivent établir les acquis 3 et 6. Sans ces scènes, présenter honnêtement le prototype comme une exploration de certains mécanismes, sans promettre une compréhension complète du non-alignement et de l'industrie.

### Portes de décision

Deux petites sessions de six à huit testeurs, comprenant novices IA et joueurs de tactique, avec essais sur téléphone. Observer l'action avant de demander l'explication. Cibles exploratoires : premier geste utile avant 30 secondes ; cinq sur huit relancent volontairement ; six sur huit distinguent les états d'observation ; cinq sur huit corrigent un cas nouveau et acceptent une délégation saine.

Si la majorité attend les animations sans préparer de combinaison, revoir la boucle. Si les joueurs corrigent tout en retirant toutes les autorisations, revoir le coût et la diversité des stratégies. Si la 3D masque les décisions, revoir cadrage et volumes. Après deux corrections ciblées sans plaisir ni transfert observables, réouvrir le geste central en conservant la contrainte 3D.

## 22. Exclusions de la première tranche

Pas de ville entière, de conduite libre à deux joysticks, d'économie mondiale, de longues conversations, de personnages réalistes, de vidéos précalculées, de LLM en ligne, d'apprentissage profond entraîné dans le navigateur, de classement serveur ou de campagne de plusieurs heures.

La tranche contient réellement de la 3D, de la composition de mission et une conséquence physique. Les retirer au profit d'un prototype uniquement textuel ne testerait plus la promesse retenue.

## 23. Risques et corrections prévues

| Risque | Signe observable | Correction ciblée |
| --- | --- | --- |
| EVA devient un bouton de confort | Les mêmes choix produisent la même solution et seulement moins de clics | Nouvelles demandes et plans adaptatifs utiles ; pas de quota artificiel |
| Jeu de fiches | Les joueurs passent davantage de temps dans les panneaux qu'à lire et agir dans le port | Mettre priorité, couverture et résultat sur les objets ; couper les textes |
| Protection systématiquement dominante | Une configuration unique maximise tous les résultats | Créer coûts matériels et cas sains ; laisser les protections assurer leur fonction |
| Peur arbitraire | « Le jeu l'aurait fait de toute façon » | Vérifier les contrefactuels et respecter les issues prévenues |
| Bon prompt présenté comme solution générale | Le joueur ne conçoit jamais un essai de contexte | Ajouter et tester le mécanisme de généralisation distinct |
| Score incohérent avec le propos | Le bilan récompense des besoins retirés ou vend une valeur morale universelle | Besoins fixes, reçus physiques, contrat de défi limité |
| 3D trop coûteuse | Téléphone lent, objets illisibles | Simplifier lieu et effets ; garder la géométrie utile |
| Plafond du défi rapidement atteint | Tout le panel reproduit un maximum sans adaptation | Variantes et difficulté annoncées ; pas de promesse d'infini ni de pénurie d'essais |
| Dossier plus fort que jeu | Les testeurs comprennent l'intention mais ne veulent pas recommencer | Priorité au geste et au retour tactile/visuel, avant la campagne |

## 24. Questions à résoudre par observation

1. La première combinaison donne-t-elle envie d'en essayer une autre, sans explication pédagogique ?
2. Le joueur utilise-t-il les niveaux et les points d'observation comme des outils ?
3. Peut-il distinguer rapport, dernière observation et résultat actuel ?
4. Modifier un objectif lui donne-t-il un pouvoir créatif, ou l'impression de remplir un formulaire ?
5. Les pertes suscitent-elles une nouvelle stratégie et un intérêt pour la suite ?
6. La peur vient-elle de ce qu'il comprend pouvoir perdre, avec une action encore possible ?
7. Le défi produit-il des résultats et des solutions que les joueurs veulent comparer ?
8. Après les deux tranches, distingue-t-il mauvais critère, mauvais repère appris, panne et ordre humain nuisible ?

**Décision actuelle : poursuivre avec cette V2 en 3D. La preuve de fun, de peur et d'apprentissage doit venir de la tranche jouée.**
