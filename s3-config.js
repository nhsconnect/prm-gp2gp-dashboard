module.exports = {
  bucket: `prm-gp2gp-metrics-${process.env.DATA_BUCKET_ENV}`,
  outputPath: "src/data/organisations/",
  practiceMetrics: {
    key: "v7/2021/9/2021-9-practiceMetrics.json",
    outputFile: "practiceMetrics.json",
  },
  nationalMetrics: {
    key: "v7/2021/9/2021-9-nationalMetrics.json",
    outputFile: "nationalMetrics.json",
  },
};
