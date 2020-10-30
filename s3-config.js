module.exports = {
  bucket: `prm-gp2gp-dashboard-data-${process.env.DEPLOYMENT_ENV}`,
  outputPath: "src/data/organisations/",
  metrics: {
    key: "v1/2020/02/practiceMetrics.json",
    outputFile: "practiceMetrics.json",
  },
  metadata: {
    key: "v1/2020/02/practiceMetadata.json",
    outputFile: "organisationMetadata.json",
  },
};
