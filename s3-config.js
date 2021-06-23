module.exports = {
  bucket: `prm-gp2gp-dashboard-data-${process.env.DEPLOYMENT_ENV}`,
  outputPath: "src/data/organisations/",
  practiceMetrics: {
    key: "v3/2021/5/practiceMetrics.json",
    outputFile: "practiceMetrics.json",
  },
  nationalMetrics: {
    key: "v3/2021/5/nationalMetrics.json",
    outputFile: "nationalMetrics.json",
  },
};
