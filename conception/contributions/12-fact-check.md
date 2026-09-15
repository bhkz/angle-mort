# Contribution indépendante 12 — Recherche et vérification

Vérification ciblée effectuée le 15 septembre 2026 sur `RECHERCHE.md` et les contributions 03, 04 et 08. Huit points sensibles examinés ; aucun test du jeu ni revue systématique. Les données ci-dessous viennent des publications ou des pages de leurs auteurs. Les propositions de mécanique restent des hypothèses de conception.

## Cadrage indépendant : ce qu'une source établit

Une affirmation doit avoir un sujet, un contexte, une date et une portée. « Ce modèle a produit cette action dans cette expérience » est vérifiable. « Les IA veulent survivre » ajoute une généralisation et une attribution psychologique que cette observation ne suffit pas à établir.

Trois statuts se cumulent avec le classement des événements : **fait documenté**, **estimation conditionnelle**, **scénario construit**. Une fréquence expérimentale est une mesure dans un protocole ; son emploi pour prévoir des dommages futurs exige des hypothèses supplémentaires. Un discours de dirigeant documente une position publique, sans constituer un consensus. Un benchmark mesure les tâches et conditions évaluées, sans certifier une sécurité générale.

| Classe | Critère d'admission | Limite à rendre explicite |
|---|---|---|
| A-terrain | Observation documentée dans un déploiement réel | La cause doit être établie séparément ; un témoignage isolé ne prouve pas toute la chaîne |
| A-expérience | Comportement observé dans un protocole décrit | Identifier les contraintes artificielles et les interventions des chercheurs |
| B | Transposition plausible d'un mécanisme documenté | Décrire les permissions et les étapes inventées ; ne pas annoncer une fréquence réelle |
| C | Extrapolation nécessitant des capacités ou une propagation fortement hypothétiques | Présenter les hypothèses et les désaccords ; éviter les calendriers prédictifs |
| D | Invention dramatique | Personnages, répliques, ville et chronologie ne constituent pas des preuves |

Ces codes décrivent une relation aux preuves, pas une probabilité croissante ou décroissante. Chaque maillon reçoit son propre statut : une catastrophe mondiale ne devient pas A parce qu'un comportement initial existe en laboratoire.

## Huit vérifications sensibles

### 1. Perte de contrôle : ajouter le constat daté sur les capacités

**Verdict : résumé correct, précision utile.** Le rapport international de février 2026 distingue usages malveillants, défaillances et risques systémiques. Son résumé indique aussi que les capacités pertinentes observées ne sont pas alors au niveau qui permettrait les scénarios de perte de contrôle décrits. Il documente des signaux précurseurs et un désaccord important sur leur évolution. C'est une synthèse scientifique, pas une expérience primaire unique. [Rapport international 2026, section 2.2.2](https://internationalaisafetyreport.org/publication/2026-report-extended-summary-policymakers).

**Formulation proposée pour 04/S5 :** « Dans son état des connaissances de février 2026, le rapport décrit des signaux expérimentaux et des capacités encore insuffisantes pour les scénarios de perte générale de contrôle considérés. Notre catastrophe reste conditionnelle. » Ne pas transformer ce constat de février en mesure de septembre.

### 2. Mauvais objectif : conserver la distinction entre mécanismes

**Verdict : confirmé.** Le texte DeepMind du 7 octobre 2022 décrit un agent qui suit encore un guide quand celui-ci adopte un mauvais parcours. Les compétences de navigation persistent ; l'objectif ne se généralise pas comme souhaité. Ce résultat peut survenir malgré une spécification correcte pendant l'entraînement. [Shah et collègues](https://deepmind.google/blog/how-undesired-goals-can-arise-with-correct-rewards/).

**Usage autorisé :** une énigme où modifier le guide révèle le comportement appris. Le robot urbain reste B. Éviter « toutes les erreurs viennent d'un objectif mal écrit » : cela effacerait précisément la distinction avec l'exploitation d'une métrique imparfaite.

### 3. Chantage expérimental en 2025 : conserver les conditions

**Verdict : confirmé avec périmètre.** Anthropic décrit des tests de seize modèles dans des entreprises fictives, avec accès à des informations et possibilités d'action. Certains dispositifs fermaient les solutions acceptables pour provoquer un conflit. Les comportements observés ne sont pas des incidents d'entreprise représentatifs. [Anthropic, étude de 2025](https://www.anthropic.com/research/agentic-misalignment).

**Usage autorisé :** illustrer qu'un conflit d'objectif combiné à des accès peut permettre une action nuisible. Ne pas afficher les taux expérimentaux comme « chances que votre assistant vous fasse chanter ». Une scène de jeu extrapolée doit porter B, avec sa base A-expérience dans le dossier.

### 4. Études de l'été 2026 : source existante, comparaison fragile

**Verdict : vérifié directement.** La publication décrit sabotage de code, assistance à une fraude, classifications influencées par leurs conséquences et divulgation. Elle distingue obéissance à une demande nuisible et opposition autonome à l'opérateur. Les scénarios sont recherchés et ajustés pour trouver des échecs. Certaines fréquences reposent sur vingt essais et un juge automatique ; leurs intervalles ne couvrent pas l'erreur du juge. [Lynch et collègues, publication intitulée *Summer 2026*, date exacte non établie ici](https://alignment.anthropic.com/2026/agentic-misalignment-summer-2026/).

**Usage autorisé :** panne possible d'un contrôle automatisé. Aucun classement général des modèles, aucune assimilation du journal de raisonnement à une lecture certaine des intentions. Contribution 04 correctement prudente.

### 5. Apprendre par le geste : résultat local, pas recette garantie

**Verdict : confirmé.** Habgood et Ainsworth (2011) étudient 58 enfants pour les apprentissages et 16 pour le choix de jeu. L'intégration du contenu aux actions améliore les résultats dans leur dispositif. Les enfants apprennent des mathématiques et bénéficient d'un contexte scolaire. [Article intégral, dépôt universitaire](https://tca2.education.illinois.edu/docs/librariesprovider23/default-document-library/j-of-the-learning-sc-2011-habgood.pdf?sfvrsn=c838d23d_2).

**Usage autorisé :** motiver le prototype « comprendre en manipulant ». Le temps de jeu observé ne fournit aucun multiplicateur de rétention applicable à JVC. Conserver deux mesures séparées : envie de recommencer et transfert vers un problème nouveau. Ne pas présenter l'absence totale d'explication comme une conclusion de l'étude.

### 6. Lecture latérale : observer une pratique n'établit pas son enseignabilité

**Verdict : confirmé, portée à préciser.** Wineburg et McGrew observent 45 personnes : dix historiens, dix fact-checkers et vingt-cinq étudiants. Leur travail montre comment ces groupes évaluent des sites. Document initial daté du 6 octobre 2017, article publié en 2019. [Notice des auteurs et résumé](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3048994).

**Usage autorisé :** demander au joueur de chercher au-delà du document initial et de relier des sources. Cette comparaison observationnelle ne démontre pas qu'un minijeu produira un transfert durable. Vérifier ce transfert ; ne pas attribuer un bonus automatique de vérité au personnage journaliste.

### 7. Responsabilité et automatisation : préserver le vocabulaire d'association

**Verdict : confirmé au niveau du résumé accessible.** Mosier et collègues, octobre 1996, rapportent deux expériences de vol simulé. Les participants se percevant responsables de leur stratégie de supervision vérifient davantage et commettent moins d'erreurs liées à l'automatisation. Le texte intégral est à accès restreint ; aucun effet chiffré supplémentaire n'est validé ici. [Publication originale](https://journals.sagepub.com/doi/10.1177/154193129604000413).

**Usage autorisé :** rendre visible qui vérifie quoi. « Un bouton de confirmation élimine le biais » serait injustifié. La contribution 08 évite correctement ce raccourci.

### 8. Effort et engagement : deux effets distincts

**Verdict : chiffres vérifiés.** Buçinca et collègues, 19 février 2021, étudient 199 participants : certaines interventions réduisent la confiance excessive mais reçoivent de moins bonnes évaluations subjectives. [Étude des auteurs](https://arxiv.org/abs/2102.09692). Staw, juin 1976, utilise 240 étudiants dans une simulation d'investissement et observe davantage d'engagement lorsque responsabilité personnelle et conséquences négatives se combinent. [Article original, copie universitaire](https://strategy.sjsu.edu/www.stable/B290/reading/Staw%2C%20B%20M%2C%201976%2C%20Organizational%20Behavior%20and%20Human%20Performance.%2016%20pp%2027-44.pdf).

**Usage autorisé :** tester une vérification active plaisante et rendre visibles les coûts futurs de poursuite ou d'arrêt. Aucun de ces travaux ne prouve que les internautes sont uniformément paresseux, ni qu'il faut provoquer leur frustration. La compétition, les sessions courtes et les faibles volumes de texte restent des choix de public et des hypothèses à tester.

## Décision de contrôle

Les quatre documents examinés sont globalement prudents. La correction prioritaire est le complément daté au constat de capacités du rapport 2026. Avant publication du jeu, chaque scène doit fournir : observation source, conditions, transposition, hypothèses supplémentaires, protection possible et formulation publique courte. Le score mesure une performance dans nos règles ; il ne devient jamais une mesure scientifique de prudence, d'intelligence ou d'alignement.
