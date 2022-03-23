import React, { FC } from "react";
import { Helmet } from "react-helmet";

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
import { graphql } from "gatsby";
import { CcgDataType } from "../../../library/types/queryResults.types";
import { CcgPracticeType } from "../../../library/types/practice.types";

type PageContext = {
  ccgOdsCode: string;
  layout: string;
  dataUpdatedDate: string;
};

type CcgProps = {
  pageContext: PageContext;
  data: CcgDataType;
};

const CcgTransfersRequested: FC<CcgProps> = ({ data, pageContext }) => {
  const ccgPractices =
    data.allFile.edges[0].node.childOrganisationsJson.practices;
  const { name, odsCode: ccgOdsCode } =
    data.allFile.edges[0].node.childOrganisationsJson.ccgs[0];

  const { dataUpdatedDate } = pageContext;
  const formattedName: string = convertToTitleCase(name);

  const pageTitle = `GP2GP transfers requested for registering practices`;

  const contentListItems = [
    {
      text: "Integration times",
      href: `/ccg/${ccgOdsCode}/integration-times`,
    },
    {
      text: "GP2GP transfers requested",
    },
    {
      text: "Download data",
      href: `/ccg/${ccgOdsCode}/download-data`,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - ${ccgOdsCode} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for practices within this clinical commissioning group"
        />
        <noscript>{`<style>.gp2gp-sort, .gp2gp-tabs, .gp2gp-open-modal-btn {display: none}</style>`}</noscript>
      </Helmet>
      <div className="gp2gp-page-content-wrapper">
        <h1 className="nhsuk-u-margin-bottom-5 gp2gp-page-heading">
          {formattedName ? `${formattedName} - ${ccgOdsCode}` : ccgOdsCode}
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
              ccgPractices={ccgPractices}
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

export const query = graphql`
  query CcgTransfersRequestedQuery($ccgOdsCode: String) {
    allFile(filter: { name: { eq: "practiceMetrics" } }) {
      edges {
        node {
          childOrganisationsJson {
            ccgs(ccgOdsCode: $ccgOdsCode) {
              ...CcgQueryFragment
            }
            practices(ccgOdsCode: $ccgOdsCode) {
              name
              odsCode
              metrics {
                month
                year
                requestedTransfers {
                  requestedCount
                  receivedCount
                  receivedPercentOfRequested
                  failuresTotalCount
                  failuresTotalPercentOfRequested
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default CcgTransfersRequested;
