# 13 — Faisabilité navigateur et mobile

## Recommandation indépendante de l'habillage

Construire un petit jeu local, accessible par lien : TypeScript pour les règles, Three.js pour une scène 3D fixe, HTML/CSS pour les commandes. Le premier prototype peut afficher des formes simples. Le choix définitif du moteur dépendra du geste validé ; aucune bibliothèque ne résout la lisibilité tactile ou le plaisir du jeu. Les évaluations suivantes sont des recommandations de conception, pas des benchmarks.

| Solution | Apport et limite pour ce brief |
| --- | --- |
| Canvas 2D natif | Idéal pour éprouver une grille et quelques commandes ; entrées, scènes et outils de production restent à construire. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) |
| Phaser | Framework de jeu 2D navigateur, avec scènes, entrées et rendu WebGL/Canvas. Premier choix si la profondeur 3D ne sert pas le geste. [Documentation](https://docs.phaser.io/) |
| PixiJS | Rendu 2D et gestion d'assets ; pertinent pour une interface très animée, demande davantage de structure de jeu maison que Phaser. WebGL constitue une base raisonnable ; ne pas imposer WebGPU. [Architecture](https://pixijs.com/8.x/guides/concepts/architecture), [Application](https://pixijs.com/8.x/guides/components/application) |
| Three.js | Adapté à un petit décor 3D sélectionnable, caméra fixe, silhouettes lisibles. La résolution du rendu doit être maîtrisée sur les écrans denses. [Guide responsive](https://threejs.org/manual/en/responsive.html) |
| React | Facultatif pour menus, dossiers et réglages. Conserver la simulation hors du cycle de rendu des composants ; une référence mutable peut héberger une instance externe. [useRef](https://react.dev/reference/react/useRef) |
| Godot | Bon outil de scènes et d'animation si l'équipe le maîtrise. L'export web utilise WebAssembly et WebGL 2 ; le mode monothread est désormais le défaut recommandé, avec des contraintes mobiles et audio documentées. Un export sur iPhone doit précéder toute décision. [Documentation](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html) |

## Architecture : rendre les conséquences vérifiables

Séparer quatre couches : règles, contenu, présentation, persistance. Le monde possède un état réel ; les capteurs produisent des observations partielles ; les personnages et EVA élaborent leurs rapports à partir de celles-ci. Une mauvaise information découle ainsi d'une chaîne explicable. Éviter un simple booléen « IA ment » qui modifierait arbitrairement le texte.

Les permissions autorisent des actions concrètes. L'autonomie règle quand elles nécessitent une confirmation. La capacité détermine quelles solutions sont disponibles. Ces trois éléments restent distincts dans le code, même si l'écran les introduit progressivement. Un journal interne enregistre décisions et conséquences pour reconstruire un échec.

Simulation à pas fixe ou tours discrets ; aléatoire issu d'une graine enregistrée ; aucun résultat dépendant du nombre d'images affichées. Éviter une physique flottante déterminante pour le score. Le replay conserve version des règles, identifiant du défi, graine et commandes datées en ticks. Tester qu'un même journal produit le même résultat sur les navigateurs cibles.

## Défi comparable pour JVC

Un défi publié avec conditions fixes donne une accroche simple : « Palier 7 sur le défi PORT-01, qui passe le 8 ? » Un palier désigne une situation effectivement résolue ; un départage éventuel doit rester visible et compréhensible. Graine, version, aides et mode figurent sur la carte partageable. Ne jamais mélanger les scores après un changement des règles.

Un replay local aide à comparer des stratégies et à détecter des incohérences ; un checksum détecte des corruptions accidentelles. **Aucun des deux ne prouve l'absence de triche : le joueur contrôle son navigateur.** Pour le prototype, records locaux et résultats déclarés suffisent. Un classement ultérieur demanderait une validation serveur des commandes ; celle-ci ne supprimerait pas à elle seule les bots ou les parties préparées. Le moteur doit donc pouvoir tourner sans rendu, mais aucun backend n'est nécessaire pour tester le plaisir.

## Mobile, sauvegarde et audio

Viser un geste utilisable d'une main : toucher une unité, toucher une destination, voir la prévisualisation, confirmer. Le clavier accélère ce même geste. Pas de survol indispensable. Suspendre à la perte de visibilité ; sauvegarder aux décisions stabilisées. Proposer reprise et export du fichier de sauvegarde. IndexedDB fournit un stockage structuré asynchrone, soumis aux règles et quotas du navigateur. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

Le hors-ligne est une seconde étape : service worker sous HTTPS, assets versionnés et contrôle des mises à jour entre deux parties. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) Démarrer l'audio sur « Jouer », avec équivalents visuels aux indices sonores ; l'autoplay peut être bloqué. [MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)

## Objectifs de validation, sans promesse préalable

Budget initial proposé : première scène jouable sous 5 Mo compressés ; 30 images/seconde stables sur le téléphone modeste retenu, 60 souhaitables ailleurs ; première action proposée en moins de 15 secondes après chargement. Mesurer séparément téléchargement, démarrage et compréhension. Tester Safari iOS, Chrome Android et ordinateur, perte d'onglet, reprise, petit écran et session de quinze minutes pour observer chauffe et ralentissements. Réduire résolution, ombres et effets avant les informations nécessaires au jeu.

Un LLM n'est pas requis. Des règles et répliques écrites garantissent causalité, répétabilité et disponibilité. Une conversation générée pourrait devenir une expérimentation ultérieure hors score, avec contexte borné et solution de secours ; elle introduirait latence, coût et variabilité. Aucun contenu pédagogique déterminant ne devrait dépendre d'une réponse improvisée.
