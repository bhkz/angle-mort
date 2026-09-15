import type { Arete, EtatReel, Ordre, Refus, Scenario } from './types';
import { cargo, requireValue, type Mutable } from './util';
import { permitted } from './rights';

export function refuse(state: Mutable<EtatReel>, order: Ordre, action: string, motif: Refus['motif']): void {
  const robot = requireValue(state.robots[order.robot], 'Robot inconnu');
  state.refus.push({ impulsion: state.impulsion, robot: order.robot, source: robot.sourceLocale, canal: order.canal, action, motif });
}

export function move(s: Scenario, state: Mutable<EtatReel>, orders: readonly Ordre[]): Set<string> {
  const proposals = new Map<string, { order: Ordre; from: string; to: string; edge: Arete }>();
  const blocked = new Set<string>();
  for (const order of orders) {
    const robot = requireValue(state.robots[order.robot], 'Robot inconnu');
    const to = order.destination ?? robot.sommet;
    if (to === robot.sommet) continue;
    const edge = s.graphe.aretes.find(e => e.extremites.includes(robot.sommet) && e.extremites.includes(to));
    let failure: Refus['motif'] | null = null;
    if (!edge) failure = 'passage';
    else if (!permitted(s, state, order, 'traverser', { type: 'arete', id: edge.id })) failure = 'droit';
    else if (edge.controlePar.some(id => !['ouverte', 'abaissee'].includes(requireValue(state.equipements[id], 'Equipement inconnu').etat))) failure = 'passage';
    else if (robot.energie.type === 'limitee' && robot.energie.restante < edge.coutEnergie) failure = 'energie';
    if (failure || !edge) { blocked.add(robot.id); refuse(state, order, 'deplacement', failure ?? 'passage'); }
    else proposals.set(robot.id, { order, from: robot.sommet, to, edge });
  }
  const conflicts = new Set<string>();
  for (const [aId, a] of proposals) {
    for (const [bId, b] of proposals) {
      if (aId !== bId && (a.to === b.to || (a.to === b.from && b.to === a.from))) {
        conflicts.add(aId); conflicts.add(bId);
      }
    }
  }
  conflicts.forEach(id => blocked.add(id));
  let changed = true;
  while (changed) {
    changed = false;
    for (const [id, proposal] of proposals) {
      if (blocked.has(id)) continue;
      const occupant = Object.values(state.robots).find(r => r.sommet === proposal.to);
      if (occupant && (!proposals.has(occupant.id) || blocked.has(occupant.id))) {
        blocked.add(id); changed = true;
      }
    }
  }
  for (const [id, p] of proposals) {
    if (blocked.has(id)) { refuse(state, p.order, 'deplacement', 'occupation'); continue; }
    const robot = requireValue(state.robots[id], 'Robot inconnu');
    robot.sommet = p.to;
    if (robot.energie.type === 'limitee') robot.energie.restante -= p.edge.coutEnergie;
    robot.activite = 'transport';
  }
  for (const order of orders) {
    if (blocked.has(order.robot)) continue;
    const robot = requireValue(state.robots[order.robot], 'Robot inconnu');
    robot.mission = order.mission ?? null; robot.canal = order.canal;
    if (order.activite === 'observationFixe') {
      if (cargo(state, robot.id).length || (order.operations?.length ?? 0) > 0) refuse(state, order, 'observation', 'activite');
      else if (!permitted(s, state, order, 'observer', { type: 'sommet', id: robot.sommet })) refuse(state, order, 'observation', 'droit');
      else robot.activite = 'observationFixe';
    } else if (order.activite) robot.activite = order.activite;
  }
  return blocked;
}
