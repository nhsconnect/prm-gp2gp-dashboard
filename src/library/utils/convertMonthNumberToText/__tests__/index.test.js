import { convertMonthNumberToText } from "../index";

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
