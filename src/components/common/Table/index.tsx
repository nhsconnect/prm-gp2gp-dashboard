import React, { FC, AriaAttributes, ReactNode } from "react";
import "./index.scss";
import classNames from "classnames";

type TableProps = {
  headers: { title: ReactNode; extra?: ReactNode }[];
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
}) => {
  const isHeaderWithExtra = headers.some((header) => !!header.extra);

  return (
    <table
      data-testid="gp2gp-table"
      className={
        isHeaderWithExtra
          ? classNames("gp2gp-table-with-extra", className)
          : classNames("gp2gp-table", className)
      }
      {...(caption ? { "aria-describedby": "table-title" } : {})}
    >
      {caption ? (
        <caption
          id="table-title"
          className={
            caption.hidden ? "nhsuk-u-visually-hidden" : "nhsuk-table__caption"
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
              key={`column-header-${columnIndex}`}
              className={`nhsuk-table__col nhsuk-table__col-${columnIndex}`}
              aria-sort={
                sortedColumnIndex !== undefined
                  ? columnIndex === sortedColumnIndex
                    ? sortOrder
                    : "none"
                  : undefined
              }
            >
              {header.extra ? (
                <div className="gp2gp-table-with-extra__header">
                  <div className="gp2gp-table-with-extra__header-title">
                    {header.title}
                  </div>
                  {header.extra}
                </div>
              ) : (
                header.title
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {rows?.map((row, rowIndex) => (
          <tr role="row" className="nhsuk-table__row" key={`row-${rowIndex}`}>
            {row?.map((cell, cellIndex) => {
              const header = headers[cellIndex];
              const cellData = (
                <>
                  {" "}
                  <span className="nhsuk-table-responsive__heading">
                    {header.title}
                    {header.extra}
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
                <td
                  {...cellProps}
                  className={
                    header.extra
                      ? `${cellProps.className} gp2gp-table-with-extra__cell`
                      : cellProps.className
                  }
                  role="cell"
                >
                  {cellData}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
