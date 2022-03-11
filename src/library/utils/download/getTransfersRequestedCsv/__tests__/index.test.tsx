import { getTransfersRequestedCsv } from "../index";
import {
  practiceWithCommasInTheName,
  practiceWithOneMonthMetrics,
  practiceWithTwoMonths,
} from "../../../../../../__mocks__/practiceMetricsTestData";
import { TimeframeOptions } from "../../../../enums/datasetTypeOptions";

describe("getTransfersRequestedCsv", () => {
  it("transforms practice metrics into csv rows for 6 months for transfers requested", async () => {
    const ccgPractices = [practiceWithOneMonthMetrics, practiceWithTwoMonths];
    const ccgName = "Some CCG";
    const ccgOdsCode = "CCG_ABC_123";
    const actual = getTransfersRequestedCsv(
      ccgPractices,
      ccgName,
      ccgOdsCode,
      TimeframeOptions.Last6Months
    );
    const expected = [
      '"Some CCG",CCG_ABC_123,"GP Practice",A12345,February 2020,7,5,71.42%,2,28.6%',
      '"Some CCG",CCG_ABC_123,"Second GP Practice",A12346,February 2020,22,22,100%,0,0%',
      '"Some CCG",CCG_ABC_123,"Second GP Practice",A12346,January 2020,22,22,100%,0,0%',
    ];

    expect(actual).toEqual(expected);
  });

  it("transforms practice metrics into csv rows for latest month for transfers requested", async () => {
    const ccgPractices = [practiceWithOneMonthMetrics, practiceWithTwoMonths];
    const ccgName = "Some CCG";
    const ccgOdsCode = "CCG_ABC_123";
    const actual = getTransfersRequestedCsv(
      ccgPractices,
      ccgName,
      ccgOdsCode,
      TimeframeOptions.LatestMonth
    );
    const expected = [
      '"Some CCG",CCG_ABC_123,"GP Practice",A12345,February 2020,7,5,71.42%,2,28.6%',
      '"Some CCG",CCG_ABC_123,"Second GP Practice",A12346,February 2020,22,22,100%,0,0%',
    ];

    expect(actual).toEqual(expected);
  });

  it("transforms practice metrics when names contain commas", async () => {
    const ccgPractices = [practiceWithCommasInTheName];
    const ccgName = "Test, and test ccg";
    const ccgOdsCode = "CCG_ABC_123";
    const actual = getTransfersRequestedCsv(
      ccgPractices,
      ccgName,
      ccgOdsCode,
      TimeframeOptions.LatestMonth
    );
    const expected = [
      '"Test, and test ccg",CCG_ABC_123,"Dr GP1, Dr GP2, Practice",A12345,February 2020,7,5,71.42%,2,28.6%',
    ];

    expect(actual).toEqual(expected);
  });
});
