module.exports = {
  bucket: `prm-gp2gp-metrics-${process.env.DATA_BUCKET_ENV}`,
  outputPath: "src/data/organisations/",
  practiceMetrics: {
    key: "v10/2022/2/2022-2-practiceMetrics.json",
    outputFile: "practiceMetrics.json",
  },
  nationalMetrics: {
    key: "v10/2022/2/2022-2-nationalMetrics.json",
    outputFile: "nationalMetrics.json",
  },
};
