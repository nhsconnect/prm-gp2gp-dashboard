import React, { FC, useState } from "react";
import "./index.scss";
import { Button } from "../common/Button";
import { Radio } from "../common/FormComponents/Radio";
import { downloadFile } from "../../library/utils/downloadFile";

type DownloadDataProps = {
  pageDescription: string;
  formatData: (timeframe: string, datatype: string) => string;
};

export const DownloadData: FC<DownloadDataProps> = ({
  pageDescription,
  formatData,
}) => {
  let initialDatasetTypeState = "all";
  let initialTimeframeState = "last6Months";

  const [selectedDatasetType, setSelectedDatasetType] = useState(
    initialDatasetTypeState
  );
  const [selectedTimeframe, setSelectedTimeframe] = useState(
    initialTimeframeState
  );

  const exportToCsv = () => {
    const dataToDownload = formatData(selectedTimeframe, selectedDatasetType);
    downloadFile(
      dataToDownload,
      `${selectedDatasetType}-${selectedTimeframe}.csv`,
      "text/csv"
    );
  };

  return (
    <section className={`gp2gp-page-content-section gp2gp-page-contents`}>
      <h2>Download data</h2>
      <div className="nhsuk-u-reading-width">
        <div className="nhsuk-body">
          <p>{pageDescription}</p>
        </div>
      </div>
      <fieldset className="gp2gp-fieldset">
        <Radio
          title="Which dataset would you like to download?"
          className="nhsuk-u-margin-bottom-4"
          radioId="dataset-type"
          options={[
            {
              displayValue: "Transfers requested",
              value: "transfersRequested",
            },
            {
              displayValue: "Integration times",
              value: "integrationTimes",
            },
            {
              displayValue: "All",
              value: "all",
            },
          ]}
          selectedValue={selectedDatasetType}
          setSelectedValue={setSelectedDatasetType}
        />
        <Radio
          title="What timeframe would you like data for?"
          className="nhsuk-u-margin-bottom-4"
          radioId="timeframe"
          options={[
            {
              displayValue: "Latest month",
              value: "latestMonth",
            },
            {
              displayValue: "Last 6 months",
              value: "last6Months",
            },
          ]}
          selectedValue={selectedTimeframe}
          setSelectedValue={setSelectedTimeframe}
        />
      </fieldset>
      <p className="nhsuk-body-s nhsuk-u-secondary-text-color nhsuk-u-margin-bottom-2">
        Data will be downloaded in CSV format
      </p>
      <Button
        className="nhsuk-u-padding-left-6 nhsuk-u-padding-right-6 nhsuk-u-margin-right-4"
        onClick={exportToCsv}
      >
        Download
      </Button>
    </section>
  );
};
