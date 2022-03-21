type TransfersRequestedTransfersType = {
  requestedCount: number;
  receivedPercentOfRequested: number | null;
  failuresTotalPercentOfRequested: number | null;
};

export type PracticeTransferRequestedMetricsType = {
  year: number;
  month: number;
  requestedTransfers: TransfersRequestedTransfersType;
};

type PracticeTransferRequestedResultType = {
  odsCode: string;
  name: string;
  metrics: PracticeTransferRequestedMetricsType[];
};
type ChildOrganisationsJsonType = {
  practices: PracticeTransferRequestedResultType[];
};

type NodeType = {
  childOrganisationsJson: ChildOrganisationsJsonType;
};
type EdgesType = {
  node: NodeType;
};

type AllFileType = {
  edges: EdgesType[];
};

export type PracticeRequestedTransfersType = {
  allFile: AllFileType;
};
