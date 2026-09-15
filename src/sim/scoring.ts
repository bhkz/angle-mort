import type { EtatReel, Scenario } from './types';
import { operational, requireValue, type Mutable } from './util';

export function applyConsequences(s: Scenario, state: Mutable<EtatReel>): void {
  const d = s.dernierPassage;
  if (!d) return;
  const receipt = state.receptions.find(r => r.colis === d.batterie);
  const pump = requireValue(state.equipements[d.pompe], 'Pompe inconnue');
  if (state.impulsion >= d.seuilStock && (!receipt || receipt.impulsion > d.seuilStock)) {
    state.consequences.stock = 'perduPourLePoste';
  }
  if (state.impulsion >= d.seuilPompe && (!receipt || receipt.impulsion > d.seuilPompe)) {
    pump.etat = 'reparationExterieureRequise'; state.consequences.atelier = 'ferme';
  } else if (receipt && receipt.impulsion > d.seuilStock && receipt.impulsion <= d.seuilPompe && state.consequences.atelier !== 'ferme') {
    state.consequences.atelier = 'repriseLimitee';
  }
}

export function resolveNeeds(s: Scenario, state: Mutable<EtatReel>): void {
  for (const need of s.besoins) {
    if (state.resultats[need.id]?.etat !== 'enAttente' || state.impulsion < need.fenetre.finIncluse) continue;
    const condition = need.condition;
    let instant: number | undefined; let proof = `controle:${need.id}`;
    if (condition.type === 'reception') {
      const receipt = state.receptions.find(r => r.colis === condition.colis && r.sommet === condition.destination);
      instant = receipt?.impulsion; proof = `reception:${condition.colis}`;
    } else if (condition.type === 'traversee') {
      const crossing = state.traversees.find(e => e.evenement === condition.evenement && e.service === need.service && e.impulsion === condition.horaire);
      instant = crossing?.impulsion; proof = condition.evenement;
    } else if (state.impulsion === condition.controle && operational(s, state, need.service)) {
      if (condition.type === 'operationnel' || state.equipements[condition.equipement]?.etat === condition.etatRequis) instant = condition.controle;
    }
    const satisfied = instant !== undefined && instant > need.fenetre.debutExclu && instant <= need.fenetre.finIncluse &&
      (!need.operationnelALaCloture || operational(s, state, need.service));
    state.resultats[need.id] = satisfied && instant !== undefined
      ? { etat: 'satisfait', impulsion: instant, preuve: proof } : { etat: 'expire' };
  }
  state.score = s.besoins.reduce((sum, n) => sum + (state.resultats[n.id]?.etat === 'satisfait' ? n.points : 0), 0);
}
