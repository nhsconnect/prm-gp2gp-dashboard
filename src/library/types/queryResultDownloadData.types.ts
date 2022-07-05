import { ICBType, PracticeType } from "./practice.types";

type ChildOrganisationsJsonType = {
  practices: PracticeType[];
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

export type PracticeDownloadDataType = {
  allFile: AllFileType;
};

type ICBChildOrganisationsJsonType = ChildOrganisationsJsonType & {
  icbs: ICBType[];
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

export type ICBDownloadDataType = {
  allFile: ICBAllFileType;
};
