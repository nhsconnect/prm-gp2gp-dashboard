import React, { AriaAttributes, FC, ReactNode, useMemo, useState } from "react";
import { Link } from "gatsby";
import { Table } from "../common/Table";
import { Select } from "../common/Select";

import { addPercentageSign } from "../../library/utils/addPercentageSign";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";

import practiceTableContent from "../../data/content/practiceIntegrationsSortOptions.json";
import unitsContent from "../../data/content/unitsOptions.json";
import "../common/Table/index.scss";
import { PageTemplatePath } from "../../library/enums/pageTemplatePath";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { getPreviousMonths } from "../../library/utils/getPreviousMonths";
import {
  CcgPracticeType,
  IntegrationRequestedTransfersType,
  TransfersRequestedTransfersType,
} from "../../library/types/practice.types";

type TableWithSortProps = {
  ccgPractices: CcgPracticeType[];
  headers: { title: ReactNode; extra?: ReactNode }[];
  sortBySelect: SelectType;
  orderSelect: SelectType;
  tableCaption: string;
  pageTemplatePath: PageTemplatePath;
};

type SelectType = {
  defaultValue: string;
  options: { displayText: string; value: string }[];
};

export const SortOrder = {
  DESCENDING: practiceTableContent.orderSelect.options[0].value,
  ASCENDING: practiceTableContent.orderSelect.options[1].value,
};

export const Units = {
  PERCENTAGES: unitsContent.unitsSelect.options[0].value,
  NUMBERS: unitsContent.unitsSelect.options[1].value,
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
  orderSelect,
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
  const [selectedOrder, setSelectedOrder] = useState(orderSelect.defaultValue);
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
      if (pageTemplatePath == PageTemplatePath.IntegrationTimes) {
        const requestedMetric = metrics[selectedMonth]
          .requestedTransfers as IntegrationRequestedTransfersType;
        return [
          <PracticeLink
            odsCode={odsCode}
            name={name}
            pageTemplatePath={pageTemplatePath}
          />,
          requestedMetric.receivedCount,
          selectedUnits == Units.PERCENTAGES
            ? addPercentageSign(
                requestedMetric.integratedWithin3DaysPercentOfReceived
              )
            : requestedMetric.integratedWithin3DaysCount,
          selectedUnits == Units.PERCENTAGES
            ? addPercentageSign(
                requestedMetric.integratedWithin8DaysPercentOfReceived
              )
            : requestedMetric.integratedWithin8DaysCount,
          selectedUnits == Units.PERCENTAGES
            ? addPercentageSign(
                requestedMetric.notIntegratedWithin8DaysPercentOfReceived
              )
            : requestedMetric.notIntegratedWithin8DaysTotal,
        ];
      }

      if (pageTemplatePath == PageTemplatePath.GP2GPTransfersRequested) {
        const requestedMetric = metrics[selectedMonth]
          .requestedTransfers as TransfersRequestedTransfersType;
        return [
          <PracticeLink
            odsCode={odsCode}
            name={name}
            pageTemplatePath={pageTemplatePath}
          />,
          requestedMetric.requestedCount,
          selectedUnits == Units.PERCENTAGES
            ? addPercentageSign(requestedMetric.receivedPercentOfRequested)
            : requestedMetric.receivedCount,
          selectedUnits == Units.PERCENTAGES
            ? addPercentageSign(requestedMetric.failuresTotalPercentOfRequested)
            : requestedMetric.failuresTotalCount,
        ];
      }

      return [];
    }
  );

  const handleSortByValueChange = (value: string) => {
    setSelectedField(value);
  };

  const handleOrderValueChange = (value: string) => {
    setSelectedOrder(value);
  };

  const handleUnitsValueChange = (value: string) => {
    setSelectedUnits(value);
  };

  const handleMonthValueChange = (value: string) => {
    setSelectedMonth(parseInt(value));
  };

  const sortedColumnIndex = sortBySelect.options.findIndex(
    (option) => option.value === selectedField
  );

  return (
    <div className="nhsuk-u-margin-top-6">
      <div className="gp2gp-sort">
        <Select
          label="Month"
          hiddenLabel=" this element filters the practice performance table"
          options={monthSelect.options}
          id="monthSelect"
          defaultValue={monthSelect.defaultValue}
          handleValueChange={handleMonthValueChange}
          className="nhsuk-u-margin-right-4"
        />
        <Select
          label="Units"
          hiddenLabel={unitsContent.selectHiddenLabel}
          options={unitsContent.unitsSelect.options}
          id="unitsSelect"
          defaultValue={unitsContent.unitsSelect.defaultValue}
          handleValueChange={handleUnitsValueChange}
          className="nhsuk-u-margin-right-4"
        />
        <Select
          label="Sort by"
          hiddenLabel={practiceTableContent.selectHiddenLabel}
          options={sortBySelect.options}
          id="sortBySelect"
          defaultValue={sortBySelect.defaultValue}
          handleValueChange={handleSortByValueChange}
          className="nhsuk-u-margin-right-4"
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
        caption={{ text: tableCaptionWithMonthYear, hidden: false }}
        headers={headers}
        rows={practiceTableRows}
        sortedColumnIndex={sortedColumnIndex}
        sortOrder={selectedOrder as AriaAttributes["aria-sort"]}
      />
    </div>
  );
};
