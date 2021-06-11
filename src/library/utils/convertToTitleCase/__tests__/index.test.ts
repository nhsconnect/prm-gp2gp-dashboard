import { convertToTitleCase } from "../index";

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

  it("does not convert acronyms to title case", async () => {
    const actual = convertToTitleCase("NHS ENGLAND GP PRACTICE");
    const expected = "NHS England GP Practice";

    expect(actual).toEqual(expected);
  });
});
