import {
  convertMonthNumberToText,
  convertToTitleCase,
} from "../../common/index";

describe("convertMonthNumberToText", () => {
  it("returns January given 1", () => {
    const monthText = convertMonthNumberToText(1);
    expect(monthText).toEqual("January");
  });

  it("returns December given 12", () => {
    const monthText = convertMonthNumberToText(12);
    expect(monthText).toEqual("December");
  });
});

describe("convertToTitleCase", () => {
  it("returns one word in title case", async () => {
    const actual = convertToTitleCase("TEST");
    const expected = "Test";

    expect(actual).toEqual(expected);
  });

  it("returns two words in title case", async () => {
    const actual = convertToTitleCase("MARKET SQUARE");
    const expected = "Market Square";

    expect(actual).toEqual(expected);
  });

  it("returns two words in title case without removing special characters", async () => {
    const actual = convertToTitleCase("MARKET, SQUARE");
    const expected = "Market, Square";

    expect(actual).toEqual(expected);
  });
});
