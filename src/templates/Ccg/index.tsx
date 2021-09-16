import React, { FC } from "react";
import { Helmet } from "react-helmet";

import { OrganisationDetails } from "../../components/OrganisationDetails";
import {
  MetricsTableType,
  PracticeMetricsPercentageType,
  PracticePercentageType,
  PracticeType,
  RequestedTransfersType,
} from "../Practice/practice.types";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { PageContent } from "../../components/PageContent";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { PracticeTableWithSort } from "../../components/PracticeTableWithSort";
import practiceTableContent from "../../data/content/practiceTable.json";
import ccgContent from "../../data/content/ccg.json";
import { calculatePercentage } from "../../library/utils/calculatePercentage";

type PageContext = {
  odsCode: string;
  name: string;
  ccgPractices: PracticeType[];
};

type CcgProps = {
  pageContext: PageContext;
};

const generateMetricsTableData = ({
  receivedCount,
  integratedWithin3DaysCount,
  integratedWithin8DaysCount,
  integratedBeyond8DaysCount,
  awaitingIntegrationCount,
}: RequestedTransfersType): MetricsTableType => {
  const integratedWithin3DaysPercentage = calculatePercentage(
    integratedWithin3DaysCount,
    receivedCount
  );
  const integratedWithin8DaysPercentage = calculatePercentage(
    integratedWithin8DaysCount,
    receivedCount
  );

  const integratedBeyond8DaysPercentage = calculatePercentage(
    integratedBeyond8DaysCount,
    receivedCount
  );
  const awaitingIntegrationPercentage = calculatePercentage(
    awaitingIntegrationCount,
    receivedCount
  );
  return {
    receivedCount,
    integratedWithin3DaysPercentage,
    integratedWithin8DaysPercentage,
    integratedBeyond8DaysPercentage,
    awaitingIntegrationPercentage,
  };
};

const Ccg: FC<CcgProps> = ({ pageContext }) => {
  const { name, odsCode, ccgPractices } = pageContext;
  const formattedName: string = convertToTitleCase(name);

  const { year, month } = ccgPractices[0].metrics[0];
  const tableTitle = `Integration times for ${convertMonthNumberToText(
    month
  )} ${year}`;

  const ccgPracticeTableData: PracticePercentageType[] = ccgPractices.map(
    (practice) => ({
      odsCode: practice.odsCode,
      name: practice.name,
      metrics: [
        {
          year: practice.metrics[0].year,
          month: practice.metrics[0].month,
          requestedTransfers: generateMetricsTableData(
            practice.metrics[0].requestedTransfers
          ),
        },
      ],
    })
  );

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - ${odsCode} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for practices within this clinical commissioning group"
        />
        <noscript>{`<style>.gp2gp-sort, .gp2gp-tabs, .gp2gp-no-tabs {display: none}</style>`}</noscript>
      </Helmet>
      <OrganisationDetails name={formattedName} odsCode={odsCode} />
      <PageContent
        title={tableTitle}
        tableDescription={ccgContent.tableDescription}
        tableContent={
          <PracticeTableWithSort
            ccgPractices={ccgPracticeTableData}
            headers={practiceTableContent.headers}
            sortBySelect={practiceTableContent.sortBySelect}
            orderSelect={practiceTableContent.orderSelect}
            tableCaption={tableTitle}
          />
        }
      />
    </>
  );
};
export default Ccg;
