const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'yt6zzt',
  e2e: {
    experimentalStudio: true,
    video: true,
    experimentalRunAllSpecs: true,
  },
});
