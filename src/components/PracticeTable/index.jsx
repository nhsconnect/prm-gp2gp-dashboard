import React from "react";

import { Search } from "../../library/utils/search/index";
import PracticeRow from "../PracticeRow";
import practiceTableContent from "../../data/content/practiceTable.json";
import { useFeatureToggle } from "../../library/hooks/useFeatureToggle";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import "./index.scss";

const PracticeTable = ({ ccgPractices, validPractices }) => {
  const practiceSearch = new Search(["OrgId"], ccgPractices);
  const isShowPracticeDataOn = useFeatureToggle("F_SHOW_PRACTICE_DATA");

  const filteredPractices = validPractices.filter(
    practice => practiceSearch.search(practice.odsCode).length > 0
  );

  if (filteredPractices.length === 0)
    return <p>{practiceTableContent.noResultsMessage}</p>;

  const { year, month } = filteredPractices[0].metrics[0];

  return (
    <table className="nhsuk-table-responsive" aria-describedby="table-title">
      {isShowPracticeDataOn && (
        <caption id="table-title" className="nhsuk-table__caption">
          Practice performance for {convertMonthNumberToText(month)} {year}
        </caption>
      )}
      <thead className="nhsuk-table__head">
        <tr>
          <th>{practiceTableContent.firstColumnName}</th>
          {isShowPracticeDataOn && (
            <>
              <th>{practiceTableContent.secondColumnName}</th>
              <th>{practiceTableContent.thirdColumnName}</th>
              <th>{practiceTableContent.fourthColumnName}</th>
            </>
          )}
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {filteredPractices.map(({ odsCode, name, metrics }) => (
          <PracticeRow
            key={odsCode}
            odsCode={odsCode}
            name={name}
            metrics={
              isShowPracticeDataOn && metrics[0].requester.timeToIntegrateSla
            }
          />
        ))}
      </tbody>
    </table>
  );
};
export default PracticeTable;
