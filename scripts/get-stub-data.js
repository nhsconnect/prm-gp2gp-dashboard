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
const commitHash = "a449e6ad31e189599b6d3d4c4607da27a1d4215c";
const stubbedDataUrl = `https://raw.githubusercontent.com/nhsconnect/prm-gp2gp-metrics-calculator/${commitHash}/tests/e2e/test_metrics_calculator/expected_outputs/${outputFileName}`;

createOrSyncDir(config.outputPath);
getStubData(outputFileDirectory, stubbedDataUrl);

module.exports = { getStubData };
