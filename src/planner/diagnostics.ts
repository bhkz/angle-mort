import type { Arete } from '../sim/types';
import { allowed, InformationInsuffisante, parcelAllowed, passable, refuser } from './model';
import type { Modele } from './model';

/** Necessary conditions only: these relaxed lower bounds never claim sufficiency. */
export function checkNecessaryConditions(model: Modele): void {
  const q = model.requete; const start = model.initial.t;
  const end = Math.min(start + q.horizon, ...model.contrats.map(m => m.duree.finIncluse));
  const staticOccupants = new Set(Object.entries(model.initial.positions).filter(([id]) => !model.robots.includes(id)).map(([, v]) => v));
  // Known changes split time into constant intervals, even for a very large horizon.
  const times = [...new Set([start, start + 1, end,
    ...q.droitsDisponibles.flatMap(d => [d.validite.debutInclus, d.validite.finIncluse, d.validite.finIncluse + 1]),
    ...q.croyances.annonces.map(a => a.impulsion), ...model.contrats.map(m => m.duree.debutInclus),
  ])].filter(t => t >= start && t <= end).sort((a, b) => a - b);
  const possibleEdge = (e: Arete) => !e.extremites.some(v => staticOccupants.has(v)) && times.some(t => e.controlePar.every(id => passable(model, id, t)));
  function distance(from: string, to: string, filter: (e: Arete) => boolean, energy = false): number {
    const dist = new Map(q.croyances.graphe.sommets.map(v => [v.id, Infinity])); dist.set(from, 0);
    const remaining = new Set(dist.keys());
    while (remaining.size) {
      let nearest: string | undefined;
      for (const v of remaining) if (nearest === undefined || dist.get(v)! < dist.get(nearest)!) nearest = v;
      if (nearest === undefined || dist.get(nearest) === Infinity) break;
      if (nearest === to) return dist.get(to)!;
      remaining.delete(nearest);
      for (const e of q.croyances.graphe.aretes) {
        if (!e.extremites.includes(nearest) || !filter(e)) continue;
        const other = e.extremites.find(v => v !== nearest)!;
        dist.set(other, Math.min(dist.get(other)!, dist.get(nearest)! + (energy ? e.coutEnergie : 1)));
      }
    }
    return dist.get(to)!;
  }
  function material(message: string): never {
    if (model.incertain) throw new InformationInsuffisante(`${message} ; les croyances incertaines ne permettent pas de conclure a une impossibilite physique`);
    return refuser('conflitMateriel', message);
  }
  for (const requirement of model.contrats.flatMap(m => m.objectif.receptionsExigees)) {
    const loc = model.initial.colis[requirement.colis]!;
    if (loc.type === 'recu') {
      if (loc.impulsion <= requirement.avantOuA) continue;
      refuser('echeanceImpossible', `${requirement.colis} est deja recu apres son echeance`);
    }
    if (!parcelAllowed(model, requirement.colis)) refuser('accesAbsent', `${requirement.colis} ne fait pas partie des ressources autorisees`);
    const parcel = q.croyances.colis.find(c => c.id === requirement.colis)!;
    const robots = model.robots.filter(id => (loc.type !== 'porte' || loc.robot === id) && model.contrats.every(m => m.ressources.robots.includes(id)));
    if (!robots.length) material(`Aucun robot autorise ne peut prendre en charge ${parcel.id}`);
    const options = robots.map(robot => {
      const from = model.initial.positions[robot]!; const pickup = loc.type === 'auSol' ? loc.sommet : from;
      const pickupHops = distance(from, pickup, possibleEdge);
      const deliveryHops = distance(pickup, parcel.destination, possibleEdge);
      const hops = pickupHops + deliveryHops;
      const freeLoad = q.chargementInitial && q.croyances.graphe.sommets.find(v => v.id === pickup)!.roles.includes('depot');
      const earliest = loc.type === 'porte' ? start + Math.max(1, deliveryHops)
        : Math.max(start + Math.max(freeLoad ? 0 : 1, pickupHops), parcel.disponibleDepuis) + Math.max(1, deliveryHops);
      const cost = distance(from, pickup, possibleEdge, true) + distance(pickup, parcel.destination, possibleEdge, true);
      const latest = Math.min(end, requirement.avantOuA);
      const edgeWithRights = (e: Arete) => possibleEdge(e) && times.some(t => t <= latest && allowed(model, robot, 'traverser', { type: 'arete', id: e.id }, t, e.extremites[0]));
      const transfer = q.croyances.graphe.sommets.find(v => v.id === pickup)!.roles.includes('transfert');
      const hasRights = times.some(t => t <= latest && allowed(model, robot, 'livrer', { type: 'sommet', id: parcel.destination }, t, parcel.destination)) &&
        (loc.type === 'porte' || times.some(t => t <= latest && allowed(model, robot, transfer ? 'reprendreTransfert' : 'charger', { type: 'sommet', id: pickup }, t, pickup))) &&
        distance(from, pickup, edgeWithRights) < Infinity && distance(pickup, parcel.destination, edgeWithRights) < Infinity;
      return { hops, earliest, cost, energy: model.initial.energies[robot], hasRights };
    });
    if (options.every(o => !Number.isFinite(o.hops))) material(`Aucun trajet materiellement accessible vers ${parcel.destination} pour ${parcel.id}`);
    const latest = Math.min(end, requirement.avantOuA);
    if (options.every(o => o.earliest > latest)) refuser('echeanceImpossible', `Reception de ${parcel.id} impossible avant t${latest}, meme sans concurrence`);
    if (options.every(o => o.energy !== null && o.cost > o.energy!)) material(`Energie insuffisante pour recevoir ${parcel.id}`);
    if (options.every(o => !o.hasRights)) refuser('accesAbsent', `Acces absent pour charger, traverser ou livrer ${parcel.id}`);
  }
}
