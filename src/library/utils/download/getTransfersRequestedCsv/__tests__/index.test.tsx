import { getTransfersRequestedCsv } from "../index";
import {
  practiceWithOneMonthMetrics,
  practiceWithTwoMonths,
} from "../../../../../../__mocks__/practiceMetricsTestData";

describe("getTransfersRequestedCsv", () => {
  it("transforms practice metrics into csv rows for 6 months for transfers requested", async () => {
    const ccgPractices = [practiceWithOneMonthMetrics, practiceWithTwoMonths];
    const ccgName = "Some CCG";
    const ccgOdsCode = "CCG_ABC_123";
    const actual = getTransfersRequestedCsv(
      ccgPractices,
      ccgName,
      ccgOdsCode,
      "last-6-months"
    );
    const expected = [
      "Some CCG,CCG_ABC_123,GP Practice,A12345,February 2020,7,5,71.42%,2,28.6%",
      "Some CCG,CCG_ABC_123,Second GP Practice,A12346,February 2020,22,22,100%,0,0%",
      "Some CCG,CCG_ABC_123,Second GP Practice,A12346,January 2020,22,22,100%,0,0%",
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
      "latest-month"
    );
    const expected = [
      "Some CCG,CCG_ABC_123,GP Practice,A12345,February 2020,7,5,71.42%,2,28.6%",
      "Some CCG,CCG_ABC_123,Second GP Practice,A12346,February 2020,22,22,100%,0,0%",
    ];

    expect(actual).toEqual(expected);
  });
});
