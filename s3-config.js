module.exports = {
  bucket: `prm-gp2gp-metrics-${process.env.DATA_BUCKET_ENV}`,
  outputPath: "src/data/organisations/",
  practiceMetrics: {
    ssmName: `/registrations/${process.env.DATA_BUCKET_ENV}/data-pipeline/metrics-calculator/practice-metrics-s3-uri`,
    key: "v9/2022/1/2022-1-practiceMetrics.json", // now pulled from s3 and can be deleted with s3-data-deprecated
    outputFile: "practiceMetrics.json",
  },
  nationalMetrics: {
    ssmName: `/registrations/${process.env.DATA_BUCKET_ENV}/data-pipeline/metrics-calculator/national-metrics-s3-uri`,
    key: "v9/2022/1/2022-1-nationalMetrics.json", // now pulled from s3 and can be deleted with s3-data-deprecated
    outputFile: "nationalMetrics.json",
  },
};
