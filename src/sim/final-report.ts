import type { EtatReel, ResultatBesoin, Scenario } from './types';
import { operational, snapshot } from './util';

export interface BilanFinal {
  readonly scenario: string;
  readonly version: string;
  readonly impulsion: number;
  readonly score: number;
  readonly maximum: number;
  readonly services: readonly Readonly<{ id: string; operationnel: boolean }>[];
  readonly besoins: readonly Readonly<{ id: string; service: string; phase: number; resultat: ResultatBesoin }>[];
}

/** Deliberate end-of-attempt disclosure. No author positions, losses or event schedule. */
export function finalReport(s: Scenario, state: EtatReel): BilanFinal | null {
  if (state.impulsion < s.fin) return null;
  return snapshot({ scenario: s.id, version: s.version, impulsion: state.impulsion, score: state.score,
    maximum: s.besoins.reduce((sum, n) => sum + n.points, 0),
    services: s.services.map(service => ({ id: service.id, operationnel: operational(s, state, service.id) })),
    besoins: s.besoins.map(n => ({ id: n.id, service: n.service, phase: n.phase, resultat: state.resultats[n.id]! })),
  });
}
