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
  icbName: string,
  icbOdsCode: string,
  name: string,
  odsCode: string,
  month: number,
  year: number,
  requestedTransfers: RequestedTransfersType
) => {};

export function transformMetricsInCsvString(
  icbPractices: PracticeType[],
  timeframe: string,
  getRowValues: GetRowValuesType
) {
  return icbPractices.reduce((acc: string[], practice: PracticeType) => {
    const allMetrics = practice.metrics;
    const { year: latestYear, month: latestMonth } = icbPractices[0].metrics[0];
    const metrics =
      timeframe === TimeframeOptions.LatestMonth
        ? filterMetricsByMonth(allMetrics, latestMonth, latestYear)
        : allMetrics;
    const rows = metrics.map((metric: PracticeMetricsType) => {
      const row = getRowValues(
        practice.icbName,
        practice.icbOdsCode,
        practice.name,
        practice.odsCode,
        metric.month,
        metric.year,
        metric.requestedTransfers as RequestedTransfersType
      );
      return Object.values(row).join(",");
    });

    return [...acc, ...rows];
  }, []);
}
