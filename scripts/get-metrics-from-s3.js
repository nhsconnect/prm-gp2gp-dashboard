const argv = require("yargs").argv;
const config = require("../s3-config");
const { getSsmValue } = require("./get-ssm-value");
const { getS3data } = require("./get-s3-data");

const datatype = argv.datatype;

if (!datatype) {
  throw new Error(
    "Please specify which datatype with --datatype practiceMetrics|nationalMetrics"
  );
} else {
  getSsmValue(config[datatype].ssmName).then((ssmValue) => {
    getS3data(
      {
        Bucket: config.bucket,
        Key: ssmValue,
      },
      `${config.outputPath}${config[datatype].outputFile}`
    );
  });
}
