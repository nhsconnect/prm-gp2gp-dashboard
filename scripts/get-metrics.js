const aws = require("aws-sdk");
const fs = require("fs");
const util = require("util");
const config = require("../metrics-config");

const s3 = new aws.S3();
const getObject = util.promisify(s3.getObject.bind(s3));
const writeFile = util.promisify(fs.writeFile);

const getMetrics = async (params, outputPath) => {
  try {
    const data = await getObject(params);
    await writeFile(outputPath, data.Body);
    console.info("Wrote to:", outputPath);
  } catch (err) {
    console.error("An error occurred:", err);
  }
};

getMetrics({ Bucket: config.bucket, Key: config.key }, config.outputPath);
