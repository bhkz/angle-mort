import './style.css';
import { createQuayView, type QuayView } from './view';
import { equipmentReport, observationCaption, robotReports } from './view/presentation';
import type { SessionRequest, SessionResponse } from './session/protocol';
import type { VueJoueur } from './sim/types';

const app = document.querySelector<HTMLElement>('#app')!;
app.innerHTML = `
  <section id="quay" aria-label="Scène du Quai 17"></section>
  <header class="masthead">
    <div class="eyebrow"><span class="status-dot"></span> ANGLE MORT <span class="divider">/</span> QUAI 17</div>
    <h1>Le dernier passage<span>.</span></h1>
    <p class="objective"><span aria-hidden="true">▣</span> Livrer la batterie</p>
  </header>
  <nav class="camera-controls" aria-label="Caméra de présentation">
    <div class="segmented"><button id="frame-quai" aria-pressed="true">Vue du quai</button><button id="frame-coursive" aria-pressed="false">Vue haute</button></div>
    <div class="view-tools"><button id="zoom-out" aria-label="Dézoomer">−</button><span>ZOOM</span><button id="zoom-in" aria-label="Zoomer">+</button><button id="cutaway" aria-pressed="false">Coupe du hangar</button></div>
  </nav>
  <aside class="information" aria-label="Informations reçues">
    <div class="section-kicker">RÉSEAU D’OBSERVATION</div>
    <div id="camera-status" class="camera-status"></div>
    <p id="camera-detail"></p>
    <div class="evidence"><span class="evidence-icon">?</span><div><strong id="door-status">État actuel inconnu</strong><p id="door-history"></p></div></div>
    <button id="observe">Observer depuis C <span aria-hidden="true">↗</span></button>
    <p class="hint" id="observation-hint">R2 peut rejoindre la coursive à la prochaine impulsion.</p>
  </aside>
  <footer class="bottom-bar">
    <section class="robots" aria-label="Rapports des robots"><div class="section-kicker">VOS ROBOTS</div><div id="robot-cards" class="robot-cards"></div></section>
    <section class="legend" aria-label="Légende des observations"><span><i class="live"></i> Observé maintenant</span><span><i class="dated"></i> Dernière observation datée</span><span><i class="unknown">?</i> État inconnu</span></section>
    <section class="pulse-controls"><div class="pulse-status"><span class="paused">EN PRÉPARATION</span><span id="pulse">IMPULSION 04</span></div><button id="advance">Exécuter <span aria-hidden="true">▶</span></button><p>Une impulsion · puis retour en préparation</p></section>
  </footer>
  <div id="loading" role="status">Ouverture du Quai 17…</div>
  <div id="error" role="alert" hidden></div>
`;
const element = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const worker = new Worker(new URL('./session/simulation.worker.ts', import.meta.url), { type: 'module' });
let view: QuayView | undefined; let zoom = 1; let cutaway = false; let pendingObserver = false;
const send = (request: SessionRequest) => worker.postMessage(request);
const frozen = <T>(value: T): T => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) { Object.freeze(value); Object.values(value).forEach(frozen); }
  return value;
};

function updateInterface(player: VueJoueur) {
  element('pulse').textContent = `IMPULSION ${String(player.impulsion).padStart(2, '0')}`;
  const camera = equipmentReport(player, 'camera'); const door = equipmentReport(player, 'porte');
  element('camera-status').textContent = camera.status === 'current' ? camera.value === 'maintenance' ? '×  Caméra en maintenance' : '●  Caméra disponible' : '?  Caméra · état inconnu';
  element('camera-status').classList.toggle('available', camera.status === 'current' && camera.value === 'disponible');
  element('camera-detail').textContent = camera.status === 'current' && camera.value === 'maintenance' ? 'Aucune nouvelle image de la porte.' : 'Les rapports reçus sont représentés sur le quai.';
  element('door-status').textContent = door.status === 'current' ? door.value === 'bloquee' ? 'Porte observée bloquée' : 'Porte observée ouverte' : 'État actuel inconnu';
  element('door-history').textContent = observationCaption(door);
  element('robot-cards').replaceChildren();
  for (const robot of robotReports(player)) {
    const card = document.createElement('article'); card.className = `robot-card ${robot.age > 0 ? 'historical' : ''}`;
    const icon = document.createElement('div'); icon.className = 'robot-icon'; icon.setAttribute('aria-hidden', 'true'); icon.textContent = '▣';
    const name = document.createElement('strong'); name.textContent = robot.robot === 'R' ? 'R1' : robot.robot;
    const location = document.createElement('span'); location.textContent = `${robot.sommet} · ${robot.age === 0 ? 'observé maintenant' : `observation t${robot.capture.impulsion}`}`;
    const text = document.createElement('div'); text.append(name, location); card.append(icon, text); element('robot-cards').append(card);
  }
  const atC = robotReports(player).some(r => r.robot === 'R2' && r.sommet === 'C' && r.age === 0);
  element<HTMLButtonElement>('observe').disabled = atC;
  element('observe').textContent = atC ? 'R2 en observation · C' : 'Observer depuis C ↗';
  element('observation-hint').textContent = atC ? 'Rapport indépendant depuis la coursive.' : 'R2 peut rejoindre la coursive à la prochaine impulsion.';
  pendingObserver = false;
}
worker.onmessage = (event: MessageEvent<SessionResponse>) => {
  element<HTMLButtonElement>('advance').disabled = false;
  if (event.data.type === 'error') { element('error').hidden = false; element('error').textContent = event.data.message; return; }
  const player = frozen(event.data.view);
  try {
    if (view) view.update(player); else view = createQuayView(element('quay'), player);
    updateInterface(player); element('loading').hidden = true;
    app.dataset.ready = 'true';
  } catch (error) {
    element('loading').hidden = true; element('error').hidden = false;
    element('error').textContent = 'La scène 3D nécessite un navigateur avec WebGL 2 activé.';
    console.error(error);
  }
};
worker.onerror = () => { element('error').hidden = false; element('error').textContent = 'Le moteur n’a pas pu démarrer.'; };
element('frame-quai').onclick = () => { view?.setFraming('quai'); element('frame-quai').setAttribute('aria-pressed', 'true'); element('frame-coursive').setAttribute('aria-pressed', 'false'); };
element('frame-coursive').onclick = () => { view?.setFraming('coursive'); element('frame-quai').setAttribute('aria-pressed', 'false'); element('frame-coursive').setAttribute('aria-pressed', 'true'); };
element('zoom-in').onclick = () => { zoom = Math.min(1.7, zoom + 0.15); view?.setZoom(zoom); };
element('zoom-out').onclick = () => { zoom = Math.max(0.75, zoom - 0.15); view?.setZoom(zoom); };
element('cutaway').onclick = () => { cutaway = !cutaway; view?.setCutaway(cutaway); element('cutaway').setAttribute('aria-pressed', String(cutaway)); };
element('observe').onclick = () => { pendingObserver = !pendingObserver; element('observe').textContent = pendingObserver ? 'R2 → C · ordre préparé' : 'Observer depuis C ↗'; element('observation-hint').textContent = pendingObserver ? 'Exécuter pour rejoindre C et recevoir son observation.' : 'R2 peut rejoindre la coursive à la prochaine impulsion.'; };
element('advance').onclick = () => { element<HTMLButtonElement>('advance').disabled = true; element('error').hidden = true; send({ type: 'advance', observer: pendingObserver }); };
// The worker owns the scenario choice. No hidden variant flag enters the UI, including its URL.
send({ type: 'init' });
if (import.meta.hot) import.meta.hot.dispose(() => { worker.terminate(); view?.dispose(); });
