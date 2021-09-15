import { calculatePercentage } from "../index";

describe("calculatePercentage", () => {
  it("rounds down to one digit", () => {
    const actual = calculatePercentage(1, 3);
    const expected = "33.3";

    expect(actual).toEqual(expected);
  });

  it("rounds up to one digit", () => {
    const actual = calculatePercentage(2, 3);
    const expected = "66.7";

    expect(actual).toEqual(expected);
  });

  it("returns trailing 0", () => {
    const actual = calculatePercentage(1, 2);
    const expected = "50.0";

    expect(actual).toEqual(expected);
  });
});
