import React, { FC, useState } from "react";
import { Link } from "gatsby";
import { Table } from "../common/Table";

import { PracticeType } from "../../templates/Practice/practice.types";

import practiceTableContent from "../../data/content/practiceTable.json";

import { addPercentageSign } from "../../library/utils/addPercentageSign";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { useFeatureToggles } from "../../library/hooks/useFeatureToggle";

type TableWithSortProps = {
  filteredPractices: PracticeType[];
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

export const PracticeTableWithSort: FC<TableWithSortProps> = ({
  filteredPractices,
}) => {
  const [practices] = useState(filteredPractices);
  const { practiceTableWithSort } = useFeatureToggles();

  _sort_practices_by_beyond8Days(practices);

  const { year, month } = filteredPractices[0].metrics[0];

  const tableTitle = `Practice performance for ${convertMonthNumberToText(
    month
  )} ${year}`;

  const practiceTableRows = practices.map(
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

  return practiceTableWithSort ? (
    <>
      <h3>{tableTitle}</h3>
      <Table
        className="gp2gp-ccg-table"
        headers={practiceTableContent.tableHeaders}
        rows={practiceTableRows}
      />
    </>
  ) : (
    <Table
      className="gp2gp-ccg-table"
      captionText={tableTitle}
      headers={practiceTableContent.tableHeaders}
      rows={practiceTableRows}
    />
  );
};
