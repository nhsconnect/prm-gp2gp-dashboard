import React, { FC, useState } from "react";
import "./index.scss";
import { Button } from "../common/Button";
import { Radio } from "../common/FormComponents/Radio";
import { downloadFile } from "../../library/utils/download/downloadFile";

type DownloadDataProps = {
  pageDescription: string;
  dataFor: string;
  className?: string;
  formatData: (timeframe: string, datatype: string) => string;
};

export const DownloadData: FC<DownloadDataProps> = ({
  pageDescription,
  dataFor,
  className = "",
  formatData,
}) => {
  const initialDatasetTypeState = "all";
  const initialTimeframeState = "last-6-months";

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
      `GP Registrations Data ${dataFor} ${selectedDatasetType}-${selectedTimeframe}.csv`,
      "text/csv"
    );
  };

  return (
    <section className={`gp2gp-page-content-section ${className}`}>
      <h2>Download data</h2>

      <div className="gp2gp-download-data" data-testid="gp2gp-download-data">
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
                value: "transfers-requested",
              },
              {
                displayValue: "Integration times",
                value: "integration-times",
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
                value: "latest-month",
              },
              {
                displayValue: "Last 6 months",
                value: "last-6-months",
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
      </div>
      <noscript>
        <p>
          Please enable javascript and refresh the page to be able to download
          this data. <br />
          Alternatively, please email{" "}
          <a href={"mailto:gp-registrations-data@nhs.net"}>
            gp-registrations-data@nhs.net
          </a>{" "}
          to receive the data.
        </p>
      </noscript>
    </section>
  );
};
