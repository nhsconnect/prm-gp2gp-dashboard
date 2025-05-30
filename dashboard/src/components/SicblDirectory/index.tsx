import React, { FC, useState } from "react";
import { useStaticQuery, graphql } from "gatsby";

import { sortOrganisationsAlphabetically } from "../../library/utils/sortOrganisationsAlphabetically";
import { AlphabeticalSICBLList } from "../AlphabeticalSicblList";
import { AlphabeticalNav } from "../AlphabeticalNav";
import sicblDirectoryContent from "../../data/content/sicblDirectory.json";
import "./index.scss";

type SICBLDirectoryProps = {
  headingPriority: number;
};

export const SICBLDirectory: FC<SICBLDirectoryProps> = ({
  headingPriority,
}) => {
  const CustomHeadingTag = `h${headingPriority}` as keyof JSX.IntrinsicElements;

  const sicbls = useStaticQuery(
    graphql`
      query {
        allFile(filter: { name: { eq: "practiceMetrics" } }) {
          edges {
            node {
              childOrganisationsJson {
                sicbls {
                  name
                  odsCode
                }
              }
            }
          }
        }
      }
    `
  ).allFile.edges[0].node.childOrganisationsJson.sicbls;

  const [sortedSICBLs] = useState(() =>
    sortOrganisationsAlphabetically(sicbls)
  );

  return (
    <>
      <CustomHeadingTag className="nhsuk-u-margin-top-5">
        {sicblDirectoryContent.heading}
      </CustomHeadingTag>
      <AlphabeticalNav sortedItems={sortedSICBLs} />
      <AlphabeticalSICBLList sortedSICBLs={sortedSICBLs} />
    </>
  );
};
