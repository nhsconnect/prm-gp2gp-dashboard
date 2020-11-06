import React from "react";

import { Search } from "../../library/utils/search/index";
import PracticeRow from "../PracticeRow";
import practiceTableContent from "../../data/content/practiceTable.json";

const PracticeTable = ({ ccgPractices, validPractices }) => {
  const practiceSearch = new Search(["OrgId"], ccgPractices);

  const filteredPractices = validPractices.filter(
    practice => practiceSearch.search(practice.odsCode).length > 0
  );

  return filteredPractices.length === 0 ? (
    <p>{practiceTableContent.noResultsMessage}</p>
  ) : (
    <table>
      <thead>
        <tr>
          <th>{practiceTableContent.firstColumnName}</th>
          <th>{practiceTableContent.secondColumnName}</th>
          <th>{practiceTableContent.thirdColumnName}</th>
          <th>{practiceTableContent.fourthColumnName}</th>
        </tr>
      </thead>
      <tbody>
        {filteredPractices.map(({ odsCode, name, metrics }) => (
          <PracticeRow
            key={odsCode}
            odsCode={odsCode}
            name={name}
            metrics={metrics[0].requester.timeToIntegrateSla}
          />
        ))}
      </tbody>
    </table>
  );
};
export default PracticeTable;
