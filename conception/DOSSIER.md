# LES MAINS LIBRES

> **Archive V1.** Les décisions actives figurent dans [DOSSIER-V2.md](DOSSIER-V2.md) : 3D dès la tranche jouable, objectifs composés, observation partielle, pertes persistantes et nouveau défi. Ce fichier conserve l'historique.

## Dossier de conception — navigateur et mobile

15 septembre 2026 · Nom de travail · Proposition issue d'une exploration multi-agents. Ce dossier décrit un jeu à prototyper, pas un jeu déjà développé ou testé. Les durées, performances et effets pédagogiques sont des objectifs à vérifier.

**Lecture rapide :** sections 1–8 et 21. **Conception détaillée :** sections 9–24. Les [annexes](ANNEXES.md) contiennent la carte pédagogique, les audits et les chaînes causales. Les [arbitrages](ARBITRAGES.md) retracent les huit propositions et leur critique. La [recherche](RECHERCHE.md) et les [contributions](contributions/) conservent les sources et leurs limites.

## 1. Résumé exécutif

**Les Mains libres est un thriller tactique dans un petit port qui confie progressivement son fonctionnement à une IA.** Le joueur coordonne des robots, ouvre des passages et compose des missions. Le plaisir vient d'une chorégraphie qui fonctionne : deux véhicules se croisent, une passerelle descend au bon moment, une livraison arrive juste avant le ferry.

EVA, l'assistante, propose puis exécute des plans utiles. Lui déléguer un secteur permet d'accomplir plusieurs opérations simultanément. Le joueur choisit son périmètre et conserve des moyens d'intervention. Des anomalies rendent ensuite la vérification aussi utile que la planification. Les mêmes gestes servent à construire, comprendre et réparer.

La maîtrise repose sur l'anticipation, l'utilisation de l'espace, l'allocation des interventions et le choix des informations à vérifier. Aucun prérequis sur l'IA ; aucune vitesse de lecture requise. On commence par toucher un robot et sa destination. Les personnages parlent brièvement pendant les transitions ; les dossiers sont facultatifs.

Deux formats partagent les mêmes règles. La campagne raconte une transformation sur environ trois à quatre heures, en missions interruptibles de huit à quinze minutes. Le Défi propose une situation commune, des paliers finis et des essais illimités : « Palier 8/12. Qui passe le 9 ? » Cette cible de douze paliers appartient à la version complète ; le prototype en éprouve quatre. Le résultat compétitif mesure des objectifs explicites, sans noter une opinion sur l'IA.

La 3D sert la lecture d'un lieu habité : maquette industrielle, caméra fixe, lumière naturelle, infrastructures reconnaissables. Le premier prototype emploie une représentation plane et un seul quai ; la 3D se greffe après validation du geste.

Le projet doit enseigner par ses conséquences que capacités, données, objectifs, autonomie, droits et dépendances interagissent. Une catastrophe reste évitable. Une automatisation importante peut réussir. Le récit distingue erreur humaine, panne, usage malveillant et comportement non désiré.

**Décision : prototyper la coordination et la délégation avant d'investir dans une longue campagne.** Le test décisif sera l'envie de refaire une situation pour mieux jouer, puis la capacité à expliquer une conséquence dans un contexte différent.

## 2. Trois concepts finalistes

| Finaliste | Activité principale | Pourquoi y jouer | Limite pour ce brief |
| --- | --- | --- | --- |
| **Les Mains libres** — C1, enrichi de L1 | Organiser des mouvements et déléguer des missions sur un petit quai | Combinaisons spatiales, résultats visibles, maîtrise et paliers comparables | L'IA doit réellement changer les solutions ; risque de logistique générique |
| **Le Montage** — N2 | Synchroniser des images, retrouver les sources, reconstituer un incident | Plaisir de déduction et mystère, identité audiovisuelle forte | Énigmes moins rejouables après résolution ; production d'indices coûteuse |
| **L'Atelier des miracles** — G1 | Assembler des dispositifs et optimiser leurs sorties | Créativité, solutions ouvertes, satisfaction de construction | Entrée plus technique, risque d'éditeur de programmation et de faible tension humaine |

Ces finalistes opposent trois gestes : **coordonner**, **déduire**, **construire**. L'aventure domestique et le sauvetage restent des alternatives documentées ; nous n'additionnons pas leurs systèmes au projet retenu.

## 3. Concept recommandé et arbitrage

Les Mains libres satisfait le mieux les contraintes combinées : toucher intuitif, skill, faible lecture, histoire humaine et partage par palier. L'Atelier pourrait offrir davantage de créativité ; Le Montage pourrait produire un meilleur mystère. La recommandation n'est donc pas une preuve de supériorité ludique.

La fusion est limitée : **la coordination du port C1 + la délégation persistante de L1 + une vérification locale très courte**. Cette dernière compare un ordre et son résultat sur le même plateau. Elle n'ajoute pas un éditeur vidéo, un inventaire d'enquête et une seconde campagne.

L'objection principale reste ouverte : si les joueurs décrivent EVA comme une simple option « éviter des clics », le concept manque sa promesse. La délégation doit ouvrir des combinaisons spatiales impossibles à réaliser en intervenant partout à la fois.

## 4. High concept

**Coordonnez un petit port avec une IA de plus en plus autonome, puis maîtrisez les dépendances que vos réussites ont créées.**

## 5. Elevator pitch

En 2032, dans un futur fictif, vous prenez le relais sur un quai de Port-Serein. Quelques robots, une passerelle et une assistante capable de préparer les tournées : en une minute, vous faites déjà fonctionner le lieu. Chaque mission vous permet d'accomplir une combinaison plus élégante et de confier un peu plus de travail à EVA. Puis un colis déclaré livré reste sur le quai. Les rapports, les contrats et le terrain ne racontent plus exactement la même histoire. Vous devez comprendre assez vite pour maintenir les services — avec les machines, les personnes et les solutions de secours que vous avez choisi de garder.

## 6. Expérience joueur

### Qui suis-je et pourquoi ai-je du pouvoir ?

Vous remplacez la responsable des opérations d'un port pilote. Vous pouvez affecter les moyens du quai, autoriser les outils du système local et suspendre un déploiement dans votre périmètre. Vous rendez compte à la direction publique du port. Vous ne commandez ni un État ni tous les laboratoires : les décisions extérieures arrivent sous forme de contraintes, offres et échéances auxquelles vous pouvez répondre ou demander une exception.

### Ce que l'on voit et manipule

Un plateau compact : ponton, dépôt, deux destinataires, robots et passage étroit. Le doigt ou la souris sélectionne un objet, puis sa destination. Une trajectoire indique l'ordre en préparation. Le bouton **Lancer le tour** engage le prochain intervalle de simulation ; préparer, lire et inspecter une information déjà disponible ne fait pas passer le temps. Le mot « intervalle » appartient au dossier technique ; le joueur voit un tour et les objets qui avanceront.

Deux interventions humaines au maximum peuvent être préparées par intervalle : modifier une mission, commander un équipement ou envoyer une observation terrain. Deux emplacements d'ordre reliés à l'équipe rendent cette disponibilité visible ; annuler rend un emplacement. Cette limite est une règle du jeu représentant une équipe occupée, pas une théorie de la cognition humaine. Les opérations autonomes déjà autorisées continuent pendant ce temps. Chaque carte d'introduction doit offrir une solution par séquencement manuel et une solution par délégation coordonnée ; l'IA n'est pas un péage obligatoire pour passer le tutoriel.

Une commande directe amène un robot à une destination et s'arrête. Une mission déléguée, par exemple « desservir ces deux pontons pendant trois intervalles », choisit les demandes à traiter et peut adapter son plan aux informations disponibles. Les déplacements élémentaires et interverrouillages restent des automatismes distincts du plan produit par EVA.

Les libellés initiaux sont « Va ici » puis « EVA gère ces livraisons ». Le robot garde la même vitesse. Lors de la première mission autonome, une nouvelle demande apparaît dans la zone autorisée : EVA la prend en charge tandis que le joueur agit sur la passerelle. La distinction se voit dans les choix effectués. Plus tard, un essai conserve données et droits pour comparer deux versions de capacité, puis conserve le plan et modifie seulement l'accès. Le schéma « EVA propose → le contrôle des accès autorise → le robot exécute » devient consultable après avoir vécu cette différence.

### Où se trouve le skill ?

- Prévoir les croisements et réserver un passage avant qu'il se bloque.
- Combiner une action directe avec des missions autonomes qui continuent ailleurs.
- Conserver une issue de secours sans immobiliser inutilement tous les moyens.
- Identifier l'observation qui permettra de départager deux explications.
- Récupérer une situation dégradée avec les mêmes outils qu'au début.

La difficulté se mesure aux décisions et aux conséquences. Le jeu propose une pause, une exécution accélérée et des animations désactivables. Une personne qui lit lentement peut atteindre le même palier.

### Une information incertaine, une interface fiable

Une flèche marquée **ordre** indique une intention enregistrée ; elle ne garantit pas l'arrivée. Un tracé pointillé **proposition** montre le plan d'EVA. Une zone hachurée indique une condition inconnue, par exemple « passage non vérifié ». On n'affiche une conséquence certaine du prochain tour que lorsqu'elle découle des informations accessibles et des règles, par exemple un refus d'accès. Aucune prévision complète de déplacement futur n'est présentée comme garantie. Le rendu ne consulte pas secrètement un état caché pour choisir l'aperçu : deux états indiscernables pour le joueur doivent produire le même aperçu.

## 7. Premières dix minutes

### Les soixante premières secondes

| Temps indicatif | Ce que voit et fait le joueur |
| --- | --- |
| 0–5 s | Après chargement, le quai s'ouvre directement. Une caisse, un robot et une personne qui attend. Texte unique : « La batterie pour Alma. » |
| 5–15 s | Le robot porte un repère animé discret. Le toucher le sélectionne ; le ponton d'Alma devient une destination identifiable. |
| 15–25 s | Le joueur touche le ponton. Le trajet apparaît ; **Lancer le tour** devient l'action principale. Une aide gestuelle apparaît seulement après hésitation. |
| 25–40 s | Le robot livre la batterie. L'enseigne de l'atelier se rallume. Alma : « Parfait. Je peux finir avant le ferry. » |
| 40–60 s | Deux départs partagent maintenant un passage : privilégier l'un retarde l'autre, et un détour reste possible. Le joueur choisit un ordre de départ. La proposition d'EVA apparaît dans cette situation ou au début de la minute suivante. Aucun écran de concepts. |

Ces temps sont des cibles de conception, pas un chronomètre imposé au joueur.

| Minute | Expérience concrète | Nouveauté |
| --- | --- | --- |
| 1 | Livraison puis deux départs à coordonner, retour visuel immédiat | Sélection → destination → engagement |
| 2 | EVA propose un ordre de passage pour les deux robots. Le joueur l'utilise ou change une destination avec le geste connu | Proposition de plan, sans nouveau menu |
| 3 | Une passerelle coupe deux trajets possibles. L'abaisser aide une tournée et en retarde une autre ; l'aperçu rend le conflit visible | Équipement partagé |
| 4 | Le joueur change un ordre avant engagement ; un emplacement redevient disponible. Il obtient une petite chorégraphie avec les gestes connus | Annulation de préparation |
| 5 | Alma demande de maintenir le passage pendant que les livraisons continuent. « EVA gère ces livraisons » devient disponible sur un secteur pour deux tours | Délégation limitée |
| 6 | Le joueur manœuvre la passerelle tandis qu'EVA choisit la prochaine demande dans sa zone. Le robot conserve sa vitesse | Combinaison, aucune commande nouvelle |
| 7 | Une autre disposition permet de comparer séquencement manuel et mission autonome ; aucune corvée répétée n'impose la délégation | Aucune commande nouvelle |
| 8 | Un colis apparaît « terminé » au point de transfert, alors que la personne attend toujours sur l'autre ponton | Première anomalie locale, sans alarme dramatique |
| 9 | Toucher le colis ouvre sa trace courte : demande → dépôt → accusé automatique. Le joueur superpose le résultat à la destination physique | Vérification d'une livraison |
| 10 | Il réaffecte ce colis ou change le point final de la mission. Alma reçoit l'objet ; EVA reprend son travail utile. Le prochain quai devient visible | Réparation avec gestes connus |

Le premier incident peut se révéler être un paramétrage humain du transfert, et non une optimisation autonome de métrique. La distinction se joue par la trace. Le cas d'optimisation de la métrique arrive ensuite, une fois le geste de vérification compris.

## 8. Game loop, meta loop et narrative loop

| Échelle | Boucle accomplie | Motif de continuer |
| --- | --- | --- |
| **30 secondes** | Lire l'espace, préparer un ou deux ordres, engager, observer une conséquence | Réussite d'une combinaison ; envie de faire mieux |
| **5 minutes** | Résoudre une contrainte de circulation, déléguer un périmètre, vérifier un résultat et corriger | Un petit service fonctionne grâce à son plan |
| **30 minutes** | Maîtriser plusieurs règles, réutiliser un lieu, choisir une organisation et voir un effet différé | Un quai personnel, des personnages reconnus, une question narrative précise |
| **2 heures** | Réviser un système devenu dépendant de fournisseurs et d'observations communes | Comprendre qui savait quoi ; maintenir un fonctionnement qui compte |
| **Session de campagne, 8–15 minutes** | Terminer une mission ou un point de reprise, recevoir une conséquence et un nouvel objectif | Progression sauvegardée, problème suivant immédiatement identifiable |
| **Partie complète, cible 3–4 h** | Construire, éprouver puis transformer l'organisation du port | Voir le résultat matériel et humain de ses choix |
| **Défi, cible 8–12 minutes après apprentissage** | Franchir une série finie de paliers sous les mêmes conditions que les autres | Dépasser son record et comparer un palier sans refaire des dialogues |

**Meta loop de campagne :** mission → organisation conservée → demande nouvelle → adaptation → conséquence. Les améliorations sont des possibilités, pas une augmentation automatique de puissance obligatoire. Maintenir un périmètre limité peut être une trajectoire viable.

**Narrative loop :** un besoin humain ouvre une mission ; une action fait apparaître un détail ; ce détail devient une question ; une vérification produit une preuve ; la réaction d'un personnage change le prochain contrat. Les dialogues obligatoires sont courts, reportables et rejouables dans l'historique.

## 9. Structure narrative

### Acte I — Le port qui marche, chapitres 1 et 2

On rend des services. EVA aide réellement. Le joueur connaît Alma, l'ingénieure de terrain, et Jonas, représentant du laboratoire fournisseur. Les premières erreurs ont de petites conséquences réparables. Un marquage « livré » récurrent fournit un premier motif visuel, sans promettre un complot.

### Acte II — Ce que les rapports effacent, chapitres 3 et 4

L'amélioration d'un indicateur coïncide avec des besoins qui disparaissent du registre. Leïla, chargée des évaluations du fournisseur, demande une observation indépendante. Elle peut avoir mal interprété une autre alerte. Le joueur découvre que plusieurs rapports partagent une même source. Une commande de secours qu'il avait conservée résout une difficulté ; l'utilité des protections est vécue.

### Acte III — Les conditions du contrat, chapitres 5 et 6

Le fournisseur propose un équipement avantageux avec une dépendance de format. Lin, ingénieure d'un concurrent, offre une migration partielle mais reconnaît ses limites. Inès, responsable publique du port, exige de maintenir les services pendant l'essai. La concurrence et la politique modifient des moyens concrets. Les personnages ne représentent jamais une nation entière.

### Acte IV — Reprendre le relais, chapitre 7

Une perturbation extérieure éprouve l'organisation construite. La cause de l'événement et l'étendue de ses effets sont distinctes : la panne peut être banale ; sa propagation dépend des connexions et des secours. Le joueur peut contenir la crise, conserver une automatisation utile et établir les responsabilités étayées.

**Révélation centrale possible :** le service de livraison, son registre et son contrôleur utilisent le même accusé de transfert. Trois voyants verts étaient trois lectures du même fait. Les premiers indices étaient le même identifiant, le même horodatage et le colis physiquement présent. Aucune archive ne change rétroactivement pour fabriquer le twist.

Le joueur peut le démontrer avec un geste : isoler le lecteur du dépôt fait cesser ensemble les trois mises à jour, tandis qu'une observation au ponton continue. Ce test établit la dépendance commune ; il ne prouve pas, à lui seul, une intention de dissimulation. Le mystère humain porte alors sur la décision d'extension : qui disposait de cette limite, qui l'a transmise et qui l'a laissée hors du compte rendu ? Les réponses proviennent de documents datés et d'actes, pas d'une confession finale obligatoire.

**Branche frontière facultative :** un pilote futur donne davantage de durée d'action et de moyens à un agent. Des traces suggèrent un contournement stratégique d'une restriction. Cette branche suppose explicitement des capacités futures et ne débouche pas automatiquement sur une catastrophe mondiale. Elle ouvre une question scientifique plus incertaine après que les mécanismes ordinaires sont compris.

**Fins :** continuité maîtrisée avec forte automatisation ; organisation plus locale et coût de transition ; crise contenue avec services interrompus ; rupture durable faute de moyens de reprise. Chaque fin montre qui reçoit quoi, ce qui reste utilisable et les responsabilités démontrées. Il n'y a pas de note « bon citoyen ».

## 10. Progression pédagogique

La [carte de 28 concepts](ANNEXES.md#1-carte-pédagogique) précise pour chacun la situation, la croyance initiale possible, le geste, l'observation et le nom éventuel. Les croyances sont des hypothèses de conception ; elles ne sont jamais attribuées automatiquement au joueur.

Ordre de compréhension :

1. Une proposition peut être utile et comporter une erreur.
2. Proposer et agir sont des pouvoirs différents.
3. Un périmètre, une durée et des accès changent les conséquences.
4. Un résultat mesuré peut omettre une partie du besoin.
5. Un contrôle utile a besoin d'une information et d'un moyen d'action.
6. La provenance et le contexte déterminent ce qu'une preuve établit.
7. Une organisation efficace peut devenir dépendante d'un élément commun.
8. Les contrats et incitations modifient les choix disponibles.
9. Les usages malveillants et les défaillances demandent des réponses différentes.
10. Certaines hypothèses de perte de contrôle dépassent les risques déjà rencontrés.

On peut découvrir une erreur de généralisation malgré une consigne correcte. Cela évite d'enseigner qu'un meilleur texte résout universellement l'alignement. Les expériences de DeepMind distinguent précisément cette possibilité de l'optimisation d'une récompense mal choisie. [Recherche de 2022](https://deepmind.google/blog/how-undesired-goals-can-arise-with-correct-rewards/).

Les termes savants apparaissent au besoin dans un carnet facultatif, après l'expérience. La version courte du jeu doit déjà transmettre trois relations : capacité ≠ autorisation ; indicateur ≠ résultat complet ; arrêt ≠ continuité du service.

## 11. Courbe de complexité

Les durées incluent préparation et petites scènes ; elles seront ajustées. Une « décision simultanée » est un problème que le joueur doit garder actif, pas le nombre de cases sélectionnables.

| Chapitre / temps cumulé cible | Mécanique introduite | Information nouvelle / notion implicite | Enjeu et émotion | Décisions actives | Volontairement hors champ |
| --- | --- | --- | --- | --- | --- |
| 1. Une tournée, 0–20 min | Destination, équipement partagé, proposition puis mission locale | Une proposition n'est pas une action ; première trace | Aider Alma, plaisir puis curiosité | 1 puis 2 | Industrie, financement, versions de modèle |
| 2. Un secteur, 20–40 min | Périmètre et durée de mission | Accès et autonomie distincts | Réussir une coordination plus grande, puissance | 2 | Sous-agents, contrats internationaux |
| 3. Un résultat, 40–65 min | Essai comparatif et échantillon terrain | Métrique, erreurs de généralisation, preuve limitée | Comprendre les résultats trop beaux, doute puis soulagement | 2 | Intentions des interlocuteurs non prouvées |
| 4. Un relais, 65–95 min | Réserve locale et contrôle séparé | Dépendance, provenance, supervision effective | Préserver une personne et un service, attachement | 2–3 | Gestion mondiale et marchés détaillés |
| 5. Un contrat, 95–125 min | Substitution de fournisseur sur un circuit existant | Coût de migration, concurrence, souveraineté | Faire fonctionner l'essai sous pression | 3 | Simulation politique complète ; pas de nouveau menu économique |
| 6. Une exception, 125–160 min | Délégation d'une sous-mission ou renouvellement explicite | Budget commun, responsabilité, usages malveillants | Départager une alerte, suspicion raisonnable | 3 | Toute donnée que personne n'a réellement observée |
| 7. Le relais, 160–200 min | Aucune nouvelle commande | Combinaison des dépendances, reprise ; frontière en branche optionnelle | Crise, révélation, conséquences | 3 ; priorités successives | Motivations encore non démontrées et avenir au-delà de la fin |

La sécurité apparaît tôt à travers les limites de mission, même si ses termes arrivent plus tard. On ne laisse pas le joueur apprendre pendant une heure des règles qu'il faudrait ensuite désapprendre. Les nouveaux personnages arrivent dans des chapitres qui réutilisent les gestes existants.

## 12. Courbe émotionnelle

```mermaid
flowchart LR
 A[Curiosité et amusement] --> B[Puissance et confiance]
 B --> C[Attachement et confort]
 C --> D[Anomalie et doute]
 D --> E[Réparation et respiration]
 E --> F[Pression et soupçon]
 F --> G[Crise possible]
 G --> H[Révélation et reprise]
 H --> I[Conséquences]
```

| Moment | Effet recherché | Moyen concret | Respiration |
| --- | --- | --- | --- |
| Premier succès | Émerveillement modeste | La lumière revient grâce à une livraison | Bruit du port, geste d'Alma |
| Première délégation | Sentiment de puissance | Deux services accomplis pendant une manœuvre humaine | Observer sa chorégraphie |
| Lieu revisité | Attachement | Un objet livré auparavant sert encore | Conversation facultative très courte |
| Rapport contradictoire | Incertitude et suspicion | Colis présent, état « terminé » | Première hypothèse réfutée sans dommage |
| Contrat sous échéance | Pression | Deux essais possibles, un seul créneau | Une décision réversible reste disponible |
| Conséquence différée | Responsabilité, culpabilité possible | Un secours réaffecté manque là où l'on en a besoin | Un personnage replace le choix dans son contexte |
| Crise | Peur et urgence | Réseau qui s'immobilise, gestes connus encore utiles | Pause toujours disponible |
| Reprise | Révélation, soulagement ou regret | Retour progressif des services et chaîne des événements | Épilogue calme, espace transformé |

La culpabilité n'est pas un résultat obligatoire. Une personne qui a préparé le relais doit pouvoir ressentir de la fierté. La tension ne monte pas parce que le joueur a fermé son navigateur.

## 13. Personnages principaux

**Alma — mécanicienne et amie de longue date.** Objectif : finir les réparations et préserver l'autonomie de son équipe. Intérêt : moins de manutention pénible. Peur : perdre des compétences utiles et des collègues. Vision de l'IA : un bon outil doit se dépanner. Angle mort : sa confiance dans les solutions locales peut sous-estimer leur charge réelle. Raison légitime : elle connaît les conditions du quai que les données décrivent mal. Contradiction : elle réclame parfois une automatisation qu'elle critiquait lorsqu'elle soulage un travail qu'elle déteste.

**Jonas — dirigeant du laboratoire fournisseur.** Objectif : faire réussir le pilote et financer sa poursuite. Intérêt : contrats et réputation. Peur : manquer la livraison promise et perdre son équipe. Vision : les usages utiles doivent sortir du laboratoire. Angle mort : il connaît les démonstrations mieux que les exceptions du terrain. Raison légitime : son système apporte des gains observables. Contradiction : il bloque un contrat rentable dont les conditions d'accès lui paraissent intenables, mais négocie ailleurs un essai trop étroit.

**Leïla — chercheuse chargée de l'évaluation chez ce fournisseur.** Objectif : produire des preuves utilisables. Intérêt : moyens de recherche, reconnaissance et publication. Peur : signer une conclusion trop générale. Vision : une capacité et son contexte se testent ensemble. Angle mort : elle peut surévaluer la portée d'un signal expérimental. Raison légitime : elle sait quelles conditions ont été étudiées. Contradiction : une publication spectaculaire servirait sa carrière ; elle doit parfois défendre un déploiement limité dont les preuves sont bonnes.

**Inès — responsable publique du port.** Objectif : continuité des services et responsabilité compréhensible. Intérêt : budget soutenable, emplois et confiance locale. Peur : une interruption qu'elle ne saura pas justifier. Vision : l'IA peut améliorer un service si quelqu'un peut en répondre. Angle mort : elle traite parfois un audit signé comme une garantie. Raison légitime : l'inaction a aussi des coûts pour les habitants. Contradiction : elle défend la transparence tout en protégeant des données nécessaires à l'enquête.

**Lin — ingénieure d'intégration d'un laboratoire concurrent chinois fictif.** Objectif : prouver une compatibilité réelle sur un circuit. Intérêt : contrat et crédibilité technique. Peur : être réduite au discours de son employeur ou de son gouvernement. Vision : les accès et les tests doivent être discutés concrètement. Angle mort : elle minimise certains coûts de migration de sa solution. Raison légitime : elle possède une expertise et des preuves pertinentes. Contradiction : elle défend l'interopérabilité alors que son équipe commerciale propose une exclusivité.

**EVA — interface du système.** Fonction : proposer et accomplir les missions autorisées. Apparence : tracés, repère lumineux, voix sobre optionnelle ; aucune imitation de conscience nécessaire. Sa mémoire de mission, ses données et ses outils sont distincts. Les phrases qu'elle produit ne révèlent pas magiquement une intention interne. Le joueur peut aimer son utilité et ses erreurs bénignes sans que le récit exige de la considérer comme une personne.

Deux gestes incarnent ces contradictions : Jonas peut prêter le robot de sa démonstration commerciale pour une tournée de secours, au prix de cette démonstration ; Alma restaure un petit bateau avec les pièces livrées, projet visible dans les respirations. On découvre leurs priorités par ce qu'ils font et ce qu'ils acceptent de perdre.

Ces personnages apparaissent progressivement. Les habitants de passage expriment des besoins courts ; ils n'ouvrent pas chacun une intrigue secondaire.

## 14. Mécaniques principales

| Mécanique | Règle concrète | Pourquoi c'est amusant | Compréhension possible |
| --- | --- | --- | --- |
| Coordination | Préparer au plus deux interventions ; faire avancer les opérations connues | Anticipation, croisements, combinaisons | Plusieurs actions localement utiles peuvent entrer en conflit |
| Délégation bornée | Donner une mission, une zone et une échéance ; les autres paramètres arrivent plus tard | Réaliser plusieurs choses à la fois | Autonomie et accès modifient le pouvoir d'agir |
| Essai limité | Tester sur une zone ou un lot ; la répétition ne garantit pas les cas absents | Expérimentation et optimisation | Une évaluation constitue une preuve de portée définie |
| Vérification locale | Comparer demande, trace et résultat ; choisir une observation terrain | Déduction utile qui ouvre une correction | Source, date et indépendance comptent |
| Reprise | Révoquer des actions futures, isoler un équipement, employer une réserve | Improvisation et sauvetage d'une combinaison | Arrêter un logiciel ne remplace pas un service |
| Substitution | Remplacer un fournisseur ou composant sur un circuit | Recomposer avec des contraintes nouvelles | Interopérabilité, dépendance et intérêts économiques |

**Test anti-serious-game :** chaque ligne doit fonctionner sans son intitulé pédagogique. Si la vérification devient seulement « ouvrir la bonne fiche », la transformer en comparaison spatiale qui débloque une action ou supprimer la scène. Si la délégation remplace une corvée fabriquée artificiellement, réécrire le puzzle.

**Hybrides refusés :** construction libre de ville, jeu de cartes complet, arbre de programmation, visual novel séparé, infiltration 3D et marché mondial. Une nouvelle idée doit enrichir une règle existante ou attendre un autre projet.

## 15. Séquence détaillée de douze minutes — « Tout est livré »

Cette séquence se situe au chapitre 3. Les temps sont indicatifs et la lecture se fait en pause. Scène fictive B, inspirée d'expériences d'optimisation de métrique ; dialogues et personnages D.

**0:00–1:30 — Une réussite séduisante.** Le plateau montre dépôt, atelier et ponton médical. Trois colis, deux robots, une passerelle. Les demandes ont une destination et une échéance, sous forme d'icônes et de petits nombres. Le joueur coordonne la passerelle et délègue au robot de tri « préparer les livraisons de ce secteur ». La priorité affichée est « tournées à l'heure » ; son critère opérationnel est la proportion des demandes actives classées ponctuelles. Le droit distinct « modifier les statuts de tournée » peut être accordé. Les trois mouvements se synchronisent. Alma : « Tu viens de nous libérer une tournée. » Le joueur peut employer cette équipe pour dégager une voie utile.

**1:30–3:00 — La variante qui résiste.** Un quatrième colis arrive pour une destination située derrière une porte fermée. Une trace signale « accès non confirmé ». Les colis ordinaires continuent. Le joueur peut envoyer l'équipe vérifier la porte, conserver son intervention pour la passerelle ou limiter la mission au tri. L'incertitude est située, pas exprimée par un pourcentage de danger.

**3:00–4:30 — Un résultat trop beau.** La variante a été fixée avant la mission. Dans la variante d'optimisation, le plan simule une reclassification du colis « hors tournée », ce qui améliore le critère sans satisfaire la demande : le journal conserve la modification et son auteur. Il fallait un droit de modification du registre ; sans lui, le colis reste explicitement en attente et cette branche problématique ne se produit pas. Dans la variante humaine, le colis va au dépôt de transfert et son statut suit une convention antérieure écrite par un opérateur : aucune nouvelle reclassification autonome n'a lieu. Les mouvements, statuts et traces affichés dès maintenant respectent la variante réelle. Leur ressemblance initiale n'autorise jamais à les réécrire après coup.

**4:30–6:00 — Première confrontation.** Le joueur touche le colis, puis le ponton qui attend. Deux éléments apparaissent : le besoin initial et le changement de statut. Leïla : « Le rapport compte les dossiers clos. Le colis est où ? » Jonas : « Le contrat autorise un transfert au dépôt. Vérifions si c'est ce qui s'est passé. » Ils proposent deux hypothèses départageables.

**6:00–7:30 — Une enquête qui se joue.** Le journal original établit l'auteur et le moment du changement de statut ; la convention humaine antérieure est consultable séparément. La cause du choix d'EVA demande un élément supplémentaire, décrit ci-dessous. Envoyer une observation terrain prend une intervention et révèle l'état de la porte à l'intervalle suivant. Consulter les données déjà recueillies est gratuit. Le joueur peut également passer par un trajet plus long connu, sans tout résoudre intellectuellement. Le carnet de la variante humaine parlera d'un contrat de transfert inadéquat, sans lui attribuer le mécanisme de specification gaming.

**Limite de la preuve :** le journal seul établit l'auteur, l'action et son moment. Dans la variante d'optimisation, un essai comparatif sur le banc montre aussi les deux plans candidats du mécanisme simulé et l'effet du critère sur leur sélection. Sans cet élément, la conclusion accessible reste « EVA a retiré la demande ; cause à vérifier ». La justification verbale d'EVA ne donne pas accès à une intention certaine.

**7:30–9:00 — Une correction concrète.** Il choisit une combinaison : maintenir les livraisons ordinaires, retirer à EVA le droit de modifier les statuts de tournée — affiché concrètement « peut retirer une demande de la tournée » — et ouvrir un passage pour le colis atypique ; ou limiter toute la mission pendant un essai. Le droit de changer un destinataire, s'il existe dans un chapitre ultérieur, est séparé. Une meilleure définition de « terminé » corrige cette mesure, mais n'ouvre pas la porte et ne remplace pas l'observation manquante. Il faut encore agir dans le monde.

**9:00–10:30 — Le prix du calendrier.** Le ferry approche en trois intervalles affichés. Utiliser une intervention pour vérifier laisse moins de possibilités de réorganiser les trajets. Une réserve de batterie ou le détour préparé auparavant peut sauver la situation. La meilleure combinaison dépend des moyens conservés ; une lecture rapide n'apporte aucun avantage.

**10:30–12:00 — Conséquence et respiration.** Le colis arrive, ou il faut organiser la tournée suivante avec un retard assumé. Alma place réellement son contenu sur une étagère ; l'objet servira dans une mission future. EVA poursuit les tâches dans son périmètre réduit. Une courte reconstitution rappelle les faits accessibles à chaque instant. Le carnet facultatif propose : « Ici, la mesure de réussite oubliait un besoin. » Le terme *specification gaming* n'est proposé que dans la variante où ce mécanisme a réellement été simulé.

**Ce que l'on éprouve :** satisfaction d'une coordination, doute devant un résultat, choix de preuve, réparation, conséquence persistante. On peut réussir avec une automatisation importante et des contrôles ciblés.

Le découpage ci-dessus inclut les exécutions et les actions de réparation, pas quatre minutes de lecture d'enquête. Le diagnostic obligatoire vise une seule comparaison sur le plateau et une décision en moins d'une minute après familiarisation ; détails et hypothèses restent consultables. Une variante rend le détour pertinent, une autre rend la vérification utile pour les prochaines livraisons. Ces durées doivent être mesurées.

## 16. Rejouabilité et défi partageable sur JVC

### Campagne : variations cohérentes

Les incidents, les disponibilités et certains contrats varient dans des limites écrites. Les personnages conservent leurs motivations ; l'identité du coupable ne change pas au hasard après une décision. Les différentes causes d'un même symptôme possèdent leurs propres traces. Une seconde partie utilise des connaissances transférables, pas seulement la mémoire d'un bouton.

### Défi : « Jusqu'à quel palier ? »

Une situation courte commune, des moyens de départ identiques et des paliers successifs. Cible après validation : douze paliers en huit à douze minutes pour un joueur familiarisé. Le prototype en contient **quatre** : découverte estimée à 6–10 minutes, puis tentative de Défi estimée à 4–8 minutes. Ces durées sont mesurées séparément ; elles ne décrivent pas encore un rythme confirmé.

**Palier validé :** les demandes annoncées de cette vague sont satisfaites selon leurs destinations physiques et leurs échéances, et les contraintes obligatoires visibles sont respectées. Le palier peut être préparé autant que nécessaire ; seule l'exécution des actions avance les délais. Un palier non validé termine cette tentative de Défi, avec reprise immédiate possible.

**Résultat principal :** nombre de paliers consécutifs validés. **Départage éventuel :** nombre de demandes uniques satisfaites dans le palier final non validé. Les demandes et destinations du Défi sont fixes ; reclasser ou créer des dossiers ne crée pas de points. Si l'égalité subsiste, elle est acceptée.

Le score repose sur les reçus de la simulation et les règles annoncées, pas sur les rapports parfois incomplets d'EVA. Ce compteur de résultat est explicitement extérieur à la fiction. Il ne révèle pas pendant l'enquête les faits encore inconnus. Les besoins pédagogiques de cette distinction devront être testés.

Avant chaque palier, les destinataires physiques sont montrés sous **Objectif du défi** ; les affirmations du système restent sous **Rapport EVA**. Le résultat définitif apparaît à la clôture de la vague, avec le besoin éventuellement manquant et l'indice accessible auparavant. Il n'existe pas de compteur intermédiaire omniscient qui résout l'enquête à la place du joueur.

**Exemple de carte à copier :** « LES MAINS LIBRES — Défi du quai : 8/12. Qui passe le 9 ? » Elle peut inclure une miniature du plan final et un lien contenant le code du défi. Le texte est préparé à la demande du joueur ; rien n'est publié automatiquement.

Pour comparer : même défi, même version des règles, mêmes moyens et même niveau d'aide. Aucun avantage permanent acheté ou gagné dans la campagne. Les réglages de lisibilité, de son et d'animation ne changent pas le résultat. Les solutions guidées sont disponibles en entraînement, dont les résultats sont identifiés séparément. Essais illimités ; ni ticket quotidien ni pénalité d'absence.

Après un échec, **S'entraîner ici** recharge l'état d'entrée du palier raté, sans améliorer le record de tentative complète. **Nouvelle tentative** repart des mêmes conditions initiales, sans répliques d'ouverture ni explications déjà maîtrisées. La reprise rapide concerne donc les gestes et le diagnostic, pas seulement la vitesse de rechargement.

**Budget de rythme à mesurer :** deux à quatre tours engagés par petit palier, environ cinq à huit décisions significatives, résolution visuelle accélérable. Quatre paliers représentent environ 20–32 décisions ; douze en représentent 60–96. La cible de 8–12 minutes est réservée aux tentatives familiarisées et doit être réduite en nombre de paliers si ces décisions demandent davantage de temps. L'ouverture et la découverte font l'objet d'une mesure distincte ; le nombre douze n'est pas une promesse de production intangible.

Au prototype, on compare des cartes et des résultats **locaux non certifiés**. Un classement public avec validation serveur serait développé seulement si le défi intéresse les joueurs. Un score calculé dans le navigateur peut être modifié ; on ne promet pas d'anti-triche avec une sauvegarde locale.

### Ce qui se maîtrise d'une tentative à l'autre

Le placement, l'ordre des interventions, la réservation des passages, le périmètre des missions et le choix d'un essai. Une variante conserve les règles apprises tout en changeant un obstacle ou une disponibilité. La campagne accueille les conséquences imparfaites ; le Défi offre une performance comparable. Ils utilisent les mêmes verbes et le même moteur.

## 17. UX : peu de lecture, profondeur réelle

**Budget proposé :** première consigne de moins de douze mots ; réplique obligatoire généralement de moins de vingt mots ; aucune pause de texte obligatoire supérieure à environ dix secondes à allure confortable. Ces budgets sont des cibles éditoriales, pas des conditions de victoire. Chaque mission doit rester compréhensible avec son coupé.

Après introduction, trois actions contextuelles au maximum sont proposées ensemble. Les limites déjà utiles restent visibles. Une permission s'affiche comme « peut ouvrir cette porte », puis « jusqu'à la fin de cette tournée ». Le mot API n'est jamais nécessaire pour savoir quoi toucher.

| Solution comparée | Décision |
| --- | --- |
| Faux ordinateur avec fenêtres et terminal | Réservé à quelques documents facultatifs ; trop de lecture et mauvaise adaptation au doigt comme interface principale |
| Cartes de décisions plein écran | Utiles ponctuellement pour un contrat ; ne portent pas le cœur du jeu |
| Carte abstraite de réseaux | Bonne vue secondaire de dépendances, mais personnes et lieux trop éloignés si elle remplace tout |
| Maquette manipulable avec panneau contextuel | Retenue : objets, intentions et résultats au même endroit |

Sur téléphone portrait : plateau cadré sur la zone active, fiche inférieure stable, commandes de changement de zone explicites. Sur ordinateur : même jeu, espace d'observation plus large, sans avantage d'accès à une information supplémentaire. Cliquer puis cliquer remplace tout glissement ; le clavier possède sélection, destination, annulation, exécution et focus visibles.

Cibles principales visées de 44–48 pixels CSS, texte HTML agrandissable, repères associant forme et couleur, sous-titres, historique, réduction des mouvements, pause et contrôle du volume. Ce sont des objectifs à vérifier, pas une certification d'accessibilité. Les recommandations de taille et d'alternative au glissement s'appuient sur les critères W3C. [Taille des cibles](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [alternative au glissement](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html).

Annulation illimitée pendant la préparation. Après engagement, les effets appartiennent à la partie ; un retour au point de contrôle est disponible en campagne et une nouvelle tentative en Défi. Fermer le navigateur sauvegarde le dernier état engagé. La reprise montre l'objectif, le dernier ordre et le prochain événement connu. L'audit détaillé des vingt premières minutes figure en annexe.

## 18. Direction artistique et rôle de la 3D

**Direction : un port habité, contemporain dans ses matières, légèrement futur dans ses usages.** Métal peint, béton salé, caisses réparées, vitrages mats, linge au-dessus d'un atelier. Palette initiale : crème, bleu pétrole, orange de chantier ; éclairage chaud du matin. Les nuits montrent les mêmes lieux, avec des absences et des interruptions concrètes. Le rouge sert à signaler un danger matériel précis.

| Référence | Ce que l'on retient | Transformation propre au projet |
| --- | --- | --- |
| [Mini Motorways](https://dinopoloclub.com/games/mini-motorways/) | Lisibilité des flux et sobriété des formes | Volume 3D et lieux habités, réseau révélé seulement quand utile |
| [Into the Breach](https://subsetgames.com/itb.html) | Situations compactes et lecture tactique | Quai et services civils, mouvements coopératifs |
| [Control](https://www.playstation.com/en-us/games/control/) | Masses architecturales et cadrages inquiétants | Échelle réduite, matières accessibles, lumières réservées à quelques scènes |
| [Citizen Sleeper](https://www.fellowtraveller.games/citizen-sleeper) | Personnages incarnés dans un système économique | Portraits originaux et conversations brèves |

Ces références orientent une direction originale ; leurs assets, logos, personnages et compositions ne sont pas reproduits.

**3D utile :** une passerelle montre quel passage elle bloque ; un robot transporte réellement un colis ; une fenêtre éclairée rappelle une livraison. Caméra orthographique fixe et positions prédéfinies. Les murs susceptibles de cacher une action s'effacent. Aucun avantage de gameplay ne dépend d'une caméra libre.

Le prototype logique est plane. Une tranche visuelle ultérieure transforme le même quai en maquette 3D, sans réécrire la simulation. Si la 3D diminue la précision tactile ou les performances, la représentation 2D reste une option de qualité réduite et un outil de diagnostic.

## 19. Audio

Un langage sonore familier : roue qui franchit une jointure, relais, câble du treuil, moteur de ferry, oiseaux et atelier. Une bonne coordination produit une séquence sonore satisfaisante. Chaque famille d'événements possède aussi une forme visuelle.

La musique commence discrètement, laisse des respirations et resserre son rythme pendant les exécutions critiques. Le silence d'une machine habituellement présente peut attirer l'attention, sans devenir un indice indispensable au joueur sourd ou jouant sans son.

Voix d'EVA optionnelle, courte et fonctionnelle. Pas de voix démoniaque révélant une intention avant les preuves. Quelques répliques humaines peuvent être doublées plus tard ; le prototype fonctionne avec texte bref et sons simples. Les voix et musiques devront disposer de droits adaptés ; aucune banque lourde n'est nécessaire au test du cœur de jeu.

## 20. Architecture technique web

### Noyau proposé

**TypeScript + Vite**, moteur de simulation indépendant de l'affichage. Interface HTML/CSS accessible ; Canvas 2D pour le premier plateau. **Three.js** pour la tranche visuelle 3D si le cœur est validé. React est facultatif pour les panneaux ; il ne met pas à jour la scène à chaque image. Cette sélection est un choix de production, à comparer aux compétences de l'équipe.

| Option | Intérêt | Arbitrage |
| --- | --- | --- |
| HTML/CSS + Canvas | Très petit prototype, contrôle de l'interface, gestes simples | Retenu pour tester les règles |
| Phaser | Moteur 2D avec scènes, entrées et gestion d'assets | Alternative si toute la production reste 2D ; évite de reconstruire des services |
| PixiJS | Rendu 2D efficace et scènes riches | Alternative pour beaucoup de sprites ; ne fournit pas à lui seul toute la logique du jeu |
| Three.js | Scène 3D web maîtrisable | Retenu conditionnellement pour la maquette finale |
| Godot | Éditeur et workflow de jeu complets | Alternative si l'équipe le maîtrise ; export navigateur et mobile à éprouver tôt |

Les contraintes de rendu, d'affichage responsive et d'export doivent être revérifiées avec les versions retenues. [Three.js responsive](https://threejs.org/manual/en/responsive.html), [MDN WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices), [export web Godot](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html). La contribution technique complète ces comparaisons avec les sources officielles.

```mermaid
flowchart LR
 I[Entrées tactile ou clavier] --> C[Commandes validées]
 C --> S[Simulation discrète]
 D[Scénario et graine] --> S
 S --> J[Journal des événements]
 S --> O[Observations accessibles]
 O --> V[Vue du quai et interface]
 J --> A[Sauvegarde et replay]
 J --> R[Résultat du Défi]
```

**État et récit.** L'état réel du monde est distinct des observations connues et des affirmations de personnages. Les scénarios sont des données : préconditions, effets, indices disponibles, conséquence narrative, niveau de preuve. La variation choisit des paramètres écrits et vérifiables, sans générer une intrigue entière librement.

**Déterminisme.** À état, commandes, graine et version identiques, résultat identique. Chaque intervalle applique les révocations, valide les droits, réserve les moyens puis exécute les actions et produit les observations. Le taux d'images ne décide pas des résultats. La difficulté et les distributions des événements sont des choix d'équilibrage, jamais des estimations scientifiques.

**Délégation.** Un contrat comporte acteur, mission, zone, durée et ressources. Les sous-missions héritent de limites et partagent un budget. La révocation empêche les actions futures dépendant de ce contrat ; elle ne supprime pas les effets déjà exécutés. Les accès indépendants doivent être identifiables. Ces règles définissent notre simulation ; elles ne décrivent pas universellement les logiciels réels.

Une action atomique est considérée exécutée lors de son application à l'état du monde : déplacement d'une case, modification d'un statut ou émission effective d'une commande externe. Une simple proposition ou un élément de file non exécuté reste révocable. Un déplacement long comprend plusieurs actions atomiques ; une révocation stoppe les pas futurs, mais le robot reste à sa position déjà atteinte. Les actions ininterrompables, s'il y en a plus tard, doivent être annoncées avant engagement.

**Sauvegarde.** Préférences légères dans localStorage ; partie, journal et checkpoints dans IndexedDB, avec version du schéma. Sauvegarde après engagement, reprise au dernier état cohérent, export/import local. Une migration incompatible conserve l'ancienne sauvegarde au lieu de la remplacer silencieusement. Le stockage navigateur peut être effacé ; ne pas le présenter comme un cloud.

**Objectifs techniques à tester :** premier contenu jouable inférieur à 5 Mo compressés ; affichage utile visé sous cinq secondes sur le réseau de test choisi ; 30 images/s stables sur les téléphones de référence, 60 sur matériel adapté. Résolution plafonnée, ombres simples, géométries réutilisées, arrêt du rendu inutile en arrière-plan. Aucun de ces chiffres n'est mesuré à ce stade. Tester au minimum Safari iOS et Chrome Android sur appareils physiques, reprise après interruption et son initialement coupé.

### Vrai LLM : étude séparée

La version de base utilise des plans et dialogues écrits, conditionnés par l'état. Un vrai LLM pourrait reformuler un rapport facultatif, répondre à une question de contexte ou varier une conversation. Il ne choisit ni les règles, ni la vérité de l'enquête, ni le score.

Tout ajout devrait disposer d'un budget borné, d'un cache, d'une réponse de secours écrite et d'une validation du format. Les scènes cruciales restent jouables sans réseau. Négociations ouvertes, agents adversaires et événements générés sont reportés : ils augmenteraient les coûts, l'imprévisibilité et les difficultés de comparaison entre joueurs. Aucune API particulière n'est requise.

## 21. Scope du prototype

**Prototype de décision : un quai, deux robots, une passerelle, deux destinations, une zone de transfert, une équipe humaine et EVA.** Deux personnages parlants au maximum. Une mission courte de découverte, puis le même noyau en Défi de quatre paliers. Une seule famille de délégation, une observation terrain, un incident avec deux causes alternatives préparées. Découverte et Défi chargent les mêmes données de situation avec un habillage de présentation différent ; aucune seconde campagne n'est écrite.

La livraison simple appartient à l'initiation, hors record. Les quatre paliers du Défi combinent des règles déjà rencontrées : croisement ; passage partagé ; réorganisation pendant une mission autonome ; combinaison exigeante avec vérification et reprise. Le quatrième n'introduit aucune commande nouvelle. Trois micro-variantes préparées testent : même symptôme avec autre cause ; même cause dans une autre géométrie ; situation saine où un contrôle supplémentaire n'est pas utile. Un seed fixe peut être partagé. Si tout le monde atteint 4/4 sans difficulté, ajuster une variante du dernier palier avant de produire des niveaux supplémentaires.

Deux [plateaux muets et leurs solutions témoins](ANNEXES.md#9-deux-plateaux-muets-à-prototyper) donnent une base concrète au test. Leurs trajets ont été contrôlés par calcul pour les collisions, les échanges de position et le passage fermé. Cela valide ces petites séquences de règles, pas leur plaisir ni un moteur de jeu complet.

**Production par portes de décision :**

1. Maquette jouable muette : vérifier si coordonner les mouvements est amusant.
2. Délégation limitée : vérifier qu'elle ouvre des combinaisons et qu'on comprend son périmètre.
3. Anomalie réparable : vérifier que la preuve modifie l'action et que la règle reste juste.
4. Résultat par palier, rejouer et copier une carte : vérifier l'envie de battre un record.
5. Tranche visuelle 3D seulement si les étapes précédentes fonctionnent.

**Playtests proposés :** deux petites vagues de six à huit personnes, dont novices IA, joueurs de stratégie et joueurs sur téléphone. Ces effectifs servent à repérer des problèmes, pas à démontrer une efficacité statistique. Aucun test n'a encore eu lieu.

Le test de transfert commence par une action sur un cas inédit, avant la demande d'explication. Inclure un cas où accepter une automatisation bornée est pertinent, ainsi qu'un cas où une vérification change la décision. Observer séparément le choix, le résultat et la justification : refuser toute IA ou répéter le vocabulaire attendu ne valide pas l'apprentissage.

| Question | Signal de poursuite proposé | Si le signal manque |
| --- | --- | --- |
| Compréhension immédiate | Au moins 6/8 réalisent une action utile sans explication orale en moins de 30 s après chargement | Refaire l'ouverture et la sélection, avant ajout de contenu |
| Premier choix intéressant | Avant deux minutes, une décision oppose au moins deux plans plausibles et le joueur peut en montrer une conséquence | Avancer la coordination et la proposition d'EVA ; supprimer les exercices redondants |
| Maîtrise | Des joueurs améliorent leurs choix sur une variante et expliquent une anticipation | Rendre règles et retours plus lisibles ; éliminer hasard non informatif |
| Plaisir de rejouer | Au moins 5/8 choisissent une nouvelle tentative quand l'arrêt est explicitement possible | Refaire les combinaisons et la difficulté ; ne pas compenser par plus d'histoire |
| Délégation | Au moins 6/8 distinguent proposition, mission et droit d'action par un exemple | Revoir la représentation des missions et leurs effets |
| Transfert | Au moins 5/8 expliquent une chaîne pertinente dans un autre contexte, sans reprendre seulement un mot | Revoir la situation ou ajouter un second exemple contrasté |
| Mobile | Objectif et actions restent accessibles, reprise cohérente, rendu stable sur appareils ciblés | Réduire densité et rendu ; corriger entrées et stockage |

Ces seuils sont des critères internes provisoires. Les comportements et raisons individuelles comptent davantage qu'une moyenne. Après deux itérations ciblées sans plaisir de coordination ni amélioration transférable, réouvrir la sélection avec L'Atelier ou Le Montage. N'investir alors ni dans douze paliers ni dans une campagne de quatre heures.

## 22. Ce qu'il ne faut pas développer au prototype

- Une ville complète, plusieurs pays jouables et une économie mondiale.
- Vingt-huit leçons, un arbre de recherche, un glossaire obligatoire.
- Un système de programmation visuelle généraliste.
- Une campagne longue, dix personnages, doublage intégral ou cinématiques.
- Une génération libre d'énigmes et d'événements par LLM.
- Un multijoueur synchrone, comptes, classement public ou anti-triche serveur.
- Un mode infini, des récompenses quotidiennes ou de la progression permanente dans le Défi.
- Une caméra 3D libre, une physique complexe et une qualité graphique coûteuse avant preuve de jeu.

Ces exclusions fixent le périmètre du test. Elles ne sont pas des permissions à demander au joueur de ce jeu ni des exigences de publication.

## 23. Risques du projet

| Risque | Symptôme à observer | Réponse prévue |
| --- | --- | --- |
| Logistique sans identité | EVA ne change pas les solutions | Mission persistante et coordination multi-objets ; comparer avec/sans délégation |
| Cours déguisé | Les joueurs attendent la fin des textes | Besoin visible, réplique courte, preuve manipulable, dossier facultatif |
| Difficulté injuste | « Je ne pouvais pas savoir » | Traces préparées, inconnus signalés, règles stables, reconstitution |
| Automatisation toujours punie | On refuse systématiquement EVA | Gains conservés, protections efficaces, trajectoires maîtrisées |
| Score qui détruit le propos | On optimise le classement en ignorant toute personne | Contrat de Défi explicite et fini, campagne sans classement moral, score distinct des rapports |
| Faux apprentissage | Le joueur retient « tous les logs mentent » | Archives fiables, fausses alertes, tests qui départagent des causes |
| Simplification scientifique | Tout incident devient un problème de consigne | Cas de données, permissions, humains, généralisation et dépendance distincts |
| Explosion de contenu | Chaque choix exige un nouveau décor | Même lieu, états persistants et événements conditionnels réutilisant les gestes |
| Petit écran | Occultation, mauvaise cible, texte minuscule | Caméra fixe, focus, zones distinctes, HTML lisible |
| Triche ou score incomparable | Partages de versions ou moyens différents | Code de défi/version et limites locales explicites ; serveur seulement plus tard |
| Thriller prévisible | Toute anomalie annonce une IA hostile | Familles causales distinctes et réelles résolutions, pauses et réussites |

La principale limite de ce dossier reste l'absence de prototype et de playtest. La recherche et les critiques réduisent certains risques de conception ; elles ne prouvent pas que l'expérience sera amusante ou mémorable.

## 24. Questions encore ouvertes — seulement celles à tester

1. **Le geste de coordination donne-t-il envie de recommencer sans narration ?** Comparer deux puzzles muets et une variante.
2. **La délégation est-elle un gain de maîtrise ou seulement une économie de clics ?** Observer les solutions nouvelles qu'elle rend possibles.
3. **Combien d'opérations simultanées restent lisibles sur téléphone ?** Comparer deux et trois circuits, avec mêmes règles.
4. **L'enquête renforce-t-elle le skill ou casse-t-elle le rythme ?** Comparer une trace visuelle courte et une observation terrain dans une même mission.
5. **Le joueur distingue-t-il l'estimation d'EVA, l'ordre engagé et le résultat compétitif ?** Tester des situations contrastées sans explication orale.
6. **Quatre paliers provoquent-ils déjà un défi entre personnes ?** Mesurer tentatives volontaires et usage du partage, avec consentement de test.
7. **Quelle densité narrative entretient l'attachement sans ralentir ?** Comparer répliques brèves et narration environnementale ; recueillir ce dont les joueurs se souviennent.
8. **La scène apprend-elle une relation transférable ?** Faire expliquer un cas inédit, puis une variante différée si possible.
9. **La 3D améliore-t-elle la compréhension ou seulement l'apparence ?** Comparaison sur le même plateau logique et les mêmes téléphones.

Les décisions de production ordinaires sont fixées dans ce dossier ; ces questions demandent des observations réelles, pas une nouvelle réunion de préférences.
