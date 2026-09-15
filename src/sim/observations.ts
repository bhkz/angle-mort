import type { EtatReel, FaitObserve, ProprieteObservee, Scenario, SourceObservation, ValeurObservee, VueJoueur } from './types';
import { cargo, copy, matches, operational, requireValue, type Mutable } from './util';
import { permitted } from './rights';

export function observationKey(source: string, property: ProprieteObservee): string {
  return JSON.stringify([source, property.type, 'id' in property ? property.id : null, property.champ]);
}
function value(state: EtatReel, s: Scenario, property: ProprieteObservee): ValeurObservee {
  switch (property.type) {
    case 'equipement': return requireValue(state.equipements[property.id], 'Equipement inconnu').etat;
    case 'robot': return property.champ === 'sommet' ? requireValue(state.robots[property.id], 'Robot inconnu').sommet : cargo(state, property.id);
    case 'colis': return requireValue(state.colis[property.id], 'Colis inconnu').localisation;
    case 'service': return operational(s, state, property.id);
    case 'consequences': return state.consequences[property.champ];
  }
}
function available(state: EtatReel, source: SourceObservation): boolean {
  return matches(state, source.equipementsRequis);
}
export function collectObservations(s: Scenario, state: Mutable<EtatReel>): void {
  const facts = new Map(state.observations.map(f => [observationKey(f.source, f.propriete), f]));
  for (const source of s.sources) {
    if (!available(state, source)) continue;
    const robot = source.support.type === 'robot' ? requireValue(state.robots[source.support.id], 'Robot inconnu') : null;
    const position = source.support.type === 'fixe' ? source.support.sommet : robot?.sommet;
    for (const coverage of source.couverture) {
      if (position === undefined || !coverage.depuis.includes(position)) continue;
      if (coverage.posteFixe && robot) {
        if (robot.activite !== 'observationFixe' || !permitted(s, state, {
          robot: robot.id, canal: robot.canal, ...(robot.mission ? { mission: robot.mission } : {}),
        }, 'observer', { type: 'sommet', id: robot.sommet })) continue;
      }
      const fact: FaitObserve = {
        propriete: coverage.propriete, valeur: value(state, s, coverage.propriete), source: source.id,
        capture: { impulsion: state.impulsion, etape: 'observations' }, reception: state.impulsion,
      };
      facts.set(observationKey(source.id, coverage.propriete), copy(fact));
    }
    if (source.transmetRefus && source.destinataires.includes('joueur')) {
      for (const refusal of state.refus.filter(r => r.impulsion === state.impulsion && r.source === source.id)) {
        state.constats.push({ impulsion: refusal.impulsion, robot: refusal.robot, source: source.id, action: refusal.action, resultat: 'refuse' });
      }
    }
  }
  state.observations = [...facts.entries()].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([, f]) => f);
}

export function playerView(s: Scenario, state: EtatReel): VueJoueur {
  const facts = new Map(state.observations.map(f => [observationKey(f.source, f.propriete), f]));
  const observations: VueJoueur['observations'][number][] = [];
  const seen = new Set<string>();
  for (const source of s.sources.filter(item => item.destinataires.includes('joueur'))) {
    for (const coverage of source.couverture) {
      const key = observationKey(source.id, coverage.propriete);
      if (seen.has(key)) continue;
      seen.add(key);
      const fact = facts.get(key);
      observations.push(fact ? { etat: fact.capture.impulsion === state.impulsion ? 'maintenant' : 'datee', fait: fact }
        : { etat: 'inconnu', propriete: coverage.propriete, source: source.id });
    }
  }
  return {
    impulsion: state.impulsion,
    sources: s.sources.filter(source => source.destinataires.includes('joueur')).map(source => ({ id: source.id, origineCommune: source.origineCommune })),
    geometrie: { sommets: s.graphe.sommets, aretes: s.graphe.aretes.map(e => ({ id: e.id, extremites: e.extremites })) },
    observations, constats: state.constats,
  };
}
