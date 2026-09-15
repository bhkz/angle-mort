import { cartePartage, meilleurRecord, type RecordDefi } from '../session/challenge';
import type { SessionFrame } from '../session/types';

const serviceNames: Record<string, string> = { pompage: 'Pompage · P', ferry: 'Ferry · A–P', fournitures: 'Fournitures · Q' };
const key = 'angle-mort:defi:041:p7.1:standard:ressources-v1:sans-aide';
interface LocalHistory { tentatives: number; meilleur: RecordDefi | null }
function readHistory(fallback: LocalHistory = { tentatives: 0, meilleur: null }): LocalHistory {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? 'null');
    if (value && typeof value === 'object' && 'tentatives' in value && Number.isSafeInteger(value.tentatives) && Number(value.tentatives) >= 0 && 'meilleur' in value) {
      const best = value.meilleur;
      if (best === null || (typeof best === 'object' && 'tentative' in best && 'score' in best && 'services' in best &&
        Number.isSafeInteger(best.tentative) && Number(best.tentative) > 0 && Number(best.tentative) <= Number(value.tentatives) &&
        Number.isInteger(best.score) && Number(best.score) >= 0 && Number(best.score) <= 1200 && Number(best.score) % 100 === 0 &&
        Number.isInteger(best.services) && Number(best.services) >= 0 && Number(best.services) <= 3)) return value as LocalHistory;
    }
  } catch { /* Storage is optional, and local results are explicitly declarative. */ }
  return fallback;
}

export function createChallengeUi(app: HTMLElement, closeContext: () => void) {
  const get = <T extends HTMLElement>(id: string) => app.querySelector<T>(`#${id}`)!;
  const contract = get<HTMLDialogElement>('challenge-contract'); const result = get<HTMLDialogElement>('challenge-result');
  let history = readHistory(); let tentative = 0; let recorded = false; let sharedText = '';
  const save = () => { try { localStorage.setItem(key, JSON.stringify(history)); } catch { /* Play continues without persistence. */ } };
  get<HTMLButtonElement>('show-contract').onclick = () => { closeContext(); contract.showModal(); };
  get<HTMLButtonElement>('close-contract').onclick = () => contract.close();
  get<HTMLButtonElement>('close-result').onclick = () => result.close();
  get<HTMLButtonElement>('show-result').onclick = () => { closeContext(); result.showModal(); };
  get<HTMLButtonElement>('copy-result').onclick = async () => {
    if (!sharedText) return;
    try { await navigator.clipboard.writeText(sharedText); get('copy-status').textContent = 'Carte copiée.'; }
    catch { get('copy-status').textContent = 'Copie manuelle : sélectionnez la carte ci-dessous.'; get<HTMLTextAreaElement>('share-card').focus(); get<HTMLTextAreaElement>('share-card').select(); }
  };
  function reset(challenge: boolean) {
    contract.close(); result.close(); recorded = false; sharedText = ''; get<HTMLTextAreaElement>('share-card').value = '';
    get('final-score').textContent = ''; get('final-summary').textContent = ''; get('final-grid').replaceChildren();
    get('copy-status').textContent = ''; get('challenge-tools').hidden = !challenge; get('show-result').hidden = true;
    if (challenge) { history = readHistory(history); tentative = ++history.tentatives; save(); }
  }
  function render(frame: SessionFrame) {
    const d = frame.defi; get('challenge-tools').hidden = !d;
    if (!d) return;
    get('challenge-clock').textContent = `Phase ${d.phase}/4 · ${d.heure}`;
    get('challenge-needs').replaceChildren();
    for (const need of d.besoins.filter(n => n.phase === d.phase)) {
      const item = document.createElement('li'); const c = need.condition;
      const condition = c.type === 'reception' ? `${c.colis === 'battery' ? 'Batterie' : need.id} reçue en ${c.destination}, t${need.fenetre.debutExclu + 1}–t${need.fenetre.finIncluse}`
        : c.type === 'traversee' ? `Traversée physique à t${c.horaire}` : `Pompe opérationnelle au contrôle t${c.controle}`;
      item.textContent = `${need.id} · ${serviceNames[need.service]} — ${condition}${need.operationnelALaCloture ? ' + service opérationnel à t16' : ''}`;
      get('challenge-needs').append(item);
    }
    get('show-result').hidden = !d.bilan;
    if (!d.bilan || recorded) return;
    recorded = true;
    const b = d.bilan;
    const next = { tentative, score: b.score, services: b.services.filter(s => s.operationnel).length };
    history.meilleur = meilleurRecord(history.meilleur, next); save();
    sharedText = cartePartage(d, history.meilleur, tentative);
    get<HTMLTextAreaElement>('share-card').value = sharedText;
    get('final-score').textContent = `${b.score} / ${b.maximum}`;
    get('final-summary').textContent = `Poste terminé · ${d.heure} · ${next.services}/3 services en activité`;
    get('final-grid').replaceChildren();
    for (const service of b.services) {
      const row = document.createElement('tr'); const name = document.createElement('th'); name.scope = 'row'; name.textContent = serviceNames[service.id]!; row.append(name);
      for (const phase of [1, 2, 3, 4]) {
        const cell = document.createElement('td'); const ok = b.besoins.find(n => n.service === service.id && n.phase === phase)?.resultat.etat === 'satisfait';
        cell.textContent = ok ? '■ 100' : '· 0'; cell.className = ok ? 'satisfied' : 'missed'; cell.setAttribute('aria-label', `Phase ${phase} : ${ok ? 'satisfait, 100 points' : 'non satisfait, 0 point'}`); row.append(cell);
      }
      const status = document.createElement('td'); status.textContent = service.operationnel ? 'En activité' : 'Indisponible'; row.append(status); get('final-grid').append(row);
    }
    closeContext(); contract.close(); result.showModal(); get('close-result').focus();
  }
  return { reset, render };
}
