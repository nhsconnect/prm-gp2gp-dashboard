import React from "react";
import { Link } from "gatsby";

import { convertToTitleCase } from "../../library/utils/convertToTitleCase/index";
import practiceTableContent from "../../data/content/practiceTable.json";
import "./index.scss";

const PracticeRow = ({ odsCode, name, metrics }) => {
  const formattedName = convertToTitleCase(name);

  return (
    <tr className="nhsuk-table__row">
      <td className="nhsuk-table__cell">
        <span className="nhsuk-table-responsive__heading">
          {practiceTableContent.firstColumnName}
        </span>
        <Link to={`/practice/${odsCode}`}>
          {formattedName} | {odsCode}
        </Link>
      </td>
      {metrics && (
        <>
          <td className="nhsuk-table__cell">
            <span className="nhsuk-table-responsive__heading">
              {practiceTableContent.secondColumnName}
            </span>
            {metrics.within3Days}
          </td>
          <td className="nhsuk-table__cell">
            <span className="nhsuk-table-responsive__heading">
              {practiceTableContent.thirdColumnName}
            </span>
            {metrics.within8Days}
          </td>
          <td className="nhsuk-table__cell">
            <span className="nhsuk-table-responsive__heading">
              {practiceTableContent.fourthColumnName}
            </span>
            {metrics.beyond8Days}
          </td>
        </>
      )}
    </tr>
  );
};
export default PracticeRow;
