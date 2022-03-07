import { PracticeType } from "../../../types/practice.types";
import {
  AllCSVHeadings,
  IntegrationRowHeadings,
  TransfersRequestedRowHeadings,
} from "../../../enums/csvRowHeadings";
import { getIntegrationTimesCsv } from "../getIntegrationTimesCsv";
import { getTransfersRequestedCsv } from "../getTransfersRequestedCsv";
import { getAllDataCsv } from "../getAllDataCsv";

export function getFormatData(
  ccgPractices: PracticeType[],
  ccgName: string,
  ccgOdsCode: string
) {
  return (timeframe: string, datatype: string) => {
    if (datatype === "integrationTimes") {
      return [
        Object.values(IntegrationRowHeadings).join(),
        ...getIntegrationTimesCsv(ccgPractices, ccgName, ccgOdsCode, timeframe),
      ].join("\n");
    } else if (datatype === "transfersRequested") {
      return [
        Object.values(TransfersRequestedRowHeadings).join(),
        ...getTransfersRequestedCsv(
          ccgPractices,
          ccgName,
          ccgOdsCode,
          timeframe
        ),
      ].join("\n");
    }
    return [
      Object.values(AllCSVHeadings).join(),
      ...getAllDataCsv(ccgPractices, ccgName, ccgOdsCode, timeframe),
    ].join("\n");
  };
}
