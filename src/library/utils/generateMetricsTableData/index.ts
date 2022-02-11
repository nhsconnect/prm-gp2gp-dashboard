import { RequestedTransfersType } from "../../../templates/PracticeIntegrationTimes/practice.types";
import { calculatePercentage } from "../calculatePercentage";

type MetricsTableType = {
  receivedCount: number;
  integratedWithin3DaysPercentage: number | null;
  integratedWithin8DaysPercentage: number | null;
  notIntegratedWithin8DaysPercentage: number | null;
};

type PracticeMetricsPercentageType = {
  year: number;
  month: number;
  requestedTransfers: MetricsTableType;
};

export type PracticePercentageType = {
  odsCode: string;
  name: string;
  metrics: PracticeMetricsPercentageType[];
};

export const generateMetricsTableData = ({
  receivedCount,
  integratedWithin3DaysCount,
  integratedWithin8DaysCount,
  integratedBeyond8DaysCount,
  awaitingIntegrationCount,
}: RequestedTransfersType): MetricsTableType => {
  const integratedWithin3DaysPercentage = calculatePercentage(
    integratedWithin3DaysCount,
    receivedCount
  );
  const integratedWithin8DaysPercentage = calculatePercentage(
    integratedWithin8DaysCount,
    receivedCount
  );

  const notIntegratedWithin8DaysPercentage = calculatePercentage(
    integratedBeyond8DaysCount + awaitingIntegrationCount,
    receivedCount
  );

  return {
    receivedCount,
    integratedWithin3DaysPercentage,
    integratedWithin8DaysPercentage,
    notIntegratedWithin8DaysPercentage,
  };
};
