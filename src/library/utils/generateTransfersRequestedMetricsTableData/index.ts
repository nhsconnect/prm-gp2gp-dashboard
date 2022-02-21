type TransfersRequestedMetricsTableType = {
  requestedCount: number;
  receivedPercentOfRequested: number | null;
  failuresTotalPercentOfRequested: number | null;
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
