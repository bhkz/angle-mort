import { describe, expect, test } from 'vitest';
import { createSimulation, type Ordre, type Scenario } from '../src/sim';
import { defi } from '../src/scenarios/defi';
import { cartePartage, challengeFrame, meilleurRecord } from '../src/session/challenge';

// A legal complete shift, including the previously unproved first phase.
const routeR = ['O', 'O', 'O', 'T', 'G', 'A', 'P', 'Q', 'P', 'Q', 'Q', 'Q', 'P', 'Q', 'Q', 'Q'];
const routeR2 = ['Q', 'P', 'F', 'E', 'D', 'T', 'H', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'];
function orders(t: number, repeat = false, lateQ2 = false): Ordre[] {
  const operations: NonNullable<Ordre['operations']>[number][] = [];
  if (t === 7) operations.push({ type: 'livrer', colis: 'battery' });
  if (t === (lateQ2 ? 10 : 8)) operations.push({ type: 'livrer', colis: 'q2' });
  if (t === 9 || t === 13) operations.push({ type: 'charger', colis: t === 9 ? 'q3' : 'q4' });
  if (t === 10 || t === 14) operations.push({ type: 'livrer', colis: t === 10 ? 'q3' : 'q4' });
  return [
    { robot: 'R', canal: 'direct', mission: 'eva-R', destination: routeR[t - 1]!, operations: repeat ? [...operations, ...operations.filter(o => o.type === 'livrer')] : operations },
    { robot: 'R2', canal: 'direct', destination: routeR2[t - 1]!, operations: t === 1 ? [{ type: 'livrer', colis: 'q1' }] : [] },
  ];
}
function run(s = defi(), repeat = false, lateQ2 = false) {
  const sim = createSimulation(s, 17);
  for (let t = 1; t <= 16; t++) { sim.submitOrders(orders(t, repeat, lateQ2)); sim.advance(); }
  return sim;
}

describe('défi complet, barème physique fermé', () => {
  test('16 impulsions jouées : 12 besoins, trois services et 1200, sans succès importé', () => {
    const s = defi(); const sim = createSimulation(s, 17);
    expect(s.besoinsImportes).toEqual([]); expect(sim.getAuthorState().score).toBe(0);
    for (let t = 1; t <= 16; t++) {
      expect(sim.getFinalReport()).toBeNull();
      sim.submitOrders(orders(t)); sim.advance();
      expect(sim.getAuthorState().refus).toEqual([]);
      if (t === 4) expect(sim.getAuthorState().score).toBe(300);
    }
    const b = sim.getFinalReport()!;
    expect(b.score).toBe(1200); expect(b.maximum).toBe(1200); expect(b.besoins).toHaveLength(12);
    expect(b.services.every(s => s.operationnel)).toBe(true);
    expect(sim.getAuthorState().receptions.find(r => r.colis === 'q1')?.impulsion).toBe(1);
    expect(sim.getAuthorState().traversees.map(t => t.impulsion)).toEqual([2, 6, 10, 14]);
    expect(() => sim.advance()).toThrow('Tentative terminee');
  });
  test('triche : reclasser une demande ne remplace pas Q2 expiré ni ne crée un besoin', () => {
    const base = defi();
    const changed = { ...base, colis: base.colis.map(c => c.id === 'q2' ? { ...c, nature: 'medical' as const, besoin: 'Q3' } : c) };
    const sim = createSimulation(changed, 17);
    for (let t = 1; t <= 16; t++) {
      if (t === 9) sim.configureMission({ ...changed.missions[0]!, objectif: { mesure: 'transfertOuReception', priorites: { medical: 1000 }, receptionsExigees: [] } });
      sim.submitOrders(orders(t, false, true)); sim.advance();
    }
    expect(sim.getFinalReport()!.score).toBe(1100);
    expect(sim.getAuthorState().resultats.Q2).toEqual({ etat: 'expire' });
    expect(sim.getFinalReport()!.besoins).toHaveLength(12);
  });
  test('triche : reçus répétés refusés, aucun point supplémentaire', () => {
    const clean = run(); const repeated = run(defi(), true);
    expect(repeated.getFinalReport()).toEqual(clean.getFinalReport());
    expect(repeated.getAuthorState().receptions).toEqual(clean.getAuthorState().receptions);
    expect(repeated.getAuthorState().refus.length).toBeGreaterThan(0);
  });
  test.each(['alimentationQ', 'receptionQ', 'accesQ'])('triche : démanteler %s après Q4 retire ses 100 points au contrôle final', id => {
    const base = defi(); const sim = createSimulation({ ...base, evenements: [...base.evenements,
      { id: 'demanteler', impulsion: 15, type: 'equipement', equipement: id, etat: id === 'accesQ' ? 'bloquee' : 'indisponible' },
    ] }, 17);
    for (let t = 1; t <= 16; t++) {
      sim.submitOrders(orders(t)); sim.advance();
      if (t === 14) { expect(sim.getAuthorState().receptions.some(r => r.colis === 'q4')).toBe(true); expect(sim.getAuthorState().resultats.Q4).toEqual({ etat: 'enAttente' }); }
    }
    expect(sim.getFinalReport()!.score).toBe(1100); expect(sim.getAuthorState().resultats.Q4).toEqual({ etat: 'expire' });
    expect(sim.getFinalReport()!.services.find(s => s.id === 'fournitures')?.operationnel).toBe(false);
  });
  test('triche : réception tardive utile physiquement, zéro point pour le besoin expiré', () => {
    const sim = run(defi(), false, true);
    expect(sim.getAuthorState().receptions.find(r => r.colis === 'q2')?.impulsion).toBe(10);
    expect(sim.getAuthorState().resultats.Q2).toEqual({ etat: 'expire' }); expect(sim.getFinalReport()!.score).toBe(1100);
  });
  test('triche : une réception anticipée ne satisfait pas la fenêtre suivante', () => {
    const base = defi(); const sim = createSimulation({ ...base, colis: base.colis.map(c => c.id === 'q3' ? { ...c, disponibleDepuis: 0 } : c) }, 17);
    for (let t = 1; t <= 16; t++) {
      const next = orders(t).map(o => o.robot !== 'R' ? o : { ...o, operations: [
        ...(o.operations ?? []).filter(op => op.colis !== 'q3'),
        ...(t === 7 ? [{ type: 'charger' as const, colis: 'q3' }] : t === 8 ? [{ type: 'livrer' as const, colis: 'q3' }] : []),
      ] });
      sim.submitOrders(next); sim.advance();
    }
    expect(sim.getAuthorState().receptions.find(r => r.colis === 'q3')?.impulsion).toBe(8);
    expect(sim.getAuthorState().resultats.Q3).toEqual({ etat: 'expire' }); expect(sim.getFinalReport()!.score).toBe(1100);
  });
  test('réparations répétées sans bonus : seules les disponibilités à t12 et t16 comptent', () => {
    const base = defi(); const events: Scenario['evenements'] = [11, 13].flatMap(t => [
      { id: `stop${t}`, impulsion: t, type: 'equipement' as const, equipement: 'pompe', etat: 'arretee' as const },
      { id: `repair${t}`, impulsion: t + 1, type: 'equipement' as const, equipement: 'pompe', etat: 'operationnelle' as const },
    ]);
    expect(run({ ...base, evenements: [...base.evenements, ...events] }).getFinalReport()).toEqual(run().getFinalReport());
  });
  test.each([
    ['alimentationP', 'P4', 'indisponible'], ['pompe', 'P4', 'arretee'], ['accesP', 'P4', 'bloquee'],
    ['alimentationF', 'F4', 'indisponible'], ['installationF', 'F4', 'indisponible'], ['accesF', 'F4', 'bloquee'],
  ] as const)('le contrôle final vérifie aussi %s pour %s', (id, need, state) => {
    const base = defi(); const sim = run({ ...base, evenements: [...base.evenements,
      { id: 'demanteler', impulsion: 15, type: 'equipement', equipement: id, etat: state },
    ] });
    expect(sim.getAuthorState().resultats[need]).toEqual({ etat: 'expire' }); expect(sim.getFinalReport()!.score).toBe(1100);
  });
  test('refuse deux besoins qui recyclent la même réception', () => {
    const s = defi(); expect(() => createSimulation({ ...s, besoins: s.besoins.map(n => n.id === 'Q3' ? { ...n, condition: { type: 'reception', colis: 'q2', destination: 'Q' } } : n) }, 17)).toThrow('preuve partagee');
  });
  test('aucun score ni résultat secret avant t16, même si le service caché diffère', () => {
    const s = defi(); const a = createSimulation(s, 17); const b = createSimulation({ ...s, equipements: s.equipements.map(e => e.nature === 'lecteurTransfert' && e.id === 'receptionQ' ? { ...e, etat: 'indisponible' } : e) }, 17);
    for (let t = 0; t <= 16; t++) {
      const af = challengeFrame(s, t, a.getFinalReport()); const bf = challengeFrame(s, t, b.getFinalReport());
      if (t < 16) { expect(JSON.stringify(af)).toBe(JSON.stringify(bf)); expect(af.bilan).toBeNull(); expect(JSON.stringify(a.getPlayerView())).toBe(JSON.stringify(b.getPlayerView())); }
      else expect(af.bilan).not.toEqual(bf.bilan);
      if (t < 16) { a.submitOrders(orders(t + 1)); b.submitOrders(orders(t + 1)); a.advance(); b.advance(); }
    }
  });
  test('besoins révélés par phase, horloge et carte de partage sans narration', () => {
    const s = defi(); const final = run().getFinalReport();
    expect(challengeFrame(s, 0, final).besoins).toHaveLength(3);
    expect(challengeFrame(s, 4, null).besoins).toHaveLength(6);
    expect(() => cartePartage(challengeFrame(s, 15, final), { score: 1200, services: 3, tentative: 1 }, 1)).toThrow();
    const d = challengeFrame(s, 16, final); expect(d.heure).toBe('06 h 00');
    const card = cartePartage(d, { score: 1200, services: 3, tentative: 2 }, 3);
    expect(card).toContain('ANGLE MORT · Quai 17 · Situation 041 · Standard · vp7.1');
    expect(card).toContain('1200 / 1200 · Poste terminé · 3/3 services en activité');
    expect(card).toContain('Meilleure tentative : 2'); expect(card).not.toMatch(/Alma|stock|atelier fermé/);
    expect(meilleurRecord({ score: 1000, services: 1, tentative: 1 }, { score: 1000, services: 3, tentative: 2 }).tentative).toBe(1);
  });
});
