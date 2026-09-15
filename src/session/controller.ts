import { planifier, type RequetePlanification, type ResultatPlanification } from '../planner';
import { routeConnue } from '../planner/route';
import type { Simulation } from '../sim';
import type { ContratMission, IntentionTrajet, Ordre, VueJoueur } from '../sim/types';
import { beliefs, knownFact } from './beliefs';
import type { CatalogueSession, Intention, MissionSession, SessionFrame } from './types';

export type MoteurSession = Pick<Simulation, 'getPlayerView' | 'submitOrders' | 'advance' | 'configureMission'>;
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function planningRequest(catalogue: CatalogueSession, view: VueJoueur, intention: Intention, echeance?: number): RequetePlanification {
  const b = beliefs(catalogue, view); const template = catalogue.missions.find(m => m.id === `eva-${intention.robot}`)!;
  if (!template) throw new Error('Robot inconnu');
  const held = b.colis.filter(c => c.localisation.etat !== 'inconnu' && c.localisation.valeur.type === 'porte' && c.localisation.valeur.robot === intention.robot && c.destination === intention.destination);
  const resources = intention.action === 'tournee' ? catalogue.colis.map(c => c.id)
    : held.length ? held.map(c => c.id) : catalogue.colis.filter(c => c.destination === intention.destination && !b.cloturesConnues.includes(c.id)).map(c => c.id);
  const fin = Math.min(catalogue.fin, echeance ?? (intention.cartes.limite === 'expiration' ? view.impulsion + 4 : catalogue.fin));
  const required = intention.action === 'livrer' ? resources.slice(0, held.length || 1) : [];
  if (intention.cartes.limite === 'critique') {
    const id = catalogue.critique.colis; if (!resources.includes(id)) resources.push(id); if (!required.includes(id)) required.push(id);
  }
  const mission: ContratMission = { ...template, objectif: {
    mesure: intention.cartes.mesure, priorites: { medical: intention.cartes.priorite === 'medical' ? 3 : 1 },
    receptionsExigees: required.map(colis => ({ colis, avantOuA: intention.cartes.limite === 'critique' && colis === catalogue.critique.colis ? Math.min(fin, catalogue.critique.avantOuA) : fin })),
  }, duree: { debutInclus: view.impulsion, finIncluse: fin }, ressources: { ...template.ressources, colis: resources },
  zone: intention.cartes.limite === 'quai' ? template.zone.filter(id => !['H', 'C'].includes(id) || b.robots.some(r => r.id === intention.robot && r.position.etat !== 'inconnu' && r.position.valeur === id)) : template.zone };
  return { croyances: b, mission, ancetres: [], droitsDisponibles: catalogue.droits,
    horizon: Math.min(10, fin - view.impulsion), budget: { maxEtats: 6000, maxTransitions: 100_000 }, politique: { inconnue: 'bloquer', datee: 'utiliserDerniere' }, chargementInitial: false };
}
function navigation(view: VueJoueur, catalogue: CatalogueSession, intention: Intention): ResultatPlanification {
  const path = routeConnue(beliefs(catalogue, view), intention.robot, intention.destination);
  if (!path) return { statut: 'refuse', raisons: [{ code: 'conflitMateriel', message: 'Aucun trajet disponible dans les observations reçues.' }], recherche: { exhaustive: false, etatsExplores: 0, transitionsExaminees: 0, arret: 'informationInsuffisante' } };
  const destinations = path.length === 1 ? [path[0]!] : path.slice(1);
  return { statut: 'plan', garantie: 'meilleurTrouve', recherche: { exhaustive: false, etatsExplores: 0, transitionsExaminees: 0, arret: 'terminee' }, plan: {
    chargementInitial: [], J: 0, deplacements: path.length - 1, cloturesPrevues: [], receptionsPrevues: [], hypotheses: ['Navigation directe depuis les observations reçues.'],
    etapes: destinations.map((destination, i) => ({ impulsion: view.impulsion + i + 1, ordres: [{ robot: intention.robot, canal: 'direct', destination,
      ...(intention.action === 'observer' && i === destinations.length - 1 ? { activite: 'observationFixe' as const } : {}) }] })),
  } };
}
export function createSessionController(moteur: MoteurSession, catalogue: CatalogueSession) {
  const active = new Map<string, MissionSession>(); const drafts = new Map<string, MissionSession>();
  const closures = new Set<string>();
  let niveau: 1 | 2 | 3 = catalogue.situation === 'atelier' ? 1 : 3;
  const merged = () => new Map([...active, ...drafts]);
  function checkedMissions() {
    const plans = merged(); const view = moteur.getPlayerView();
    const moves = [...plans.entries()].filter(([, m]) => ['active', 'preparee'].includes(m.statut)).flatMap(([id, m]) => {
      const from = knownFact(view, { type: 'robot', id, champ: 'sommet' })?.valeur;
      const order = m.resultat?.statut === 'plan' ? m.resultat.plan.etapes.find(s => s.impulsion === view.impulsion + 1)?.ordres.find(o => o.robot === id) : undefined;
      return typeof from === 'string' ? [{ id, from, to: order?.destination ?? from }] : [];
    });
    for (const a of moves) for (const b of moves) if (a.id !== b.id && (a.to === b.to || (a.to === b.from && b.to === a.from))) {
      plans.set(a.id, { ...plans.get(a.id)!, statut: 'refusee', motif: `Conflit prévu avec ${b.id} · ${a.to}` });
    }
    return plans;
  }
  function compute(intention: Intention, view = moteur.getPlayerView(), echeance?: number): ResultatPlanification {
    if (view.impulsion >= (echeance ?? catalogue.fin)) return { statut: 'refuse', raisons: [{ code: 'echeanceImpossible', message: 'La mission a atteint son expiration.' }], recherche: { exhaustive: true, etatsExplores: 0, transitionsExaminees: 0, arret: 'terminee' } };
    if (intention.action === 'deplacer' || intention.action === 'observer') {
      const result = navigation(view, catalogue, intention);
      const limit = echeance ?? (intention.cartes.limite === 'expiration' ? view.impulsion + 4 : catalogue.fin);
      if (result.statut === 'plan' && (result.plan.etapes.at(-1)?.impulsion ?? view.impulsion) > limit) return { statut: 'refuse', raisons: [{ code: 'echeanceImpossible', message: 'Le trajet prévu dépasse l’expiration.' }], recherche: { exhaustive: true, etatsExplores: 0, transitionsExaminees: 0, arret: 'terminee' } };
      return result;
    }
    const q = planningRequest(catalogue, view, intention, echeance);
    return planifier({ ...q, croyances: { ...q.croyances, cloturesConnues: [...new Set([...q.croyances.cloturesConnues, ...closures])] } });
  }
  function prepare(intention: Intention, previousDeadline?: number) {
    if (!catalogue.robots.some(r => r.id === intention.robot) || !catalogue.graphe.sommets.some(v => v.id === intention.destination)) throw new Error('Sélection inconnue');
    const echeance = previousDeadline ?? Math.min(catalogue.fin, intention.cartes.limite === 'expiration' ? moteur.getPlayerView().impulsion + 4 : catalogue.fin);
    const result = compute(intention, moteur.getPlayerView(), echeance);
    const colis = result.statut === 'plan' ? result.plan.cloturesPrevues : [];
    drafts.set(intention.robot, { intention: clone(intention), statut: result.statut === 'plan' ? result.plan.etapes.length ? 'preparee' : 'terminee' : 'refusee', resultat: result, colis,
      echeance });
  }
  function frame(): SessionFrame {
    const missions = [...checkedMissions().values()].sort((a, b) => a.intention.robot < b.intention.robot ? -1 : 1);
    const view = moteur.getPlayerView();
    const paths: IntentionTrajet[] = missions.filter(m => ['active', 'preparee'].includes(m.statut)).flatMap(m => {
      const position = knownFact(view, { type: 'robot', id: m.intention.robot, champ: 'sommet' })?.valeur;
      if (typeof position !== 'string' || m.resultat?.statut !== 'plan') return [];
      return [{ id: m.intention.robot, robot: m.intention.robot, chemin: [position, ...m.resultat.plan.etapes.filter(s => s.impulsion > view.impulsion).flatMap(s => s.ordres.filter(o => o.robot === m.intention.robot && o.destination).map(o => o.destination!))] }];
    });
    return clone({ view: moteur.getPlayerView(paths), catalogue, missions, preparation: drafts.size > 0, niveau, fin: view.impulsion >= catalogue.fin });
  }
  function advance() {
    const before = moteur.getPlayerView(); if (before.impulsion >= catalogue.fin) throw new Error('Poste terminé');
    const plans = checkedMissions(); const orders: Ordre[] = [];
    for (const [id, mission] of plans) {
      if (!['preparee', 'active'].includes(mission.statut)) continue;
      const result = mission.resultat?.statut === 'plan' && mission.resultat.plan.etapes.some(s => s.impulsion === before.impulsion + 1)
        ? mission.resultat : compute(mission.intention, before, mission.echeance);
      if (result.statut !== 'plan') { plans.set(id, { ...mission, statut: 'refusee', resultat: result }); continue; }
      if (['livrer', 'tournee'].includes(mission.intention.action)) moteur.configureMission(planningRequest(catalogue, before, mission.intention, mission.echeance).mission);
      orders.push(...(result.plan.etapes.find(s => s.impulsion === before.impulsion + 1)?.ordres ?? []));
      plans.set(id, { ...mission, statut: 'active', resultat: result });
    }
    moteur.submitOrders(orders); moteur.advance(); drafts.clear(); active.clear();
    const after = moteur.getPlayerView(); const b = beliefs(catalogue, after);
    for (const mission of plans.values()) if (mission.statut === 'active') for (const id of mission.colis ?? []) {
      const parcel = b.colis.find(c => c.id === id)?.localisation;
      const deposited = orders.some(o => o.robot === mission.intention.robot && o.operations?.some(op => op.type === 'deposer' && op.colis === id));
      if (parcel && parcel.etat !== 'inconnu' && (parcel.valeur.type === 'recu' || (deposited && parcel.impulsion === after.impulsion && mission.intention.cartes.mesure === 'transfertOuReception' && parcel.valeur.type === 'auSol' && parcel.valeur.sommet === 'T'))) closures.add(id);
    }
    for (const [id, mission] of plans) {
      let next = mission;
      if (mission.statut === 'active') {
        const refused = after.constats.find(c => c.robot === id && c.impulsion === after.impulsion);
        const position = knownFact(after, { type: 'robot', id, champ: 'sommet' })?.valeur;
        const done = ['deplacer', 'observer'].includes(mission.intention.action) ? position === mission.intention.destination :
          (mission.colis?.length ?? 0) > 0 && mission.colis!.every(id => b.colis.some(c => c.id === id && c.localisation.etat !== 'inconnu' &&
            (c.localisation.valeur.type === 'recu' || (mission.intention.cartes.mesure === 'transfertOuReception' && closures.has(c.id)))));
        if (refused) next = { ...mission, statut: 'refusee', motif: `Commande refusée · ${refused.source} · t${refused.impulsion}` };
        else if (done) next = { ...mission, statut: 'terminee' };
        else {
          const result = compute(mission.intention, after, mission.echeance);
          next = { ...mission, resultat: result, statut: result.statut === 'plan' ? 'active' : 'refusee' };
        }
      }
      active.set(id, next);
    }
    const receipts = b.colis.filter(c => c.localisation.etat !== 'inconnu' && c.localisation.valeur.type === 'recu').length;
    if (receipts > 0) niveau = Math.max(niveau, receipts > 1 ? 3 : 2) as 1 | 2 | 3;
  }
  return { frame, prepare, advance,
    cancel() { drafts.clear(); },
    suspend(robot: string) { const mission = merged().get(robot); if (mission) drafts.set(robot, { ...mission, statut: 'suspendue' }); },
    resume(robot: string) { const mission = merged().get(robot); if (mission) prepare(mission.intention, mission.echeance); },
  };
}
