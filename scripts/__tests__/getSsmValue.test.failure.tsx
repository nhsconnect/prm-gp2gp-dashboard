import { getSsmValue } from "../getSsmValue";

// couldn't easily mock promisify success/failure in the same test file
jest.mock("aws-sdk", () => ({
  SSM: jest.fn(() => ({
    getParameter: jest.fn().mockReturnThis(),
    promise: jest.fn().mockRejectedValue("failure"),
  })),
}));

describe("getSsmValue failure", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

  afterEach(() => {
    consoleErrorSpy.mockReset();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("reads ssm param", async () => {
    const response = await getSsmValue("someName");
    expect(response).toBe(undefined);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "An error occurred when fetching SSM param someName: failure"
    );
  });
});
