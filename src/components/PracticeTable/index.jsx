import React from "react";

import { useSearch } from "../../library/hooks/useSearch";
import PracticeRow from "../PracticeRow";
import practiceTableContent from "../../data/content/practiceTable.json";

const PracticeTable = ({ ccgPractices, validPractices }) => {
  const search = useSearch({
    keys: ["odsCode"],
    list: validPractices,
  });

  const filteredPractices = ccgPractices?.filter(
    ccg => search.search(ccg.OrgId).length > 0
  );

  return !filteredPractices ? (
    <p>{practiceTableContent.loadingMessage}</p>
  ) : !filteredPractices.length ? (
    <p>{practiceTableContent.noResultsMessage}</p>
  ) : (
    <table>
      <thead>
        <tr>
          <th>{practiceTableContent.firstColumnName}</th>
        </tr>
      </thead>
      <tbody>
        {filteredPractices.map(org => (
          <PracticeRow key={org.OrgId} odsCode={org.OrgId} name={org.Name} />
        ))}
      </tbody>
    </table>
  );
};
export default PracticeTable;
