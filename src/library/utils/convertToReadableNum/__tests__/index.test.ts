import { convertToReadableNum } from "../index";

describe("convertToReadableNum", () => {
  it.each([
    [12321, "12,321"],
    [3513435153531, "3,513,435,153,531"],
    [123, "123"],
    [0, "0"],
    [0.4353524341, "0.435"],
  ])(
    "convert number to string with commas every third non-decimal digit",
    (number, expected) => {
      const actual = convertToReadableNum(number);
      expect(actual).toEqual(expected);
    }
  );
});
