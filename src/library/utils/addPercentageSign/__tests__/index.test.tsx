import { addPercentageSign } from "../index";

describe("convertToPercentage", () => {
  it("convert number to string with percentage sign", () => {
    const actual = addPercentageSign(25);
    const expected = "25%";

    expect(actual).toEqual(expected);
  });

  it("return n/a when the number is null", () => {
    const actual = addPercentageSign(null);
    const expected = "n/a";

    expect(actual).toEqual(expected);
  });

  it("return 0% when the number is 0", () => {
    const actual = addPercentageSign(0);
    const expected = "0%";

    expect(actual).toEqual(expected);
  });
});
