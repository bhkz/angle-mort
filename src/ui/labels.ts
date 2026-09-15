import type { FaitObserve } from '../sim/types';
export const places: Record<string, string> = { O: 'Dépôt', T: 'Transfert', A: 'Porte A', P: 'Pompe', Q: 'Atelier', F: 'Infirmerie', C: 'Coursive', H: 'Accès haut', G: 'Hangar', D: 'Quai ouest', E: 'Quai bas' };
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
  return `${age === 0 ? '● Maintenant' : `◌ Daté · ${age} impulsion${age > 1 ? 's' : ''}`} · t${fact.capture.impulsion} · ${sourceName(fact.source)}`;
}
