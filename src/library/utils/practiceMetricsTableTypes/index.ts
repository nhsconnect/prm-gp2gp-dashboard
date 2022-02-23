export type IntegratedMetricsTableType = {
  receivedCount: number;
  integratedWithin3DaysPercentOfReceived: number | null;
  integratedWithin8DaysPercentOfReceived: number | null;
  notIntegratedWithin8DaysPercentOfReceived: number | null;
};

export type TransfersRequestedMetricsTableType = {
  requestedCount: number;
  receivedPercentOfRequested: number | null;
  failuresTotalPercentOfRequested: number | null;
};

type PracticeMetricsPercentageType = {
  year: number;
  month: number;
  requestedTransfers:
    | TransfersRequestedMetricsTableType
    | IntegratedMetricsTableType;
};

export type PracticePercentageType = {
  odsCode: string;
  name: string;
  metrics: PracticeMetricsPercentageType[];
};
