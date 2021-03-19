import React, { FC } from "react";
import { Link } from "gatsby";

import { Table } from "../common/Table";
import { AboutThisDataContent } from "../AboutThisDataContent";
import { Expander } from "../common/Expander";

import { PracticeType } from "../../templates/Practice/practice.types";

import practiceTableContent from "../../data/content/practiceTable.json";
import ccgContent from "../../data/content/ccg.json";
import eightDayExpanderContent from "../../data/content/eightDayExpander.json";

import { Search } from "../../library/utils/search";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { addPercentageSign } from "../../library/utils/addPercentageSign";
import "./index.scss";

type CcgPageContentProps = {
  ccgPractices: { OrgId: string; Name: string }[];
  validPractices: PracticeType[];
};

const PracticeLink = ({ odsCode, name }: { odsCode: string; name: string }) => {
  const formattedName = convertToTitleCase(name);
  return (
    <Link to={`/practice/${odsCode}`}>
      {formattedName} | {odsCode}
    </Link>
  );
};

const _sort_practices_by_beyond8Days = (filteredPractices: PracticeType[]) => {
  filteredPractices.sort((firstEl, secondEl) => {
    const firstPracticeBeyond8Days =
      firstEl.metrics[0].requester.integrated.beyond8DaysPercentage;
    const secondPracticeBeyond8Days =
      secondEl.metrics[0].requester.integrated.beyond8DaysPercentage;

    if (firstPracticeBeyond8Days === null) return 1;
    if (secondPracticeBeyond8Days === null) return -1;

    return secondPracticeBeyond8Days - firstPracticeBeyond8Days;
  });
};

export const CcgPageContent: FC<CcgPageContentProps> = ({
  ccgPractices,
  validPractices,
}) => {
  const practiceSearch = new Search("OrgId", ["OrgId"], ccgPractices);
  const filteredPractices = validPractices.filter(
    practice => practiceSearch.search(practice.odsCode).length > 0
  );

  if (filteredPractices.length === 0)
    return <p>{practiceTableContent.noResultsMessage}</p>;

  _sort_practices_by_beyond8Days(filteredPractices);

  const { year, month } = filteredPractices[0].metrics[0];

  const practiceTableRows = filteredPractices.map(
    ({ odsCode, name, metrics }: PracticeType) => {
      const slaMetrics = metrics[0].requester.integrated;
      return [
        <PracticeLink odsCode={odsCode} name={name} />,
        slaMetrics.transferCount,
        addPercentageSign(slaMetrics.within3DaysPercentage),
        addPercentageSign(slaMetrics.within8DaysPercentage),
        addPercentageSign(slaMetrics.beyond8DaysPercentage),
      ];
    }
  );

  const tableCaptionText = `Practice performance for ${convertMonthNumberToText(
    month
  )} ${year}`;

  return (
    <>
      <p className="nhsuk-body">
        {ccgContent.tableDescription} More information{" "}
        <a href="#about-this-data">about this data</a>.
      </p>

      <Expander
        title={eightDayExpanderContent.title}
        content={
          <>
            <p>{eightDayExpanderContent.firstParagraph}</p>
            <p>{eightDayExpanderContent.secondParagraph}</p>
          </>
        }
      />

      <Table
        className="gp2gp-ccg-table"
        captionText={tableCaptionText}
        headers={practiceTableContent.tableHeaders}
        rows={practiceTableRows}
      />
      <AboutThisDataContent />
    </>
  );
};
