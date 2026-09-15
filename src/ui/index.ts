import { createQuayView, type QuaySelection, type QuayView } from '../view';
import { equipmentReport, observationCaption, robotReports } from '../view/presentation';
import { knownFact } from '../session/beliefs';
import { cartesInitiales, type CartesMission, type Intention, type SessionFrame, type Situation } from '../session/types';
import type { SessionRequest, SessionResponse } from '../session/protocol';
import { layout } from './layout';
import { missionCards } from './mission-card';
import { parcels, places, placePurpose, provenance, robotName } from './labels';
import { createChallengeUi } from './challenge';
import { guideFor } from './guidance';

const freeze = <T>(value: T): T => { if (value && typeof value === 'object' && !Object.isFrozen(value)) { Object.freeze(value); Object.values(value).forEach(freeze); } return value; };

export function createGameUi(app: HTMLElement) {
  app.innerHTML = layout;
  const el = <T extends HTMLElement = HTMLElement>(id: string) => app.querySelector<T>(`#${id}`)!;
  const worker = new Worker(new URL('../session/simulation.worker.ts', import.meta.url), { type: 'module' });
  let view: QuayView | undefined; let frame: SessionFrame | undefined; let selection: QuaySelection | null = null;
  let robot: string | null = null; let zoom = 1; let cutaway = true; let busy = true; let focusExecute = false;
  let situation: Situation = 'atelier';
  let expanded = false;
  let guidedChallenge = false;
  const cardsByRobot = new Map<string, CartesMission>();
  const challengeUi = createChallengeUi(app, () => { selection = null; view?.setSelection(null); el('context').hidden = true; });
  const cards = () => cardsByRobot.get(robot ?? '') ?? cartesInitiales;
  function send(request: SessionRequest) {
    app.dataset.busy = 'true'; el<HTMLButtonElement>('guide-action').disabled = true;
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
    if (!frame || busy || el('quay').dataset.animating === 'true') return;
    selection = target; view?.setSelection(target);
    if (target.type === 'robot') {
      robot = target.id;
      const mission = frame.missions.find(m => m.intention.robot === robot);
      expanded = false;
      if (mission) cardsByRobot.set(robot, mission.intention.cartes);
    } else if (target.type === 'sommet' && robot) {
      const canDeliver = frame.catalogue.colis.some(c => c.destination === target.id);
      prepare(target.id, canDeliver ? 'livrer' : 'deplacer'); focusExecute = keyboard;
    }
    renderContext();
    renderGuide();
  }
  function positionContext() { /* The context has its own column; it never covers the quay. */ }
  function renderContext() {
    const panel = el('context'); if (!frame || !selection) { panel.hidden = true; return; }
    panel.hidden = false; panel.replaceChildren();
    const header = document.createElement('header'); header.className = 'context-header';
    const title = document.createElement('h2');
    title.textContent = selection.type === 'robot' ? robotName(selection.id) : selection.type === 'sommet' ? places[selection.id] ?? selection.id : selection.type === 'colis' ? parcels[selection.id] ?? selection.id : selection.id === 'porte' ? 'Porte A' : 'Passerelle';
    const close = button('×', () => { selection = null; view?.setSelection(null); panel.hidden = true; }); close.setAttribute('aria-label', 'Fermer la fiche'); header.append(title, close); panel.append(header);
    const purpose = document.createElement('p'); purpose.className = 'object-purpose';
    purpose.textContent = selection.type === 'sommet' ? placePurpose[selection.id] ?? '' : selection.type === 'robot' ? 'Ce robot transporte deux colis au maximum. Choisissez sa destination sur le quai ou ci-dessous.' : selection.type === 'equipement' && selection.id === 'passerelle' ? 'Abaissée : les robots traversent. Relevée : le ferry passe et les robots doivent attendre ou contourner.' : selection.type === 'equipement' ? placePurpose.A! : 'Ce colis doit être remis à son destinataire pour confirmer la livraison.';
    panel.append(purpose);
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
      panel.append(button('Envoyer R2 au poste d’observation', () => { robot = 'R2'; prepare('C', 'observer'); }));
    }
    if (robot && selection.type !== 'equipement') {
      const who = document.createElement('div'); who.className = 'mission-owner'; who.textContent = `${robotName(robot)}${mission ? ` → ${mission.intention.action === 'tournee' ? 'Tournée EVA' : places[mission.intention.destination] ?? mission.intention.destination}` : ''}`; panel.append(who);
      const cargo = knownFact(frame.view, { type: 'robot', id: robot, champ: 'chargement' })?.valeur;
      if (Array.isArray(cargo) && cargo.length) { const list = document.createElement('p'); list.className = 'cargo-list'; list.textContent = `▣ ${cargo.map(id => parcels[id] ?? id).join(' · ')}`; panel.append(list); }
      if (expanded) panel.append(missionCards(cards(), frame.niveau, updated => {
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
          summary.textContent = `${steps} tour${steps > 1 ? 's' : ''} prévu${steps > 1 ? 's' : ''} · Plan proposé selon les informations reçues. Une information ancienne peut encore se révéler fausse.`; panel.append(summary);
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
      if (!expanded) panel.append(button('Régler la mission', () => { expanded = true; renderContext(); }));
      else {
        panel.append(button('Confier une tournée à EVA', () => prepare('O', 'tournee')));
        if (selection.type === 'robot') panel.append(button('Rejoindre le dépôt', () => prepare('O', 'deplacer')));
      }
      if (selection.type === 'robot' && !expanded) {
        const destinations = document.createElement('div'); destinations.className = 'destination-choices';
        for (const id of ['Q', 'P', 'F', 'O']) destinations.append(button(places[id]!, () => select({ type: 'sommet', id })));
        panel.append(destinations);
      }
    }
    requestAnimationFrame(positionContext);
  }
  function renderGuide() {
    if (!frame) return;
    const guide = guideFor(frame, robot, guidedChallenge);
    el('guide-progress').textContent = guide.progress; el('guide-title').textContent = guide.title; el('guide-body').textContent = guide.body;
    const action = el<HTMLButtonElement>('guide-action'); action.hidden = !guide.action;
    if (guide.action) {
      const next = guide.action; action.textContent = next.label; action.disabled = busy || el('quay').dataset.animating === 'true';
      action.onclick = () => {
        if (next.objectives) { el('show-contract').click(); return; }
        if (next.execute) { el('advance').click(); return; }
        if (next.robot) select({ type: 'robot', id: next.robot });
        if (next.observer && next.destination) prepare(next.destination, 'observer');
        else if (next.destination) select({ type: 'sommet', id: next.destination });
      };
    }
    app.querySelectorAll('.suggested').forEach(e => e.classList.remove('suggested'));
    if (guide.highlight) {
      if (guide.highlight === 'advance') el('advance').classList.add('suggested');
      else app.querySelector(`[data-object="${guide.highlight}"]`)?.classList.add('suggested');
    }
  }
  function updateExecution() {
    if (!frame) return;
    const active = frame.missions.some(m => ['active', 'preparee'].includes(m.statut));
    const moving = el('quay').dataset.animating === 'true';
    const firstChoice = frame.catalogue.situation === 'atelier' && frame.view.impulsion === 0 && !active && !frame.preparation;
    el<HTMLButtonElement>('advance').disabled = busy || moving || frame.fin || firstChoice;
    el('advance').textContent = moving ? 'Déplacement…' : active ? 'Exécuter · 1 tour' : firstChoice ? 'Choisir une destination' : 'Attendre · 1 tour';
    el('execution-hint').textContent = frame.fin ? 'Cet essai est terminé.' : active ? 'Un tronçon par robot, puis retour en pause.' : firstChoice ? 'Choisissez un robot, puis une destination.' : 'Aucun trajet engagé. Attendre fait évoluer le monde.';
    renderGuide();
  }
  function renderFrame() {
    if (!frame) return;
    el('pulse').textContent = `Tour ${frame.view.impulsion}${frame.catalogue.situation === 'atelier' ? '' : ' / 16'}`;
    el('situation-title').textContent = frame.catalogue.situation === 'atelier' ? 'Apprendre à livrer' : frame.defi ? 'Défi · Tenir jusqu’au matin' : 'Entraînement · La porte inconnue';
    el('objective').textContent = frame.catalogue.situation === 'atelier' ? 'Votre but : remettre les colis aux bons destinataires.' : frame.defi ? 'Livrer à temps et garder les services en activité.' : 'Observez la porte, puis apportez la batterie à la pompe.';
    el('preparation-status').textContent = frame.fin ? 'POSTE TERMINÉ' : 'EN PRÉPARATION';
    el('cancel').hidden = !frame.preparation;
    el<HTMLButtonElement>('advance').disabled = busy || frame.fin;
    el('robot-cards').replaceChildren();
    for (const r of robotReports(frame.view)) {
      const card = button('', () => select({ type: 'robot', id: r.robot }), `robot-card ${r.age > 0 ? 'historical' : ''}`); card.setAttribute('aria-label', `Sélectionner ${robotName(r.robot)}`);
      const icon = document.createElement('div'); icon.className = 'robot-icon'; icon.textContent = '▣'; icon.setAttribute('aria-hidden', 'true');
      const name = document.createElement('strong'); name.textContent = robotName(r.robot);
      const location = document.createElement('span'); location.textContent = `${places[r.sommet] ?? r.sommet} · tour ${r.capture.impulsion}`;
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
      const detail = document.createElement('span'); detail.textContent = `${parcels[latest.c.id] ?? latest.c.id} · Reçu au tour ${latest.at} · ${provenance(latest.fact, frame.view.impulsion)}`;
      el('receipt').append(title, detail); el('receipt').dataset.colis = latest.c.id;
    }
    renderContext();
    challengeUi.render(frame);
    updateExecution();
    if (focusExecute) { el('advance').focus(); focusExecute = false; }
    app.dataset.ready = 'true'; app.dataset.niveau = String(frame.niveau);
  }
  worker.onmessage = (event: MessageEvent<SessionResponse>) => {
    busy = false; app.dataset.busy = 'false';
    if (event.data.type === 'error') { el('error').hidden = false; el('error').textContent = event.data.message; el<HTMLButtonElement>('advance').disabled = false; return; }
    const previous = frame; const previousTime = frame?.view.impulsion;
    frame = freeze(event.data); situation = frame.catalogue.situation;
    if (previous && frame.view.impulsion > previous.view.impulsion) {
      const moves = robotReports(frame.view).filter(r => r.age === 0).flatMap(r => { const before = robotReports(previous.view).find(b => b.robot === r.robot && b.age === 0); return before && before.sommet !== r.sommet ? [`${robotName(r.robot)} : ${places[before.sommet]} → ${places[r.sommet]}`] : []; });
      const refusals = frame.view.constats.filter(c => c.impulsion === frame!.view.impulsion);
      el('feedback-title').textContent = refusals.length ? 'Une commande a été refusée.' : moves.length ? moves.join(' · ') : `Tour ${frame.view.impulsion} exécuté.`;
      el('feedback-detail').textContent = refusals.length ? `${moves.length ? moves.join(' · ') + '. ' : ''}Le tour a été consommé malgré le refus. Sélectionnez la mission de ${refusals.map(c => robotName(c.robot)).join(', ')} pour la reprendre.` : moves.length ? 'Déplacement confirmé par les robots. La livraison est confirmée séparément par le destinataire.' : 'Aucun déplacement confirmé. Le temps a avancé et les événements programmés ont été résolus.';
    }
    if (frame.view.impulsion !== previousTime && frame.missions.some(m => m.intention.robot === robot && m.statut === 'terminee')) selection = null;
    try {
      if (view) view.update(frame.view); else view = createQuayView(el('quay'), frame.view);
      el('loading').hidden = true; renderFrame();
    } catch (error) { el('loading').hidden = true; el('error').hidden = false; el('error').textContent = 'WebGL 2 est nécessaire pour afficher le quai.'; console.error(error); }
  };
  worker.onerror = () => { busy = false; el('loading').hidden = true; el('error').hidden = false; el('error').textContent = 'Le poste n’a pas pu démarrer.'; };
  el('quay').addEventListener('quay-select', event => select((event as CustomEvent<QuaySelection>).detail));
  el('quay').addEventListener('quay-frame', positionContext);
  el('quay').addEventListener('quay-motion-end', updateExecution);
  el('frame-quai').onclick = () => { view?.setFraming('quai'); el('frame-quai').setAttribute('aria-pressed', 'true'); el('frame-coursive').setAttribute('aria-pressed', 'false'); };
  el('frame-coursive').onclick = () => { view?.setFraming('coursive'); el('frame-quai').setAttribute('aria-pressed', 'false'); el('frame-coursive').setAttribute('aria-pressed', 'true'); };
  el('zoom-in').onclick = () => { zoom = Math.min(1.7, zoom + 0.15); view?.setZoom(zoom); };
  el('zoom-out').onclick = () => { zoom = Math.max(0.75, zoom - 0.15); view?.setZoom(zoom); };
  el('cutaway').onclick = () => { cutaway = !cutaway; view?.setCutaway(cutaway); el('cutaway').setAttribute('aria-pressed', String(cutaway)); };
  el('advance').onclick = () => { if (!busy && !frame?.fin) send({ type: 'advance' }); };
  el('cancel').onclick = () => send({ type: 'cancel' });
  function restart(next: Situation) {
    guidedChallenge = false;
    for (const id of ['modes', 'help']) el<HTMLDialogElement>(id).close();
    challengeUi.reset(next === 'defi');
    selection = null; robot = null; expanded = false; focusExecute = false; cardsByRobot.clear(); view?.dispose(); view = undefined;
    zoom = 1; cutaway = true; el('frame-quai').setAttribute('aria-pressed', 'false'); el('frame-coursive').setAttribute('aria-pressed', 'true'); el('cutaway').setAttribute('aria-pressed', 'true');
    el('feedback-title').textContent = 'Le monde est en pause.'; el('feedback-detail').textContent = 'Préparez une mission avant d’exécuter un tour.';
    el('receipt').hidden = true; el('context').hidden = true; delete app.dataset.ready; send({ type: 'init', situation: next });
  }
  el('scenario-intro').onclick = () => restart('atelier'); el('scenario-challenge').onclick = () => restart('dernierPassage'); el('restart').onclick = () => restart(situation);
  el('scenario-defi').onclick = () => restart('defi');
  el('guide-defi').onclick = () => { guidedChallenge = true; challengeUi.training(); renderGuide(); };
  for (const [button, dialog, close] of [['show-modes', 'modes', 'close-modes'], ['show-help', 'help', 'close-help']] as const) {
    el(button).onclick = () => { selection = null; el('context').hidden = true; el<HTMLDialogElement>(dialog).showModal(); };
    el(close).onclick = () => el<HTMLDialogElement>(dialog).close();
  }
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
