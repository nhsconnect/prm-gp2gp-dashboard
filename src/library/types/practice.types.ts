export type RequestedTransfersType = {
  requestedCount: number;
  receivedCount: number;
  receivedPercentOfRequested: number | null;
  integratedWithin3DaysCount: number;
  integratedWithin3DaysPercentOfReceived: number | null;
  integratedWithin8DaysCount: number;
  integratedWithin8DaysPercentOfReceived: number | null;
  notIntegratedWithin8DaysTotal: number;
  notIntegratedWithin8DaysPercentOfReceived: number | null;
  failuresTotalCount: number;
  failuresTotalPercentOfRequested: number | null;
};

export type PracticeMetricsType = {
  year: number;
  month: number;
  requestedTransfers: RequestedTransfersType;
};

export type PracticeType = {
  odsCode: string;
  name: string;
  ccgOdsCode: string;
  ccgName: string;
  metrics: PracticeMetricsType[];
};
