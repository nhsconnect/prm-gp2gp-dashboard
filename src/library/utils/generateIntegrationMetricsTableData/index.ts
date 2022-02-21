type IntegratedMetricsTableType = {
  receivedCount: number;
  integratedWithin3DaysPercentOfReceived: number | null;
  integratedWithin8DaysPercentOfReceived: number | null;
  notIntegratedWithin8DaysPercentOfReceived: number | null;
};

type PracticeMetricsPercentageType = {
  year: number;
  month: number;
  requestedTransfers: IntegratedMetricsTableType;
};

export type PracticePercentageType = {
  odsCode: string;
  name: string;
  metrics: PracticeMetricsPercentageType[];
};
