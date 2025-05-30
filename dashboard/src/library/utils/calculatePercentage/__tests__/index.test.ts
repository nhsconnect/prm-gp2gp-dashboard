import { calculatePercentage } from "../index";

describe("calculatePercentage", () => {
  it("rounds down to one digit", () => {
    const actual = calculatePercentage(1, 3);
    const expected = 33.3;

    expect(actual).toEqual(expected);
  });

  it("rounds up to one digit", () => {
    const actual = calculatePercentage(2, 3);
    const expected = 66.7;

    expect(actual).toEqual(expected);
  });

  it("return null when the total is 0", () => {
    const actual = calculatePercentage(0, 0);
    const expected = null;

    expect(actual).toEqual(expected);
  });

  it("return 0 when portion is 0", () => {
    const actual = calculatePercentage(0, 1);
    const expected = 0;

    expect(actual).toEqual(expected);
  });
});
