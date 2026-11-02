import { expect } from '@playwright/test';

export class CheckoutPage {
  constructor(page) { this.page = page; }

  async addProductAndCheckout(user) {
    // The legacy storefront binds cart click handlers during page load.
    await this.page.waitForLoadState('load');
    const card = this.page.locator('.features_items .product-image-wrapper').first();
    const productName = await card.locator('.productinfo p').innerText();
    const priceText = await card.locator('.productinfo h2').innerText();
    await card.locator('.productinfo').getByText('Add to cart', { exact: true }).click();
    const modal = this.page.locator('#cartModal');
    await expect(modal.getByRole('heading', { name: 'Added!' })).toBeVisible();
    await modal.getByRole('button', { name: 'Continue Shopping' }).click();
    await this.page.locator('header').getByRole('link', { name: /Cart/ }).click();
    await expect(this.page).toHaveURL(/\/view_cart$/);
    const row = this.page.locator('#cart_info_table tbody tr');
    await expect(row).toHaveCount(1);
    await expect(row.locator('.cart_description')).toContainText(productName);
    await expect(row.locator('.cart_price')).toContainText(priceText);
    await expect(row.locator('.cart_quantity')).toHaveText('1');
    await expect(row.locator('.cart_total')).toContainText(priceText);
    await this.page.getByText('Proceed To Checkout', { exact: true }).click();
    await expect(this.page.getByRole('heading', { name: 'Address Details' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Review Your Order' })).toBeVisible();
    for (const selector of ['#address_delivery', '#address_invoice']) {
      const address = this.page.locator(selector);
      for (const text of [`${user.firstname} ${user.lastname}`, user.company, user.address1, user.address2, user.city, user.state, user.zipcode, user.country, user.mobile_number]) {
        await expect(address).toContainText(text);
      }
    }
    const order = this.page.locator('#cart_info tbody tr').filter({ has: this.page.locator('.cart_description') });
    await expect(order).toHaveCount(1);
    await expect(order).toContainText(productName);
    await expect(order.locator('.cart_total')).toContainText(priceText);
    await this.page.locator('textarea[name="message"]').fill('Academic automated order using fictional data.');
    await this.page.getByRole('link', { name: 'Place Order' }).click();
  }

  async pay() {
    // Fictional card accepted by the practice website; no real payment gateway.
    await this.page.getByTestId('name-on-card').fill('Aline Automation');
    await this.page.getByTestId('card-number').fill('4111111111111111');
    await this.page.getByTestId('cvc').fill('123');
    await this.page.getByTestId('expiry-month').fill('12');
    await this.page.getByTestId('expiry-year').fill(String(new Date().getFullYear() + 2));
    await this.page.getByTestId('pay-button').click();
    await expect(this.page).toHaveURL(/\/payment_done\/\d+$/);
    await expect(this.page.getByTestId('order-placed')).toHaveText('Order Placed!');
    await expect(this.page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible();
  }
}
