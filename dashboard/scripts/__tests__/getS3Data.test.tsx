import fs from "fs";
import { getS3data } from "../getS3Data";
import util from "util";

jest.mock("fs");

jest.mock("aws-sdk", () => {
  return {
    S3: jest.fn(() => ({
      getObject: jest.fn().mockReturnThis(),
      promise: jest.fn().mockRejectedValue(new Error("Successfully wrote to: some/path")),
    })),
  };
});

jest.mock("util", () => ({
  promisify: jest
    .fn((func: any) => func)
    .mockReturnValueOnce(() => ({ Body: "something" })),
}));

describe("getS3Data", () => {
  const consoleLogSpy = jest.spyOn(console, "info").mockImplementation();

  afterEach(() => {
    consoleLogSpy.mockReset();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  it("reads data from s3", async () => {
    const outputPath = "some/path";

    await getS3data({ Bucket: "someBucket", Key: "someS3Key" }, outputPath);
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(fs.writeFile).toHaveBeenCalledWith(outputPath, "something");
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Successfully wrote to: some/path"
    );
  });
});
