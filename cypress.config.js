const { defineConfig } = require('cypress');

// Configure with Cypress Cloud project id via env to avoid hardcoding secrets
const cloudProjectId =
  process.env.CYPRESS_PROJECT_ID || 'set-your-cypress-cloud-project-id';

module.exports = defineConfig({
  projectId: "zh98f6",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
