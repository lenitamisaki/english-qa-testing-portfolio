const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { test } = require('../fixtures');
const { ensureLoggedIn } = require('../support/test-user');

const { Given, When, Then } = createBdd(test);

let usedCoupon;

Given('que estou autenticada com uma conta sem premium', async ({ authPage, page }) => {
  await ensureLoggedIn(authPage, page);
});

Given('que possuo um cupom que já foi utilizado ou expirou', async () => {
  usedCoupon = process.env.EXPIRED_COUPON_CODE || `USADO-${Date.now()}`;
});

Given('que ativei o premium com sucesso', async ({ authPage, premiumPage, page }) => {
  await ensureLoggedIn(authPage, page);
  await premiumPage.goto();
  await premiumPage.activate(process.env.PREMIUM_COUPON);
  await expect(premiumPage.toast(/sucesso|ativado/i)).toBeVisible();
});

When('informo o cupom válido {string}', async ({ premiumPage }, cupom) => {
  await premiumPage.couponInput.fill(cupom);
});

When('informo um cupom inexistente', async ({ premiumPage }) => {
  await premiumPage.couponInput.fill(`INEXISTENTE-${Date.now()}`);
});

When('confirmo a ativação', async ({ premiumPage }) => {
  await premiumPage.activateButton.click();
});

When('confirmo a ativação sem informar nenhum cupom', async ({ premiumPage }) => {
  await premiumPage.activateButton.click();
});

When('informo esse cupom', async ({ premiumPage }) => {
  await premiumPage.couponInput.fill(usedCoupon);
});

When(/^acesso uma área antes bloqueada \(ex\.: Exercícios ou Histórias\)$/, async ({ page }) => {
  await page.goto('/exercises');
});

Then('minha conta deve passar a ter acesso premium', async ({ premiumPage }) => {
  await expect(premiumPage.toast(/sucesso|ativado/i)).toBeVisible();
});

Then('o conteúdo premium deve ser liberado', async ({ page }) => {
  await page.goto('/exercises');
  await expect(page.getByText('Conteúdo Premium', { exact: true })).toHaveCount(0);
});

Then('devo ver uma mensagem de cupom inválido', async ({ premiumPage }) => {
  await expect(premiumPage.toast('Código inválido ou já utilizado')).toBeVisible();
});

Then('minha conta deve permanecer sem premium', async ({ page }) => {
  await page.goto('/exercises');
  await expect(page.getByText('Conteúdo Premium', { exact: true })).toBeVisible();
});

Then('nenhuma ativação deve ocorrer', async ({ page }) => {
  await expect(page).toHaveURL(/\/activate-premium$/);
});

Then('devo ver uma mensagem indicando que o cupom não é mais válido', async ({ premiumPage }) => {
  await expect(premiumPage.toast(/inválido|utilizado|expirado/i)).toBeVisible();
});

Then('devo conseguir visualizar o conteúdo sem o aviso de bloqueio', async ({ page }) => {
  await expect(page.getByText('Conteúdo Premium', { exact: true })).toHaveCount(0);
});
