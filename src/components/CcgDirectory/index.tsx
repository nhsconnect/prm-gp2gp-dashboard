import React, { FC } from "react";

import { sortOrganisationsAlphabetically } from "../../library/utils/sortOrganisationsAlphabetically";
import { AlphabeticalCcgList } from "../AlphabeticalCcgList";
import { AlphabeticalNav } from "../AlphabeticalNav";
import ccgDirectoryContent from "../../data/content/ccgDirectory.json";
import practiceMetrics from "../../data/organisations/practiceMetrics.json";
import "./index.scss";

const sortedCcgs = sortOrganisationsAlphabetically(practiceMetrics.ccgs);

export const CcgDirectory: FC = () => {
  return (
    <>
      <h1 className="nhsuk-u-margin-top-5">{ccgDirectoryContent.heading}</h1>
      <AlphabeticalNav sortedItems={sortedCcgs} />
      <AlphabeticalCcgList sortedCcgs={sortedCcgs} />
    </>
  );
};
