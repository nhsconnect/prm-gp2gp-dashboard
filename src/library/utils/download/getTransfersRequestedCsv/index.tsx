import {
  PracticeMetricsType,
  PracticeType,
  RequestedTransfersType,
} from "../../../types/practice.types";
import { TransfersRequestedRowHeadings } from "../../../enums/csvRowHeadings";
import { convertMonthNumberToText } from "../../convertMonthNumberToText";
import { addPercentageSign } from "../../addPercentageSign";

function getTransfersRequestedRow(
  ccgName: string,
  ccgOdsCode: string,
  name: string,
  odsCode: string,
  month: number,
  year: number,
  requestedTransfers: RequestedTransfersType
) {
  return {
    [TransfersRequestedRowHeadings.CCG_NAME]: ccgName,
    [TransfersRequestedRowHeadings.CCG_ODS]: ccgOdsCode,
    [TransfersRequestedRowHeadings.REQUESTING_PRACTICE_NAME]: name,
    [TransfersRequestedRowHeadings.PRACTICE_ODS]: odsCode,
    [TransfersRequestedRowHeadings.MONTH_AND_YEAR]:
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
  };
}

export function getTransfersRequestedCsv(
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
      const transfersRequestedRow = getTransfersRequestedRow(
        ccgName,
        ccgOdsCode,
        name,
        odsCode,
        month,
        year,
        requestedTransfers
      );
      return Object.values(transfersRequestedRow).join(",");
    };
  }

  return ccgPractices.reduce((acc: string[], practice: PracticeType) => {
    const { odsCode, name, metrics } = practice;
    let transfersRequestedRows;

    if (timeframe == "latestMonth") {
      const { year: latestYear, month: latestMonth } =
        ccgPractices[0].metrics[0];
      transfersRequestedRows = metrics
        .filter((metric) => {
          return metric.month === latestMonth && metric.year === latestYear;
        })
        .map(transformMetricsIntoCsvRow(name, odsCode));
    } else {
      transfersRequestedRows = metrics.map(
        transformMetricsIntoCsvRow(name, odsCode)
      );
    }

    return [...acc, ...transfersRequestedRows];
  }, []);
}
