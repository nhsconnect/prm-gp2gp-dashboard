export type IntegrationRequestedTransfersType = {
  receivedCount: number;
  integratedWithin3DaysCount: number;
  integratedWithin3DaysPercentOfReceived: number | null;
  integratedWithin8DaysCount: number;
  integratedWithin8DaysPercentOfReceived: number | null;
  notIntegratedWithin8DaysTotal: number;
  notIntegratedWithin8DaysPercentOfReceived: number | null;
};

export type TransfersRequestedTransfersType = {
  requestedCount: number;
  receivedCount: number;
  receivedPercentOfRequested: number | null;
  failuresTotalCount: number;
  failuresTotalPercentOfRequested: number | null;
};

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
  requestedTransfers:
    | RequestedTransfersType
    | IntegrationRequestedTransfersType
    | TransfersRequestedTransfersType;
};

export type PracticeType = {
  odsCode: string;
  name: string;
  ccgOdsCode: string;
  ccgName: string;
  metrics: PracticeMetricsType[];
};

export type CcgPracticeType = {
  odsCode: string;
  name: string;
  metrics: PracticeMetricsType[];
};

export type CcgType = {
  name: string;
  odsCode: string;
};
