import type { OperationLocale, Ordre } from '../sim/types';
import type { Modele, EtatPrevu } from './model';
import { allowed, cargo, clone, closeParcel, compare, expired, feasible, parcelAllowed, passable, score } from './model';
import type { Plan, Recherche } from './types';

class BudgetEpuise extends Error {}
export class Budget {
  etats = 0;
  transitions = 0;
  constructor(private readonly maxEtats: number, private readonly maxTransitions: number) {}
  transition(): void { if (this.transitions >= this.maxTransitions) throw new BudgetEpuise(); this.transitions++; }
  expand(): void { if (this.etats >= this.maxEtats) throw new BudgetEpuise(); this.etats++; }
}

// Enumerating at most two pickups needs O(n²) choices, not a materialized power set.
function* subsets(items: readonly string[], capacity: number): Generator<string[]> {
  yield [];
  if (capacity >= 1) for (let i = 0; i < items.length; i++) {
    yield [items[i]!];
    if (capacity >= 2) for (let j = i + 1; j < items.length; j++) yield [items[i]!, items[j]!];
  }
}

function* initialStates(model: Modele, budget: Budget, index = 0, state = model.initial): Generator<EtatPrevu> {
  if (index === model.robots.length) { budget.transition(); yield state; return; }
  const robot = model.robots[index]!; const position = state.positions[robot]!;
  const depot = model.requete.croyances.graphe.sommets.find(v => v.id === position)!.roles.includes('depot');
  const candidates = model.requete.chargementInitial && depot && allowed(model, robot, 'charger', { type: 'sommet', id: position }, state.t, position)
    ? Object.keys(state.colis).filter(id => {
      const loc = state.colis[id]; const parcel = model.requete.croyances.colis.find(c => c.id === id)!;
      return loc?.type === 'auSol' && loc.sommet === position && parcel.disponibleDepuis <= state.t && parcelAllowed(model, id);
    }).sort(compare) : [];
  for (const picked of subsets(candidates, 2 - cargo(state, robot).length)) {
    budget.transition();
    const next = clone(state);
    for (const id of picked) next.colis[id] = { type: 'porte', robot };
    if (picked.length) next.chargementInitial = [...next.chargementInitial, { robot, colis: picked }];
    next.operations += picked.length; next.clePlan = JSON.stringify(next.chargementInitial);
    yield* initialStates(model, budget, index + 1, next);
  }
}

interface Deplacement { robot: string; from: string; to: string; cost: number; moves: number }
function* jointMoves(model: Modele, state: EtatPrevu, t: number, budget: Budget, index = 0, chosen: Deplacement[] = []): Generator<Deplacement[]> {
  if (index === model.robots.length) {
    const positions = { ...state.positions }; chosen.forEach(m => { positions[m.robot] = m.to; });
    if (new Set(Object.values(positions)).size !== Object.keys(positions).length) return;
    if (chosen.some(a => chosen.some(b => a.robot !== b.robot && a.from === b.to && a.to === b.from))) return;
    yield chosen; return;
  }
  const robot = model.robots[index]!; const from = state.positions[robot]!;
  const choices: Deplacement[] = [{ robot, from, to: from, cost: 0, moves: 0 }];
  const edges = model.requete.croyances.graphe.aretes.filter(e => e.extremites.includes(from)).sort((a, b) => compare(a.id, b.id));
  for (const edge of edges) {
    budget.transition();
    if (!allowed(model, robot, 'traverser', { type: 'arete', id: edge.id }, t, from) || !edge.controlePar.every(id => passable(model, id, t))) continue;
    if (state.energies[robot] !== null && state.energies[robot]! < edge.coutEnergie) continue;
    const to = edge.extremites.find(v => v !== from)!;
    choices.push({ robot, from, to, cost: edge.coutEnergie, moves: 1 });
  }
  choices.sort((a, b) => compare(a.to, b.to));
  for (const movement of choices) { budget.transition(); yield* jointMoves(model, state, t, budget, index + 1, [...chosen, movement]); }
}

interface LocalChoice { state: EtatPrevu; operations: OperationLocale[] }
function* localChoices(model: Modele, state: EtatPrevu, robot: string, budget: Budget): Generator<LocalChoice> {
  const position = state.positions[robot]!;
  const transfer = model.requete.croyances.graphe.sommets.find(v => v.id === position)!.roles.includes('transfert');
  const held = cargo(state, robot);
  function* unload(index: number, current: EtatPrevu, operations: OperationLocale[]): Generator<LocalChoice> {
    if (index === held.length) { yield { state: current, operations }; return; }
    const id = held[index]!; const parcel = model.requete.croyances.colis.find(c => c.id === id)!;
    budget.transition(); yield* unload(index + 1, current, operations);
    if (!parcelAllowed(model, id)) return;
    for (const type of ['livrer', 'deposer'] as const) {
      if (type === 'livrer' ? parcel.destination !== position : !transfer) continue;
      if (!allowed(model, robot, type === 'livrer' ? 'livrer' : 'deposerTransfert', { type: 'sommet', id: position }, state.t, position)) continue;
      budget.transition();
      const next = clone(current);
      next.colis[id] = type === 'livrer' ? { type: 'recu', sommet: position, impulsion: state.t } : { type: 'auSol', sommet: position };
      closeParcel(model, next, id, type);
      yield* unload(index + 1, next, [...operations, { type, colis: id }]);
    }
  }
  for (const unloaded of unload(0, state, [])) {
    const candidates = allowed(model, robot, transfer ? 'reprendreTransfert' : 'charger', { type: 'sommet', id: position }, state.t, position)
      ? Object.keys(unloaded.state.colis).filter(id => {
        const loc = unloaded.state.colis[id]; const parcel = model.requete.croyances.colis.find(c => c.id === id)!;
        return loc?.type === 'auSol' && loc.sommet === position && parcel.disponibleDepuis <= state.t && parcelAllowed(model, id);
      }).sort(compare) : [];
    for (const picked of subsets(candidates, 2 - cargo(unloaded.state, robot).length)) {
      budget.transition(); const next = clone(unloaded.state);
      for (const id of picked) next.colis[id] = { type: 'porte', robot };
      yield { state: next, operations: [...unloaded.operations, ...picked.map(colis => ({ type: 'charger' as const, colis }))] };
    }
  }
}

function* handleAll(model: Modele, state: EtatPrevu, moves: readonly Deplacement[], budget: Budget, index = 0, orders: Ordre[] = []): Generator<EtatPrevu> {
  if (index === model.robots.length) {
    const next = clone(state);
    next.etapes = [...next.etapes, { impulsion: state.t, ordres: orders }];
    next.operations += orders.reduce((sum, o) => sum + (o.operations?.length ?? 0), 0);
    next.clePlan = JSON.stringify([next.chargementInitial, next.etapes]);
    yield next; return;
  }
  const robot = model.robots[index]!; const movement = moves.find(m => m.robot === robot)!;
  for (const local of localChoices(model, state, robot, budget)) {
    const order: Ordre = { robot, canal: model.requete.croyances.robots.find(r => r.id === robot)!.canal, mission: model.requete.mission.id,
      destination: movement.to, activite: 'transport', operations: local.operations };
    yield* handleAll(model, local.state, moves, budget, index + 1, [...orders, order]);
  }
}
function* successors(model: Modele, state: EtatPrevu, budget: Budget): Generator<EtatPrevu> {
  const t = state.t + 1;
  for (const moves of jointMoves(model, state, t, budget)) {
    const next = clone(state); next.t = t;
    for (const movement of moves) {
      next.positions[movement.robot] = movement.to; next.deplacements += movement.moves;
      if (next.energies[movement.robot] !== null) next.energies[movement.robot]! -= movement.cost;
    }
    yield* handleAll(model, next, moves, budget);
  }
}
function stateKey(state: EtatPrevu): string {
  return JSON.stringify([state.t, state.positions, state.energies, state.colis, state.clotures]);
}
function better(model: Modele, a: EtatPrevu, b: EtatPrevu): boolean {
  return score(model, a) > score(model, b) || (score(model, a) === score(model, b) && (
    a.deplacements < b.deplacements || (a.deplacements === b.deplacements && (
      a.etapes.length < b.etapes.length || (a.etapes.length === b.etapes.length && (
        a.operations < b.operations || (a.operations === b.operations && compare(a.clePlan, b.clePlan) < 0)))))));
}

export function search(model: Modele): { best: EtatPrevu | null; recherche: Recherche } {
  const budget = new Budget(model.requete.budget.maxEtats, model.requete.budget.maxTransitions);
  let best: EtatPrevu | null = null; let complete = true;
  function consider(state: EtatPrevu): void { if (feasible(model, state) && (!best || better(model, state, best))) best = state; }
  function insert(frontier: Map<string, EtatPrevu>, state: EtatPrevu): void {
    consider(state); const key = stateKey(state); const previous = frontier.get(key);
    if (!previous || better(model, state, previous)) frontier.set(key, state);
  }
  try {
    let frontier = new Map<string, EtatPrevu>();
    for (const state of initialStates(model, budget)) insert(frontier, state);
    const end = Math.min(model.initial.t + model.requete.horizon, ...model.contrats.map(m => m.duree.finIncluse));
    for (let t = model.initial.t; t < end && frontier.size; t++) {
      const next = new Map<string, EtatPrevu>();
      for (const [, state] of [...frontier.entries()].sort(([a], [b]) => compare(a, b))) {
        if (expired(model, state)) continue;
        budget.expand();
        for (const child of successors(model, state, budget)) insert(next, child);
      }
      frontier = next;
    }
  } catch (error) {
    if (!(error instanceof BudgetEpuise)) throw error;
    complete = false;
  }
  return { best, recherche: { exhaustive: complete, etatsExplores: budget.etats, transitionsExaminees: budget.transitions, arret: complete ? 'terminee' : 'budgetEpuise' } };
}

export function toPlan(model: Modele, state: EtatPrevu): Plan {
  return {
    chargementInitial: clone(state.chargementInitial), etapes: clone(state.etapes), J: score(model, state), deplacements: state.deplacements,
    cloturesPrevues: state.clotures.filter(id => !model.requete.croyances.cloturesConnues.includes(id)),
    receptionsPrevues: Object.entries(state.colis).flatMap(([colis, loc]) => loc.type === 'recu' && model.initial.colis[colis]?.type !== 'recu'
      ? [{ colis, sommet: loc.sommet, impulsion: loc.impulsion }] : []),
    hypotheses: [...model.hypotheses],
  };
}
