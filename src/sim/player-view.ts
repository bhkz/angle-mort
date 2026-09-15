import type { ApercuTrajet, ConstatLocal, FaitObserve, FranchissementObserve, IntentionTrajet, Observation, ProprieteObservee, Scenario, Sommet, VueJoueur } from './types';
import { snapshot } from './util';

export function observationKey(source: string, property: ProprieteObservee): string {
  return JSON.stringify([source, property.type, 'id' in property ? property.id : null, property.champ]);
}
export interface CatalogueJoueur {
  readonly sommets: readonly Sommet[];
  readonly obstacles: VueJoueur['geometrie']['obstacles'];
  readonly aretes: readonly Readonly<{ id: string; extremites: readonly [string, string]; coutEnergie: number; controlePar: readonly string[] }>[];
  readonly sources: readonly Readonly<{ id: string; origineCommune: string | null; proprietes: readonly ProprieteObservee[] }>[];
}
export interface InformationRecue {
  readonly impulsion: number;
  readonly observations: readonly FaitObserve[];
  readonly constats: readonly ConstatLocal[];
  readonly franchissementsObserves: readonly FranchissementObserve[];
}
/** Whitelist of static public information. No equipment states, schedules or source availability. */
export function createPlayerCatalogue(s: Scenario): CatalogueJoueur {
  return snapshot({
    sommets: [...s.graphe.sommets].sort((a, b) => compare(a.id, b.id)),
    obstacles: (s.obstaclesObservation ?? []).filter(o => o.actifSi.length === 0).map(o => ({ id: o.id, min: o.min, max: o.max })).sort((a, b) => compare(a.id, b.id)),
    aretes: s.graphe.aretes.map(e => ({ id: e.id, extremites: e.extremites, coutEnergie: e.coutEnergie, controlePar: [...e.controlePar].sort(compare) })).sort((a, b) => compare(a.id, b.id)),
    sources: s.sources.filter(source => source.destinataires.includes('joueur')).map(source => ({
      id: source.id, origineCommune: source.origineCommune, proprietes: source.couverture.map(c => c.propriete),
    })).sort((a, b) => compare(a.id, b.id)),
  });
}
/** Latest delivered fact per source/property; deterministic even if storage order changes. */
export function latestFacts(facts: readonly FaitObserve[], now: number): Map<string, FaitObserve> {
  const result = new Map<string, FaitObserve>();
  const sorted = [...facts].filter(f => f.reception <= now && f.capture.impulsion <= f.reception).sort((a, b) =>
    a.capture.impulsion - b.capture.impulsion || a.reception - b.reception || compare(JSON.stringify(a), JSON.stringify(b)));
  for (const fact of sorted) result.set(observationKey(fact.source, fact.propriete), fact);
  return result;
}
function compare(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }
function preview(catalogue: CatalogueJoueur, observations: readonly Observation[], intention: IntentionTrajet): ApercuTrajet {
  let energy = 0; let valid = true;
  const segments: ApercuTrajet['segments'][number][] = [];
  for (let i = 1; i < intention.chemin.length; i++) {
    const from = intention.chemin[i - 1]!; const to = intention.chemin[i]!;
    const edge = catalogue.aretes.find(e => e.extremites.includes(from) && e.extremites.includes(to) && from !== to);
    let status: ApercuTrajet['segments'][number]['etat'] = 'inconnu';
    if (!edge) { valid = false; status = 'horsGraphe'; }
    else {
      energy += edge.coutEnergie;
      const reports = edge.controlePar.map(id => observations.filter(o => o.etat !== 'inconnu' && o.fait.propriete.type === 'equipement' && o.fait.propriete.id === id));
      const current = reports.map(items => items.filter(o => o.etat === 'maintenant'));
      const blocked = (f: FaitObserve) => f.valeur === 'bloquee' || f.valeur === 'relevee';
      if (current.some(items => items.some(o => o.etat !== 'inconnu' && blocked(o.fait)) && items.some(o => o.etat !== 'inconnu' && !blocked(o.fait)))) status = 'contradictoire';
      else if (current.some(items => items.some(o => o.etat !== 'inconnu' && blocked(o.fait)))) status = 'bloqueObserve';
      else if (edge.controlePar.length > 0 && current.every(items => items.length > 0)) status = 'ouvertObserve';
      else if (reports.some(items => items.length > 0)) status = 'date';
      // No gate report does not prove absence of an unobserved occupant.
    }
    segments.push({ depuis: from, vers: to, etat: status });
  }
  return { intention, cout: valid ? { impulsions: Math.max(0, intention.chemin.length - 1), energie: energy } : null, segments, nature: 'estimationDepuisObservations' };
}
/** All presentation channels depend exclusively on this received packet and public inputs. */
export function projectPlayerView(catalogue: CatalogueJoueur, information: InformationRecue, intentions: readonly IntentionTrajet[] = []): VueJoueur {
  const facts = latestFacts(information.observations, information.impulsion);
  const slots = new Map<string, { source: string; propriete: ProprieteObservee }>();
  for (const source of catalogue.sources) for (const propriete of source.proprietes) slots.set(observationKey(source.id, propriete), { source: source.id, propriete });
  const observations: Observation[] = [...slots.entries()].sort(([a], [b]) => compare(a, b)).map(([key, slot]) => {
    const fait = facts.get(key);
    return fait ? { etat: fait.capture.impulsion === information.impulsion ? 'maintenant' : 'datee', fait, age: information.impulsion - fait.capture.impulsion }
      : { etat: 'inconnu', ...slot, age: null };
  });
  const sources = new Set(catalogue.sources.map(s => s.id));
  return snapshot({
    impulsion: information.impulsion,
    sources: catalogue.sources.map(s => ({ id: s.id, origineCommune: s.origineCommune })),
    geometrie: { sommets: catalogue.sommets, aretes: catalogue.aretes.map(e => ({ id: e.id, extremites: e.extremites })), obstacles: catalogue.obstacles },
    observations,
    constats: information.constats.filter(c => sources.has(c.source) && c.impulsion <= information.impulsion),
    franchissements: information.franchissementsObserves.filter(c => sources.has(c.source) && c.impulsion <= information.impulsion),
    silhouettes: observations.flatMap(o => o.etat !== 'inconnu' && o.fait.propriete.type === 'robot' && o.fait.propriete.champ === 'sommet' && typeof o.fait.valeur === 'string'
      ? [{ robot: o.fait.propriete.id, source: o.fait.source, sommet: o.fait.valeur, capture: o.fait.capture, age: o.age }] : []),
    sons: observations.flatMap(o => o.etat === 'maintenant' && o.fait.propriete.type === 'son' && o.fait.valeur !== null && typeof o.fait.valeur === 'object' && 'type' in o.fait.valeur && o.fait.valeur.type === 'son'
      ? [{ source: o.fait.source, emission: o.fait.propriete.id, valeur: o.fait.valeur, capture: o.fait.capture }] : []),
    apercusTrajet: [...intentions].sort((a, b) => compare(a.id, b.id)).map(i => preview(catalogue, observations, i)),
  });
}
