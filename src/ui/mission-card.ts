import type { CartesMission } from '../session/types';

export function missionCards(cards: CartesMission, level: 1 | 2 | 3, change: (cards: CartesMission) => void, criticalLabel = 'Réception médicale exigée'): HTMLElement {
  const root = document.createElement('div'); root.className = 'mission-slots';
  function slot<K extends keyof CartesMission>(key: K, title: string, options: readonly (readonly [CartesMission[K], string, string])[]) {
    const fieldset = document.createElement('fieldset'); fieldset.dataset.slot = key;
    const legend = document.createElement('legend'); legend.textContent = title; fieldset.append(legend);
    for (const [value, text, icon] of options) {
      const button = document.createElement('button'); button.className = 'mission-choice'; button.type = 'button'; button.setAttribute('aria-pressed', String(cards[key] === value));
      const symbol = document.createElement('span'); symbol.setAttribute('aria-hidden', 'true'); symbol.textContent = icon;
      const label = document.createElement('span'); label.textContent = text; button.append(symbol, label);
      button.onclick = () => change({ ...cards, [key]: value }); fieldset.append(button);
    }
    root.append(fieldset);
  }
  slot('mesure', 'Ce qu’on compte', [['receptionDestination', 'Livrer chez le destinataire', '▣'], ['transfertOuReception', 'Accepter aussi un dépôt au transfert', '⇄']]);
  if (level >= 2) slot('priorite', 'Qui passe d’abord', [['toutes', 'Toutes les demandes', '≡'], ['medical', 'Infirmerie prioritaire', '✚']]);
  if (level >= 3) slot('limite', 'Ce qui doit être respecté', [['quai', 'Rester sur le quai bas', '⌑'], ['critique', criticalLabel.replace('t8', 'tour 8'), '✚'], ['expiration', 'Arrêter la mission après 4 tours', '◷']]);
  const explanation = document.createElement('p'); explanation.className = 'card-explanation'; explanation.textContent = 'Ces cartes guident les choix d’EVA, votre aide aux trajets. Accepter un dépôt au transfert peut raccourcir une tournée, mais ne prouve pas que le destinataire a reçu le colis.'; root.append(explanation);
  return root;
}
