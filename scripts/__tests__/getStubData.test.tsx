import fs from "fs";
import { getStubData } from "../getStubData";
import util from "util";
import yargs from "yargs";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const axiosMock = new MockAdapter(axios);

jest.mock("fs");

jest.mock("yargs", () => ({
  argv: {
    datatype: "practiceMetrics",
  },
}));

jest.mock("util", () => ({
  promisify: jest.fn((func: any) => func),
}));

describe("getStubData", () => {
  const consoleLogSpy = jest.spyOn(console, "info").mockImplementation();
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

  afterEach(() => {
    axiosMock.reset();
    consoleLogSpy.mockReset();
    consoleErrorSpy.mockReset();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("writes to specified file path with API response JSON ", async () => {
    const data = { dummy: "data" };
    const urlStub = "https://url";

    axiosMock.onGet(urlStub).reply(200, data);

    await getStubData("filepath/file.json", urlStub);
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(fs.writeFile).toHaveBeenCalledWith(
      "filepath/file.json",
      JSON.stringify(data)
    );
  });

  it("logs when successfully stubbed JSON files", async () => {
    const data = { dummy: "data" };
    const urlStub = "https://url";

    axiosMock.onGet(urlStub).reply(200, data);

    await getStubData("filepath/file.json", urlStub);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Successfully wrote stubbed JSON data from data-pipeline to: ",
      "filepath/file.json"
    );
  });

  it("logs an error when it fails to fetch the json file", async () => {
    const data = { dummy: "data" };
    const urlStub = "https://url";

    axiosMock.onGet(urlStub).reply(400, data);

    try {
      await getStubData("filepath/file.json", urlStub);
    } catch (e) {
      expect(fs.writeFile).toHaveBeenCalledTimes(0);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "An error occurred: Error: Request failed with status code 400"
      );
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);
    }
  });
});
