import React, { useState, useEffect } from "react";
import { useStaticQuery, graphql } from "gatsby";
import PracticeDetails from "../components/PracticeDetails/index";
import { getPracticeDetails } from "../library/api/ODSPortal";
import {
  convertMonthNumberToText,
  convertToTitleCase,
} from "../library/common/index";
import SlaMetrics from "../components/SlaMetrics";

const Practice = ({ pageContext }) => {
  const [practiceDetails, setPracticeDetails] = useState({
    ODSCode: pageContext.ODSCode,
    name: convertToTitleCase(pageContext.name),
    month: pageContext.month,
    year: pageContext.year,
    metrics: pageContext.metrics,
  });
  useEffect(() => {
    (async () => {
      const data = await getPracticeDetails(pageContext.ODSCode);
      setPracticeDetails({
        ...practiceDetails,
        address: data.address,
      });
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

  const { name, ODSCode, address, month, year, metrics } = practiceDetails;
  const monthName = convertMonthNumberToText(month);
  const labelledMetrics = [
    {
      label: data.within3Days,
      value: metrics.within3Days,
    },
    {
      label: data.within8Days,
      value: metrics.within8Days,
    },
    {
      label: data.beyond8Days,
      value: metrics.beyond8Days,
    },
  ];
  return (
    <React.Fragment>
      <PracticeDetails name={name} ODSCode={ODSCode} address={address} />
      <hr />
      <h2 className="nhsuk-heading-m">
        {monthName} {year}
      </h2>
      <SlaMetrics
        title={data.title}
        subtitle={data.subtitle}
        metrics={labelledMetrics}
      />
    </React.Fragment>
  );
};

export default Practice;
