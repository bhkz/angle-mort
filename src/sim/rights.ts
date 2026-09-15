import type { ActionAutorisee, Cible, EtatReel, Ordre, Scenario } from './types';

export function permitted(s: Scenario, state: EtatReel, order: Ordre, action: ActionAutorisee, target: Cible): boolean {
  const t = state.impulsion;
  const matching = (beneficiary: 'robot' | 'mission', id: string, allowed?: readonly string[]) => s.droits.some(d =>
    d.beneficiaire.type === beneficiary && d.beneficiaire.id === id && d.action === action && d.canal === order.canal &&
    d.validite.debutInclus <= t && t <= d.validite.finIncluse && !state.droitsRevoques.includes(d.id) &&
    (allowed === undefined || allowed.includes(d.id)) && d.cibles.some(c => c.type === target.type && c.id === target.id));
  if (!order.mission) return matching('robot', order.robot);
  let id: string | null = order.mission;
  while (id !== null) {
    const mission = s.missions.find(m => m.id === id);
    if (!mission || mission.duree.debutInclus > t || mission.duree.finIncluse < t || !mission.ressources.robots.includes(order.robot)) return false;
    const position = state.robots[order.robot]?.sommet;
    if (!position || !mission.zone.includes(position)) return false;
    if (target.type === 'sommet' && !mission.zone.includes(target.id)) return false;
    if (target.type === 'arete' && !s.graphe.aretes.find(e => e.id === target.id)?.extremites.every(v => mission.zone.includes(v))) return false;
    if (!matching('mission', id, mission.acces)) return false;
    id = mission.parent;
  }
  return true;
}

export function cargoPermitted(s: Scenario, order: Ordre, parcel: string): boolean {
  let id = order.mission ?? null;
  while (id !== null) {
    const mission = s.missions.find(m => m.id === id);
    if (!mission || !mission.ressources.colis.includes(parcel)) return false;
    id = mission.parent;
  }
  return true;
}
