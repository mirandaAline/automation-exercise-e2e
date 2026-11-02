import { expect } from '@playwright/test';

export class StorePage {
  constructor(page) {
    this.page = page;
    this.navigation = page.locator('header');
    this.productCards = page.locator('.features_items .product-image-wrapper');
  }

  async home() {
    await this.page.goto('/');
    await expect(this.navigation.getByRole('link', { name: /Home/ })).toBeVisible();
    await expect(this.page.locator('#slider')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Features Items' })).toBeVisible();
  }

  async openLogin() {
    await this.navigation.getByRole('link', { name: 'Signup / Login' }).click();
    await expect(this.page).toHaveURL(/\/login$/);
    await expect(this.page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
  }

  async assertLoggedIn(user) {
    await expect(this.navigation.getByText(`Logged in as ${user.name}`)).toBeVisible();
  }

  async deleteAccount() {
    await this.navigation.getByRole('link', { name: 'Delete Account' }).click();
    await expect(this.page.getByTestId('account-deleted')).toHaveText('Account Deleted!');
    await this.page.getByTestId('continue-button').click();
    await expect(this.navigation.getByRole('link', { name: 'Signup / Login' })).toBeVisible();
  }

  async openProducts() {
    await this.navigation.getByRole('link', { name: 'Products' }).click();
    await expect(this.page).toHaveURL(/\/products$/);
    await expect(this.page.getByRole('heading', { name: 'All Products', exact: true })).toBeVisible();
    await expect(this.productCards.first()).toBeVisible();
  }

  async subscribe(email) {
    const footer = this.page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.getByRole('heading', { name: 'Subscription' })).toBeVisible();
    await footer.getByPlaceholder('Your email address').fill(email);
    await footer.locator('#subscribe').click();
    await expect(footer.getByText('You have been successfully subscribed!')).toBeVisible();
  }
}
