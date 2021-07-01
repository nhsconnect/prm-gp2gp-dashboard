import React, { FC } from "react";

import { sortOrganisationsAlphabetically } from "../../library/utils/sortOrganisationsAlphabetically";
import { AlphabeticalCcgList } from "../AlphabeticalCcgList";
import { AlphabeticalNav } from "../AlphabeticalNav";
import ccgDirectoryContent from "../../data/content/ccgDirectory.json";
import practiceMetrics from "../../data/organisations/practiceMetrics.json";
import "./index.scss";

type CcgDirectoryProps = {
  headingPriority: number;
};
const sortedCcgs = sortOrganisationsAlphabetically(practiceMetrics.ccgs);

export const CcgDirectory: FC<CcgDirectoryProps> = ({ headingPriority }) => {
  const CustomHeadingTag = `h${headingPriority}` as keyof JSX.IntrinsicElements;
  return (
    <>
      <CustomHeadingTag className="nhsuk-u-margin-top-5">
        {ccgDirectoryContent.heading}
      </CustomHeadingTag>
      <AlphabeticalNav sortedItems={sortedCcgs} />
      <AlphabeticalCcgList sortedCcgs={sortedCcgs} />
    </>
  );
};
