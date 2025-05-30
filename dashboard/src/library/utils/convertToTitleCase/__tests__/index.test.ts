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

  it("returns two words in title case without removing special characters", async () => {
    const actual = convertToTitleCase("MARKET, SQUARE");
    const expected = "Market, Square";

    expect(actual).toEqual(expected);
  });

  it("does not convert acronyms to title case but keeps them uppercase", async () => {
    const actual = convertToTitleCase("NHS ENGLAND GP PRACTICE");
    const expected = "NHS England GP Practice";

    expect(actual).toEqual(expected);
  });

  it("returns ICB capitalisation correctly", () => {
    const actual = convertToTitleCase("NHS ENGLAND ICB - 10C");
    const expected = "NHS England ICB - 10C";

    expect(actual).toEqual(expected);
  });

  it("handles multiple dashes for ICB", async () => {
    const actual = convertToTitleCase("SOME-SORT OF ICB - 10c");
    const expected = "Some-sort Of ICB - 10C";

    expect(actual).toEqual(expected);
  });
});
