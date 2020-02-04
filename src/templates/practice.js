import React, { useState, useEffect } from "react";
import { useStaticQuery, graphql } from "gatsby";
import PracticeDetails from "../components/PracticeDetails/index";
import { getPracticeDetails } from "../library/api/ODSPortal";
import { convertMonthNumberToText } from "../library/common/index";
import SlaMetrics from "../components/SlaMetrics";

const Practice = ({ pageContext }) => {
  const [practiceDetails, setPracticeDetails] = useState({
    ODSCode: pageContext.ODSCode,
  });
  useEffect(() => {
    (async () => {
      const data = await getPracticeDetails(pageContext.ODSCode);
      setPracticeDetails(data);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useStaticQuery(
    graphql`
      query {
        allFile(filter: { name: { eq: "sla" } }) {
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
    `
  ).allFile.edges[0].node.childContentJson;

  const { name, ODSCode, address } = practiceDetails;
  const { month, year, metrics } = pageContext;
  const monthName = convertMonthNumberToText(month);
  const labelledMetrics = [
    {
      label: data.within3Days,
      value: metrics.within3Days
    },
    {
      label: data.within8Days,
      value: metrics.within8Days
    },
    {
      label: data.beyond8Days,
      value: metrics.beyond8Days
    }
  ]
  return (
    <React.Fragment>
      <PracticeDetails name={name} ODSCode={ODSCode} address={address} />
      <hr />
      <h2 className="nhsuk-heading-m">
        {monthName} {year}
      </h2>
      <SlaMetrics title={data.title} subtitle={data.subtitle} metrics={labelledMetrics} />
    </React.Fragment>
  );
};

export default Practice;
