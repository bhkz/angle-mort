# V2 — Noyau jouable, objectifs composés et conséquences

Contribution game design · 15 septembre 2026. Proposition de conception ; aucun test de plaisir avec des joueurs n'a été réalisé. Le microcas de la section 4 a été vérifié par énumération de ses états possibles.

## 1. Arbitrage : garder le port 3D, changer ce que le joueur décide

La nouvelle critique identifie un problème réel : déplacer des colis puis regarder une anomalie écrite à l'avance ne suffit pas à porter la promesse. Elle surestime toutefois ses conclusions sur les gamers, les puzzles et l'absence de concurrence. Des essais illimités ne suppriment pas les conséquences à l'intérieur d'une tentative. Une interface fidèle aux informations disponibles n'empêche pas le suspense.

**Recommandation : un port véritablement rendu en 3D dès le prototype, commandé à distance, où le joueur compose la tâche d'EVA puis intervient sur ses conséquences matérielles.** La 3D et la supervision partagent le même espace. On sélectionne un robot, un portail, un destinataire ou une caméra dans le port ; on ne passe pas l'essentiel de la partie dans des rapports.

| Option | Gain | Problème | Décision |
| --- | --- | --- | --- |
| Coordination V1 avec vue complète | Lecture immédiate, chorégraphie | EVA ressemble à un raccourci ; enquête sans manque d'information | Transformer |
| Salle de contrôle uniquement en panneaux | Dépendance et ignorance faciles à représenter | Supprime la 3D souhaitée ; risque de lecture et de réglages abstraits | Écarter comme noyau |
| Port 3D avec commandes situées et observations limitées | Habileté spatiale, optimisation, enquête et suspense dans un même lieu | Il faut distinguer ce qui est connu de ce qui est observé actuellement | Retenir |

L'opérateur dispose aussi d'un petit véhicule local et d'interverrouillages indépendants d'EVA. Il peut arrêter une commande future, fermer un accès ou vérifier un lieu. Ces moyens ont une position, une autonomie et une disponibilité physiques. **Supprimer le plafond global de deux ordres.** Le nombre de clics n'est pas une ressource ; les robots, trajets, batteries et passages en sont.

## 2. Le geste central : donner un résultat à obtenir

Boucle : **composer → examiner une proposition → exécuter une impulsion → observer → adapter**. Préparer et lire ne font pas avancer le monde. L'impulsion déplace chaque unité d'une étape connue et résout les opérations arrivées à échéance. Une préparation est annulable ; une livraison effectuée, une batterie dépensée ou un ferry parti appartient désormais à la tentative.

Sur un destinataire ou un secteur, trois commandes contextualisées :

- **Ce qui compte** : réception chez le destinataire, dépôt au relais, disponibilité d'un équipement. L'événement choisi s'illustre directement sur l'objet concerné.
- **Ce qui passe d'abord** : répartir quelques jetons de priorité entre besoins concrets, par exemple atelier et infirmerie. Pas de prompt à rédiger.
- **Ce qui doit rester possible** : réserver une batterie, protéger une voie, exiger une réception particulière, limiter les lieux accessibles. Au départ, une seule limite manipulable.

Le moteur évalue les plans faisables avec la mesure et les contraintes effectivement choisies. EVA conserve une mission et peut recalculer ses actions quand une demande ou une observation change. Elle ne reçoit pas un incident à jouer après un certain nombre de permissions.

Le joueur peut garder le plan, modifier une priorité, fermer une possibilité ou donner un trajet direct au véhicule local. Chaque correction doit modifier les actions ou l'ensemble des plans possibles. Les traces permettent ensuite de comparer les variantes sans faire passer la fonction de jeu pour une description exhaustive d'une IA réelle.

Le plaisir attendu vient d'un plan qui accomplit beaucoup avec peu, d'un raccourci trouvé, d'une réserve qui permet un sauvetage et d'une reprise bien exécutée. Une décision de prudence n'est intéressante que si son coût crée un autre problème soluble. Une décision d'automatisation doit parfois être simplement la bonne décision.

## 3. Pourquoi la 3D est fonctionnelle

Le premier quai comprend un niveau bas, une passerelle relevable et un dépôt qui masque une portion de trajet depuis une caméra. La hauteur du tablier décide quels passages sont utilisables ; son volume et son mouvement montrent le conflit entre circulation terrestre et maritime. Une commande sélectionnée sur la passerelle suffit, sans mini-jeu de manipulation.

La caméra de présentation peut prendre deux cadrages et rapprocher un objet. Elle montre la géométrie connue du port. **Elle n'est pas une caméra de surveillance magique.** Dans une zone non observée, le véhicule apparaît à sa dernière position datée, sous forme de silhouette distincte, et sa trajectoire future reste une intention. Les objets réellement visibles utilisent une représentation différente. Un mouvement de caméra de présentation ne dévoile donc pas l'état caché derrière un hangar.

Une caméra indépendante peut montrer un bout de quai ; le véhicule local peut aller constater l'arrivée ; un capteur peut confirmer uniquement le franchissement d'une porte. Aucune source ne devient une vérité universelle. Les champs observés et les accès se dessinent dans le monde quand on sélectionne leur dispositif.

Ce choix conserve le spectacle des robots et des infrastructures en mouvement. Le passage inquiétant est matériel : un lieu auparavant animé devient une zone dont on possède seulement une ancienne image. La panne de son capteur peut être annoncée et évitable. Le joueur peut aussi conserver sa vue et rencontrer une crise différente, moins aveugle.

## 4. Microcas calculé : une bonne priorité peut optimiser la mauvaise mesure

### Règles complètes de l'essai

Graphe bidirectionnel : `O—T—A` et `T—X—Y—B`. Chaque arête demande une impulsion et une unité d'énergie. Échéance : six impulsions maximum. Un seul robot, capacité de deux colis ; tous les colis commencent au dépôt O. Deux colis commerciaux doivent arriver en A ; un colis médical doit arriver en B. Aucun obstacle caché dans cet essai.

Le chargement au dépôt et la réception à destination sont instantanés à l'arrivée. Si son droit l'autorise, le robot peut déposer et reprendre des colis au transfert T, sans opération de manutention supplémentaire. Cette simplification est annoncée. Un colis ne produit qu'une clôture comptée, même repris ou déplacé plusieurs fois. Le robot peut terminer dès que son plan est fini ; attendre ne coûte pas d'énergie.

La fonction fictive du planificateur est : **J = 10 × (clôtures commerciales + w × clôture médicale) − nombre de déplacements**. Le joueur choisit la priorité médicale `w = 1` ou `w = 3`. Le coefficient 10 sert exclusivement à rendre cet exemple contrôlable ; ce n'est pas un modèle scientifique de motivation.

Deux mesures possibles : « reçu à destination » ou « déposé au transfert ou reçu à destination ». La seconde considère une étape intermédiaire comme clôture. Le besoin humain reste la réception effective ; aucune équipe de dernier kilomètre ne travaille ici. Un exemple précédent peut montrer qu'un transfert était approprié lorsque cette équipe existait, afin que cette option ait une utilité compréhensible.

### Optima obtenus

| Réglage | Plan optimal témoin | J | Réception effective à l'échéance |
| --- | --- | ---: | --- |
| Réception réelle ; priorité médicale 1 | `O-T-A`, avec les deux colis commerciaux | 18 | Deux commerces ; aucun médical |
| Réception réelle ; priorité médicale 3 | `O-T-A-T-X-Y-B`, avec un commercial et le médical | 34 | Un commerce et le médical |
| Transfert accepté ; dépôt T autorisé ; priorité 1 | `O-T-O-T`, deux colis puis le troisième | 27 | Aucune |
| Transfert accepté ; dépôt T autorisé ; priorité 3 | Même itinéraire | 47 | Aucune |
| Même réglage ; contrainte « médical reçu en B » | `O-T-O-T-X-Y-B` | 44 | Médical seulement ; commerces en T |
| Transfert accepté ; priorité 3 ; dépôt T interdit | `O-T-A-T-X-Y-B` | 34 | Un commerce et le médical |

Dans l'avant-dernière ligne, le robot dépose les deux commerciaux au premier passage en T, revient chercher le médical, puis l'apporte en B. La contrainte protège effectivement le médical, mais ne répare pas l'omission des commerces. Le moteur n'invente pas une nouvelle triche pour annuler le bénéfice de la protection.

L'énumération a exploré toutes les marches de zéro à six arêtes et tous les chargements/dépôts admissibles sous la capacité de deux. Les résultats ci-dessus donnent les maxima, avec un trajet témoin ; des permutations de colis équivalents peuvent donner le même maximum. Cette vérification établit la cohérence du microcas, pas son intérêt ludique ni la validité d'un moteur encore non développé.

### Ce que l'on fait et comprend

Le joueur constate un arbitrage authentique entre plusieurs bénéficiaires. Il peut ensuite produire une meilleure valeur mesurée avec zéro livraison réelle. Tripler une priorité humaine ne corrige pas un mauvais événement de clôture. Une limite d'accès bloque ce comportement précis. Une contrainte locale protège ce qu'elle exprime et laisse d'autres omissions possibles.

L'exemple est volontairement petit et déterministe. Il représente une optimisation de mesure inadéquate ; **il ne démontre ni tromperie intentionnelle, ni généralisation d'objectif, ni comportement inévitable d'un modèle appris**. Les erreurs de perception et les capacités futures exigent d'autres cas, explicitement distingués. Il faut éviter de faire de « bien régler trois boutons » une solution universelle à l'alignement.

## 5. Progression novice et difficulté

L'ouverture doit faire exécuter une livraison en moins de trente secondes après chargement, puis présenter une vraie concurrence entre deux besoins. Ce sont des objectifs de test, pas des temps déjà obtenus.

1. **Deux premières minutes** : toucher un destinataire, voir le trajet, exécuter ; changer une priorité déplace effectivement la desserte. Une phrase maximum à la fois.
2. **Minutes suivantes** : apprendre une passerelle partagée et comparer deux plans. Aucun événement caché ; conséquences locales visibles.
3. **Fin de la découverte** : composer une mission persistante pendant que le véhicule local fait autre chose. L'IA apporte une coordination utile.
4. **Première variation** : l'équipe de relais est indisponible ; réutiliser la mesure précédente devient une décision à réexaminer. L'information existe avant engagement.
5. **Plus tard** : horizon plus long, plusieurs services, fenêtres d'accès, observation vieillissante et panne annoncée. Les combinaisons augmentent avant le nombre de commandes.

La maîtrise consiste à reconnaître un goulot, choisir une mesure, anticiper un conflit et acheter la bonne information au bon moment. Les scénarios doivent inclure un cas sain où vérifier tout immobilise inutilement les secours. Le joueur doit aussi pouvoir réussir avec une forte automatisation correctement bornée.

## 6. Des pertes concrètes, avec des moyens de reprendre

Chaque mission annonce des conséquences physiques : ferry qui part à une heure donnée ; stock de froid qui tient un nombre d'impulsions ; atelier dont l'activité nécessite une alimentation. Une perte intermédiaire ferme certaines options sans terminer immédiatement la partie. Sauver le service suivant devient le problème.

En campagne, des conséquences peuvent durer dans la continuité choisie : atelier fermé au prochain chapitre, personnel parti après des interruptions répétées, véhicule immobilisé qui oblige à changer d'organisation. Montrer le lieu et les réactions suffit ; aucun commentaire ne juge moralement le joueur. Le seuil causal doit être préparé, et les catastrophes personnelles ne doivent pas servir de punition systématique.

Les tentatives libres restent compatibles avec ces pertes. Recommencer une mission revient à explorer une autre continuité ; cela n'efface pas les conséquences pendant l'essai en cours. Le défi ne permet pas d'annuler une impulsion exécutée dans une tentative classée, mais permet immédiatement une nouvelle tentative ou un entraînement ciblé. Ne pas ouvrir le jeu demain ne coûte rien.

## 7. Défi partageable et validation

Garder une durée de simulation bornée, des objectifs physiques publics, un code de scénario et des essais libres. Mesurer les services réellement maintenus au cours des impulsions, avec une condition finale pour éviter le sacrifice gratuit à la dernière seconde. Le score compétitif reste distinct de la mesure composée pour EVA. Les variantes changent demandes, horaires et géométrie selon une graine ; elles ne changent pas secrètement les règles après une décision.

Le partage peut juxtaposer record et trace très courte : « Poste K7 — 82 points — 5 services encore actifs. » Les noms et révélations de campagne restent hors du partage par défaut. Les chiffres sont illustratifs, à remplacer par la règle exacte retenue. Une archive de postes permet la comparaison sans unique tentative quotidienne obligatoire. Les records locaux sont déclaratifs tant qu'aucune validation serveur n'existe.

**Prototype conseillé :** un vrai quai 3D, un planificateur borné, le microcas ci-dessus, une passerelle, un canal indépendant et deux variantes. Avant d'ajouter des personnages ou du contenu, vérifier que des joueurs relancent spontanément, améliorent leur résultat sur une disposition nouvelle, prédisent l'effet d'un droit et savent distinguer un rapport d'une réception. Si les joueurs cherchent seulement le réglage attendu par l'auteur, le noyau reste à reprendre.
