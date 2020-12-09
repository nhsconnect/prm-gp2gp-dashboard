import React from "react";
import "./index.scss";

const Details = ({ summary, headers, rows }) => (
  <details className="nhsuk-details">
    <summary className="nhsuk-details__summary">
      <span className="nhsuk-details__summary-text">{summary}</span>
    </summary>
    <div className="nhsuk-details__text">
      <div className="nhsuk-table-responsive">
        <table>
          <thead>
            <tr>
              {headers?.map(header => (
                <th scope="col" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows?.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row?.map((cell, cellIndex) => (
                  <td key={`row-${rowIndex}-cell-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </details>
);

export default Details;
