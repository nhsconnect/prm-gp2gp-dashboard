import React, { FC, ReactNode, useState } from "react";
import { Table } from "../common/Table";
import { Select } from "../common/Select";
import unitsContent from "../../data/content/unitsOptions.json";
import "../common/Table/index.scss";
import { PageTemplatePath } from "../../library/enums/pageTemplatePath";
import { PracticeMetricsType } from "../../library/types/practice.types";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { getTableRowFromMetrics } from "../../library/utils/getTableRowFromMetrics";
import { Units } from "../../library/enums/units";

type TableProps = {
  metrics: PracticeMetricsType[];
  headers: { title: ReactNode; extra?: ReactNode }[];
  tableCaption: string;
  pageTemplatePath: PageTemplatePath;
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

  const practiceTableRows = metrics.map((metric) => {
    return getTableRowFromMetrics(
      `${convertMonthNumberToText(metric.month)} ${metric.year}`,
      metric,
      pageTemplatePath,
      selectedUnits as Units
    );
  });

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
