const fetchNode = require("node-fetch");
const fs = require("fs");
const util = require("util");
const argv = require("yargs").argv;
const config = require("../s3-config");

const writeFile = util.promisify(fs.writeFile);

async function makeApiCall(url) {
  const response = await fetchNode(url);
  if (!response.ok) {
    throw Error(response.error);
  }
  const jsonResponse = await response.json();
  return JSON.stringify(jsonResponse);
}

async function getStubData(outputFileDirectory, stubbedJsonUrl) {
  try {
    const data = await makeApiCall(stubbedJsonUrl);

    if (!fs.existsSync(config.outputPath)) {
      await fs.mkdirSync(config.outputPath);
    }

    await writeFile(outputFileDirectory, data);

    console.info(
      "Successfully copied stubbed json from data-pipeline to: ",
      `${outputFileDirectory}`
    );
  } catch (err) {
    console.error("An error occurred:", err);
  }
}

const dataType = argv.datatype;
const outputFileName = config[dataType].outputFile;
const outputFileDirectory = config.outputPath + outputFileName;
const stubbedJsonUrl = `https://raw.githubusercontent.com/nhsconnect/prm-gp2gp-data-pipeline/master/tests/e2e/platform_metrics_calculator/test_platform_metrics_calculator_pipeline/expected_json_output/${outputFileName}`;

getStubData(outputFileDirectory, stubbedJsonUrl);

module.exports = { getStubData };
