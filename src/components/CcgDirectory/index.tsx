import React, { FC, useState } from "react";
import { useStaticQuery, graphql } from "gatsby";

import { sortOrganisationsAlphabetically } from "../../library/utils/sortOrganisationsAlphabetically";
import { AlphabeticalCcgList } from "../AlphabeticalCcgList";
import { AlphabeticalNav } from "../AlphabeticalNav";
import ccgDirectoryContent from "../../data/content/ccgDirectory.json";
import "./index.scss";

type CcgDirectoryProps = {
  headingPriority: number;
};

export const CcgDirectory: FC<CcgDirectoryProps> = ({ headingPriority }) => {
  const CustomHeadingTag = `h${headingPriority}` as keyof JSX.IntrinsicElements;

  const ccgs = useStaticQuery(
    graphql`
      query {
        allFile(filter: { name: { eq: "practiceMetrics" } }) {
          edges {
            node {
              childOrganisationsJson {
                ccgs {
                  name
                  odsCode
                }
              }
            }
          }
        }
      }
    `
  ).allFile.edges[0].node.childOrganisationsJson.ccgs;

  const [sortedCcgs] = useState(() => sortOrganisationsAlphabetically(ccgs));

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
