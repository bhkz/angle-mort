import { test, expect, type Page } from '@playwright/test';

async function started(page: Page) {
  await page.goto('/'); await expect(page.locator('#app')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('#quay')).toHaveAttribute('data-impulsion', '0');
}
async function execute(page: Page, time: number) {
  await expect(page.locator('#advance')).toBeEnabled(); await page.locator('#advance').click();
  await expect(page.locator('#quay')).toHaveAttribute('data-impulsion', String(time));
  await expect(page.locator('#quay')).toHaveAttribute('data-animating', 'false');
}

for (const mode of ['souris', 'tactile', 'clavier'] as const) test(`robot → atelier → exécuter en moins de 30 s : ${mode}`, async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: mode === 'tactile', viewport: mode === 'tactile' ? { width: 390, height: 844 } : { width: 1440, height: 1000 } });
  const page = await context.newPage(); const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  const start = performance.now(); await started(page);
  await expect(page.locator('#context')).toBeHidden();
  await expect(page.locator('#guide')).toContainText('Votre premier but');
  await expect(page.locator('#advance')).toBeDisabled();
  if (mode === 'clavier') await page.keyboard.press('1');
  else if (mode === 'tactile') await page.locator('[data-object="robot:R"]').tap();
  else await page.locator('[data-object="robot:R"]').click();
  await expect(page.getByRole('complementary', { name: 'Fiche contextuelle' })).toHaveCount(1);
  if (mode === 'souris') await page.screenshot({ path: 'artifacts/sequence-01-robot.png' });
  if (mode === 'clavier') await page.keyboard.press('a');
  else if (mode === 'tactile') await page.locator('[data-object="sommet:Q"]').tap();
  else await page.locator('[data-object="sommet:Q"]').click();
  await expect(page.locator('#cancel')).toBeVisible(); await expect(page.locator('#advance')).toBeEnabled();
  await expect(page.locator('#quay')).toHaveAttribute('data-impulsion', '0');
  await expect(page.locator('#guide')).toContainText('Trajet préparé');
  await expect(page.locator('[data-slot="mesure"]')).toHaveCount(0);
  await expect(page.locator('[data-slot="priorite"]')).toHaveCount(0);
  if (mode === 'souris') await page.screenshot({ path: 'artifacts/sequence-02-preparation.png' });
  if (mode === 'clavier') { await expect(page.locator('#advance')).toBeFocused(); await page.keyboard.press('Enter'); }
  else if (mode === 'tactile') await page.locator('#advance').tap();
  else await page.locator('#advance').click();
  await expect(page.locator('#receipt')).toHaveAttribute('data-colis', 'piece');
  await expect(page.locator('#receipt')).toContainText('Livraison reçue · Atelier');
  await expect(page.locator('#quay')).toHaveAttribute('data-impulsion', '1');
  await expect(page.locator('#quay')).toHaveAttribute('data-animating', 'false');
  const elapsed = performance.now() - start;
  expect(elapsed).toBeLessThan(30_000); expect(errors).toEqual([]);
  console.log(`${mode} : livraison physique reçue en ${(elapsed / 1000).toFixed(2)} s, 3 gestes, 1 impulsion`);
  if (mode === 'souris') await page.screenshot({ path: 'artifacts/sequence-03-livraison.png' });
  if (mode === 'tactile') {
    await page.screenshot({ path: 'artifacts/sequence-tactile.png' });
    const smallTargets = await page.locator('button:visible').evaluateAll(buttons => buttons.filter(b => { const r = b.getBoundingClientRect(); return r.width < 44 || r.height < 44; }).map(b => b.textContent));
    expect(smallTargets).toEqual([]);
  }
  await context.close();
});

test('annuler, composer progressivement, et conserver les missions entre impulsions', async ({ page }) => {
  await started(page);
  await page.locator('[data-object="robot:R"]').click(); await page.getByRole('button', { name: 'Régler la mission' }).click();
  await expect(page.locator('[data-slot="mesure"]')).toBeVisible(); await expect(page.locator('[data-slot="priorite"]')).toHaveCount(0);
  await page.locator('[data-object="sommet:Q"]').click(); await expect(page.locator('#cancel')).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.locator('#cancel')).toBeHidden(); await expect(page.locator('#context')).toBeHidden();
  await expect(page.locator('#quay')).toHaveAttribute('data-impulsion', '0');
  await page.locator('[data-object="robot:R"]').click(); await page.locator('[data-object="sommet:Q"]').click(); await execute(page, 1);
  await page.locator('[data-object="robot:R"]').click(); await page.getByRole('button', { name: 'Régler la mission' }).click(); await expect(page.locator('[data-slot="priorite"]')).toBeVisible();
  await expect(page.locator('[data-slot="limite"]')).toHaveCount(0);
  await page.locator('[data-object="sommet:F"]').click(); await execute(page, 2); await execute(page, 3);
  await expect(page.locator('#receipt')).toHaveAttribute('data-colis', 'M');
  await page.locator('[data-object="robot:R"]').click(); await page.getByRole('button', { name: 'Régler la mission' }).click(); await expect(page.locator('[data-slot="limite"]')).toBeVisible();
  await page.getByRole('button', { name: 'Rejoindre le dépôt' }).click(); await execute(page, 4);
  const first = await page.locator('#quay').getAttribute('data-observed-robots');
  await page.locator('#context').getByRole('button', { name: 'Suspendre' }).click(); await execute(page, 5);
  const paused = await page.locator('#quay').getAttribute('data-observed-robots');
  expect(paused?.replaceAll('t5', 't4')).toBe(first);
  await page.locator('#context').getByRole('button', { name: 'Reprendre' }).click(); await execute(page, 6);
  expect((await page.locator('#quay').getAttribute('data-observed-robots'))?.replaceAll('t6', 't5')).not.toBe(paused);
});
