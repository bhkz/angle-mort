import type { ActionAutorisee, Besoin, Colis, Droit, Robot, Scenario } from '../../src/sim';

const links = [['O', 'T'], ['T', 'G'], ['G', 'A'], ['A', 'P'], ['P', 'Q'], ['T', 'D'], ['D', 'E'], ['E', 'F'], ['F', 'P'], ['T', 'H'], ['H', 'C']] as const;
const vertices = ['O', 'T', 'G', 'A', 'P', 'Q', 'D', 'E', 'F', 'H', 'C'];

export function dernierPassage(open: boolean, observer: 'H' | 'C' = 'H'): Scenario {
  const robots: Robot[] = [
    { id: 'R', sommet: 'T', capaciteColis: 2, activite: 'transport', energie: { type: 'nonModelisee' }, sourceLocale: 'telemetrieR', mission: null, canal: 'direct' },
    { id: 'R2', sommet: observer, capaciteColis: 2, activite: observer === 'C' ? 'observationFixe' : 'disponible', energie: { type: 'nonModelisee' }, sourceLocale: 'telemetrieR2', mission: null, canal: 'direct' },
  ];
  const actions: ActionAutorisee[] = ['traverser', 'charger', 'reprendreTransfert', 'deposerTransfert', 'livrer', 'observer'];
  const droits: Droit[] = robots.flatMap(robot => actions.map(action => ({
    id: `${robot.id}-${action}`, beneficiaire: { type: 'robot', id: robot.id }, action, canal: 'direct',
    validite: { debutInclus: 0, finIncluse: 16 },
    cibles: action === 'traverser' ? links.map(([a, b]) => ({ type: 'arete' as const, id: a + b })) : vertices.map(id => ({ type: 'sommet' as const, id })),
  })));
  const colis: Colis[] = [
    { id: 'battery', nature: 'batterie', destination: 'P', disponibleDepuis: 0, localisation: { type: 'porte', robot: 'R' }, besoin: 'P2' },
    { id: 'q1', nature: 'fourniture', destination: 'Q', disponibleDepuis: 0, localisation: { type: 'recu', sommet: 'Q', impulsion: 3 }, besoin: 'Q1' },
    { id: 'q2', nature: 'fourniture', destination: 'Q', disponibleDepuis: 0, localisation: { type: 'porte', robot: 'R' }, besoin: 'Q2' },
    { id: 'q3', nature: 'fourniture', destination: 'Q', disponibleDepuis: 9, localisation: { type: 'auSol', sommet: 'P' }, besoin: 'Q3' },
    { id: 'q4', nature: 'fourniture', destination: 'Q', disponibleDepuis: 13, localisation: { type: 'auSol', sommet: 'P' }, besoin: 'Q4' },
  ];
  const besoins: Besoin[] = ([1, 2, 3, 4] as const).flatMap(phase => {
    const common = { phase, fenetre: { debutExclu: (phase - 1) * 4, finIncluse: phase * 4 }, points: 100 as const, revelation: 0, operationnelALaCloture: phase === 4 };
    return [
      { ...common, id: `P${phase}`, service: 'pompage', condition: phase === 1 ? { type: 'chargeInitiale', controle: 4, equipement: 'pompe', etatRequis: 'operationnelle' }
        : phase === 2 ? { type: 'reception', colis: 'battery', destination: 'P' } : { type: 'operationnel', controle: phase * 4 } },
      { ...common, id: `F${phase}`, service: 'ferry', condition: { type: 'traversee', evenement: `ferry${phase}`, horaire: phase * 4 - 2 } },
      { ...common, id: `Q${phase}`, service: 'fournitures', condition: { type: 'reception', colis: `q${phase}`, destination: 'Q' } },
    ];
  });
  return {
    id: 'dernier-passage-checkpoint', version: '1', debut: 4, fin: 16,
    graphe: {
      sommets: vertices.map((id, x) => ({ id, position: { x, y: id === 'C' || id === 'H' ? 1 : 0, z: 0 }, niveau: id === 'C' || id === 'H' ? 'haut' : 'bas', capaciteRobots: 1,
        roles: id === 'O' ? ['depot'] : id === 'T' ? ['transfert'] : id === 'P' ? ['reception', 'casier'] : id === 'Q' ? ['reception'] : id === 'C' ? ['observation'] : ['passage'] })),
      aretes: links.map(([a, b]) => ({ id: a + b, extremites: [a, b], duree: 1, bidirectionnelle: true, coutEnergie: 1,
        controlePar: a + b === 'GA' ? ['porte'] : a + b === 'AP' ? ['passerelle'] : [] })),
    },
    robots, colis, droits, besoins, missions: [],
    equipements: [
      { id: 'porte', nature: 'porte', cible: { type: 'arete', id: 'GA' }, etat: open ? 'ouverte' : 'bloquee' },
      { id: 'passerelle', nature: 'passerelle', cible: { type: 'arete', id: 'AP' }, etat: 'abaissee' },
      { id: 'pompe', nature: 'pompe', cible: { type: 'sommet', id: 'P' }, etat: 'operationnelle' },
      { id: 'camera', nature: 'camera', cible: { type: 'sommet', id: 'H' }, etat: 'maintenance' },
      { id: 'alimentationF', nature: 'alimentation', cible: { type: 'sommet', id: 'A' }, etat: 'disponible' },
      { id: 'alimentationQ', nature: 'alimentation', cible: { type: 'sommet', id: 'Q' }, etat: 'disponible' },
    ],
    services: [
      { id: 'pompage', nature: 'pompage', dependances: [{ equipement: 'pompe', etat: 'operationnelle' }] },
      { id: 'ferry', nature: 'traversee', dependances: [{ equipement: 'alimentationF', etat: 'disponible' }] },
      { id: 'fournitures', nature: 'fournitures', dependances: [{ equipement: 'alimentationQ', etat: 'disponible' }] },
    ],
    sources: [
      ...robots.map(robot => ({
        id: robot.sourceLocale, support: { type: 'robot' as const, id: robot.id }, equipementsRequis: [], destinataires: ['joueur' as const], origineCommune: null, transmetRefus: true,
        couverture: [
          { propriete: { type: 'robot' as const, id: robot.id, champ: 'sommet' as const }, depuis: vertices, posteFixe: false },
          { propriete: { type: 'robot' as const, id: robot.id, champ: 'chargement' as const }, depuis: vertices, posteFixe: false },
          ...(robot.id === 'R2' ? [{ propriete: { type: 'equipement' as const, id: 'porte', champ: 'etat' as const }, depuis: ['C'], posteFixe: true }] : []),
        ],
      })),
      { id: 'cameraFixe', support: { type: 'fixe', sommet: 'H' }, equipementsRequis: [{ equipement: 'camera', etat: 'disponible' }],
        destinataires: ['joueur'], origineCommune: null, transmetRefus: false,
        couverture: [{ propriete: { type: 'equipement', id: 'porte', champ: 'etat' }, depuis: ['H'], posteFixe: false }] },
    ],
    evenements: [
      { id: 'charge-initiale-epuisee', impulsion: 5, type: 'equipement', equipement: 'pompe', etat: 'arretee' },
      { id: 'camera-retour', impulsion: 7, type: 'equipement', equipement: 'camera', etat: 'disponible' },
      ...[5, 9, 13].flatMap(t => [
        { id: `lever${t}`, impulsion: t, type: 'equipement' as const, equipement: 'passerelle', etat: 'relevee' as const },
        { id: `baisser${t + 2}`, impulsion: t + 2, type: 'equipement' as const, equipement: 'passerelle', etat: 'abaissee' as const },
      ]),
      ...[1, 2, 3, 4].map(phase => ({ id: `ferry${phase}`, impulsion: phase * 4 - 2, type: 'traversee' as const, service: 'ferry', conditions: [{ equipement: 'passerelle', etat: 'relevee' as const }] })),
    ],
    observationsInitiales: [{ source: 'cameraFixe', propriete: { type: 'equipement', id: 'porte', champ: 'etat' }, valeur: 'ouverte', capture: { impulsion: 2, etape: 'observations' }, reception: 2 }],
    besoinsImportes: ['P1', 'F1', 'Q1'].map(besoin => ({ besoin, impulsion: besoin === 'P1' ? 4 : besoin === 'F1' ? 2 : 3, preuve: 'prefixe-suppose-non-demontre' })),
    dernierPassage: { batterie: 'battery', pompe: 'pompe', seuilStock: 8, seuilPompe: 10 },
  };
}
