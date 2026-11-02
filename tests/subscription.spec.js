import { test } from './support/fixtures.js';
import { newUser } from './support/user.js';
import { StorePage } from '../pages/store.page.js';

test('CT10 - Assinar newsletter pelo rodapé da página inicial', async ({ page }) => {
  const store = new StorePage(page);
  await store.home();
  await store.subscribe(newUser().email);
});
