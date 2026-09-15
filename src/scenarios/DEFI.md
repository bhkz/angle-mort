# Défi prototype — Situation 041, Standard, p7.1

Le bouton **Défi · 16 impulsions** lance une tentative de t0 à t16. Le checkpoint « Dernier passage » reste un entraînement distinct, sans record. Aucune réussite n'est importée dans le défi. Le même moteur résout déplacements, manutentions, observations, traversées, pertes et besoins.

## Choix explicites pour le préfixe manquant (SPEC PT-12)

V2-04 vérifie seulement t4–t16 et suppose trois réussites antérieures. Le préfixe de cette situation est une extension de prototype, pas un préfixe prétendument établi par le document :

- R1 commence en O avec batterie et Q2. R2 commence en P avec Q1. Q1 doit réellement être livrée en Q pendant la première fenêtre.
- Charge initiale : pompe opérationnelle jusqu'au contrôle t4 ; arrêt programmé à t5. La batterie reçue avant ou à t10 la réactive selon le moteur existant. L'autonomie n'est pas une nouvelle simulation de consommation électrique.
- F1 traverse à t2, avec passerelle levée à t1–2 puis abaissée à t3. Les trois créneaux suivants restent t5–6, t9–10, t13–14, avec traversées à t6/10/14. Les créneaux sont publiés dans le contrat et restent automatiques.
- La porte est ouverte au départ ; le cycle de t4 la rouvre dans la situation 041. La caméra passe en maintenance à t4 puis revient à t7. Ce résultat du cycle reste soumis aux observations : aucune variante secrète n'est transmise dans le contrat, le rendu ou le planificateur.
- Q3/Q4 restent au casier P, accessibles à t9/t13. Les pertes de batterie conservent les seuils t8 et t10. Aucune fin anticipée, même si le poste est dégradé.

Le test de poste complet démontre 1 200 points sans refus : R1 attend en O jusqu'à t3, gagne T à t4, G/A/P/Q à t5/6/7/8, puis livre Q3 à t10 et Q4 à t14. R2 livre Q1 à t1, revient par P/F/E/D/T/H/C à t2–8. Les préfixes et les cinq témoins t4–t16 sont testés séparément ; cette situation n'est pas annoncée optimale globalement.

## Conditions physiques et score

Douze identifiants fixes P1–4, F1–4, Q1–4 ; quatre fenêtres (0,4], (4,8], (8,12], (12,16]. Chaque besoin vaut 100, maximum 1 200. Les demandes sont révélées aux frontières t0/4/8/12. Le contrat annonce aussi dès le départ les horaires de ferry, les contrôles de disponibilité et la condition finale. Aucun changement de nature, de classement ou de mesure EVA ne change les conditions attachées aux identifiants.

| Service | Alimentation | Installation | Accès fonctionnel |
| --- | --- | --- | --- |
| Pompage | alimentationP disponible | pompe opérationnelle | accesP ouvert |
| Ferry | alimentationF disponible | installationF disponible | accesF ouvert |
| Fournitures | alimentationQ disponible | receptionQ disponible | accesQ ouvert |

Ces accès sont des états physiques locaux des installations, distincts de la porte routière G–A. Les traversées exigent en plus la passerelle relevée à leur horaire. Les dépendances sont effectivement vérifiées ; enregistrer un service sans dépendances est refusé. Comme dans la fixture V2-04, le service de réception des fournitures et le ferry ont des alimentations indépendantes de la pompe. Une réception Q est distincte du redémarrage de l'atelier après perte de pompe.

Les besoins de réception utilisent un reçu physique pour le colis et le lieu exacts ; une réception hors fenêtre ne peut être reclassée en succès d'une autre phase. La validation refuse le partage d'une même réception ou traversée entre plusieurs besoins. P3 et P4 sont deux contrôles distincts, jamais deux primes de réparation. Les résultats ne sont attribués qu'à l'échéance et deviennent immuables. Les trois besoins de phase 4 exigent en plus l'état opérationnel à t16. Démanteler après Q4/F4 empêche leur attribution ; cela n'efface pas les réussites des phases antérieures.

## Bilan, non-fuite et partage

`getFinalReport()` retourne `null` avant la fin. À t16, il retourne uniquement le score, le résultat des douze besoins et la disponibilité finale des services. Aucun état auteur, calendrier secret, dégât narratif ou position n'entre dans ce rapport. `VueJoueur` reste inchangée ; le rendu n'obtient toujours que ses observations. Le worker transmet les demandes publiques révélées et ce seul rapport final à l'interface.

Le bilan affiche la matrice services × phases, l'heure 06 h 00 et les services en activité. Les cases utilisent signes, texte et hachures. La carte reprend l'en-tête situation/difficulté/version de D §16, le score, les services, la meilleure tentative, une empreinte des quatre phases et l'invitation au partage. Aucun nom de personnage ou perte narrative n'est inclus. **Seul le bouton Copier écrit au presse-papiers** ; en cas de refus du navigateur, le texte reste sélectionnable. Aucune requête de publication.

Le record local est séparé par situation, version, difficulté, ressources et absence d'aide. Une tentative inachevée n'est jamais un record ; recommencer n'additionne rien ; un score égal garde la première tentative gagnante, sans départage par le nombre de services. Première découverte et numéro du meilleur essai restent distincts. L'entraînement t4 n'écrit jamais ce record. Ce stockage est déclaratif, sans certification de première découverte ni serveur de classement. En cas de stockage indisponible, le jeu et la copie restent utilisables, avec un historique de la session seulement.

## Vérification

`tests/defi.test.ts` vérifie le poste complet à 1 200, les quatre triches demandées, l'anticipation, les réparations sans bonus, chaque dépendance physique finale, la révélation des besoins et la non-fuite de deux mondes aux services cachés différents. `e2e/defi.spec.ts` joue seize impulsions, vérifie l'absence de bilan préalable, la copie uniquement au clic, l'indépendance de l'entraînement et le redémarrage. `artifacts/defi-bilan.png` montre un poste terminé sans intervention (500 points) ; il n'illustre pas le parcours à 1 200 du test moteur.
