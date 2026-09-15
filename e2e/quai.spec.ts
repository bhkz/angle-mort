import { test, expect, type Page } from '@playwright/test';
import { createSimulation, createPlayerCatalogue, projectPlayerView, type VueJoueur } from '../src/sim';
import { quai17 } from '../src/scenarios/quai17';
import { catalogueSession, jouable } from '../src/scenarios/jouable';
import { createSessionController } from '../src/session/controller';

async function ready(page: Page) {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('#app')).toHaveAttribute('data-ready', 'true');
  await page.locator('#show-modes').click(); await page.locator('#scenario-challenge').click();
  await expect(page.locator('#quay')).toHaveAttribute('data-impulsion', '4');
  expect(errors).toEqual([]);
}
async function advance(page: Page, pulse: number) {
  await page.locator('#advance').click();
  await expect(page.locator('#quay')).toHaveAttribute('data-impulsion', String(pulse));
}
async function withPlayerPacket(page: Page, view: VueJoueur) {
  const s = jouable('dernierPassage');
  const frame = createSessionController(createSimulation(s, 17), catalogueSession(s, 'dernierPassage')).frame();
  await page.addInitScript(packet => {
    class PlayerPacketWorker {
      onmessage: ((event: MessageEvent) => void) | null = null;
      postMessage() { queueMicrotask(() => this.onmessage?.(new MessageEvent('message', { data: { type: 'view', ...packet } }))); }
      terminate() { /* No simulation capability exists in this presentation fixture. */ }
    }
    window.Worker = PlayerPacketWorker as unknown as typeof Worker;
  }, { ...frame, view });
}

test('capture demandée : porte bloquée réelle, sans C, état affiché inconnu à t4', async ({ page }) => {
  await ready(page);
  await expect(page.getByTestId('door-label')).toHaveAttribute('data-state', 'inconnue');
  await expect(page.getByTestId('door-label')).toContainText('PORTE · ÉTAT INCONNU');
  await expect(page.getByTestId('door-label')).toContainText('ouverte · tour 2');
  await expect(page.locator('body')).not.toContainText('PORTE BLOQUÉE');
  await expect(page.locator('#quay')).toHaveAttribute('data-observed-robots', 'R2@H:t4,R@T:t4');
  await page.screenshot({ path: 'artifacts/quai17-t4.png' });
});

test('non-fuite visuelle : pixels et texte identiques pour les deux mondes, même après coupe, zoom et cadrage', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const a = await context.newPage(); const b = await context.newPage();
  // Two genuine simulations run on the author/test side. Only their player packets reach the browser.
  for (const [page, open] of [[a, true], [b, false]] as const) {
    const view = createSimulation(quai17(open), 17).getPlayerView();
    await withPlayerPacket(page, view);
    await ready(page);
  }
  for (const page of [a, b]) await page.locator('.camera-controls summary').click();
  for (const action of [null, 'Masquer le hangar', 'Vue haute', 'Zoomer', 'Dézoomer', 'Vue du quai']) {
    if (action) for (const page of [a, b]) await page.getByRole('button', { name: action, exact: true }).click();
    expect(await a.locator('#app').innerText()).toBe(await b.locator('#app').innerText());
    const pixels = await a.locator('canvas').screenshot();
    expect(pixels.equals(await b.locator('canvas').screenshot())).toBe(true);
    for (const page of [a, b]) {
      await expect(page.getByTestId('door-label')).toHaveAttribute('data-state', 'inconnue');
      await expect(page.locator('#quay')).toHaveAttribute('data-impulsion', '4');
    }
  }
  await context.close();
});

test('les silhouettes datées gardent leur position et leur rendu se distingue du présent, même sans murs', async ({ browser }) => {
  const s = quai17(false); const simulation = createSimulation(s, 17);
  const state = simulation.getAuthorState();
  const received = { impulsion: 5, observations: state.observations, constats: [], franchissementsObserves: [] };
  const dated = projectPlayerView(createPlayerCatalogue(s), received);
  const fresh = projectPlayerView(createPlayerCatalogue(s), { ...received, observations: state.observations.map(f => ({ ...f, capture: { impulsion: 5, etape: 'observations' }, reception: 5 })) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const a = await context.newPage(); const b = await context.newPage();
  for (const [page, packet] of [[a, dated], [b, fresh]] as const) {
    await withPlayerPacket(page, packet); await page.goto('/'); await expect(page.locator('#app')).toHaveAttribute('data-ready', 'true');
    await page.locator('.camera-controls summary').click();
  }
  await expect(a.locator('#quay')).toHaveAttribute('data-observed-robots', 'R2@H:t4,R@T:t4');
  await expect(a.locator('.robot-card.historical')).toHaveCount(2);
  await expect(b.locator('.robot-card.historical')).toHaveCount(0);
  expect((await a.locator('canvas').screenshot()).equals(await b.locator('canvas').screenshot())).toBe(false);
  await context.close();
});

test('seule l’observation en C révèle la porte à t5 ; les horaires de passerelle viennent du moteur', async ({ page }) => {
  await ready(page);
  await page.locator('[data-object="sommet:C"]').click();
  await page.getByRole('button', { name: 'Envoyer R2 au poste d’observation' }).click();
  await expect(page.getByTestId('door-label')).toHaveAttribute('data-state', 'inconnue');
  await advance(page, 5);
  await expect(page.getByTestId('door-label')).toHaveAttribute('data-state', 'bloquee');
  await expect(page.getByTestId('bridge-label')).toHaveAttribute('data-state', 'relevee');
  for (let t = 6; t <= 16; t++) {
    await advance(page, t);
    await expect(page.getByTestId('bridge-label')).toHaveAttribute('data-state', [5, 6, 9, 10, 13, 14].includes(t) ? 'relevee' : 'abaissee');
  }
});

test('sans C la porte reste inconnue jusqu’au rapport de fin t7', async ({ page }) => {
  await ready(page);
  for (const t of [5, 6]) { await advance(page, t); await expect(page.getByTestId('door-label')).toHaveAttribute('data-state', 'inconnue'); }
  await advance(page, 7); await expect(page.getByTestId('door-label')).toHaveAttribute('data-state', 'bloquee');
});

test('résolution plafonnée, écran étroit et aucune avance du temps par les contrôles de caméra', async ({ page }) => {
  await page.setViewportSize({ width: 2400, height: 1400 }); await ready(page);
  const size = await page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => ({ width: canvas.width, height: canvas.height }));
  expect(size.width).toBeLessThanOrEqual(1600); expect(size.height).toBeLessThanOrEqual(1000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.camera-controls summary').click();
  await page.getByRole('button', { name: 'Vue haute' }).click();
  await page.getByRole('button', { name: 'Zoomer', exact: true }).click();
  await expect(page.locator('#quay')).toHaveAttribute('data-impulsion', '4');
  await expect(page.locator('#advance')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
