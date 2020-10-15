module.exports = {
  bucket: `prm-gp2gp-dashboard-data-${process.env.ENVIRONMENT}`,
  outputPath: "src/data/practices/",
  metrics: {
    key: "v1/2020/02/practiceMetrics.json",
    outputFile: "practiceMetrics.json",
  },
  metadata: {
    key: "v1/2020/02/practiceMetadata.json",
    outputFile: "practiceMetadata.json",
  },
};
