import type { ActionAutorisee, Cible, ContratMission, EtatEquipement, LocalisationColis, OperationLocale } from '../sim/types';
import type { CodeRefus, Connaissance, Plan, RaisonRefus, RequetePlanification } from './types';

export const compare = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
export const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
export class InformationInsuffisante extends Error {}
export class ModeleNonPrisEnCharge extends Error {}
export class RefusConnu extends Error {
  constructor(readonly raison: RaisonRefus) { super(raison.message); }
}
export interface EtatPrevu {
  t: number;
  positions: Record<string, string>;
  energies: Record<string, number | null>;
  colis: Record<string, LocalisationColis>;
  clotures: string[];
  deplacements: number;
  operations: number;
  chargementInitial: Plan['chargementInitial'];
  etapes: Plan['etapes'];
  clePlan: string;
}
export interface Modele {
  requete: RequetePlanification;
  contrats: readonly ContratMission[];
  robots: readonly string[];
  initial: EtatPrevu;
  hypotheses: string[];
  incertain: boolean;
}
function integer(n: number, label: string): void {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`${label} doit etre un entier positif ou nul`);
}
function unique(ids: readonly string[], label: string): void {
  if (new Set(ids).size !== ids.length || ids.some(id => !id || Object.hasOwn(Object.prototype, id))) throw new Error(`Identifiants invalides : ${label}`);
}
export function refuser(code: CodeRefus, message: string): never { throw new RefusConnu({ code, message }); }

export function prepareModel(q: RequetePlanification): Modele {
  const b = q.croyances;
  integer(b.impulsion, 'Impulsion'); integer(q.horizon, 'Horizon');
  integer(q.budget.maxEtats, 'Budget etats'); integer(q.budget.maxTransitions, 'Budget transitions');
  if (!q.budget.maxEtats || !q.budget.maxTransitions) throw new Error('Budgets strictement positifs requis');
  if (!Number.isSafeInteger(b.impulsion + q.horizon)) throw new Error('Horizon hors intervalle entier');
  if (!['bloquer', 'supposerPassable'].includes(q.politique.inconnue) || !['bloquer', 'utiliserDerniere'].includes(q.politique.datee)) throw new Error('Politique de croyance explicite requise');
  if (q.chargementInitial && b.impulsion !== 0) throw new Error('Chargement initial seulement a t0');
  if (q.mission.objectif.mesure === 'disponibiliteEquipement') throw new ModeleNonPrisEnCharge('La recherche de transport ne modelise pas les reparations et disponibilites de service');
  for (const [name, items] of Object.entries({ sommets: b.graphe.sommets, aretes: b.graphe.aretes, robots: b.robots, colis: b.colis, equipements: b.equipements, droits: q.droitsDisponibles, annonces: b.annonces })) unique(items.map(i => i.id), name);
  unique(q.mission.ressources.robots, 'robots de mission');
  const vertices = new Set(b.graphe.sommets.map(v => v.id));
  const robotIds = new Set(b.robots.map(r => r.id)); const parcelIds = new Set(b.colis.map(c => c.id));
  const equipmentIds = new Set(b.equipements.map(e => e.id));
  const has = (set: Set<string>, id: string, label: string) => { if (!set.has(id)) throw new Error(`${label} inconnu : ${id}`); };
  const edgeKeys = new Set<string>();
  for (const e of b.graphe.aretes) {
    e.extremites.forEach(v => has(vertices, v, 'Sommet'));
    const key = JSON.stringify([...e.extremites].sort(compare));
    if (e.duree !== 1 || e.bidirectionnelle !== true || e.extremites.length !== 2 || e.extremites[0] === e.extremites[1] || edgeKeys.has(key)) throw new Error('Arete invalide');
    edgeKeys.add(key); integer(e.coutEnergie, 'Cout energie'); e.controlePar.forEach(id => has(equipmentIds, id, 'Equipement'));
    if (e.controlePar.some(id => !['porte', 'passerelle'].includes(b.equipements.find(item => item.id === id)!.nature))) throw new ModeleNonPrisEnCharge('Les passages sont controles par des portes ou passerelles');
  }
  const contrats: ContratMission[] = [q.mission];
  const seen = new Set([q.mission.id]); let parent = q.mission.parent;
  while (parent !== null) {
    if (seen.has(parent)) throw new Error('Cycle de missions'); seen.add(parent);
    const contract = q.ancetres.find(c => c.id === parent);
    if (!contract) refuser('accesAbsent', `Limites de la mission parente ${parent} absentes`);
    contrats.push(contract); parent = contract.parent;
  }
  for (const m of contrats) {
    integer(m.duree.debutInclus, 'Debut mission'); integer(m.duree.finIncluse, 'Fin mission');
    if (m.duree.debutInclus > m.duree.finIncluse) throw new Error('Duree de mission invalide');
    m.zone.forEach(v => has(vertices, v, 'Zone'));
    m.ressources.robots.forEach(id => has(robotIds, id, 'Robot')); m.ressources.colis.forEach(id => has(parcelIds, id, 'Colis'));
    m.objectif.receptionsExigees.forEach(c => { has(parcelIds, c.colis, 'Colis'); integer(c.avantOuA, 'Echeance'); });
  }
  Object.values(q.mission.objectif.priorites).forEach(w => { if (!Number.isFinite(w) || w < 0) throw new Error('Poids fini et non negatif requis'); });
  if (q.mission.ressources.robots.length === 0) refuser('conflitMateriel', 'Aucun robot affecte a la mission');
  for (const d of q.droitsDisponibles) {
    integer(d.validite.debutInclus, 'Debut droit'); integer(d.validite.finIncluse, 'Fin droit');
    if (d.validite.debutInclus > d.validite.finIncluse) throw new Error('Validite de droit invalide');
  }
  const initial: EtatPrevu = { t: b.impulsion, positions: {}, energies: {}, colis: {}, clotures: [...b.cloturesConnues].sort(compare), deplacements: 0, operations: 0, chargementInitial: [], etapes: [], clePlan: '' };
  const model: Modele = { requete: q, contrats, robots: [...q.mission.ressources.robots].sort(compare), initial, hypotheses: [], incertain: false };
  function known<T>(k: Connaissance<T>, label: string): T {
    if (k.etat === 'inconnu') throw new InformationInsuffisante(`${label} inconnu`);
    integer(k.impulsion, 'Date observation');
    if (k.impulsion > b.impulsion || !k.source) throw new Error('Observation invalide');
    if (k.etat === 'datee' || k.impulsion < b.impulsion) {
      if (q.politique.datee === 'bloquer') throw new InformationInsuffisante(`${label} perime`);
      model.incertain = true; model.hypotheses.push(`${label} : derniere observation ${k.source} a t${k.impulsion}`);
    }
    return k.valeur;
  }
  const occupied = new Set<string>();
  for (const r of [...b.robots].sort((a, c) => compare(a.id, c.id))) {
    const position = known(r.position, `Position ${r.id}`); has(vertices, position, 'Position');
    if (occupied.has(position)) refuser('conflitMateriel', `Deux robots sont supposes sur le sommet ${position}`);
    occupied.add(position); initial.positions[r.id] = position;
    if (!model.robots.includes(r.id)) { model.hypotheses.push(`${r.id} reste immobile sur ${position} pendant la recherche`); continue; }
    if (r.capaciteColis !== 2) throw new ModeleNonPrisEnCharge('Le modele de transport utilise une capacite de deux colis');
    const energy = known(r.energie, `Energie ${r.id}`); const activity = known(r.activite, `Activite ${r.id}`);
    if (energy.type === 'limitee') integer(energy.restante, 'Energie');
    initial.energies[r.id] = energy.type === 'limitee' ? energy.restante : null;
    if (activity === 'observationFixe') model.hypotheses.push(`${r.id} quitte son poste d'observation pour executer la mission de transport`);
  }
  for (const c of [...b.colis].sort((a, d) => compare(a.id, d.id))) {
    has(vertices, c.destination, 'Destination'); integer(c.disponibleDepuis, 'Disponibilite colis');
    const location = known(c.localisation, `Localisation ${c.id}`);
    if (location.type === 'porte') has(robotIds, location.robot, 'Porteur'); else has(vertices, location.sommet, 'Localisation');
    if (location.type !== 'auSol' && c.disponibleDepuis > b.impulsion) throw new Error('Colis porte ou recu avant sa disponibilite');
    if (location.type === 'recu') { integer(location.impulsion, 'Reception'); if (location.impulsion > b.impulsion || location.sommet !== c.destination) throw new Error('Reception connue invalide'); }
    initial.colis[c.id] = clone(location);
  }
  for (const r of model.robots) if (cargo(initial, r).length > 2) refuser('conflitMateriel', `Capacite de ${r} depassee dans les croyances`);
  unique(b.cloturesConnues, 'clotures connues'); b.cloturesConnues.forEach(id => has(parcelIds, id, 'Cloture'));
  const writes = new Set<string>();
  for (const a of b.annonces) {
    integer(a.impulsion, 'Date annonce'); if (!a.source) throw new Error('Provenance annonce requise');
    if (a.type === 'equipement') {
      has(equipmentIds, a.equipement, 'Equipement annonce');
      const key = JSON.stringify([a.impulsion, a.equipement]); if (writes.has(key)) throw new Error('Annonces contradictoires'); writes.add(key);
    }
  }
  for (const e of [...b.equipements].sort((a, c) => compare(a.id, c.id))) {
    if (e.nature !== 'porte' && e.nature !== 'passerelle') continue;
    if (e.etat.etat === 'inconnu') {
      model.incertain = true; model.hypotheses.push(`${e.id} inconnu : ${q.politique.inconnue}`);
    } else if (e.etat.etat === 'datee' || e.etat.impulsion < b.impulsion) {
      model.incertain = true; model.hypotheses.push(`${e.id} observe a t${e.etat.impulsion} : ${q.politique.datee}`);
    }
    if (e.etat.etat !== 'inconnu') {
      integer(e.etat.impulsion, 'Date equipement');
      if (e.etat.impulsion > b.impulsion || !e.etat.source) throw new Error('Observation equipement invalide');
      const values = e.nature === 'porte' ? ['ouverte', 'bloquee'] : ['abaissee', 'relevee'];
      if (!values.includes(e.etat.valeur)) throw new Error('Etat connu incompatible avec le passage');
    }
  }
  return model;
}

export function cargo(state: EtatPrevu, robot: string): string[] {
  return Object.keys(state.colis).filter(id => { const p = state.colis[id]; return p?.type === 'porte' && p.robot === robot; }).sort(compare);
}
export function allowed(model: Modele, robot: string, action: ActionAutorisee, target: Cible, t: number, from: string): boolean {
  const q = model.requete; const channel = q.croyances.robots.find(r => r.id === robot)!.canal;
  return model.contrats.every(m => m.duree.debutInclus <= t && t <= m.duree.finIncluse && m.ressources.robots.includes(robot) && m.zone.includes(from) &&
    (target.type !== 'sommet' || m.zone.includes(target.id)) &&
    (target.type !== 'arete' || q.croyances.graphe.aretes.find(e => e.id === target.id)!.extremites.every(v => m.zone.includes(v))) &&
    q.droitsDisponibles.some(d => d.beneficiaire.type === 'mission' && d.beneficiaire.id === m.id && m.acces.includes(d.id) && d.action === action && d.canal === channel &&
      d.validite.debutInclus <= t && t <= d.validite.finIncluse && d.cibles.some(c => c.type === target.type && c.id === target.id) &&
      !q.croyances.annonces.some(a => a.type === 'revoquerDroit' && a.droit === d.id && a.impulsion <= t)));
}
export function parcelAllowed(model: Modele, id: string): boolean { return model.contrats.every(m => m.ressources.colis.includes(id)); }
export function passable(model: Modele, id: string, t: number): boolean {
  const q = model.requete;
  const e = q.croyances.equipements.find(item => item.id === id)!;
  const updates = q.croyances.annonces.filter(a => a.type === 'equipement' && a.equipement === id && a.impulsion > q.croyances.impulsion && a.impulsion <= t).sort((a, b) => a.impulsion - b.impulsion);
  const update = updates.at(-1);
  let value: EtatEquipement;
  if (update?.type === 'equipement') value = update.etat;
  else if (e.etat.etat === 'inconnu') return q.politique.inconnue === 'supposerPassable';
  else if ((e.etat.etat === 'datee' || e.etat.impulsion < q.croyances.impulsion) && q.politique.datee === 'bloquer') return false;
  else value = e.etat.valeur;
  return value === 'ouverte' || value === 'abaissee';
}
export function closeParcel(model: Modele, state: EtatPrevu, id: string, operation: OperationLocale['type']): void {
  if (operation === 'livrer' || (operation === 'deposer' && model.requete.mission.objectif.mesure === 'transfertOuReception')) {
    if (!state.clotures.includes(id)) { state.clotures.push(id); state.clotures.sort(compare); }
  }
}
export function score(model: Modele, state: EtatPrevu): number {
  const q = model.requete;
  return 10 * state.clotures.filter(id => !q.croyances.cloturesConnues.includes(id)).reduce((sum, id) => {
    const parcel = q.croyances.colis.find(c => c.id === id)!;
    return sum + (q.mission.objectif.priorites[id] ?? q.mission.objectif.priorites[parcel.nature] ?? 1);
  }, 0) - state.deplacements;
}
export function feasible(model: Modele, state: EtatPrevu): boolean {
  return model.contrats.every(m => m.objectif.receptionsExigees.every(c => {
    const p = state.colis[c.colis]; return p?.type === 'recu' && p.impulsion <= c.avantOuA;
  }));
}
export function expired(model: Modele, state: EtatPrevu): boolean {
  return model.contrats.some(m => m.objectif.receptionsExigees.some(c => {
    const p = state.colis[c.colis]; return c.avantOuA <= state.t && !(p?.type === 'recu' && p.impulsion <= c.avantOuA);
  }));
}
