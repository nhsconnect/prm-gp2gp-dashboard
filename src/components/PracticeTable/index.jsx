import React from "react";
import { Link } from "gatsby";

import { Search } from "../../library/utils/search/index";
import practiceTableContent from "../../data/content/practiceTable.json";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase/index";
import "./index.scss";
import Table from "../Table";
import { useFeatureToggle } from "../../library/hooks/useFeatureToggle";

const PracticeLink = ({ odsCode, name }) => {
  const formattedName = convertToTitleCase(name);
  return (
    <Link to={`/practice/${odsCode}`}>
      {formattedName} | {odsCode}
    </Link>
  );
};

const PracticeTable = ({ ccgPractices, validPractices }) => {
  const practiceSearch = new Search("OrgId", ["OrgId"], ccgPractices);
  const isPracticeIntegratedTransferCountOn = useFeatureToggle(
    "F_PRACTICE_INTEGRATED_TRANSFER_COUNT"
  );

  const filteredPractices = validPractices.filter(
    practice => practiceSearch.search(practice.odsCode).length > 0
  );

  if (filteredPractices.length === 0)
    return <p>{practiceTableContent.noResultsMessage}</p>;

  isPracticeIntegratedTransferCountOn
    ? filteredPractices.sort(
        (firstEl, secondEl) =>
          secondEl.metrics[0].requester.integrated.beyond8Days -
          firstEl.metrics[0].requester.integrated.beyond8Days
      )
    : filteredPractices.sort(
        (firstEl, secondEl) =>
          secondEl.metrics[0].requester.timeToIntegrateSla.beyond8Days -
          firstEl.metrics[0].requester.timeToIntegrateSla.beyond8Days
      );

  const { year, month } = filteredPractices[0].metrics[0];

  const practiceTableRows = isPracticeIntegratedTransferCountOn
    ? filteredPractices.map(({ odsCode, name, metrics }) => {
        const slaMetrics = metrics[0].requester.integrated;
        return [
          <PracticeLink odsCode={odsCode} name={name} />,
          slaMetrics.transferCount,
          slaMetrics.within3Days,
          slaMetrics.within8Days,
          slaMetrics.beyond8Days,
        ];
      })
    : filteredPractices.map(({ odsCode, name, metrics }) => {
        const slaMetrics = metrics[0].requester.timeToIntegrateSla;
        return [
          <PracticeLink odsCode={odsCode} name={name} />,
          slaMetrics.within3Days,
          slaMetrics.within8Days,
          slaMetrics.beyond8Days,
        ];
      });

  const tableCaptionText = `Practice performance for ${convertMonthNumberToText(
    month
  )} ${year}`;

  return (
    <>
      <p className="nhsuk-body-m nhsuk-u-margin-top-6 nhsuk-u-margin-bottom-5">
        {practiceTableContent.description}
      </p>
      <Table
        className={isPracticeIntegratedTransferCountOn && "gp2gp-ccg-table"}
        captionText={tableCaptionText}
        headers={
          isPracticeIntegratedTransferCountOn
            ? practiceTableContent.tableHeaders
            : practiceTableContent.tableHeadersOld
        }
        rows={practiceTableRows}
      />
    </>
  );
};

export default PracticeTable;
