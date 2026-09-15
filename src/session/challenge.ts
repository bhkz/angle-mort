import type { Besoin, Scenario } from '../sim';
import type { BilanFinal } from '../sim/final-report';

export interface DefiPublic {
  readonly situation: '041';
  readonly difficulte: 'Standard';
  readonly version: string;
  readonly phase: number;
  readonly heure: string;
  readonly besoins: readonly Besoin[];
  readonly bilan: BilanFinal | null;
}
export function heurePoste(t: number): string {
  const minutes = (22 * 60 + t * 30) % (24 * 60);
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')} h ${String(minutes % 60).padStart(2, '0')}`;
}
/** Public contract + gated final result. This function has no author-state input. */
export function challengeFrame(s: Pick<Scenario, 'version' | 'besoins'>, t: number, bilan: BilanFinal | null): DefiPublic {
  return { situation: '041', difficulte: 'Standard', version: s.version, phase: Math.min(4, Math.floor(t / 4) + 1), heure: heurePoste(t),
    besoins: s.besoins.filter(n => n.revelation <= t), bilan: t === 16 ? bilan : null };
}

export interface RecordDefi { readonly tentative: number; readonly score: number; readonly services: number }
export function meilleurRecord(previous: RecordDefi | null, next: RecordDefi): RecordDefi {
  // Equal scores are ex aequo: services are contextual information, never a tie-break.
  return previous && previous.score >= next.score ? previous : next;
}
export function cartePartage(d: DefiPublic, best: RecordDefi | null, tentative: number, training = false): string {
  if (!d.bilan) throw new Error('Bilan indisponible avant la fin');
  const b = d.bilan;
  const grid = b.services.map(s => `${s.id === 'pompage' ? 'Pompage' : s.id === 'ferry' ? 'Ferry' : 'Fournitures'} : ${[1, 2, 3, 4].map(phase => b.besoins.find(n => n.service === s.id && n.phase === phase)?.resultat.etat === 'satisfait' ? '■' : '·').join(' ')}`).join('\n');
  return `ANGLE MORT · Quai 17 · Situation ${d.situation} · ${d.difficulte} · v${d.version}\n${b.score} / ${b.maximum} · Poste terminé · ${b.services.filter(s => s.operationnel).length}/3 services en activité · ${d.heure}\n${best ? `Meilleure tentative : ${best.tentative} (${best.score} / ${b.maximum})` : 'Aucun record de tentative complète'}\n${training ? 'Entraînement guidé · Hors record' : tentative === 1 ? 'Première découverte' : `Tentative ${tentative}`} · Résultat local déclaratif\n${grid}\nQui garde les trois jusqu’au matin ?`;
}
