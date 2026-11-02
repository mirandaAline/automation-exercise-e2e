import { test } from './support/fixtures.js';
import { StorePage } from '../pages/store.page.js';
import { AuthPage } from '../pages/auth.page.js';
import { CheckoutPage } from '../pages/checkout.page.js';

test.beforeEach(async ({ page }) => { await new StorePage(page).home(); });

test('CT15 - Comprar com cadastro antes do checkout', async ({ page, account }) => {
  const store = new StorePage(page);
  const checkout = new CheckoutPage(page);
  await test.step('Cadastrar pela interface antes da compra', async () => {
    await store.openLogin();
    await new AuthPage(page).register(account);
    await store.assertLoggedIn(account);
  });
  await test.step('Conferir carrinho, endereços e pedido', async () => { await checkout.addProductAndCheckout(account); });
  await test.step('Pagar com dados fictícios e confirmar pedido', async () => { await checkout.pay(); });
  await store.deleteAccount();
});

test('CT16 - Comprar com login antes do checkout', async ({ page, existingAccount }) => {
  const store = new StorePage(page);
  const checkout = new CheckoutPage(page);
  await test.step('Entrar com conta existente antes da compra', async () => {
    await store.openLogin();
    await new AuthPage(page).login(existingAccount);
    await store.assertLoggedIn(existingAccount);
  });
  await test.step('Conferir carrinho, endereços e pedido', async () => { await checkout.addProductAndCheckout(existingAccount); });
  await test.step('Pagar com dados fictícios e confirmar pedido', async () => { await checkout.pay(); });
  await store.deleteAccount();
});
