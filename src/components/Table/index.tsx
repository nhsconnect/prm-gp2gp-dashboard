import React, { FC } from "react";
import "./index.scss";

type TableProps = {
  headers: string[];
  captionText?: string;
  rows: string[][];
};

const Table: FC<TableProps> = ({ headers, captionText, rows }) => (
  <table
    className="gp2gp-table"
    {...(captionText ? { "aria-describedby": "table-title" } : {})}
  >
    {captionText ? (
      <caption
        id="table-title"
        className="nhsuk-table__caption nhsuk-u-margin-bottom-4"
      >
        {captionText}
      </caption>
    ) : null}
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
        <tr role="row" className="nhsuk-table__row" key={`row-${rowIndex}`}>
          {row?.map((cell, cellIndex) => (
            <td
              key={`cell-${rowIndex}-${cellIndex}`}
              role="cell"
              className="nhsuk-table__cell"
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
);

export default Table;
