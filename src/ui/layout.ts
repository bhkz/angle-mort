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
  </nav>
  <aside id="context" class="context-panel" aria-label="Fiche contextuelle" hidden></aside>
  <section id="receipt" class="receipt" role="status" hidden></section>
  <footer class="bottom-bar">
    <section class="robots" aria-label="Rapports des robots"><div class="section-kicker">VOS ROBOTS</div><div id="robot-cards" class="robot-cards"></div></section>
    <section class="legend" aria-label="Légende des observations"><span><i class="live"></i> Observé maintenant</span><span><i class="dated"></i> Dernière observation datée</span><span><i class="unknown">?</i> État inconnu</span></section>
    <section class="pulse-controls"><div class="pulse-status"><span id="preparation-status" class="paused">EN PRÉPARATION</span><span id="pulse">IMPULSION 00</span></div><div class="execution-row"><button id="cancel" aria-label="Annuler la préparation" hidden>↶</button><button id="advance">Exécuter <span aria-hidden="true">▶</span></button></div></section>
  </footer>
  <div id="loading" role="status">Quai 17…</div>
  <div id="error" role="alert" hidden></div>
`;
