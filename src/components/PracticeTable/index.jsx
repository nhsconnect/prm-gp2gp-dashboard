import React from "react";

import { Search } from "../../library/utils/search/index";
import PracticeRow from "../PracticeRow";
import practiceTableContent from "../../data/content/practiceTable.json";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import "./index.scss";

const PracticeTable = ({ ccgPractices, validPractices }) => {
  const practiceSearch = new Search("OrgId", ["OrgId"], ccgPractices);

  const filteredPractices = validPractices.filter(
    practice => practiceSearch.search(practice.odsCode).length > 0
  );

  if (filteredPractices.length === 0)
    return <p>{practiceTableContent.noResultsMessage}</p>;

  filteredPractices.sort(
    (firstEl, secondEl) =>
      secondEl.metrics[0].requester.timeToIntegrateSla.beyond8Days -
      firstEl.metrics[0].requester.timeToIntegrateSla.beyond8Days
  );

  const { year, month } = filteredPractices[0].metrics[0];

  return (
    <>
      <p className="nhsuk-body-m nhsuk-u-margin-top-6 nhsuk-u-margin-bottom-5">
        {practiceTableContent.description}
      </p>
      <table className="gp2gp-practice-table" aria-describedby="table-title">
        <caption
          id="table-title"
          className="nhsuk-table__caption nhsuk-u-margin-bottom-4"
        >
          Practice performance for {convertMonthNumberToText(month)} {year}
        </caption>
        <thead className="nhsuk-table__head">
          <tr>
            <th>{practiceTableContent.firstColumnName}</th>
            <th>{practiceTableContent.secondColumnName}</th>
            <th>{practiceTableContent.thirdColumnName}</th>
            <th>{practiceTableContent.fourthColumnName}</th>
          </tr>
        </thead>
        <tbody className="nhsuk-table__body">
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
    </>
  );
};
export default PracticeTable;
