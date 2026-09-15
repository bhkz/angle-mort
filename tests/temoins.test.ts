import { describe, expect, test } from 'vitest';
import { createSimulation } from '../src/sim';
import type { Ordre, Scenario } from '../src/sim';
import { dernierPassage } from './fixtures/dernierPassage';

// Expected data from V2-04; these are commands and assertions, never another simulator.
const witnesses = [
  { name: 'ouverte-observation-precoce', open: true, observer: 'C', positions: ['G','A','P','Q','P','Q','Q','Q','P','Q','Q','Q'], battery: 7, q2: 8, q3: 10, score: 1200 },
  { name: 'bloquee-detour-precoce', open: false, observer: 'C', positions: ['D','E','F','P','Q','P','Q','Q','P','Q','Q','Q'], battery: 8, q2: 9, q3: 11, score: 1100 },
  { name: 'bloquee-attente-observation', open: false, observer: 'H', positions: ['T','D','E','F','P','Q','Q','Q','P','Q','Q','Q'], battery: 9, q2: 10, q3: 10, score: 1000 },
  { name: 'bloquee-engagement-puis-observation', open: false, observer: 'H', positions: ['G','T','D','E','F','P','Q','Q','P','Q','Q','Q'], battery: 10, q2: 11, q3: 11, score: 1000 },
  { name: 'bloquee-decouverte-par-refus', open: false, observer: 'H', positions: ['G','G','T','D','E','F','P','Q','P','Q','Q','Q'], battery: 11, q2: 12, q3: 12, score: 800 },
] as const;
type Witness = typeof witnesses[number];

function commands(w: Witness, t: number): Ordre[] {
  const operations: NonNullable<Ordre['operations']>[number][] = [];
  if (t === w.battery) operations.push({ type: 'livrer', colis: 'battery' });
  if (t === w.q2) operations.push({ type: 'livrer', colis: 'q2' });
  if (t === w.q3 - 1) operations.push({ type: 'charger', colis: 'q3' });
  if (t === w.q3) operations.push({ type: 'livrer', colis: 'q3' });
  if (t === 13) operations.push({ type: 'charger', colis: 'q4' });
  if (t === 14) operations.push({ type: 'livrer', colis: 'q4' });
  const destination = w.name === 'bloquee-decouverte-par-refus' && t === 6 ? 'A' : w.positions[t - 5]!;
  return [
    { robot: 'R', canal: 'direct', destination, operations },
    ...(t === 5 && w.observer === 'H' && w.name !== 'bloquee-decouverte-par-refus'
      ? [{ robot: 'R2', canal: 'direct', destination: 'C', activite: 'observationFixe' as const }] : []),
  ];
}

function run(w: Witness, s: Scenario = dernierPassage(w.open, w.observer), seed = 17) {
  const simulation = createSimulation(s, seed);
  expect(simulation.getAuthorState().score).toBe(300);
  for (let t = 5; t <= 16; t++) {
    simulation.submitOrders(commands(w, t));
    expect(simulation.getAuthorState().impulsion).toBe(t - 1);
    simulation.advance();
    const state = simulation.getAuthorState();
    expect(state.robots.R?.sommet, `position a t${t}`).toBe(w.positions[t - 5]);
    expect(new Set(Object.values(state.robots).map(r => r.sommet)).size).toBe(2);
    for (const robot of Object.values(state.robots)) {
      expect(Object.values(state.colis).filter(c => c.localisation.type === 'porte' && c.localisation.robot === robot.id).length).toBeLessThanOrEqual(2);
    }
  }
  return simulation;
}

describe('temoins physiques V2-04 — vrai moteur', () => {
  test.each(witnesses)('$name : $score points', w => {
    const state = run(w).getAuthorState();
    expect(Object.fromEntries(state.receptions.filter(r => r.colis !== 'q1').map(r => [r.colis, r.impulsion])))
      .toEqual({ battery: w.battery, q2: w.q2, q3: w.q3, q4: 14 });
    expect(state.score).toBe(w.score);
    expect(state.consequences).toEqual({ stock: w.battery > 8 ? 'perduPourLePoste' : 'utilisable', atelier: w.battery > 10 ? 'ferme' : w.battery > 8 ? 'repriseLimitee' : 'intact' });
    expect(state.equipements.pompe?.etat).toBe(w.battery > 10 ? 'reparationExterieureRequise' : 'operationnelle');
    expect(state.refus).toHaveLength(w.battery === 11 ? 1 : 0);
    if (w.battery === 11) expect(state.constats).toEqual([{ impulsion: 6, robot: 'R', source: 'telemetrieR', action: 'deplacement', resultat: 'refuse' }]);
  });

  test('meme scenario, memes ordres et meme graine : etat final identique', () => {
    const w = witnesses[3];
    const s = { ...dernierPassage(false, 'H'), variantes: [{ id: 'porte-au-lancement', equipement: 'porte', etats: ['bloquee'] as const }] };
    const first = run(w, s, 987);
    const second = run(w, s, 987);
    expect(first.getAuthorState()).toEqual(second.getAuthorState());
    expect(first.getPlayerView()).toEqual(second.getPlayerView());
    expect(first.getAuthorState().rng.etat).not.toBe(987);
  });

  test.each(['alimentationF', 'alimentationQ'])('la condition finale de %s retire les points de phase 4', equipment => {
    const w = witnesses[0]; const base = dernierPassage(true, 'C');
    const sim = run(w, { ...base, evenements: [...base.evenements, { id: 'panne-finale', impulsion: 16, type: 'equipement', equipement: equipment, etat: 'indisponible' }] });
    const state = sim.getAuthorState();
    expect(state.score).toBe(1100);
    expect(state.resultats[equipment === 'alimentationF' ? 'F4' : 'Q4']).toEqual({ etat: 'expire' });
  });
});
