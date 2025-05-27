import { convertToReadableDate } from "../index";

describe("convertToReadableDate", () => {
  it("returns month and year string given a date", () => {
    const utcDate = "2022-03-31 16:51:21.353977";
    const expectedDate = "March 2022";
    const actualDate = convertToReadableDate(utcDate);
    expect(actualDate).toEqual(expectedDate);
  });
});
