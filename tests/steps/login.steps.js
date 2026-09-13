const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { test } = require('../fixtures');
const { requireTestUser } = require('../support/test-user');

const { Given, When, Then } = createBdd(test);

Given('que estou na tela de login', async ({ authPage }) => {
  await authPage.goto();
});

Given('possuo uma conta válida cadastrada', async () => {
  requireTestUser();
});

Given('que estou autenticada no sistema', async ({ authPage, page }) => {
  const { email, password } = requireTestUser();
  await authPage.goto();
  await authPage.login(email, password);
  await expect(page).toHaveURL(/\/$/);
  // "Sair" só aparece no layout interno (sidebar), não na home pública.
  await page.goto('/exercises');
});

When('informo meu e-mail e senha corretos', async ({ authPage }) => {
  const { email, password } = requireTestUser();
  await authPage.emailInput.fill(email);
  await authPage.passwordInput.fill(password);
});

When('informo meu e-mail correto e uma senha incorreta', async ({ authPage }) => {
  const { email } = requireTestUser();
  await authPage.emailInput.fill(email);
  await authPage.passwordInput.fill(`senha-incorreta-${Date.now()}`);
});

When('informo um e-mail que não possui conta', async ({ authPage }) => {
  await authPage.emailInput.fill(`nao-cadastrado-${Date.now()}@example.com`);
});

When('informo qualquer senha', async ({ authPage }) => {
  await authPage.passwordInput.fill('qualquer-senha-123');
});

When('informo um e-mail sem formato válido', async ({ authPage }) => {
  await authPage.emailInput.fill('formato-invalido');
  await authPage.passwordInput.fill('qualquer-senha-123');
});

When('deixo o campo {string} em branco', async ({ authPage }, campo) => {
  if (campo === 'e-mail' || campo === 'ambos') {
    // deixa o e-mail em branco
  } else {
    await authPage.emailInput.fill('preenchido@example.com');
  }
  if (campo === 'senha' || campo === 'ambos') {
    // deixa a senha em branco
  } else {
    await authPage.passwordInput.fill('senha-preenchida-123');
  }
});

When('clico em {string}', async ({ authPage }, botao) => {
  if (botao === 'Entrar') {
    await authPage.loginButton.click();
  } else if (botao === 'Sair') {
    await authPage.logoutButton.click();
  } else {
    throw new Error(`Botão não mapeado nos step definitions: ${botao}`);
  }
});

Then('devo ser autenticada e redirecionada para a tela inicial', async ({ authPage, page }) => {
  await expect(page).toHaveURL(/\/$/);
  await expect(authPage.toast('Login realizado com sucesso')).toBeVisible();
});

Then('devo permanecer na tela de login', async ({ page }) => {
  await expect(page).toHaveURL(/\/auth$/);
});

Then('devo ver uma mensagem de erro de autenticação', async ({ authPage }) => {
  await expect(authPage.toast('Erro ao fazer login')).toBeVisible();
});

Then('devo ver uma indicação de campo obrigatório', async ({ page }) => {
  // Alguns formulários usam validação nativa (:invalid), outros exibem um
  // toast de aviso — este step cobre os dois casos observados na aplicação.
  const invalidFields = await page.locator(':invalid').count();
  const attentionToast = page.getByRole('status').filter({ hasText: /atenção|obrigatório|digite/i });
  const hasToast = await attentionToast.count();
  expect(invalidFields > 0 || hasToast > 0).toBe(true);
});

Then('o login não deve ser submetido', async ({ page }) => {
  await expect(page).toHaveURL(/\/auth$/);
});

Then('devo ver uma mensagem de formato de e-mail inválido', async ({ authPage }) => {
  const isInvalid = await authPage.emailInput.evaluate((el) => !el.validity.valid);
  expect(isInvalid).toBe(true);
});

Then('minha sessão deve ser encerrada', async ({ page }) => {
  await expect(page).toHaveURL(/\/auth$/);
});

Then('ao tentar voltar a uma página interna devo ser levada à tela de login', async ({ page }) => {
  await page.goto('/exercises');
  await expect(page).toHaveURL(/\/auth$/);
});
