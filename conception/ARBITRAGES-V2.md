# Révision V2 — ce que la critique change

15 septembre 2026. Décisions de conception après la critique fournie par l'utilisateur. **La conservation de la 3D est une instruction explicite de l'utilisateur et prime sur la proposition de jeu d'interface.** La [V2](DOSSIER-V2.md) devient la référence active ; la V1 conserve l'historique.

## 1. Verdict

La critique repère un manque d'engagement dans les conséquences et un non-alignement trop souvent illustré après coup. Elle propose une excellente piste : perdre progressivement ses moyens d'observation pour des avantages concrets. Nous retenons ces trois chantiers.

Ses conclusions sur l'absence possible de fun, les goûts de tout JVC, l'impossibilité de faire peur avec une interface fiable, l'inutilité des nombres à partager et un coût divisé par dix ne sont pas des résultats établis. Elles ne justifient pas de supprimer la 3D, les nouvelles tentatives ou la possibilité d'une issue maîtrisée.

**Direction retenue : un thriller tactique en 3D, où l'on compose les missions d'un système autonome, agence les moyens d'observation et intervient dans un port matériellement transformé par ses décisions.**

## 2. Arbitrage proposition par proposition

| Proposition de la critique | Décision | Modification vérifiable |
| --- | --- | --- |
| « Le jeu n'a aucune dent » | Diagnostic partiellement retenu | La V1 comportait déjà des ruptures durables, mais les exposait surtout dans les fins. La V2 donne des seuils de perte et des effets sur les missions suivantes. |
| Essais illimités = aucune conséquence | Rejet de l'équivalence | Les conséquences persistent dans la partie en cours. Une nouvelle tentative repart d'un état initial, sans effacer le récit de la précédente. |
| L'optimisation est une démonstration scriptée | Retenu pour le noyau | Objectifs composés et plans recalculés par les règles ; tests où une modification du critère ou d'un droit change réellement l'action. |
| Un planificateur écrit ne peut rien enseigner | Rejet de la généralisation | Une simulation peut faire expérimenter un mécanisme. Elle doit annoncer ses limites et distinguer optimisation explicite et apprentissage d'un but. |
| 28 notions saturent la promesse | Retenu comme problème de priorité | Six acquis centraux, trois éprouvés d'abord au prototype ; les 28 notions restent une carte de couverture pour les auteurs, conformément au brief initial. |
| Garder seulement les six notions suggérées | Modifié | Leur liste oublie la généralisation des buts et les intérêts des sources, pourtant centraux dans la demande utilisateur. Notre socle les intègre. |
| Interface fiable incompatible avec peur | Rejeté | Une représentation fidèle de ce que l'on sait peut montrer de l'inconnu, une contradiction ou une perte d'information. |
| Horreur par soustraction | Retenu | Les observations deviennent anciennes ou inaccessibles selon les connexions et décisions. Des moyens indépendants permettent de prévenir ou de réparer cette perte. |
| EVA comme seules mains possibles | Modifié | EVA coordonne les missions adaptatives. Des commandes directes, automatismes et secours locaux restent distincts et utilisables. Les contraintes sont matérielles. |
| Tout déplacer dans une salle de contrôle | Rejeté | Le plateau 3D reste l'espace principal de décision ; niveaux, occlusions et trajets ont un rôle. Aucun bureau supplémentaire à produire au prototype. |
| Supprimer la 3D pour économiser | Rejeté, instruction utilisateur | Première tranche jouable en vraie 3D sobre. Réduire le lieu, le nombre d'objets et les effets graphiques. |
| Retirer le budget de deux interventions | Retenu | On prépare autant d'ordres compatibles que les moyens physiques le permettent ; les robots, passages, temps de trajet et alimentations bornent l'action. |
| Renforcer titre et identité | Retenu comme piste | ANGLE MORT, nom de travail sans disponibilité vérifiée ; port industriel contrasté, familier et inquiétant, lisible sur téléphone. |
| Ne jamais revenir à la lumière | Rejeté comme règle absolue | Respirations et restauration de la vue récompensent l'action. Le sombre permanent émousse le contraste et peut nuire à la lecture. |
| Une tentative quotidienne obligatoire | Rejeté | Défi commun partageable, reprises libres ; première découverte et meilleure tentative clairement distinguées. |
| Remplacer le score par une perte | Modifié | Résultat physique compréhensible et empreinte visuelle du port. Les révélations nominatives restent masquées par défaut. |
| Tout le monde finira les douze paliers | Non établi ; faiblesse de plafond retenue | Défi borné mesurant aussi la qualité de continuité des services, variantes et difficulté distinctes ; pas de promesse de classement éternellement discriminant. |
| Le genre proposé n'existe pas encore | Non établi | Duskers documente déjà observation indirecte, drones et capteurs défaillants. Notre différence doit venir des objectifs délégués et de la responsabilité, sans revendiquer un marché vierge. |

## 3. Trois architectures comparées

Appréciation qualitative de conception, sans test de public ni estimation budgétaire certifiée.

| Architecture | Plaisir principal | Force | Problème | Verdict |
| --- | --- | --- | --- | --- |
| Port V1, vue générale largement renseignée | Chorégraphie et coordination | Geste concret, compréhension de l'espace | EVA risque de rester facultative et les conséquences, périphériques | Conserver le lieu et les gestes ; transformer l'information et les objectifs |
| Salle de contrôle, monde par panneaux | Déduire depuis des rapports et arbitrer | Relation forte entre dépendance et ignorance | Lecture, passivité, abandon de la 3D demandée ; coût réel non estimé | Ne pas retenir comme architecture principale |
| Port 3D opérable, observation partielle et missions composées | Agencer, déléguer, observer, intervenir | Même espace pour maîtrise, enquête et conséquences | Il faut rendre l'incertitude immédiatement lisible et éviter une interface trop dense | **Retenu**, avec un seul quai et une seule simulation |

L'hybridation ne consiste pas à empiler un jeu de gestion, un FPS et un logiciel de vidéosurveillance. Le joueur touche les objets d'un même port. Un changement de point d'observation montre ce que le capteur choisi peut voir. Une fiche courte ne remplace pas la scène.

## 4. Ce que nous rendons vraiment plus dur

- **Exécuter engage.** L'annulation avant engagement est libre ; après, réparer prend du temps et des moyens. Une échéance dépassée ne revient pas en suspendant EVA.
- **Les solutions ont des coûts différents.** Garder un robot sur un point haut fournit une observation indépendante mais retire temporairement un transporteur. Un capteur fixe peut ensuite libérer le robot.
- **Un meilleur indicateur peut donner un moins bon service.** La règle qui calcule ce résultat existe avant l'incident ; le joueur peut la modifier et obtenir une autre trajectoire.
- **Une bonne protection a un périmètre.** Exiger la réception de la livraison médicale ne protège pas automatiquement les autres destinataires. Aucun bouton « aligner ».
- **Les pertes changent les problèmes suivants.** Un atelier indisponible retire une capacité de réparation. Le récit continue avec d'autres moyens, au lieu de se contenter d'un commentaire triste.
- **L'inconnu demande une stratégie.** L'inspection gratuite d'une information déjà reçue reste possible ; acquérir une nouvelle observation peut mobiliser un équipement ou un trajet.

La difficulté ne vient pas du temps passé à lire ni d'une interface lente. Nous ne punissons pas une fermeture du navigateur. Une décision sous contrainte dans le monde simulé conserve sa tension avec une pause réelle.

## 5. Travail des agents dans cette révision

Trois agents ont travaillé séparément sur des sous-tâches complémentaires à partir de la V1 et de la critique complète :

1. [Gameplay et calcul des objectifs](contributions/V2-01-GAMEPLAY.md) : boucle, contraintes physiques, cas chiffré, pertes et défi.
2. [Thriller et 3D](contributions/V2-02-THRILLER-3D.md) : observation, espace, progression de peur et séquence jouée.
3. [Alignement et audit](contributions/V2-03-ALIGNEMENT-AUDIT.md) : acquis, fidélité scientifique, contre-factuels et assertions excessives.

La coordination arbitre leurs propositions et vérifie les sources nouvelles. Les contributions sont des propositions ; en cas de divergence de titre, durée, commandes ou score, les règles consolidées de [DOSSIER-V2.md](DOSSIER-V2.md) font autorité. Leurs avis ne sont pas trois preuves indépendantes de fun.

### Corrections issues de la relecture V2

- La caméra entre en maintenance au même horaire dans toutes les stratégies ; une relève préserve une observation indépendante, elle n'annule pas la maintenance.
- L'observation porte sur un état de porte qui change la route pertinente, avec deux variantes indistinguables avant acquisition. La rotation de présentation ne révèle aucune information cachée.
- La maintenance est reportée après l'initiation afin de réserver plusieurs minutes à la réutilisation des gestes.
- Un cas de transfert réellement assuré par une équipe précède son absence annoncée. Le critère de transfert n'est plus simplement un bouton-piège.
- Une contrainte de réception sur un plan prévu ne garantit pas le résultat physique sous information partielle.
- L'évaluation d'une politique gelée et son réentraînement sont des opérations séparées.
- Les fenêtres de score et l'ordre réception puis dommage sont fixés. Le [sous-cas à deux robots](contributions/V2-04-TRAJETS.md) précise cinq trajectoires, sans prétendre certifier le poste complet.

Ces corrections sont intégrées dans le dossier actif. Les six configurations du microcas d'objectifs et les cinq trajectoires du sous-cas ont été exécutées avec leurs vérifications Node. Les performances 3D et la réaction de joueurs restent non testées.

## 6. Promesses à tester avant la campagne

La tranche 3D doit établir quatre choses : le joueur veut refaire une situation ; il progresse sur une variante ; l'information perdue crée une inquiétude qui le pousse à agir ; il comprend un écart entre objectif et résultat sans apprendre seulement à cocher toutes les protections.

Un calcul de plans peut contrôler une causalité et un contre-exemple. Il ne valide ni la lisibilité tactile, ni le suspense, ni la réaction des joueurs de JVC. La V2 ne prétend pas avoir réalisé ces tests humains.
