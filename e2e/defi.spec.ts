import { expect, test } from '@playwright/test';

test('défi t0–t16 : bilan final uniquement, copie volontaire, record indépendant de l’entraînement', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (text: string) => {
      const w = window as unknown as { copies: string[] }; w.copies ??= []; w.copies.push(text);
    } } });
  });
  await page.goto('/'); await expect(page.locator('#app')).toHaveAttribute('data-ready', 'true');
  await page.locator('#show-modes').click(); await page.locator('#scenario-defi').click(); await expect(page.locator('#challenge-clock')).toHaveText('Phase 1/4 · 22 h 00');
  await page.locator('#show-contract').click(); await expect(page.locator('#challenge-needs li')).toHaveCount(3);
  await expect(page.locator('#challenge-contract')).toContainText('chaque service doit encore fonctionner à la fin du tour 16');
  await page.locator('#close-contract').click();
  for (let t = 1; t <= 16; t++) {
    await expect(page.locator('#challenge-result')).not.toBeVisible();
    await expect(page.locator('#show-result')).toBeHidden();
    expect(await page.locator('#final-score').textContent()).toBe('');
    await page.locator('#advance').click(); await expect(page.locator('#quay')).toHaveAttribute('data-impulsion', String(t));
    if (t === 4) { await page.locator('#show-contract').click(); await expect(page.locator('#challenge-needs')).toContainText('batterie'); await page.locator('#close-contract').click(); }
  }
  await expect(page.locator('#challenge-result')).toBeVisible();
  await expect(page.locator('#final-score')).toHaveText('500 / 1200');
  await expect(page.locator('#final-summary')).toContainText('06 h 00 · 2/3 services en activité');
  await expect(page.locator('#final-grid tr')).toHaveCount(3);
  expect(await page.evaluate(() => (window as unknown as { copies?: string[] }).copies ?? [])).toEqual([]);
  await page.locator('#copy-result').click(); await expect(page.locator('#copy-status')).toHaveText('Carte copiée.');
  const copies = await page.evaluate(() => (window as unknown as { copies: string[] }).copies);
  expect(copies).toHaveLength(1); expect(copies[0]).toContain('ANGLE MORT · Quai 17 · Situation 041 · Standard');
  expect(copies[0]).toContain('Meilleure tentative : 1'); expect(copies[0]).toContain('Première découverte');
  await page.screenshot({ path: 'artifacts/defi-bilan.png' });
  await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('Clipboard denied'); }; });
  await page.locator('#copy-result').click(); await expect(page.locator('#copy-status')).toContainText('Copie manuelle');
  await expect(page.locator('#share-card')).toBeFocused();
  await page.locator('#close-result').click();
  const history = await page.evaluate(() => JSON.stringify(localStorage));
  await page.locator('#show-modes').click(); await page.locator('#scenario-challenge').click(); await expect(page.locator('#quay')).toHaveAttribute('data-impulsion', '4');
  for (let t = 5; t <= 16; t++) { await page.locator('#advance').click(); await expect(page.locator('#quay')).toHaveAttribute('data-impulsion', String(t)); }
  expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(history);
  await expect(page.locator('#show-result')).toBeHidden();
  await page.locator('#show-modes').click(); await page.locator('#scenario-defi').click(); await expect(page.locator('#quay')).toHaveAttribute('data-impulsion', '0');
  await expect(page.locator('#challenge-result')).not.toBeVisible(); await expect(page.locator('#show-result')).toBeHidden();
  expect(await page.locator('#share-card').inputValue()).toBe('');
  expect(await page.locator('#final-score').textContent()).toBe('');
  const record = await page.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage)[0]!)!));
  expect(record).toEqual({ tentatives: 2, meilleur: { tentative: 1, score: 500, services: 2 } });
});
