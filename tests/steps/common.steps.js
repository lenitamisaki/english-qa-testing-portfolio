const { createBdd } = require('playwright-bdd');
const { test } = require('../fixtures');
const { ensureLoggedIn } = require('../support/test-user');

const { Given } = createBdd(test);

// Every screen below requires an authenticated session. The Gherkin scenarios
// don't spell out a separate login step before "estou na tela X", so this
// step logs in first (if needed) and then navigates — matching what a real
// user would need to do to reach these screens.
const SCREEN_ROUTES = {
  'Ativar Código Premium': '/activate-premium',
  'Falar com Max': '/chatbot',
};

async function goToScreen({ authPage, page }, tela) {
  const route = SCREEN_ROUTES[tela];
  if (!route) {
    throw new Error(`Tela não mapeada nos step definitions: ${tela}`);
  }
  await ensureLoggedIn(authPage, page);
  await page.goto(route);
}

// Both variants show up depending on whether the step is the scenario's
// first ("Dado que estou na tela...") or a continuation ("E estou na tela...").
Given('que estou na tela {string}', goToScreen);
Given('estou na tela {string}', goToScreen);
