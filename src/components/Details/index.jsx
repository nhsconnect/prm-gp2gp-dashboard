import React from "react";
import "./index.scss";

const Details = ({ summary, headers, rows }) => (
  <details className="nhsuk-details">
    <summary className="nhsuk-details__summary">
      <span className="nhsuk-details__summary-text">{summary}</span>
    </summary>
    <div className="nhsuk-details__text">
      <div className="nhsuk-table-responsive">
        <table className="nhsuk-table">
          <thead className="nhsuk-table__head">
            <tr>
              {headers?.map(header => (
                <th scope="col" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="nhsuk-table__body">
            {rows?.map((row, rowIndex) => (
              <tr
                role="row"
                className="nhsuk-table__row"
                key={`row-${rowIndex}`}
              >
                {row?.map((cell, cellIndex) => (
                  <td
                    role="cell"
                    className="nhsuk-table__cell"
                    key={`row-${rowIndex}-cell-${cellIndex}`}
                  >
                    <span className="nhsuk-table-responsive__heading">
                      {headers[cellIndex]}
                    </span>
                    {cell}
                  </td>
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
