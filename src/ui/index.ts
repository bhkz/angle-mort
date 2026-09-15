import { createQuayView, type QuaySelection, type QuayView } from '../view';
import { equipmentReport, observationCaption, robotReports } from '../view/presentation';
import { knownFact } from '../session/beliefs';
import { cartesInitiales, type CartesMission, type Intention, type SessionFrame, type Situation } from '../session/types';
import type { SessionRequest, SessionResponse } from '../session/protocol';
import { layout } from './layout';
import { missionCards } from './mission-card';
import { parcels, places, provenance, robotName } from './labels';
import { createChallengeUi } from './challenge';

const freeze = <T>(value: T): T => { if (value && typeof value === 'object' && !Object.isFrozen(value)) { Object.freeze(value); Object.values(value).forEach(freeze); } return value; };

export function createGameUi(app: HTMLElement) {
  app.innerHTML = layout;
  const el = <T extends HTMLElement = HTMLElement>(id: string) => app.querySelector<T>(`#${id}`)!;
  const worker = new Worker(new URL('../session/simulation.worker.ts', import.meta.url), { type: 'module' });
  let view: QuayView | undefined; let frame: SessionFrame | undefined; let selection: QuaySelection | null = null;
  let robot: string | null = null; let zoom = 1; let cutaway = false; let busy = true; let focusExecute = false;
  let situation: Situation = 'atelier';
  let expanded = false;
  const cardsByRobot = new Map<string, CartesMission>();
  const challengeUi = createChallengeUi(app, () => { selection = null; view?.setSelection(null); el('context').hidden = true; });
  const cards = () => cardsByRobot.get(robot ?? '') ?? cartesInitiales;
  function send(request: SessionRequest) {
    busy = true; el<HTMLButtonElement>('advance').disabled = true; el('preparation-status').textContent = request.type === 'advance' ? 'EXÉCUTION' : 'PRÉPARATION';
    el('error').hidden = true; worker.postMessage(request);
  }
  function button(text: string, action: () => void, className = 'context-action') {
    const b = document.createElement('button'); b.type = 'button'; b.className = className; b.textContent = text; b.onclick = action; return b;
  }
  function prepare(destination: string, action: Intention['action'] = 'livrer') {
    if (!robot) return;
    send({ type: 'prepare', intention: { robot, destination, action, cartes: cards() } });
  }
  function select(target: QuaySelection, keyboard = false) {
    if (!frame || busy) return;
    selection = target; view?.setSelection(target);
    if (target.type === 'robot') {
      robot = target.id;
      const mission = frame.missions.find(m => m.intention.robot === robot);
      expanded = Boolean(mission && mission.statut !== 'terminee');
      if (mission) cardsByRobot.set(robot, mission.intention.cartes);
    } else if (target.type === 'sommet' && robot) {
      const canDeliver = frame.catalogue.colis.some(c => c.destination === target.id);
      prepare(target.id, canDeliver ? 'livrer' : 'deplacer'); focusExecute = keyboard;
    }
    renderContext();
  }
  function positionContext() {
    const panel = el('context'); if (!selection || panel.hidden) return;
    const anchor = view?.anchorFor(selection); if (!anchor) return;
    const width = app.clientWidth; const height = app.clientHeight; const panelWidth = panel.offsetWidth; const panelHeight = panel.offsetHeight;
    const clamp = (x: number, y: number) => ({ x: Math.max(12, Math.min(width - panelWidth - 12, x)), y: Math.max(118, Math.min(height - panelHeight - 138, y)) });
    const candidates = [clamp(anchor.x + 28, anchor.y - 45), clamp(anchor.x - panelWidth - 28, anchor.y - 45), clamp(anchor.x - panelWidth / 2, anchor.y - panelHeight - 35), clamp(anchor.x - panelWidth / 2, anchor.y + 35), clamp(width - panelWidth - 16, anchor.y - 45), clamp(16, anchor.y - 45)];
    const targets = [...app.querySelectorAll<HTMLElement>('.object-target:not([hidden])')].map(e => e.getBoundingClientRect());
    const overlap = (p: { x: number; y: number }) => targets.reduce((sum, r) => sum + Math.max(0, Math.min(p.x + panelWidth, r.right) - Math.max(p.x, r.left)) * Math.max(0, Math.min(p.y + panelHeight, r.bottom) - Math.max(p.y, r.top)), 0);
    candidates.sort((a, b) => overlap(a) - overlap(b));
    const point = width < 600 ? clamp(12, height - panelHeight - 138) : candidates[0]!;
    panel.style.left = `${point.x}px`; panel.style.top = `${point.y}px`;
  }
  function renderContext() {
    const panel = el('context'); if (!frame || !selection) { panel.hidden = true; return; }
    panel.hidden = false; panel.replaceChildren();
    const header = document.createElement('header'); header.className = 'context-header';
    const title = document.createElement('h2');
    title.textContent = selection.type === 'robot' ? robotName(selection.id) : selection.type === 'sommet' ? places[selection.id] ?? selection.id : selection.type === 'colis' ? parcels[selection.id] ?? selection.id : selection.id === 'porte' ? 'Porte A' : 'Passerelle';
    const close = button('×', () => { selection = null; view?.setSelection(null); panel.hidden = true; }); close.setAttribute('aria-label', 'Fermer la fiche'); header.append(title, close); panel.append(header);
    const property = selection.type === 'robot' ? { type: 'robot' as const, id: selection.id, champ: 'sommet' as const }
      : selection.type === 'colis' ? { type: 'colis' as const, id: selection.id, champ: 'localisation' as const }
        : { type: 'equipement' as const, id: selection.type === 'equipement' ? selection.id : selection.id === 'A' ? 'porte' : 'passerelle', champ: 'etat' as const };
    const fact = knownFact(frame.view, property);
    if (selection.type !== 'sommet' || selection.id === 'A') {
      const stamp = document.createElement('p'); stamp.className = `observation-stamp ${!fact ? 'unknown-stamp' : fact.capture.impulsion === frame.view.impulsion ? 'live-stamp' : 'dated-stamp'}`;
      stamp.textContent = provenance(fact, frame.view.impulsion); panel.append(stamp);
    }
    const mission = frame.missions.find(m => m.intention.robot === robot);
    if (selection.type === 'equipement' || (selection.type === 'sommet' && ['A', 'C', 'H'].includes(selection.id))) {
      const report = equipmentReport(frame.view, selection.id === 'passerelle' ? 'passerelle' : 'porte');
      const line = document.createElement('p'); line.className = 'context-status'; line.textContent = report.status === 'current' ? observationCaption(report) : `État inconnu · ${observationCaption(report)}`; panel.append(line);
      panel.append(button('Observer depuis C', () => { robot = 'R2'; prepare('C', 'observer'); }));
    }
    if (robot && selection.type !== 'equipement') {
      const who = document.createElement('div'); who.className = 'mission-owner'; who.textContent = `${robotName(robot)}${mission ? ` → ${mission.intention.action === 'tournee' ? 'Tournée EVA' : places[mission.intention.destination] ?? mission.intention.destination}` : ''}`; panel.append(who);
      const cargo = knownFact(frame.view, { type: 'robot', id: robot, champ: 'chargement' })?.valeur;
      if (Array.isArray(cargo) && cargo.length) { const list = document.createElement('p'); list.className = 'cargo-list'; list.textContent = `▣ ${cargo.map(id => parcels[id] ?? id).join(' · ')}`; panel.append(list); }
      if (expanded || mission) panel.append(missionCards(cards(), frame.niveau, updated => {
        cardsByRobot.set(robot!, updated);
        if (mission) send({ type: 'prepare', intention: { ...mission.intention, cartes: updated } });
        else renderContext();
      }, frame.catalogue.critique.label));
      if (mission) {
        const status = document.createElement('div'); status.className = `mission-state ${mission.statut}`;
        const statusNames = { preparee: 'Mission préparée', active: 'Mission engagée', suspendue: 'Mission suspendue', terminee: 'Mission terminée', refusee: 'Mission à reprendre' };
        status.textContent = statusNames[mission.statut]; panel.append(status);
        if (mission.resultat?.statut === 'plan') {
          const summary = document.createElement('p'); summary.className = 'plan-summary';
          const steps = mission.resultat.plan.etapes.filter(s => s.impulsion > frame!.view.impulsion).length;
          summary.textContent = `${steps} impulsion${steps > 1 ? 's' : ''} · ${mission.resultat.garantie === 'meilleurTrouve' ? 'Plan proposé' : 'Optimal selon les observations'}`; panel.append(summary);
        }
        if (mission.motif || mission.resultat?.statut === 'refuse' || mission.resultat?.statut === 'incomplet') {
          const refusal = document.createElement('p'); refusal.className = 'refusal'; refusal.setAttribute('role', 'status');
          refusal.textContent = mission.motif ?? (mission.resultat?.statut === 'refuse' ? mission.resultat.raisons.map(r => r.message).join(' · ') : mission.resultat?.statut === 'incomplet' ? mission.resultat.message : ''); panel.append(refusal);
        }
        const actions = document.createElement('div'); actions.className = 'context-actions';
        if (['active', 'preparee'].includes(mission.statut)) actions.append(button('Suspendre', () => send({ type: 'suspend', robot: robot! })));
        if (['suspendue', 'refusee'].includes(mission.statut)) actions.append(button('Reprendre', () => send({ type: 'resume', robot: robot! })));
        if (frame.preparation) actions.append(button('Annuler', () => send({ type: 'cancel' }))); panel.append(actions);
      }
      if (!expanded && !mission) panel.append(button('Composer une mission', () => { expanded = true; renderContext(); }));
      else {
        panel.append(button('Confier une tournée à EVA', () => prepare('O', 'tournee')));
        if (selection.type === 'robot') panel.append(button('Rejoindre le dépôt', () => prepare('O', 'deplacer')));
      }
    }
    requestAnimationFrame(positionContext);
  }
  function renderFrame() {
    if (!frame) return;
    el('pulse').textContent = `IMPULSION ${String(frame.view.impulsion).padStart(2, '0')}`;
    el('situation-title').textContent = frame.catalogue.situation === 'atelier' ? 'Livrer à l’atelier.' : frame.defi ? 'Tenir jusqu’au matin.' : 'Le dernier passage.';
    el('objective').textContent = frame.catalogue.situation === 'atelier' ? '▣ Pièce d’atelier' : frame.defi ? 'Pompage · Ferry · Fournitures' : '▣ Livrer la batterie · Entraînement';
    el('preparation-status').textContent = frame.fin ? 'POSTE TERMINÉ' : 'EN PRÉPARATION';
    el('cancel').hidden = !frame.preparation;
    el<HTMLButtonElement>('advance').disabled = busy || frame.fin;
    el('robot-cards').replaceChildren();
    for (const r of robotReports(frame.view)) {
      const card = button('', () => select({ type: 'robot', id: r.robot }), `robot-card ${r.age > 0 ? 'historical' : ''}`); card.setAttribute('aria-label', `Sélectionner ${robotName(r.robot)}`);
      const icon = document.createElement('div'); icon.className = 'robot-icon'; icon.textContent = '▣'; icon.setAttribute('aria-hidden', 'true');
      const name = document.createElement('strong'); name.textContent = robotName(r.robot);
      const location = document.createElement('span'); location.textContent = `${places[r.sommet] ?? r.sommet} · t${r.capture.impulsion}`;
      const text = document.createElement('div'); text.append(name, location); card.append(icon, text); el('robot-cards').append(card);
    }
    const receipts = frame.catalogue.colis.flatMap(c => {
      const fact = knownFact(frame!.view, { type: 'colis', id: c.id, champ: 'localisation' });
      return fact && typeof fact.valeur === 'object' && fact.valeur !== null && 'type' in fact.valeur && fact.valeur.type === 'recu' && fact.valeur.impulsion > frame!.catalogue.debut ? [{ c, fact, at: fact.valeur.impulsion }] : [];
    });
    const latest = receipts.sort((a, b) => b.at - a.at || b.fact.capture.impulsion - a.fact.capture.impulsion)[0];
    el('receipt').hidden = !latest;
    if (latest) {
      el('receipt').replaceChildren();
      const title = document.createElement('strong'); title.textContent = `✓ Livraison reçue · ${places[latest.c.destination] ?? latest.c.destination}`;
      const detail = document.createElement('span'); detail.textContent = `${parcels[latest.c.id] ?? latest.c.id} · Reçu t${latest.at} · ${provenance(latest.fact, frame.view.impulsion)}`;
      el('receipt').append(title, detail); el('receipt').dataset.colis = latest.c.id;
    }
    renderContext();
    challengeUi.render(frame);
    if (focusExecute) { el('advance').focus(); focusExecute = false; }
    app.dataset.ready = 'true'; app.dataset.niveau = String(frame.niveau);
  }
  worker.onmessage = (event: MessageEvent<SessionResponse>) => {
    busy = false;
    if (event.data.type === 'error') { el('error').hidden = false; el('error').textContent = event.data.message; el<HTMLButtonElement>('advance').disabled = false; return; }
    const previousTime = frame?.view.impulsion;
    frame = freeze(event.data); situation = frame.catalogue.situation;
    if (frame.view.impulsion !== previousTime && frame.missions.some(m => m.intention.robot === robot && m.statut === 'terminee')) selection = null;
    try {
      if (view) view.update(frame.view); else view = createQuayView(el('quay'), frame.view);
      el('loading').hidden = true; renderFrame();
    } catch (error) { el('loading').hidden = true; el('error').hidden = false; el('error').textContent = 'WebGL 2 est nécessaire pour afficher le quai.'; console.error(error); }
  };
  worker.onerror = () => { busy = false; el('loading').hidden = true; el('error').hidden = false; el('error').textContent = 'Le poste n’a pas pu démarrer.'; };
  el('quay').addEventListener('quay-select', event => select((event as CustomEvent<QuaySelection>).detail));
  el('quay').addEventListener('quay-frame', positionContext);
  el('frame-quai').onclick = () => { view?.setFraming('quai'); el('frame-quai').setAttribute('aria-pressed', 'true'); el('frame-coursive').setAttribute('aria-pressed', 'false'); };
  el('frame-coursive').onclick = () => { view?.setFraming('coursive'); el('frame-quai').setAttribute('aria-pressed', 'false'); el('frame-coursive').setAttribute('aria-pressed', 'true'); };
  el('zoom-in').onclick = () => { zoom = Math.min(1.7, zoom + 0.15); view?.setZoom(zoom); };
  el('zoom-out').onclick = () => { zoom = Math.max(0.75, zoom - 0.15); view?.setZoom(zoom); };
  el('cutaway').onclick = () => { cutaway = !cutaway; view?.setCutaway(cutaway); el('cutaway').setAttribute('aria-pressed', String(cutaway)); };
  el('advance').onclick = () => { if (!busy && !frame?.fin) send({ type: 'advance' }); };
  el('cancel').onclick = () => send({ type: 'cancel' });
  function restart(next: Situation) {
    challengeUi.reset(next === 'defi');
    selection = null; robot = null; expanded = false; focusExecute = false; cardsByRobot.clear(); view?.dispose(); view = undefined;
    zoom = 1; cutaway = false; el('frame-quai').setAttribute('aria-pressed', 'true'); el('frame-coursive').setAttribute('aria-pressed', 'false'); el('cutaway').setAttribute('aria-pressed', 'false');
    el('receipt').hidden = true; el('context').hidden = true; delete app.dataset.ready; send({ type: 'init', situation: next });
  }
  el('scenario-intro').onclick = () => restart('atelier'); el('scenario-challenge').onclick = () => restart('dernierPassage'); el('restart').onclick = () => restart(situation);
  el('scenario-defi').onclick = () => restart('defi');
  const keyboard = (event: KeyboardEvent) => {
    if (app.querySelector('dialog[open]')) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === '1' || event.key === '2') { event.preventDefault(); select({ type: 'robot', id: event.key === '1' ? 'R' : 'R2' }, true); }
    else if (event.key.toLowerCase() === 'a') { event.preventDefault(); select({ type: 'sommet', id: 'Q' }, true); }
    else if (event.key === 'Escape') { event.preventDefault(); selection = null; view?.setSelection(null); el('context').hidden = true; if (frame?.preparation) send({ type: 'cancel' }); }
  };
  app.ownerDocument.addEventListener('keydown', keyboard);
  send({ type: 'init', situation: 'atelier' });
  return { dispose() { app.ownerDocument.removeEventListener('keydown', keyboard); worker.terminate(); view?.dispose(); } };
}
