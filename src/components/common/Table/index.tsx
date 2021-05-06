import React, { FC, AriaAttributes } from "react";
import "./index.scss";
import classNames from "classnames";

type TableProps = {
  headers: string[];
  captionText?: string;
  rows: (string | number | JSX.Element)[][];
  className?: string;
  sortedColumnIndex?: number;
  sortOrder?: AriaAttributes["aria-sort"];
};

export const Table: FC<TableProps> = ({
  headers,
  captionText,
  rows,
  className,
  sortedColumnIndex,
  sortOrder,
}) => (
  <table
    className={classNames("gp2gp-table", className)}
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
        {headers?.map((header, columnIndex) => (
          <th
            scope="col"
            key={header}
            className={`nhsuk-table__col nhsuk-table__col-${columnIndex}`}
            aria-sort={
              sortedColumnIndex !== undefined
                ? columnIndex === sortedColumnIndex
                  ? sortOrder
                  : "none"
                : undefined
            }
          >
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
              data-testid={`table__cell--row-${rowIndex}-col-${cellIndex}`}
              key={`cell-${rowIndex}-${cellIndex}`}
              role="cell"
              className={
                cellIndex === sortedColumnIndex
                  ? "nhsuk-table__cell sorted"
                  : "nhsuk-table__cell"
              }
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
