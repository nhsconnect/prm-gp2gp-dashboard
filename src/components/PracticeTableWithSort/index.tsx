import React, { FC, useState } from "react";
import { Link } from "gatsby";
import { Table } from "../common/Table";
import { Select } from "../common/Select";

import { PracticeType } from "../../templates/Practice/practice.types";

import { addPercentageSign } from "../../library/utils/addPercentageSign";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { useFeatureToggles } from "../../library/hooks/useFeatureToggle";

type TableWithSortProps = {
  filteredPractices: PracticeType[];
  headers: string[];
  sortBySelect: {
    defaultValue: string;
    options: { displayText: string; value: string }[];
  };
};

const PracticeLink = ({ odsCode, name }: { odsCode: string; name: string }) => {
  const formattedName = convertToTitleCase(name);
  return (
    <Link to={`/practice/${odsCode}`}>
      {formattedName} | {odsCode}
    </Link>
  );
};

const _sortBySelectedField = (practices: any[], fieldName: string) => {
  return practices.sort((firstEl, secondEl) => {
    const firstPracticeSelectedField =
      firstEl.metrics[0].requester.integrated[fieldName];
    const secondPracticeSelectedField =
      secondEl.metrics[0].requester.integrated[fieldName];

    if (firstPracticeSelectedField === null) return 1;
    if (secondPracticeSelectedField === null) return -1;

    return secondPracticeSelectedField - firstPracticeSelectedField;
  });
};

export const PracticeTableWithSort: FC<TableWithSortProps> = ({
  filteredPractices,
  headers,
  sortBySelect,
}) => {
  const [practices, setPractices] = useState(() =>
    _sortBySelectedField(filteredPractices, sortBySelect.defaultValue)
  );
  const { practiceTableWithSort } = useFeatureToggles();

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

  const handleSortByValueChange = (value: string) => {
    setPractices([..._sortBySelectedField(practices, value)]);
  };

  return practiceTableWithSort ? (
    <>
      <h3>{tableTitle}</h3>
      <Select
        label="Sort by"
        options={sortBySelect.options}
        id="sortBySelect"
        defaultValue={sortBySelect.defaultValue}
        handleValueChange={handleSortByValueChange}
      />
      <Table
        className="gp2gp-ccg-table"
        headers={headers}
        rows={practiceTableRows}
      />
    </>
  ) : (
    <Table
      className="gp2gp-ccg-table"
      captionText={tableTitle}
      headers={headers}
      rows={practiceTableRows}
    />
  );
};
