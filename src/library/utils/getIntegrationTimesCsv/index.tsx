import { PracticeType } from "../../types/practice.types";
import { IntegrationRowHeadings } from "../../enums/csvRowHeadings";
import { convertMonthNumberToText } from "../convertMonthNumberToText";
import { addPercentageSign } from "../addPercentageSign";

export function getIntegrationTimesCsv(
  ccgPractices: PracticeType[],
  ccgName: string,
  ccgOdsCode: string
) {
  return ccgPractices.reduce((acc: string[], practice: PracticeType) => {
    const { odsCode, name, metrics } = practice;
    const integrationTimesRows = metrics.map((metric) => {
      const year = metric.year;
      const month = metric.month;
      const requestedTransfers = metric.requestedTransfers;
      const integrationTimesRow = {
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
      return Object.values(integrationTimesRow).join(",");
    });
    return [...acc, ...integrationTimesRows];
  }, []);
}
