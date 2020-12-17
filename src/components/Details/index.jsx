import React from "react";
import Table from "../Table";
import "./index.scss";

const Details = ({ summary, headers, rows }) => (
  <details className="nhsuk-details">
    <summary className="nhsuk-details__summary">
      <span className="nhsuk-details__summary-text">{summary}</span>
    </summary>
    <div className="nhsuk-details__text">
      <Table headers={headers} rows={rows} />
    </div>
  </details>
);

export default Details;
