import {
  CcgPracticeType,
  CcgType,
  PracticeMetricsType,
} from "./practice.types";

type PracticeIntegrationsResultType = {
  odsCode: string;
  name: string;
  metrics: PracticeMetricsType[];
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
