import React, { AriaAttributes, FC, useMemo, useState } from "react";
import { Link } from "gatsby";
import { Table } from "../common/Table";
import { Select } from "../common/Select";

import { PracticeType } from "../../templates/Practice/practice.types";

import { addPercentageSign } from "../../library/utils/addPercentageSign";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";

import practiceTableContent from "../../data/content/practiceTable.json";
import "../common/Table/index.scss";

type TableWithSortProps = {
  ccgPractices: PracticeType[];
  headers: string[];
  sortBySelect: SelectType;
  orderSelect: SelectType;
  tableCaption: string;
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
      {formattedName} - {odsCode}
    </Link>
  );
};

const sortPractices = (practices: any[], fieldName: string, order: string) => {
  const getFieldName = (field: any) => {
    return fieldName === "practiceName"
      ? field.name
      : field.metrics[0].requester.integrated[fieldName];
  };

  const sortData = (firstEl: any, secondEl: any) => {
    if (firstEl === null || secondEl > firstEl) {
      return -1;
    }
    if (secondEl === null || secondEl < firstEl) {
      return 1;
    }
    return 0;
  };

  return [...practices].sort((firstEl, secondEl) => {
    const firstField = getFieldName(firstEl);
    const secondField = getFieldName(secondEl);
    if (order === SortOrder.ASCENDING) {
      return sortData(firstField, secondField);
    }
    return sortData(secondField, firstField);
  });
};

export const PracticeTableWithSort: FC<TableWithSortProps> = ({
  ccgPractices,
  headers,
  sortBySelect,
  orderSelect,
  tableCaption,
}) => {
  const [selectedField, setSelectedField] = useState(sortBySelect.defaultValue);
  const [selectedOrder, setSelectedOrder] = useState(orderSelect.defaultValue);
  const sortedPractices = useMemo(() => {
    return sortPractices(ccgPractices, selectedField, selectedOrder);
  }, [ccgPractices, selectedField, selectedOrder]);

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

  const sortedColumnIndex = sortBySelect.options.findIndex(
    (option) => option.value === selectedField
  );

  return (
    <div className="nhsuk-u-margin-top-6">
      <div className="gp2gp-sort">
        <Select
          label="Sort by"
          hiddenLabel={practiceTableContent.selectHiddenLabel}
          options={sortBySelect.options}
          id="sortBySelect"
          defaultValue={sortBySelect.defaultValue}
          handleValueChange={handleSortByValueChange}
          className="nhsuk-u-margin-right-6"
        />
        <Select
          label="Order"
          hiddenLabel={practiceTableContent.selectHiddenLabel}
          options={orderSelect.options}
          id="orderSelect"
          defaultValue={orderSelect.defaultValue}
          handleValueChange={handleOrderValueChange}
        />
      </div>
      <Table
        caption={{ text: `${tableCaption} data`, hidden: true }}
        headers={headers}
        rows={practiceTableRows}
        sortedColumnIndex={sortedColumnIndex}
        sortOrder={selectedOrder as AriaAttributes["aria-sort"]}
      />
    </div>
  );
};
