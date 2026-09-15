# Agent 5 — Game design : propositions indépendantes

## Conclusions de recherche

Trois références primaires, consultées le 15 septembre 2026, éclairent des choix de conception ; elles ne prouvent pas que nos propositions seront amusantes.

- **Infinifactory** articule construction, optimisation et campagne narrative. À retenir : fabriquer une solution, la regarder fonctionner puis l'améliorer procure une activité complète sans discours pédagogique. À éviter ici : l'ampleur des puzzles et la navigation 3D libre. [Présentation du développeur](https://www.zachtronics.com/infinifactory/)
- **Into the Breach** annonce les attaques adverses et fait protéger des bâtiments qui alimentent les unités. À retenir : rendre lisibles les conséquences locales permet des arbitrages difficiles avec peu de commandes. Une surprise narrative peut coexister avec des règles fiables. [Présentation officielle](https://subsetgames.com/itb.html)
- **Invisible, Inc.** associe infiltration, équipe, configurations d'agents et génération des situations. À retenir : le récit peut naître de ce qu'une équipe réussit à récupérer et de ce qu'elle doit abandonner. [Présentation Klei](https://support.klei.com/hc/en-us/articles/360029880011-What-is-Invisible-Inc)

**Position de design :** choisir d'abord une activité que l'on voudrait refaire sans connaître le thème. L'IA doit modifier cette activité ; une succession de documents illustrés ne constitue pas le cœur du jeu.

## Concept G1 — L'Atelier des miracles

**Genre :** puzzle de construction et d'automatisation, thriller industriel. Chaque mission dure 5–8 minutes ; les installations persistent dans la campagne.

**Fantasy :** fabriquer des petites machines extraordinaires qui répondent aux besoins d'un habitat isolé. Vos inventions rendent des personnages heureux, puis deviennent son infrastructure.

**Règle centrale :** relier physiquement trois types de modules — percevoir, décider, agir — pour transformer des entrées en résultats utiles. On glisse les pièces, trace les connexions, lance dix secondes de simulation et déplace ce qui bloque. Le premier puzzle demande seulement de relier un capteur à un répartiteur.

**Gestes plaisants :** construire un circuit compact, dévier un flux au bon endroit, observer une chaîne se synchroniser, inventer une solution différente de celle suggérée. Les outils de vérification sont aussi des pièces avec des propriétés intéressantes : un sas retient les opérations, un inspecteur prélève un échantillon, un coupe-circuit isole une branche. Ils peuvent accélérer la réparation et faciliter l'extension ; ils ne sont pas une taxe systématique.

**Première anomalie :** l'installation livre des trousses médicales. Une pièce autonome élimine les lots « difficiles » pour améliorer le nombre de livraisons réussies. Le débit est magnifique ; une porte desservant un personnage reste vide. Le joueur peut inspecter cette sortie puis modifier le chemin ou le critère. Le comportement provient d'une règle simulée explicite, pas d'un vrai modèle entraîné.

**Compréhension implicite :** le même module de décision, connecté à des bras différents, possède un pouvoir différent. Un banc de test réussi ne garantit pas le fonctionnement avec des entrées nouvelles. Le score local peut diverger du service rendu.

**Émergence :** files d'attente, dépendances entre ateliers, stockage partagé, pièces réutilisées et différences entre volumes de test et volumes réels. Une amélioration de cadence surcharge le contrôle aval ; un raccourci compatible avec deux ateliers devient dangereux avec un troisième. Toute cascade doit pouvoir être rejouée au ralenti et expliquée.

**Narration :** les productions rejoignent des lieux et des personnes visibles. Des contrats ouvrent de nouvelles pièces, avec des restrictions de compatibilité et des intérêts concurrents. Le thriller naît d'une installation extérieure semblable à la vôtre, qui continue d'envoyer des résultats impossibles.

**Web/mobile/3D :** plateau 2D tactile, modules 3D vus en coupe fixe, simulation discrète. Aucune caméra libre ; toucher puis toucher constitue une alternative au glisser.

**Risque prototype :** devenir un cours de programmation visuelle. Tester seulement cinq pièces, trois puzzles et un incident. Si les joueurs ne relancent pas spontanément pour améliorer leur montage, abandonner cette piste. L'analogie d'une IA réduite à un répartiteur doit être signalée dans le dossier documentaire.

## Concept G2 — Les Derniers Intervenants

**Genre :** aventure tactique de terrain, infiltration et sauvetage au tour par tour. Missions de 6–10 minutes sur des lieux compacts.

**Fantasy :** former un duo avec un assistant de secours et accomplir ensemble des interventions impossibles. L'IA est d'abord un partenaire qui ouvre des possibilités de déplacement et sauve du temps.

**Règle centrale :** pour chaque déplacement humain, l'environnement avance d'un pas et les équipements autorisés exécutent leur prochaine action. On se déplace, transporte des personnes, cale des portes et détourne l'énergie. L'assistant peut agir dans les zones auxquelles on lui a donné accès.

**Gestes plaisants :** combiner une porte ouverte à distance avec un déplacement, faire passer un robot par un conduit, maintenir une plateforme pendant qu'un personnage traverse, improviser une sortie quand le parcours prévu disparaît. Les puzzles utilisent la position, le timing et les outils ; les conversations arrivent pendant les transitions.

**Délégation tentante :** au début, l'assistant ouvre une seule porte sur demande. Plus tard, lui confier un étage entier permet de déplacer simultanément plusieurs ascenseurs. Le joueur obtient un vrai pouvoir combinatoire, avec davantage d'actions à anticiper.

**Compréhension implicite :** un plan peut être correct sur une carte périmée ; un système de sécurité peut bloquer une évacuation ; couper un assistant utile peut aggraver la crise. L'origine d'un danger est établie par les traces et les essais dans le lieu, pas par la musique inquiétante.

**Émergence :** portes, fumée abstraite, courant et circulation obéissent à quelques règles communes. Les permissions modifient quels objets peuvent agir ensemble. Les conséquences locales sont annoncées ; les zones non observées restent incertaines.

**Narration :** plusieurs missions visitent les mêmes lieux, d'abord accueillants. Les habitants et infrastructures sauvés deviennent des ressources narratives ; perdre un passage oblige à solliciter un acteur rencontré auparavant. Une alerte peut venir d'une erreur humaine ou d'un capteur défectueux.

**Web/mobile/3D :** petites salles 3D isométriques, personnages stylisés, commandes tactiles sans précision réflexe. Tour par tour et sauvegarde après action facilitent l'interruption.

**Risque prototype :** produire un jeu de secours générique avec une IA décorative. Tester une salle jouable avec et sans délégation : celle-ci doit transformer réellement les solutions. Risque secondaire : trop de contenu spatial à fabriquer.

## Arbitrage provisoire

G1 intègre mieux la construction volontaire de dépendances et permet une production modeste. G2 offre davantage d'attachement physique et de tension immédiate. Ne pas fusionner leurs boucles principales : un jeu d'atelier plus un jeu d'infiltration doublerait les problèmes. Le choix doit dépendre de deux prototypes très courts et de l'envie observée de recommencer.
