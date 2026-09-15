import type { ActionAutorisee, EtatReel, Ordre, Scenario } from './types';
import { cargo, compareId, copy, indexById, matches, operational, requireValue, snapshot, type Mutable } from './util';
import { validateScenario } from './validation';
import { createRng } from './rng';
import { collectObservations, playerView } from './observations';
import { move, refuse } from './movement';
import { cargoPermitted, permitted } from './rights';
import { applyConsequences, resolveNeeds } from './scoring';

function events(s: Scenario, state: Mutable<EtatReel>): void {
  const due = s.evenements.filter(e => e.impulsion === state.impulsion);
  // Equipment changes precede traversal predicates within the scheduled-events stage.
  for (const event of due) {
    if (event.type === 'equipement') {
      const equipment = requireValue(state.equipements[event.equipement], 'Equipement inconnu');
      if (equipment.nature !== 'pompe' || equipment.etat !== 'reparationExterieureRequise') equipment.etat = event.etat;
    } else if (event.type === 'revoquerDroit' && !state.droitsRevoques.includes(event.droit)) state.droitsRevoques.push(event.droit);
  }
  state.droitsRevoques.sort();
  for (const event of due) {
    if (event.type === 'traversee' && matches(state, event.conditions) && operational(s, state, event.service)) {
      state.traversees.push({ evenement: event.id, service: event.service, impulsion: state.impulsion });
    }
  }
}

function handling(s: Scenario, state: Mutable<EtatReel>, orders: readonly Ordre[], blocked: ReadonlySet<string>): void {
  for (const order of orders) {
    if (blocked.has(order.robot)) continue;
    const robot = requireValue(state.robots[order.robot], 'Robot inconnu');
    // Stable partition: all unloads, then explicitly ordered pickups. No auto-pickup policy.
    const operations = [...(order.operations ?? []).filter(o => o.type !== 'charger'), ...(order.operations ?? []).filter(o => o.type === 'charger')];
    for (const operation of operations) {
      const parcel = requireValue(state.colis[operation.colis], 'Colis inconnu');
      if (robot.activite === 'observationFixe' || order.activite === 'observationFixe') { refuse(state, order, operation.type, 'activite'); continue; }
      const transfer = s.graphe.sommets.some(v => v.id === robot.sommet && v.roles.includes('transfert'));
      const action: ActionAutorisee = operation.type === 'deposer' ? 'deposerTransfert'
        : operation.type === 'livrer' ? 'livrer' : transfer ? 'reprendreTransfert' : 'charger';
      if (!cargoPermitted(s, order, parcel.id) || !permitted(s, state, order, action, { type: 'sommet', id: robot.sommet })) {
        refuse(state, order, operation.type, 'droit'); continue;
      }
      const held = parcel.localisation.type === 'porte' && parcel.localisation.robot === robot.id;
      if (operation.type === 'charger') {
        if (parcel.localisation.type !== 'auSol' || parcel.localisation.sommet !== robot.sommet || parcel.disponibleDepuis > state.impulsion || cargo(state, robot.id).length >= robot.capaciteColis) {
          refuse(state, order, operation.type, 'manutention'); continue;
        }
        parcel.localisation = { type: 'porte', robot: robot.id }; robot.activite = 'transport';
      } else if (operation.type === 'deposer') {
        if (!held || !transfer) { refuse(state, order, operation.type, 'manutention'); continue; }
        parcel.localisation = { type: 'auSol', sommet: robot.sommet };
      } else {
        if (!held || parcel.destination !== robot.sommet) { refuse(state, order, operation.type, 'manutention'); continue; }
        parcel.localisation = { type: 'recu', sommet: robot.sommet, impulsion: state.impulsion };
        state.receptions.push({ colis: parcel.id, sommet: robot.sommet, impulsion: state.impulsion });
        if (s.dernierPassage?.batterie === parcel.id && state.impulsion <= s.dernierPassage.seuilPompe) {
          const pump = requireValue(state.equipements[s.dernierPassage.pompe], 'Pompe inconnue');
          if (pump.etat !== 'reparationExterieureRequise') pump.etat = 'operationnelle';
        }
      }
      const mission = s.missions.find(m => m.id === order.mission);
      if (mission && (operation.type === 'livrer' || (operation.type === 'deposer' && mission.objectif.mesure === 'transfertOuReception')) &&
        mission.objectif.mesure !== 'disponibiliteEquipement' && !state.clotures.some(c => c.colis === parcel.id)) {
        state.clotures.push({ mission: mission.id, colis: parcel.id, impulsion: state.impulsion });
      }
    }
  }
}

/** Builds an isolated, deterministic simulation. The supplied checkpoint is already settled. */
export function createSimulation(description: Scenario, seed: number) {
  validateScenario(description);
  const s = copy(description);
  s.graphe.sommets.sort(compareId); s.graphe.aretes.sort(compareId);
  s.sources.sort(compareId); s.besoins.sort(compareId); s.evenements.sort(compareId);
  const rng = createRng(seed);
  const equipment = indexById(s.equipements);
  for (const variant of [...(s.variantes ?? [])].sort(compareId)) {
    requireValue(equipment[variant.equipement], 'Equipement inconnu').etat = requireValue(variant.etats[Math.floor(rng.next() * variant.etats.length)], 'Variante vide');
  }
  const state: Mutable<EtatReel> = {
    impulsion: s.debut, scenario: s.id, version: s.version, graine: seed,
    rng: { algorithme: 'mulberry32-v1', etat: rng.state() }, robots: indexById(s.robots), colis: indexById(s.colis), equipements: equipment,
    droitsRevoques: [], receptions: [], traversees: [], clotures: [], resultats: {},
    consequences: { stock: 'utilisable', atelier: 'intact' }, score: 0, refus: [],
    observations: copy(s.observationsInitiales), constats: [], journal: [], ordresEnAttente: [],
  };
  for (const parcel of Object.values(state.colis)) {
    if (parcel.localisation.type === 'recu') state.receptions.push({ colis: parcel.id, sommet: parcel.localisation.sommet, impulsion: parcel.localisation.impulsion });
  }
  for (const need of s.besoins) state.resultats[need.id] = { etat: 'enAttente' };
  for (const imported of s.besoinsImportes) state.resultats[imported.besoin] = { etat: 'satisfait', impulsion: imported.impulsion, preuve: imported.preuve };
  applyConsequences(s, state); resolveNeeds(s, state); collectObservations(s, state);

  return {
    /** Replaces pending orders for the specified robots; an omitted robot keeps its pending order. */
    submitOrders(orders: readonly Ordre[]): void {
      if (state.impulsion >= s.fin) throw new Error('Tentative terminee');
      const seen = new Set<string>();
      for (const order of orders) {
        if (!Object.hasOwn(state.robots, order.robot) || seen.has(order.robot)) throw new Error('Robot inconnu ou ordres concurrents');
        seen.add(order.robot);
        if (order.destination !== undefined && !s.graphe.sommets.some(v => v.id === order.destination)) throw new Error('Sommet inconnu');
        if (typeof order.canal !== 'string' || !order.canal.length) throw new Error('Canal requis');
        if (order.mission !== undefined && !s.missions.some(m => m.id === order.mission)) throw new Error('Mission inconnue');
        if (order.activite !== undefined && !['transport', 'observationFixe', 'disponible'].includes(order.activite)) throw new Error('Activite inconnue');
        for (const operation of order.operations ?? []) {
          if (!Object.hasOwn(state.colis, operation.colis) || !['charger', 'livrer', 'deposer'].includes(operation.type)) throw new Error('Operation inconnue');
        }
      }
      // Only catalogue/schema validation here: no oracle about hidden positions, cargo or gates.
      const next = new Map(state.ordresEnAttente.map(o => [o.robot, o]));
      orders.forEach(order => next.set(order.robot, copy(order)));
      state.ordresEnAttente = [...next.values()].sort((a, b) => compareId({ id: a.robot }, { id: b.robot }));
    },
    /** Completes exactly one integer pulse. No return value can leak the author state. */
    advance(): void {
      if (state.impulsion >= s.fin) throw new Error('Tentative terminee');
      state.impulsion++;
      const orders = state.ordresEnAttente; state.ordresEnAttente = [];
      state.journal.push({ impulsion: state.impulsion, ordres: copy(orders) });
      events(s, state);
      const blocked = move(s, state, orders);
      handling(s, state, orders, blocked);
      collectObservations(s, state);
      applyConsequences(s, state);
      resolveNeeds(s, state);
    },
    getAuthorState: (): EtatReel => snapshot(state),
    getPlayerView: () => snapshot(playerView(s, state)),
  };
}
export type Simulation = ReturnType<typeof createSimulation>;
