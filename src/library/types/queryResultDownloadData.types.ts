import { CcgType, PracticeType } from "./practice.types";

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

type CcgChildOrganisationsJsonType = ChildOrganisationsJsonType & {
  ccgs: CcgType[];
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

export type CcgDownloadDataType = {
  allFile: CcgAllFileType;
};
