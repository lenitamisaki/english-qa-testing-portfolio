require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');

const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: ['tests/steps/*.steps.js', 'tests/fixtures.js'],
  tags: '@funcional',
});

module.exports = defineConfig({
  testDir,
  fullyParallel: true,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://english.qazando.com.br',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
