import React from "react";
import { Link } from "gatsby";

import { convertToTitleCase } from "../../library/utils/convertToTitleCase/index";

const PracticeRow = ({ odsCode, name, metrics }) => {
  const formattedName = convertToTitleCase(name);

  return (
    <tr>
      <td>
        <Link to={`/practice/${odsCode}`}>
          {formattedName} | {odsCode}
        </Link>
      </td>
      {metrics && (
        <>
          <td>{metrics.within3Days}</td>
          <td>{metrics.within8Days}</td>
          <td>{metrics.beyond8Days}</td>
        </>
      )}
    </tr>
  );
};
export default PracticeRow;
