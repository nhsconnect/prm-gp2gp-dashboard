module.exports = {
  bucket: `prm-gp2gp-dashboard-data-${process.env.DEPLOYMENT_ENV}`,
  outputPath: "src/data/organisations/",
  metrics: {
    key: "v2/2021/1/practice-metrics.json",
    outputFile: "practiceMetrics.json",
  },
  metadata: {
    key: "v2/2021/1/organisation-metadata.json",
    outputFile: "organisationMetadata.json",
  },
};
