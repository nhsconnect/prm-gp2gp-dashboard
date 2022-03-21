import { PracticeType } from "./practice.types";

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
