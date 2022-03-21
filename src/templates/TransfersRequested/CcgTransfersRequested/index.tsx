import React, { FC } from "react";
import { Helmet } from "react-helmet";

import {
  CcgPracticeType,
  PracticeType,
} from "../../../library/types/practice.types";
import { convertToTitleCase } from "../../../library/utils/convertToTitleCase";
import { PageTemplatePath } from "../../../library/enums/pageTemplatePath";
import { PageContent } from "../../../components/PageContent";
import { PracticeTableWithSort } from "../../../components/PracticeTableWithSort";
import { HelpModal } from "../../../components/common/HelpModal";
import { ContentsList } from "../../../components/common/ContentsList";
import {
  GP2GPTechnicalFailuresDefinition,
  RegistrationsTriggeredByGP2GPDefinition,
  TransfersReceivedPercentageDefinition,
  TransfersRequestedDefinitionsContent,
  WhatHappensWhenAGP2GPTransferFails,
} from "../../../components/Definitions";
import practiceTableContent from "../../../data/content/practiceTransfersRequestedSortOptions.json";
import "../../index.scss";

type PageContext = {
  odsCode: string;
  name: string;
  ccgPractices: PracticeType[];
  layout: string;
  dataUpdatedDate: string;
};

type CcgProps = {
  pageContext: PageContext;
};

const CcgTransfersRequested: FC<CcgProps> = ({ pageContext }) => {
  const { name, odsCode, ccgPractices, dataUpdatedDate } = pageContext;
  const formattedName: string = convertToTitleCase(name);

  const pageTitle = `GP2GP transfers requested for registering practices`;

  const ccgPracticeTableData: CcgPracticeType[] = ccgPractices.map(
    (practice) => ({
      odsCode: practice.odsCode,
      name: practice.name,
      metrics: practice.metrics,
    })
  );

  const contentListItems = [
    {
      text: "Integration times",
      href: `/ccg/${odsCode}/integration-times`,
    },
    {
      text: "GP2GP transfers requested",
    },
    {
      text: "Download data",
      href: `/ccg/${odsCode}/download-data`,
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
          <span className="nhsuk-u-visually-hidden">
            {" "}
            GP2GP transfers requested
          </span>
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
          definitionsContent={<TransfersRequestedDefinitionsContent />}
          dataUpdatedDate={dataUpdatedDate}
          tableContent={
            <PracticeTableWithSort
              ccgPractices={ccgPracticeTableData}
              headers={[
                { title: "Registering practice name " },
                {
                  title: "Registrations that triggered GP2GP transfer ",
                  extra: (
                    <HelpModal
                      ariaLabelledBy="triggered-transfers-modal-title"
                      iconHiddenDescription="Open modal with definition"
                      content={
                        <RegistrationsTriggeredByGP2GPDefinition ariaLabelId="triggered-transfers-modal-title" />
                      }
                    />
                  ),
                },
                {
                  title: "GP2GP transfers received ",
                  extra: (
                    <HelpModal
                      ariaLabelledBy="transfers-received-modal-title"
                      iconHiddenDescription="Open modal with definition"
                      content={
                        <TransfersReceivedPercentageDefinition ariaLabelId="transfers-received-modal-title" />
                      }
                    />
                  ),
                },
                {
                  title: (
                    <>
                      GP2GP technical failures{" "}
                      <div className="gp2gp-title-emphasis">
                        (paper copy requested){" "}
                      </div>
                    </>
                  ),
                  extra: (
                    <HelpModal
                      ariaLabelledBy="technical-failures-modal-title"
                      iconHiddenDescription="Open modal with definition"
                      content={
                        <GP2GPTechnicalFailuresDefinition ariaLabelId="technical-failures-modal-title" />
                      }
                    />
                  ),
                },
              ]}
              pageTemplatePath={PageTemplatePath.GP2GPTransfersRequested}
              sortBySelect={practiceTableContent.sortBySelect}
              orderSelect={practiceTableContent.orderSelect}
              tableCaption={pageTitle}
            />
          }
        />
      </div>
    </>
  );
};
export default CcgTransfersRequested;
