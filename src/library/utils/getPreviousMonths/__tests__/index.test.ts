import { getPreviousMonths } from "../index";

describe("getPreviousMonths", () => {
  it("returns month select options with default value index 0 given 1 (January)", () => {
    const monthSelect = getPreviousMonths(1, 6);
    expect(monthSelect.defaultValue).toEqual("0");
  });

  it("returns month select options with first option being January given 1 (January)", () => {
    const monthSelect = getPreviousMonths(1, 6);
    expect(monthSelect.options[0].displayText).toEqual("January");
  });

  it("returns month select options with last option being August given 1 (January)", () => {
    const monthSelect = getPreviousMonths(1, 6);
    expect(monthSelect.options[5].displayText).toEqual("August");
  });
});
