import React, { AriaAttributes, FC, ReactNode, useMemo, useState } from "react";
import { Link } from "gatsby";
import { Table } from "../common/Table";
import { Select } from "../common/Select";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import "./index.scss";

import practiceTableContent from "../../data/content/practiceIntegrationsSortOptions.json";
import unitsContent from "../../data/content/unitsOptions.json";
import orderContent from "../../data/content/orderOptions.json";
import "../common/Table/index.scss";
import { PageTemplatePath } from "../../library/enums/pageTemplatePath";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { getPreviousMonths } from "../../library/utils/getPreviousMonths";
import { CcgPracticeType } from "../../library/types/practice.types";
import { getTableRowFromMetrics } from "../../library/utils/getTableRowFromMetrics";
import { Units } from "../../library/enums/units";

type TableWithSortProps = {
  ccgPractices: CcgPracticeType[];
  headers: { title: ReactNode; extra?: ReactNode }[];
  sortBySelect: SelectType;
  tableCaption: string;
  pageTemplatePath: PageTemplatePath;
};

type SelectType = {
  defaultValue: string;
  options: {
    displayText: string;
    percentageValue: string;
    numberValue: string;
  }[];
};

export const SortOrder = {
  DESCENDING: orderContent.orderSelect.options[0].value,
  ASCENDING: orderContent.orderSelect.options[1].value,
};

const PracticeLink = ({
  odsCode,
  name,
  pageTemplatePath,
}: {
  odsCode: string;
  name: string;
  pageTemplatePath: PageTemplatePath;
}) => {
  const formattedName = convertToTitleCase(name);
  return (
    <Link to={`/practice/${odsCode}/${pageTemplatePath}`}>
      {formattedName} - {odsCode}
    </Link>
  );
};

const sortPractices = (
  practices: CcgPracticeType[],
  fieldName: string,
  order: string,
  monthIndex: number
) => {
  const getFieldValue = (field: any, monthIndex: number) => {
    if (fieldName === "requestingPracticeName") return field.name;
    const transfersReceivedMetrics =
      field.metrics[monthIndex].requestedTransfers;
    return transfersReceivedMetrics[fieldName];
  };

  const sortData = (firstEl: string | number, secondEl: string | number) => {
    if (firstEl === null || secondEl > firstEl) {
      return -1;
    }
    if (secondEl === null || secondEl < firstEl) {
      return 1;
    }
    return 0;
  };

  return [...practices].sort((firstEl, secondEl) => {
    const firstField = getFieldValue(firstEl, monthIndex);
    const secondField = getFieldValue(secondEl, monthIndex);
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
  tableCaption,
  pageTemplatePath,
}) => {
  const metrics = ccgPractices[0].metrics;
  const monthSelect = getPreviousMonths(
    metrics[0].month,
    metrics[0].year,
    metrics.length
  );

  const [selectedField, setSelectedField] = useState(sortBySelect.defaultValue);
  const [selectedOrder, setSelectedOrder] = useState(
    orderContent.orderSelect.defaultValue
  );
  const [selectedUnits, setSelectedUnits] = useState(
    unitsContent.unitsSelect.defaultValue
  );
  const [selectedMonth, setSelectedMonth] = useState(monthSelect.defaultValue);

  const { month, year } = metrics[selectedMonth];
  const tableCaptionWithMonthYear = `${tableCaption} - ${convertMonthNumberToText(
    month
  )} ${year}`;

  const sortedPractices = useMemo(() => {
    return sortPractices(
      ccgPractices,
      selectedField,
      selectedOrder,
      selectedMonth
    );
  }, [
    ccgPractices,
    selectedField,
    selectedOrder,
    selectedMonth,
    selectedUnits,
  ]);

  const practiceTableRows = sortedPractices.map(
    ({ odsCode, name, metrics }: CcgPracticeType) => {
      return getTableRowFromMetrics(
        <PracticeLink
          odsCode={odsCode}
          name={name}
          pageTemplatePath={pageTemplatePath}
        />,
        metrics[selectedMonth],
        pageTemplatePath,
        selectedUnits as Units
      );
    }
  );

  const sortBySelectOptions = sortBySelect.options.map((item) => {
    if ((selectedUnits as Units) == Units.PERCENTAGES)
      return { displayText: item.displayText, value: item.percentageValue };
    else return { displayText: item.displayText, value: item.numberValue };
  });

  const handleSortByValueChange = (value: string) => {
    setSelectedField(value);
  };

  const handleOrderValueChange = (value: string) => {
    setSelectedOrder(value);
  };

  const handleUnitsValueChange = (value: string) => {
    const currSortedColumnIndex = sortBySelect.options.findIndex(
      (option) =>
        option.percentageValue === selectedField ||
        option.numberValue === selectedField
    );
    if ((selectedUnits as Units) == Units.PERCENTAGES)
      setSelectedField(sortBySelect.options[currSortedColumnIndex].numberValue);
    else
      setSelectedField(
        sortBySelect.options[currSortedColumnIndex].percentageValue
      );
    setSelectedUnits(value);
  };

  const handleMonthValueChange = (value: string) => {
    setSelectedMonth(parseInt(value));
  };

  const sortedColumnIndex = sortBySelect.options.findIndex(
    (option) =>
      option.percentageValue === selectedField ||
      option.numberValue === selectedField
  );

  return (
    <div className="nhsuk-u-margin-top-6">
      <div className="gp2gp-sort nhsuk-u-margin-bottom-4">
        <div className="gp2gp-select-combo">
          <Select
            label="Month"
            hiddenLabel=" this element filters the practice performance table"
            options={monthSelect.options}
            id="monthSelect"
            value={selectedMonth}
            defaultValue={monthSelect.defaultValue}
            handleValueChange={handleMonthValueChange}
            className="nhsuk-u-margin-right-3"
          />
          <Select
            label="Units"
            hiddenLabel={unitsContent.selectHiddenLabel}
            options={unitsContent.unitsSelect.options}
            id="unitsSelect"
            value={selectedUnits}
            defaultValue={unitsContent.unitsSelect.defaultValue}
            handleValueChange={handleUnitsValueChange}
            className="nhsuk-u-margin-right-3"
          />
        </div>
        <div className="gp2gp-select-combo">
          <Select
            label="Sort by"
            hiddenLabel={practiceTableContent.selectHiddenLabel}
            options={sortBySelectOptions}
            id="sortBySelect"
            value={selectedField}
            defaultValue={sortBySelect.defaultValue}
            handleValueChange={handleSortByValueChange}
            className="nhsuk-u-margin-right-3"
          />
          <Select
            label="Order"
            hiddenLabel={orderContent.selectHiddenLabel}
            options={orderContent.orderSelect.options}
            id="orderSelect"
            value={selectedOrder}
            defaultValue={orderContent.orderSelect.defaultValue}
            handleValueChange={handleOrderValueChange}
          />
        </div>
      </div>
      <Table
        caption={{ text: tableCaptionWithMonthYear, hidden: false }}
        headers={headers}
        rows={practiceTableRows}
        sortedColumnIndex={sortedColumnIndex}
        sortOrder={selectedOrder as AriaAttributes["aria-sort"]}
      />
    </div>
  );
};
