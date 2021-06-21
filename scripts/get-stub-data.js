const axios = require("axios");
const fs = require("fs");
const util = require("util");
const argv = require("yargs").argv;
const config = require("../s3-config");

const writeFile = util.promisify(fs.writeFile);

async function createOrSyncDir(path) {
  if (!fs.existsSync(path)) {
    await fs.mkdirSync(path);
  }
}

async function makeApiCall(url) {
  const response = await axios.get(url);
  const jsonResponse = await response.data;
  return JSON.stringify(jsonResponse);
}

async function getStubData(outputFileDirectory, stubbedDataUrl) {
  try {
    const data = await makeApiCall(stubbedDataUrl);
    await writeFile(outputFileDirectory, data);

    console.info(
      "Successfully wrote stubbed JSON data from data-pipeline to: ",
      `${outputFileDirectory}`
    );
  } catch (err) {
    console.error("An error occurred:", err);
  }
}

const dataType = argv.datatype;
const outputFileName = config[dataType].outputFile;
const outputFileDirectory = config.outputPath + outputFileName;
const commitHash = "43401c3cc0809e7bdc106d2ae5b4ef534a6fd5c0";
const stubbedDataUrl = `https://raw.githubusercontent.com/nhsconnect/prm-gp2gp-data-pipeline/${commitHash}/tests/e2e/platform_metrics_calculator/test_platform_metrics_calculator_pipeline/expected_outputs/${outputFileName}`;

createOrSyncDir(config.outputPath);
getStubData(outputFileDirectory, stubbedDataUrl);

module.exports = { getStubData };
