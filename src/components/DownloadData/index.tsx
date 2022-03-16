import React, { FC, useState } from "react";
import "./index.scss";
import { Button } from "../common/Button";
import { Radios } from "../common/FormComponents/Radios";
import { downloadFile } from "../../library/utils/download/downloadFile";
import {
  DatasetTypeOptions,
  TimeframeOptions,
} from "../../library/enums/datasetTypeOptions";
import { PracticeType } from "../../library/types/practice.types";
import { getFormatData } from "../../library/utils/download/getFormatData";
import { convertUtcToReadableBstDate } from "../../library/utils/convertUtcToReadableBstDate";

type DownloadDataProps = {
  pageDescription: string;
  dataFor: string;
  className?: string;
  data: PracticeType[];
  lastEditDate: string;
};

export const DownloadData: FC<DownloadDataProps> = ({
  pageDescription,
  dataFor,
  data,
  className = "",
  lastEditDate,
}) => {
  const initialDatasetTypeState = DatasetTypeOptions.AllMetrics.valueOf();
  const initialTimeframeState = TimeframeOptions.Last6Months.valueOf();

  const [selectedDatasetType, setSelectedDatasetType] = useState(
    initialDatasetTypeState
  );
  const [selectedTimeframe, setSelectedTimeframe] = useState(
    initialTimeframeState
  );

  const lastEditDateBST = convertUtcToReadableBstDate(lastEditDate);

  const exportToCsv = () => {
    const dataToDownload = getFormatData(
      selectedTimeframe,
      selectedDatasetType,
      data
    );
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
          <Radios
            title="Which dataset would you like to download?"
            className="nhsuk-u-margin-bottom-4"
            radioId="dataset-type"
            options={[
              {
                displayValue: "Transfers requested",
                value: DatasetTypeOptions.TransfersRequested,
              },
              {
                displayValue: "Integration times",
                value: DatasetTypeOptions.IntegrationTimes,
              },
              {
                displayValue: "All",
                value: DatasetTypeOptions.AllMetrics,
              },
            ]}
            selectedValue={selectedDatasetType}
            setSelectedValue={setSelectedDatasetType}
          />
          <Radios
            title="What timeframe would you like data for?"
            className="nhsuk-u-margin-bottom-4"
            radioId="timeframe"
            options={[
              {
                displayValue: "Latest month",
                value: TimeframeOptions.LatestMonth,
              },
              {
                displayValue: "Last 6 months",
                value: TimeframeOptions.Last6Months,
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
        <p>Last edited: {lastEditDateBST}</p>
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
