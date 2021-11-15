module.exports = {
  bucket: `prm-gp2gp-metrics-${process.env.DATA_BUCKET_ENV}`,
  outputPath: "src/data/organisations/",
  practiceMetrics: {
    key: "v7/2021/10/2021-10-practiceMetrics.json",
    outputFile: "practiceMetrics.json",
  },
  nationalMetrics: {
    key: "v7/2021/10/2021-10-nationalMetrics.json",
    outputFile: "nationalMetrics.json",
  },
};
