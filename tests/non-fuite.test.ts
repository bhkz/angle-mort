import { describe, expect, test } from 'vitest';
import fc from 'fast-check';
import { createPlayerCatalogue, createSimulation, projectPlayerView, type FaitObserve, type InformationRecue, type IntentionTrajet, type Scenario, type VueJoueur } from '../src/sim';
import { dernierPassage } from './fixtures/dernierPassage';

const intentions: readonly IntentionTrajet[] = [
  { id: 'court', robot: 'R', chemin: ['T', 'G', 'A', 'P', 'Q'] },
  { id: 'detour', robot: 'R', chemin: ['T', 'D', 'E', 'F', 'P', 'Q'] },
];
const serialize = (v: VueJoueur) => JSON.stringify(v);
function door(view: VueJoueur, source: string) {
  return view.observations.find(o => o.etat !== 'inconnu' && o.fait.source === source && o.fait.propriete.type === 'equipement' && o.fait.propriete.id === 'porte');
}

describe('invariant central — Dernier passage', () => {
  test('à t4 sans C, les sérialisations complètes sont strictement identiques', () => {
    const a = createSimulation(dernierPassage(true), 42);
    const b = createSimulation(dernierPassage(false), 42);
    expect(a.getAuthorState().equipements.porte).not.toEqual(b.getAuthorState().equipements.porte);
    expect(serialize(a.getPlayerView(intentions))).toBe(serialize(b.getPlayerView(intentions)));
    expect(door(b.getPlayerView(), 'cameraFixe')).toMatchObject({ etat: 'datee', age: 2, fait: { valeur: 'ouverte' } });
    expect(b.getPlayerView(intentions).apercusTrajet[0]?.cout).toEqual({ impulsions: 4, energie: 4 });
  });

  test.each(['C', 'H'] as const)('observateur initial en %s : divergence au premier rapport de C', observer => {
    const sims = [true, false].map(open => createSimulation(dernierPassage(open, observer), 7));
    if (observer === 'H') {
      expect(serialize(sims[0]!.getPlayerView(intentions))).toBe(serialize(sims[1]!.getPlayerView(intentions)));
      for (const sim of sims) {
        sim.submitOrders([{ robot: 'R2', canal: 'direct', destination: 'C', activite: 'observationFixe' }]); sim.advance();
      }
    }
    expect(serialize(sims[0]!.getPlayerView(intentions))).not.toBe(serialize(sims[1]!.getPlayerView(intentions)));
    expect(door(sims[1]!.getPlayerView(), 'telemetrieR2')).toMatchObject({ etat: 'maintenant', age: 0, fait: { valeur: 'bloquee', capture: { impulsion: observer === 'C' ? 4 : 5 } } });
  });

  test('sans C et sans tentative : aucune divergence avant le retour de caméra à t7', () => {
    const sims = [true, false].map(open => createSimulation(dernierPassage(open), 7));
    for (let t = 4; t <= 7; t++) {
      if (t > 4) sims.forEach(sim => sim.advance());
      const [a, b] = sims.map(sim => serialize(sim.getPlayerView(intentions)));
      if (t < 7) expect(a).toBe(b); else expect(a).not.toBe(b);
    }
    expect(door(sims[1]!.getPlayerView(), 'cameraFixe')).toMatchObject({ etat: 'maintenant', age: 0, fait: { capture: { impulsion: 7 } } });
  });

  test('G reste derrière le hangar à t5 ; le refus local ne distingue les variantes qu’à t6', () => {
    const sims = [true, false].map(open => createSimulation(dernierPassage(open), 7));
    for (const sim of sims) { sim.submitOrders([{ robot: 'R', canal: 'direct', destination: 'G' }]); sim.advance(); }
    expect(serialize(sims[0]!.getPlayerView(intentions))).toBe(serialize(sims[1]!.getPlayerView(intentions)));
    for (const sim of sims) { sim.submitOrders([{ robot: 'R', canal: 'direct', destination: 'A' }]); sim.advance(); }
    expect(serialize(sims[0]!.getPlayerView(intentions))).not.toBe(serialize(sims[1]!.getPlayerView(intentions)));
    expect(sims[1]!.getPlayerView().constats).toEqual([{ impulsion: 6, robot: 'R', source: 'telemetrieR', action: 'deplacement', resultat: 'refuse' }]);
    expect(door(sims[1]!.getPlayerView(), 'telemetrieR')).toBeUndefined();
  });

  test('retirer le hangar rend A observable depuis G : aucun masque logique ne conserve artificiellement le témoin', () => {
    const base = dernierPassage(false);
    const sim = createSimulation({ ...base, obstaclesObservation: [] }, 7);
    sim.submitOrders([{ robot: 'R', canal: 'direct', destination: 'G' }]); sim.advance();
    expect(door(sim.getPlayerView(), 'telemetrieR')).toMatchObject({ etat: 'maintenant', fait: { valeur: 'bloquee', capture: { impulsion: 5 } } });
  });
});

const hiddenNode = fc.constantFrom('O', 'D', 'E', 'F', 'P', 'Q', 'C');
const hiddenWorld = fc.record({
  open: fc.boolean(), node: hiddenNode, energy: fc.integer({ min: 0, max: 100 }),
  pump: fc.boolean(), cargo: fc.boolean(), parcelNode: hiddenNode, imported: fc.boolean(),
  sound: fc.constantFrom('moteur', 'alarme', 'grincement'), seed: fc.integer({ min: 0, max: 0xffffffff }),
});
type Hidden = typeof hiddenWorld extends fc.Arbitrary<infer T> ? T : never;
function propertyScenario(hidden: Hidden, lastNode: string, reportedEnergy: number): Scenario {
  const base = dernierPassage(hidden.open);
  const properties = [
    { type: 'robot', id: 'cache', champ: 'sommet' },
    { type: 'robot', id: 'cache', champ: 'energie' },
  ] as const;
  return {
    ...base,
    robots: [...base.robots, { id: 'cache', sommet: hidden.node, capaciteColis: 2, activite: 'disponible', energie: { type: 'limitee', restante: hidden.energy }, sourceLocale: 'evaCache', mission: null, canal: 'direct' }],
    equipements: base.equipements.map(e => e.id === 'pompe' ? { ...e, etat: hidden.pump ? 'operationnelle' : 'arretee' } as typeof e : e),
    colis: base.colis.map(c => c.id === 'q3' ? { ...c, disponibleDepuis: 0, localisation: hidden.cargo ? { type: 'porte', robot: 'cache' } : { type: 'auSol', sommet: hidden.parcelNode } } : c),
    besoinsImportes: hidden.imported ? base.besoinsImportes : base.besoinsImportes.filter(n => n.besoin !== 'F1'),
    // Keep these receivers offline for the whole generated run, including hidden deadlines.
    evenements: base.evenements.filter(e => e.id !== 'camera-retour'),
    emissionsSonores: [
      { id: 'public', origine: { type: 'sommet', id: 'T' }, son: 'balise', conditions: [] },
      { id: 'secret', origine: { type: 'robot', id: 'cache' }, son: hidden.sound, conditions: [{ equipement: 'pompe', etat: 'operationnelle' }] },
    ],
    sources: [...base.sources,
      { id: 'evaCache', support: { type: 'robot', id: 'cache' }, destinataires: ['eva'], origineCommune: null, equipementsRequis: [], transmetRefus: false,
        couverture: properties.map(propriete => ({ propriete, depuis: base.graphe.sommets.map(v => v.id), posteFixe: false })) },
      { id: 'ancienRapport', support: { type: 'fixe', sommet: 'H' }, destinataires: ['joueur'], origineCommune: null, equipementsRequis: [{ equipement: 'camera', etat: 'disponible' }], transmetRefus: false,
        couverture: properties.map(propriete => ({ propriete, depuis: ['H'], posteFixe: false })) },
      { id: 'micro', nature: 'microphone', support: { type: 'fixe', sommet: 'T' }, destinataires: ['joueur'], origineCommune: null, equipementsRequis: [], transmetRefus: false,
        couverture: ['public', 'secret'].map(id => ({ propriete: { type: 'son', id, champ: 'emission' }, depuis: ['T'], posteFixe: false,
          perception: { type: 'audio', volume: { portee: 0.5, offset: { x: 0, y: 0, z: 0 }, direction: { x: 1, y: 0, z: 0 }, angleDeg: 360 } } })) },
    ],
    observationsInitiales: [...base.observationsInitiales, ...properties.map((propriete, i): FaitObserve => ({ source: 'ancienRapport', propriete,
      valeur: i === 0 ? lastNode : { type: 'limitee', restante: reportedEnergy }, capture: { impulsion: 2, etape: 'observations' }, reception: 2 }))],
  };
}

describe('propriétés de non-fuite — entrées publiques et informations reçues communes', () => {
  test('500 paires de mondes physiques, tous les canaux, à t4–t16 (seed 20260915)', () => {
    fc.assert(fc.property(hiddenWorld, hiddenWorld, hiddenNode, fc.nat(100), fc.integer({ min: 4, max: 16 }), (a, b, lastNode, energy, now) => {
      const sims = [a, b].map(h => createSimulation(propertyScenario(h, lastNode, energy), h.seed));
      for (let t = 4; t < now; t++) sims.forEach(sim => sim.advance());
      const views = sims.map(sim => sim.getPlayerView(intentions));
      // Establish the premise independently from projection: only player-addressed receipts.
      const packet = (index: number) => sims[index]!.getAuthorState().observations.filter(f => f.source !== 'evaCache');
      expect(packet(0)).toEqual(packet(1));
      expect(serialize(views[0]!)).toBe(serialize(views[1]!));
      // Non-vacuity: actual dated poses, live audio, routes and costs are present.
      expect(views[0]!.silhouettes.find(s => s.robot === 'cache')).toMatchObject({ sommet: lastNode, age: now - 2 });
      expect(views[0]!.sons).toHaveLength(1);
      expect(views[0]!.sons[0]?.valeur.son).toBe('balise');
      expect(views[0]!.apercusTrajet.map(p => p.cout)).toEqual([{ impulsions: 4, energie: 4 }, { impulsions: 5, energie: 5 }]);
    }), { seed: 20260915, numRuns: 500 });
  });

  test('1000 paires arbitraires : le projecteur ne consulte aucun champ physique (seed 404)', () => {
    const s = propertyScenario({ open: true, node: 'P', energy: 20, pump: true, cargo: true, parcelNode: 'Q', imported: true, sound: 'moteur', seed: 7 }, 'C', 12);
    const catalogue = createPlayerCatalogue(s);
    const state = createSimulation(s, 7).getAuthorState();
    const common: InformationRecue = { impulsion: 4, observations: state.observations, constats: [], franchissementsObserves: [] };
    fc.assert(fc.property(fc.jsonValue(), fc.jsonValue(), fc.integer({ min: 4, max: 16 }), (a, b, now) => {
      const wrapped = (hidden: unknown): InformationRecue => new Proxy({ ...common, impulsion: now, hidden }, {
        get(target, key, receiver) {
          if (!['impulsion', 'observations', 'constats', 'franchissementsObserves'].includes(String(key))) throw new Error(`Lecture interdite : ${String(key)}`);
          return Reflect.get(target, key, receiver);
        },
      });
      expect(serialize(projectPlayerView(catalogue, wrapped(a), intentions))).toBe(serialize(projectPlayerView(catalogue, wrapped(b), intentions)));
    }), { seed: 404, numRuns: 1000 });
  });

  test('changer un rapport reçu change effectivement silhouette, son, aperçu ; changer son ordre ne change rien', () => {
    const s = propertyScenario({ open: true, node: 'P', energy: 20, pump: true, cargo: true, parcelNode: 'Q', imported: true, sound: 'moteur', seed: 7 }, 'C', 12);
    const sim = createSimulation(s, 7); const state = sim.getAuthorState(); const catalogue = createPlayerCatalogue(s);
    const information: InformationRecue = { impulsion: 4, observations: state.observations, constats: [], franchissementsObserves: [] };
    const original = projectPlayerView(catalogue, information, intentions);
    expect(serialize(projectPlayerView(catalogue, { ...information, observations: [...information.observations].reverse() }, intentions))).toBe(serialize(original));
    const changed = projectPlayerView(catalogue, { ...information, observations: information.observations.map(f =>
      f.source === 'ancienRapport' && f.propriete.champ === 'sommet' ? { ...f, valeur: 'Q' }
        : f.propriete.type === 'son' && f.propriete.id === 'public' ? { ...f, valeur: null }
          : f.source === 'cameraFixe' ? { ...f, valeur: 'bloquee', capture: { impulsion: 4, etape: 'observations' }, reception: 4 } : f) }, intentions);
    expect(changed.silhouettes).not.toEqual(original.silhouettes);
    expect(changed.sons).not.toEqual(original.sons);
    expect(changed.apercusTrajet).not.toEqual(original.apercusTrajet);
  });
});
