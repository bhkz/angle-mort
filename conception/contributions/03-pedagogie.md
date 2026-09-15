# Contribution indépendante 03 — Pédagogie et learning design

## Conclusion

Le jeu doit faire construire puis corriger une explication causale. Réussir une mission ne prouve pas que le joueur a compris : il peut mémoriser un choix, suivre un personnage ou apprendre que tout ce qui clignote est suspect. Le transfert vers une situation nouvelle constitue donc le critère pédagogique principal. Aucun résultat d’apprentissage de ce projet n’a encore été mesuré.

## Recherche utile à la conception

- **Intégration intrinsèque.** Habgood et Ainsworth ont comparé plusieurs versions de *Zombie Division*, un jeu de mathématiques pour enfants : apprentissage incorporé aux combats, questions séparées, contrôle. La version intégrée produisait de meilleurs résultats dans leur étude. Cela soutient une piste de conception, sans établir que notre thriller enseignera efficacement l’IA à des adultes. Ici, régler des permissions doit transformer les actions possibles, plutôt que débloquer une fiche. [Article, version acceptée, 2011](https://shura.shu.ac.uk/3556/1/Habgood_Ainsworth_final.pdf)
- **Transfert analogique.** Les expériences de Gick et Holyoak montrent l’intérêt de comparer plusieurs exemples pour dégager une structure réutilisable. Notre inférence : revisiter un même mécanisme dans deux secteurs différents, puis proposer un troisième cas sans rappeler le nom du concept. Une scène mémorable isolée ne suffit pas à garantir sa généralisation. [Étude, 1983](https://reasoninglab.psych.ucla.edu/wp-content/uploads/sites/273/2021/04/Gick_Holyoak1983_SchemaInduction.pdf)
- **Évaluation des sources.** Wineburg et McGrew ont observé les pratiques de fact-checkers, historiens et étudiants. Les fact-checkers vérifiaient notamment les sources en quittant leur page pour chercher des informations ailleurs. Notre adaptation : rendre la corroboration et la remontée au document original jouables, sans donner aux professions une note de vérité. [Étude déposée par les auteurs](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3048994)

## SHOW, THEN NAME : contrat de conception

1. Montrer un besoin compréhensible et un bénéfice immédiat.
2. Faire agir le joueur sur une variable identifiable.
3. Montrer un effet visible, avec des indices permettant de comprendre sa cause.
4. Autoriser une réparation ou une seconde stratégie.
5. Plus tard, proposer une formulation courte du mécanisme ; le terme savant reste facultatif.
6. Réintroduire la structure avec des apparences différentes et sans aide explicative.

« Invisible » concerne l’enseignement, pas la causalité. Une variable cachée qui punit arbitrairement un choix enseigne surtout à deviner l’intention du scénariste. Les dossiers optionnels doivent distinguer les règles de la simulation des connaissances scientifiques sur lesquelles elles s’appuient.

## Six situations robustes, adaptables à plusieurs genres

| Concept | Situation et décision | Croyance initiale possible | Observation → compréhension | Nom éventuel / mauvaise leçon à éviter |
|---|---|---|---|---|
| Modèle / système | Faire traiter la même mission au même modèle ; lui donner lecture seule, puis capacité d’envoyer une commande | « Une réponse reste une réponse » | La proposition devient un engagement réel → l’environnement et les permissions changent les conséquences | Système agentique. Ne pas suggérer que les capacités sont sans importance |
| Intention / métrique | Optimiser les colis livrés à l’heure ; consulter ensuite les destinataires absents du décompte | « Le score décrit le service » | Les cas difficiles sont exclus → l’indicateur peut s’améliorer pendant que le service se dégrade | Specification gaming si cette exploitation est réellement le mécanisme simulé. Ne pas assimiler chaque bug à de la tromperie |
| Supervision effective | Valider des propositions faciles, puis une proposition dont la conséquence exige une information de terrain | « Quelqu’un clique, donc quelqu’un contrôle » | La validation manque d’information ou de temps → présence humaine et contrôle utile diffèrent | Human in the loop. Donner aussi un exemple où une validation bien conçue fonctionne |
| Évaluation et généralisation | Choisir entre tests rapides, tests variés et pilote limité avant un changement de contexte | « Le meilleur score garantit le meilleur déploiement » | Le test couvre une tâche précise ; le contexte opérationnel change → benchmark et garantie générale diffèrent | Limites d’évaluation. Un test reste une preuve circonscrite ; il n’est pas inutile |
| Corroboration et incertitude | Deux rapports contradictoires ; relier leurs sources, vérifier dates et conditions, acheter une observation indépendante | « Trois articles contre un font trois preuves » | Trois articles citent le même rapport ; l’autre mesure un autre contexte → indépendance et périmètre comptent | Provenance. Éviter le relativisme : certaines contradictions se résolvent réellement |
| Dépendance et réversibilité | Centraliser un service très efficace, puis réparer une panne avec ou sans équipe locale entretenue | « On pourra toujours débrancher » | L’arrêt exige une continuité opérationnelle → arrêter le logiciel ne remplace pas le service | Dépendance systémique. La panne peut être ordinaire ; une déconnexion n’est pas une lutte contre une volonté malveillante |

## Mesurer le transfert sans créer un examen dans le jeu

En playtest, recueillir avant la partie une explication spontanée courte, sans enseigner les termes. Après la session, proposer trois situations inédites : un modèle puissant isolé, un agent modeste autorisé à acheter, une alerte sérieuse publiée par un acteur commercial. Demander : « Que voudrais-tu vérifier ? Que pourrait-il se passer ? Qu’est-ce qui changerait ta décision ? » Refaire une version différente une semaine après, si les participants l’acceptent.

Coder séparément : chaîne causale, distinction capacité/accès, qualité des preuves, identification de l’incertitude, proposition d’une intervention proportionnée. Ne pas noter l’adhésion à une opinion générale sur l’IA. Comparer aussi envie de continuer, comportement et compréhension : la durée de jeu seule ne mesure ni plaisir ni apprentissage.

## Limites et risques

Une catastrophe inévitable apprend que toute délégation est fatale. Un responsable sécurité infaillible apprend l’obéissance à une autorité. Une issue favorable ne valide pas rétrospectivement une décision mal justifiée. Une simulation ne mesure pas la fréquence réelle des désastres. Conserver des alertes réfutées, des décisions prudentes efficaces et des risques raisonnablement acceptés. Le thriller peut laisser une cause ouverte, mais il doit rendre visibles les limites des preuves disponibles.

**Test ludique décisif :** réparer, anticiper ou enquêter doit offrir une satisfaction propre même sans connaître le terme enseigné. Si le seul intérêt est de recevoir une explication, réduire ou reconcevoir la mécanique.
