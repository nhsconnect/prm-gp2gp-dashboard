import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { convertToTitleCase } from "../../../library/utils/convertToTitleCase";
import { ContentsList } from "../../../components/common/ContentsList";
import "../../index.scss";
import { DownloadData } from "../../../components/DownloadData";
import { graphql } from "gatsby";
import { SICBLDownloadDataType } from "../../../library/types/queryResultDownloadData.types";

type PageContext = {
  sicblOdsCode: string;
  layout?: string;
  dataUpdatedDate: string;
};

type SICBLProps = {
  pageContext: PageContext;
  data: SICBLDownloadDataType;
};

const SICBLDownloadData: FC<SICBLProps> = ({ data, pageContext }) => {
  const sicblPractices =
    data.allFile.edges[0].node.childOrganisationsJson.practices;
  const { name: sicblName, odsCode: sicblOdsCode } =
    data.allFile.edges[0].node.childOrganisationsJson.sicbls[0];

  const { dataUpdatedDate } = pageContext;
  const formattedName: string = convertToTitleCase(sicblName);
  const contentListItems = [
    {
      text: "Integration times",
      href: `/sub-ICB-location/${sicblOdsCode}/integration-times`,
    },
    {
      text: "GP2GP transfers requested",
      href: `/sub-ICB-location/${sicblOdsCode}/gp2gp-transfers-requested`,
    },
    {
      text: "Download data",
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for practices within this integrated care board"
        />
        <noscript>{`<style>.gp2gp-download-data {display: none}</style>`}</noscript>
      </Helmet>
      <div className="gp2gp-page-content-wrapper">
        <h1 className="nhsuk-u-margin-bottom-5 gp2gp-page-heading">
          {formattedName ? formattedName : sicblOdsCode}
          <span className="nhsuk-u-visually-hidden"> download data</span>
        </h1>
        <div className="gp2gp-side-nav">
          <ContentsList items={contentListItems} />
        </div>
        <DownloadData
          className="gp2gp-page-contents"
          dataFor={formattedName}
          data={sicblPractices}
          pageDescription={
            "To download data for this Sub ICB Location in CSV format select from the options below and click 'Download'."
          }
          dataUpdatedDate={dataUpdatedDate}
        />
      </div>
    </>
  );
};

export const query = graphql`
  query SICBLDownloadDataQuery($sicblOdsCode: String) {
    allFile(filter: { name: { eq: "practiceMetrics" } }) {
      edges {
        node {
          childOrganisationsJson {
            sicbls(sicblOdsCode: $sicblOdsCode) {
              ...SICBLQueryFragment
            }
            practices(sicblOdsCode: $sicblOdsCode) {
              ...PracticeDownloadFragment
            }
          }
        }
      }
    }
  }
`;

export default SICBLDownloadData;
