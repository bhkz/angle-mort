import type { ConditionEquipement, EtatReel, Scenario } from './types';

export type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> };

// All public simulation data is JSON data, without prototypes, clocks or handles.
export function copy<T>(value: T): Mutable<T> {
  return JSON.parse(JSON.stringify(value)) as Mutable<T>;
}
export function snapshot<T>(value: T): T {
  const result = copy(value);
  function freeze(item: unknown): void {
    if (item !== null && typeof item === 'object') {
      Object.values(item).forEach(freeze);
      Object.freeze(item);
    }
  }
  freeze(result);
  return result as T;
}
export function compareId(a: { id: string }, b: { id: string }): number {
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}
export function indexById<T extends { readonly id: string }>(items: readonly T[]): Record<string, Mutable<T>> {
  return Object.fromEntries([...items].sort(compareId).map(item => [item.id, copy(item)]));
}
export function requireValue<T>(value: T | undefined, message: string): T {
  if (value === undefined) throw new Error(message);
  return value;
}
export function matches(state: EtatReel, conditions: readonly ConditionEquipement[]): boolean {
  return conditions.every(condition => state.equipements[condition.equipement]?.etat === condition.etat);
}
export function operational(scenario: Scenario, state: EtatReel, service: string): boolean {
  const definition = requireValue(scenario.services.find(item => item.id === service), 'Service inconnu');
  return matches(state, definition.dependances);
}
export function cargo(state: EtatReel, robot: string): string[] {
  return Object.values(state.colis).filter(item => item.localisation.type === 'porte' && item.localisation.robot === robot)
    .map(item => item.id).sort();
}
