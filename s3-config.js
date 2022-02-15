module.exports = {
  bucket: `prm-gp2gp-metrics-${process.env.DATA_BUCKET_ENV}`,
  outputPath: "src/data/organisations/",
  practiceMetrics: {
    key: "v9/2022/1/2022-1-practiceMetrics.json",
    outputFile: "practiceMetrics.json",
  },
  nationalMetrics: {
    key: "v9/2022/1/2022-1-nationalMetrics.json",
    outputFile: "nationalMetrics.json",
  },
};
