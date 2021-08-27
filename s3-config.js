module.exports = {
  bucket: `prm-gp2gp-metrics-${process.env.DATA_BUCKET_ENV}`,
  outputPath: "src/data/organisations/",
  practiceMetrics: {
    key: "v5/2021/7/practiceMetrics.json",
    outputFile: "practiceMetrics.json",
  },
  nationalMetrics: {
    key: "v5/2021/7/nationalMetrics.json",
    outputFile: "nationalMetrics.json",
  },
};
