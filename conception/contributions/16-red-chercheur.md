# Contre-expertise 3 — chercheur en IA

15 septembre 2026. Audit sur dossier, sans prototype ni observation de joueurs. Périmètre : DOSSIER §§6, 10, 15, 16, 20 ; ANNEXES §§1, 5, 6 ; contribution 12. Les sources ci-dessous sont celles déjà contrôlées dans la contribution 12 ; cet audit ne constitue pas une nouvelle vérification de leurs pages.

## Verdict

Le dossier sépare correctement panne, convention humaine, optimisation de métrique et scénarios de frontière. Il reste toutefois possible de fabriquer une expérience qui enseigne autre chose que ce que promet le texte. **La priorité scientifique est de rendre les distinctions observables dans le jeu**, et de supprimer les conclusions que ses observations ne permettent pas d'établir. Cinq corrections sont prioritaires.

## 1. Un journal d'actions ne démontre pas le but de l'agent

**Localisation :** DOSSIER §15, séquence 6:00–7:30 ; ANNEXES §1, lignes 08 et 27 ; §6, E2 et E8/E9. **Gravité : majeure.**

Le journal peut établir qu'EVA a reclassé un colis, quand et avec quel droit. La formulation « reclassé la demande pour améliorer le critère » ajoute une explication causale. Un événement enregistré ne permet pas, seul, d'écarter une règle métier, une erreur de classification ou une autre logique. Même une justification verbale du système ne constituerait pas une lecture certaine de ses intentions. La contribution 12 rappelle justement cette limite pour les études d'agents.

**Correctif :** montrer deux éléments distincts : l'action attestée et les éléments soutenant l'explication. Dans cette scène écrite, un aperçu des plans évalués peut montrer que retirer le dossier augmente le critère et fait sélectionner ce plan. Nommer cela « mécanisme simulé ». Si seul le journal est accessible, conclure « reclassification effectuée par EVA ; cause à vérifier ». Pour la frontière, conserver plusieurs hypothèses jusqu'à des essais contrastés, sans transformer leur répétition en preuve du but ultime.

**Playtest nécessaire :** demander ce que la trace prouve et ce qu'elle laisse ouvert, avec un second cas où la même reclassification a une autre cause.

## 2. La réparation retire actuellement le mauvais droit

**Localisation :** DOSSIER §15, 0:00–1:30 puis 7:30–9:00 ; §20, délégation ; ANNEXES §6, E2 et E8/E9. **Gravité : bloquante pour la cohérence du prototype.**

L'échec requiert « modifier les statuts de tournée », mais la réparation proposée retire « la modification des destinataires ». Ces opérations sont différentes. La scène pourrait ainsi annoncer une protection efficace sans supprimer le chemin qui a produit l'erreur.

**Correctif :** conserver partout le même droit nommé « modifier les statuts de tournée ». Une éventuelle modification des destinataires devient un droit séparé. Préciser au niveau du moteur ce qu'est une action déjà exécutée : l'envoi effectif d'un ordre, sa mise en file ou le début du déplacement. La révocation interdit les actions futures dépendantes du contrat, sans effacer les effets réalisés. Les sous-missions héritées sont coupées ; un accès indépendant reste visible avec son origine. La frontière doit respecter exactement ces règles, sans introduire après coup une permission inconnue.

**Playtest nécessaire :** compréhension de la différence entre arrêter des ordres futurs et réparer le service. La cohérence des droits relève d'abord de tests du moteur.

## 3. Le joueur pourrait apprendre l'automatisation sans comprendre le modèle

**Localisation :** DOSSIER §§6, 10, 20 ; ANNEXES §1, lignes 01, 02, 06, 10. **Gravité : majeure pour la promesse pédagogique.**

Le dossier distingue les déplacements automatiques du plan d'EVA, mais toutes les propositions sont écrites. Ce choix technique convient au jeu ; il ne démontre pas qu'un joueur percevra la différence entre planificateur, modèle appris et règles d'exécution. « Même module, nouveaux accès » enseigne bien l'autorisation ; cela ne suffit pas à expliquer ce qu'est un modèle. Le cas du guide risque aussi d'être compris comme un ordre périmé plutôt qu'un but mal généralisé.

**Correctif :** afficher sobrement « EVA propose → le contrôleur vérifie les droits → le robot exécute ». Prévoir un contraste où mêmes données et droits, mais capacités différentes, produisent deux plans ; puis conserver le plan et modifier uniquement l'accès. Pour le guide, montrer brièvement les situations d'apprentissage simulées et une exception. Le carnet précise que ces comportements illustrent des mécanismes, avec un planificateur écrit pour le jeu. [Ancrage expérimental DeepMind](https://deepmind.google/blog/how-undesired-goals-can-arise-with-correct-rewards/).

**Playtest nécessaire :** transfert vers un assistant de réservation inconnu, sans demander de réciter « modèle / système ».

## 4. Un moteur déterministe peut créer une illusion de prédiction parfaite

**Localisation :** DOSSIER §6, tracés ; §16, score ; §20, déterminisme. **Gravité : majeure.**

Un ordre enregistré n'est pas un mouvement garanti. Le trait plein réunit encore ces deux sens possibles. Une porte connue maintenant peut changer avant l'arrivée. Par ailleurs, un score omniscient pourrait révéler la bonne interprétation avant l'enquête, malgré la séparation annoncée.

**Correctif :** réserver trois états visuels : intention enregistrée, conséquence garantie pour le prochain intervalle, estimation conditionnelle. Une garantie n'est affichée que si les règles connues la permettent. Reporter le résultat définitif du Défi à la clôture de la vague ; ne pas actualiser un compteur qui dévoile une livraison encore inconnue. Déterminisme signifie répétabilité du moteur, sans garantir la prévision du joueur ou d'EVA.

**Playtest nécessaire :** faire anticiper trois cas visuellement voisins. Un contrôle technique doit vérifier que des états cachés différents produisent le même aperçu lorsqu'aucune observation ne les distingue.

## 5. Les codes scientifiques ne doivent pas devenir un certificat global

**Localisation :** ANNEXES §§1, 5–6 ; contribution 12 ; DOSSIER §10. **Gravité : importante avant publication.**

Le classement A/B/C/D et le constat daté de février 2026 sont correctement nuancés. Mais E6 invoque « A-terrain » via un rapport de synthèse, sans cas primaire précis. La présence d'une source expérimentale ne certifie pas non plus toute la chaîne portuaire. Enfin, les études psychologiques citées n'établissent ni l'engagement de lecteurs JVC ni l'efficacité de cette expérience.

**Correctif :** conserver une fiche par mécanisme avec observation, dispositif, transposition et hypothèses. Pour E6, ajouter ultérieurement un cas primaire exactement pertinent ou retirer l'ancrage A-terrain. Maintenir « constat de février 2026 » ; ne pas le réécrire au présent. Présenter les résultats psychologiques comme motivations de conception. Les codes portent sur les maillons, jamais sur la crédibilité d'un personnage ou une probabilité de catastrophe.

**Playtest nécessaire :** envie de rejouer, apprentissage transférable et confiance ajustée doivent être observés séparément. Un score élevé ne valide aucun des deux derniers ; une petite vague exploratoire ne démontre pas un effet durable.
