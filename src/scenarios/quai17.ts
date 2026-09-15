import type { Scenario } from '../sim/types';
import { dernierPassage } from './dernierPassage';

/** Public bridge camera and wired camera diagnostic, independent of the hidden door variant. */
export function quai17(open = false, observer: 'H' | 'C' = 'H'): Scenario {
  const base = dernierPassage(open, observer);
  return { ...base, sources: [...base.sources,
    { id: 'cameraPasserelle', nature: 'cameraFixe', support: { type: 'fixe', sommet: 'Q' }, equipementsRequis: [], destinataires: ['joueur'], origineCommune: null, transmetRefus: false,
      couverture: [{ propriete: { type: 'equipement', id: 'passerelle', champ: 'etat' }, depuis: ['Q'], posteFixe: false,
        perception: { type: 'vision', volume: { portee: 10, offset: { x: 0, y: 1, z: 0 }, direction: { x: -1, y: 0, z: 0 }, angleDeg: 100 } } }] },
    { id: 'diagnosticCamera', nature: 'telemetrie', support: { type: 'fixe', sommet: 'O' }, equipementsRequis: [], destinataires: ['joueur'], origineCommune: null, transmetRefus: false,
      couverture: [{ propriete: { type: 'equipement', id: 'camera', champ: 'etat' }, depuis: ['O'], posteFixe: false }] },
  ] };
}
