import { getMetricsFromS3 } from "../getMetricsFromS3";

// reduce test log noise
jest.mock("console", () => ({ error: jest.fn() }));

describe("getMetricsFromS3 failure", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

  afterEach(() => {
    consoleErrorSpy.mockReset();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("throws error when datatype is not set", async () => {
    await getMetricsFromS3();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      Error(
        "Please specify which datatype with --datatype practiceMetrics|nationalMetrics"
      )
    );
  });
});
