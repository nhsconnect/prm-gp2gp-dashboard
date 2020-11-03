import React from "react";
import { Link } from "gatsby";

import { convertToTitleCase } from "../../library/common/index";

const PracticeRow = ({ odsCode, name }) => {
  const formattedName = convertToTitleCase(name);

  return (
    <tr>
      <td>
        <Link to={`/practice/${odsCode}`}>
          {formattedName} | {odsCode}
        </Link>
      </td>
    </tr>
  );
};
export default PracticeRow;
