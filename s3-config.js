module.exports = {
  bucket: `prm-gp2gp-dashboard-data-${process.env.DEPLOYMENT_ENV}`,
  outputPath: "src/data/organisations/",
  metrics: {
    key: "v2/2020/12/practiceMetrics.json",
    outputFile: "practiceMetrics.json",
  },
  metadata: {
    key: "v2/2020/12/organisationMetadata.json",
    outputFile: "organisationMetadata.json",
  },
};
