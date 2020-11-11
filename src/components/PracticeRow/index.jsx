import React from "react";
import { Link } from "gatsby";

import { convertToTitleCase } from "../../library/utils/convertToTitleCase/index";
import practiceTableContent from "../../data/content/practiceTable.json";
import "./index.scss";

const TableCell = ({ title, children }) => (
  <td role="cell" className="nhsuk-table__cell">
    <span className="nhsuk-table-responsive__heading">{title}</span>
    {children}
  </td>
);

const PracticeRow = ({ odsCode, name, metrics }) => {
  const formattedName = convertToTitleCase(name);

  return (
    <tr role="row" className="nhsuk-table__row">
      <TableCell title={practiceTableContent.firstColumnName}>
        <Link to={`/practice/${odsCode}`}>
          {formattedName} | {odsCode}
        </Link>
      </TableCell>
      <TableCell title={practiceTableContent.secondColumnName}>
        {metrics.within3Days}
      </TableCell>
      <TableCell title={practiceTableContent.thirdColumnName}>
        {metrics.within8Days}
      </TableCell>
      <TableCell title={practiceTableContent.fourthColumnName}>
        {metrics.beyond8Days}
      </TableCell>
    </tr>
  );
};
export default PracticeRow;
