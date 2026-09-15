import { describe, expect, test } from 'vitest';
import { createSimulation } from '../src/sim';
import { catalogueSession, jouable } from '../src/scenarios/jouable';
import { createSessionController, planningRequest } from '../src/session/controller';
import { cartesInitiales } from '../src/session/types';

function start() {
  const s = jouable('atelier'); const engine = createSimulation(s, 17);
  const session = createSessionController(engine, catalogueSession(s, 'atelier'));
  return { engine, session };
}
describe('boucle jouable', () => {
  test('robot → atelier → exécuter : vraie réception en une impulsion', () => {
    const { engine, session } = start();
    const before = engine.getAuthorState();
    session.prepare({ robot: 'R', action: 'livrer', destination: 'Q', cartes: cartesInitiales });
    expect(engine.getAuthorState()).toEqual(before);
    expect(session.frame().missions[0]?.resultat?.statut).toBe('plan');
    session.advance();
    expect(engine.getAuthorState().receptions).toContainEqual({ colis: 'piece', sommet: 'Q', impulsion: 1 });
    expect(engine.getAuthorState().refus).toEqual([]);
    expect(session.frame().missions[0]?.statut).toBe('terminee');
    expect(session.frame().niveau).toBe(2);
  });
  test('la préparation est annulable sans avance ni ordres cachés', () => {
    const { engine, session } = start(); const before = engine.getAuthorState();
    session.prepare({ robot: 'R', action: 'livrer', destination: 'Q', cartes: cartesInitiales }); session.cancel();
    expect(engine.getAuthorState()).toEqual(before); expect(session.frame().missions).toEqual([]);
    session.advance(); expect(engine.getAuthorState().robots.R?.sommet).toBe('P');
  });
  test('suspendre au point d’arrêt, annuler la suspension, puis reprendre sans revenir en arrière', () => {
    const { engine, session } = start();
    session.prepare({ robot: 'R', action: 'deplacer', destination: 'O', cartes: cartesInitiales }); session.advance();
    const first = engine.getAuthorState().robots.R?.sommet;
    session.suspend('R'); session.cancel(); expect(session.frame().missions[0]?.statut).toBe('active');
    session.suspend('R'); session.advance(); expect(engine.getAuthorState().robots.R?.sommet).toBe(first);
    session.resume('R'); session.advance(); expect(engine.getAuthorState().robots.R?.sommet).not.toBe(first);
  });
  test('les trois emplacements configurent effectivement la requête du planificateur', () => {
    const scenario = jouable('atelier'); const catalogue = catalogueSession(scenario, 'atelier'); const view = createSimulation(scenario, 17).getPlayerView();
    const q = planningRequest(catalogue, view, { robot: 'R', action: 'tournee', destination: 'O', cartes: { mesure: 'transfertOuReception', priorite: 'medical', limite: 'critique' } });
    expect(q.mission.objectif).toEqual({ mesure: 'transfertOuReception', priorites: { medical: 3 }, receptionsExigees: [{ colis: 'M', avantOuA: 24 }] });
    const passage = jouable('dernierPassage'); const critical = planningRequest(catalogueSession(passage, 'dernierPassage'), createSimulation(passage, 17).getPlayerView(), { robot: 'R', action: 'livrer', destination: 'P', cartes: { ...cartesInitiales, limite: 'critique' } });
    expect(critical.mission.objectif.receptionsExigees).toContainEqual({ colis: 'battery', avantOuA: 8 });
  });
  test('un conflit simultané est signalé avant exécution, sans sonder le monde réel', () => {
    const base = jouable('atelier'); const s = { ...base, robots: base.robots.map(r => ({ ...r, sommet: r.id === 'R' ? 'O' : 'G' })) };
    const engine = createSimulation(s, 17); const session = createSessionController(engine, catalogueSession(s, 'atelier'));
    for (const robot of ['R', 'R2']) session.prepare({ robot, action: 'deplacer', destination: 'T', cartes: cartesInitiales });
    expect(session.frame().missions.every(m => m.statut === 'refusee' && m.motif?.includes('Conflit prévu'))).toBe(true);
    expect(engine.getAuthorState().impulsion).toBe(0); expect(engine.getAuthorState().refus).toEqual([]);
    session.cancel(); expect(session.frame().missions).toEqual([]);
  });
  test('l’expiration ne glisse pas lors des recalculs ou de la reprise', () => {
    const { engine, session } = start();
    session.prepare({ robot: 'R', action: 'deplacer', destination: 'T', cartes: { ...cartesInitiales, limite: 'expiration' } });
    session.advance(); session.suspend('R'); session.advance(); session.resume('R');
    expect(session.frame().missions[0]?.echeance).toBe(4);
    expect(session.frame().missions[0]?.resultat).toMatchObject({ statut: 'refuse', raisons: [{ code: 'echeanceImpossible' }] });
    expect(engine.getAuthorState().impulsion).toBe(2);
  });
  test('non-fuite de bout en bout : mêmes observations, mêmes propositions et commandes préparées', () => {
    const sessions = [true, false].map(open => { const s = jouable('dernierPassage', open); return createSessionController(createSimulation(s, 17), catalogueSession(s, 'dernierPassage')); });
    for (const session of sessions) session.prepare({ robot: 'R', action: 'livrer', destination: 'P', cartes: cartesInitiales });
    expect(JSON.stringify(sessions[0]!.frame())).toBe(JSON.stringify(sessions[1]!.frame()));
    sessions.forEach(s => s.advance()); expect(JSON.stringify(sessions[0]!.frame())).toBe(JSON.stringify(sessions[1]!.frame()));
  });
  test('une reconfiguration peut rétablir les droits délégués, mais pas élargir la délégation', () => {
    const s = jouable('atelier'); const engine = createSimulation(s, 17); const mission = s.missions.find(m => m.id === 'eva-R')!;
    engine.configureMission({ ...mission, ressources: { ...mission.ressources, colis: ['piece'] }, acces: [] });
    expect(() => engine.configureMission(mission)).not.toThrow();
    expect(() => engine.configureMission({ ...mission, ressources: { ...mission.ressources, robots: ['R', 'R2'] } })).toThrow('Perimetre');
    expect(engine.getAuthorState().impulsion).toBe(0);
  });
});
