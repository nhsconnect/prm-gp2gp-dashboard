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
