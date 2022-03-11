import {
  PracticeMetricsType,
  PracticeType,
  RequestedTransfersType,
} from "../../../types/practice.types";
import { TimeframeOptions } from "../../../enums/datasetTypeOptions";

const filterMetricsByMonth = (
  metrics: PracticeMetricsType[],
  month: number,
  year: number
) => metrics.filter((metric) => metric.month === month && metric.year === year);

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
  return ccgPractices.reduce((acc: string[], practice: PracticeType) => {
    const allMetrics = practice.metrics;
    const { year: latestYear, month: latestMonth } = ccgPractices[0].metrics[0];
    const metrics =
      timeframe === TimeframeOptions.LatestMonth
        ? filterMetricsByMonth(allMetrics, latestMonth, latestYear)
        : allMetrics;
    const rows = metrics.map((metric: PracticeMetricsType) => {
      const row = getRowValues(
        practice.ccgName,
        practice.ccgOdsCode,
        practice.name,
        practice.odsCode,
        metric.month,
        metric.year,
        metric.requestedTransfers
      );
      return Object.values(row).join(",");
    });

    return [...acc, ...rows];
  }, []);
}
