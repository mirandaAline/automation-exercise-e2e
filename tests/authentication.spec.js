import { test, expect } from './support/fixtures.js';
import { newUser } from './support/user.js';
import { StorePage } from '../pages/store.page.js';
import { AuthPage } from '../pages/auth.page.js';

test.beforeEach(async ({ page }) => { await new StorePage(page).home(); });

test('CT01 - Cadastrar usuário e excluir a conta', async ({ page, account }) => {
  const store = new StorePage(page);
  await test.step('Cadastrar usuário com todos os campos pela interface', async () => {
    await store.openLogin();
    await new AuthPage(page).register(account);
    await store.assertLoggedIn(account);
  });
  await test.step('Excluir conta e confirmar exclusão', async () => { await store.deleteAccount(); });
});

test('CT02 - Login com e-mail e senha corretos', async ({ page, existingAccount }) => {
  const store = new StorePage(page);
  await store.openLogin();
  await new AuthPage(page).login(existingAccount);
  await store.assertLoggedIn(existingAccount);
  await store.deleteAccount();
});

test('CT03 - Rejeitar login com e-mail e senha incorretos', async ({ page }) => {
  await new StorePage(page).openLogin();
  await new AuthPage(page).login(newUser());
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test('CT04 - Realizar logout', async ({ page, existingAccount }) => {
  const store = new StorePage(page);
  await store.openLogin();
  await new AuthPage(page).login(existingAccount);
  await store.assertLoggedIn(existingAccount);
  await page.locator('header').getByRole('link', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
  await expect(page.locator('header').getByText('Logged in as')).toHaveCount(0);
});

test('CT05 - Rejeitar cadastro com e-mail já existente', async ({ page, existingAccount }) => {
  await new StorePage(page).openLogin();
  await new AuthPage(page).signup(existingAccount);
  await expect(page.getByText('Email Address already exist!')).toBeVisible();
});
