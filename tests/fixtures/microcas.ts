import type { Colis, ContratMission, Droit, Graphe, Robot, Scenario } from '../../src/sim';
import type { Connaissance, CroyancesPlanificateur, RequetePlanification } from '../../src/planner';

export const connu = <T>(valeur: T): Connaissance<T> => ({ etat: 'maintenant', valeur, source: 'observation-initiale', impulsion: 0 });
export interface ConfigurationMicrocas {
  mesure: 'receptionDestination' | 'transfertOuReception';
  w: 1 | 3;
  depotT: boolean;
  medicalExige?: boolean;
}
export function microcas(config: ConfigurationMicrocas): { requete: RequetePlanification; scenario: Scenario } {
  const vertices = ['O', 'T', 'A', 'X', 'Y', 'B'];
  const edges = [['O', 'T'], ['T', 'A'], ['T', 'X'], ['X', 'Y'], ['Y', 'B']] as const;
  const graphe: Graphe = {
    sommets: vertices.map((id, x) => ({ id, position: { x, y: 0, z: 0 }, niveau: 'bas', capaciteRobots: 1, roles: id === 'O' ? ['depot'] : id === 'T' ? ['transfert'] : ['reception'] })),
    aretes: edges.map(([a, b]) => ({ id: a + b, extremites: [a, b], bidirectionnelle: true, duree: 1, controlePar: [], coutEnergie: 1 })),
  };
  const colis: Colis[] = ['C1', 'C2', 'M'].map(id => ({ id, nature: id === 'M' ? 'medical' : 'commercial', destination: id === 'M' ? 'B' : 'A', disponibleDepuis: 0, localisation: { type: 'auSol', sommet: 'O' }, besoin: null }));
  const droits: Droit[] = (['traverser', 'charger', 'livrer', 'deposerTransfert', 'reprendreTransfert'] as const)
    .filter(action => config.depotT || action !== 'deposerTransfert').map(action => ({
      id: action, beneficiaire: { type: 'mission', id: 'mission' }, action, canal: 'eva', validite: { debutInclus: 0, finIncluse: 6 },
      cibles: action === 'traverser' ? edges.map(([a, b]) => ({ type: 'arete', id: a + b })) : vertices.map(id => ({ type: 'sommet', id })),
    }));
  const mission: ContratMission = {
    id: 'mission', parent: null, objectif: { mesure: config.mesure, priorites: { commercial: 1, medical: config.w }, receptionsExigees: config.medicalExige ? [{ colis: 'M', avantOuA: 6 }] : [] },
    zone: vertices, duree: { debutInclus: 0, finIncluse: 6 }, acces: droits.map(d => d.id), ressources: { robots: ['R'], colis: colis.map(c => c.id), equipements: [] },
  };
  const robot: Robot = { id: 'R', sommet: 'O', capaciteColis: 2, activite: 'disponible', energie: { type: 'limitee', restante: 6 }, sourceLocale: 'telemetrie', mission: null, canal: 'eva' };
  const croyances: CroyancesPlanificateur = {
    impulsion: 0, graphe, robots: [{ id: 'R', position: connu('O'), energie: connu(robot.energie), activite: connu(robot.activite), capaciteColis: 2, canal: 'eva' }],
    colis: colis.map(c => ({ id: c.id, nature: c.nature, destination: c.destination, disponibleDepuis: c.disponibleDepuis, localisation: connu(c.localisation) })),
    equipements: [], cloturesConnues: [], annonces: [],
  };
  return {
    requete: { croyances, mission, ancetres: [], droitsDisponibles: droits, horizon: 6, budget: { maxEtats: 100_000, maxTransitions: 2_000_000 }, politique: { inconnue: 'bloquer', datee: 'utiliserDerniere' }, chargementInitial: true },
    scenario: {
      id: 'microcas-objectifs', version: '1', debut: 0, fin: 6, graphe, robots: [robot], colis, droits, missions: [mission],
      equipements: [], services: [], besoins: [], evenements: [], observationsInitiales: [], besoinsImportes: [],
      sources: [{ id: 'telemetrie', support: { type: 'robot', id: 'R' }, equipementsRequis: [], destinataires: ['eva'], origineCommune: null, transmetRefus: true,
        couverture: [{ propriete: { type: 'robot', id: 'R', champ: 'sommet' }, depuis: vertices, posteFixe: false }] }],
    },
  };
}
