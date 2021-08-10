import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { OrganisationDetails } from "../../components/OrganisationDetails";
import { Table } from "../../components/common/Table";
import { AboutThisDataContent } from "../../components/AboutThisDataContent";
import { Expander } from "../../components/common/Expander";

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

import eightDayExpanderContent from "../../data/content/eightDayExpander.json";
import slaMetricsContent from "../../data/content/practiceMetrics.json";
import "./index.scss";

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

  const tableCaptionText = showHistoricalData
    ? "Integration times"
    : `Integration times for ${convertMonthNumberToText(metrics[0].month)} ${
        metrics[0].year
      }`;

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
      <hr />

      <div className="nhsuk-u-reading-width">
        <p className="nhsuk-body">
          The table below shows the time to integrate for records received by
          the practice. More information{" "}
          <a href={"#about-this-data"}>about this data</a>.
        </p>
      </div>
      <Expander
        title={eightDayExpanderContent.title}
        content={
          <>
            <p>{eightDayExpanderContent.firstParagraph}</p>
            <p>{eightDayExpanderContent.secondParagraph}</p>
          </>
        }
      />
      <Table
        className={
          showHistoricalData ? "gp2gp-metrics-table" : "gp2gp-practice-table"
        }
        headers={
          showHistoricalData
            ? slaMetricsContent.tableHeaders
            : slaMetricsContent.tableHeaders.slice(1)
        }
        caption={{ text: tableCaptionText, hidden: false }}
        rows={
          showHistoricalData
            ? generateMonthlyRowData(metrics)
            : generateRowData(metrics[0].requester.integrated)
        }
      />
      <AboutThisDataContent />
    </>
  );
};

export default Practice;
