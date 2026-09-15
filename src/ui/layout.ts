export const layout = `
  <section id="quay" aria-label="Scène du Quai 17"></section>
  <header class="masthead">
    <div class="eyebrow"><span class="status-dot"></span> ANGLE MORT <span class="divider">/</span> QUAI 17</div>
    <h1 id="situation-title">Livrer à l’atelier<span>.</span></h1>
    <p class="objective" id="objective">▣ Pièce d’atelier</p>
  </header>
  <nav class="camera-controls" aria-label="Caméra de présentation">
    <div class="segmented"><button id="frame-quai" aria-pressed="true">Vue du quai</button><button id="frame-coursive" aria-pressed="false">Vue haute</button></div>
    <div class="view-tools"><button id="zoom-out" aria-label="Dézoomer">−</button><button id="zoom-in" aria-label="Zoomer">+</button><button id="cutaway" aria-pressed="false">Coupe du hangar</button></div>
    <div class="scenario-tools"><button id="scenario-intro">Atelier</button><button id="scenario-challenge">Dernier passage</button><button id="restart" aria-label="Recommencer">↻</button></div>
    <div class="scenario-tools"><button id="scenario-defi">Défi · 16 impulsions</button></div>
  </nav>
  <aside id="context" class="context-panel" aria-label="Fiche contextuelle" hidden></aside>
  <section id="receipt" class="receipt" role="status" hidden></section>
  <section id="challenge-tools" hidden><span id="challenge-clock"></span><button id="show-contract">Contrat du défi</button><button id="show-result" hidden>Bilan final</button></section>
  <dialog id="challenge-contract" aria-labelledby="contract-title">
    <header><h2 id="contract-title">Situation 041 · Standard</h2><button id="close-contract" aria-label="Fermer le contrat">×</button></header>
    <p>22 h–06 h · 16 impulsions · 4 phases · 3 services · 12 besoins uniques.</p>
    <p>100 points par besoin, une seule fois. Maximum 1 200. Fenêtres : (0,4], (4,8], (8,12], (12,16]. Une livraison anticipée ou tardive ne satisfait pas une autre phase.</p>
    <p>Les trois derniers besoins exigent aussi un service opérationnel à t16 : alimentation, installation et accès fonctionnels. Réparer, reclasser ou répéter un reçu ne rapporte aucun point.</p>
    <p>Passerelle levée à t1–2, t5–6, t9–10, t13–14. Traversées à t2, t6, t10, t14. P3/P4 : contrôles à t12/t16. Q3/Q4 : casier P à t9/t13. Batterie à t8 au plus pour conserver le stock, t10 pour conserver la pompe.</p>
    <p>Chaque phase révèle ses demandes. Bilan après t16, même avec des pertes. Recommencer crée une tentative indépendante, sans cumul. Dernier passage : entraînement depuis t4, sans record.</p>
    <h3>Besoins de la phase</h3><ul id="challenge-needs"></ul>
  </dialog>
  <dialog id="challenge-result" aria-labelledby="result-title">
    <header><h2 id="result-title">Fin du poste</h2><button id="close-result" aria-label="Fermer le bilan">×</button></header>
    <strong id="final-score"></strong><p id="final-summary"></p>
    <div class="result-table"><table><thead><tr><th>Service</th><th>1</th><th>2</th><th>3</th><th>4</th><th>À t16</th></tr></thead><tbody id="final-grid"></tbody></table></div>
    <label for="share-card">Carte de partage · résultat local déclaratif</label><textarea id="share-card" readonly rows="9"></textarea>
    <button id="copy-result">Copier la carte</button><p id="copy-status" role="status"></p>
  </dialog>
  <footer class="bottom-bar">
    <section class="robots" aria-label="Rapports des robots"><div class="section-kicker">VOS ROBOTS</div><div id="robot-cards" class="robot-cards"></div></section>
    <section class="legend" aria-label="Légende des observations"><span><i class="live"></i> Observé maintenant</span><span><i class="dated"></i> Dernière observation datée</span><span><i class="unknown">?</i> État inconnu</span></section>
    <section class="pulse-controls"><div class="pulse-status"><span id="preparation-status" class="paused">EN PRÉPARATION</span><span id="pulse">IMPULSION 00</span></div><div class="execution-row"><button id="cancel" aria-label="Annuler la préparation" hidden>↶</button><button id="advance">Exécuter <span aria-hidden="true">▶</span></button></div></section>
  </footer>
  <div id="loading" role="status">Quai 17…</div>
  <div id="error" role="alert" hidden></div>
`;
