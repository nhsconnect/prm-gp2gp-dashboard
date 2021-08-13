import React, { FC, AriaAttributes } from "react";
import "./index.scss";
import classNames from "classnames";

type TableProps = {
  headers: string[];
  caption?: { text: string; hidden: boolean };
  rows: (string | number | JSX.Element)[][];
  className?: string;
  sortedColumnIndex?: number;
  sortOrder?: AriaAttributes["aria-sort"];
};

export const Table: FC<TableProps> = ({
  headers,
  caption,
  rows,
  className,
  sortedColumnIndex,
  sortOrder,
}) => (
  <table
    className={classNames("gp2gp-table", className)}
    {...(caption ? { "aria-describedby": "table-title" } : {})}
  >
    {caption ? (
      <caption
        id="table-title"
        className={
          caption.hidden
            ? "nhsuk-u-visually-hidden"
            : "nhsuk-table__caption nhsuk-u-margin-bottom-4"
        }
      >
        {caption.text}
      </caption>
    ) : null}
    <thead className="nhsuk-table__head">
      <tr>
        {headers?.map((header, columnIndex) => (
          <th
            scope="col"
            role="columnheader"
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
          {row?.map((cell, cellIndex) => {
            const cellData = (
              <>
                {" "}
                <span className="nhsuk-table-responsive__heading">
                  {headers[cellIndex]}
                </span>
                {cell}
              </>
            );
            const cellProps = {
              "data-testid": `table__cell--row-${rowIndex}-col-${cellIndex}`,
              key: `cell-${rowIndex}-${cellIndex}`,
              className:
                cellIndex === sortedColumnIndex
                  ? "nhsuk-table__cell sorted"
                  : "nhsuk-table__cell",
            };
            // For accessibility the first cell in a row is a header for the screen reader
            return cellIndex === 0 ? (
              <th
                {...cellProps}
                className={`${cellProps.className} nhs-table__header_cell`}
                scope="row"
                role="rowheader"
              >
                {cellData}
              </th>
            ) : (
              <td {...cellProps} role="cell">
                {cellData}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
);
