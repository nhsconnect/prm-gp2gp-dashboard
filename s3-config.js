module.exports = {
  bucket: `prm-gp2gp-metrics-${process.env.DATA_BUCKET_ENV}`,
  outputPath: "src/data/organisations/",
  metricsVersion: "v11",
  practiceMetrics: {
    ssmName: `/registrations/${process.env.DATA_BUCKET_ENV}/data-pipeline/metrics-calculator/practice-metrics-s3-path`,
    outputFile: "practiceMetrics.json",
  },
  nationalMetrics: {
    ssmName: `/registrations/${process.env.DATA_BUCKET_ENV}/data-pipeline/metrics-calculator/national-metrics-s3-path`,
    outputFile: "nationalMetrics.json",
  },
};
