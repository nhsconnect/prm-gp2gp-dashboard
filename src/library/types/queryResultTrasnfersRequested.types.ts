import { CcgPracticeType, CcgType } from "./practice.types";

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

type PracticeTransferRequestedType = {
  odsCode: string;
  name: string;
  metrics: PracticeTransferRequestedMetricsType[];
};
type ChildOrganisationsJsonType = {
  practices: PracticeTransferRequestedType[];
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

type CcgChildOrganisationsJsonType = {
  ccgs: CcgType[];
  practices: CcgPracticeType[];
};

type CcgNodeType = {
  childOrganisationsJson: CcgChildOrganisationsJsonType;
};
type CcgEdgesType = {
  node: CcgNodeType;
};

type CcgAllFileType = {
  edges: CcgEdgesType[];
};

export type CcgRequestedTransfersType = {
  allFile: CcgAllFileType;
};
