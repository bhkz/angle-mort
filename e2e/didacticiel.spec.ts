import { test, expect } from '@playwright/test';

test('le guide explique puis fait jouer deux livraisons, avec mouvement visible et retour daté', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/'); await expect(page.locator('#app')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('#guide-title')).toHaveText('1. Choisissez R1');
  await expect(page.locator('#advance')).toBeDisabled();
  const names = await page.locator('.object-target').allTextContents(); expect(names).not.toContain('D'); expect(names).not.toContain('E'); expect(names).not.toContain('G');
  await page.screenshot({ path: 'artifacts/didacticiel-accueil.png' });
  await page.locator('#guide-action').click(); await expect(page.locator('#guide-title')).toHaveText('2. Choisissez l’atelier');
  await page.locator('#guide-action').click(); await expect(page.locator('#guide')).toContainText('1 tour prévu');
  await expect(page.locator('#quay')).toHaveAttribute('data-impulsion', '0');
  await expect(page.locator('.plan-summary')).not.toContainText(/optimal/i);
  const scene = await page.locator('#quay').boundingBox();
  expect(scene).toEqual({ x: 0, y: 0, width: 1024, height: 768 });
  await page.screenshot({ path: 'artifacts/didacticiel-trajet.png' });
  await page.locator('#guide-action').click();
  await expect(page.locator('#quay')).toHaveAttribute('data-animating', 'true');
  await expect(page.locator('#advance')).toBeDisabled();
  const moving = await page.locator('[data-object="robot:R"]').boundingBox();
  await page.screenshot({ path: 'artifacts/didacticiel-mouvement.png' });
  await expect(page.locator('#quay')).toHaveAttribute('data-animating', 'false');
  const arrived = await page.locator('[data-object="robot:R"]').boundingBox();
  expect(Math.abs(arrived!.x - moving!.x) + Math.abs(arrived!.y - moving!.y)).toBeGreaterThan(5);
  await expect(page.locator('#feedback-title')).toContainText('R1 : Pompe → Atelier');
  await expect(page.locator('#receipt')).toContainText('Livraison reçue · Atelier');
  await expect(page.locator('#guide-title')).toContainText('Première livraison réussie');
  await page.screenshot({ path: 'artifacts/didacticiel-livraison.png' });
  await page.locator('#guide-action').click(); await expect(page.locator('#guide')).toContainText('2 tours prévus');
  for (const t of [2, 3]) { await page.locator('#guide-action').click(); await expect(page.locator('#quay')).toHaveAttribute('data-impulsion', String(t)); await expect(page.locator('#quay')).toHaveAttribute('data-animating', 'false'); }
  await expect(page.locator('#receipt')).toHaveAttribute('data-colis', 'M');
  await expect(page.locator('#guide-title')).toContainText('Vous savez préparer et livrer');
  await page.locator('#show-modes').click(); await expect(page.locator('#modes')).toContainText('Sans score');
  await page.locator('#scenario-defi').click(); await expect(page.locator('#quay')).toHaveAttribute('data-impulsion', '0');
  await page.locator('#show-contract').click();
  await expect(page.locator('#challenge-needs')).toContainText('Livrez fourniture 1 à Atelier, entre les tours 1 et 4');
  expect(await page.locator('#challenge-needs').innerText()).not.toMatch(/P1|F1|Q1|t4|\(0,4\]/);
});

test('le défi peut être appris de bout en bout sans écrire un record aidé', async ({ page }) => {
  await page.goto('/'); await expect(page.locator('#app')).toHaveAttribute('data-ready', 'true');
  await page.locator('#show-modes').click(); await page.locator('#scenario-defi').click();
  await expect(page.locator('#guide-title')).toContainText('Trois services');
  await page.locator('#guide-defi').click();
  for (let action = 0; action < 35; action++) {
    if (await page.locator('#challenge-result').isVisible()) break;
    await expect(page.locator('#guide-action')).toBeEnabled();
    await page.locator('#guide-action').click();
    await expect(page.locator('#app')).toHaveAttribute('data-busy', 'false');
    await expect(page.locator('#quay')).toHaveAttribute('data-animating', 'false');
  }
  await expect(page.locator('#challenge-result')).toBeVisible();
  // EVA groups q3 with q4 to save moves; the guide does not silently replace the chosen criterion.
  await expect(page.locator('#final-score')).toHaveText('1100 / 1200');
  await expect(page.locator('#final-explanations')).toContainText('Fourniture 3 reçue au tour 14');
  await expect(page.locator('#final-explanations')).toContainText('Attendue entre les tours 9 et 12 : hors délai');
  await expect(page.locator('#final-summary')).toContainText('Entraînement guidé, hors record');
  expect(await page.locator('#share-card').inputValue()).toContain('Entraînement guidé · Hors record');
  const history = await page.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage)[0]!)!));
  expect(history.meilleur).toBeNull();
  await page.screenshot({ path: 'artifacts/didacticiel-defi-termine.png' });
});
