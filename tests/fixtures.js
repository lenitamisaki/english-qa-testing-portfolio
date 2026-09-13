const { test: base } = require('playwright-bdd');
const { AuthPage } = require('./pages/auth.page');
const { PremiumPage } = require('./pages/premium.page');

const test = base.extend({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  premiumPage: async ({ page }, use) => {
    await use(new PremiumPage(page));
  },
});

module.exports = { test };
