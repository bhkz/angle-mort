import type { CroyancesPlanificateur } from './types';

/** Direct waypoint navigation on received beliefs. Lexicographic BFS, never a physical feasibility promise. */
export function routeConnue(b: CroyancesPlanificateur, robot: string, destination: string): readonly string[] | undefined {
  const start = b.robots.find(r => r.id === robot)?.position;
  if (!start || start.etat === 'inconnu') return undefined;
  const queue: string[][] = [[start.valeur]]; const seen = new Set([start.valeur]);
  for (let i = 0; i < queue.length; i++) {
    const path = queue[i]!; const from = path.at(-1)!;
    if (from === destination) return path;
    const edges = b.graphe.aretes.filter(e => e.extremites.includes(from)).sort((a, c) => a.id < c.id ? -1 : a.id > c.id ? 1 : 0);
    for (const edge of edges) {
      if (edge.controlePar.some(id => { const e = b.equipements.find(e => e.id === id)?.etat; return !e || e.etat === 'inconnu' || !['ouverte', 'abaissee'].includes(e.valeur); })) continue;
      const next = edge.extremites.find(id => id !== from)!;
      if (seen.has(next) || b.robots.some(r => r.id !== robot && r.position.etat !== 'inconnu' && r.position.valeur === next)) continue;
      seen.add(next); queue.push([...path, next]);
    }
  }
  return undefined;
}
