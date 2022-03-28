import { getSsmValue } from "../get-ssm-value";

jest.mock("aws-sdk", () => ({
  SSM: jest.fn(() => ({
    getParameter: jest.fn().mockReturnThis(),
    promise: jest
      .fn()
      .mockResolvedValue({ Parameter: { Value: "some SSM value" } }),
  })),
}));

describe("getSsmValue", () => {
  const consoleLogSpy = jest.spyOn(console, "info").mockImplementation();

  afterEach(() => {
    consoleLogSpy.mockReset();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  it("reads ssm param", async () => {
    const response = await getSsmValue("someName");
    expect(response).toBe("some SSM value");
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Successfully fetched SSM param "someName" with value: some SSM value'
    );
  });
});
