module.exports = {
  bucket: `prm-gp2gp-dashboard-data-${process.env.DEPLOYMENT_ENV}`,
  outputPath: "src/data/organisations/",
  practiceMetrics: {
    key: "v2/2021/1/practiceMetrics.json",
    outputFile: "practiceMetrics.json",
  },
  metadata: {
    key: "v2/2021/1/organisationMetadata.json",
    outputFile: "organisationMetadata.json",
  },
  nationalMetrics: {
    key: "v2/2021/1/nationalMetrics.json",
    outputFile: "nationalMetrics.json",
  },
};
