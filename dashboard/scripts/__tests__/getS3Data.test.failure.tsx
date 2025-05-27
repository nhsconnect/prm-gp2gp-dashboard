import fs from "fs";
import { getS3data } from "../getS3Data";
import util from "util";

jest.mock("fs");

// couldn't easily mock promisify success/failure in the same test file
jest.mock("util", () => ({
  promisify: jest.fn(() => jest.fn().mockRejectedValue("failure")),
}));

describe("getS3Data failure", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  const mockExit = jest.spyOn(process, "exit").mockImplementation();

  afterEach(() => {
    consoleErrorSpy.mockReset();
    mockExit.mockReset();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
    mockExit.mockRestore();
  });

  it("logs when failing to fetch data from s3", async () => {
    const outputPath = "some/path";

    await getS3data({ Bucket: "someBucket", Key: "someS3Key" }, outputPath);
    expect(fs.writeFile).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith("An error occurred: failure");
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
