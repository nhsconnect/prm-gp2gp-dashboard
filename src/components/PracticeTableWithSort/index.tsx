import React, { AriaAttributes, FC, useMemo, useState, ReactNode } from "react";
import { Link } from "gatsby";
import { Table } from "../common/Table";
import { Select } from "../common/Select";

import {
  PracticePercentageType,
  IntegratedMetricsTableType,
  TransfersRequestedMetricsTableType,
} from "../../library/utils/practiceMetricsTableTypes";

import { addPercentageSign } from "../../library/utils/addPercentageSign";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";

import practiceTableContent from "../../data/content/practiceIntegrationsSortOptions.json";
import "../common/Table/index.scss";

type TableWithSortProps = {
  ccgPractices: PracticePercentageType[];
  headers: { title: ReactNode; extra?: ReactNode }[];
  sortBySelect: SelectType;
  orderSelect: SelectType;
  tableCaption: string;
  pageTemplatePath: string;
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
  pageTemplatePath: string;
}) => {
  const formattedName = convertToTitleCase(name);
  return (
    <Link to={`/practice/${odsCode}/${pageTemplatePath}`}>
      {formattedName} - {odsCode}
    </Link>
  );
};

const sortPractices = (
  practices: PracticePercentageType[],
  fieldName: string,
  order: string
) => {
  const getFieldValue = (field: any) => {
    if (fieldName === "requestingPracticeName") return field.name;
    const transfersReceivedMetrics = field.metrics[0].requestedTransfers;
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
    const firstField = getFieldValue(firstEl);
    const secondField = getFieldValue(secondEl);
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
  const [selectedField, setSelectedField] = useState(sortBySelect.defaultValue);
  const [selectedOrder, setSelectedOrder] = useState(orderSelect.defaultValue);
  const sortedPractices = useMemo(() => {
    return sortPractices(ccgPractices, selectedField, selectedOrder);
  }, [ccgPractices, selectedField, selectedOrder]);

  const practiceTableRows = sortedPractices.map(
    ({ odsCode, name, metrics }: PracticePercentageType) => {
      if (pageTemplatePath == "integration-times") {
        const requestedMetric = metrics[0]
          .requestedTransfers as IntegratedMetricsTableType;
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

      if (pageTemplatePath == "transfers-requested") {
        const requestedMetric = metrics[0]
          .requestedTransfers as TransfersRequestedMetricsTableType;
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
        caption={{ text: `${tableCaption}`, hidden: false }}
        headers={headers}
        rows={practiceTableRows}
        sortedColumnIndex={sortedColumnIndex}
        sortOrder={selectedOrder as AriaAttributes["aria-sort"]}
      />
    </div>
  );
};
