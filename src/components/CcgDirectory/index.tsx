import React, { FC } from "react";

import { CcgType } from "../../templates/Ccg/ccg.types";
import { sortOrganisationsAlphabetically } from "../../library/utils/sortOrganisationsAlphabetically";
import { AlphabeticalCcgList } from "../AlphabeticalCcgList";

type CcgDirectoryProps = {
  ccgs: CcgType[];
};

export const CcgDirectory: FC<CcgDirectoryProps> = ({ ccgs }) => {
  const sortedCcgs = sortOrganisationsAlphabetically(ccgs);
  return <AlphabeticalCcgList sortedCcgs={sortedCcgs} />;
};
