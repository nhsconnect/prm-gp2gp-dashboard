import {
  SICBLPracticeType,
  SICBLType,
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

type SICBLChildOrganisationsJsonType = {
  sicbls: SICBLType[];
  practices: SICBLPracticeType[];
};

type SICBLNodeType = {
  childOrganisationsJson: SICBLChildOrganisationsJsonType;
};
type SICBLEdgesType = {
  node: SICBLNodeType;
};

type SICBLAllFileType = {
  edges: SICBLEdgesType[];
};

export type SICBLDataType = {
  allFile: SICBLAllFileType;
};
