const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:8000/",
    specPattern: "e2e/__tests__",
    fixturesFolder: "e2e/fixtures",
    supportFile: "e2e/support",
    videosFolder: "e2e/videos",
    downloadsFolder: "e2e/downloads",
    screenshotsFolder: "e2e/screenshots",
    chromeWebSecurity: false, // ?
    video: true,
    setupNodeEvents(on) {
      on("task", {
        log(message) {
          console.log(message);

          return null;
        },
        table(message) {
          console.table(message);

          return null;
        },
      });
    },
  },
});
