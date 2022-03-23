import React, { FC, ReactNode, useState } from "react";
import { Table } from "../common/Table";
import { Select } from "../common/Select";
import { addPercentageSign } from "../../library/utils/addPercentageSign";
import unitsContent from "../../data/content/unitsOptions.json";
import "../common/Table/index.scss";
import { PageTemplatePath } from "../../library/enums/pageTemplatePath";
import {
  IntegrationRequestedTransfersType,
  PracticeMetricsType,
  TransfersRequestedTransfersType,
} from "../../library/types/practice.types";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";

type TableProps = {
  metrics: PracticeMetricsType[];
  headers: { title: ReactNode; extra?: ReactNode }[];
  tableCaption: string;
  pageTemplatePath: PageTemplatePath;
};

export const Units = {
  PERCENTAGES: unitsContent.unitsSelect.options[0].value,
  NUMBERS: unitsContent.unitsSelect.options[1].value,
};

export const PracticeTable: FC<TableProps> = ({
  metrics,
  headers,
  tableCaption,
  pageTemplatePath,
}) => {
  const [selectedUnits, setSelectedUnits] = useState(
    unitsContent.unitsSelect.defaultValue
  );

  const handleUnitsValueChange = (value: string) => {
    setSelectedUnits(value);
  };

  const generateMonthlyRowData = (metrics: PracticeMetricsType[]) => {
    return metrics.map((metric) => {
      if (pageTemplatePath == PageTemplatePath.IntegrationTimes) {
        const requestedMetric =
          metric.requestedTransfers as IntegrationRequestedTransfersType;

        return [
          `${convertMonthNumberToText(metric.month)} ${metric.year}`,
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
        const requestedMetric =
          metric.requestedTransfers as TransfersRequestedTransfersType;

        return [
          `${convertMonthNumberToText(metric.month)} ${metric.year}`,
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
    });
  };

  const practiceTableRows = generateMonthlyRowData(metrics);

  return (
    <div className="nhsuk-u-margin-top-6">
      <div className="gp2gp-dropdown">
        <Select
          label="Units"
          hiddenLabel={unitsContent.selectHiddenLabel}
          options={unitsContent.unitsSelect.options}
          id="unitsSelect"
          defaultValue={unitsContent.unitsSelect.defaultValue}
          handleValueChange={handleUnitsValueChange}
          className="nhsuk-u-margin-right-4"
        />
      </div>
      <Table
        caption={{ text: `${tableCaption}`, hidden: false }}
        headers={headers}
        rows={practiceTableRows}
      />
    </div>
  );
};
