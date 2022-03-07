import {
  PracticeMetricsType,
  PracticeType,
  RequestedTransfersType,
} from "../../../types/practice.types";

export function transformMetricsInCsvString(
  ccgPractices: PracticeType[],
  timeframe: string,
  ccgName: string,
  ccgOdsCode: string,
  getRowValues: (
    ccgName: string,
    ccgOdsCode: string,
    name: string,
    odsCode: string,
    month: number,
    year: number,
    requestedTransfers: RequestedTransfersType
  ) => {}
) {
  function transformMetricsIntoCsvRow(name: string, odsCode: string) {
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
    const { odsCode, name, metrics } = practice;

    if (timeframe === "latestMonth") {
      const { year: latestYear, month: latestMonth } =
        ccgPractices[0].metrics[0];
      rows = metrics
        .filter((metric) => {
          return metric.month === latestMonth && metric.year === latestYear;
        })
        .map(transformMetricsIntoCsvRow(name, odsCode));
    } else {
      rows = metrics.map(transformMetricsIntoCsvRow(name, odsCode));
    }

    return [...acc, ...rows];
  }, []);
}
