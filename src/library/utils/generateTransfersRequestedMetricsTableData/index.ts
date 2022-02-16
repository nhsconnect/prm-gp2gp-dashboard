import { RequestedTransfersType } from "../../../templates/PracticeIntegrationTimes/practice.types";
import { calculatePercentage } from "../calculatePercentage";

type TransfersRequestedMetricsTableType = {
  requestedCount: number;
  receivedPercentage: number | null;
  technicalFailuresPercentage: number | null;
};

type PracticeMetricsPercentageType = {
  year: number;
  month: number;
  requestedTransfers: TransfersRequestedMetricsTableType;
};

export type PracticePercentageType = {
  odsCode: string;
  name: string;
  metrics: PracticeMetricsPercentageType[];
};

export const generateTransfersRequestedMetricsTableData = ({
  requestedCount,
  receivedCount,
  technicalFailuresCount,
  unclassifiedFailureCount,
}: RequestedTransfersType): TransfersRequestedMetricsTableType => {
  const receivedPercentage = calculatePercentage(receivedCount, requestedCount);
  const technicalFailuresTotal =
    technicalFailuresCount + unclassifiedFailureCount;
  const technicalFailuresPercentage = calculatePercentage(
    technicalFailuresTotal,
    requestedCount
  );

  return {
    requestedCount,
    receivedPercentage,
    technicalFailuresPercentage,
  };
};
