import { PracticeType } from "../../../types/practice.types";
import {
  AllCSVHeadings,
  IntegrationRowHeadings,
  TransfersRequestedRowHeadings,
} from "../../../constants/csvRowHeadings";
import { getIntegrationTimesCsv } from "../getIntegrationTimesCsv";
import { getTransfersRequestedCsv } from "../getTransfersRequestedCsv";
import { getAllDataCsv } from "../getAllDataCsv";
import {
  DatasetTypeOptions,
  TimeframeOptions,
} from "../../../enums/datasetTypeOptions";
import capitalize from "lodash/capitalize";

export const getFormatData = (
  timeframe: string,
  datatype: string,
  data: PracticeType[]
): string => {
  if (datatype === DatasetTypeOptions.IntegrationTimes) {
    return [
      Object.values(IntegrationRowHeadings).join(),
      ...getIntegrationTimesCsv(data, timeframe),
    ].join("\n");
  } else if (datatype === DatasetTypeOptions.TransfersRequested) {
    return [
      Object.values(TransfersRequestedRowHeadings).join(),
      ...getTransfersRequestedCsv(data, timeframe),
    ].join("\n");
  }
  return [
    Object.values(AllCSVHeadings).join(),
    ...getAllDataCsv(data, timeframe),
  ].join("\n");
};
