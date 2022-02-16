import { generateTransfersRequestedMetricsTableData } from "../index";
import practiceMetricsMock from "../../../../../__mocks__/practiceMetricsMock.json";
import practiceMetricsPercentageMock from "../../../../../__mocks__/practiceTransfersRequestedMetricsPercentageMock.json";

describe("generateTransfersRequestedMetricsTableData", () => {
  it("returns metrics table data in percentage format", () => {
    practiceMetricsMock.forEach((practice, i) => {
      const actual = generateTransfersRequestedMetricsTableData(
        practice.metrics[0].requestedTransfers
      );
      const expected =
        practiceMetricsPercentageMock[i].metrics[0].requestedTransfers;
      expect(actual).toEqual(expected);
    });
  });
});
