function requireTestUser() {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;
  if (!email || !password) {
    throw new Error(
      'TEST_USER_EMAIL/TEST_USER_PASSWORD not set. Provide a pre-registered, ' +
        'email-confirmed account via .env (see .env.example).'
    );
  }
  return { email, password };
}

// Idempotent: visiting /auth while already authenticated redirects straight
// to "/", so logging in twice in the same test would break (the login form
// is gone by the time we'd try to fill it in). This checks a protected route
// first and only logs in if that redirects to /auth.
//
// The redirect to /auth for an unauthenticated visitor happens client-side
// (after the SPA boots), not as an HTTP redirect, so reading page.url()
// immediately after goto() can race ahead of it. Waiting for either the
// login form or the authenticated sidebar to render resolves that race.
async function ensureLoggedIn(authPage, page) {
  const { email, password } = requireTestUser();
  await page.goto('/exercises');
  await Promise.race([
    authPage.emailInput.waitFor({ state: 'visible' }).catch(() => {}),
    authPage.logoutButton.waitFor({ state: 'visible' }).catch(() => {}),
  ]);
  if (/\/auth$/.test(page.url())) {
    await authPage.login(email, password);
    await page.waitForURL(/\/$/);
  } else {
    await page.goto('/');
  }
}

module.exports = { requireTestUser, ensureLoggedIn };
