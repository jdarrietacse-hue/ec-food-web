// @ts-check
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 45000,
  use: {
    baseURL: "http://localhost:4180",
  },
  webServer: {
    command: "npx serve -l 4180 --no-clipboard .",
    port: 4180,
    reuseExistingServer: true,
    timeout: 30000,
  },
});
