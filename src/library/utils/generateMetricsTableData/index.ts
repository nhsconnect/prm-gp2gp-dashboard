import { RequestedTransfersType } from "../../../templates/Practice/practice.types";
import { calculatePercentage } from "../calculatePercentage";

type MetricsTableType = {
  receivedCount: number;
  integratedWithin3DaysPercentage: number | null;
  integratedWithin8DaysPercentage: number | null;
  integratedBeyond8DaysPercentage: number | null;
  awaitingIntegrationPercentage: number | null;
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

  const integratedBeyond8DaysPercentage = calculatePercentage(
    integratedBeyond8DaysCount,
    receivedCount
  );
  const awaitingIntegrationPercentage = calculatePercentage(
    awaitingIntegrationCount,
    receivedCount
  );
  return {
    receivedCount,
    integratedWithin3DaysPercentage,
    integratedWithin8DaysPercentage,
    integratedBeyond8DaysPercentage,
    awaitingIntegrationPercentage,
  };
};
