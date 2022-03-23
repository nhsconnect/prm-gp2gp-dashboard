import { CcgPracticeType, CcgType } from "./practice.types";

type IntegrationRequestedTransfersType = {
  receivedCount: number;
  integratedWithin3DaysPercentOfReceived: number | null;
  integratedWithin8DaysPercentOfReceived: number | null;
  notIntegratedWithin8DaysPercentOfReceived: number | null;
};

export type PracticeIntegrationMetricsType = {
  year: number;
  month: number;
  requestedTransfers: IntegrationRequestedTransfersType;
};

type PracticeIntegrationsResultType = {
  odsCode: string;
  name: string;
  metrics: PracticeIntegrationMetricsType[];
};
type ChildOrganisationsJsonType = {
  practices: PracticeIntegrationsResultType[];
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

export type PracticeIntegrationType = {
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

export type CcgIntegrationTimesType = {
  allFile: CcgAllFileType;
};