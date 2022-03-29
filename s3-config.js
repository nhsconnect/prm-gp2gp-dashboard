module.exports = {
  bucket: `prm-gp2gp-metrics-${process.env.DATA_BUCKET_ENV}`,
  outputPath: "src/data/organisations/",
  metricsVersion: "v10",
  practiceMetrics: {
    ssmName: `/registrations/${process.env.DATA_BUCKET_ENV}/data-pipeline/metrics-calculator/practice-metrics-s3-uri`,
    outputFile: "practiceMetrics.json",
  },
  nationalMetrics: {
    ssmName: `/registrations/${process.env.DATA_BUCKET_ENV}/data-pipeline/metrics-calculator/national-metrics-s3-uri`,
    outputFile: "nationalMetrics.json",
  },
};
