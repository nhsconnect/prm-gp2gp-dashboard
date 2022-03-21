import React, { AriaAttributes, FC, ReactNode, useMemo, useState } from "react";
import { Link } from "gatsby";
import { Table } from "../common/Table";
import { Select } from "../common/Select";

import { addPercentageSign } from "../../library/utils/addPercentageSign";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";

import practiceTableContent from "../../data/content/practiceIntegrationsSortOptions.json";
import "../common/Table/index.scss";
import { PageTemplatePath } from "../../library/enums/pageTemplatePath";
import { CcgPracticeType } from "../../library/types/practice.types";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { getPreviousMonths } from "../../library/utils/getPreviousMonths";

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
  month: number
) => {
  const getFieldValue = (field: any, month: number) => {
    if (fieldName === "requestingPracticeName") return field.name;
    const transfersReceivedMetrics = field.metrics[month].requestedTransfers;
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
    const firstField = getFieldValue(firstEl, month);
    const secondField = getFieldValue(secondEl, month);
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
  const [selectedMonth, setSelectedMonth] = useState(monthSelect.defaultValue);

  const { month, year } = metrics[parseInt(selectedMonth)];
  const tableCaptionWithMonthYear = `${tableCaption} - ${convertMonthNumberToText(
    month
  )} ${year}`;

  const sortedPractices = useMemo(() => {
    return sortPractices(
      ccgPractices,
      selectedField,
      selectedOrder,
      parseInt(selectedMonth)
    );
  }, [ccgPractices, selectedField, selectedOrder]);

  const practiceTableRows = sortedPractices.map(
    ({ odsCode, name, metrics }: CcgPracticeType) => {
      const requestedMetric =
        metrics[parseInt(selectedMonth)].requestedTransfers;
      if (pageTemplatePath == PageTemplatePath.IntegrationTimes) {
        return [
          <PracticeLink
            odsCode={odsCode}
            name={name}
            pageTemplatePath={pageTemplatePath}
          />,
          requestedMetric.receivedCount,
          addPercentageSign(
            requestedMetric.integratedWithin3DaysPercentOfReceived
          ),
          addPercentageSign(
            requestedMetric.integratedWithin8DaysPercentOfReceived
          ),
          addPercentageSign(
            requestedMetric.notIntegratedWithin8DaysPercentOfReceived
          ),
        ];
      }

      if (pageTemplatePath == PageTemplatePath.GP2GPTransfersRequested) {
        const requestedMetric =
          metrics[parseInt(selectedMonth)].requestedTransfers;
        return [
          <PracticeLink
            odsCode={odsCode}
            name={name}
            pageTemplatePath={pageTemplatePath}
          />,
          requestedMetric.requestedCount,
          addPercentageSign(requestedMetric.receivedPercentOfRequested),
          addPercentageSign(requestedMetric.failuresTotalPercentOfRequested),
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

  const handleMonthValueChange = (value: string) => {
    setSelectedMonth(value);
  };

  const sortedColumnIndex = sortBySelect.options.findIndex(
    (option) => option.value === selectedField
  );

  return (
    <div className="nhsuk-u-margin-top-6">
      <div className="gp2gp-sort">
        <Select
          label="Month"
          hiddenLabel={practiceTableContent.selectHiddenLabel}
          options={monthSelect.options}
          id="monthSelect"
          defaultValue={monthSelect.defaultValue}
          handleValueChange={handleMonthValueChange}
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
