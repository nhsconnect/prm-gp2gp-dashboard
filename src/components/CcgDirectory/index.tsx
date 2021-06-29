import React, { FC } from "react";

import { CcgType } from "../../templates/Ccg/ccg.types";
import { sortOrganisationsAlphabetically } from "../../library/utils/sortOrganisationsAlphabetically";
import { AlphabeticalCcgList } from "../AlphabeticalCcgList";
import { AlphabeticalNav } from "../AlphabeticalNav";
import ccgDirectoryContent from "../../data/content/ccgDirectory.json";

type CcgDirectoryProps = {
  ccgs: CcgType[];
};

export const CcgDirectory: FC<CcgDirectoryProps> = ({ ccgs }) => {
  const sortedCcgs = sortOrganisationsAlphabetically(ccgs);
  return (
    <>
      <h1>{ccgDirectoryContent.heading}</h1>
      <AlphabeticalNav sortedItems={sortedCcgs} />
      <AlphabeticalCcgList sortedCcgs={sortedCcgs} />
    </>
  );
};
