import {
  CcgPracticeType,
  CcgType,
  PracticeMetricsType,
} from "./practice.types";

type PracticeResultType = {
  odsCode: string;
  name: string;
  metrics: PracticeMetricsType[];
};

type ChildOrganisationsJsonType = {
  practices: PracticeResultType[];
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

export type PracticeDataType = {
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

export type CcgDataType = {
  allFile: CcgAllFileType;
};
