import React, { FC } from "react";
import { Helmet } from "react-helmet";

import { PracticeType } from "../PracticeIntegrationTimes/practice.types";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import { PageContent } from "../../components/PageContent";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";
import { PracticeTableWithSort } from "../../components/PracticeTableWithSort";
import practiceTableContent from "../../data/content/practiceTable.json";
import { PracticePercentageType } from "../../library/utils/generateIntegrationMetricsTableData";

import { HelpModal } from "../../components/common/HelpModal";
import {
  IntegratedWithin3DaysDefinition,
  IntegratedWithin8DaysDefinition,
  IntegrationsDefinitionsContent,
  NotIntegratedWithin8DaysDefinition,
  TransfersReceivedDefinition,
  WhatHappensWhenAGP2GPTransferFails,
  WhyIntegrateWithin8Days,
} from "../../components/Definitions";
import { ContentsList } from "../../components/common/ContentsList";
import "../index.scss";

type PageContext = {
  odsCode: string;
  name: string;
  ccgPractices: PracticeType[];
  layout: string;
};

type CcgProps = {
  pageContext: PageContext;
};

const CcgTransfersRequested: FC<CcgProps> = ({ pageContext }) => {
  const { name, odsCode, ccgPractices } = pageContext;
  const formattedName: string = convertToTitleCase(name);

  const { year, month } = ccgPractices[0].metrics[0];
  const tableTitle = `GP2GP transfers requested for registering practices - ${convertMonthNumberToText(
    month
  )} ${year}`;

  const pageTitle = `GP2GP transfers requested for registering practices`;

  const ccgPracticeTableData: PracticePercentageType[] = ccgPractices.map(
    (practice) => ({
      odsCode: practice.odsCode,
      name: practice.name,
      metrics: [
        {
          year: practice.metrics[0].year,
          month: practice.metrics[0].month,
          requestedTransfers: practice.metrics[0].requestedTransfers,
        },
      ],
    })
  );

  const contentListItems = [
    {
      text: "Integration times",
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - ${odsCode} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for practices within this clinical commissioning group"
        />
        <noscript>{`<style>.gp2gp-sort, .gp2gp-tabs, .gp2gp-open-modal-btn {display: none}</style>`}</noscript>
      </Helmet>
      <div className="gp2gp-page-content-wrapper">
        <h1 className="nhsuk-u-margin-bottom-5 gp2gp-page-heading">
          {formattedName ? `${formattedName} - ${odsCode}` : odsCode}
        </h1>
        <div className="gp2gp-side-nav">
          <ContentsList items={contentListItems} />
        </div>
        <PageContent
          className="gp2gp-page-contents"
          title={pageTitle}
          tableDescription={
            <>
              <p>The table below shows the</p>
              <ul>
                <li>number of registrations that triggered a GP2GP transfer</li>
                <li>
                  percentage of GP2GP transfers that were successfully received
                </li>
                <li>
                  percentage of GP2GP transfers that failed for a technical
                  reason
                </li>
              </ul>
            </>
          }
          expanderTitle="What happens when a GP2GP transfer fails?"
          expanderContent={<WhatHappensWhenAGP2GPTransferFails />}
          definitionsContent={<IntegrationsDefinitionsContent />}
          tableContent=""
        />
      </div>
    </>
  );
};
export default CcgTransfersRequested;
