import { SICBLType, PracticeType } from "./practice.types";

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

type SICBLChildOrganisationsJsonType = ChildOrganisationsJsonType & {
  sicbls: SICBLType[];
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

export type SICBLDownloadDataType = {
  allFile: SICBLAllFileType;
};
