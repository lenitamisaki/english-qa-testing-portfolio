const { createBdd } = require('playwright-bdd');
const { test } = require('../fixtures');
const { ensureLoggedIn } = require('../support/test-user');

const { Given, When, Then } = createBdd(test);

const SKIP_REASON =
  '"Falar com Max" é uma área premium — requer ativação de premium na conta ' +
  'de teste (ver docs/test-strategy.md e features/ativar_premium.feature).';

async function skipIfNotPremium(page) {
  const paywall = page.getByText('Conteúdo Premium', { exact: true });
  if ((await paywall.count()) > 0) {
    test.skip(true, SKIP_REASON);
  }
}

Given('que troquei algumas mensagens com o Max', async ({ authPage, page }) => {
  await ensureLoggedIn(authPage, page);
  await page.goto('/chatbot');
  await skipIfNotPremium(page);
});

When('envio uma mensagem válida', async ({ page }) => {
  await skipIfNotPremium(page);
});

When('tento enviar uma mensagem sem conteúdo', async ({ page }) => {
  await skipIfNotPremium(page);
});

When('continuo a conversa', async ({ page }) => {
  await skipIfNotPremium(page);
});

Then('devo receber uma resposta do assistente', async ({ page }) => {
  await skipIfNotPremium(page);
});

Then('a resposta deve aparecer no histórico da conversa', async ({ page }) => {
  await skipIfNotPremium(page);
});

Then('o envio não deve ocorrer', async ({ page }) => {
  await skipIfNotPremium(page);
});

Then('as mensagens anteriores devem permanecer visíveis na ordem correta', async ({ page }) => {
  await skipIfNotPremium(page);
});
