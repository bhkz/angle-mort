import { describe, expect, test } from 'vitest';
import { createSimulation } from '../src/sim';
import type { Colis, ContratMission, FaitObserve, Ordre, Scenario } from '../src/sim';
import { createRng } from '../src/sim/rng';
import { dernierPassage } from './fixtures/dernierPassage';

function small(positions: readonly string[] = ['A']): Scenario {
  const vertices = ['A', 'B', 'C', 'D'];
  const ids = positions.map((_, i) => `R${i}`);
  return {
    id: 'unit', version: '1', debut: 0, fin: 16, besoins: [], besoinsImportes: [], observationsInitiales: [], services: [], equipements: [], evenements: [],
    graphe: {
      sommets: vertices.map((id, x) => ({ id, position: { x, y: 0, z: 0 }, niveau: 'bas', capaciteRobots: 1, roles: id === 'B' ? ['transfert'] : ['depot'] })),
      aretes: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['C', 'D']].map(([a, b]) => ({ id: a! + b!, extremites: [a!, b!], duree: 1, bidirectionnelle: true, coutEnergie: 1, controlePar: [] })),
    },
    robots: positions.map((sommet, i) => ({ id: ids[i]!, sommet, capaciteColis: 2, activite: 'disponible', energie: { type: 'limitee', restante: 6 }, sourceLocale: `s${i}`, mission: null, canal: 'direct' })),
    colis: [], missions: [],
    droits: ids.flatMap(id => ['traverser', 'charger', 'reprendreTransfert', 'deposerTransfert', 'livrer', 'observer'].map(action => ({
      id: `${id}-${action}`, beneficiaire: { type: 'robot', id }, action: action as Scenario['droits'][number]['action'], canal: 'direct', validite: { debutInclus: 0, finIncluse: 16 },
      cibles: action === 'traverser' ? ['AB', 'BC', 'CA', 'CD'].map(edge => ({ type: 'arete' as const, id: edge })) : vertices.map(vertex => ({ type: 'sommet' as const, id: vertex })),
    }))),
    sources: ids.map((id, i) => ({ id: `s${i}`, support: { type: 'robot', id }, equipementsRequis: [], destinataires: ['joueur'], origineCommune: null, transmetRefus: true,
      couverture: [{ propriete: { type: 'robot', id, champ: 'sommet' }, depuis: vertices, posteFixe: false }] })),
  };
}

const order = (robot: string, destination?: string): Ordre => ({ robot, canal: 'direct', ...(destination ? { destination } : {}) });
const parcel = (id: string, localisation: Colis['localisation'], destination = 'C'): Colis => ({ id, localisation, destination, nature: 'commercial', disponibleDepuis: 0, besoin: null });
function fact(sim: ReturnType<typeof createSimulation>, source: string): FaitObserve | undefined {
  const observation = sim.getPlayerView().observations.find(o => o.etat !== 'inconnu' && o.fait.source === source && o.fait.propriete.type === 'equipement');
  return observation && observation.etat !== 'inconnu' ? observation.fait : undefined;
}

describe('mouvements simultanes', () => {
  test.each([
    { name: 'sommet libere dans la meme impulsion', positions: ['A', 'B'], destinations: ['B', 'C'], expected: ['B', 'C'], refusals: 0 },
    { name: 'echange interdit', positions: ['A', 'B'], destinations: ['B', 'A'], expected: ['A', 'B'], refusals: 2 },
    { name: 'deux entrees vers un sommet : refus des deux', positions: ['A', 'C'], destinations: ['B', 'B'], expected: ['A', 'C'], refusals: 2 },
    { name: 'refus propage dans une chaine', positions: ['A', 'B', 'C'], destinations: ['B', 'C', 'C'], expected: ['A', 'B', 'C'], refusals: 2 },
    { name: 'rotation a trois sommets', positions: ['A', 'B', 'C'], destinations: ['B', 'C', 'A'], expected: ['B', 'C', 'A'], refusals: 0 },
    { name: 'pas de saut de deux aretes', positions: ['A'], destinations: ['D'], expected: ['A'], refusals: 1 },
  ])('$name', ({ positions, destinations, expected, refusals }) => {
    const sim = createSimulation(small(positions), 0);
    sim.submitOrders(destinations.map((v, i) => order(`R${i}`, v))); sim.advance();
    expect(Object.values(sim.getAuthorState().robots).map(r => r.sommet)).toEqual(expected);
    expect(sim.getAuthorState().refus).toHaveLength(refusals);
    expect(sim.getAuthorState().impulsion).toBe(1);
  });

  test('blocage programme applique avant les mouvements et propage', () => {
    const base = small(['A', 'B']);
    const sim = createSimulation({ ...base,
      equipements: [{ id: 'porte', nature: 'porte', cible: { type: 'arete', id: 'BC' }, etat: 'ouverte' }],
      graphe: { ...base.graphe, aretes: base.graphe.aretes.map(e => e.id === 'BC' ? { ...e, controlePar: ['porte'] } : e) },
      evenements: [{ id: 'fermeture', impulsion: 1, type: 'equipement', equipement: 'porte', etat: 'bloquee' }],
    }, 0);
    sim.submitOrders([order('R0', 'B'), order('R1', 'C')]); sim.advance();
    expect(Object.values(sim.getAuthorState().robots).map(r => r.sommet)).toEqual(['A', 'B']);
    expect(sim.getAuthorState().refus.map(r => r.motif).sort()).toEqual(['occupation', 'passage']);
  });

  test('attente/refus gratuits en energie ; deplacement reussi coute une unite', () => {
    const sim = createSimulation(small(), 1);
    sim.advance(); sim.submitOrders([order('R0', 'D')]); sim.advance();
    expect(sim.getAuthorState().robots.R0?.energie).toEqual({ type: 'limitee', restante: 6 });
    sim.submitOrders([order('R0', 'B')]); sim.advance();
    expect(sim.getAuthorState().robots.R0?.energie).toEqual({ type: 'limitee', restante: 5 });
  });
});

describe('manutention et droits', () => {
  function withMission(base: Scenario, parent: string | null = null): Scenario {
    const missionRights = base.droits.map(d => ({ ...d, id: `mission-${d.id}`, beneficiaire: { type: 'mission' as const, id: 'mission' } }));
    const mission: ContratMission = {
      id: 'mission', parent, objectif: { mesure: 'transfertOuReception', priorites: {}, receptionsExigees: [] },
      zone: ['A', 'B', 'C', 'D'], duree: { debutInclus: 0, finIncluse: 16 }, acces: missionRights.map(d => d.id),
      ressources: { robots: ['R0'], colis: base.colis.map(c => c.id), equipements: [] },
    };
    return { ...base, droits: [...base.droits, ...missionRights], missions: [mission] };
  }

  test('depot, reprise et livraison ne doublent pas la cloture de mission', () => {
    const sim = createSimulation(withMission({ ...small(), colis: [parcel('p', { type: 'porte', robot: 'R0' })] }), 0);
    for (const [destination, type] of [['B','deposer'], ['B','charger'], ['C','livrer']] as const) {
      sim.submitOrders([{ ...order('R0', destination), mission: 'mission', operations: [{ type, colis: 'p' }] }]); sim.advance();
    }
    expect(sim.getAuthorState().refus).toEqual([]);
    expect(sim.getAuthorState().clotures).toEqual([{ mission: 'mission', colis: 'p', impulsion: 1 }]);
    expect(sim.getAuthorState().receptions).toEqual([{ colis: 'p', sommet: 'C', impulsion: 3 }]);
  });

  test('une sous-mission ne peut etendre la zone du parent', () => {
    const base = withMission(small(), 'parent'); const child = base.missions[0]!;
    const parentRights = base.droits.filter(d => d.beneficiaire.type === 'mission').map(d => ({ ...d, id: `parent-${d.id}`, beneficiaire: { type: 'mission' as const, id: 'parent' } }));
    const sim = createSimulation({ ...base, droits: [...base.droits, ...parentRights], missions: [child, { ...child, id: 'parent', parent: null, zone: ['A'], acces: parentRights.map(d => d.id) }] }, 0);
    sim.submitOrders([{ ...order('R0', 'B'), mission: 'mission' }]); sim.advance();
    expect(sim.getAuthorState().robots.R0?.sommet).toBe('A');
    expect(sim.getAuthorState().refus[0]?.motif).toBe('droit');
  });

  test('duree de mission inclusive, recontrolee a chaque impulsion', () => {
    const base = withMission(small());
    const sim = createSimulation({ ...base, missions: base.missions.map(m => ({ ...m, duree: { debutInclus: 1, finIncluse: 1 } })) }, 0);
    sim.submitOrders([{ ...order('R0', 'B'), mission: 'mission' }]); sim.advance();
    expect(sim.getAuthorState().robots.R0?.sommet).toBe('B');
    sim.submitOrders([{ ...order('R0', 'C'), mission: 'mission' }]); sim.advance();
    expect(sim.getAuthorState().robots.R0?.sommet).toBe('B');
    expect(sim.getAuthorState().refus[0]?.motif).toBe('droit');
  });

  test('capacite deux et refus du troisieme sans perte de colis', () => {
    const sim = createSimulation({ ...small(), colis: ['p1','p2','p3'].map(id => parcel(id, { type: 'auSol', sommet: 'A' })) }, 2);
    sim.submitOrders([{ ...order('R0'), operations: ['p1','p2','p3'].map(colis => ({ type: 'charger', colis })) }]); sim.advance();
    expect(sim.getAuthorState().colis.p1?.localisation).toEqual({ type: 'porte', robot: 'R0' });
    expect(sim.getAuthorState().colis.p2?.localisation).toEqual({ type: 'porte', robot: 'R0' });
    expect(sim.getAuthorState().colis.p3?.localisation).toEqual({ type: 'auSol', sommet: 'A' });
    expect(sim.getAuthorState().refus).toHaveLength(1);
  });

  test('decharger avant de charger a l arrivee, sans impulsion supplementaire', () => {
    const sim = createSimulation({ ...small(), colis: [parcel('p1', { type: 'porte', robot: 'R0' }, 'B'), parcel('p2', { type: 'porte', robot: 'R0' }), parcel('p3', { type: 'auSol', sommet: 'B' })] }, 2);
    sim.submitOrders([{ ...order('R0', 'B'), operations: [{ type: 'charger', colis: 'p3' }, { type: 'livrer', colis: 'p1' }] }]); sim.advance();
    expect(sim.getAuthorState().receptions).toEqual([{ colis: 'p1', sommet: 'B', impulsion: 1 }]);
    expect(sim.getAuthorState().colis.p3?.localisation).toEqual({ type: 'porte', robot: 'R0' });
    expect(sim.getAuthorState().refus).toEqual([]);
    sim.submitOrders([{ ...order('R0'), operations: [{ type: 'livrer', colis: 'p1' }] }]); sim.advance();
    expect(sim.getAuthorState().receptions).toHaveLength(1);
  });

  test('casier accessible au seuil, y compris apres une attente', () => {
    const sim = createSimulation({ ...small(), colis: [{ ...parcel('p', { type: 'auSol', sommet: 'A' }), disponibleDepuis: 2 }] }, 2);
    const pickup: Ordre = { ...order('R0'), operations: [{ type: 'charger', colis: 'p' }] };
    sim.submitOrders([pickup]); sim.advance();
    expect(sim.getAuthorState().colis.p?.localisation.type).toBe('auSol');
    sim.submitOrders([pickup]); sim.advance();
    expect(sim.getAuthorState().colis.p?.localisation.type).toBe('porte');
  });

  test('retrait du droit de depot laisse le transit possible', () => {
    const base = small();
    const sim = createSimulation({ ...base, droits: base.droits.filter(d => d.action !== 'deposerTransfert'), colis: [parcel('p', { type: 'porte', robot: 'R0' })] }, 1);
    sim.submitOrders([{ ...order('R0', 'B'), operations: [{ type: 'deposer', colis: 'p' }] }]); sim.advance();
    expect(sim.getAuthorState().robots.R0?.sommet).toBe('B');
    expect(sim.getAuthorState().colis.p?.localisation.type).toBe('porte');
    expect(sim.getAuthorState().refus[0]?.motif).toBe('droit');
  });

  test('droit revoque apres soumission verifie lors de l execution', () => {
    const base = small();
    const sim = createSimulation({ ...base, evenements: [{ id: 'retrait', type: 'revoquerDroit', droit: 'R0-traverser', impulsion: 1 }] }, 1);
    sim.submitOrders([order('R0', 'B')]); expect(sim.getAuthorState().impulsion).toBe(0); sim.advance();
    expect(sim.getAuthorState().robots.R0?.sommet).toBe('A');
    expect(sim.getAuthorState().refus[0]?.motif).toBe('droit');
    expect(sim.getPlayerView().constats[0]).not.toHaveProperty('motif');
  });

  test('observer en poste fixe ne permet pas de charger simultanement', () => {
    const sim = createSimulation({ ...small(), colis: [parcel('p', { type: 'auSol', sommet: 'A' })] }, 0);
    sim.submitOrders([{ ...order('R0'), activite: 'observationFixe', operations: [{ type: 'charger', colis: 'p' }] }]); sim.advance();
    expect(sim.getAuthorState().colis.p?.localisation.type).toBe('auSol');
  });
});

describe('observations et non-fuite', () => {
  test('deux variantes ont exactement la meme vue sans observateur, jusqu au refus local', () => {
    const open = createSimulation(dernierPassage(true), 7);
    const closed = createSimulation(dernierPassage(false), 7);
    expect(open.getAuthorState()).not.toEqual(closed.getAuthorState());
    expect(open.getPlayerView()).toEqual(closed.getPlayerView());
    expect(fact(closed, 'cameraFixe')?.capture.impulsion).toBe(2);
    for (const sim of [open, closed]) { sim.submitOrders([order('R', 'G')]); sim.advance(); }
    expect(open.getPlayerView()).toEqual(closed.getPlayerView());
    for (const sim of [open, closed]) { sim.submitOrders([order('R', 'A')]); sim.advance(); }
    expect(closed.getPlayerView().constats[0]?.impulsion).toBe(6);
    expect(open.getPlayerView()).not.toEqual(closed.getPlayerView());
    expect(closed.getPlayerView()).not.toHaveProperty('score');
    expect(closed.getPlayerView()).not.toHaveProperty('graine');
    expect(closed.getPlayerView()).not.toHaveProperty('equipements');
  });

  test('observation en C a t4 ou apres arrivee a t5 ; camera seulement a t7', () => {
    const early = createSimulation(dernierPassage(false, 'C'), 1);
    expect(fact(early, 'telemetrieR2')).toMatchObject({ valeur: 'bloquee', capture: { impulsion: 4 } });
    const late = createSimulation(dernierPassage(false), 1);
    expect(fact(late, 'telemetrieR2')).toBeUndefined();
    late.submitOrders([{ ...order('R2', 'C'), activite: 'observationFixe' }]); late.advance();
    expect(fact(late, 'telemetrieR2')).toMatchObject({ valeur: 'bloquee', capture: { impulsion: 5 } });
    late.advance(); expect(fact(late, 'cameraFixe')?.capture.impulsion).toBe(2);
    late.advance(); expect(fact(late, 'cameraFixe')?.capture.impulsion).toBe(7);
  });

  test('depart de C conserve la derniere observation sans actualiser la porte cachee', () => {
    const base = dernierPassage(false, 'C');
    const sim = createSimulation({ ...base, evenements: [...base.evenements, { id: 'porte-change', impulsion: 5, type: 'equipement', equipement: 'porte', etat: 'ouverte' }] }, 1);
    sim.submitOrders([order('R2', 'H')]); sim.advance();
    expect(sim.getAuthorState().equipements.porte?.etat).toBe('ouverte');
    expect(fact(sim, 'telemetrieR2')).toMatchObject({ valeur: 'bloquee', capture: { impulsion: 4 } });
    expect(sim.getPlayerView().observations.find(o => o.etat === 'datee' && o.fait.source === 'telemetrieR2')).toBeDefined();
  });

  test('observations avant echeances : aucune actualisation apres la perte a t8', () => {
    const base = dernierPassage(true);
    const sim = createSimulation({ ...base, sources: [...base.sources, { id: 'stock-camera', support: { type: 'fixe', sommet: 'P' }, equipementsRequis: [], destinataires: ['joueur'], origineCommune: null, transmetRefus: false,
      couverture: [{ propriete: { type: 'consequences', champ: 'stock' }, depuis: ['P'], posteFixe: false }] }] }, 1);
    for (let t = 5; t <= 8; t++) sim.advance();
    expect(sim.getAuthorState().consequences.stock).toBe('perduPourLePoste');
    const observation = sim.getPlayerView().observations.find(o => o.etat !== 'inconnu' && o.fait.source === 'stock-camera');
    expect(observation).toMatchObject({ etat: 'maintenant', fait: { valeur: 'utilisable', capture: { impulsion: 8, etape: 'observations' } } });
    sim.advance();
    expect(sim.getPlayerView().observations.find(o => o.etat !== 'inconnu' && o.fait.source === 'stock-camera')).toMatchObject({ fait: { valeur: 'perduPourLePoste' } });
  });
});

describe('API et validation', () => {
  test('RNG explicite : repetition, graines distinctes et intervalle [0,1[', () => {
    const a = createRng(42); const b = createRng(42); const c = createRng(43);
    const values = Array.from({ length: 64 }, () => a.next());
    expect(values).toEqual(Array.from({ length: 64 }, () => b.next()));
    expect(values).not.toEqual(Array.from({ length: 64 }, () => c.next()));
    expect(values.every(v => v >= 0 && v < 1)).toBe(true);
    expect(a.state()).toBe(b.state());
  });

  test('tirage de variante au lancement reproductible, cache a la vue joueur', () => {
    const scenario = { ...dernierPassage(false), variantes: [{ id: 'porte', equipement: 'porte', etats: ['ouverte', 'bloquee'] as const }] };
    const a = createSimulation(scenario, 42); const b = createSimulation(scenario, 42);
    expect(a.getAuthorState()).toEqual(b.getAuthorState());
    expect(a.getPlayerView()).toEqual(createSimulation(dernierPassage(false), 123).getPlayerView());
  });

  test('instantanes isoles et geles en profondeur, description et ordres copies', () => {
    const scenario = small(); const sim = createSimulation(scenario, 2);
    const before = sim.getAuthorState();
    expect(Object.isFrozen(before.robots.R0)).toBe(true);
    expect(Object.isFrozen(sim.getPlayerView().geometrie.sommets)).toBe(true);
    const command = { robot: 'R0', canal: 'direct', destination: 'B' };
    sim.submitOrders([command]); command.destination = 'D';
    // Deliberate external mutation to check that the constructor owns its data.
    (scenario.robots[0] as { sommet: string }).sommet = 'D';
    sim.advance();
    expect(sim.getAuthorState().robots.R0?.sommet).toBe('B'); expect(before.robots.R0?.sommet).toBe('A');
  });

  test('ordre de stockage des robots et ordre de soumission sans effet', () => {
    const s = small(['A', 'B']);
    const a = createSimulation(s, 0); const b = createSimulation({ ...s, robots: [...s.robots].reverse(), droits: [...s.droits].reverse(), sources: [...s.sources].reverse() }, 0);
    a.submitOrders([order('R0', 'B'), order('R1', 'C')]); b.submitOrders([order('R1', 'C'), order('R0', 'B')]); a.advance(); b.advance();
    expect(a.getAuthorState()).toEqual(b.getAuthorState()); expect(a.getPlayerView()).toEqual(b.getPlayerView());
  });

  test('lot invalide sans modification partielle des ordres en attente', () => {
    const sim = createSimulation(small(), 0); sim.submitOrders([order('R0', 'B')]);
    const before = sim.getAuthorState();
    expect(() => sim.submitOrders([order('R0', 'C'), order('absent', 'B')])).toThrow();
    expect(sim.getAuthorState()).toEqual(before);
  });

  test('refuse graines, temps, occupations et references invalides', () => {
    expect(() => createSimulation(small(), NaN)).toThrow();
    expect(() => createSimulation(small(), -1)).toThrow();
    expect(() => createSimulation({ ...small(), debut: 0.5 }, 0)).toThrow();
    expect(() => createSimulation(small(['A','A']), 0)).toThrow();
    expect(() => createSimulation({ ...small(), colis: [parcel('p', { type: 'porte', robot: 'absent' })] }, 0)).toThrow();
  });

  test('aucune fin anticipee apres perte de pompe ; arret exact a t16', () => {
    const sim = createSimulation(dernierPassage(false), 0);
    for (let t = 5; t <= 16; t++) sim.advance();
    expect(sim.getAuthorState().impulsion).toBe(16);
    expect(sim.getAuthorState().consequences.atelier).toBe('ferme');
    const final = sim.getAuthorState();
    expect(() => sim.advance()).toThrow('Tentative terminee');
    expect(() => sim.submitOrders([order('R', 'D')])).toThrow('Tentative terminee');
    expect(sim.getAuthorState()).toEqual(final);
  });
});
