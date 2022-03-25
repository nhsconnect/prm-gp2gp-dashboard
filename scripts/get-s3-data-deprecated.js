const aws = require("aws-sdk");
const fs = require("fs");
const util = require("util");
const config = require("../s3-config");
const argv = require("yargs").argv;

const s3 = new aws.S3();
const getObject = util.promisify(s3.getObject.bind(s3));
const writeFile = util.promisify(fs.writeFile);

const getS3dataDeprecated = async (params, outputFile) => {
  try {
    const data = await getObject(params);
    const path = config.outputPath;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    await writeFile(`${path}${outputFile}`, data.Body);
    console.info("Wrote to:", `${path}${outputFile}`);
  } catch (err) {
    console.error("An error occurred:", err);
  }
};

const dataType = argv.datatype;

getS3dataDeprecated(
  { Bucket: config.bucket, Key: config[dataType].key },
  config[dataType].outputFile
);
