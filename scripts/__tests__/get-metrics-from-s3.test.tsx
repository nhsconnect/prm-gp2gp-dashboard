import { getSsmValue } from "../get-ssm-value";
import { getS3data } from "../get-s3-data";
import { getMetricsFromS3 } from "../get-metrics-from-s3";

jest.mock("../get-ssm-value", () => ({
  getSsmValue: jest.fn().mockResolvedValue("someValue"),
}));

jest.mock("../get-s3-data");

jest.mock("yargs", () => ({
  argv: {
    datatype: "practiceMetrics",
  },
}));

describe("getMetricsFromS3", () => {
  it("reads ssm param", async () => {
    await getMetricsFromS3();

    expect(getSsmValue).toHaveBeenCalledWith(
      "/registrations/TEST_ENV/data-pipeline/metrics-calculator/practice-metrics-s3-uri"
    );

    expect(getS3data).toHaveBeenCalledWith(
      {
        Bucket: "prm-gp2gp-metrics-TEST_ENV",
        Key: "someValue",
      },
      "src/data/organisations/practiceMetrics.json"
    );
  });
});
