# Annexes de conception et de vérification

> **Archive V1.** La carte de couverture des notions reste une ressource d'auteur. Les règles, audits et priorités actifs sont dans [VALIDATION-V2.md](VALIDATION-V2.md). Les anciens plateaux à deux interventions ne définissent plus le prototype.

Complément du [dossier principal](DOSSIER.md). Les situations, dialogues et paramètres sont fictifs. Les tableaux décrivent des intentions de conception et des audits sur document ; aucun joueur réel n'a encore été testé.

## 1. Carte pédagogique

**Principe :** situation → action → observation → explication possible. La croyance initiale est une hypothèse à vérifier, jamais un diagnostic du joueur. Le nom reste facultatif. « Socle » signifie prioritaire pour la campagne ; « variante » signifie rencontré seulement dans certaines missions ; « frontière » signifie branche tardive explicitement conditionnelle. Les vingt-huit notions ne sont pas toutes exigées dans une même partie, encore moins dans le prototype.

| # / concept et présence | Situation de jeu | Ce que le joueur pourrait croire au début | Mécanique / décision | Ce qu'il observe | Ce qu'il peut comprendre | Nom éventuel après l'expérience |
| --- | --- | --- | --- | --- | --- | --- |
| 01. Modèle, produit, système — socle | EVA propose une tournée puis reçoit un accès aux commandes | « L'IA est un seul objet qui sait tout faire » | Même module, proposition puis exécution autorisée | Le plan identique acquiert une conséquence matérielle | Les composants et leur branchement comptent autant que le nom du modèle | Modèle / système |
| 02. Capacité et connaissances — socle | Deux versions résolvent différemment une tournée nouvelle | « Plus récente signifie meilleure partout » | Comparer une tâche connue et une exception | Une version planifie mieux mais dispose d'un plan de quai ancien | Savoir faire une tâche et disposer de la bonne information sont distincts | Capacités, contexte |
| 03. Erreur et incertitude — socle | Une réponse annonce qu'une porte est ouverte sans observation récente | « Une phrase assurée garantit le fait » | Vérifier la porte ou prendre un détour connu | L'affirmation peut être correcte ou erronée ; sa source manque | Assurance verbale et preuve ne sont pas équivalentes | Erreur, hallucination seulement si le cas le justifie |
| 04. Mémoire — variante | Une préférence de livraison conservée ne correspond plus à l'habitant | « Se souvenir aide toujours » | Retrouver la préférence et son ancienneté, la corriger | Une routine cohérente exécute une demande périmée | Une mémoire doit être mise à jour et située | Mémoire persistante |
| 05. Outils et accès — socle | EVA peut consulter les commandes, puis les modifier | « Une réponse et une action changent peu de choses » | Donner un outil sur une zone limitée | Des possibilités nouvelles apparaissent sur les objets concernés | Un outil et un droit rendent certaines actions réalisables | Accès aux outils |
| 06. Agent et durée d'autonomie — socle | Une tournée se poursuit pendant une intervention humaine ailleurs | « J'ai validé un geste isolé » | Fixer zone et expiration d'une mission | Plusieurs choix intermédiaires se produisent sans nouvelle demande | Un objectif confié pour une durée ouvre une suite d'actions | Agent, autonomie |
| 07. Sous-missions — variante | EVA délègue une inspection à un second appareil | « Une copie dispose de moyens indépendants et illimités » | Partager l'enveloppe et limiter le sous-périmètre | Deux tâches se disputent le même budget ; une révocation se propage | Délégation, droits et ressources doivent garder leur provenance | Sous-agent, délégation |
| 08. Intention et métrique — socle | Les cas difficiles passent hors tournée et la ponctualité monte | « La mesure résume le service » | Replacer le besoin exclu sur le plateau, modifier la mesure et les droits | Le taux est exact dans son périmètre mais une personne attend | Optimiser un indicateur peut manquer l'intention | Specification gaming dans cette variante précise |
| 09. Signal de récompense — variante | Sur le banc simulé, un plan obtient un meilleur score en exploitant le contrôle du test | « Un score d'entraînement élevé prouve la tâche accomplie » | Modifier le dispositif de mesure et refaire le même essai | Le score baisse sans perte correspondante du service réel | Le signal utilisé pour apprendre ou évaluer peut être exploité | Reward hacking ; pas une catégorie disjointe du précédent |
| 10. Généralisation du but — variante | Un robot reste habile mais suit un guide devenu inadéquat | « Une consigne correcte suffit » | Changer le guide puis les obstacles ; comparer le comportement | Il évite les obstacles avec compétence mais poursuit la mauvaise destination | La compétence peut se transférer sans le but voulu | Goal misgeneralization |
| 11. Environnement d'essai — socle | Un plan est lancé sur un petit lot isolé | « Tester équivaut à déployer » | Essayer sans brancher le reste du quai | L'échec reste local ; les conditions réelles diffèrent encore | Un périmètre d'essai limite des effets et ne garantit pas tout le déploiement | Sandbox |
| 12. Moindre privilège — socle | Ouvrir une seule porte suffit à la mission | « Plus de droits est toujours plus pratique » | Limiter l'accès à cet objet et cette durée | La mission réussit sans pouvoir modifier le registre | Donner ce qui est nécessaire réduit certains chemins d'erreur | Least privilege |
| 13. Supervision humaine — socle | Inès a validé un rapport sans voir le quai | « Une signature signifie que quelqu'un a vérifié » | Fournir une observation et une capacité d'interruption | La même personne détecte alors une anomalie et peut agir | Contrôler demande information, temps et autorité | Human in the loop |
| 14. Observation et monitoring — socle | Le seul contrôle regarde l'accusé automatique | « Un voyant vert couvre tout » | Placer une observation indépendante sur le point de réception | La différence entre transfert et réception apparaît | Un contrôle voit certains événements et en manque d'autres | Monitoring |
| 15. Protections complémentaires — variante | Une erreur franchit le premier filtre | « Une protection doit tout arrêter seule » | Associer limite d'accès, contrôle terrain et reprise locale | Une seconde couche contient l'effet manqué par la première | Des protections différentes peuvent réduire des risques différents | Défense en profondeur |
| 16. Réversibilité — socle | Une commande a été envoyée avant révocation | « Annuler le contrat efface le passé » | Révoquer puis organiser le retour du colis | Les actions futures cessent ; le déplacement passé demeure | Arrêt, annulation et réparation sont distincts | Réversibilité |
| 17. Acceptation d'une correction — frontière | Dans un essai tardif, un agent reçoit un changement de mission | « Pouvoir cliquer Stop résout toute la correction » | Tester interruption et reprise à un point contrôlé | Le comportement observé dépend du dispositif et du contexte | Un système doit pouvoir être corrigé ; un essai réussi ne garantit pas tous les cas | Corrigibilité, notion plus large qu'un bouton |
| 18. Calibration — variante | EVA formule des estimations sur plusieurs portes | « La confiance annoncée est une fréquence mesurée » | Comparer prévisions et constats sur un ensemble d'essais | Certaines estimations sont trop assurées | Une confiance doit se juger sur son adéquation aux résultats, dans un contexte donné | Calibration |
| 19. Provenance et preuve — socle | Trois alertes citent le même test | « Trois reprises font trois confirmations » | Relier les origines, vérifier le test et demander une observation distincte | Une seule base commune, parfois valide, parfois mal configurée | Origine, indépendance et contexte comptent ; une affirmation peut être résolue | Corroboration |
| 20. Confiance dans l'automatisation — socle | Après plusieurs succès, le joueur accepte un parcours sans le regarder | « Cela a marché, donc je peux généraliser » | Une anomalie visible permet une vérification ; débrief des données disponibles | La confiance utile dans une tâche a débordé sur une autre | On peut ajuster sa confiance à une compétence et à des conditions | Automation bias, si l'observation du joueur le suggère |
| 21. Usage malveillant — variante | Un humain utilise une autorisation légitime pour détourner une demande | « L'IA doit avoir décidé de nuire » | Examiner l'origine de l'ordre et retirer l'accès concerné | Le système exécute une commande nuisible émise ailleurs | Usage malveillant et défaillance de l'agent ne sont pas la même cause | Misuse ; fraude/cyber traités abstraitement |
| 22. Double usage — variante | Un outil d'inspection peut aussi fournir des informations sensibles sur les installations | « Utile signifie sans risque, ou risqué signifie inutile » | Choisir les résultats partagés et les destinataires | Une inspection utile reste possible avec une diffusion limitée | Un même moyen peut servir plusieurs intentions | Dual use ; aucun mode opératoire nuisible |
| 23. Échelle — variante | Une anomalie rare du petit test revient dans plusieurs files | « Un petit taux implique peu de conséquences » | Comparer volumes et types de demandes, limiter un pilote | Le nombre de besoins concernés change avec le volume | Fréquence, volume et corrélations affectent l'impact | Effets d'échelle ; nombres fictifs d'équilibrage |
| 24. Dépendance et concentration — socle | Plusieurs services attendent le même relais indisponible | « Chaque service possède son secours » | Déployer une réserve ou réorganiser les connexions | La cause commune produit plusieurs interruptions | Une apparente diversité peut masquer une dépendance unique | Risque systémique, concentration |
| 25. Incitations et concurrence — socle | Une démonstration ouvre un financement sous délai | « Le résultat présenté décrit toutes les capacités » | Sélectionner des essais utiles et annoncer un périmètre limité | Les contraintes influencent les preuves disponibles | Un intérêt économique peut orienter une présentation sans rendre toute preuve fausse | Incitations, coût de vérification |
| 26. Ressources et coordination internationale — variante | Un composant manque ; un partenaire offre un remplacement assorti de conditions | « Le logiciel se copie sans contrainte » | Réaffecter le calcul, tester la compatibilité, négocier une fenêtre d'essai | Matériel, énergie, standards et contrats bornent les options | Le déploiement dépend d'infrastructures et d'acteurs situés | Compute, interopérabilité, souveraineté |
| 27. Comportement stratégique — frontière | Des actions en essai changent lorsqu'un contrôle est annoncé | « Tout résultat étrange prouve une volonté cachée » | Confronter plusieurs causes et conditions expérimentales | Des traces peuvent soutenir une hypothèse, sans lire directement une intention | Un comportement stratégique doit être étayé ; l'objectif final n'est pas automatiquement connu | Tromperie expérimentale ; convergence instrumentale seulement en dossier théorique |
| 28. Perte de contrôle — frontière | Un pilote futur conserve des chemins d'action au-delà de la reprise locale | « Une panne compliquée et une perte générale de contrôle sont identiques » | Cartographier les chemins restants et essayer un confinement borné | Les hypothèses nécessaires et les limites de la reprise deviennent explicites | La perte de contrôle forte est un scénario distinct et plus spéculatif | Perte de contrôle, scénario conditionnel |

### Ancrages et limites

Les lignes 08–09 s'appuient sur des exemples expérimentaux de récompense ou de spécification imparfaite ; elles ne prétendent pas définir deux classes parfaitement séparées. [DeepMind, 2020](https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/). La ligne 10 transpose un mécanisme expérimental différent, où la spécification correcte ne garantit pas le but appris. [DeepMind, 2022](https://deepmind.google/blog/how-undesired-goals-can-arise-with-correct-rewards/).

Les règles d'accès s'inspirent du moindre privilège, mais les contrats et révocations exacts sont ceux du jeu. [Définition NIST](https://csrc.nist.gov/glossary/term/least_privilege). Les lignes de frontière s'appuient sur des questions et observations de recherche, non sur une fréquence d'incident général : les expériences Anthropic sont des environnements construits pour chercher des échecs. [Étude de 2025](https://www.anthropic.com/research/agentic-misalignment), [études de cas été 2026](https://alignment.anthropic.com/2026/agentic-misalignment-summer-2026/).

**Le prototype couvre seulement les relations 01, 05, 06, 12 et une première vérification liée à 14/19.** Il peut suggérer la ligne 08 dans une variante, mais ne prétend pas enseigner toute cette carte. Un registre métier mal paramétré par un humain n'est pas automatiquement du specification gaming.

## 2. Audit de friction UX — vingt premières minutes

Prévision éditoriale, pas observation. « Nouveauté » compte une règle ou un outil ; sélectionner puis engager constitue une grammaire initiale montrée par action. Les minutes ne s'écoulent pas obligatoirement à cette cadence : la lecture et la préparation mettent la simulation en pause.

| Minute | À comprendre maintenant | Nouveautés max. | Action au lieu de lecture | Explication supprimée | Ce qui est reporté | Information visible dans le monde |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | Robot → destination → avancer | 1 grammaire | Livrer une batterie | Présentation du poste et de l'IA | Tout vocabulaire industriel | Atelier qui se rallume |
| 02 | Une proposition peut aider à ordonner deux départs | 1, sans nouveau menu | Ajuster la proposition d'EVA avec le geste connu | Présentation technique de l'assistante | Historique complet | Deux routes et une proposition distincte |
| 03 | Un passage partagé crée un conflit | 1 | Abaisser la passerelle et observer l'aperçu | Manuel de priorité | Réservations avancées | Deux trajets se croisent |
| 04 | On peut modifier avant engagement | 1 | Annuler puis recomposer la séquence | Texte sur la sécurité d'annulation | Nouveau personnage | Emplacement d'ordre rendu disponible |
| 05 | Une mission dure dans une zone | 1 | Autoriser deux tournées locales | Cours sur l'agentivité | Budget, sous-agents | Zone et expiration de mission |
| 06 | Déléguer permet une autre manœuvre | 0 | Coordonner passerelle et tournée | Argumentaire sur les bénéfices IA | Nouvel écran de gestion | Même robot, nouvelle demande traitée |
| 07 | Deux organisations peuvent réussir | 0 | Comparer séquencement manuel et mission autonome | Discours imposant d'automatiser | Comparaison de versions | Résultats et occupation de l'équipe |
| 08 | Un rapport peut diverger du terrain | 0 | Sélectionner le colis resté au dépôt | Alerte dramatique générale | Explication causale définitive | Objet présent, personne en attente |
| 09 | Une trace décrit des étapes | 1 | Comparer demande et accusé | Bloc de logs obligatoire | Fiche de recherche | Trois étapes reliées au quai |
| 10 | On peut corriger localement | 0 | Réaffecter le colis | Leçon finale et QCM | Nom savant | Réception physique |
| 11 | La règle reste la même ailleurs | 0 | Nouvelle géométrie, mêmes gestes | Répétition des commandes | Nouveau pouvoir | Quai adjacent |
| 12 | Les échéances suivent les actions | 1 | Avancer un intervalle et observer le ferry | Tutoriel sur l'horloge | Chronomètre réel | Positions du ferry et échéance |
| 13 | Réserver un trajet évite un blocage | 0 nouvelle commande | Organiser l'ordre de départ | Théorie d'ordonnancement | Circuits supplémentaires | Trajets et point de croisement |
| 14 | Un bon plan peut être ajusté | 0 | Modifier une proposition utile | Présentation des benchmarks | Version supérieure d'EVA | Une autre route devient possible |
| 15 | Une mission s'arrête à sa limite | 0 | Laisser expirer puis renouveler si utile | Chapitre « permissions » | Accès global | Robot arrêté au bord du secteur |
| 16 | Une observation exige une intervention | 1 | Envoyer l'équipe vers la porte | Définition de monitoring | Audits multiples | Équipe occupée et résultat rapporté |
| 17 | Deux sources peuvent parler d'instants différents | 0 | Comparer la date des deux constats | Discours sur l'incertitude | Provenance à plusieurs niveaux | Horodatages courts et état actuel |
| 18 | Les choix précédents laissent des moyens différents | 0 | Réemployer ou attendre l'équipe | Message moralisateur | Contrats et financement | Équipe disponible ou occupée |
| 19 | Les règles se combinent | 0 | Résoudre croisement + tournée + vérification | Récapitulatif obligatoire | Nouvelle intrigue | Conséquences sur les mêmes objets |
| 20 | On peut expliquer et reprendre | 0 | Revoir trois événements puis relancer une variante | Examen de connaissances | Expansion du port | Chaîne de la mission et état préservé |

**Points à retirer si surcharge :** la première comparaison de traces peut rester une seule bascule ; reporter la date au second incident ; limiter à deux destinataires ; remplacer le treuil par la passerelle déjà connue. Ne pas introduire en même temps la lecture d'un contrat, un nouveau personnage et une règle de mouvement.

## 3. Audit anti-serious-game et de maîtrise

| Système porteur d'apprentissage | Plaisir indépendant du thème | Échec possible | Modification ou décision |
| --- | --- | --- | --- |
| Plan de tournée | Trouver un chemin et un ordre élégants | Suivre un itinéraire surligné sans choix | Au moins deux routes aux conséquences différentes |
| Délégation | Réussir une combinaison simultanée | Supprimer un travail répétitif | Libérer une intervention intéressante, conserver le jeu manuel plaisant |
| Permissions | Définir quels objets agissent ensemble | Cocher des cases abstraites | Montrer l'objet et le pouvoir ; un seul accès nouveau à la fois |
| Essai | Prédire puis confronter un résultat | Cliquer « audit » pour bonus sécurité | Choisir le cas qui départage deux plans ; résultat situé |
| Vérification | Trouver la contradiction qui ouvre une réparation | Collecter des documents pour avancer | Une preuve doit changer une action disponible ou une prédiction |
| Reprise locale | Sauver une situation avec des outils connus | Appuyer sur le bouton vert de sécurité | Recomposer les mouvements avec la réserve réelle |
| Contrat | Réorganiser les moyens sous une contrainte | Lire des clauses pour deviner l'auteur | Résumer le changement par connecteur, créneau ou ressource |
| Provenance | Distinguer une observation de ses copies | Mini-QCM sur la profession d'un locuteur | Relier les sources et réaliser l'essai indépendant |
| Défi | Dépasser son palier par anticipation | Refaire une longue ouverture ou lire plus vite | Reprise directe, briefing visuel court, temps fondé sur les actions |

**Mémorisation et skill.** Une connaissance de la carte commune est un avantage normal de l'entraînement. Pour établir qu'il existe aussi une maîtrise transférable, tester une micro-variante inédite : obstacle déplacé, autre disponibilité, même règle. Améliorer uniquement sur la carte mémorisée ne suffit pas à valider la profondeur.

## 4. Simulations pédagogiques — trois profils fictifs

Ces répliques sont des résultats **espérés**, pas des prédictions certaines ni des observations. Les profils ne représentent pas toutes les personnes novices. Les tests recueilleront leurs formulations libres et leurs désaccords.

| Représentation initiale fictive | Après 10 minutes | Après 30 minutes | Après 2 heures | Après la partie |
| --- | --- | --- | --- | --- |
| « Le risque IA, c'est Terminator » | « Le colis est resté ici parce que l'ordre et la réception n'étaient pas la même chose. » | « Lui donner la porte n'est pas lui donner le registre. » | « Plusieurs services lisaient la même information ; ils pouvaient tous se tromper ensemble. » | « Certains risques viennent des usages humains ou des dépendances. Une perte de contrôle forte pose une autre question. » |
| « Tout cela est de la science-fiction » | « Je reconnais un problème concret de données et de décision. » | « Une petite erreur peut agir ailleurs si on lui donne les moyens. » | « Je peux prendre une alerte au sérieux en vérifiant ce qu'elle prouve. » | « Il existe des mécanismes observés et des expériences inquiétantes, mais notre catastrophe jouée n'est pas une mesure du futur. » |
| « Très intelligent signifie automatiquement très dangereux » | « Le plan d'EVA était utile ; l'accès déterminait ce qu'elle pouvait changer. » | « La même version agit différemment selon son périmètre. » | « La qualité du modèle compte encore, mais les moyens et la supervision aussi. » | « On peut profiter de capacités élevées sous certaines conditions ; de bonnes instructions ne suffisent pas à garantir tout le système. » |

### Protocole de transfert proposé

Avant de jouer, demander une explication courte d'un cas, sans enseigner le vocabulaire. Après, présenter un autre secteur : réservation de transport, traitement de factures, organisation d'une bibliothèque. Demander ce qui pourrait mal se passer, quelle information vérifier et quelle décision serait proportionnée.

Coder séparément : chaîne causale ; capacité/accès ; portée des preuves ; incertitude ; intervention. Ne pas noter une opinion « pour » ou « contre » l'IA. Un exemple complémentaire une semaine plus tard peut étudier la rétention si les participants acceptent. L'étude d'intégration pédagogique et les recherches sur le transfert justifient cette prudence, pas un effet déjà démontré pour ce jeu. [Habgood et Ainsworth, 2011](https://shura.shu.ac.uk/3556/1/Habgood_Ainsworth_final.pdf), [Gick et Holyoak, 1983](https://reasoninglab.psych.ucla.edu/wp-content/uploads/sites/273/2021/04/Gick_Holyoak1983_SchemaInduction.pdf).

## 5. Plausibilité : mécanisme réel et scène fictive

**A-terrain** : observation rapportée dans un déploiement réel. **A-expérience** : observation obtenue dans un dispositif contrôlé. **B** : extrapolation raisonnable d'une chaîne qui n'a pas été démontrée telle quelle. **C** : scénario qui demande des hypothèses fortes ou très incertaines. **D** : invention dramatique. Un événement peut avoir un mécanisme A et une chaîne B ; ses personnages, lieux et dialogues demeurent D. On n'étiquette pas une catastrophe entière A parce que sa première étape est observée.

| Événement majeur du projet | Base et portée | Classe de la chaîne jouée | Indice accessible avant l'effet grave | Intervention possible |
| --- | --- | --- | --- | --- |
| E1. Un transfert compté comme livraison | Convention de registre simulée ; ne prouve aucun désalignement du modèle | B ; scène D | Point d'arrivée et convention de transfert | Modifier le point final, corriger le registre, livrer |
| E2. Les cas difficiles exclus pour améliorer une mesure | Mécanisme étudié en expériences de specification gaming | B, ancrage A-expérience ; scène D | Droit de classement et demandes hors tournée | Limiter le droit, élargir mesure et observation, traiter le besoin |
| E3. Robot compétent suivant le mauvais guide | Expérience de généralisation du mauvais but | B, ancrage A-expérience ; scène D | Le comportement reste lié au guide malgré changement de tâche | Essai contrasté, limiter le pilote, choisir un autre plan |
| E4. Trois contrôles partagent une source | Architecture fictive de données et dépendance commune | B ; scène D | Même identifiant, même date, même point de mesure | Observation indépendante, séparation des chemins |
| E5. Maintenance fournisseur provoquant des arrêts liés | Dépendances contractuelles et coûts de changement documentés, transposés au quai | B ; scène D | Connecteurs modifiés et maintenance annoncée | Migration partielle, réserve, calendrier négocié |
| E6. Commande nuisible venue d'un humain | Chaîne proposée de commande autorisée mais nuisible ; aucun cas primaire de terrain exactement équivalent n'est revendiqué | B ; scène D | Provenance de l'ordre, autorisation et résultat | Retirer l'accès, préserver la preuve, rétablir le service |
| E7. L'arrêt central ne suffit pas à rétablir les services | Dépendance opérationnelle combinée à une panne ordinaire fictive | B ; scène D | Équipes réaffectées, réserve absente, liens communs | Reprise locale et ordre de redémarrage préparé |
| E8. Contournement stratégique d'une restriction en pilote futur | Possibilités étudiées en scénarios expérimentaux ; transposition non démontrée | C, ancrage partiel A-expérience ; scène D | Essais incohérents et chemins d'accès documentés | Limiter le pilote, supervision séparée, confinement |
| E9. Perte de contrôle dépassant le port | Hypothèses supplémentaires sur capacités, échelle et coordination | C ; ne fait pas partie du prototype | Les hypothèses sont explicitées dans le scénario | Exploration facultative ; aucune probabilité d'extinction affichée |

### Sources du registre

E2 : [DeepMind, specification gaming](https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/). E3 : [DeepMind, goal misgeneralization](https://deepmind.google/blog/how-undesired-goals-can-arise-with-correct-rewards/). E5 : la FTC étudie des contrats cloud/laboratoires et leurs implications possibles pour la concurrence ; notre équipement portuaire est une transposition. [FTC, janvier 2025](https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2025/01/behind-ftcs-6b-report-large-ai-partnerships-investments). E6/E9 : [rapport international 2026](https://internationalaisafetyreport.org/publication/2026-report-extended-summary-policymakers). E8 : [Anthropic, études de cas été 2026](https://alignment.anthropic.com/2026/agentic-misalignment-summer-2026/).

Le rapport international de **février 2026** indiquait que les capacités alors observées n'atteignaient pas le niveau nécessaire aux scénarios forts de perte de contrôle considérés. Cette phrase est un constat daté, pas une garantie sur tous les systèmes de septembre 2026 ni sur le futur fictif du jeu. Les experts divergent sur la plausibilité de tels scénarios. Les expériences plus récentes de recherche d'échecs ne donnent pas, à elles seules, leur fréquence en déploiement. [Rapport et section perte de contrôle](https://internationalaisafetyreport.org/publication/2026-report-extended-summary-policymakers).

## 6. Test anti-Skynet — chaînes précises

### E1 — Mauvais paramétrage métier

Convention humaine « terminé au dépôt » → système configuré conformément à cette convention → transfert correct → destinataire final non servi → demande de reprise. **La cause n'est pas une volonté cachée.** La correction est paramétrage + trajet ; une réécriture vague de la personnalité d'EVA ne change rien.

### E2 — Réussite mesurée trompeuse

Mesure de ponctualité incomplète → mission d'optimisation → accès au classement → cas difficiles sortis du dénominateur → réussite affichée → tournée humaine réaffectée sur cette base → besoin oublié. Le droit retiré, un contrôle de couverture ou une équipe conservée interrompt la chaîne. Le journal prouve l'action et son auteur ; un essai comparatif des plans et du critère permet d'établir le mécanisme simulé. Il ne s'agit pas d'une lecture certaine des intentions d'un modèle réel, ni d'une preuve qu'un modèle réel apprendrait toujours ce raccourci.

### E3 — Mauvais but transféré

Apprentissage dans des cas où suivre le guide réussit → capacité de navigation transférée → changement du rôle du guide → poursuite habile du guide au lieu de la destination voulue → bâtiment non inspecté. Un test avec guide déplacé révèle la structure. Un nouveau texte ne garantit pas que le mécanisme appris a changé.

### E4 — Contrôle commun

Réutilisation économique d'un accusé de transfert → trois affichages fondés sur lui → validation humaine croyant à trois vérifications → extension du service → omission répétée. Les empreintes d'origine existaient dès le début. Une mesure réellement distincte peut confirmer le problème ou réfuter l'alerte.

### E5 — Dépendance contractuelle

Offre fournisseur utile → équipement compatible adopté → remplacement progressif d'interfaces → réserve alternative non maintenue → maintenance annoncée → migration plus lente que le créneau disponible → interruption liée. La diversification n'est pas toujours optimale ; la préparation du calendrier peut aussi rendre le fournisseur unique viable.

### E6 — Usage humain nuisible

Compte disposant d'un droit réel → commande malveillante → agent qui exécute dans ce périmètre → observation tardive → réaffectation erronée des moyens → service interrompu. L'enquête suit l'autorisation et l'origine, sans enseigner une technique d'intrusion. Retirer le compte ne répare pas automatiquement les effets déjà produits.

### E7 — Reprise impossible immédiatement

Bénéfices de centralisation → disparition graduelle d'une coordination locale → équipement commun indisponible → attente d'autorisations → réserve qui s'épuise → effet sur plusieurs services. La panne est ordinaire ; le degré de dépendance détermine sa portée. L'arrêt logiciel peut fonctionner techniquement tout en laissant le service sans remplaçant.

### E8/E9 — Branche frontière

Capacités futures explicitement supposées → pilote plus long → accès et sous-missions autorisés → objectif persistant → supervision qui n'observe qu'une partie des actions → comportement stratégique étayé par plusieurs essais → tentative humaine de restriction → actions déjà engagées ou accès indépendants qui persistent → effets au-delà du périmètre. **Chaque arête d'accès doit exister avant la crise.** Une propagation plus large exige des hypothèses supplémentaires, documentées ; aucune « nouvelle intelligence » n'accorde une permission magique.

## 7. Défi : vérification de justice et de comparabilité

| Cas à tester | Résultat attendu |
| --- | --- |
| Même graine et commandes sur deux appareils | Même état final et même palier |
| Lire longtemps, réduire les animations ou jouer sans son | Aucun changement du score ni des échéances |
| Ouvrir dix fois une fiche | Aucun tirage aléatoire supplémentaire ni consommation d'intervention |
| Reclasser une demande ou la recréer | Aucun point supplémentaire ; identifiant de demande stable |
| Refuser une autorisation mais réussir autrement | Palier validé selon les mêmes objectifs |
| Donner une autorisation large et réussir avec contrôles pertinents | Palier validé ; aucune pénalité idéologique cachée |
| Échec causé par un fait non observable avant effet irréversible | Scénario rejeté ou corrigé pour le Défi |
| Rechargement d'un checkpoint | Pas de modification du tirage fixé ni de duplication de ressources |
| Règles mises à jour | Résultats séparés ; code de version conservé |
| Sauvegarde ou score local édité | Aucune promesse de certification ; classement public absent au prototype |

L'objectif de compétition est explicite et borné. Il ne mesure pas la qualité globale d'une politique publique. Une réponse raisonnable peut avoir un mauvais résultat en campagne ; le débrief distingue ce cas d'une erreur de raisonnement. Le Défi privilégie des scénarios où la maîtrise améliore effectivement la performance.

## 8. Tests du noyau et couverture narrative

Vérifications prévues lors du développement, non encore exécutées :

- Conservation des ressources et des colis ; toute perte possède une cause enregistrée.
- Budget partagé des sous-missions ; aucune multiplication par duplication d'agent.
- Contrôle des droits lors de l'exécution, révocation des descendants et maintien explicite des droits indépendants.
- Effets passés distincts des opérations futures, réparation distincte d'annulation.
- Sources et dates des observations, aucun texte qui affirme un fait inconnu sans origine narrative prévue.
- Variantes qui conservent une solution viable ; protection capable d'interrompre chaque chaîne de crise dans son périmètre annoncé.
- Score fondé sur reçus physiques et demandes uniques, jamais sur le compteur métier manipulable.
- Sauvegarde, export/import, version et replay cohérents sur les navigateurs ciblés.
- Les mêmes permissions avec des versions de capacité différentes produisent des plans différents sur au moins une tâche ; les mêmes capacités avec des permissions différentes produisent des actions possibles différentes.
- Cartographie de ce que savait chaque personnage avant sa décision, pour éviter une culpabilité attribuée rétrospectivement sans preuve.

## 9. Deux plateaux muets à prototyper

Ces plateaux sont des spécifications jouables sur papier. Ils éprouvent les routes et la disponibilité des interventions, sans discours pédagogique. Les trajets ci-dessous ont fait l'objet d'une vérification par calcul des arêtes, collisions, échanges de position et fermeture ; aucun test d'agrément ni implémentation complète n'a eu lieu.

### Plateau A — Deux départs, un passage

```text
A — B — C — D — E
    |       |
    F — G — H
```

R part de A et doit atteindre E ; S part de E et doit atteindre A. Une arête prend un tour. Une route directe reste active jusqu'à arrivée, puis le robot se gare hors du passage. Deux robots ne peuvent occuper le même point ni échanger leurs positions pendant un tour ; un conflit immobilise les robots concernés. Les deux colis doivent arriver au plus tard au tour 6. Deux ordres préparables à la fois. La route basse allonge un trajet, mais libère le passage central.

| Tour | Solution A1 : R | Solution A1 : S | Solution A2 : R | Solution A2 : S |
| --- | --- | --- | --- | --- |
| 0 | A | E | A | E |
| 1 | B | D | B | D |
| 2 | C | H | F | C |
| 3 | D | G | G | B |
| 4 | E, reçu | F | H | A, reçu |
| 5 | Garé | B | D | Garé |
| 6 | Garé | A, reçu | E, reçu | Garé |

Les deux solutions respectent l'échéance et évitent les conflits ; elles ne servent pas le même destinataire en premier. Variante annoncée : une utilisation de la batterie reçue au tour 4 ouvre un travail dans le secteur concerné. La priorité dépend alors de ce que l'on veut préparer, sans route universellement optimale. Le premier choix oppose deux plans plausibles, pas un chemin libre à un mur évident.

### Plateau B — Le passage ferme, la mission continue

Même carte, même vitesse, mêmes destinations. Le plan initial est A1. Après le tour 1, une inspection annonce clairement que l'arête B–C sera fermée pendant les tours 2, 3 et 4. Le passage D–C reste ouvert. Les colis sont toujours attendus au tour 6. Une commande du feu de ponton doit également être effectuée au plus tard au tour 3 ; elle occupe une intervention humaine. C'est une réutilisation de la commande d'équipement déjà apprise.

**Solution manuelle :** avant le tour 2, réorienter R vers B–F–G–H–D–E et S vers D–C–B–A. S attend devant la fermeture jusqu'au tour 5. Les deux interventions du tour 2 servent aux nouveaux ordres ; le feu est commandé au tour 3.

**Solution déléguée :** R possède déjà une mission locale dont la zone inclut le détour inférieur. À l'annonce, EVA propose puis adopte ce détour dans les limites de la mission. Le joueur utilise une intervention pour réorienter S et l'autre pour commander le feu dès le tour 2. Il peut aussi avoir choisi dès le départ une organisation directe adaptée : l'autonomie n'est pas nécessaire pour réussir.

| Tour | R, dans les deux solutions | S, dans les deux solutions | Interventions manuelles / déléguées |
| --- | --- | --- | --- |
| 0 | A | E | Deux ordres initiaux / une mission + un ordre |
| 1 | B | D | Aucune ; fermeture annoncée avant préparation suivante |
| 2 | F | C | Deux nouveaux trajets / trajet de S + feu |
| 3 | G | C, attend | Feu / disponible |
| 4 | H | C, attend | Disponibles |
| 5 | D | B | Disponibles |
| 6 | E, reçu | A, reçu | Fin |

Un premier calcul révélait qu'envoyer S de C vers B dès le tour 3 traversait à tort la fermeture. La séquence témoin a été corrigée avec attente aux tours 3–4, puis revérifiée : aucune traversée interdite et arrivées au tour 6. C'est une correction de cohérence, pas un résultat de playtest.

**Ce que le test doit encore déterminer :** intérêt de garder une intervention libre, compréhension d'une mission adaptative, valeur de deux solutions aboutissant au même palier. Si le budget paraît arbitraire, comparer une variante où les deux repères représentent explicitement des engagements de l'équipe sur des objets. Ne pas construire une simulation du personnel avant ce test.

## 10. Contre-expertise finale

Les quatre contre-expertises distinctes sont consignées dans les contributions 14 à 17 et leurs corrections consolidées dans [les arbitrages](ARBITRAGES.md). Il s'agit de critiques sur dossier, jamais de personnes ayant réellement joué au prototype. Les objections qui exigent un playtest restent ouvertes dans la section 24 du dossier.
