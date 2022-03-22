import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { convertToTitleCase } from "../../../library/utils/convertToTitleCase";
import { ContentsList } from "../../../components/common/ContentsList";
import "../../index.scss";
import { DownloadData } from "../../../components/DownloadData";
import { graphql } from "gatsby";
import { CcgDownloadDataType } from "../../../library/types/queryResultDownloadData.types";

type PageContext = {
  ccgOdsCode: string;
  layout: string;
  dataUpdatedDate: string;
};

type CcgProps = {
  pageContext: PageContext;
  data: CcgDownloadDataType;
};

const CcgDownloadData: FC<CcgProps> = ({ data, pageContext }) => {
  const ccgPractices =
    data.allFile.edges[0].node.childOrganisationsJson.practices;
  const { name: ccgName, odsCode: ccgOdsCode } =
    data.allFile.edges[0].node.childOrganisationsJson.ccgs[0];

  const { dataUpdatedDate } = pageContext;
  const formattedName: string = convertToTitleCase(ccgName);
  const contentListItems = [
    {
      text: "Integration times",
      href: `/ccg/${ccgOdsCode}/integration-times`,
    },
    {
      text: "GP2GP transfers requested",
      href: `/ccg/${ccgOdsCode}/gp2gp-transfers-requested`,
    },
    {
      text: "Download data",
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - ${ccgOdsCode} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for practices within this clinical commissioning group"
        />
        <noscript>{`<style>.gp2gp-download-data {display: none}</style>`}</noscript>
      </Helmet>
      <div className="gp2gp-page-content-wrapper">
        <h1 className="nhsuk-u-margin-bottom-5 gp2gp-page-heading">
          {formattedName ? `${formattedName} - ${ccgOdsCode}` : ccgOdsCode}
          <span className="nhsuk-u-visually-hidden"> download data</span>
        </h1>
        <div className="gp2gp-side-nav">
          <ContentsList items={contentListItems} />
        </div>
        <DownloadData
          className="gp2gp-page-contents"
          dataFor={formattedName}
          data={ccgPractices}
          pageDescription={
            "To download data for this CCG in CSV format select from the options below and click 'Download'."
          }
          dataUpdatedDate={dataUpdatedDate}
        />
      </div>
    </>
  );
};

export const query = graphql`
  query CcgDownloadDataQuery($ccgOdsCode: String) {
    allFile(filter: { name: { eq: "practiceMetrics" } }) {
      edges {
        node {
          childOrganisationsJson {
            ccgs(ccgOdsCode: $ccgOdsCode) {
              name
              odsCode
            }
            practices(ccgOdsCode: $ccgOdsCode) {
              name
              odsCode
              ccgName
              ccgOdsCode
              metrics {
                month
                year
                requestedTransfers {
                  requestedCount
                  receivedCount
                  receivedPercentOfRequested
                  integratedWithin3DaysCount
                  integratedWithin3DaysPercentOfReceived
                  integratedWithin8DaysCount
                  integratedWithin8DaysPercentOfReceived
                  notIntegratedWithin8DaysTotal
                  notIntegratedWithin8DaysPercentOfReceived
                  failuresTotalCount
                  failuresTotalPercentOfRequested
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default CcgDownloadData;
