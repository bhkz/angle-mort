# V2 — Trajets vérifiables du Dernier passage

15 septembre 2026. Instance de contrôle, sans validation du plaisir. Le [script](V2-04-TRAJETS.mjs) vérifie des témoins depuis un état à t4 ; il ne résout pas le poste complet.

## 1. Géométrie et résolution

Graphe bidirectionnel : `O—T—G—A—P—Q`, détour `T—D—E—F—P`, observation `T—H—C`. O est le dépôt ; P la pompe ; Q la réception des fournitures. H est l'accès haut ; C une coursive au-dessus du hangar, avec vue indépendante sur la porte A. G—A traverse cette porte. A—P est la passerelle mobile, visible en volume. Le détour reste au niveau bas et évite porte et passerelle.

Chaque déplacement prend une impulsion. Chaque sommet contient au maximum un robot. Deux robots ne peuvent échanger leurs places sur une même arête pendant la même impulsion ; entrer dans un sommet libéré simultanément par un autre robot est permis. Capacité : deux colis. Charger/décharger à destination est instantané après arrivée ; le robot continue d'occuper le sommet. Une commande bloquée consomme l'impulsion sans déplacement et produit un constat local du refus.

Résolution : événements programmés → déplacements admissibles → réceptions → observations → échéances. Une réception à t8 sauve le stock. À t9 ou t10, elle sauve uniquement la pompe ; le stock reste perdu. À partir de t11, la pompe exige une réparation extérieure, indisponible pendant ce poste ; l'atelier reste fermé au suivant. Une observation ou un changement de mesure ne répare aucun dégât.

La passerelle A—P est relevée aux impulsions 5–6, 9–10 et 13–14, pour trois passages de ferry à 6, 10 et 14. Elle est traversable aux autres impulsions. Ces créneaux annoncés sont maintenus dans les témoins ; leur commande reste une variable du futur poste complet.

## 2. Information utile et état à t4

Le robot R arrive en T à t4 depuis O, avec batterie et fourniture Q2. Le second robot est en H ou a gagné C par H→C à t4. Ce préfixe local est compatible avec leurs positions O et H à t3.

La porte a été observée ouverte à t2. Un cycle mécanique annoncé intervient au début de t4. Deux variantes fixées au lancement : **elle se rouvre**, ou **elle reste bloquée jusqu'à la fin du poste**. Le résultat du cycle n'est pas encore reçu. Aucun aperçu ne révèle secrètement la variante.

La caméra fixe passe en maintenance au début de t4 et reste indisponible pendant t4–t6, quel que soit le choix du joueur. Elle donne une nouvelle observation à la fin de t7. En C, le second robot constate indépendamment la porte à la fin de son arrivée : dès t4 s'il a été prépositionné, sinon à t5 après H→C. Maintenir cette observation immobilise un robot transporteur ; celui-ci peut repartir dès qu'une observation suffisante a été obtenue.

Sans observateur en C, les deux variantes présentent **exactement la même information à t4** : ancienne vue ouverte, cycle annoncé, résultat inconnu. Pourtant la route la plus efficace change. Ce n'est donc pas seulement la découverte tardive d'une livraison dont l'échec serait déjà déductible.

Le robot transporteur ne transmet pas d'image de la porte depuis G, derrière un coude du hangar ; sa télémétrie confirme le refus lors de la demande de franchissement. Cette couverture doit être matérialisée dans la géométrie. Si le rendu final donne réellement une vue de A depuis G, la découverte se produit à t5 et le dernier témoin doit être recalculé.

## 3. Témoins physiques

Toutes les positions commencent en T à t4. Les suites ci-dessous donnent une position par impulsion à partir de t5.

| Cas | Positions successives de R | Batterie | Conséquence |
| --- | --- | --- | --- |
| Porte ouverte, observation à t4 | G, A, P, Q | t7 | Stock et pompe sauvés ; Q2 reçue à t8 |
| Porte bloquée, détour immédiat | D, E, F, P, Q | t8 | Stock et pompe sauvés ; Q2 à t9, hors fenêtre |
| Attendre l'observation à t5 puis détour | T, D, E, F, P, Q | t9 | Stock perdu ; pompe sauvée |
| Commencer court, observation à t5, rebrousser | G, T, D, E, F, P, Q | t10 | Stock perdu ; pompe sauvée |
| Commencer court sans observateur, refus à t6 | G, G, T, D, E, F, P, Q | t11 | Stock et pompe perdus |

Dans la dernière ligne, la seconde position G correspond à la tentative G→A refusée. Au moment où la caméra revient à t7, le robot repart déjà vers T. La route directe ouverte atteint A à t6 puis traverse A—P à t7, après le ferry ; aucun témoin ne traverse la passerelle relevée.

À t4, choisir systématiquement le détour évite la perte de stock dans les deux variantes, mais rate Q2. Acquérir une observation à temps permet de choisir le court lorsqu'il fonctionne. Les deux variantes ont ainsi des stratégies préférables différentes. Cela ne prouve pas qu'occuper C soit optimal à l'échelle du poste : la mission concurrente du second robot reste à équilibrer.

## 4. Douze besoins et score conditionnel

Quatre fenêtres : `(0,4]`, `(4,8]`, `(8,12]`, `(12,16]`. Trois services : pompage P, traversées F, fournitures Q. Chaque identifiant rapporte 100 points une fois, maximum 1 200 ; aucun remplacement de demande après son échéance.

| Phase | Pompage | Ferry | Fournitures |
| --- | --- | --- | --- |
| 1 | P1 : charge initiale suffisante au contrôle t4 | F1 : première traversée réalisée | Q1 : fourniture initiale reçue |
| 2 | P2 : nouvelle batterie reçue entre t5 et t8 | F2 : traversée à t6 | Q2 : colis porté par R reçu entre t5 et t8 |
| 3 | P3 : pompe opérationnelle au contrôle t12 | F3 : traversée à t10 | Q3 : fourniture reçue entre t9 et t12 |
| 4 | P4 : pompe opérationnelle au contrôle t16 | F4 : traversée à t14 | Q4 : fourniture reçue entre t13 et t16 |

Q3 est stockée dans un casier P accessible à partir de t9 ; Q4 dans le même lieu à partir de t13. Les itinéraires du script complètent les livraisons P↔Q sans dépasser la capacité. P3/P4 sont des besoins de disponibilité distincts, annoncés au départ ; leurs points ne récompensent pas une seconde fois l'acte de réparation. Une batterie tardive mais reçue avant ou à t10 permet de les satisfaire.

**Limite :** les trois succès de phase 1 sont importés dans le checkpoint t4, pas démontrés par ces trajets. Les scores conditionnels des cinq témoins sont respectivement **1 200, 1 100, 1 000, 1 000 et 800**. Le script contrôle trajets, capacité, occupations, fenêtres et dégâts depuis t4. Il ne démontre ni optimalité globale, ni préfixe complet, ni modèle de caméra 3D : son contrôle d'observations constitue un contrat de données à implémenter et retester.
