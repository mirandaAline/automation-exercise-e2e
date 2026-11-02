import { expect } from '@playwright/test';

export class AuthPage {
  constructor(page) { this.page = page; }

  async login(user) {
    await this.page.getByTestId('login-email').fill(user.email);
    await this.page.getByTestId('login-password').fill(user.password);
    await this.page.getByTestId('login-button').click();
  }

  async signup(user) {
    await this.page.getByTestId('signup-name').fill(user.name);
    await this.page.getByTestId('signup-email').fill(user.email);
    await this.page.getByTestId('signup-button').click();
  }

  async register(user) {
    await this.signup(user);
    await expect(this.page.getByText('Enter Account Information', { exact: true })).toBeVisible();
    await this.page.getByLabel('Mrs.').check();
    await expect(this.page.getByTestId('name')).toHaveValue(user.name);
    await expect(this.page.getByTestId('email')).toHaveValue(user.email);
    await this.page.getByTestId('password').fill(user.password);
    await this.page.getByTestId('days').selectOption(user.birth_date);
    await this.page.getByTestId('months').selectOption(user.birth_month);
    await this.page.getByTestId('years').selectOption(user.birth_year);
    await this.page.getByLabel('Sign up for our newsletter!').check();
    await this.page.getByLabel('Receive special offers from our partners!').check();
    for (const field of ['first_name', 'last_name', 'company', 'address', 'address2', 'state', 'city', 'zipcode', 'mobile_number']) {
      const key = { first_name: 'firstname', last_name: 'lastname', address: 'address1' }[field] || field;
      await this.page.getByTestId(field).fill(user[key]);
    }
    await this.page.getByTestId('country').selectOption(user.country);
    await this.page.getByTestId('create-account').click();
    await expect(this.page.getByTestId('account-created')).toHaveText('Account Created!');
    await this.page.getByTestId('continue-button').click();
  }
}
