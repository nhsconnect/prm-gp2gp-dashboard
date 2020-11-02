import React from "react";

import { useSearch } from "../../library/hooks/useSearch";
import PracticeRow from "../PracticeRow";

const PracticeTable = ({ ccgPractices, validPractices }) => {
  const search = useSearch({
    uniqueSearchKey: "odsCode",
    searchKeys: ["odsCode"],
    sourceDocuments: validPractices,
  });

  const isPracticeValid = odsCode => {
    const result = search.search(odsCode);
    return result.length !== 0;
  };

  const renderPracticeRows = () => {
    if (!!ccgPractices) {
      const rows = ccgPractices.map(org => {
        if (isPracticeValid(org.OrgId)) {
          return (
            <PracticeRow key={org.OrgId} odsCode={org.OrgId} name={org.Name} />
          );
        }

        return null;
      });

      return rows;
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Practice Name</th>
        </tr>
      </thead>
      <tbody>{renderPracticeRows()}</tbody>
    </table>
  );
};
export default PracticeTable;
