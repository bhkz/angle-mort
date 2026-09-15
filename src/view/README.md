# Quai 17 — rendu des observations

Mise à jour P6 : l'interface est désormais dans `src/ui/`, avec une entrée en jeu à t0 et le Dernier passage accessible par son bouton. Les événements de sélection, cibles tactiles et animations entre positions observées sont décrits dans [la boucle jouable](../ui/README.md). Les indications ci-dessous décrivent le socle P5 ; son isolation et les règles d'incertitude sont conservées.

## Frontière de lecture

`createQuayView(element, vueJoueur)` construit la scène. `update(vueJoueur)` la remplace à partir des nouveaux rapports. Le module ne reçoit ni simulation, ni lecteur auteur, ni ordres. Ses seuls imports externes sont Three.js et les **types** de `VueJoueur`. Les données reçues sont gelées dans le contrôleur ; les transformations Three.js utilisent leurs propres vecteurs.

Le moteur et la description du scénario vivent dans `src/session/simulation.worker.ts`. Le worker transmet uniquement `getPlayerView()`. La variante de démonstration (porte bloquée, R2 en H, t4) est choisie dans ce worker ; aucun indicateur de variante ne passe dans l'URL, le DOM ou l'API du rendu. `src/main.ts` relaie les intentions des boutons et les rapports reçus. Les erreurs du worker sont génériques, sans diagnostic physique caché.

## Scène et géométrie

Primitives, matériaux simples et palette ardoise/ambre/cyan : dalle et bord du quai, hangar, dépôt, atelier, eau sombre, ferry amarré, coursive, garde-corps, caméra, porte, passerelle et robots. Les caisses décoratives et le bateau sont du décor statique connu, pas des colis ni des indicateurs de réussite de service. Le cadrage s'inspire de `image.png` ; ce prototype n'en reproduit pas le niveau de détail.

Le graphe et les boîtes d'occlusion **statiques** proviennent de `VueJoueur.geometrie`. L'échelle uniforme est 2,2 unités Three.js pour une unité du scénario, y vertical. Les boîtes conditionnelles ne sont pas publiées par ce catalogue : leur état caché ne devient pas une géométrie visible. Le hangar utilise exactement le volume d'observation partagé ; le chemin graphique G–A représente son coude. Les arêtes restent abstraites pour le moteur : le tracé graphique ne calcule ni durée, ni collision, ni visibilité. La coursive C surplombe le hangar et garde sa vue indépendante.

Le scénario commun a été déplacé de la fixture de test vers `src/scenarios/dernierPassage.ts` ; la fixture le réexporte. `src/scenarios/quai17.ts` ajoute une caméra qui observe la passerelle depuis Q et un diagnostic câblé de la caméra fixe. Ces sources indépendantes de la porte autorisent les indications de passerelle et de maintenance. Le rendu ne contient aucun calendrier 5–6 / 9–10 / 13–14 : l'inclinaison de la passerelle dépend exclusivement de son état reçu.

## Présentation de l'incertitude

- Rapport courant : géométrie solide, éclairage et ombres ordinaires.
- Dernier rapport daté : dernière pose reçue, fil de fer ambre transparent, sans ombre. Date et légende textuelle accompagnent la distinction visuelle. Les rapports contradictoires d'un même instant ne sont pas remplacés par la vérité physique.
- Jamais observé : aucune pose dynamique inventée. Seuls l'emplacement et le bâti statiques déjà connus peuvent apparaître. Les colis au sol/réceptionnés ne sont dessinés qu'à partir d'une observation de localisation ; la cargaison embarquée exige un rapport de chargement daté comme la position du porteur.
- À t4, la porte a un souvenir **ouvert à t2**, mais son **état actuel est inconnu**. Sa pose ouverte historique est un fil de fer ; les libellés de la scène et du panneau indiquent explicitement l'inconnu actuel. Elle ne devient visuellement bloquée qu'après un rapport autorisé (C à t5 dans la démonstration, ou caméra à t7).

`setFraming`, `setZoom` et `setCutaway` ne font qu'afficher de nouveau la même scène autorisée. Il existe deux cadrages orthographiques prédéfinis, sans caméra libre. Couper le hangar retire uniquement ses parois et son toit connus ; aucun objet caché n'existe dans la scène à révéler. L'affichage est redessiné sur changement de vue, de taille ou de contrôle, sans boucle qui consommerait du GPU en préparation. Le buffer interne est plafonné à 1600 × 1000, ratio de pixels 1, zoom de 0,75 à 1,7.

## Vérification

- `npm test` : invariants du moteur et de projection, imports autorisés du rendu, conservation des positions datées et absence de mutation.
- `npm run build` : TypeScript strict (dont les tests navigateur), sim/planner compilés sans DOM, puis build Vite avec worker séparé.
- `npm run dev` : démonstration à t4 sans observateur. « Observer depuis C » prépare un ordre ; « Exécuter » avance le moteur d'une impulsion. Les contrôles caméra ne préparent aucun ordre.
- `npm run test:e2e` : Edge headless installé, WebGL logiciel via Playwright, Vite démarré automatiquement si nécessaire. Six tests navigateur vérifient l'inconnu initial, les pixels/textes des deux variantes après coupe/zoom/cadrage, les silhouettes datées, la découverte à t5/t7, les créneaux de passerelle et le plafond de résolution/écran étroit. Les comparaisons de variantes reçoivent les vues de deux vrais moteurs exécutés côté test ; aucun état auteur n'entre dans les pages.
- `artifacts/quai17-t4.png` : capture du premier test, produite sur le vrai worker de la démonstration bloquée, à t4 sans C.

Les tests mobiles vérifient le viewport et les commandes, pas les performances sur un téléphone physique. Le rendu ne simule aucun son ni effet de dégâts non reçu. Sélection 3D, planification interactive et interface de mission complète restent à construire dans leurs sessions dédiées.
