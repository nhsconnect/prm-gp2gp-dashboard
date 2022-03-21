import { getPreviousMonths } from "../index";

describe("getPreviousMonths", () => {
  it("returns month select options with default value index 0 given month 1 (January) and year 2020", () => {
    const monthSelect = getPreviousMonths(1, 2020, 6);
    expect(monthSelect.defaultValue).toEqual("0");
  });

  it("returns month select options with first option being January 2020 given month 1 (January) and year 2020", () => {
    const monthSelect = getPreviousMonths(1, 2020, 6);
    expect(monthSelect.options[0].displayText).toEqual("January 2020");
  });

  it("returns month select options with last option being August 2019 given month 1 (January) and year 2020", () => {
    const monthSelect = getPreviousMonths(1, 2020, 6);
    expect(monthSelect.options[5].displayText).toEqual("August 2019");
  });
});
