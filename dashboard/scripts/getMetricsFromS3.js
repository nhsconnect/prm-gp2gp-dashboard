const argv = require("yargs").argv;
const config = require("../s3-config");
const { getSsmValue } = require("./getSsmValue");
const { getS3data } = require("./getS3Data");

const datatype = argv.datatype;

const getMetricsFromS3 = async () => {
  try {
    if (datatype) {
      const ssmValue = await getSsmValue(config[datatype].ssmName);
      const s3KeyWithVersion = `${config.metricsVersion}/${ssmValue}`;
      await getS3data(
        {
          Bucket: config.bucket,
          Key: s3KeyWithVersion,
        },
        `${config.outputPath}${config[datatype].outputFile}`
      );
    } else {
      throw new Error(
        "Please specify which datatype with --datatype practiceMetrics|nationalMetrics"
      );
    }
  } catch (err) {
    console.error(err);
  }
};

// run in package json
getMetricsFromS3();

// export for tests
module.exports = { getMetricsFromS3 };
