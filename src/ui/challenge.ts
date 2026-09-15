import { cartePartage, meilleurRecord, type RecordDefi } from '../session/challenge';
import type { SessionFrame } from '../session/types';
import { parcels, places } from './labels';
import { knownFact } from '../session/beliefs';

const serviceNames: Record<string, string> = { pompage: 'Pompage', ferry: 'Ferry', fournitures: 'Fournitures de l’atelier' };
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
  let history = readHistory(); let tentative = 0; let recorded = false; let sharedText = ''; let training = false;
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
    training = false; get<HTMLButtonElement>('guide-defi').disabled = false; get('guide-defi').textContent = 'Guidage pas à pas · entraînement';
    contract.close(); result.close(); recorded = false; sharedText = ''; get<HTMLTextAreaElement>('share-card').value = '';
    get('final-score').textContent = ''; get('final-summary').textContent = ''; get('final-grid').replaceChildren();
    get('final-explanations').replaceChildren();
    get('copy-status').textContent = ''; get('challenge-tools').hidden = !challenge; get('show-result').hidden = true;
    if (challenge) { history = readHistory(history); tentative = ++history.tentatives; save(); }
  }
  function render(frame: SessionFrame) {
    const d = frame.defi; get('challenge-tools').hidden = !d;
    if (!d) return;
    get('challenge-clock').textContent = `Phase ${d.phase}/4 · ${d.heure}`;
    get('contract-period').textContent = `Période ${d.phase} sur 4 · tours ${(d.phase - 1) * 4 + 1} à ${d.phase * 4}. Vous êtes au tour ${frame.view.impulsion}.`;
    get('challenge-needs').replaceChildren();
    for (const need of d.besoins.filter(n => n.phase === d.phase)) {
      const item = document.createElement('li'); const c = need.condition;
      const condition = c.type === 'reception' ? `Livrez ${parcels[c.colis]?.toLowerCase() ?? 'le colis'} à ${places[c.destination]}, entre les tours ${need.fenetre.debutExclu + 1} et ${need.fenetre.finIncluse}.`
        : c.type === 'traversee' ? `Laissez passer le ferry au tour ${c.horaire}. La passerelle doit être levée ; son horaire est automatique.` : `La pompe doit fonctionner à la fin du tour ${c.controle}. ${c.type === 'chargeInitiale' ? 'Sa charge de départ suffit pour cette première période.' : 'Sa batterie doit avoir été livrée à temps.'}`;
      const heading = document.createElement('strong'); heading.textContent = serviceNames[need.service]!;
      const description = document.createElement('p'); description.textContent = condition + (need.operationnelALaCloture ? ' Ce service doit aussi fonctionner à la fin du tour 16.' : '');
      item.append(heading, description);
      get('challenge-needs').append(item);
    }
    get('show-result').hidden = !d.bilan;
    if (!d.bilan || recorded) return;
    recorded = true;
    const b = d.bilan;
    const next = { tentative, score: b.score, services: b.services.filter(s => s.operationnel).length };
    if (!training) { history.meilleur = meilleurRecord(history.meilleur, next); save(); }
    sharedText = cartePartage(d, history.meilleur, tentative, training);
    get<HTMLTextAreaElement>('share-card').value = sharedText;
    get('final-score').textContent = `${b.score} / ${b.maximum}`;
    get('final-summary').textContent = `Poste terminé · ${d.heure} · ${next.services}/3 services en activité${training ? ' · Entraînement guidé, hors record' : ''}`;
    get('final-grid').replaceChildren();
    for (const service of b.services) {
      const row = document.createElement('tr'); const name = document.createElement('th'); name.scope = 'row'; name.textContent = serviceNames[service.id]!; row.append(name);
      for (const phase of [1, 2, 3, 4]) {
        const cell = document.createElement('td'); const ok = b.besoins.find(n => n.service === service.id && n.phase === phase)?.resultat.etat === 'satisfait';
        cell.textContent = ok ? '■ 100' : '· 0'; cell.className = ok ? 'satisfied' : 'missed'; cell.setAttribute('aria-label', `Phase ${phase} : ${ok ? 'satisfait, 100 points' : 'non satisfait, 0 point'}`); row.append(cell);
      }
      const status = document.createElement('td'); status.textContent = service.operationnel ? 'En activité' : 'Indisponible'; row.append(status); get('final-grid').append(row);
    }
    for (const need of b.besoins.filter(n => n.resultat.etat !== 'satisfait')) {
      const contract = d.besoins.find(n => n.id === need.id)!; const condition = contract.condition;
      const line = document.createElement('li');
      const receipt = condition.type === 'reception' ? knownFact(frame.view, { type: 'colis', id: condition.colis, champ: 'localisation' })?.valeur : undefined;
      if (condition.type === 'reception' && receipt && typeof receipt === 'object' && 'type' in receipt && receipt.type === 'recu') {
        const withinWindow = receipt.impulsion > contract.fenetre.debutExclu && receipt.impulsion <= contract.fenetre.finIncluse;
        line.textContent = `${parcels[condition.colis]} reçue au tour ${receipt.impulsion}. ${withinWindow ? 'La réception respecte le délai, mais le service ne fonctionnait plus à la clôture.' : `Attendue entre les tours ${contract.fenetre.debutExclu + 1} et ${contract.fenetre.finIncluse} : hors délai.`} Aucun point pour cette demande.`;
      } else line.textContent = `${serviceNames[need.service]}, période ${need.phase} : ${condition.type === 'reception' ? 'aucune réception conforme dans le délai' : condition.type === 'traversee' ? 'traversée ou fonctionnement final non assuré' : 'pompe non opérationnelle au contrôle'}. Aucun point pour cette demande.`;
      get('final-explanations').append(line);
    }
    closeContext(); contract.close(); result.showModal(); get('close-result').focus();
  }
  return { reset, render, training() { if (recorded) return; training = true; get<HTMLButtonElement>('guide-defi').disabled = true; get('guide-defi').textContent = 'Guidage actif · hors record'; } };
}
