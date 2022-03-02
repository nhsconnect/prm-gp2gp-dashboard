import { getIntegrationTimesCsv } from "../index";
import {
  practiceWithOneMonthMetrics,
  practiceWithTwoMonths,
} from "../../../../../__mocks__/practiceMetricsTestData";

describe("getIntegrationTimesCsv", () => {
  it("transforms practice metrics into csv rows for 6 months", async () => {
    const ccgPractices = [practiceWithOneMonthMetrics, practiceWithTwoMonths];
    const ccgName = "Some CCG";
    const ccgOdsCode = "CCG_ABC_123";
    const actual = getIntegrationTimesCsv(
      ccgPractices,
      ccgName,
      ccgOdsCode,
      "last6Months"
    );
    const expected = [
      "Some CCG,CCG_ABC_123,GP Practice,A12345,February 2020,5,3,60%,2,40%,0,n/a",
      "Some CCG,CCG_ABC_123,Second GP Practice,A12346,February 2020,22,5,22.7%,6,27.3%,11,50%",
      "Some CCG,CCG_ABC_123,Second GP Practice,A12346,January 2020,22,5,22.7%,6,27.3%,11,50%",
    ];

    expect(actual).toEqual(expected);
  });

  it("transforms practice metrics into csv rows for latest month", async () => {
    const ccgPractices = [practiceWithOneMonthMetrics, practiceWithTwoMonths];
    const ccgName = "Some CCG";
    const ccgOdsCode = "CCG_ABC_123";
    const actual = getIntegrationTimesCsv(
      ccgPractices,
      ccgName,
      ccgOdsCode,
      "latestMonth"
    );
    const expected = [
      "Some CCG,CCG_ABC_123,GP Practice,A12345,February 2020,5,3,60%,2,40%,0,n/a",
      "Some CCG,CCG_ABC_123,Second GP Practice,A12346,February 2020,22,5,22.7%,6,27.3%,11,50%",
    ];

    expect(actual).toEqual(expected);
  });
});
