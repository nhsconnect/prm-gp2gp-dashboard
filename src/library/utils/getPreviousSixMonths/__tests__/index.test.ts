import {getPreviousSixMonths} from "../index";

describe("getPreviousSixMonths", () => {
  it("returns month select options with default value January given 1 (January)", () => {
    const monthSelect = getPreviousSixMonths(1);
    expect(monthSelect.defaultValue).toEqual("January");
  });

  it("returns month select options with first option being January given 1 (January)", () => {
    const monthSelect = getPreviousSixMonths(1);
    expect(monthSelect.options[0].displayText).toEqual("January");
  });

  it("returns month select options with last option being August given 1 (January)", () => {
    const monthSelect = getPreviousSixMonths(1);
    expect(monthSelect.options[5].displayText).toEqual("August");
  });
});
