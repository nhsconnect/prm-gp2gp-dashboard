import { getMetricsFromS3 } from "../getMetricsFromS3";

describe("getMetricsFromS3 failure", () => {
  const consoleErrorSpy = jest
    .spyOn(global.console, "error")
    .mockImplementation(jest.fn());

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
