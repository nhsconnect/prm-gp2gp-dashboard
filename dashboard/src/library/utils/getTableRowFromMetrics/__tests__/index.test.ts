import { getTableRowFromMetrics } from "../index";
import practiceMetricMock from "../../../../../__mocks__/practiceMetricsMock.json";
import { PageTemplatePath } from "../../../enums/pageTemplatePath";
import { Units } from "../../../enums/units";

jest.mock("axios");

describe("getTableRowFromMetrics", () => {
  it("returns row with integration times numbers given metrics data and pageTemplatePath", async () => {
    const actual = getTableRowFromMetrics(
      "First element",
      practiceMetricMock[0].metrics[0],
      PageTemplatePath.IntegrationTimes,
      Units.NUMBERS
    );
    const expected = ["First element", 5, 3, 2, 0];
    expect(actual).toEqual(expected);
  });

  it("returns row with integration times percentages given metrics data and pageTemplatePath", async () => {
    const actual = getTableRowFromMetrics(
      "First element",
      practiceMetricMock[0].metrics[0],
      PageTemplatePath.IntegrationTimes,
      Units.PERCENTAGES
    );
    const expected = ["First element", 5, "60%", "40%", "n/a"];

    expect(actual).toEqual(expected);
  });

  it("returns row with transfers requested numbers given metrics data and pageTemplatePath", async () => {
    const actual = getTableRowFromMetrics(
      "First element",
      practiceMetricMock[0].metrics[0],
      PageTemplatePath.GP2GPTransfersRequested,
      Units.NUMBERS
    );
    const expected = ["First element", 7, 5, 2];
    expect(actual).toEqual(expected);
  });

  it("returns row with transfers requested percentages given metrics data and pageTemplatePath", async () => {
    const actual = getTableRowFromMetrics(
      "First element",
      practiceMetricMock[0].metrics[0],
      PageTemplatePath.GP2GPTransfersRequested,
      Units.PERCENTAGES
    );
    const expected = ["First element", 7, "71.42%", "28.6%"];
    expect(actual).toEqual(expected);
  });
});
