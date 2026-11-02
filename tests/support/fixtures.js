import { test as base, expect } from '@playwright/test';
import { newUser } from './user.js';

export const test = base.extend({
  // Only third-party advertising is blocked; application requests remain real.
  context: async ({ context }, use) => {
    await context.route(/https?:\/\/([^/]+\.)?(doubleclick\.net|googlesyndication\.com|googleadservices\.com|adservice\.google\.com)\//,
      route => route.abort());
    await use(context);
  },
  account: async ({ request }, use) => {
    const user = newUser();
    // Register cleanup before use, including when a UI assertion fails.
    try {
      await use(user);
    } finally {
      const response = await request.delete('/api/deleteAccount', {
        form: { email: user.email, password: user.password },
      });
      expect(response.ok(), 'HTTP da limpeza da conta temporária').toBeTruthy();
      const body = await response.json();
      // 404 is expected when the scenario already deleted the account via UI.
      expect([200, 404], 'Resultado da limpeza da conta temporária').toContain(body.responseCode);
    }
  },
  existingAccount: async ({ request, account }, use) => {
    const response = await request.post('/api/createAccount', { form: account });
    expect(response.ok()).toBeTruthy();
    expect((await response.json()).responseCode).toBe(201);
    await use(account);
  },
});

export { expect };
