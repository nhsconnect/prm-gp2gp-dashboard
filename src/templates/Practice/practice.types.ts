export type RequestedTransfersType = {
  requestedCount: number;
  receivedCount: number;
  integratedCount: number;
  integratedWithin3DaysCount: number;
  integratedWithin8DaysCount: number;
  integratedBeyond8DaysCount: number;
  awaitingIntegrationCount: number;
  technicalFailuresCount: number;
  unclassifiedFailureCount: number;
};

export type MetricsTableType = {
  receivedCount: number;
  integratedWithin3DaysPercentage: number | null;
  integratedWithin8DaysPercentage: number | null;
  integratedBeyond8DaysPercentage: number | null;
  awaitingIntegrationPercentage: number | null;
};

export type PracticeMetricsPercentageType = {
  year: number;
  month: number;
  requestedTransfers: MetricsTableType;
};

export type PracticePercentageType = {
  odsCode: string;
  name: string;
  metrics: PracticeMetricsPercentageType[];
};

export type PracticeMetricsType = {
  year: number;
  month: number;
  requestedTransfers: RequestedTransfersType;
};

export type PracticeType = {
  odsCode: string;
  name: string;
  metrics: PracticeMetricsType[];
};
