const aws = require("aws-sdk");

const ssmClient = new aws.SSM({ region: "eu-west-2" });

const getSsmValue = async (ssmName) => {
  try {
    const response = await ssmClient
      .getParameter({
        Name: ssmName,
        WithDecryption: true,
      })
      .promise();
    const ssmValue = response.Parameter.Value;
    console.info(
      `Successfully fetched SSM param "${ssmName}" with value: ${ssmValue}`
    );
    return ssmValue;
  } catch (err) {
    console.error(
      `An error occurred when fetching SSM param ${ssmName}: ${err}`
    );
  }
};

module.exports = { getSsmValue };
