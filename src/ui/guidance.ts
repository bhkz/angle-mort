import type { SessionFrame } from '../session/types';
import { knownFact } from '../session/beliefs';
import { placeNames } from '../view/names';

export function received(frame: SessionFrame, id: string): boolean {
  const value = knownFact(frame.view, { type: 'colis', id, champ: 'localisation' })?.valeur;
  return typeof value === 'object' && value !== null && 'type' in value && value.type === 'recu';
}
export interface Guide {
  title: string; body: string; action?: { label: string; robot?: string; destination?: string; execute?: boolean; observer?: boolean; objectives?: boolean };
  highlight?: string; progress: string;
}
/** Guidance is derived from the same received facts as the rest of the UI. */
export function guideFor(frame: SessionFrame, selectedRobot: string | null, guidedChallenge = false): Guide {
  const running = frame.missions.find(m => ['active', 'preparee'].includes(m.statut));
  const refused = frame.missions.find(m => m.statut === 'refusee');
  if (refused) return { title: 'Cette mission a besoin d’un nouveau choix', body: refused.motif ?? 'Le trajet demandé ne peut pas être proposé avec les informations et les droits disponibles. Choisissez le robot pour lire la raison et modifier sa mission.', progress: 'Le monde est en pause', action: { label: 'Voir la mission', robot: refused.intention.robot } };
  if (frame.fin) return { title: 'Le poste est terminé', body: frame.defi ? 'Ouvrez le bilan pour voir quels besoins ont réellement été satisfaits et copier votre résultat.' : 'Vous pouvez recommencer ou choisir un autre mode dans Jouer.', progress: 'Fin de la tentative' };
  if (running) {
    const result = running.resultat;
    const steps = result?.statut === 'plan' ? result.plan.etapes.filter(e => e.impulsion > frame.view.impulsion).length : 0;
    return { title: `Faites avancer ${running.intention.robot === 'R' ? 'R1' : 'R2'}`, body: `${steps} tour${steps > 1 ? 's' : ''} prévu${steps > 1 ? 's' : ''} pour ${running.intention.action === 'observer' ? 'rejoindre le poste d’observation' : `rejoindre ${placeNames[running.intention.destination] ?? 'la destination'}`}. Exécuter avance d’un seul tour, puis le jeu s’arrête pour vous laisser décider.`, progress: frame.preparation ? 'Trajet préparé · encore annulable' : 'Mission en cours · monde en pause', action: { label: 'Exécuter un tour', execute: true }, highlight: 'advance' };
  }
  if (frame.catalogue.situation === 'atelier') {
    if (!received(frame, 'piece')) return selectedRobot === 'R'
      ? { title: '2. Choisissez l’atelier', body: 'R1 porte déjà la pièce demandée. Touchez l’atelier sur le quai : le trajet sera préparé, sans faire avancer le monde.', progress: 'Première livraison · 2 sur 3', action: { label: 'Choisir l’atelier', robot: 'R', destination: 'Q' }, highlight: 'sommet:Q' }
      : { title: '1. Choisissez R1', body: 'Vous dirigez les robots du quai. Votre premier but : apporter la pièce de R1 à l’atelier. Touchez R1 sur le quai ou sa fiche en bas.', progress: 'Première livraison · 1 sur 3', action: { label: 'Choisir R1', robot: 'R' }, highlight: 'robot:R' };
    if (!received(frame, 'M')) return { title: '✓ Première livraison réussie !', body: 'L’atelier a confirmé la réception. Essayez maintenant l’infirmerie : R1 devra récupérer le colis médical à la pompe, puis le livrer. Deux tours seront nécessaires.', progress: 'Apprendre · deuxième livraison', action: { label: 'Préparer la livraison médicale', robot: 'R', destination: 'F' }, highlight: 'sommet:F' };
    return { title: '✓ Vous savez préparer et livrer', body: 'Deux réceptions confirmées. Vous pouvez régler les priorités d’une mission, ou choisir S’entraîner dans Jouer pour découvrir la porte inconnue et le poste d’observation.', progress: 'Apprentissage réussi' };
  }
  if (frame.catalogue.situation === 'dernierPassage') {
    if (received(frame, 'battery')) return { title: 'La réception de la batterie est confirmée', body: 'R1 transporte aussi une fourniture pour l’atelier. Livrez-la, puis consultez les réceptions datées : arriver à destination ne signifie pas forcément avoir respecté le délai.', progress: 'Entraînement · poursuivre la livraison', action: { label: 'Envoyer R1 à l’atelier', robot: 'R', destination: 'Q' }, highlight: 'sommet:Q' };
    const door = knownFact(frame.view, { type: 'equipement', id: 'porte', champ: 'etat' });
    if (door?.capture.impulsion !== frame.view.impulsion) return { title: 'La porte est-elle encore ouverte ?', body: 'R1 porte la batterie de la pompe. Son ancien rapport ne suffit pas à connaître la porte maintenant. Envoyer R2 au poste d’observation prend un tour et donne une vue indépendante.', progress: 'Entraînement · s’informer avant d’agir', action: { label: 'Envoyer R2 observer la porte', robot: 'R2', destination: 'C', observer: true }, highlight: 'sommet:C' };
    return { title: 'Apportez la batterie à la pompe', body: 'Choisissez R1 puis la pompe. Le plan utilisera les informations reçues. La mission prépare un trajet ; vous gardez la main à chaque tour.', progress: 'Entraînement · livraison', action: { label: 'Préparer la livraison de batterie', robot: 'R', destination: 'P' }, highlight: 'sommet:P' };
  }
  const phase = frame.defi?.phase ?? 1;
  if (!guidedChallenge) return { title: 'Trois services à faire tenir jusqu’au matin', body: 'Livrez les fournitures de l’atelier et la batterie de la pompe dans les délais. Les ferries suivent l’horaire de la passerelle. Vos objectifs expliquent les demandes de cette période. Le bilan est révélé après le tour 16.', progress: `Défi · période ${phase} sur 4`, action: { label: 'Voir les objectifs de la période', objectives: true } };
  if (phase === 1 && !received(frame, 'q1')) return { title: 'Livrez la première fourniture', body: 'R2 porte le colis de l’atelier. Remettez-le avant la fin du tour 4. La pompe est alimentée au départ et le premier ferry est programmé : commencez par cette livraison.', progress: 'Défi · phase 1 sur 4', action: { label: 'Envoyer R2 à l’atelier', robot: 'R2', destination: 'Q' }, highlight: 'robot:R2' };
  const secondPosition = knownFact(frame.view, { type: 'robot', id: 'R2', champ: 'sommet' })?.valeur;
  if (phase === 1 && received(frame, 'q1') && secondPosition === 'Q') return { title: 'Libérez la réception de l’atelier', body: 'R2 a livré son colis mais occupe encore la place. Envoyez-le à l’infirmerie, en deux tours, pour laisser R1 livrer ensuite. Un seul robot peut occuper chaque lieu.', progress: 'Défi · organiser les deux robots', action: { label: 'Garer R2 à l’infirmerie', robot: 'R2', destination: 'F' }, highlight: 'robot:R2' };
  if (!received(frame, 'battery')) return { title: 'Préparez la batterie pour la pompe', body: 'R1 transporte la batterie. Choisissez la pompe pour préparer sa livraison. Les demandes de chaque phase sont détaillées dans Vos objectifs.', progress: `Défi · phase ${phase} sur 4`, action: { label: 'Envoyer R1 à la pompe', robot: 'R', destination: 'P' }, highlight: 'sommet:P' };
  if (['q1', 'q2', 'q3', 'q4'].every(id => received(frame, id))) return { title: 'Les quatre fournitures ont été reçues', body: 'Les réceptions sont confirmées. Terminez les tours restants pour atteindre le contrôle final des services. Le bilan vérifiera aussi les délais ; aucun score n’est encore annoncé.', progress: 'Défi · finir le poste', action: { label: 'Attendre un tour', execute: true } };
  return { title: 'Poursuivez les livraisons de l’atelier', body: 'Les prochains colis sont au casier de la pompe. Choisissez un robot puis l’atelier pour préparer une livraison. Consultez Vos objectifs pour la période de réception demandée.', progress: `Défi · phase ${phase} sur 4`, action: { label: 'Préparer une livraison à l’atelier', robot: 'R', destination: 'Q' }, highlight: 'sommet:Q' };
}
