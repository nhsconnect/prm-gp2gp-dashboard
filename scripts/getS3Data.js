const aws = require("aws-sdk");
const fs = require("fs");
const util = require("util");
const config = require("../s3-config");

const s3 = new aws.S3();
const getObject = util.promisify(s3.getObject.bind(s3));
const writeFile = util.promisify(fs.writeFile);

const getS3Data = async (params, outputFile) => {
  try {
    const data = await getObject(params);

    if (!fs.existsSync(config.outputPath)) {
      fs.mkdirSync(config.outputPath);
    }
    await writeFile(outputFile, data.Body);
    console.info(`Successfully wrote to: ${outputFile}`);
  } catch (err) {
    console.error(`An error occurred: ${err}`);
    process.exit(1);
  }
};

module.exports = { getS3data: getS3Data };
