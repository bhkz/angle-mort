# ANGLE MORT — séquence de prompts de développement

Établi le 15 septembre 2026, d'après `conception/DOSSIER-V2.md` et les pratiques
documentées pour les agents de code (voir Sources en fin de fichier).

---

## Faut-il juste un prompt « code ça » ?

Non, pour trois raisons.

1. **La fenêtre de contexte se dégrade.** La documentation officielle de Claude Code
   pose que presque toutes les bonnes pratiques découlent de cette seule contrainte :
   plus le contexte se remplit, plus le modèle oublie les instructions du début.
   Un jeu entier dans une session, c'est la fin de session qui contredit le début.
2. **Un seul prompt ne donne aucune boucle de vérification.** L'agent s'arrête quand
   le travail *a l'air* fini. Sans test à lancer, « a l'air fini » est le seul signal
   disponible, et c'est toi qui deviens la boucle de vérification.
3. **Tu as un atout rare que ce serait du gâchis de perdre.** `V2-01-GAMEPLAY.md §4`
   et `V2-04-TRAJETS.md §3` contiennent déjà **les bonnes réponses calculées à
   l'avance** : six valeurs de J, cinq témoins de trajet, cinq scores. Ce sont des
   tests d'or prêts à l'emploi. Ils permettent à l'agent de se corriger tout seul.

**Le compromis retenu :** peu de prompts (9), mais chacun ouvre une session dédiée,
pointe vers un document de spécification, et se termine par une vérification
exécutable. Tu tapes peu ; l'agent boucle beaucoup à l'intérieur de chaque session.

---

## Règles d'usage (à respecter, c'est là que ça se joue)

- **Un prompt = une session.** Fais `/clear` entre chaque. Ne mélange pas deux étapes.
- **P1 en mode plan** (`Shift+Tab` jusqu'à `⏸ plan mode on`). Les autres en mode normal.
- **Après P1, lis la section « Points à trancher »** du spec et réponds-y avant P2.
  C'est le seul moment où ton avis est indispensable.
- **Si tu corriges deux fois la même chose**, ne corrige pas une troisième : `/clear`
  et réécris le prompt en y intégrant ce que tu as appris.
- **Exige la preuve.** À chaque fin de session, demande la sortie des tests ou une
  capture, pas une affirmation.

**Le piège propre à ce projet :** l'agent va spontanément rendre l'affichage
« serviable » et faire fuiter des informations sur les zones non observées. C'est le
mode d'échec numéro un d'ANGLE MORT, parce qu'il détruit à la fois la peur et la
pédagogie. D'où l'ordre choisi : le modèle d'information (P4) est verrouillé par des
tests **avant** que la 3D (P5) existe.

---

## P0 — Amorçage

```
Initialise le projet de jeu à la racine C:\Users\thoma\jeu.

Le dossier conception/ contient la conception complète. DOSSIER-V2.md est la
référence active ; DOSSIER.md et ANNEXES.md sont des archives V1. Ne modifie
aucun fichier de conception/.

Crée :
- un dépôt git sur la branche main, avec un .gitignore Node
- un projet Vite + TypeScript en mode strict, à la racine, avec Vitest
- l'arborescence src/sim/, src/planner/, src/view/, src/ui/, tests/
- three et @types/three en dépendances
- un CLAUDE.md de moins de 60 lignes

Le CLAUDE.md ne contient que ce qui ne se devine pas en lisant le code :
- les commandes : npm run dev, npm test, npm run build, npm run typecheck
- IMPORTANT : src/sim/ et src/planner/ n'importent jamais three, ni le DOM, ni
  window. Ils tournent sous Node. Le rendu lit l'état de la simulation et
  n'écrit jamais dedans.
- déterminisme : aucun Math.random ni Date.now dans src/sim/ ; RNG à graine
  explicite ; le temps n'avance que par impulsions entières.
- la conception fait autorité : conception/DOSSIER-V2.md et
  conception/contributions/V2-*.md.
- lancer npm test avant de déclarer une tâche terminée.

Vérifie que npm test et npm run build passent sur le squelette, puis commit.
```

---

## P1 — La spécification technique  *(mode plan)*

```
Lis @conception/DOSSIER-V2.md (sections 6, 14, 15, 16, 20),
@conception/contributions/V2-01-GAMEPLAY.md,
@conception/contributions/V2-04-TRAJETS.md et
@conception/contributions/V2-04-TRAJETS.mjs.

Ces documents décrivent les règles du jeu en prose. Écris SPEC-SIM.md à la
racine : leur traduction technique exhaustive et non ambiguë, destinée à être
implémentée telle quelle.

SPEC-SIM.md doit contenir :

1. Les types TypeScript : graphe, sommet, arête, robot, colis, service, besoin,
   équipement, source d'observation, contrat de mission, droit.
2. L'ordre de résolution exact d'une impulsion, donné dans V2-04 §1 :
   événements programmés -> déplacements admissibles -> réceptions ->
   observations -> échéances. Détaille chaque étape.
3. Les règles de mouvement : une arête par impulsion ; un robot au plus par
   sommet ; pas d'échange de position sur une arête ; entrée permise dans un
   sommet libéré à la même impulsion ; capacité deux colis ; chargement et
   déchargement instantanés à l'arrivée ; commande bloquée = impulsion
   consommée sans déplacement, avec constat local du refus.
4. Les trois états d'observation (observé maintenant / dernière observation
   datée / inconnu) et la règle de non-fuite : aucune information sur un lieu
   non observé n'atteint le joueur, par aucun canal.
5. Le modèle de mission : objectif, zone, durée, accès, ressources ;
   vérification des droits à l'exécution ; suspension au prochain point d'arrêt ;
   une action atomique déjà appliquée reste appliquée.
6. Le barème : 4 fenêtres (0,4] (4,8] (8,12] (12,16], 3 services, 12 besoins,
   100 points une seule fois par besoin, maximum 1200, et la condition physique
   propre à chaque service.
7. Les seuils de perte du Dernier passage : réception à t8 sauve le stock ;
   t9 ou t10 sauve la pompe seulement ; à partir de t11 l'atelier reste fermé.
8. La liste explicite des tests d'or : les six lignes d'optima de V2-01 §4 et
   les cinq témoins de V2-04 §3 avec leurs scores 1200, 1100, 1000, 1000, 800.

Termine par une section « Points à trancher » listant toute règle que les
documents laissent ambiguë, incomplète ou contradictoire. Ne devine jamais en
silence : si deux passages se contredisent, dis-le.

N'écris aucun code dans cette session.
```

> **Arrête-toi ici.** Lis les « Points à trancher », réponds-y, fais mettre à jour
> SPEC-SIM.md, puis commit. C'est cinq minutes qui t'en économisent trois heures.

---

## P2 — Le moteur et ses tests d'or

```
Implémente src/sim/ d'après @SPEC-SIM.md, sections 1 à 5 et 7. Uniquement le
moteur déterministe : pas de planificateur, pas de rendu, pas d'interface.

L'API doit permettre de construire un état initial depuis une description de
scénario, de soumettre des ordres, d'avancer d'une impulsion, et de lire
séparément l'état réel (vue auteur) et la vue joueur (observations seules).

Écris ensuite tests/temoins.test.ts qui reproduit les cinq témoins de
@conception/contributions/V2-04-TRAJETS.md §3 en pilotant le vrai moteur.
Attention : @conception/contributions/V2-04-TRAJETS.mjs resimule les règles
dans son coin — c'est ta référence de comportement attendu, pas une
implémentation à copier. Ton test doit produire les mêmes impulsions de
réception, les mêmes dégâts et les mêmes scores 1200, 1100, 1000, 1000, 800.

Ajoute un test de déterminisme : même scénario, mêmes ordres, même graine,
exécuté deux fois, donne un état final identique.

Lance npm test et itère jusqu'au vert. Montre-moi la sortie. Commit.
```

---

## P3 — Le planificateur

```
Implémente src/planner/ d'après @SPEC-SIM.md.

Recherche finie bornée sur les plans légaux, construite à partir des croyances
du planificateur — jamais de l'état réel — et des droits disponibles. Départage
stable et documenté. Si la recherche n'est pas exhaustive, le résultat ne doit
jamais être présenté comme optimal.

Test d'or obligatoire : le microcas de
@conception/contributions/V2-01-GAMEPLAY.md §4. Graphe O-T-A et T-X-Y-B, un
robot, capacité deux, six impulsions,
J = 10 x (clôtures commerciales + w x clôture médicale) - nombre de déplacements.
Les six configurations du tableau doivent produire les J annoncés
(18, 34, 27, 47, 44, 34) et les réceptions physiques décrites.

Ce tableau est le cœur pédagogique du jeu : si changer la mesure ne change pas
le plan, le jeu ne fonctionne pas. Le test doit échouer si le planificateur
devient insensible au critère choisi.

Ajoute un test vérifiant qu'un plan refusé indique sa raison : accès absent,
échéance impossible, ou conflit matériel.

npm test, itère, montre la sortie. Commit.
```

---

## P4 — L'information partielle  *(la session la plus importante)*

```
Implémente la couche d'observation de @SPEC-SIM.md §4 dans src/sim/ : sources
d'observation (caméra fixe, robot en poste, capteur de franchissement),
couverture géométrique, âge de l'observation, et la vue joueur qui en découle.

Écris ensuite le test d'invariant central du projet : la non-fuite.

Construis les deux variantes du Dernier passage
(@conception/contributions/V2-04-TRAJETS.md §2) : porte qui se rouvre, porte
bloquée jusqu'à la fin du poste. Sans observateur en C, les deux variantes
doivent produire à t4 une vue joueur strictement identique : sérialise la vue
joueur et compare les deux sérialisations. Avec un observateur en C, elles
doivent diverger à l'impulsion prévue.

Généralise en test de propriété : pour toute paire d'états cachés que les
observations du joueur ne distinguent pas, la vue joueur sérialisée doit être
identique. Cela couvre les positions, les silhouettes, les sons, les aperçus de
trajet et les coûts affichés.

npm test, itère. Commit.
```

---

## P5 — La 3D

```
Implémente src/view/ avec Three.js : le Quai 17 de @conception/DOSSIER-V2.md
§18, en primitives et matériaux simples.

Géométrie d'après @conception/contributions/V2-04-TRAJETS.md §1 :
O-T-G-A-P-Q, détour T-D-E-F-P, observation T-H-C. C est une coursive au-dessus
du hangar avec vue indépendante sur la porte A ; G-A traverse cette porte ;
A-P est la passerelle mobile, relevée aux impulsions 5-6, 9-10 et 13-14.

Règles impératives :
- le rendu lit l'état et n'écrit jamais dedans ; aucune règle de jeu dans src/view/ ;
- le rendu ne reçoit QUE la vue joueur et n'a aucun accès à l'état réel, pour
  que la fuite d'information soit impossible par construction ;
- un objet non observé s'affiche à sa dernière position datée, avec une
  représentation visuellement distincte d'un objet observé ;
- la caméra de présentation a deux cadrages et un zoom ; la déplacer n'acquiert
  aucune information ;
- effacer un mur pour faciliter la sélection ne révèle aucun objet caché.

Caméra orthographique fixe, résolution interne plafonnée.

Vérifie avec npm run dev, puis montre-moi une capture du quai à t4 dans la
variante porte bloquée sans observateur : la porte doit apparaître comme
inconnue, pas comme fermée. Commit.
```

---

## P6 — Jouable

```
Implémente src/ui/ et relie l'ensemble. Le jeu doit être jouable à la souris,
au doigt et au clavier.

Boucle de @conception/DOSSIER-V2.md §6 : composer, agencer, exécuter, reprendre.
Sélectionner un objet ouvre ses actions sur place. La préparation est en pause et
annulable ; seule l'exécution d'une impulsion fait avancer le monde.

La fiche de mission a les trois emplacements de §14, introduits progressivement :
ce qu'on compte, qui passe d'abord, ce qui doit être respecté. Des cartes
concrètes — pas de saisie libre, pas de grille de coefficients.

Contraintes UX de §17 : cibles tactiles de 44 à 48 px CSS ; sélectionner puis
destination, sans glisser ni survol obligatoire ; une seule fiche contextuelle à
la fois ; âge et source de l'observation lisibles par texte et par motif, pas
seulement par couleur.

Objectif mesurable de cette session : après chargement, on doit pouvoir toucher
un robot, toucher l'atelier, exécuter, et voir la livraison aboutir — en moins
de trente secondes, sans une seule explication écrite à l'écran.

Montre-moi une capture de cette séquence. Commit.
```

---

## P7 — Le défi et le partage

```
Implémente le défi de @conception/DOSSIER-V2.md §16 et
@conception/contributions/V2-04-TRAJETS.md §4 : 16 impulsions, 4 phases,
3 services, 12 besoins, 100 points chacun, maximum 1200.

Règles à respecter strictement :
- un besoin ne rapporte qu'une fois ; reclasser une demande, répéter un reçu ou
  réparer n'ajoute aucun point ;
- le bilan définitif n'apparaît qu'à la fin de la tentative ; aucun compteur
  omniscient pendant la partie ;
- l'état d'un service découle de son alimentation, de son équipement et de ses
  accès — jamais de son inscription au registre ;
- la dernière phase exige l'état opérationnel au contrôle de clôture ;
- la carte de partage suit le format de §16, se copie à la demande, et ne publie
  rien automatiquement.

Ajoute un test qui essaie de tricher : reclasser une demande, répéter un reçu,
démanteler un service juste après l'avoir satisfait, satisfaire un besoin hors
de sa fenêtre. Aucun de ces actes ne doit rapporter de points.

npm test, itère. Commit.
```

---

## P8 — Revue adverse

```
Utilise un subagent pour relire le diff complet depuis le premier commit, dans
un contexte neuf. Il vérifie uniquement ces six points :

1. src/sim/ et src/planner/ n'importent ni three, ni le DOM, ni window —
   à vérifier par grep, pas par lecture.
2. Aucun Math.random ni Date.now dans src/sim/.
3. Le rendu ne reçoit que la vue joueur et ne peut pas atteindre l'état réel.
4. Les six valeurs de J du microcas et les cinq témoins sont testés et passent.
5. Les seuils de perte t8 / t9-t10 / t11 sont dans le moteur, pas dans l'interface.
6. Rien n'est présenté comme « optimal » alors que la recherche est bornée.

Qu'il ne rapporte que les écarts touchant la correction ou ces six exigences ;
les préférences de style ne sont pas des trouvailles. Corrige ensuite ce qui est
remonté, puis commit.
```

---

## Après P8

La suite n'est plus « construis X », c'est « joue et corrige la sensation ».
Ces prompts-là ne se planifient pas à l'avance : ils dépendent de ce que tu
ressens une fois la manette en main.

Deux garde-fous pour cette phase :

- **Ne laisse pas l'agent ajouter du contenu pour compenser un problème de
  sensation.** Si la boucle est molle, plus de missions ne la rendra pas tendue.
- **Rien dans cette séquence ne prouve que le jeu est amusant.** Les tests
  prouvent que les règles sont correctement implémentées — ce qui est
  indispensable et insuffisant. La réponse à « est-ce que c'est fun » vient des
  portes de décision de `DOSSIER-V2.md §21`, avec de vraies personnes.

---

## Sources

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — dégradation du contexte, « donner à Claude un moyen de vérifier son travail », explorer/planifier/coder/commiter, CLAUDE.md court, `/clear` entre tâches, revue par subagent.
- [Spec-Driven Development with Claude Code — DataCamp](https://www.datacamp.com/tutorial/spec-driven-development-with-claude-code) — la spécification vit dans le dépôt, pas dans la conversation.
- [AI-Assisted Greenfield Software Development : Vertical Slices](https://www.codemag.com/Blog/AIPractitioner/AIAGSD6) et [The Codebase Is the Prompt](https://jeremydmiller.com/2026/06/04/the-codebase-is-the-prompt-wolverine-vertical-slices-and-ai-assisted-development/) — découpage en tranches verticales bornées.
- [Build a deterministic browser game engine](https://dev.to/pathprotocol/build-a-deterministic-browser-game-engine-50j0) — moteur sans écran, testable en Node, le rendu ne réécrit jamais l'état.
