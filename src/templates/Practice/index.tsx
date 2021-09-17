import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { OrganisationDetails } from "../../components/OrganisationDetails";
import { Table } from "../../components/common/Table";

import { PracticeMetricsType, PracticeType } from "./practice.types";

import {
  ODS_PORTAL_URL,
  transformPracticeAddress,
} from "../../library/api/ODSPortal";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { addPercentageSign } from "../../library/utils/addPercentageSign";
import { useApi } from "../../library/hooks/useApi";

import slaMetricsContent from "../../data/content/practiceMetrics.json";
import { PageContent } from "../../components/PageContent";
import { generateMetricsTableData } from "../../library/utils/generateMetricsTableData";

type PageContext = {
  practice: PracticeType;
  layout: string;
};

type PracticeProps = {
  pageContext: PageContext;
};

const generateMonthlyRowData = (metrics: PracticeMetricsType[]) => {
  return metrics.map((metric) => {
    const {
      receivedCount,
      integratedWithin3DaysPercentage,
      integratedWithin8DaysPercentage,
      notIntegratedWithin8DaysPercentage,
    } = generateMetricsTableData(metric.requestedTransfers);

    return [
      `${convertMonthNumberToText(metric.month)} ${metric.year}`,
      receivedCount,
      addPercentageSign(integratedWithin3DaysPercentage),
      addPercentageSign(integratedWithin8DaysPercentage),
      addPercentageSign(notIntegratedWithin8DaysPercentage),
    ];
  });
};

const Practice: FC<PracticeProps> = ({ pageContext: { practice } }) => {
  const { isLoading, data, error } = useApi(
    `${ODS_PORTAL_URL}/${practice.odsCode}`
  );

  const { name, odsCode, metrics } = practice;
  const formattedName = convertToTitleCase(name);

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - ${odsCode} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for this practice"
        />
        <noscript>{`<style>.gp2gp-tabs, .gp2gp-no-tabs {display: none}</style>`}</noscript>
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
          <Table
            headers={slaMetricsContent.tableHeaders}
            caption={{
              text: "Integration times for the recent months",
              hidden: true,
            }}
            rows={generateMonthlyRowData(metrics)}
          />
        }
      />
    </>
  );
};

export default Practice;
