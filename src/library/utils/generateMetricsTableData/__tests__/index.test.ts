import { sortOrganisationsAlphabetically } from "../../sortOrganisationsAlphabetically";
import { generateMetricsTableData } from "../index";
import practiceMetricsMock from "../../../../../__mocks__/practiceMetricsMock.json";
import practiceMetricsPercentageMock from "../../../../../__mocks__/practiceMetricsPercentageMock.json";

describe("generateMetricsTableData", () => {
  it("returns metrics table data in percentage format", () => {
    const actual = generateMetricsTableData(
      practiceMetricsMock[0].metrics[0].requestedTransfers
    );
    const expected =
      practiceMetricsPercentageMock[0].metrics[0].requestedTransfers;

    expect(actual).toEqual(expected);
  });
});
