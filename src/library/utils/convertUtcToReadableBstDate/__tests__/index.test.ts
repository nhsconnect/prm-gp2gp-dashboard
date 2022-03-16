import { convertUtcToReadableBstDate } from "../index";

describe("convertUtcToReadableBstDate", () => {
  const cases = [
    ["2022-03-31 16:51:21.353977", "31 March 2022 5:51 pm"],
    ["2022-03-15 16:51:21.353977", "15 March 2022 4:51 pm"],
    ["2022-03-15 04:51:21.353977", "15 March 2022 4:51 am"],
  ];

  it.each(cases)(
    "returns date as BST given UTC date",
    (utcDate, expectedBstDate) => {
      const actualDate = convertUtcToReadableBstDate(utcDate);
      expect(actualDate).toEqual(expectedBstDate);
    }
  );
});
