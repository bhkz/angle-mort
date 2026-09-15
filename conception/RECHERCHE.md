# Recherche utile à la conception

Recherche documentaire effectuée le 15 septembre 2026. Ce document distingue les descriptions des sources, les observations empiriques et les hypothèses de design. Les références de jeux sont des inspirations analysées à partir des présentations et documents de leurs auteurs ; aucune session de jeu ni étude utilisateurs n'a été menée dans ce travail.

## 1. Apprentissage, public et interaction

**Intégrer le contenu au geste.** Habgood et Ainsworth comparent notamment plusieurs versions de *Zombie Division*, dans lesquelles le contenu mathématique est plus ou moins lié à l'activité ludique. Ce dispositif expérimental est plus utile ici qu'une liste de jeux prétendument « éducatifs qui marchent ». L'étude concerne des enfants et les mathématiques : elle ne démontre pas un transfert automatique vers la compréhension de l'IA chez des adultes. Décision proposée : comparer le plaisir du mécanisme seul et le transfert vers un autre problème, séparément. [Publication, copie universitaire](https://tca2.education.illinois.edu/docs/librariesprovider23/default-document-library/j-of-the-learning-sc-2011-habgood.pdf?sfvrsn=c838d23d_2).

**Réussite et échec relatifs.** Les variantes intégrées et extrinsèques de cette recherche permettent d'étudier le risque d'un exercice scolaire seulement décoré comme un jeu. Nous n'attribuons pas un échec commercial ou pédagogique global à un titre sans données. La synthèse des spécialistes complète ce point dans les contributions.

**Révéler les commandes au bon moment.** Nielsen distingue la révélation de fonctions avancées et la présentation des étapes dans une séquence. Notre application proposée : faire apparaître un pouvoir lors d'une situation qui permet immédiatement de l'essayer, tout en gardant visibles les contraintes déjà utiles. Cela ne prouve pas encore la qualité de notre interface. [NN/g, 2006](https://www.nngroup.com/articles/progressive-disclosure/).

**Partir d'un désir de contrôle.** L'enquête Pew de 2025 compare des adultes américains et un échantillon américain d'experts IA. Elle relève des perceptions différentes et un souhait de contrôle dans les deux groupes. Ce résultat n'est pas une mesure du public français ni de notre audience future. Hypothèse de design : donner une capacité d'action compréhensible dès le début, puis montrer ce que la délégation apporte. [Pew Research Center, 3 avril 2025](https://www.pewresearch.org/internet/2025/04/03/how-the-us-public-and-ai-experts-view-artificial-intelligence/).

**Vérifier une affirmation.** La méthode SIFT propose de s'arrêter, examiner la source, chercher une meilleure couverture et retrouver le contexte original. Adaptation ludique envisagée : les informations sont des moyens de départager des hypothèses et d'ouvrir des actions, avec un coût d'enquête visible. L'identité du locuteur ne donne jamais automatiquement la vérité. [Mike Caulfield, méthode originale](https://hapgood.us/2019/06/19/sift-the-four-moves/).

## 2. Principes scientifiques de cadrage

Le rapport international de février 2026 distingue usages malveillants, défaillances et risques systémiques. Les vues sur la perte de contrôle divergent et dépendent des hypothèses retenues. Ce rapport est une synthèse de travaux ; il ne recommande pas une politique unique. Décision : documenter la chaîne de chaque événement, sa base empirique et la part de fiction, avec un accès documentaire facultatif après la scène. [Rapport international 2026, résumé étendu](https://internationalaisafetyreport.org/publication/2026-report-extended-summary-policymakers).

DeepMind décrit des exemples de *specification gaming* où l'agent satisfait un critère mesuré en manquant l'intention du concepteur. Décision : donner à voir un résultat local séduisant dont on peut examiner les bénéficiaires et les exclus. Ces exemples ne constituent pas une explication universelle de tous les comportements non désirés. [DeepMind, 21 avril 2020](https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/).

## 3. Références de jeu : dispositifs à examiner

| Référence primaire | Dispositif documenté / piste d'analyse | Adaptation envisagée et limite |
| --- | --- | --- |
| [Into the Breach](https://subsetgames.com/itb.html) | Menaces annoncées, tactique compacte | Montrer l'effet local ; réserver l'incertitude aux informations que l'on peut enquêter. Ce n'est pas une preuve de transfert pédagogique. |
| [Papers, Please](https://papersplea.se/) | Métier concret et version adaptée au toucher | Faire porter les dilemmes par une tâche. Éviter la multiplication de formulaires. |
| [Citizen Sleeper](https://www.fellowtraveller.games/citizen-sleeper) | Actions limitées et relations dans un même cycle | Un choix de ressources affecte une personne récurrente. Ne pas reprendre son volume de texte comme contrainte. |
| [80 Days](https://www.inklestudios.com/80days/) | Voyage, ressources et narration flexible | Les déplacements et les contraintes peuvent déclencher le récit. L'ampleur de contenu serait excessive pour notre prototype. |
| [Overboard!](https://www.inklestudios.com/overboard/) | Personnages qui agissent et mémorisent | Un témoin possède une perspective située ; pas de vérité distribuée arbitrairement. |
| [Return of the Obra Dinn](https://obradinn.com/) | Enquête et déduction dans un lieu circonscrit | Réutiliser des lieux porteurs d'indices ; éviter la recherche d'un pixel. |
| [Infinifactory](https://www.zachtronics.com/infinifactory/) | Construire, lancer, optimiser | Tester si l'assemblage ou la chorégraphie suffit à donner envie de rejouer. Ne pas importer sa complexité entière. |
| [The Evolution of Trust](https://ncase.me/trust/) | Expérience interactive sur la confiance | Référence à jouer pour comparer l'explication par essais ; notre enquête documentaire ne mesure pas son efficacité. |
| [Natural Numbers in Game Design](https://www.pentadact.com/2015-09-25-natural-numbers-in-game-design/) | Essai de Tom Francis sur des propriétés représentées concrètement | Montrer une équipe occupée ou une porte inaccessible au lieu d'une jauge abstraite. Il s'agit d'un avis de concepteur. |

## 4. Sources complémentaires et vérification

Les spécialistes documentent dans [leurs contributions](contributions/) les sources sur alignement, psychologie, géopolitique et technologies web. Le registre scientifique et les arbitrages consolidés figurent dans les annexes finales. Les citations d'acteurs politiques ou industriels décrivent leurs déclarations et leurs intérêts affichés ; elles ne certifient ni leur sincérité ni la réussite des politiques annoncées.

Les propositions de mécaniques, durées, scores de sélection, budgets de performance et critères de playtest sont des hypothèses de production de l'équipe, non des faits issus de ces sources.
