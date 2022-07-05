import {
  ICBPracticeType,
  ICBType,
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

type ICBChildOrganisationsJsonType = {
  icbs: ICBType[];
  practices: ICBPracticeType[];
};

type ICBNodeType = {
  childOrganisationsJson: ICBChildOrganisationsJsonType;
};
type ICBEdgesType = {
  node: ICBNodeType;
};

type ICBAllFileType = {
  edges: ICBEdgesType[];
};

export type ICBDataType = {
  allFile: ICBAllFileType;
};
