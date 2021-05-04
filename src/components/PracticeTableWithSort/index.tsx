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
  sortBySelect: SelectType;
  orderSelect: SelectType;
};

type SelectType = {
  defaultValue: string;
  options: { displayText: string; value: string }[];
};

const PracticeLink = ({ odsCode, name }: { odsCode: string; name: string }) => {
  const formattedName = convertToTitleCase(name);
  return (
    <Link to={`/practice/${odsCode}`}>
      {formattedName} | {odsCode}
    </Link>
  );
};

const _sortInAscendingOrder = (firstEl: any, secondEl: any) => {
  if (firstEl === null) return -1;
  if (secondEl === null) return 1;

  if (secondEl < firstEl) return 1;
  if (secondEl > firstEl) return -1;
  return 0;
};

const _sortInDescendingOrder = (firstEl: any, secondEl: any) => {
  if (firstEl === null) return 1;
  if (secondEl === null) return -1;

  if (secondEl < firstEl) return -1;
  if (secondEl > firstEl) return 1;
  return 0;
};

const _sortPractices = (practices: any[], fieldName: string, order: string) => {
  return practices.sort((firstEl, secondEl) => {
    const firstField =
      fieldName === "practiceName"
        ? firstEl.name
        : firstEl.metrics[0].requester.integrated[fieldName];

    const secondField =
      fieldName === "practiceName"
        ? secondEl.name
        : secondEl.metrics[0].requester.integrated[fieldName];

    if (order === "ascending")
      return _sortInAscendingOrder(firstField, secondField);
    else return _sortInDescendingOrder(firstField, secondField);
  });
};

export const PracticeTableWithSort: FC<TableWithSortProps> = ({
  filteredPractices,
  headers,
  sortBySelect,
  orderSelect,
}) => {
  const [selectedField, setSelectedField] = useState(sortBySelect.defaultValue);
  const [selectedOrder, setSelectedOrder] = useState(orderSelect.defaultValue);
  const [practices, setPractices] = useState(() =>
    _sortPractices(filteredPractices, selectedField, selectedOrder)
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
    setPractices([..._sortPractices(practices, value, selectedOrder)]);
    setSelectedField(value);
  };

  const handleOrderValueChange = (value: string) => {
    setPractices([..._sortPractices(practices, selectedField, value)]);
    setSelectedOrder(value);
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
      <Select
        label="Order"
        options={orderSelect.options}
        id="orderSelect"
        defaultValue={orderSelect.defaultValue}
        handleValueChange={handleOrderValueChange}
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
