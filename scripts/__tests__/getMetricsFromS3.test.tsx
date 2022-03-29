import { getSsmValue } from "../getSsmValue";
import { getS3data } from "../getS3Data";
import { getMetricsFromS3 } from "../getMetricsFromS3";

jest.mock("../getSsmValue", () => ({
  getSsmValue: jest.fn().mockResolvedValue("someValue"),
}));

jest.mock("../getS3Data");

jest.mock("yargs", () => ({
  argv: {
    datatype: "practiceMetrics",
  },
}));

describe("getMetricsFromS3", () => {
  it("reads ssm param", async () => {
    await getMetricsFromS3();

    expect(getSsmValue).toHaveBeenCalledWith(
      "/registrations/TEST_ENV/data-pipeline/metrics-calculator/practice-metrics-s3-path"
    );

    expect(getS3data).toHaveBeenCalledWith(
      {
        Bucket: "prm-gp2gp-metrics-TEST_ENV",
        Key: `v10/someValue`,
      },
      "src/data/organisations/practiceMetrics.json"
    );
  });
});
