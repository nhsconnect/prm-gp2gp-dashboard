import { PracticeType } from "../../../types/practice.types";
import {
  AllCSVHeadings,
  IntegrationRowHeadings,
  TransfersRequestedRowHeadings,
} from "../../../constants/csvRowHeadings";
import { getIntegrationTimesCsv } from "../getIntegrationTimesCsv";
import { getTransfersRequestedCsv } from "../getTransfersRequestedCsv";
import { getAllDataCsv } from "../getAllDataCsv";
import { DatasetTypeOptions } from "../../../enums/datasetTypeOptions";

export function getFormatData(ccgPractices: PracticeType[]) {
  return (timeframe: string, datatype: string) => {
    if (datatype === DatasetTypeOptions.IntegrationTimes) {
      return [
        Object.values(IntegrationRowHeadings).join(),
        ...getIntegrationTimesCsv(ccgPractices, timeframe),
      ].join("\n");
    } else if (datatype === DatasetTypeOptions.TransfersRequested) {
      return [
        Object.values(TransfersRequestedRowHeadings).join(),
        ...getTransfersRequestedCsv(ccgPractices, timeframe),
      ].join("\n");
    }
    return [
      Object.values(AllCSVHeadings).join(),
      ...getAllDataCsv(ccgPractices, timeframe),
    ].join("\n");
  };
}
