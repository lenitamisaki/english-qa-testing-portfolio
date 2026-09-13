class PremiumPage {
  constructor(page) {
    this.page = page;
    this.couponInput = page.getByPlaceholder('Digite seu código');
    this.activateButton = page.getByRole('button', { name: 'Ativar Premium' });
  }

  async goto() {
    await this.page.goto('/activate-premium');
  }

  async activate(coupon) {
    if (coupon) await this.couponInput.fill(coupon);
    await this.activateButton.click();
  }

  toast(text) {
    // A toast lib renders both a visible status element and a duplicate
    // aria-live announcer with the same text — .first() picks the visible one.
    return this.page.getByRole('status').filter({ hasText: text }).first();
  }
}

module.exports = { PremiumPage };
