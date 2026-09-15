import type { Cible, EtatReel, ObstacleObservation, Position3D, Scenario, VolumeObservation } from './types';
import { matches, requireValue } from './util';

const axes = ['x', 'y', 'z'] as const;
const epsilon = 1e-9;
export function add(a: Position3D, b: Position3D): Position3D {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}
/** Closed boxes occlude the interior of the sight segment, including tangencies. */
function intersects(a: Position3D, b: Position3D, box: ObstacleObservation): boolean {
  let enter = epsilon; let leave = 1 - epsilon;
  for (const axis of axes) {
    const delta = b[axis] - a[axis];
    if (Math.abs(delta) <= epsilon) {
      if (a[axis] < box.min[axis] || a[axis] > box.max[axis]) return false;
    } else {
      const t1 = (box.min[axis] - a[axis]) / delta;
      const t2 = (box.max[axis] - a[axis]) / delta;
      enter = Math.max(enter, Math.min(t1, t2)); leave = Math.min(leave, Math.max(t1, t2));
      if (enter > leave) return false;
    }
  }
  return enter <= leave;
}
/** Pure geometry; active occluders must be selected by acquisition, never by presentation. */
export function geometricallyVisible(origin: Position3D, target: Position3D, volume: VolumeObservation, obstacles: readonly ObstacleObservation[]): boolean {
  const eye = add(origin, volume.offset);
  const delta = { x: target.x - eye.x, y: target.y - eye.y, z: target.z - eye.z };
  const distance = Math.hypot(delta.x, delta.y, delta.z);
  if (distance > volume.portee + epsilon) return false;
  if (distance > epsilon && volume.angleDeg < 360) {
    const length = Math.hypot(volume.direction.x, volume.direction.y, volume.direction.z);
    const cosine = axes.reduce((sum, axis) => sum + delta[axis] * volume.direction[axis], 0) / (distance * length);
    if (cosine + epsilon < Math.cos(volume.angleDeg * Math.PI / 360)) return false;
  }
  return !obstacles.some(box => intersects(eye, target, box));
}
export function targetPosition(s: Scenario, state: EtatReel, target: Cible, visited = new Set<string>()): Position3D | undefined {
  const key = `${target.type}:${target.id}`;
  if (visited.has(key)) return undefined;
  visited.add(key);
  switch (target.type) {
    case 'sommet': return s.graphe.sommets.find(v => v.id === target.id)?.position;
    case 'arete': {
      const edge = requireValue(s.graphe.aretes.find(e => e.id === target.id), 'Arete inconnue');
      const a = requireValue(targetPosition(s, state, { type: 'sommet', id: edge.extremites[0] }), 'Sommet inconnu');
      const b = requireValue(targetPosition(s, state, { type: 'sommet', id: edge.extremites[1] }), 'Sommet inconnu');
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 };
    }
    case 'robot': return targetPosition(s, state, { type: 'sommet', id: requireValue(state.robots[target.id], 'Robot inconnu').sommet }, visited);
    case 'colis': {
      const location = requireValue(state.colis[target.id], 'Colis inconnu').localisation;
      return targetPosition(s, state, location.type === 'porte' ? { type: 'robot', id: location.robot } : { type: 'sommet', id: location.sommet }, visited);
    }
    case 'equipement': return targetPosition(s, state, requireValue(state.equipements[target.id], 'Equipement inconnu').cible, visited);
    case 'service': return undefined; // Aggregate conditions need an explicit observation anchor.
  }
}
export function activeObstacles(s: Scenario, state: EtatReel, target?: Cible): readonly ObstacleObservation[] {
  return (s.obstaclesObservation ?? []).filter(box => matches(state, box.actifSi) &&
    !(target && box.cible?.type === target.type && box.cible.id === target.id));
}
