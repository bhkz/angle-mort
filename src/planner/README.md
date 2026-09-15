# Planificateur de transport

## Entrée et résultat

`planifier(requete: RequetePlanification)` reçoit uniquement :

- les croyances datées et sourcées (`CroyancesPlanificateur`) ;
- le graphe connu et les changements explicitement annoncés ;
- le contrat, les limites de ses ancêtres et les droits disponibles ;
- l'horizon en impulsions, deux budgets entiers et la politique d'incertitude.

Il n'accepte ni `Scenario`, ni `EtatReel`, ni lecteur du moteur. Ses imports de `src/sim/types.ts` sont exclusivement des imports de types. Il n'appelle pas la simulation et ne consulte aucune horloge, aucun générateur aléatoire ou état global. `npm run typecheck` compile aussi ce dossier sans types DOM ou Node implicites.

Les positions, l'énergie, les activités et les localisations des colis doivent être connues pour construire un état de travail cohérent. Une localisation inconnue produit `informationInsuffisante`. Les robots extérieurs à la mission sont supposés immobiles à leur position connue ; cette hypothèse est indiquée dans le plan.

Chaque invocation recalcule le plan depuis les croyances reçues. Le contrôleur pourra rappeler cette fonction après une nouvelle observation, demande, modification de contrat ou de droit ; aucune replanification n'est déclenchée par une modification cachée du monde.

Le résultat est discriminé par `statut` :

| Statut | Sens |
| --- | --- |
| `plan` | Plan faisable **selon les croyances**, avec J, chargement initial, ordres par impulsion, clôtures et réceptions prévues, hypothèses et compteurs de recherche |
| `refuse` | Impossibilité dans le modèle retenu, avec raisons `accesAbsent`, `echeanceImpossible` ou `conflitMateriel` |
| `incomplet` | Budget épuisé avant une solution, information insuffisante ou mécanique non prise en charge ; ne prouve pas l'impossibilité |

Une entrée structurellement invalide lève une erreur descriptive. Un refus issu d'une condition nécessaire peut être prouvé sans développer d'état : les compteurs valent alors zéro. Les vérifications utilisent des distances minimales optimistes, les disponibilités connues, les ressources et l'existence d'accès. Après une recherche exhaustive infructueuse, le diagnostic porte sur l'impossibilité conjointe de respecter les échéances avec ces accès et ressources ; il n'invente pas une cause matérielle unique.

## Incertitude explicite

La requête doit donner les deux politiques suivantes ; aucune valeur par défaut n'est choisie silencieusement :

- `inconnue: 'bloquer'` ou `'supposerPassable'` pour un passage inconnu ;
- `datee: 'bloquer'` ou `'utiliserDerniere'` pour une ancienne observation.

Chaque usage d'une ancienne valeur ou d'une hypothèse sur un passage inconnu est signalé dans `plan.hypotheses`. Les changements d'équipement annoncés futurs sont appliqués avant les déplacements de l'impulsion concernée ; les révocations annoncées s'appliquent aux droits à l'exécution prévue. Les faits initiaux doivent déjà intégrer les événements passés connus. Une absence de plan due aux croyances incertaines est un résultat incomplet, sans conclusion d'impossibilité physique.

Une contrainte de réception filtre les plans qui ne prévoient pas l'arrivée requise. Elle ne garantit pas la réception dans le monde réel. Les tests font fermer une porte à l'insu du planificateur : le plan reste identique et le moteur refuse effectivement son franchissement.

## Domaine exploré et optimalité

Le domaine est celui des plans de transport sans embranchements conditionnels, à horizon fini : une arête ou une attente par robot et par impulsion, puis manutention instantanée. Plusieurs robots peuvent agir simultanément. Le générateur élimine collisions finales et échanges d'arête ; il autorise l'entrée dans un sommet effectivement libéré.

À chaque arrivée ou attente, il énumère les choix de conserver, livrer ou déposer chaque colis porté, puis tous les chargements possibles sous capacité deux. Les dépôts et reprises au transfert demandent des droits distincts du transit. Les droits, zones, durées et ressources de tous les contrats parents sont vérifiés pour chaque action. Les livraisons finales sont irréversibles et un colis ne produit qu'une clôture.

Les répétitions de la même manutention sans effet supplémentaire sont omises : après déchargements puis chargements, elles ne produisent aucun état futur ni gain supplémentaire. Le moteur effectue également les déchargements avant les chargements. Une attente reste explorée, notamment pour une disponibilité de colis, un créneau d'accès ou une annonce future.

Le domaine s'arrête au minimum de l'horizon demandé et de la fin des contrats. Un plan peut finir plus tôt. Il n'inclut pas réparation, recharge, équipes de dernier kilomètre, acquisition d'observations, commande d'équipement ni la seconde mécanique de généralisation. La mesure `disponibiliteEquipement` renvoie explicitement `modeleNonPrisEnCharge`, sans certificat trompeur. L'optimalité porte sur ce domaine de transport, pas sur le poste complet ou une stratégie adaptative future.

La recherche progresse par couches d'impulsions. Deux préfixes de même couche sont équivalents si positions, énergie, localisations/dates de réception et ensemble de clôtures sont identiques. Ils ont les mêmes continuations possibles ; seul le meilleur préfixe selon le départage ci-dessous est conservé. Les autres préfixes sont dominés, leur suppression ne retire aucun optimum.

- `maxEtats` borne les états développés.
- `maxTransitions` borne les branches examinées, y compris les essais de mouvement, de manutention et de chargement initial. Les produits de choix sont générés paresseusement : une grande combinaison initiale n'est pas matérialisée avant de consulter le budget.
- L'épuisement de l'un des budgets donne `exhaustive: false`. Une solution déjà obtenue porte alors exclusivement la garantie `meilleurTrouve`.
- La garantie `optimalSelonCroyances` exige que le domaine soit épuisé, après suppression des seuls préfixes dominés. Elle n'est jamais retournée après interruption par budget.

## J et départage stable

Pour le microcas : `J = 10 × (clôtures commerciales + w × clôture médicale) − déplacements`.

Plus généralement, chaque nouvelle clôture utilise le poids par identifiant de colis s'il existe, sinon par nature de colis, sinon 1. Ce choix de priorité est explicite : un poids individuel remplace le poids de sa catégorie ; ils ne s'additionnent pas. Les clôtures déjà connues à l'entrée ne sont pas rémunérées à nouveau. Le coût énergétique d'une arête et la pénalité d'un déplacement dans J restent deux quantités distinctes.

Les candidats sont comparés dans cet ordre :

1. J le plus élevé ;
2. moins de déplacements ;
3. fin du plan la plus précoce ;
4. moins d'opérations de manutention, chargement initial compris ;
5. ordre lexicographique UTF-16 de la sérialisation canonique du chargement et des étapes.

Robots, colis, branches et états sont ordonnés par identifiants stables. Aucun départage ne dépend de l'ordre de stockage, de la vitesse de la machine ou d'un tirage. Une réception physique supplémentaire n'est pas ajoutée secrètement au critère de départage : le critère imparfait doit pouvoir rester imparfait.

## Chargement initial et exécution

Avec `chargementInitial: true`, uniquement à t0, la recherche énumère le chargement gratuit des robots présents à un dépôt, selon les droits et la capacité. Le résultat `plan.chargementInitial` décrit ces choix avant construction de la simulation ; il ne consomme pas une des six impulsions du microcas. C'est le même modèle d'initialisation que `src/sim/`, où le chargement initial est fourni dans la description du scénario.

Pour planifier depuis une partie déjà engagée, utiliser `chargementInitial: false` et les localisations réellement observées. Aucune manutention gratuite n'est ajoutée au milieu d'une partie.

Les `plan.etapes` contiennent des `Ordre` directement utilisables avec `submitOrders`, puis `advance`. Les prédictions du planificateur n'écrivent jamais dans la simulation ; seuls les ordres passent au moteur, qui revérifie droits et conditions physiques.

## Tests d'or

`tests/planner.test.ts` construit les six configurations de G §4 sans itinéraire prédéfini. Les recherches doivent être exhaustives dans le budget et produire **18, 34, 27, 47, 44, 34**. Chaque plan est rejoué dans le moteur : réceptions physiques, clôtures, déplacements et absence de refus sont contrôlés. Les deux commerciaux doivent rester en T dans le cas du médical exigé.

Un test distinct ne change que la mesure : les ordres doivent changer et le résultat passe de deux réceptions réelles à aucune. Les autres tests couvrent refus motivés, budgets, observations inconnues/périmées, événement caché, révocation annoncée, deux robots et stabilité sous permutation des entrées.
