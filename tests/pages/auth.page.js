class AuthPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('seu@email.com');
    this.passwordInput = page.getByPlaceholder('••••••••');
    this.nameInput = page.getByPlaceholder('Seu nome completo');
    this.loginButton = page.getByRole('button', { name: 'Entrar', exact: true });
    this.registerButton = page.getByRole('button', { name: 'Criar Conta' });
    this.logoutButton = page.getByRole('button', { name: 'Sair' });
    this.switchToRegister = page.getByRole('button', { name: 'Não tem uma conta? Criar agora' });
    this.switchToLogin = page.getByRole('button', { name: 'Já tem uma conta? Fazer login' });
  }

  async goto() {
    await this.page.goto('/auth');
  }

  async login(email, password) {
    if (email) await this.emailInput.fill(email);
    if (password) await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }

  toast(text) {
    // A toast lib renders both a visible status element and a duplicate
    // aria-live announcer with the same text — .first() picks the visible one.
    return this.page.getByRole('status').filter({ hasText: text }).first();
  }
}

module.exports = { AuthPage };
