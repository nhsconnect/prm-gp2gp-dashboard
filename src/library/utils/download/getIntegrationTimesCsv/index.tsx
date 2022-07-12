import {
  PracticeType,
  RequestedTransfersType,
} from "../../../types/practice.types";
import { IntegrationRowHeadings } from "../../../constants/csvRowHeadings";
import { convertMonthNumberToText } from "../../convertMonthNumberToText";
import { addPercentageSign } from "../../addPercentageSign";
import { transformMetricsInCsvString } from "../transformMetricsInCsvString";

function getIntegrationTimesRowValues(
  sicblName: string,
  sicblOdsCode: string,
  name: string,
  odsCode: string,
  month: number,
  year: number,
  requestedTransfers: RequestedTransfersType
) {
  return {
    [IntegrationRowHeadings.SICBL_NAME]: `"${sicblName}"`,
    [IntegrationRowHeadings.SICBL_ODS]: sicblOdsCode,
    [IntegrationRowHeadings.REQUESTING_PRACTICE_NAME]: `"${name}"`,
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
  sicblPractices: PracticeType[],
  timeframe: string
) {
  return transformMetricsInCsvString(
    sicblPractices,
    timeframe,
    getIntegrationTimesRowValues
  );
}
