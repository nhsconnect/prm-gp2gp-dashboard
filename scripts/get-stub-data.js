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
const stubbedDataUrl = `https://raw.githubusercontent.com/nhsconnect/prm-gp2gp-data-pipeline/master/tests/e2e/platform_metrics_calculator/test_platform_metrics_calculator_pipeline/expected_json_output/v2/2019/12/${outputFileName}`;

createOrSyncDir(config.outputPath);
getStubData(outputFileDirectory, stubbedDataUrl);

module.exports = { getStubData };
