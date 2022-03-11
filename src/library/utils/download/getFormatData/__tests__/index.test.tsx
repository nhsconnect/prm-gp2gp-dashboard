import { getFormatData } from "../index";
import {
  practiceWithOneMonthMetrics,
  practiceWithTwoMonths,
} from "../../../../../../__mocks__/practiceMetricsTestData";
import {
  DatasetTypeOptions,
  TimeframeOptions,
} from "../../../../enums/datasetTypeOptions";

describe("getFormatData - integration tests ", () => {
  it("formats data when choosing last 6 months for integration times", async () => {
    const ccgPractices = [practiceWithOneMonthMetrics, practiceWithTwoMonths];
    let formatDataForSelectedOptions = getFormatData(ccgPractices);
    const expected =
      "CCG name,CCG ODS,Requesting practice name,Practice ODS,Month,GP2GP Transfers received,Integrated within 3 days,Integrated within 3 days - %,Integrated within 8 days ,Integrated within 8 days - %,Not integrated within 8 days (paper copy requested),Not integrated within 8 days (paper copy requested) - %\n" +
      '"Some CCG",11D,"GP Practice",A12345,February 2020,5,3,60%,2,40%,0,0%\n' +
      '"Another CCG",10E,"Second GP Practice",A12346,February 2020,22,5,22.7%,6,27.3%,11,50%\n' +
      '"Another CCG",10E,"Second GP Practice",A12346,January 2020,22,5,22.7%,6,27.3%,11,50%';

    const actual = formatDataForSelectedOptions(
      TimeframeOptions.Last6Months,
      DatasetTypeOptions.IntegrationTimes
    );

    expect(actual).toEqual(expected);
  });

  it("formats data when choosing latest month for transfers requested", async () => {
    const ccgPractices = [practiceWithOneMonthMetrics, practiceWithTwoMonths];
    let formatDataForSelectedOptions = getFormatData(ccgPractices);
    const expected =
      "CCG name,CCG ODS,Requesting practice name,Practice ODS,Month,GP2GP transfers requested,GP2GP transfers received,GP2GP transfers received - %,GP2GP technical failures (paper copy requested),GP2GP technical failures (paper copy requested) - %\n" +
      '"Some CCG",11D,"GP Practice",A12345,February 2020,7,5,71.42%,2,28.6%\n' +
      '"Another CCG",10E,"Second GP Practice",A12346,February 2020,22,22,100%,0,0%';

    const actual = formatDataForSelectedOptions(
      TimeframeOptions.LatestMonth,
      DatasetTypeOptions.TransfersRequested
    );
    expect(actual).toEqual(expected);
  });

  it("formats data when choosing last 6 months for all metrics", async () => {
    const ccgPractices = [practiceWithOneMonthMetrics, practiceWithTwoMonths];
    let formatDataForSelectedOptions = getFormatData(ccgPractices);
    const expected =
      "CCG name,CCG ODS,Requesting practice name,Practice ODS,Month,GP2GP transfers requested,GP2GP transfers received,GP2GP transfers received - %,GP2GP technical failures (paper copy requested),GP2GP technical failures (paper copy requested) - %,GP2GP Transfers received,Integrated within 3 days,Integrated within 3 days - %,Integrated within 8 days ,Integrated within 8 days - %,Not integrated within 8 days (paper copy requested),Not integrated within 8 days (paper copy requested) - %\n" +
      '"Some CCG",11D,"GP Practice",A12345,February 2020,7,5,71.42%,2,28.6%,5,3,60%,2,40%,0,0%\n' +
      '"Another CCG",10E,"Second GP Practice",A12346,February 2020,22,22,100%,0,0%,22,5,22.7%,6,27.3%,11,50%\n' +
      '"Another CCG",10E,"Second GP Practice",A12346,January 2020,22,22,100%,0,0%,22,5,22.7%,6,27.3%,11,50%';

    const actual = formatDataForSelectedOptions(
      TimeframeOptions.Last6Months,
      DatasetTypeOptions.AllMetrics
    );

    expect(actual).toEqual(expected);
  });
});
