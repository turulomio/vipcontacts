const { defineConfig } = require("cypress")

module.exports = defineConfig({
  chromeWebSecurity: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },

  e2e: {
    // baseUrl:"http://127.0.0.1:8003",
    // env: {
    //   apiUrl: "http://127.0.0.1:8002",
    // },
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on,config)
      // implement node event listeners here
      return config
    },
  },
});
