import type { FaitObserve, LocalisationColis, VueJoueur } from '../sim/types';

export interface EquipmentReport {
  readonly id: string;
  readonly status: 'current' | 'dated' | 'unknown';
  readonly value: string | null;
  readonly at: number | null;
  readonly sources: readonly string[];
}
/** Formatting of received evidence only; no predictions or physical rule evaluation. */
export function equipmentReport(view: VueJoueur, id: string): EquipmentReport {
  const facts = view.observations.flatMap(o => o.etat !== 'inconnu' && o.fait.propriete.type === 'equipement' && o.fait.propriete.id === id ? [o.fait] : []);
  const at = facts.reduce((latest, f) => Math.max(latest, f.capture.impulsion), -1);
  const latest = facts.filter(f => f.capture.impulsion === at);
  const values = new Set(latest.map(f => f.valeur));
  const value = values.size === 1 && typeof latest[0]?.valeur === 'string' ? latest[0].valeur : null;
  return { id, status: value === null ? 'unknown' : at === view.impulsion ? 'current' : 'dated', value,
    at: at < 0 ? null : at, sources: latest.map(f => f.source).sort() };
}
export function observationCaption(report: EquipmentReport): string {
  if (report.value === null) return 'Aucune observation exploitable';
  const words: Record<string, string> = { ouverte: 'ouverte', bloquee: 'bloquée', relevee: 'relevée', abaissee: 'abaissée', maintenance: 'en maintenance', disponible: 'disponible' };
  return `${report.status === 'current' ? 'Observée' : 'Dernière observation'} : ${words[report.value] ?? report.value} · t${report.at}`;
}
export function robotReports(view: VueJoueur) {
  // Preserve conflicting same-date reports, but discard older poses when a newer one was received.
  return view.silhouettes.filter(s => !view.silhouettes.some(other => other.robot === s.robot && other.capture.impulsion > s.capture.impulsion));
}
export function cargoReports(view: VueJoueur, robot: string): readonly FaitObserve[] {
  return view.observations.flatMap(o => o.etat !== 'inconnu' && o.fait.propriete.type === 'robot' && o.fait.propriete.id === robot && o.fait.propriete.champ === 'chargement' ? [o.fait] : []);
}
export function parcelReports(view: VueJoueur) {
  const reports = view.observations.flatMap(o => {
    if (o.etat === 'inconnu' || o.fait.propriete.type !== 'colis') return [];
    const value = o.fait.valeur;
    if (typeof value !== 'object' || value === null || !('type' in value) || !['auSol', 'porte', 'recu'].includes(value.type)) return [];
    return [{ id: o.fait.propriete.id, location: value as LocalisationColis, at: o.fait.capture.impulsion, age: o.age }];
  });
  return reports.filter(r => !reports.some(other => other.id === r.id && other.at > r.at));
}
