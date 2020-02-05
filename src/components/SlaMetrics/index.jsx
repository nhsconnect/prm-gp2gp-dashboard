import React from "react";
import "./index.scss";


const SlaMetric = ({ label, value }) => (
  <div className="gp2gp-sla-metrics__item"><span className="nhsuk-body-s nhsuk-u-margin-bottom-0">{label}</span>
    <span className="nhsuk-body-s">{value}</span></div>
)

const SlaMetrics = ({ title, subtitle, metrics }) => (
  <div className="gp2gp-sla-metrics">
    <h3 className="nhsuk-body-s nhsuk-u-margin-bottom-0">{title}</h3>
    <p className="nhsuk-body-s nhsuk-u-margin-bottom-0">{subtitle}</p>
    <div className="gp2gp-sla-metrics__items-wrapper">
      {metrics.map((metric, i) => (<SlaMetric key={`label-${i}`} label={metric.label} value={metric.value} />))}
    </div>
  </div>
);

export default SlaMetrics;