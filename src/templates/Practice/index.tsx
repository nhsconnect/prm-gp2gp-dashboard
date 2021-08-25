import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { OrganisationDetails } from "../../components/OrganisationDetails";
import { Table } from "../../components/common/Table";

import {
  IntegratedPracticeMetricsType,
  PracticeMetricsType,
  PracticeType,
} from "./practice.types";

import {
  ODS_PORTAL_URL,
  transformPracticeAddress,
} from "../../library/api/ODSPortal";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { addPercentageSign } from "../../library/utils/addPercentageSign";
import { useApi } from "../../library/hooks/useApi";
import { useFeatureToggles } from "../../library/hooks/useFeatureToggle";

import slaMetricsContent from "../../data/content/practiceMetrics.json";
import "../../components/common/Table/index.scss";
import "./index.scss";
import { PageContent } from "../../components/PageContent";

type PageContext = {
  practice: PracticeType;
  layout: string;
};

type PracticeProps = {
  pageContext: PageContext;
};

//Delete below function when cleaning up showHistoricalData toggle
const generateRowData = (integratedMetrics: IntegratedPracticeMetricsType) => {
  return [
    [
      integratedMetrics.transferCount.toString(),
      addPercentageSign(integratedMetrics.within3DaysPercentage),
      addPercentageSign(integratedMetrics.within8DaysPercentage),
      addPercentageSign(integratedMetrics.beyond8DaysPercentage),
    ],
  ];
};

const generateMonthlyRowData = (metrics: PracticeMetricsType[]) => {
  return metrics.map((metric) => {
    const integratedMetrics = metric.requester.integrated;
    return [
      `${convertMonthNumberToText(metric.month)} ${metric.year}`,
      integratedMetrics.transferCount.toString(),
      addPercentageSign(integratedMetrics.within3DaysPercentage),
      addPercentageSign(integratedMetrics.within8DaysPercentage),
      addPercentageSign(integratedMetrics.beyond8DaysPercentage),
    ];
  });
};

const Practice: FC<PracticeProps> = ({ pageContext: { practice } }) => {
  const { isLoading, data, error } = useApi(
    `${ODS_PORTAL_URL}/${practice.odsCode}`
  );
  const { showHistoricalData } = useFeatureToggles();

  const { name, odsCode, metrics } = practice;
  const formattedName = convertToTitleCase(name);

  // Delete below when cleaning up showHistoricalData toggle
  const tableCaptionText = `Integration times for ${convertMonthNumberToText(
    metrics[0].month
  )} ${metrics[0].year}`;

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - ${odsCode} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for this practice"
        />
      </Helmet>
      {isLoading || error ? (
        <OrganisationDetails name={formattedName} odsCode={odsCode} />
      ) : (
        <OrganisationDetails
          name={formattedName}
          odsCode={odsCode}
          address={transformPracticeAddress(data.Organisation.GeoLoc.Location)}
        />
      )}
      <hr aria-hidden={true} />

      <PageContent
        title="Integration times"
        tableDescription="The table below shows the time to integrate for records received by the
        practice."
        tableContent={
          showHistoricalData ? (
            <Table
              className="gp2gp-metrics-table"
              headers={slaMetricsContent.tableHeaders}
              caption={{
                text: "Integration times for the recent months",
                hidden: true,
              }}
              rows={generateMonthlyRowData(metrics)}
            />
          ) : (
            <Table
              className="gp2gp-practice-table"
              headers={slaMetricsContent.tableHeaders.slice(1)}
              caption={{ text: tableCaptionText, hidden: false }}
              rows={generateRowData(metrics[0].requester.integrated)}
            />
          )
        }
      />
    </>
  );
};

export default Practice;
