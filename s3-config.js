module.exports = {
  bucket: `prm-gp2gp-dashboard-data-${process.env.DEPLOYMENT_ENV}`,
  outputPath: "src/data/organisations/",
  practiceMetrics: {
    key: "v2/2021/2/practiceMetrics.json",
    outputFile: "practiceMetrics.json",
  },
  metadata: {
    key: "v2/2021/2/organisationMetadata.json",
    outputFile: "organisationMetadata.json",
  },
  nationalMetrics: {
    key: "v2/2021/2/nationalMetrics.json",
    outputFile: "nationalMetrics.json",
  },
};
