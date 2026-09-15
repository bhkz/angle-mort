# Interface jouable — P8

## But et apprentissage

Le joueur dirige deux robots pour remettre des colis à leurs destinataires, avec les informations qu'il possède. Une proposition de trajet prépare des actions ; seule l'exécution d'un tour fait avancer le moteur. Une réception physique confirmée est distincte du fait d'avoir préparé une mission.

L'ouverture présente un guide en trois gestes : choisir R1, choisir l'atelier, exécuter un tour. Le robot porte déjà une pièce ; sa réception réelle au tour 1 déclenche la suite. Une deuxième livraison médicale demande deux tours : collecte à la pompe, puis remise à l'infirmerie. Le guide, les boutons de scène et les raccourcis commandent la même API. La nouvelle demande P8 d'explications remplace explicitement la contrainte P6 « sans explication écrite ».

Le premier bouton d'exécution reste désactivé tant qu'aucune destination n'est préparée. Ensuite, sans mission active, il indique « Attendre · 1 tour » et explique que le monde évolue quand même. Annuler retire les préparations ; suspendre et reprendre conservent les actes déjà appliqués et les échéances initiales.

## Lisibilité

- Les destinations portent des noms usuels ; les lettres de sommets internes restent dans les données, pas dans les boutons. Chaque fiche explique la fonction du lieu.
- Le quai occupe tout l'écran, sans bandeau haut ou bas. Guide, fiches et commandes flottent au-dessus de la scène. Sur téléphone, le fond 3D reste plein écran pendant le défilement des blocs. Les cibles restent au moins de 44 pixels CSS.
- Vue haute et hangar masqué au départ. Les paramètres sont regroupés sous « Affichage du quai », avec leur effet expliqué. Ils ne changent aucune observation.
- Robots agrandis, visibles devant le décor lorsqu'une observation autorise leur silhouette ; les observations anciennes restent hachurées. Aucun objet inconnu n'est créé pour assurer cette visibilité.
- Les positions reçues sont animées pendant 1,1 seconde, et leur étiquette suit le mouvement. La préférence système de réduction des animations est respectée. Le prochain tour est indisponible pendant cette présentation ; elle n'applique aucune règle et ne fait pas avancer le temps.
- Flèches sur les trajets proposés, indication de la prochaine cible et retour après chaque tour (départ, arrivée, refus ou attente). Les confirmations de livraison et leur provenance restent distinctes.

## Modes, objectifs et aide

« Jouer / changer de mode » présente trois choix décrits : Apprendre (deux livraisons, sans score), S'entraîner (checkpoint du Dernier passage au tour 4, sans record), Défi (poste complet de seize tours). « Recommencer » repart du début du mode courant ; « Comment jouer ? » explique but, gestes, lieux, réussite et commandes.

Les réglages de mission sont accessibles par « Régler la mission », sans envahir la première livraison. Les trois emplacements se débloquent comme en P6. Les cartes expliquent que le critère d'EVA influence ses propositions, sans modifier les conditions physiques du défi.

Les objectifs de défi emploient des noms de services, des actions concrètes et des plages de tours, par exemple « Fourniture 3 à l'atelier, entre les tours 9 et 12 ». Les horaires détaillés sont repliés. Le score reste absent jusqu'à la clôture.

Le défi propose un **guidage facultatif, marqué entraînement dès activation**. Il ne peut pas être désactivé dans cet essai et n'écrit aucun meilleur record. Le joueur exécute toujours chaque tour. Le guidage montre notamment qu'un robot ayant livré occupe encore la réception et doit en sortir. La carte partagée porte « Entraînement guidé · Hors record ».

Le parcours guidé courant termine à 1 100 : EVA groupe les fournitures 3 et 4 pour réduire les déplacements, puis les reçoit au tour 14. La troisième fourniture manque sa période 9–12. Le bilan expose ce reçu et ce délai, sans transformer la proposition en résultat optimal. Choisir une contrainte de durée est un moyen à explorer pour modifier la tournée ; le guide ne change jamais les cartes à l'insu du joueur.

## Frontières et recherche

Le moteur demeure dans un worker. Le contrôleur reçoit les capacités publiques de session ; le rendu reçoit exclusivement VueJoueur. Le guide et les retours lisent cette vue et le contrat public. L'explication des points perdus n'apparaît qu'après réception du bilan final. Elle met en regard ses résultats, les conditions publiques et les reçus observés ; elle ne calcule pas le score.

La recherche reste limitée à dix impulsions, 6 000 états et 100 000 transitions. Son résultat interne distingue les recherches exhaustives dans leur domaine des recherches interrompues. L'interface utilise seulement « Plan proposé selon les informations reçues », avec durée prévue et possibilité d'information périmée. Aucun libellé ne promet une optimalité générale.

Le prototype pilote les transports et l'observation. Les horaires de ferry et de passerelle sont automatiques, indiqués comme tels. Les commandes manuelles d'équipement et les réparations ne sont pas ajoutées par cette passe UX.

## Validation

- Revue adverse dans un contexte neuf : voir [REVUE-P8.md](../../REVUE-P8.md).
- Tests navigateur : souris, tactile simulé, clavier, annulation, réglages, suspension/reprise, non-fuite visuelle, apprentissage de deux livraisons et défi guidé jusqu'au bilan, sans record aidé.
- Le test de mouvement vérifie que l'étiquette se déplace pendant l'animation et que l'exécution reste bloquée pendant ce temps.
- Les captures didacticiel-accueil/trajet/mouvement/livraison et didacticiel-defi-termine sont reproduites par les tests.
- Les parcours ont été réellement exécutés dans Edge/Playwright et les captures examinées, dont une fenêtre 1 024 × 768. Cela ne constitue pas un test de compréhension avec un nouveau joueur humain.
