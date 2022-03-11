import { getIntegrationTimesCsv } from "../index";
import {
  practiceWithCommasInTheName,
  practiceWithOneMonthMetrics,
  practiceWithTwoMonths,
} from "../../../../../../__mocks__/practiceMetricsTestData";
import { TimeframeOptions } from "../../../../enums/datasetTypeOptions";

describe("getIntegrationTimesCsv", () => {
  it("transforms practice metrics into csv rows for 6 months for integration times", async () => {
    const ccgPractices = [practiceWithOneMonthMetrics, practiceWithTwoMonths];
    const ccgName = "Some CCG";
    const ccgOdsCode = "CCG_ABC_123";
    const actual = getIntegrationTimesCsv(
      ccgPractices,
      ccgName,
      ccgOdsCode,
      TimeframeOptions.Last6Months
    );
    const expected = [
      '"Some CCG",CCG_ABC_123,"GP Practice",A12345,February 2020,5,3,60%,2,40%,0,0%',
      '"Some CCG",CCG_ABC_123,"Second GP Practice",A12346,February 2020,22,5,22.7%,6,27.3%,11,50%',
      '"Some CCG",CCG_ABC_123,"Second GP Practice",A12346,January 2020,22,5,22.7%,6,27.3%,11,50%',
    ];

    expect(actual).toEqual(expected);
  });

  it("transforms practice metrics into csv rows for latest month for integration times", async () => {
    const ccgPractices = [practiceWithOneMonthMetrics, practiceWithTwoMonths];
    const ccgName = "Some CCG";
    const ccgOdsCode = "CCG_ABC_123";
    const actual = getIntegrationTimesCsv(
      ccgPractices,
      ccgName,
      ccgOdsCode,
      TimeframeOptions.LatestMonth
    );
    const expected = [
      '"Some CCG",CCG_ABC_123,"GP Practice",A12345,February 2020,5,3,60%,2,40%,0,0%',
      '"Some CCG",CCG_ABC_123,"Second GP Practice",A12346,February 2020,22,5,22.7%,6,27.3%,11,50%',
    ];

    expect(actual).toEqual(expected);
  });

  it("transforms practice metrics when names contain commas", async () => {
    const ccgPractices = [practiceWithCommasInTheName];
    const ccgName = "Test, and test ccg";
    const ccgOdsCode = "CCG_ABC_123";
    const actual = getIntegrationTimesCsv(
      ccgPractices,
      ccgName,
      ccgOdsCode,
      TimeframeOptions.LatestMonth
    );
    const expected = [
      '"Test, and test ccg",CCG_ABC_123,"Dr GP1, Dr GP2, Practice",A12345,February 2020,5,3,60%,2,40%,0,0%',
    ];

    expect(actual).toEqual(expected);
  });
});
