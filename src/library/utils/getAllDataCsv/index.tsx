import {
  PracticeMetricsType,
  PracticeType,
  RequestedTransfersType,
} from "../../types/practice.types";
import {
  AllCSVHeadings,
  IntegrationRowHeadings,
  TransfersRequestedRowHeadings,
} from "../../enums/csvRowHeadings";
import { convertMonthNumberToText } from "../convertMonthNumberToText";
import { addPercentageSign } from "../addPercentageSign";

function getAllDataRow(
  ccgName: string,
  ccgOdsCode: string,
  name: string,
  odsCode: string,
  month: number,
  year: number,
  requestedTransfers: RequestedTransfersType
) {
  return {
    [AllCSVHeadings.CCG_NAME]: ccgName,
    [AllCSVHeadings.CCG_ODS]: ccgOdsCode,
    [AllCSVHeadings.REQUESTING_PRACTICE_NAME]: name,
    [AllCSVHeadings.PRACTICE_ODS]: odsCode,
    [AllCSVHeadings.MONTH_AND_YEAR]:
      convertMonthNumberToText(month) + " " + year,
    [TransfersRequestedRowHeadings.GP2GP_TRANSFERS_REQUESTED]:
      requestedTransfers.requestedCount,
    [TransfersRequestedRowHeadings.GP2GP_TRANSFERS_RECEIVED]:
      requestedTransfers.receivedCount,
    [TransfersRequestedRowHeadings.GP2GP_TRANSFERS_RECEIVED_PERCENT]:
      addPercentageSign(requestedTransfers.receivedPercentOfRequested),
    [TransfersRequestedRowHeadings.GP2GP_TECHNICAL_FAILURES]:
      requestedTransfers.failuresTotalCount,
    [TransfersRequestedRowHeadings.GP2GP_TECHNICAL_FAILURES_PERCENT]:
      addPercentageSign(requestedTransfers.failuresTotalPercentOfRequested),

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

export function getAllDataCsv(
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
      const allDataRow = getAllDataRow(
        ccgName,
        ccgOdsCode,
        name,
        odsCode,
        month,
        year,
        requestedTransfers
      );
      return Object.values(allDataRow).join(",");
    };
  }

  return ccgPractices.reduce((acc: string[], practice: PracticeType) => {
    const { odsCode, name, metrics } = practice;
    let allDataRows;

    if (timeframe == "latestMonth") {
      const { year: latestYear, month: latestMonth } =
        ccgPractices[0].metrics[0];
      allDataRows = metrics
        .filter((metric) => {
          return metric.month === latestMonth && metric.year === latestYear;
        })
        .map(transformMetricsIntoCsvRow(name, odsCode));
    } else {
      allDataRows = metrics.map(transformMetricsIntoCsvRow(name, odsCode));
    }

    return [...acc, ...allDataRows];
  }, []);
}
