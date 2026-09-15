import type { Connaissance, CroyancesPlanificateur } from '../planner/types';
import type { FaitObserve, LocalisationColis, ProprieteObservee, VueJoueur } from '../sim/types';
import type { CatalogueSession } from './types';

export function knownFact(view: VueJoueur, property: ProprieteObservee): FaitObserve | undefined {
  const facts = view.observations.flatMap(o => o.etat !== 'inconnu' && o.fait.propriete.type === property.type && o.fait.propriete.champ === property.champ &&
    (!('id' in property) || ('id' in o.fait.propriete && o.fait.propriete.id === property.id)) ? [o.fait] : []);
  const at = Math.max(-1, ...facts.map(f => f.capture.impulsion)); const latest = facts.filter(f => f.capture.impulsion === at);
  if (new Set(latest.map(f => JSON.stringify(f.valeur))).size !== 1) return undefined;
  return latest.sort((a, b) => a.source < b.source ? -1 : a.source > b.source ? 1 : 0)[0];
}
export function knowledge<T>(view: VueJoueur, fact: FaitObserve | undefined): Connaissance<T> {
  return fact ? { etat: fact.capture.impulsion === view.impulsion ? 'maintenant' : 'datee', valeur: fact.valeur as T, source: fact.source, impulsion: fact.capture.impulsion } : { etat: 'inconnu' };
}
export function beliefs(catalogue: CatalogueSession, view: VueJoueur): CroyancesPlanificateur {
  const colis = catalogue.colis.map(c => ({ ...c, localisation: knowledge<LocalisationColis>(view, knownFact(view, { type: 'colis', id: c.id, champ: 'localisation' })) }));
  return {
    impulsion: view.impulsion, graphe: catalogue.graphe,
    robots: catalogue.robots.map(r => ({ ...r,
      position: knowledge(view, knownFact(view, { type: 'robot', id: r.id, champ: 'sommet' })),
      energie: knowledge(view, knownFact(view, { type: 'robot', id: r.id, champ: 'energie' })),
      activite: knowledge(view, knownFact(view, { type: 'robot', id: r.id, champ: 'activite' })),
    })), colis,
    equipements: catalogue.equipements.map(e => ({ ...e, etat: knowledge(view, knownFact(view, { type: 'equipement', id: e.id, champ: 'etat' })) })),
    cloturesConnues: colis.filter(c => c.localisation.etat !== 'inconnu' && c.localisation.valeur.type === 'recu').map(c => c.id),
    annonces: catalogue.annonces,
  };
}
