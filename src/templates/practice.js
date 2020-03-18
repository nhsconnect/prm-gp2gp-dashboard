import React, { Fragment } from "react";
import { useStaticQuery, graphql } from "gatsby";
import PracticeDetails from "../components/PracticeDetails";
import {
  ODS_PORTAL_URL,
  transformPracticeAddress,
} from "../library/api/ODSPortal";
import {
  convertMonthNumberToText,
  convertToTitleCase,
} from "../library/common/index";
import SlaMetrics from "../components/SlaMetrics";
import { useApi } from "../library/hooks";

const Practice = ({ pageContext }) => {
  const [isLoading, apiData, apiErr] = useApi(
    `${ODS_PORTAL_URL}/${pageContext.odsCode}`
  );

  const graphQlData = useStaticQuery(graphql`
    query {
      allFile(filter: { name: { eq: "slaMetrics" } }) {
        edges {
          node {
            childContentJson {
              title
              subtitle
              within3Days
              within8Days
              beyond8Days
            }
          }
        }
      }
    }
  `).allFile.edges[0].node.childContentJson;

  const { name, odsCode, month, year, metrics } = pageContext;
  const formattedName = convertToTitleCase(name);
  const monthName = convertMonthNumberToText(month);
  const labelledMetrics = [
    {
      label: graphQlData.within3Days,
      value: metrics.within3Days,
    },
    {
      label: graphQlData.within8Days,
      value: metrics.within8Days,
    },
    {
      label: graphQlData.beyond8Days,
      value: metrics.beyond8Days,
    },
  ];
  return (
    <Fragment>
      {isLoading | apiErr ? (
        <PracticeDetails name={formattedName} odsCode={odsCode} />
      ) : (
        <PracticeDetails
          name={formattedName}
          odsCode={odsCode}
          address={transformPracticeAddress(
            apiData.Organisation.GeoLoc.Location
          )}
        />
      )}
      <hr />
      <h2 className="nhsuk-heading-m">
        {monthName} {year}
      </h2>
      <SlaMetrics
        title={graphQlData.title}
        subtitle={graphQlData.subtitle}
        metrics={labelledMetrics}
      />
    </Fragment>
  );
};

export default Practice;
