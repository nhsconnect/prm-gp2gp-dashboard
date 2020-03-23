import React from "react";
import "./index.scss";
import { useStaticQuery, graphql } from "gatsby";

const SlaMetric = ({ label, value }) => (
  <div className="gp2gp-sla-metrics__item">
    <span className="nhsuk-body-m nhsuk-u-margin-bottom-0">{label}</span>
    <span className="nhsuk-body-m">{value}</span>
  </div>
);

const SlaMetrics = ({ metrics }) => {
  const content = useStaticQuery(graphql`
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

  return (
    <div className="gp2gp-sla-metrics">
      <h3 className="nhsuk-body-m nhsuk-u-margin-bottom-0">{content.title}</h3>
      <p className="nhsuk-body-m nhsuk-u-margin-bottom-2">{content.subtitle}</p>
      <div className="gp2gp-sla-metrics__items-wrapper">
        <SlaMetric label={content.within3Days} value={metrics.within3Days} />
        <SlaMetric label={content.within8Days} value={metrics.within8Days} />
        <SlaMetric label={content.beyond8Days} value={metrics.beyond8Days} />
      </div>
    </div>
  );
};

export default SlaMetrics;
