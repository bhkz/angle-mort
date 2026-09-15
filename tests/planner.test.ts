import { describe, expect, test } from 'vitest';
import { planifier } from '../src/planner';
import type { Plan, RequetePlanification, ResultatPlanification } from '../src/planner';
import { createSimulation } from '../src/sim';
import type { Scenario } from '../src/sim';
import { connu, microcas } from './fixtures/microcas';
import type { ConfigurationMicrocas } from './fixtures/microcas';

const gold: readonly (ConfigurationMicrocas & { J: number; commercial: number; medical: number })[] = [
  { mesure: 'receptionDestination', w: 1, depotT: true, J: 18, commercial: 2, medical: 0 },
  { mesure: 'receptionDestination', w: 3, depotT: true, J: 34, commercial: 1, medical: 1 },
  { mesure: 'transfertOuReception', w: 1, depotT: true, J: 27, commercial: 0, medical: 0 },
  { mesure: 'transfertOuReception', w: 3, depotT: true, J: 47, commercial: 0, medical: 0 },
  { mesure: 'transfertOuReception', w: 3, depotT: true, medicalExige: true, J: 44, commercial: 0, medical: 1 },
  { mesure: 'transfertOuReception', w: 3, depotT: false, J: 34, commercial: 1, medical: 1 },
];
function resultPlan(result: ResultatPlanification): Plan {
  expect(result.statut, JSON.stringify(result)).toBe('plan');
  if (result.statut !== 'plan') throw new Error('Plan attendu');
  return result.plan;
}
function replay(scenario: Scenario, plan: Plan) {
  const initialCargo = new Map(plan.chargementInitial.flatMap(load => load.colis.map(id => [id, load.robot] as const)));
  expect(initialCargo.size).toBe(plan.chargementInitial.reduce((n, load) => n + load.colis.length, 0));
  for (const load of plan.chargementInitial) {
    expect(load.colis.length).toBeLessThanOrEqual(2);
    const robot = scenario.robots.find(r => r.id === load.robot)!;
    expect(scenario.graphe.sommets.find(v => v.id === robot.sommet)?.roles).toContain('depot');
    for (const id of load.colis) expect(scenario.colis.find(c => c.id === id)?.localisation).toEqual({ type: 'auSol', sommet: robot.sommet });
  }
  const sim = createSimulation({ ...scenario, colis: scenario.colis.map(c => initialCargo.has(c.id) ? { ...c, localisation: { type: 'porte', robot: initialCargo.get(c.id)! } } : c) }, 17);
  let moves = 0;
  for (const step of plan.etapes) {
    expect(step.impulsion).toBe(sim.getAuthorState().impulsion + 1);
    const before = sim.getAuthorState(); sim.submitOrders(step.ordres); sim.advance();
    for (const r of Object.values(sim.getAuthorState().robots)) if (r.sommet !== before.robots[r.id]?.sommet) moves++;
  }
  while (sim.getAuthorState().impulsion < scenario.fin) sim.advance();
  const state = sim.getAuthorState();
  expect(state.refus).toEqual([]);
  expect(state.receptions).toEqual(expect.arrayContaining([...plan.receptionsPrevues]));
  expect(state.receptions).toHaveLength(plan.receptionsPrevues.length);
  expect(moves).toBe(plan.deplacements);
  return state;
}

describe('six optima du microcas — plans calcules puis executes par le moteur', () => {
  test.each(gold)('$mesure w=$w depot=$depotT medicalExige=$medicalExige : J=$J', config => {
    const { requete, scenario } = microcas(config);
    const result = planifier(requete); const plan = resultPlan(result);
    expect(result.recherche.exhaustive, JSON.stringify(result.recherche)).toBe(true);
    expect(result).toMatchObject({ garantie: 'optimalSelonCroyances' });
    expect(plan.J).toBe(config.J);
    const state = replay(scenario, plan);
    const receipts = state.receptions.map(r => scenario.colis.find(c => c.id === r.colis)!);
    expect(receipts.filter(c => c.nature === 'commercial')).toHaveLength(config.commercial);
    expect(receipts.filter(c => c.nature === 'medical')).toHaveLength(config.medical);
    const actualJ = 10 * state.clotures.reduce((sum, c) => sum + (c.colis === 'M' ? config.w : 1), 0) - plan.deplacements;
    expect(actualJ).toBe(config.J);
    if (config.medicalExige) for (const id of ['C1', 'C2']) expect(state.colis[id]?.localisation).toEqual({ type: 'auSol', sommet: 'T' });
  }, 60_000);

  test('changer uniquement la mesure change les ordres et les receptions physiques', () => {
    const real = microcas({ mesure: 'receptionDestination', w: 3, depotT: true });
    const transfer = microcas({ mesure: 'transfertOuReception', w: 3, depotT: true });
    const a = resultPlan(planifier(real.requete)); const b = resultPlan(planifier(transfer.requete));
    expect(a.etapes).not.toEqual(b.etapes);
    expect(a.J).toBe(34); expect(b.J).toBe(47);
    expect(replay(real.scenario, a).receptions).toHaveLength(2);
    expect(replay(transfer.scenario, b).receptions).toEqual([]);
  }, 60_000);
});

describe('bornes, refus et croyances', () => {
  const base = () => microcas({ mesure: 'receptionDestination', w: 3, depotT: true, medicalExige: true }).requete;

  test('un refus explique un acces absent', () => {
    const q = base();
    expect(planifier({ ...q, droitsDisponibles: q.droitsDisponibles.filter(d => d.action !== 'livrer') }))
      .toMatchObject({ statut: 'refuse', raisons: [{ code: 'accesAbsent', message: expect.stringContaining('M') }] });
  });
  test('un refus explique une echeance impossible', () => {
    expect(planifier({ ...base(), horizon: 3 })).toMatchObject({ statut: 'refuse', raisons: [{ code: 'echeanceImpossible' }] });
  });
  test('une disponibilite tardive laisse trop peu de temps pour la livraison', () => {
    const q = base();
    expect(planifier({ ...q, croyances: { ...q.croyances, colis: q.croyances.colis.map(c => c.id === 'M' ? { ...c, disponibleDepuis: 5 } : c) } }))
      .toMatchObject({ statut: 'refuse', raisons: [{ code: 'echeanceImpossible' }] });
  });
  test('un refus explique un conflit materiel', () => {
    const q = base();
    expect(planifier({ ...q, croyances: { ...q.croyances, robots: q.croyances.robots.map(r => ({ ...r, energie: connu({ type: 'limitee', restante: 0 }) })) } }))
      .toMatchObject({ statut: 'refuse', raisons: [{ code: 'conflitMateriel', message: expect.stringContaining('Energie') }] });
  });
  test('budget epuise : jamais optimal, jamais impossible', () => {
    const q = base(); const limited = planifier({ ...q, budget: { maxEtats: 1, maxTransitions: 1 } });
    expect(limited).toMatchObject({ statut: 'incomplet', recherche: { exhaustive: false, arret: 'budgetEpuise' } });
    expect(limited).not.toHaveProperty('garantie');
    const noConstraint = { ...q, mission: { ...q.mission, objectif: { ...q.mission.objectif, receptionsExigees: [] } } };
    const best = planifier({ ...noConstraint, budget: { maxEtats: 1, maxTransitions: 20 } });
    expect(best).toMatchObject({ statut: 'plan', garantie: 'meilleurTrouve', recherche: { exhaustive: false, arret: 'budgetEpuise' } });
  });
  test('position inconnue : demande de connaissance, pas de valeur par defaut', () => {
    const q = base();
    expect(planifier({ ...q, croyances: { ...q.croyances, robots: q.croyances.robots.map(r => ({ ...r, position: { etat: 'inconnu' } })) } }))
      .toMatchObject({ statut: 'incomplet', recherche: { arret: 'informationInsuffisante' } });
  });
  test('aucune lecture supplementaire de verite cachee sur l entree', () => {
    const q = base();
    Object.defineProperty(q.croyances, 'etatReel', { get() { throw new Error('Fuite de verite'); } });
    const result = planifier({ ...q, budget: { maxEtats: 1, maxTransitions: 20 } });
    expect(result.recherche.arret).toBe('budgetEpuise');
  });
  test('une fonction de disponibilite non modelisee ne peut etre certifiee optimale', () => {
    const q = base(); const changed: RequetePlanification = { ...q, mission: { ...q.mission, objectif: { ...q.mission.objectif, mesure: 'disponibiliteEquipement' } } };
    expect(planifier(changed)).toMatchObject({ statut: 'incomplet', recherche: { exhaustive: false, arret: 'modeleNonPrisEnCharge' } });
  });

  test('portes inconnues et perimees : politique explicite, aucune verite cachee', () => {
    const q = base();
    const graph = { ...q.croyances.graphe, aretes: q.croyances.graphe.aretes.map(e => e.id === 'TX' ? { ...e, controlePar: ['porte'] } : e) };
    const unknown: RequetePlanification = { ...q, croyances: { ...q.croyances, graphe: graph, equipements: [{ id: 'porte', nature: 'porte', etat: { etat: 'inconnu' } }] } };
    expect(planifier(unknown)).toMatchObject({ statut: 'incomplet', recherche: { arret: 'informationInsuffisante' } });
    const optimistic = planifier({ ...unknown, politique: { ...unknown.politique, inconnue: 'supposerPassable' } });
    expect(resultPlan(optimistic)).toMatchObject({ J: 34, hypotheses: [expect.stringContaining('inconnu')] });
    const dated: RequetePlanification = { ...unknown, croyances: { ...unknown.croyances, equipements: [{ id: 'porte', nature: 'porte', etat: { etat: 'datee', valeur: 'ouverte', source: 'camera', impulsion: 0 } }] } };
    expect(resultPlan(planifier(dated)).J).toBe(34);
    expect(planifier({ ...dated, politique: { ...dated.politique, datee: 'bloquer' } })).toMatchObject({ statut: 'incomplet' });
    const closed: RequetePlanification = { ...unknown, croyances: { ...unknown.croyances, equipements: [{ id: 'porte', nature: 'porte', etat: connu('bloquee') }] } };
    expect(planifier(closed)).toMatchObject({ statut: 'refuse', raisons: [{ code: 'conflitMateriel' }] });
  }, 60_000);

  test('retrait de droit annonce : actions futures legales et changement du plan', () => {
    const fixture = microcas({ mesure: 'transfertOuReception', w: 1, depotT: true });
    const event = { id: 'retrait', impulsion: 2, type: 'revoquerDroit' as const, droit: 'deposerTransfert' };
    const q = { ...fixture.requete, croyances: { ...fixture.requete.croyances, annonces: [{ ...event, source: 'contrat-public' }] } };
    const result = planifier(q); const plan = resultPlan(result);
    expect(result.recherche.exhaustive).toBe(true); expect(plan.J).toBe(26);
    replay({ ...fixture.scenario, evenements: [event] }, plan);
  }, 60_000);

  test('les croyances peuvent prevoir une reception que le monde reel empechera', () => {
    const fixture = microcas({ mesure: 'receptionDestination', w: 3, depotT: true, medicalExige: true });
    const graph = { ...fixture.requete.croyances.graphe, aretes: fixture.requete.croyances.graphe.aretes.map(e => e.id === 'TX' ? { ...e, controlePar: ['porte'] } : e) };
    const request: RequetePlanification = { ...fixture.requete, croyances: { ...fixture.requete.croyances, graphe: graph, equipements: [{ id: 'porte', nature: 'porte', etat: connu('ouverte') }] } };
    const first = planifier(request); const plan = resultPlan(first);
    const load = new Map(plan.chargementInitial.flatMap(l => l.colis.map(id => [id, l.robot] as const)));
    const hidden: Scenario = { ...fixture.scenario, graphe: graph,
      equipements: [{ id: 'porte', nature: 'porte', cible: { type: 'arete', id: 'TX' }, etat: 'ouverte' }],
      evenements: [{ id: 'fermeture-non-recue', impulsion: 1, type: 'equipement', equipement: 'porte', etat: 'bloquee' }],
      colis: fixture.scenario.colis.map(c => load.has(c.id) ? { ...c, localisation: { type: 'porte', robot: load.get(c.id)! } } : c),
    };
    const actual = createSimulation(hidden, 99);
    for (const step of plan.etapes) { actual.submitOrders(step.ordres); actual.advance(); }
    expect(plan.receptionsPrevues.some(r => r.colis === 'M')).toBe(true);
    expect(actual.getAuthorState().receptions.some(r => r.colis === 'M')).toBe(false);
    expect(actual.getAuthorState().refus.length).toBeGreaterThan(0);
    expect(planifier(request)).toEqual(first);
  }, 60_000);

  test('deux robots : entree dans le sommet libere, plan stable et rejouable', () => {
    const fixture = microcas({ mesure: 'receptionDestination', w: 1, depotT: true });
    const q = fixture.requete;
    const mission = { ...q.mission, duree: { debutInclus: 0, finIncluse: 2 }, ressources: { ...q.mission.ressources, robots: ['R', 'R2'] },
      objectif: { ...q.mission.objectif, receptionsExigees: ['C1', 'C2'].map(colis => ({ colis, avantOuA: 2 })) } };
    const request: RequetePlanification = { ...q, horizon: 2, mission, croyances: { ...q.croyances, robots: [...q.croyances.robots, { ...q.croyances.robots[0]!, id: 'R2', position: connu('T') }] } };
    const result = planifier(request); const plan = resultPlan(result);
    expect(result.recherche.exhaustive).toBe(true); expect(plan.J).toBe(17);
    const scenario: Scenario = { ...fixture.scenario, fin: 2, missions: [mission], robots: [...fixture.scenario.robots, { ...fixture.scenario.robots[0]!, id: 'R2', sommet: 'T', sourceLocale: 'telemetrie2' }],
      sources: [...fixture.scenario.sources, { ...fixture.scenario.sources[0]!, id: 'telemetrie2', support: { type: 'robot', id: 'R2' }, couverture: [] }] };
    expect(replay(scenario, plan).receptions).toHaveLength(2);
    const reordered: RequetePlanification = { ...request, droitsDisponibles: [...request.droitsDisponibles].reverse(), croyances: {
      ...request.croyances, robots: [...request.croyances.robots].reverse(), colis: [...request.croyances.colis].reverse(),
      graphe: { sommets: [...request.croyances.graphe.sommets].reverse(), aretes: [...request.croyances.graphe.aretes].reverse() },
    } };
    expect(planifier(reordered)).toEqual(result);
  }, 60_000);
});
