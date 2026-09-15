import { expect, test } from 'vitest';
import { createSimulation } from '../src/sim';
import { catalogueSession, jouable } from '../src/scenarios/jouable';
import { createSessionController } from '../src/session/controller';
import { guideFor } from '../src/ui/guidance';
import { cartePartage, challengeFrame } from '../src/session/challenge';
import { defi } from '../src/scenarios/defi';

test('le guidage ne distingue pas les deux variantes cachées de porte', () => {
  const frames = [true, false].map(open => { const s = jouable('dernierPassage', open); return createSessionController(createSimulation(s, 17), catalogueSession(s, 'dernierPassage')).frame(); });
  for (const robot of [null, 'R', 'R2']) expect(JSON.stringify(guideFor(frames[0]!, robot))).toBe(JSON.stringify(guideFor(frames[1]!, robot)));
  expect(guideFor(frames[0]!, null).title).toBe('La porte est-elle encore ouverte ?');
});
test('une carte aidée annonce entraînement et ne prétend pas établir un record', () => {
  const s = defi(); const sim = createSimulation(s, 17); for (let i = 0; i < 16; i++) sim.advance();
  const card = cartePartage(challengeFrame(s, 16, sim.getFinalReport()), null, 1, true);
  expect(card).toContain('Entraînement guidé · Hors record'); expect(card).toContain('Aucun record de tentative complète'); expect(card).not.toContain('Première découverte');
});
