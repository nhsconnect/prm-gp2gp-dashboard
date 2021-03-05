import React from "react";

export const TableGroupHeading = ({
  columnGapNumber,
  groupHeading,
}: {
  columnGapNumber: number;
  groupHeading: string;
}) => {
  return (
    <tr>
      <th colSpan={columnGapNumber} scope="colgroup"></th>
      <th colSpan={3} scope="colgroup">
        {groupHeading}
      </th>
    </tr>
  );
};
