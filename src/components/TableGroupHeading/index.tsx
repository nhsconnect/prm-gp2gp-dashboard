import React from "react";
import "./index.scss";

export const TableGroupHeading = ({
  columnGapNumber,
  groupHeading,
}: {
  columnGapNumber: number;
  groupHeading: string;
}) => {
  return (
    <tr>
      <th
        colSpan={columnGapNumber}
        scope="colgroup"
        className="table_group_heading__gap"
      ></th>
      <th colSpan={3} scope="colgroup" className="table_group_heading__header">
        {groupHeading}
      </th>
    </tr>
  );
};
