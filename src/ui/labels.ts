import type { FaitObserve } from '../sim/types';
export { placeNames as places } from '../view/names';
import { placeNames as places } from '../view/names';
export const parcels: Record<string, string> = { piece: 'Pièce d’atelier', C1: 'Lot atelier 1', C2: 'Lot atelier 2', M: 'Colis médical', battery: 'Batterie', q1: 'Fourniture 1', q2: 'Fourniture 2', q3: 'Fourniture 3', q4: 'Fourniture 4' };
export const robotName = (id: string) => id === 'R' ? 'R1' : id;
export function sourceName(id: string): string {
  if (id === 'telemetrieR' || id === 'telemetrieR2') return `Robot ${id === 'telemetrieR' ? 'R1' : 'R2'}`;
  if (id.startsWith('lecteur-')) return `Lecteur ${places[id.slice(8)] ?? id.slice(8)}`;
  return ({ cameraFixe: 'Caméra du hangar', cameraPasserelle: 'Caméra de la passerelle', diagnosticCamera: 'Diagnostic caméra' } as Record<string, string>)[id] ?? id;
}
export function provenance(fact: FaitObserve | undefined, now: number): string {
  if (!fact) return '? · Inconnu';
  const age = now - fact.capture.impulsion;
  return `${age === 0 ? '● Vu ce tour' : `◌ Vu il y a ${age} tour${age > 1 ? 's' : ''}`} · ${sourceName(fact.source)}`;
}
export const placePurpose: Record<string, string> = {
  O: 'Le dépôt garde les colis à transporter. Envoyez-y un robot pour les récupérer.',
  Q: 'L’atelier attend ses fournitures. Une livraison réussit quand le robot remet vraiment le colis ici.',
  P: 'La batterie livrée ici alimente la pompe. Le casier voisin fournit aussi les prochains colis de l’atelier.',
  F: 'L’infirmerie reçoit les colis médicaux. Elle permet d’essayer une priorité différente pour vos tournées.',
  T: 'On peut déposer un colis ici pour le reprendre plus tard. Ce dépôt ne signifie pas que le destinataire est servi.',
  C: 'Un robot placé ici voit la porte du hangar. Pendant qu’il observe, il ne transporte rien.',
  A: 'Cette porte contrôle le raccourci vers la pompe. Si son état est inconnu, faites-la observer ou prenez le détour.',
  H: 'Cet escalier mène au poste d’observation, au-dessus du hangar.',
  G: 'Le chemin court passe par ici, puis traverse la porte du hangar.',
  D: 'Ce passage fait partie du détour. Il évite la porte et la passerelle.',
  E: 'Cette allée fait partie du détour vers la pompe, en restant sur le quai.',
};
