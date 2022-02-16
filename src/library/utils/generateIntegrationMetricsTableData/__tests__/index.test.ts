import { generateIntegratedMetricsTableData } from "../index";
import practiceMetricsMock from "../../../../../__mocks__/practiceMetricsMock.json";
import practiceMetricsPercentageMock from "../../../../../__mocks__/practiceIntegrationMetricsPercentageMock.json";

describe("generateMetricsTableData", () => {
  it("returns metrics table data in percentage format", () => {
    practiceMetricsMock.forEach((practice, i) => {
      const actual = generateIntegratedMetricsTableData(
        practice.metrics[0].requestedTransfers
      );
      const expected =
        practiceMetricsPercentageMock[i].metrics[0].requestedTransfers;
      expect(actual).toEqual(expected);
    });
  });
});