import { convertUtcToReadableBstDate } from "../index";

describe("convertUtcToReadableBstDate", () => {
  it("returns month and year string given UTC date", () => {
    const utcDate = "2022-03-31 16:51:21.353977";
    const expectedDate = "March 2022";
    const actualDate = convertUtcToReadableBstDate(utcDate);
    expect(actualDate).toEqual(expectedDate);
  });
});
