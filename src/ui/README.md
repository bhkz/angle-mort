# Boucle jouable — P6

## Entrée en jeu

`npm run dev` ouvre une **première livraison distincte du Dernier passage** : à t0, R1 est en P avec une pièce destinée à l'atelier Q. P–Q est une seule arête. Sélectionner R1 dans la scène, sélectionner l'atelier, puis exécuter fait réellement déplacer le robot et livrer le colis à t1. Aucun trajet n'est téléporté, aucune impulsion n'est sautée et aucune réception n'est ajoutée par l'interface. La scène montre le déplacement entre les deux positions observées, puis le colis reçu.

La situation conserve le graphe du quai. Un colis médical en P permet ensuite la livraison à l'infirmerie F ; deux lots d'atelier attendent au dépôt O. Il s'agit d'un choix explicite de mise en main pour l'objectif des trente secondes, pas d'une modification des cinq témoins. Le bouton « Dernier passage » ouvre séparément le checkpoint t4, avec porte bloquée, R1 en T chargé de batterie/Q2 et R2 en H. Ses règles physiques, délais et scores restent inchangés.

L'accueil contient des noms d'objets, un objectif et des commandes, sans texte tutoriel ni étapes à lire. Les explications d'un refus et la provenance des observations n'apparaissent que dans la fiche sélectionnée. La confirmation de livraison provient exclusivement d'un rapport de localisation `recu` du colis ; elle distingue la date de réception de la date d'observation. Les reçus importés d'avant le checkpoint ne déclenchent pas cette confirmation.

## Contrôles

- Souris et doigt : toucher un robot puis une destination, sans glisser ni survol. Les boutons de scène et les cartes de robots sont des cibles natives de 44–48 pixels CSS minimum. Le raycast 3D ne traverse que les objets déjà présents dans la scène autorisée.
- Clavier : Tab / Maj+Tab et Entrée / Espace activent les boutons. `1` sélectionne R1, `2` R2, `A` choisit l'atelier ; après ce raccourci de destination, Entrée exécute le plan préparé. Échap ferme la fiche et annule la préparation en cours.
- « Composer une mission » ouvre les cartes. « Confier une tournée à EVA » demande une recherche de transport ; « Rejoindre le dépôt » prépare un déplacement direct. Depuis C ou la porte, « Observer depuis C » affecte R2 au poste d'observation.
- « Exécuter » résout **une seule impulsion**, pour tous les robots ayant des actions engagées, puis rend la main. Une mission active continue au prochain clic sans devoir la recomposer.
- « Annuler » retire toutes les modifications préparées, en conservant les missions précédemment engagées. « Suspendre » prépare leur arrêt à la prochaine frontière d'impulsion ; « Reprendre » recalcule sans annuler aucun mouvement ni aucune réception déjà appliqués. L'expiration initiale ne glisse pas à la reprise.
- Cadrages, zoom, coupe et sélection ne font pas avancer le moteur. La fiche unique est ancrée à la sélection, avec placement qui évite les cibles de destination ; sur téléphone elle reste au-dessus des commandes d'exécution. Sa fermeture conserve le robot choisi pour pouvoir désigner une destination.

## Cartes de mission

| Emplacement | Apparition dans l'entrée en jeu | Effet réel |
| --- | --- | --- |
| Ce qu'on compte | Dès la première composition | `receptionDestination` ou `transfertOuReception` |
| Qui passe d'abord | Après la première réception observée | Poids médical 1 ou 3 dans le critère du planificateur |
| Ce qui doit être respecté | Après la deuxième réception observée | Zone de quai bas, réception critique exigée ou expiration à quatre impulsions |

Les emplacements déjà introduits restent accessibles. Le Dernier passage expose les trois dès son lancement. La carte critique y exige la batterie à t8 au plus ; dans l'entrée en jeu elle exige la réception médicale. Les cartes modifient les champs du contrat, sans saisie libre ni grille de coefficients. Choisir explicitement une destination avec une cargaison correspondante impose sa réception ; une tournée EVA laisse le critère comparer les traitements des différents colis.

La recherche est bornée à dix impulsions, 6 000 états et 100 000 transitions par calcul. Elle utilise le planificateur P3. Les passages inconnus sont bloqués dans la prévision ; les observations datées sont utilisées comme dernières valeurs, avec les hypothèses conservées dans le résultat. Le libellé « optimal selon les observations » exige un résultat exhaustif ; sinon l'interface indique seulement « plan proposé ». Les trajets directs utilisent un BFS stable sur les croyances, sans certificat de faisabilité physique.

Un refus prévu conserve sa raison sur la fiche du robot. Deux prochains déplacements visant le même sommet ou échangeant leurs positions sont signalés avant exécution à partir des intentions et des positions observées. Un refus physique imprévu produit uniquement le constat local autorisé et suspend la mission pour reprise.

## Séparation des couches

- `src/ui/` gère sélection, commandes, cartes, focus, motifs et textes. Il ne reçoit jamais l'état réel.
- `src/view/` reçoit uniquement `VueJoueur`. Ses événements de sélection contiennent des identifiants autorisés. Les aperçus et animations utilisent les rapports reçus, jamais une position secrète.
- `src/session/controller.ts` conserve les propositions réversibles et missions engagées. Le worker lui remet un objet de capacités limité à `getPlayerView`, `submitOrders`, `advance`, `configureMission` : aucun lecteur auteur n'est disponible, même à l'exécution.
- `src/session/beliefs.ts` traduit exclusivement les faits reçus et le catalogue public vers le planificateur. Les horaires annoncés concernent la passerelle ; aucun calendrier secret ni variante de porte ne passe dans la requête ou dans l'UI.
- `src/sim/` revérifie chaque droit et action. `configureMission` remplace un contrat préalablement délégué, sans pouvoir élargir ses ressources, droits, zone maximale ou durée. Il n'est appelé qu'à l'engagement, jamais pendant la préparation. Les clôtures connues du contrôleur exigent une réception observée, ou un dépôt commandé confirmé par une observation contemporaine.

Les sources locales des robots, ainsi que les lecteurs visuels en O/T/P/Q/F, observent les colis dans leur couverture géométrique. Ce sont ces faits, et non le registre auteur des réceptions, qui alimentent les missions, les cartes débloquées et la confirmation de livraison. Énergie et activité sont transmises explicitement par la télémétrie des robots. L'âge est écrit et accompagné de motifs : bord plein au présent, pointillés/hachures pour l'historique, point d'interrogation pour l'inconnu.

## Vérification et captures

`npm test`, `npm run test:e2e` et `npm run build` vérifient moteur, planificateur, contrôleur, interface et rendu. Les tests navigateur exécutent les trois gestes sans assistance textuelle, mesurent moins de trente secondes après chargement et vérifient le reçu à t1. Ils couvrent aussi le clavier, les dimensions tactiles, l'annulation, les cartes progressives, deux livraisons, suspension/reprise, ainsi que les invariants visuels P5. Les temps mesurés sont ceux de parcours automatisés Edge/Playwright, pas d'un essai utilisateur humain ni d'un téléphone physique.

Captures reproductibles par `npm run test:e2e` :

1. `artifacts/sequence-01-robot.png` — sélection du robot.
2. `artifacts/sequence-02-preparation.png` — destination et mission préparées, toujours à t0.
3. `artifacts/sequence-03-livraison.png` — réception à l'atelier à t1.
4. `artifacts/sequence-tactile.png` — même réception au viewport tactile 390 × 844.

Le contrôle manuel des équipements et les réparations restent hors de ce prototype ; sélectionner ces équipements permet leur inspection ou l'affectation d'un observateur. Les missions de transport et d'observation, la préparation annulable et leur exécution sont jouables.
