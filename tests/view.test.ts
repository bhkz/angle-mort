import { describe, expect, test } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { createSimulation } from '../src/sim';
import { quai17 } from '../src/scenarios/quai17';
import { equipmentReport, robotReports } from '../src/view/presentation';

describe('frontière du rendu', () => {
  test('src/view ne peut importer que Three, ses propres modules et les types de vue', () => {
    for (const file of readdirSync('src/view').filter(f => f.endsWith('.ts'))) {
      const source = readFileSync(`src/view/${file}`, 'utf8');
      const imports = [...source.matchAll(/import\s+(type\s+)?[^;]+?from\s+['"]([^'"]+)['"]/g)];
      for (const match of imports) {
        expect(match[2] === 'three' || match[2]?.startsWith('./') || (match[1] !== undefined && match[2] === '../sim/types')).toBe(true);
      }
      expect(source).not.toMatch(/getAuthorState|createSimulation|\bEtatReel\b|\bScenario\b|simulation\.worker|fetch\s*\(|new\s+Worker/);
    }
    expect(readFileSync('src/session/simulation.worker.ts', 'utf8')).not.toContain('getAuthorState');
  });
  test('à t4, l’état actuel est inconnu avec un souvenir ouvert, quelle que soit la variante', () => {
    const a = createSimulation(quai17(false), 17); const b = createSimulation(quai17(true), 17);
    expect(a.getAuthorState().equipements.porte?.etat).toBe('bloquee');
    expect(a.getPlayerView()).toEqual(b.getPlayerView());
    expect(equipmentReport(a.getPlayerView(), 'porte')).toMatchObject({ status: 'dated', value: 'ouverte', at: 2 });
  });
  test('formater la vue gelée ne la modifie pas ; un robot ancien conserve sa position datée', () => {
    const sim = createSimulation(quai17(false), 17); const player = sim.getPlayerView(); const before = JSON.stringify(player);
    equipmentReport(player, 'porte'); robotReports(player); expect(JSON.stringify(player)).toBe(before);
    const dated = { ...player, impulsion: 8, silhouettes: player.silhouettes.map(r => ({ ...r, age: 4 })) };
    expect(robotReports(dated).find(r => r.robot === 'R')).toMatchObject({ sommet: 'T', age: 4 });
  });
});
