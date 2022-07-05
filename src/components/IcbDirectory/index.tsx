import React, { FC, useState } from "react";
import { useStaticQuery, graphql } from "gatsby";

import { sortOrganisationsAlphabetically } from "../../library/utils/sortOrganisationsAlphabetically";
import { AlphabeticalICBList } from "../AlphabeticalIcbList";
import { AlphabeticalNav } from "../AlphabeticalNav";
import icbDirectoryContent from "../../data/content/icbDirectory.json";
import "./index.scss";

type ICBDirectoryProps = {
  headingPriority: number;
};

export const ICBDirectory: FC<ICBDirectoryProps> = ({ headingPriority }) => {
  const CustomHeadingTag = `h${headingPriority}` as keyof JSX.IntrinsicElements;

  const icbs = useStaticQuery(
    graphql`
      query {
        allFile(filter: { name: { eq: "practiceMetrics" } }) {
          edges {
            node {
              childOrganisationsJson {
                icbs {
                  name
                  odsCode
                }
              }
            }
          }
        }
      }
    `
  ).allFile.edges[0].node.childOrganisationsJson.icbs;

  const [sortedICBs] = useState(() => sortOrganisationsAlphabetically(icbs));

  return (
    <>
      <CustomHeadingTag className="nhsuk-u-margin-top-5">
        {icbDirectoryContent.heading}
      </CustomHeadingTag>
      <AlphabeticalNav sortedItems={sortedICBs} />
      <AlphabeticalICBList sortedICBs={sortedICBs} />
    </>
  );
};
