// Micro-simulation de conception. Aucun rendu ni moteur de jeu complet.
// Exécution : node conception/verification/objectifs-v2.mjs
import assert from 'node:assert/strict';

const graph = { O: ['T'], T: ['O', 'A', 'X'], A: ['T'], X: ['T', 'Y'], Y: ['X', 'B'], B: ['Y'] };
const destinations = ['A', 'A', 'B'];
const cases = [
  { id: 'reception-priorite-1', transfer: false, permit: true, weight: 1, expected: 18 },
  { id: 'reception-priorite-3', transfer: false, permit: true, weight: 3, expected: 34 },
  { id: 'transfert-priorite-1', transfer: true, permit: true, weight: 1, expected: 27 },
  { id: 'transfert-priorite-3', transfer: true, permit: true, weight: 3, expected: 47 },
  { id: 'transfert-medical-recu', transfer: true, permit: true, weight: 3, requireMedical: true, expected: 44 },
  { id: 'transfert-droit-retire', transfer: true, permit: false, weight: 3, expected: 34 },
];

function optimize(config) {
  const visited = new Map();
  let best = null;
  const key = (s) => `${s.time}/${s.pos}/${s.items.join(',')}/${s.counted}`;
  function visit(s) {
    const k = key(s);
    if (visited.has(k) && visited.get(k) <= s.actions.length) return;
    visited.set(k, s.actions.length);
    const received = s.items.map(x => x === 'done');
    const counted = config.transfer ? s.counted : received.reduce((m, value, i) => m | (value ? (1 << i) : 0), 0);
    const total = [1, 1, config.weight].reduce((sum, w, i) => sum + ((counted & (1 << i)) ? w : 0), 0);
    const score = 10 * total - s.time;
    if ((!config.requireMedical || received[2]) && (!best || score > best.score || (score === best.score && s.actions.length < best.actions.length))) {
      best = { score, path: s.path, actions: s.actions, received, finalItems: s.items };
    }
    // Toutes les opérations locales gratuites sont explorées ; la clé d'état
    // empêche les cycles dépôt/reprise et une clôture ne compte qu'une fois.
    for (let i = 0; i < 3; i++) {
      const nextItems = [...s.items];
      if (s.items[i] === s.pos && s.items.filter(x => x === 'robot').length < 2) {
        nextItems[i] = 'robot';
        visit({ ...s, items: nextItems, actions: [...s.actions, `${s.time}:charger ${i} en ${s.pos}`] });
      }
      if (s.items[i] !== 'robot') continue;
      if (s.pos === destinations[i]) {
        nextItems[i] = 'done';
        visit({ ...s, items: nextItems, counted: s.counted | (1 << i), actions: [...s.actions, `${s.time}:recevoir ${i} en ${s.pos}`] });
      } else if (s.pos === 'O' || (s.pos === 'T' && config.permit)) {
        nextItems[i] = s.pos;
        visit({ ...s, items: nextItems, counted: s.counted | ((s.pos === 'T' && config.transfer) ? (1 << i) : 0), actions: [...s.actions, `${s.time}:deposer ${i} en ${s.pos}`] });
      }
    }
    if (s.time === 6) return;
    for (const pos of graph[s.pos]) {
      visit({ ...s, time: s.time + 1, pos, path: [...s.path, pos], actions: [...s.actions, `${s.time + 1}:aller ${pos}`] });
    }
  }
  visit({ time: 0, pos: 'O', items: ['O', 'O', 'O'], counted: 0, path: ['O'], actions: [] });
  assert.ok(best);
  assert.equal(best.score, config.expected, config.id);
  if (!config.permit) assert.ok(best.actions.every(x => !/deposer \d en T/.test(x)));
  if (config.requireMedical) assert.equal(best.received[2], true);
  return { id: config.id, uniqueStates: visited.size, ...best };
}

const results = cases.map(optimize);
assert.deepEqual(results[3].received, [false, false, false]);
assert.deepEqual(results[4].received, [false, false, true]);
assert.equal(results[1].received.filter(Boolean).length, 2);
assert.equal(results[5].received.filter(Boolean).length, 2);
console.log(JSON.stringify({ scope: 'Enumeration complete du microcas a un robot, horizon six deplacements. Ne valide pas le jeu complet ni le plaisir.', results }, null, 2));
