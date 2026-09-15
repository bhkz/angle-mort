import type { Cible, EtatReel, FaitObserve, ProprieteObservee, Scenario, ValeurObservee } from './types';
import { cargo, copy, matches, operational, requireValue, type Mutable } from './util';
import { permitted } from './rights';
import { activeObstacles, geometricallyVisible, targetPosition } from './geometry';
import { latestFacts, observationKey } from './player-view';

function value(state: EtatReel, s: Scenario, property: ProprieteObservee): ValeurObservee {
  switch (property.type) {
    case 'equipement': return requireValue(state.equipements[property.id], 'Equipement inconnu').etat;
    case 'robot': {
      const robot = requireValue(state.robots[property.id], 'Robot inconnu');
      return property.champ === 'sommet' ? robot.sommet : property.champ === 'energie' ? robot.energie : property.champ === 'activite' ? robot.activite : cargo(state, property.id);
    }
    case 'colis': return requireValue(state.colis[property.id], 'Colis inconnu').localisation;
    case 'service': return operational(s, state, property.id);
    case 'consequences': return state.consequences[property.champ];
    case 'son': return null;
  }
}
/** The only stage allowed to read physics to acquire new information. */
export function collectObservations(s: Scenario, state: Mutable<EtatReel>): void {
  const facts = latestFacts(state.observations, state.impulsion);
  for (const source of s.sources) {
    if (!matches(state, source.equipementsRequis)) continue;
    const robot = source.support.type === 'robot' ? requireValue(state.robots[source.support.id], 'Robot inconnu') : null;
    const position = source.support.type === 'fixe' ? source.support.sommet : robot?.sommet;
    for (const coverage of source.couverture) {
      if (position === undefined || !coverage.depuis.includes(position)) continue;
      if (coverage.posteFixe && robot) {
        if (robot.activite !== 'observationFixe' || !permitted(s, state, {
          robot: robot.id, canal: robot.canal, ...(robot.mission ? { mission: robot.mission } : {}),
        }, 'observer', { type: 'sommet', id: robot.sommet })) continue;
      }
      let observed = value(state, s, coverage.propriete);
      if (coverage.perception) {
        const p = coverage.propriete;
        const emission = p.type === 'son' ? s.emissionsSonores?.find(e => e.id === p.id) : undefined;
        const target: Cible | undefined = emission?.origine ?? (p.type !== 'son' && p.type !== 'consequences' ? { type: p.type, id: p.id } : undefined);
        const targetPoint = coverage.perception.ancrage ?? (target ? targetPosition(s, state, target) : undefined);
        const origin = requireValue(targetPosition(s, state, { type: 'sommet', id: position }), 'Origine inconnue');
        const covered = targetPoint !== undefined && geometricallyVisible(origin, targetPoint, coverage.perception.volume, activeObstacles(s, state, target));
        if (coverage.perception.type === 'audio') {
          observed = covered && targetPoint && emission && matches(state, emission.conditions)
            ? { type: 'son', son: emission.son, position: targetPoint } : null;
        } else if (!covered) continue;
      }
      const fact: FaitObserve = {
        propriete: coverage.propriete, valeur: observed, source: source.id,
        capture: { impulsion: state.impulsion, etape: 'observations' }, reception: state.impulsion,
      };
      facts.set(observationKey(source.id, coverage.propriete), copy(fact));
    }
    if (source.capteurFranchissement) {
      for (const crossing of state.franchissements.filter(c => c.impulsion === state.impulsion && source.capteurFranchissement!.aretes.includes(c.arete))) {
        if (!state.franchissementsObserves.some(c => c.source === source.id && c.impulsion === crossing.impulsion && c.arete === crossing.arete && c.depuis === crossing.depuis)) {
          state.franchissementsObserves.push({ ...crossing, robot: source.capteurFranchissement.identifieRobot ? crossing.robot : null, source: source.id });
        }
      }
    }
    if (source.transmetRefus && source.destinataires.includes('joueur')) {
      for (const refusal of state.refus.filter(r => r.impulsion === state.impulsion && r.source === source.id)) {
        state.constats.push({ impulsion: refusal.impulsion, robot: refusal.robot, source: source.id, action: refusal.action, resultat: 'refuse' });
      }
    }
  }
  state.observations = copy([...facts.entries()].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([, f]) => f));
}
