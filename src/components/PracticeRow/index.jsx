import React from "react";
import { Link } from "gatsby";

const PracticeRow = ({ odsCode, name }) => {
  return (
    <tr>
      <td>
        <Link to={`/practice/${odsCode}`}>
          {name} | {odsCode}
        </Link>
      </td>
    </tr>
  );
};
export default PracticeRow;
