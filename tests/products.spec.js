import { test, expect } from './support/fixtures.js';
import { StorePage } from '../pages/store.page.js';

test.beforeEach(async ({ page }) => { await new StorePage(page).home(); });

test('CT08 - Listar produtos e verificar todos os detalhes do primeiro', async ({ page }) => {
  const store = new StorePage(page);
  await store.openProducts();
  const first = store.productCards.first();
  const name = await first.locator('.productinfo p').innerText();
  const price = await first.locator('.productinfo h2').innerText();
  await first.getByRole('link', { name: 'View Product' }).click();
  await expect(page).toHaveURL(/\/product_details\/\d+$/);
  const details = page.locator('.product-information');
  await expect(details.getByRole('heading', { name, exact: true })).toBeVisible();
  await expect(details.getByText(price, { exact: true })).toBeVisible();
  for (const label of ['Category', 'Availability', 'Condition', 'Brand']) {
    await expect(details.locator('p').filter({ hasText: new RegExp(`^${label}:\\s*\\S+`) })).toBeVisible();
  }
});

test('CT09 - Buscar produto e verificar todos os resultados relacionados', async ({ page }) => {
  const term = 'blue top';
  const store = new StorePage(page);
  await store.openProducts();
  // Capture the full catalog before searching to detect omitted matching products.
  const catalog = await store.productCards.locator('.productinfo p').allTextContents();
  const expectedNames = catalog.map(name => name.trim()).filter(name => name.toLowerCase().includes(term)).sort();
  expect(expectedNames.length).toBeGreaterThan(0);
  await page.locator('#search_product').fill(term);
  await page.locator('#submit_search').click();
  await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();
  await expect(store.productCards).toHaveCount(expectedNames.length);
  for (const card of await store.productCards.all()) {
    await expect(card).toBeVisible();
    await expect(card.locator('.productinfo p')).toContainText(new RegExp(term, 'i'));
  }
  const actualNames = await store.productCards.locator('.productinfo p').allTextContents();
  expect(actualNames.map(name => name.trim()).sort()).toEqual(expectedNames);
});
