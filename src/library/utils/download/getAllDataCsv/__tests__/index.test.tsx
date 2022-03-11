import { getAllDataCsv } from "../index";
import {
  practiceWithCommasInTheName,
  practiceWithOneMonthMetrics,
  practiceWithTwoMonths,
} from "../../../../../../__mocks__/practiceMetricsTestData";
import { TimeframeOptions } from "../../../../enums/datasetTypeOptions";

describe("getAllDataCsv", () => {
  it("transforms practice metrics into csv rows for 6 months for integration times and transfers requested", async () => {
    const ccgPractices = [practiceWithOneMonthMetrics, practiceWithTwoMonths];
    const actual = getAllDataCsv(ccgPractices, TimeframeOptions.Last6Months);
    const expected = [
      '"Some CCG",11D,"GP Practice",A12345,February 2020,7,5,71.42%,2,28.6%,5,3,60%,2,40%,0,0%',
      '"Another CCG",10E,"Second GP Practice",A12346,February 2020,22,22,100%,0,0%,22,5,22.7%,6,27.3%,11,50%',
      '"Another CCG",10E,"Second GP Practice",A12346,January 2020,22,22,100%,0,0%,22,5,22.7%,6,27.3%,11,50%',
    ];

    expect(actual).toEqual(expected);
  });

  it("transforms practice metrics into csv rows for latest month for integration times and transfers requested", async () => {
    const ccgPractices = [practiceWithOneMonthMetrics, practiceWithTwoMonths];
    const actual = getAllDataCsv(ccgPractices, TimeframeOptions.LatestMonth);
    const expected = [
      '"Some CCG",11D,"GP Practice",A12345,February 2020,7,5,71.42%,2,28.6%,5,3,60%,2,40%,0,0%',
      '"Another CCG",10E,"Second GP Practice",A12346,February 2020,22,22,100%,0,0%,22,5,22.7%,6,27.3%,11,50%',
    ];

    expect(actual).toEqual(expected);
  });

  it("transforms practice metrics when names contain commas", async () => {
    const ccgPractices = [practiceWithCommasInTheName];
    const actual = getAllDataCsv(ccgPractices, TimeframeOptions.LatestMonth);
    const expected = [
      '"Test, and test ccg",11D,"Dr GP1, Dr GP2, Practice",A12345,February 2020,7,5,71.42%,2,28.6%,5,3,60%,2,40%,0,0%',
    ];

    expect(actual).toEqual(expected);
  });
});
