import {
  PracticeMetricsType,
  PracticeType,
  RequestedTransfersType,
} from "../../../types/practice.types";
import { TimeframeOptions } from "../../../enums/datasetTypeOptions";

type GetRowValuesType = (
  ccgName: string,
  ccgOdsCode: string,
  name: string,
  odsCode: string,
  month: number,
  year: number,
  requestedTransfers: RequestedTransfersType
) => {};

export function transformMetricsInCsvString(
  ccgPractices: PracticeType[],
  timeframe: string,
  getRowValues: GetRowValuesType
) {
  function transformMetricsIntoCsvRow(
    name: string,
    odsCode: string,
    ccgName: string,
    ccgOdsCode: string
  ) {
    return (metric: PracticeMetricsType) => {
      const row = getRowValues(
        ccgName,
        ccgOdsCode,
        name,
        odsCode,
        metric.month,
        metric.year,
        metric.requestedTransfers
      );
      return Object.values(row).join(",");
    };
  }

  return ccgPractices.reduce((acc: string[], practice: PracticeType) => {
    let rows;
    const { odsCode, name, metrics, ccgName, ccgOdsCode } = practice;

    if (timeframe === TimeframeOptions.LatestMonth) {
      const { year: latestYear, month: latestMonth } =
        ccgPractices[0].metrics[0];
      rows = metrics
        .filter((metric) => {
          return metric.month === latestMonth && metric.year === latestYear;
        })
        .map(transformMetricsIntoCsvRow(name, odsCode, ccgName, ccgOdsCode));
    } else {
      rows = metrics.map(
        transformMetricsIntoCsvRow(name, odsCode, ccgName, ccgOdsCode)
      );
    }

    return [...acc, ...rows];
  }, []);
}
