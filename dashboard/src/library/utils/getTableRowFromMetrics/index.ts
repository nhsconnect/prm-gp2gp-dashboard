import { ReactNode } from "react";
import {
  IntegrationRequestedTransfersType,
  PracticeMetricsType,
  TransfersRequestedTransfersType,
} from "../../types/practice.types";
import { PageTemplatePath } from "../../enums/pageTemplatePath";
import { addPercentageSign } from "../addPercentageSign";
import { Units } from "../../enums/units";

const generateIntegrationTimesMetrics = (
  showPercentages: boolean,
  metric: PracticeMetricsType
) => {
  const requestedMetric =
    metric.requestedTransfers as IntegrationRequestedTransfersType;
  if (showPercentages) {
    return [
      requestedMetric.receivedCount,
      addPercentageSign(requestedMetric.integratedWithin3DaysPercentOfReceived),
      addPercentageSign(requestedMetric.integratedWithin8DaysPercentOfReceived),
      addPercentageSign(
        requestedMetric.notIntegratedWithin8DaysPercentOfReceived
      ),
    ];
  }
  return [
    requestedMetric.receivedCount,
    requestedMetric.integratedWithin3DaysCount,
    requestedMetric.integratedWithin8DaysCount,
    requestedMetric.notIntegratedWithin8DaysTotal,
  ];
};

const generateTransfersRequestedMetrics = (
  showPercentages: boolean,
  metric: PracticeMetricsType
) => {
  const requestedMetric =
    metric.requestedTransfers as TransfersRequestedTransfersType;
  if (showPercentages) {
    return [
      requestedMetric.requestedCount,
      addPercentageSign(requestedMetric.receivedPercentOfRequested),
      addPercentageSign(requestedMetric.failuresTotalPercentOfRequested),
    ];
  }
  return [
    requestedMetric.requestedCount,
    requestedMetric.receivedCount,
    requestedMetric.failuresTotalCount,
  ];
};

export const getTableRowFromMetrics = (
  firstRowItem: ReactNode,
  metric: PracticeMetricsType,
  pageTemplatePath: PageTemplatePath,
  units: Units
) => {
  const showPercentages = units == Units.PERCENTAGES;
  const tableMetrics =
    pageTemplatePath == PageTemplatePath.IntegrationTimes
      ? generateIntegrationTimesMetrics(showPercentages, metric)
      : pageTemplatePath == PageTemplatePath.GP2GPTransfersRequested
      ? generateTransfersRequestedMetrics(showPercentages, metric)
      : [];

  return [firstRowItem, ...tableMetrics];
};
