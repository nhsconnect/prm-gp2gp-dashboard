import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { convertToTitleCase } from "../../../library/utils/convertToTitleCase";
import { ContentsList } from "../../../components/common/ContentsList";
import "../../index.scss";
import { DownloadData } from "../../../components/DownloadData";
import { graphql } from "gatsby";
import { ICBDownloadDataType } from "../../../library/types/queryResultDownloadData.types";

type PageContext = {
  icbOdsCode: string;
  layout: string;
  dataUpdatedDate: string;
};

type ICBProps = {
  pageContext: PageContext;
  data: ICBDownloadDataType;
};

const ICBDownloadData: FC<ICBProps> = ({ data, pageContext }) => {
  const icbPractices =
    data.allFile.edges[0].node.childOrganisationsJson.practices;
  const { name: icbName, odsCode: icbOdsCode } =
    data.allFile.edges[0].node.childOrganisationsJson.icbs[0];

  const { dataUpdatedDate } = pageContext;
  const formattedName: string = convertToTitleCase(icbName);
  const contentListItems = [
    {
      text: "Integration times",
      href: `/icb/${icbOdsCode}/integration-times`,
    },
    {
      text: "GP2GP transfers requested",
      href: `/icb/${icbOdsCode}/gp2gp-transfers-requested`,
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
          {formattedName ? formattedName : icbOdsCode}
          <span className="nhsuk-u-visually-hidden"> download data</span>
        </h1>
        <div className="gp2gp-side-nav">
          <ContentsList items={contentListItems} />
        </div>
        <DownloadData
          className="gp2gp-page-contents"
          dataFor={formattedName}
          data={icbPractices}
          pageDescription={
            "To download data for this ICB in CSV format select from the options below and click 'Download'."
          }
          dataUpdatedDate={dataUpdatedDate}
        />
      </div>
    </>
  );
};

export const query = graphql`
  query ICBDownloadDataQuery($icbOdsCode: String) {
    allFile(filter: { name: { eq: "practiceMetrics" } }) {
      edges {
        node {
          childOrganisationsJson {
            icbs(icbOdsCode: $icbOdsCode) {
              ...ICBQueryFragment
            }
            practices(icbOdsCode: $icbOdsCode) {
              ...PracticeDownloadFragment
            }
          }
        }
      }
    }
  }
`;

export default ICBDownloadData;
