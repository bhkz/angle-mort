import { describe, expect, test } from 'vitest';
import { createPlayerCatalogue, createSimulation, projectPlayerView, type FaitObserve, type Scenario, type SourceObservation, type VolumeObservation } from '../src/sim';
import { geometricallyVisible } from '../src/sim/geometry';
import { dernierPassage } from './fixtures/dernierPassage';

const zero = { x: 0, y: 0, z: 0 };
const volume: VolumeObservation = { offset: zero, direction: { x: 1, y: 0, z: 0 }, angleDeg: 90, portee: 10 };
const box = { id: 'mur', min: { x: 2, y: -1, z: -1 }, max: { x: 3, y: 1, z: 1 }, actifSi: [] };
function report(sim: ReturnType<typeof createSimulation>, source: string, field = 'etat') {
  return sim.getPlayerView().observations.find(o => o.etat !== 'inconnu' && o.fait.source === source && o.fait.propriete.champ === field);
}

describe('géométrie indépendante du rendu', () => {
  test('portée et cône 3D, limites incluses', () => {
    expect(geometricallyVisible(zero, { x: 10, y: 0, z: 0 }, volume, [])).toBe(true);
    expect(geometricallyVisible(zero, { x: 10.01, y: 0, z: 0 }, volume, [])).toBe(false);
    expect(geometricallyVisible(zero, { x: 2, y: 2, z: 0 }, volume, [])).toBe(true);
    expect(geometricallyVisible(zero, { x: 2, y: 2.1, z: 0 }, volume, [])).toBe(false);
    expect(geometricallyVisible(zero, { x: -1, y: 0, z: 0 }, volume, [])).toBe(false);
    expect(geometricallyVisible(zero, { x: -1, y: 0, z: 0 }, { ...volume, angleDeg: 360 }, [])).toBe(true);
  });
  test('occlusion, tangence, élévation et offset du capteur', () => {
    expect(geometricallyVisible(zero, { x: 4, y: 0, z: 0 }, volume, [box])).toBe(false);
    expect(geometricallyVisible({ x: 0, y: 1, z: 0 }, { x: 4, y: 1, z: 0 }, volume, [box])).toBe(false);
    expect(geometricallyVisible(zero, { x: 4, y: 2, z: 0 }, { ...volume, offset: { x: 0, y: 2, z: 0 } }, [box])).toBe(true);
    expect(geometricallyVisible(zero, { x: 1, y: 0, z: 0 }, volume, [box])).toBe(true);
  });
  test('les obstacles conditionnels suivent les événements avant acquisition', () => {
    const base = dernierPassage(false, 'C');
    const sim = createSimulation({ ...base, obstaclesObservation: [...base.obstaclesObservation!, {
      id: 'volet', min: { x: -1.5, y: 0, z: 1.5 }, max: { x: -0.5, y: 5, z: 2.5 }, actifSi: [{ equipement: 'passerelle', etat: 'relevee' }],
    }] }, 1);
    expect(report(sim, 'telemetrieR2')).toMatchObject({ etat: 'maintenant', age: 0 });
    sim.advance(); // Bridge rises at 5, shutter now occludes the ray C→A.
    expect(report(sim, 'telemetrieR2')).toMatchObject({ etat: 'datee', age: 1, fait: { capture: { impulsion: 4 } } });
  });
  test('un obstacle appartenant à la cible ne cache pas sa propre face', () => {
    const base = dernierPassage(false, 'C');
    const sim = createSimulation({ ...base, obstaclesObservation: [...base.obstaclesObservation!, {
      id: 'porte-volume', min: { x: -0.1, y: 0, z: 1.9 }, max: { x: 0.1, y: 1, z: 2.1 }, actifSi: [], cible: { type: 'equipement', id: 'porte' },
    }] }, 1);
    expect(report(sim, 'telemetrieR2')).toMatchObject({ fait: { valeur: 'bloquee' } });
  });
});

describe('acquisition, âge et provenance', () => {
  test('la caméra suit la position physique du robot et des colis portés, puis conserve leur dernière capture hors portée', () => {
    const base = dernierPassage(false);
    const source: SourceObservation = {
      id: 'cameraDepot', nature: 'cameraFixe', support: { type: 'fixe', sommet: 'O' }, equipementsRequis: [], destinataires: ['joueur'], origineCommune: null, transmetRefus: false,
      couverture: [
        { propriete: { type: 'robot', id: 'R', champ: 'sommet' }, depuis: ['O'], posteFixe: false, perception: { type: 'vision', volume: { ...volume, portee: 3 } } },
        { propriete: { type: 'colis', id: 'battery', champ: 'localisation' }, depuis: ['O'], posteFixe: false, perception: { type: 'vision', volume: { ...volume, portee: 3 } } },
      ],
    };
    const sim = createSimulation({ ...base, sources: [...base.sources, source] }, 1);
    expect(report(sim, 'cameraDepot', 'sommet')).toMatchObject({ etat: 'maintenant', fait: { valeur: 'T' } });
    sim.submitOrders([{ robot: 'R', canal: 'direct', destination: 'G' }]); sim.advance();
    expect(sim.getAuthorState().robots.R?.sommet).toBe('G');
    expect(report(sim, 'cameraDepot', 'sommet')).toMatchObject({ etat: 'datee', age: 1, fait: { valeur: 'T' } });
    expect(report(sim, 'cameraDepot', 'localisation')).toMatchObject({ etat: 'datee', age: 1 });
    expect(sim.getPlayerView().silhouettes.find(s => s.source === 'cameraDepot')).toMatchObject({ sommet: 'T', age: 1 });
  });
  test('un robot en poste exige activité, couverture et droit actuel ; le départ conserve le fait daté', () => {
    const base = dernierPassage(false, 'C');
    const noRight = createSimulation({ ...base, droits: base.droits.filter(d => d.id !== 'R2-observer') }, 1);
    expect(report(noRight, 'telemetrieR2')).toBeUndefined();
    const idle = createSimulation({ ...base, robots: base.robots.map(r => r.id === 'R2' ? { ...r, activite: 'disponible' } : r) }, 1);
    expect(report(idle, 'telemetrieR2')).toBeUndefined();
    const sim = createSimulation({ ...base, evenements: [...base.evenements, { id: 'ouvrir', impulsion: 5, type: 'equipement', equipement: 'porte', etat: 'ouverte' }] }, 1);
    sim.submitOrders([{ robot: 'R2', canal: 'direct', destination: 'H' }]); sim.advance(); sim.advance();
    expect(report(sim, 'telemetrieR2')).toMatchObject({ etat: 'datee', age: 2, fait: { valeur: 'bloquee', capture: { impulsion: 4 } } });
  });
  test('révocation du droit d’observer avant acquisition sans effacer le rapport précédent', () => {
    const base = dernierPassage(false, 'C');
    const sim = createSimulation({ ...base, evenements: [...base.evenements, { id: 'retrait-observer', impulsion: 5, type: 'revoquerDroit', droit: 'R2-observer' }] }, 1);
    sim.advance();
    expect(report(sim, 'telemetrieR2')).toMatchObject({ etat: 'datee', age: 1 });
  });
  test('deux sources d’origine commune conservent leurs rapports divergents et leurs âges', () => {
    const base = dernierPassage(false, 'C');
    const sim = createSimulation({ ...base, sources: base.sources.map(s => s.id === 'telemetrieR2' ? { ...s, origineCommune: 'cameraFixe' } : s) }, 1);
    expect(report(sim, 'telemetrieR2')).toMatchObject({ etat: 'maintenant', fait: { valeur: 'bloquee' } });
    expect(report(sim, 'cameraFixe')).toMatchObject({ etat: 'datee', age: 2, fait: { valeur: 'ouverte' } });
    expect(sim.getPlayerView().sources.find(s => s.id === 'telemetrieR2')?.origineCommune).toBe('cameraFixe');
  });
  test('le rapport le plus récent est choisi par date, pas par ordre du tableau ; aucune réception future', () => {
    const base = dernierPassage(false); const catalogue = createPlayerCatalogue(base);
    const first = base.observationsInitiales[0]!;
    const facts: FaitObserve[] = [
      { ...first, valeur: 'bloquee', capture: { impulsion: 3, etape: 'observations' }, reception: 3 }, first,
      { ...first, valeur: 'ouverte', capture: { impulsion: 4, etape: 'observations' }, reception: 5 },
    ];
    const view = projectPlayerView(catalogue, { impulsion: 4, observations: facts, constats: [], franchissementsObserves: [] });
    expect(view.observations.find(o => o.etat !== 'inconnu')).toMatchObject({ etat: 'datee', age: 1, fait: { valeur: 'bloquee' } });
  });
});

function detector(base: Scenario, identifies = false, recipients: SourceObservation['destinataires'] = ['joueur']): Scenario {
  return { ...base, sources: [...base.sources, {
    id: 'seuil', nature: 'capteurFranchissement', support: { type: 'fixe', sommet: 'G' }, equipementsRequis: [],
    couverture: [], destinataires: recipients, origineCommune: null, transmetRefus: false,
    capteurFranchissement: { aretes: ['TG', 'GA'], identifieRobot: identifies },
  }] };
}
describe('capteur de franchissement', () => {
  test.each([false, true])('ne transmet que les passages réussis, identification=%s', identifies => {
    const sim = createSimulation(detector(dernierPassage(false), identifies), 7);
    expect(sim.getPlayerView().franchissements).toEqual([]);
    sim.submitOrders([{ robot: 'R', canal: 'direct', destination: 'G' }]); sim.advance();
    expect(sim.getPlayerView().franchissements).toEqual([{ source: 'seuil', robot: identifies ? 'R' : null, arete: 'TG', depuis: 'T', vers: 'G', impulsion: 5 }]);
    sim.submitOrders([{ robot: 'R', canal: 'direct', destination: 'A' }]); sim.advance();
    sim.advance(); // Neither a refusal nor waiting is a crossing.
    expect(sim.getPlayerView().franchissements).toHaveLength(1);
    expect(sim.getPlayerView().franchissements[0]).not.toHaveProperty('chargement');
  });
  test('source indisponible ou destinée seulement à EVA : aucun événement joueur', () => {
    const base = detector(dernierPassage(false));
    const unavailable = { ...base, sources: base.sources.map(s => s.id === 'seuil' ? { ...s, equipementsRequis: [{ equipement: 'camera', etat: 'disponible' as const }] } : s) };
    for (const s of [unavailable, detector(dernierPassage(false), true, ['eva'])]) {
      const sim = createSimulation(s, 7);
      sim.submitOrders([{ robot: 'R', canal: 'direct', destination: 'G' }]); sim.advance();
      expect(sim.getAuthorState().franchissements).toHaveLength(1);
      expect(sim.getPlayerView().franchissements).toEqual([]);
      sim.advance(); sim.advance();
      expect(sim.getPlayerView().franchissements).toEqual([]); // No retrospective replay at camera recovery.
    }
  });
});

describe('sons acquis et présentation', () => {
  test('portée, occlusion, silence et panne : aucune position secrète ni lecture sonore historique', () => {
    const base = dernierPassage(false);
    const source: SourceObservation = {
      id: 'micro', nature: 'microphone', support: { type: 'fixe', sommet: 'G' }, equipementsRequis: [], destinataires: ['joueur'], origineCommune: null, transmetRefus: false,
      couverture: [{ propriete: { type: 'son', id: 'pompe-son', champ: 'emission' }, depuis: ['G'], posteFixe: false,
        perception: { type: 'audio', volume: { ...volume, portee: 10, angleDeg: 360 } } }],
    };
    const s: Scenario = { ...base, sources: [...base.sources, source], emissionsSonores: [{ id: 'pompe-son', origine: { type: 'sommet', id: 'A' }, son: 'bourdonnement', conditions: [{ equipement: 'pompe', etat: 'operationnelle' }] }] };
    const blocked = createSimulation(s, 1);
    expect(report(blocked, 'micro', 'emission')).toMatchObject({ etat: 'maintenant', fait: { valeur: null } });
    expect(blocked.getPlayerView().sons).toEqual([]);
    const clear = createSimulation({ ...s, obstaclesObservation: [] }, 1);
    expect(clear.getPlayerView().sons).toHaveLength(1);
    clear.advance(); // Pump stops at 5; source hears silence, not an alarm inferred from truth.
    expect(clear.getPlayerView().sons).toEqual([]);
    expect(report(clear, 'micro', 'emission')).toMatchObject({ etat: 'maintenant', fait: { valeur: null } });
    const outOfRange = createSimulation({ ...s, obstaclesObservation: [], sources: [...base.sources, { ...source, couverture: source.couverture.map(c => ({ ...c, perception: { ...c.perception!, volume: { ...volume, portee: 0.1, angleDeg: 360 } } })) }] }, 1);
    expect(outOfRange.getPlayerView().sons).toEqual([]);
    const broken = createSimulation({ ...s, obstaclesObservation: [], evenements: s.evenements.filter(e => e.id !== 'charge-initiale-epuisee'),
      sources: [...base.sources, { ...source, equipementsRequis: [{ equipement: 'camera', etat: 'maintenance' }] }] }, 1);
    expect(broken.getPlayerView().sons).toHaveLength(1);
    broken.advance(); broken.advance(); broken.advance();
    expect(broken.getPlayerView().sons).toEqual([]);
    expect(report(broken, 'micro', 'emission')).toMatchObject({ etat: 'datee', age: 1, fait: { valeur: { type: 'son', son: 'bourdonnement' } } });
  });
});

describe('validation des capteurs', () => {
  test('refuse un cône invalide, une caméra sans géométrie et un détecteur distant', () => {
    const base = dernierPassage(false);
    expect(() => createSimulation({ ...base, sources: base.sources.map(s => s.id === 'cameraFixe' ? { ...s, couverture: s.couverture.map(c => ({ ...c, perception: { ...c.perception!, volume: { ...volume, portee: -1 } } })) } : s) }, 1)).toThrow('portee');
    expect(() => createSimulation({ ...base, sources: base.sources.map(s => s.id === 'cameraFixe' ? { ...s, couverture: [{ propriete: { type: 'equipement', id: 'porte', champ: 'etat' }, depuis: ['H'], posteFixe: false }] } : s) }, 1)).toThrow('camera geometrique');
    const d = detector(base);
    expect(() => createSimulation({ ...d, sources: d.sources.map(s => s.id === 'seuil' ? { ...s, support: { type: 'fixe', sommet: 'Q' } } : s) }, 1)).toThrow('capteur au bout');
  });
});
