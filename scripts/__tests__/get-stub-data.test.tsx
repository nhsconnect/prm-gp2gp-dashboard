import moxios from "moxios";
import fs from "fs";
import { getStubData } from "../get-stub-data";
import { mockAPIResponse } from "../../__mocks__/api";
import util from "util";
import yargs from "yargs";

jest.mock("fs");
const spy = jest.spyOn(console, "info").mockImplementation();

jest.mock("yargs", () => ({
  argv: {
    datatype: "practiceMetrics",
  },
}));

jest.mock("util", () => ({
  promisify: jest.fn((func: any) => func),
}));

describe("getStubData", () => {
  beforeAll(() => {
    moxios.install();
  });

  afterAll(() => {
    moxios.uninstall();
  });

  afterAll(() => {
    spy.mockRestore();
  });

  it("writes to specified file path with API response JSON ", async () => {
    const data = { dummy: "data" };
    mockAPIResponse(200, data);
    await getStubData("filepath/file.json", "https://url");
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(fs.writeFile).toHaveBeenCalledWith(
      "filepath/file.json",
      JSON.stringify(data)
    );
    expect(spy).toHaveBeenCalledWith(
      "Successfully wrote stubbed JSON data from data-pipeline to: ",
      "filepath/file.json"
    );
  });
});
