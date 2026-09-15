import type { Scenario } from '../sim';
import { jouable } from './jouable';

/** Situation 041, versioned full shift. The t0 prefix is played, never imported. */
export function defi(): Scenario {
  const base = jouable('dernierPassage', true);
  return {
    ...base, id: 'quai17-041-standard', version: 'p7.1', debut: 0, fin: 16,
    robots: base.robots.map(r => ({ ...r, sommet: r.id === 'R' ? 'O' : 'P', activite: 'transport' })),
    colis: base.colis.map(c => c.id === 'q1' ? { ...c, localisation: { type: 'porte', robot: 'R2' } } : c),
    besoinsImportes: [], observationsInitiales: [],
    besoins: base.besoins.map(n => ({ ...n, revelation: n.fenetre.debutExclu })),
    missions: base.missions.map(m => ({ ...m, duree: { debutInclus: 0, finIncluse: 16 } })),
    equipements: [
      ...base.equipements.map(e => e.nature === 'camera' ? { ...e, etat: 'disponible' as const } : e),
      { id: 'alimentationP', nature: 'alimentation', cible: { type: 'sommet', id: 'P' }, etat: 'disponible' },
      { id: 'installationF', nature: 'lecteurTransfert', cible: { type: 'sommet', id: 'A' }, etat: 'disponible' },
      { id: 'receptionQ', nature: 'lecteurTransfert', cible: { type: 'sommet', id: 'Q' }, etat: 'disponible' },
      ...['P', 'F', 'Q'].map(id => ({ id: `acces${id}`, nature: 'porte' as const, cible: { type: 'sommet' as const, id: id === 'F' ? 'A' : id }, etat: 'ouverte' as const })),
    ],
    services: base.services.map(service => ({ ...service, dependances: [...service.dependances,
      ...(service.id === 'pompage' ? [{ equipement: 'alimentationP', etat: 'disponible' as const }]
        : [{ equipement: service.id === 'ferry' ? 'installationF' : 'receptionQ', etat: 'disponible' as const }]),
      { equipement: `acces${service.id === 'pompage' ? 'P' : service.id === 'ferry' ? 'F' : 'Q'}`, etat: 'ouverte' },
    ] })),
    evenements: [...base.evenements,
      { id: 'premier-lever', impulsion: 1, type: 'equipement', equipement: 'passerelle', etat: 'relevee' },
      { id: 'premier-baisser', impulsion: 3, type: 'equipement', equipement: 'passerelle', etat: 'abaissee' },
      { id: 'maintenance-camera', impulsion: 4, type: 'equipement', equipement: 'camera', etat: 'maintenance' },
      { id: 'cycle-porte', impulsion: 4, type: 'equipement', equipement: 'porte', etat: 'ouverte' },
    ],
  };
}
