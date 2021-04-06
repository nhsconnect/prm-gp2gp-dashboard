import moxios from "moxios";
import fs from "fs";
import { getStubData } from "../get-stub-data";
import { mockAPIResponse } from "../../__mocks__/api";
import util from "util";
import yargs from "yargs";

jest.mock("fs", () => ({
  promises: {
    writeFile: jest.fn(),
  },
}));

jest.mock("yargs", () => ({
  argv: {
    writeFile: jest.fn(),
  },
}));

jest.mock("util", () => ({
  promisify: jest.fn(func => func),
}));

describe("getStubData", () => {
  beforeAll(() => {
    moxios.install();
  });

  afterAll(() => {
    moxios.uninstall();
  });

  it("test", async () => {
    const data = { dummy: "data" };
    mockAPIResponse(200, data);
    // TODO: Fix below
    // await getStubData("filepath/file.json", "https://url")
    // expect(fs.promises.writeFile).toHaveBeenCalledTimes(1);
  });
});
