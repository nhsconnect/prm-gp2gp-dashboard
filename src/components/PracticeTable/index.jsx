import React from "react";

import { Search } from "../../library/utils/search/index";
import PracticeRow from "../PracticeRow";
import practiceTableContent from "../../data/content/practiceTable.json";

const PracticeTable = ({ ccgPractices, validPractices }) => {
  const practiceSearch = new Search(["odsCode"], validPractices);

  const filteredPractices = ccgPractices?.filter(
    ccg => practiceSearch.search(ccg.OrgId).length > 0
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
