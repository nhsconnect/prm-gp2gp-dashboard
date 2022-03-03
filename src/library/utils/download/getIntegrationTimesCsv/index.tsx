import {
  PracticeMetricsType,
  PracticeType,
  RequestedTransfersType,
} from "../../../types/practice.types";
import { IntegrationRowHeadings } from "../../../enums/csvRowHeadings";
import { convertMonthNumberToText } from "../../convertMonthNumberToText";
import { addPercentageSign } from "../../addPercentageSign";

function getIntegrationTimesRow(
  ccgName: string,
  ccgOdsCode: string,
  name: string,
  odsCode: string,
  month: number,
  year: number,
  requestedTransfers: RequestedTransfersType
) {
  return {
    [IntegrationRowHeadings.CCG_NAME]: ccgName,
    [IntegrationRowHeadings.CCG_ODS]: ccgOdsCode,
    [IntegrationRowHeadings.REQUESTING_PRACTICE_NAME]: name,
    [IntegrationRowHeadings.PRACTICE_ODS]: odsCode,
    [IntegrationRowHeadings.MONTH_AND_YEAR]:
      convertMonthNumberToText(month) + " " + year,
    [IntegrationRowHeadings.TRANSFERS_RECEIVED_COUNT]:
      requestedTransfers.receivedCount,
    [IntegrationRowHeadings.INTEGRATED_WITHIN_3_DAYS_COUNT]:
      requestedTransfers.integratedWithin3DaysCount,
    [IntegrationRowHeadings.INTEGRATED_WITHIN_3_DAYS_PERCENT]:
      addPercentageSign(
        requestedTransfers.integratedWithin3DaysPercentOfReceived
      ),
    [IntegrationRowHeadings.INTEGRATED_WITHIN_8_DAYS_COUNT]:
      requestedTransfers.integratedWithin8DaysCount,
    [IntegrationRowHeadings.INTEGRATED_WITHIN_8_DAYS_PERCENT]:
      addPercentageSign(
        requestedTransfers.integratedWithin8DaysPercentOfReceived
      ),
    [IntegrationRowHeadings.NOT_INTEGRATED_WITHIN_8_DAYS_COUNT]:
      requestedTransfers.notIntegratedWithin8DaysTotal,
    [IntegrationRowHeadings.NOT_INTEGRATED_WITHIN_8_DAYS_PERCENT]:
      addPercentageSign(
        requestedTransfers.notIntegratedWithin8DaysPercentOfReceived
      ),
  };
}

export function getIntegrationTimesCsv(
  ccgPractices: PracticeType[],
  ccgName: string,
  ccgOdsCode: string,
  timeframe: string
) {
  function transformMetricsIntoCsvRow(name: string, odsCode: string) {
    return (metric: PracticeMetricsType) => {
      const year = metric.year;
      const month = metric.month;
      const requestedTransfers = metric.requestedTransfers;
      const integrationTimesRow = getIntegrationTimesRow(
        ccgName,
        ccgOdsCode,
        name,
        odsCode,
        month,
        year,
        requestedTransfers
      );
      return Object.values(integrationTimesRow).join(",");
    };
  }

  return ccgPractices.reduce((acc: string[], practice: PracticeType) => {
    const { odsCode, name, metrics } = practice;
    let integrationTimesRows;

    if (timeframe == "latestMonth") {
      const { year: latestYear, month: latestMonth } =
        ccgPractices[0].metrics[0];
      integrationTimesRows = metrics
        .filter((metric) => {
          return metric.month === latestMonth && metric.year === latestYear;
        })
        .map(transformMetricsIntoCsvRow(name, odsCode));
    } else {
      integrationTimesRows = metrics.map(
        transformMetricsIntoCsvRow(name, odsCode)
      );
    }

    return [...acc, ...integrationTimesRows];
  }, []);
}
