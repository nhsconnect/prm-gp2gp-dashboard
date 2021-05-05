import React, { FC, useMemo, useState } from "react";
import { Link } from "gatsby";
import { Table } from "../common/Table";
import { Select } from "../common/Select";

import { PracticeType } from "../../templates/Practice/practice.types";

import { addPercentageSign } from "../../library/utils/addPercentageSign";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { useFeatureToggles } from "../../library/hooks/useFeatureToggle";

import practiceTableContent from "../../data/content/practiceTable.json";

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

export const SortOrder = {
  DESCENDING: practiceTableContent.orderSelect.options[0].value,
  ASCENDING: practiceTableContent.orderSelect.options[1].value,
};

const PracticeLink = ({ odsCode, name }: { odsCode: string; name: string }) => {
  const formattedName = convertToTitleCase(name);
  return (
    <Link to={`/practice/${odsCode}`}>
      {formattedName} | {odsCode}
    </Link>
  );
};

const _sortData = (firstEl: any, secondEl: any) => {
  if (firstEl === null || secondEl > firstEl) {
    return -1;
  }
  if (secondEl === null || secondEl < firstEl) {
    return 1;
  }
  return 0;
};

const _sortPractices = (practices: any[], fieldName: string, order: string) => {
  const getFieldName = (field: any) => {
    return fieldName === "practiceName"
      ? field.name
      : field.metrics[0].requester.integrated[fieldName];
  };

  return [...practices].sort((firstEl, secondEl) => {
    const firstField = getFieldName(firstEl);
    const secondField = getFieldName(secondEl);
    if (order === SortOrder.ASCENDING) {
      return _sortData(firstField, secondField);
    }
    return _sortData(secondField, firstField);
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
  const sortedPractices = useMemo(() => {
    return _sortPractices(filteredPractices, selectedField, selectedOrder);
  }, [filteredPractices, selectedField, selectedOrder]);

  const { practiceTableWithSort } = useFeatureToggles();

  const { year, month } = filteredPractices[0].metrics[0];

  const tableTitle = `Practice performance for ${convertMonthNumberToText(
    month
  )} ${year}`;

  const practiceTableRows = sortedPractices.map(
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
    setSelectedField(value);
  };

  const handleOrderValueChange = (value: string) => {
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
        className="nhsuk-u-margin-right-6"
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
