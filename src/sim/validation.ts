import type { Cible, ConditionEquipement, EtatEquipement, Equipement, ProprieteObservee, Scenario } from './types';

function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Scenario invalide : ${message}`);
}
export function integer(value: number, label: string): void {
  check(Number.isSafeInteger(value) && value >= 0, label);
}
export function validEquipmentState(equipment: Equipement, state: EtatEquipement): boolean {
  const states: Record<Equipement['nature'], readonly EtatEquipement[]> = {
    porte: ['ouverte', 'bloquee'], passerelle: ['abaissee', 'relevee'],
    pompe: ['operationnelle', 'arretee', 'reparationExterieureRequise'],
    camera: ['disponible', 'maintenance'], alimentation: ['disponible', 'indisponible'],
    lecteurTransfert: ['disponible', 'indisponible'],
  };
  return states[equipment.nature].includes(state);
}
export function validateScenario(s: Scenario): void {
  integer(s.debut, 'debut entier'); integer(s.fin, 'fin entiere');
  check(s.fin >= s.debut, 'horizon');
  const collections = {
    sommet: s.graphe.sommets, arete: s.graphe.aretes, robot: s.robots, colis: s.colis,
    equipement: s.equipements, service: s.services, besoin: s.besoins, droit: s.droits,
    mission: s.missions, source: s.sources, evenement: s.evenements,
  };
  const ids = Object.fromEntries(Object.entries(collections).map(([kind, items]) => {
    const set = new Set<string>();
    for (const item of items) {
      check(typeof item.id === 'string' && item.id.length > 0 && !Object.hasOwn(Object.prototype, item.id), `identifiant ${kind}`);
      check(!set.has(item.id), `doublon ${kind} ${item.id}`); set.add(item.id);
    }
    return [kind, set];
  })) as Record<keyof typeof collections, Set<string>>;
  function ref(kind: keyof typeof collections, id: string): void { check(ids[kind].has(id), `${kind} inconnu ${id}`); }
  function target(value: Cible): void { ref(value.type, value.id); }
  function condition(c: ConditionEquipement): void {
    ref('equipement', c.equipement);
    check(s.equipements.some(e => e.id === c.equipement && validEquipmentState(e, c.etat)), 'etat incompatible');
  }
  function property(p: ProprieteObservee): void { if (p.type !== 'consequences') ref(p.type, p.id); }
  function interval(value: { debutInclus: number; finIncluse: number }): void {
    integer(value.debutInclus, 'debut validite'); integer(value.finIncluse, 'fin validite');
    check(value.debutInclus <= value.finIncluse, 'intervalle validite');
  }
  const occupied = new Set<string>();
  for (const v of s.graphe.sommets) {
    check(v.capaciteRobots === 1, 'capacite sommet');
    check(Object.values(v.position).every(Number.isFinite), 'position finie');
  }
  const edges = new Set<string>();
  for (const e of s.graphe.aretes) {
    e.extremites.forEach(id => ref('sommet', id));
    const key = JSON.stringify([...e.extremites].sort());
    check(e.extremites.length === 2 && e.extremites[0] !== e.extremites[1] && !edges.has(key), 'arete unique sans boucle');
    edges.add(key);
    check(e.duree === 1 && e.bidirectionnelle === true, 'arete bidirectionnelle de duree 1');
    integer(e.coutEnergie, 'cout energie');
    e.controlePar.forEach(id => {
      ref('equipement', id);
      check(s.equipements.some(item => item.id === id && ['porte', 'passerelle'].includes(item.nature)), 'controle de passage');
    });
  }
  for (const r of s.robots) {
    ref('sommet', r.sommet); ref('source', r.sourceLocale);
    if (r.mission !== null) ref('mission', r.mission);
    check(typeof r.canal === 'string' && r.canal.length > 0, 'canal du robot');
    check(!occupied.has(r.sommet) && r.capaciteColis === 2, 'occupation/capacite robot'); occupied.add(r.sommet);
    if (r.energie.type === 'limitee') integer(r.energie.restante, 'energie robot');
    check(s.sources.some(source => source.id === r.sourceLocale && source.support.type === 'robot' && source.support.id === r.id), 'source locale du robot');
  }
  for (const c of s.colis) {
    ref('sommet', c.destination); integer(c.disponibleDepuis, 'disponibilite colis');
    if (c.besoin !== null) ref('besoin', c.besoin);
    if (c.localisation.type === 'porte') {
      ref('robot', c.localisation.robot); check(c.disponibleDepuis <= s.debut, 'colis porte indisponible');
    } else {
      ref('sommet', c.localisation.sommet);
      if (c.localisation.type === 'recu') {
        integer(c.localisation.impulsion, 'date reception');
        check(c.localisation.impulsion <= s.debut && c.localisation.impulsion >= c.disponibleDepuis && c.localisation.sommet === c.destination, 'reception initiale');
      }
    }
  }
  for (const robot of s.robots) {
    const count = s.colis.filter(c => c.localisation.type === 'porte' && c.localisation.robot === robot.id).length;
    check(count <= 2 && !(count > 0 && robot.activite === 'observationFixe'), 'chargement initial');
  }
  for (const e of s.equipements) { target(e.cible); check(validEquipmentState(e, e.etat), 'etat equipement'); }
  s.services.forEach(service => service.dependances.forEach(condition));
  for (const n of s.besoins) {
    ref('service', n.service); integer(n.fenetre.debutExclu, 'fenetre debut'); integer(n.fenetre.finIncluse, 'fenetre fin');
    integer(n.revelation, 'revelation');
    check(n.fenetre.debutExclu < n.fenetre.finIncluse && n.fenetre.finIncluse <= s.fin && n.points === 100, 'fenetre/points');
    check([1, 2, 3, 4].includes(n.phase), 'phase');
    const c = n.condition;
    if (c.type === 'reception') { ref('colis', c.colis); ref('sommet', c.destination); }
    if (c.type === 'traversee') {
      ref('evenement', c.evenement); integer(c.horaire, 'horaire');
      check(s.evenements.some(e => e.id === c.evenement && e.type === 'traversee' && e.service === n.service && e.impulsion === c.horaire), 'traversee du besoin');
    }
    if (c.type === 'operationnel' || c.type === 'chargeInitiale') check(c.controle === n.fenetre.finIncluse, 'controle en cloture');
    if (c.type === 'chargeInitiale') condition({ equipement: c.equipement, etat: c.etatRequis });
  }
  const imported = new Set<string>();
  for (const item of s.besoinsImportes) {
    ref('besoin', item.besoin); integer(item.impulsion, 'preuve importee');
    const need = s.besoins.find(n => n.id === item.besoin)!;
    check(!imported.has(item.besoin) && item.impulsion <= s.debut && need.fenetre.finIncluse <= s.debut && item.impulsion > need.fenetre.debutExclu && item.impulsion <= need.fenetre.finIncluse, 'checkpoint besoin');
    imported.add(item.besoin);
  }
  for (const m of s.missions) {
    interval(m.duree); m.zone.forEach(id => ref('sommet', id)); m.acces.forEach(id => ref('droit', id));
    m.ressources.robots.forEach(id => ref('robot', id)); m.ressources.colis.forEach(id => ref('colis', id));
    m.ressources.equipements.forEach(id => ref('equipement', id));
    check(Object.values(m.objectif.priorites).every(v => Number.isFinite(v) && v >= 0), 'priorites');
    m.objectif.receptionsExigees.forEach(c => { ref('colis', c.colis); integer(c.avantOuA, 'contrainte reception'); });
    const visited = new Set([m.id]); let parent = m.parent;
    while (parent !== null) {
      ref('mission', parent); check(!visited.has(parent), 'cycle missions'); visited.add(parent);
      parent = s.missions.find(item => item.id === parent)!.parent;
    }
  }
  for (const d of s.droits) { ref(d.beneficiaire.type, d.beneficiaire.id); interval(d.validite); d.cibles.forEach(target); }
  const writes = new Set<string>();
  for (const e of s.evenements) {
    integer(e.impulsion, 'date evenement'); check(e.impulsion <= s.fin, 'evenement apres fin');
    if (e.type === 'equipement') {
      condition({ equipement: e.equipement, etat: e.etat });
      const key = JSON.stringify([e.impulsion, e.equipement]); check(!writes.has(key), 'ecritures simultanees'); writes.add(key);
    } else if (e.type === 'traversee') { ref('service', e.service); e.conditions.forEach(condition); }
    else ref('droit', e.droit);
  }
  for (const source of s.sources) {
    if (source.support.type === 'robot') ref('robot', source.support.id); else ref('sommet', source.support.sommet);
    source.equipementsRequis.forEach(condition);
    if (source.origineCommune !== null) ref('source', source.origineCommune);
    source.couverture.forEach(c => { property(c.propriete); c.depuis.forEach(id => ref('sommet', id)); });
  }
  for (const fact of s.observationsInitiales) {
    ref('source', fact.source); property(fact.propriete); integer(fact.capture.impulsion, 'capture'); integer(fact.reception, 'reception observation');
    check(fact.capture.impulsion <= fact.reception && fact.reception <= s.debut, 'observation future');
    const source = s.sources.find(item => item.id === fact.source)!;
    check(source.couverture.some(({ propriete: p }) => p.type === fact.propriete.type && p.champ === fact.propriete.champ &&
      (!('id' in p) || ('id' in fact.propriete && p.id === fact.propriete.id))), 'champ hors source');
  }
  const variantIds = new Set<string>(); const variantTargets = new Set<string>();
  for (const v of s.variantes ?? []) {
    check(!variantIds.has(v.id) && !variantTargets.has(v.equipement) && v.etats.length > 0, 'variante unique non vide');
    variantIds.add(v.id); variantTargets.add(v.equipement);
    v.etats.forEach(etat => condition({ equipement: v.equipement, etat }));
  }
  if (s.dernierPassage) {
    const d = s.dernierPassage; ref('colis', d.batterie); ref('equipement', d.pompe);
    check(s.colis.some(c => c.id === d.batterie && c.nature === 'batterie') && s.equipements.some(e => e.id === d.pompe && e.nature === 'pompe'), 'batterie/pompe');
    check(d.seuilStock === 8 && d.seuilPompe === 10, 'seuils Dernier passage');
  }
}
