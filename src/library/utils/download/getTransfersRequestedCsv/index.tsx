import {
  PracticeType,
  RequestedTransfersType,
} from "../../../types/practice.types";
import { TransfersRequestedRowHeadings } from "../../../constants/csvRowHeadings";
import { convertMonthNumberToText } from "../../convertMonthNumberToText";
import { addPercentageSign } from "../../addPercentageSign";
import { transformMetricsInCsvString } from "../transformMetricsInCsvString";

function getTransfersRequestedRowValues(
  ccgName: string,
  ccgOdsCode: string,
  name: string,
  odsCode: string,
  month: number,
  year: number,
  requestedTransfers: RequestedTransfersType
) {
  return {
    [TransfersRequestedRowHeadings.CCG_NAME]: `"${ccgName}"`,
    [TransfersRequestedRowHeadings.CCG_ODS]: ccgOdsCode,
    [TransfersRequestedRowHeadings.REQUESTING_PRACTICE_NAME]: `"${name}"`,
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
  timeframe: string
) {
  return transformMetricsInCsvString(
    ccgPractices,
    timeframe,
    getTransfersRequestedRowValues
  );
}
