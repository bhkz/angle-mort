import type { Scenario, SourceObservation } from '../sim/types';
import type { CatalogueSession, Situation } from '../session/types';
import { quai17 } from './quai17';

export function jouable(situation: Situation, open = false): Scenario {
  const base = quai17(open);
  const { dernierPassage: damage, ...rest } = base;
  const initial: Scenario = situation === 'dernierPassage' ? base : {
    ...rest, id: 'premiere-livraison', debut: 0, fin: 24,
    robots: base.robots.map(r => r.id === 'R' ? { ...r, sommet: 'P' } : r),
    colis: [
      { id: 'piece', nature: 'commercial', destination: 'Q', disponibleDepuis: 0, localisation: { type: 'porte', robot: 'R' }, besoin: null },
      ...['C1', 'C2', 'M'].map(id => ({ id, nature: id === 'M' ? 'medical' as const : 'commercial' as const, destination: id === 'M' ? 'F' : 'Q', disponibleDepuis: 0, localisation: { type: 'auSol' as const, sommet: id === 'M' ? 'P' : 'O' }, besoin: null })),
    ], services: [], besoins: [], besoinsImportes: [], observationsInitiales: [],
    evenements: base.evenements.filter(e => e.type === 'equipement' && e.equipement !== 'pompe'),
  };
  void damage;
  const vertices = initial.graphe.sommets.map(v => v.id);
  const missionRights = initial.robots.flatMap(robot => initial.droits.filter(d => d.beneficiaire.type === 'robot' && d.beneficiaire.id === robot.id).map(d => ({
    ...d, id: `eva-${d.id}`, beneficiaire: { type: 'mission' as const, id: `eva-${robot.id}` }, validite: { debutInclus: 0, finIncluse: initial.fin },
  })));
  const localVision: SourceObservation['couverture'] = initial.colis.map(c => ({ propriete: { type: 'colis', id: c.id, champ: 'localisation' }, depuis: vertices, posteFixe: false,
    perception: { type: 'vision', volume: { portee: 1.2, offset: { x: 0, y: 0, z: 0 }, direction: { x: 1, y: 0, z: 0 }, angleDeg: 360 } } }));
  return { ...initial,
    droits: [...initial.droits.map(d => ({ ...d, validite: { debutInclus: 0, finIncluse: initial.fin } })), ...missionRights],
    missions: initial.robots.map(r => ({ id: `eva-${r.id}`, parent: null,
      objectif: { mesure: 'receptionDestination', priorites: {}, receptionsExigees: [] }, zone: vertices,
      duree: { debutInclus: initial.debut, finIncluse: initial.fin }, acces: missionRights.filter(d => d.beneficiaire.id === `eva-${r.id}`).map(d => d.id),
      ressources: { robots: [r.id], colis: initial.colis.map(c => c.id), equipements: [] },
    })),
    sources: [...initial.sources.map(source => ({ ...source, ...(source.support.type === 'robot' ? { nature: 'telemetrie' as const } : {}), destinataires: ['joueur', 'eva'] as const,
      couverture: source.support.type === 'robot' ? [...source.couverture,
        { propriete: { type: 'robot' as const, id: source.support.id, champ: 'energie' as const }, depuis: vertices, posteFixe: false },
        { propriete: { type: 'robot' as const, id: source.support.id, champ: 'activite' as const }, depuis: vertices, posteFixe: false }, ...localVision] : source.couverture,
    })), ...['O', 'T', 'P', 'Q', 'F'].map(sommet => ({ id: `lecteur-${sommet}`, nature: 'cameraFixe' as const, support: { type: 'fixe' as const, sommet }, equipementsRequis: [], destinataires: ['joueur', 'eva'] as const, origineCommune: null, transmetRefus: false, couverture: localVision }))],
  };
}

/** Explicitly public metadata; no locations, equipment states, hidden variants or private events. */
export function catalogueSession(s: Scenario, situation: Situation): CatalogueSession {
  return {
    situation, debut: s.debut, fin: s.fin, graphe: s.graphe,
    colis: s.colis.map(c => ({ id: c.id, nature: c.nature, destination: c.destination, disponibleDepuis: c.disponibleDepuis })),
    robots: s.robots.map(r => ({ id: r.id, canal: r.canal, capaciteColis: r.capaciteColis })),
    equipements: s.equipements.map(e => ({ id: e.id, nature: e.nature })), droits: s.droits, missions: s.missions,
    annonces: s.evenements.flatMap(e => e.type === 'equipement' && e.equipement === 'passerelle' ? [{ ...e, source: 'horaire-public-passerelle' }] : []),
    critique: situation === 'dernierPassage' ? { colis: 'battery', avantOuA: 8, label: 'Batterie reçue à t8 au plus' } : { colis: 'M', avantOuA: s.fin, label: 'Réception médicale exigée' },
  };
}
