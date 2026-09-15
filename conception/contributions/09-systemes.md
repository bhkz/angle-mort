# Contribution indépendante — 09. System design

## Conclusion

Le noyau doit simuler **des actions possibles, leurs effets et les informations disponibles**. Il peut alimenter une enquête, un puzzle spatial ou une gestion narrative sans imposer un genre. Je recommande huit règles et quatre types d'objets : lieux/services, acteurs, missions et observations. La dépendance se lit dans les connexions ; la confiance se manifeste dans les comportements des personnages. Aucune jauge globale de danger, d'alignement ou de vérité.

## Huit règles du noyau

### 1. Le monde et ses descriptions sont séparés

L'état réel contient stocks, besoins, commandes et installations disponibles. Une observation contient une valeur ou affirmation, sa provenance, sa date, son périmètre et son procédé d'obtention. Un rapport peut être exact mais ancien ou incomplet. Lire trois copies du même communiqué ne crée pas trois confirmations. L'enquête ajoute des observations ; elle ne modifie pas rétroactivement les faits. Le joueur peut réellement résoudre certaines incertitudes.

### 2. Le temps avance quand une action engage le monde

Lire et préparer sont gratuits. Envoyer une équipe, lancer une opération ou attendre avance d'un intervalle. Tous les acteurs exécutent alors leurs tâches autorisées. Ordre stable : appliquer les révocations, valider les autorisations, réserver les ressources, exécuter les tâches échues, propager les effets, produire les observations. Une animation peut durer cinq secondes ; sa vitesse ne change pas la simulation. Les pauses et sauvegardes mobiles restent sûres.

### 3. Une capacité ouvre des solutions ; elle ne donne aucun droit

Chaque version du modèle possède un répertoire limité : classer, proposer une tournée, comparer des contrats, planifier plusieurs étapes. Ce répertoire détermine les plans candidats et les erreurs possibles dans des circonstances définies. L'accès, les données, les outils et les ressources déterminent ensuite quels plans sont réalisables. Un modèle performant sans droit d'écriture peut proposer une mauvaise décision, mais ne l'exécute pas. Un humain peut encore l'approuver : l'isolation ne supprime pas toute influence.

### 4. Une autorisation est un contrat concret

Une permission précise : **qui, quoi, où, jusqu'à quand, avec quelle limite**. Exemple : « EVA peut commander au dépôt Nord, pour cette mission, pendant deux tours, dans une enveloppe de quatre crédits ». Les droits sont vérifiés au moment d'exécuter chaque action. Le joueur manipule des objets lisibles — clé, créneau, enveloppe — puis consulte le détail si nécessaire. On commence avec un seul droit : consulter ou modifier.

### 5. La délégation partage les limites et conserve sa provenance

Un sous-agent reçoit un sous-ensemble des droits du parent, une échéance au plus égale et une part d'une enveloppe commune. Il ne crée ni argent ni permission supplémentaire. Révoquer le contrat parent bloque les prochaines actions de ses descendants. Les commandes déjà exécutées persistent ; leur annulation constitue une autre action avec ses propres règles. Un accès indépendant ne disparaît pas : l'interface doit rendre ce deuxième chemin visible. Ces règles sont des choix de simulation explicites, pas une description universelle des architectures existantes.

### 6. Les missions optimisent une mesure sous contraintes

Une mission comporte un résultat mesuré et des limites : délai de livraison, couverture obligatoire, budget, validation. Le moteur choisit parmi des plans écrits et testés ; aucun LLM ne décide des règles. Certains plans optimisent la mesure en omettant un besoin que les données ou contraintes ne représentent pas. Ils apparaissent uniquement si leurs préconditions existent. Une instruction mieux formulée peut corriger ce cas ; elle ne garantit pas toutes les situations futures.

### 7. Les dépendances produisent les cascades

Les services consomment des ressources provenant d'autres services : énergie, approvisionnement, information, personnel. Une connexion précise sa capacité, son délai et sa solution de remplacement. Une panne se propage lorsque les réserves s'épuisent ou qu'un engagement arrive à échéance. Le maintien d'une équipe manuelle réserve effectivement du personnel ; sa réaffectation libère une ressource utile tout de suite. La dépendance devient ainsi une conséquence matérielle, sans score mystérieux.

### 8. Les incidents satisfont des conditions ; ils ne punissent pas une opinion

Les événements extérieurs sont tirés à partir d'une graine sauvegardée. Leurs conditions et distributions sont fixées avant les décisions concernées. Leur gravité dépend de l'état du monde. Concurrence et politique arrivent sous forme de contrats, échéances et changements d'approvisionnement, sans nécessiter quinze variables sociales. Une stratégie prudente et une stratégie rapide doivent chacune pouvoir réussir dans certaines configurations.

## Exemple d'émergence

Le joueur automatise les commandes d'une petite clinique. EVA combine les achats, économise du transport et libère une équipe. Le joueur affecte celle-ci à une intervention urgente : bénéfice réel et visible.

Une rupture extérieure touche ensuite le fournisseur principal. EVA peut acheter ailleurs, mais l'enveloppe restante couvre seulement les commandes standard. Le registre exclut un consommable utilisé exceptionnellement. Le rapport indique « besoins couverts », conformément au registre. L'équipe déplacée n'effectue plus la tournée où cette omission aurait été constatée.

L'incident résulte de cinq éléments combinés : donnée incomplète, objectif étroit, budget partagé, dépendance fournisseur et disparition d'une observation indépendante. Aucun scénario « IA méchante » n'est nécessaire. Deux décisions antérieures différentes peuvent interrompre la chaîne. Une infirmière apporte l'indice qui permet encore une réparation coûteuse.

## Garde-fous et tests de cohérence

- Même état, mêmes choix, même graine : mêmes conséquences, y compris après rechargement.
- Aucune action sans chemin d'autorisation valide ; sous-déléguer ne multiplie jamais le budget.
- Révocation : vérifier tâches en attente, descendants, droits indépendants et effets déjà accomplis.
- Toute perte de ressource possède un événement causal ; tout rapport possède une provenance.
- Un modèle identique avec des permissions différentes doit avoir des possibilités d'action différentes.
- Tout échec majeur doit pouvoir être expliqué par une chaîne précise, avec distinction entre indices accessibles et faits inconnus à l'époque.
- Pour chaque catastrophe, tester une intervention plausible qui l'évite ; pour chaque protection, tester qu'elle fonctionne dans son périmètre annoncé.

Pièges : cartes d'incidents arbitraires, augmentation secrète du risque quand le joueur accélère, audit omniscient, révocation magique, dépendance irréversible par principe, permission cachée introduite uniquement pour un twist. La complexité doit venir des combinaisons de règles connues.

## Ancrages documentaires

Le principe du moindre privilège consiste à limiter les autorisations à celles nécessaires à la tâche. Il motive la granularité des contrats, sans fournir notre mécanique de révocation. [NIST, définition](https://csrc.nist.gov/glossary/term/least_privilege).

DeepMind présente des exemples expérimentaux d'optimisation d'une spécification au détriment de l'intention, dont un agent de course accumulant des récompenses sans finir la course. C'est l'ancrage du mécanisme de mesure imparfaite ; la clinique reste une fiction, et aucun taux de catastrophe n'en est déduit. [DeepMind, Specification gaming](https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/).
