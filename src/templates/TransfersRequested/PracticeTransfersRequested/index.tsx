import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { OrganisationAddress } from "../../../components/OrganisationAddress";

import { convertToTitleCase } from "../../../library/utils/convertToTitleCase";
import { ContentsList } from "../../../components/common/ContentsList";
import "../../index.scss";
import {
  GP2GPTechnicalFailuresDefinition,
  RegistrationsTriggeredByGP2GPDefinition,
  TransfersReceivedPercentageDefinition,
  TransfersRequestedDefinitionsContent,
  WhatHappensWhenAGP2GPTransferFails,
} from "../../../components/Definitions";
import { PageContent } from "../../../components/PageContent";
import { HelpModal } from "../../../components/common/HelpModal";

import { graphql } from "gatsby";
import { PracticeDataType } from "../../../library/types/queryResults.types";
import { PracticeTable } from "../../../components/PracticeTable";
import { PageTemplatePath } from "../../../library/enums/pageTemplatePath";

type PageContext = {
  practiceOdsCode: string;
  layout: string;
  dataUpdatedDate: string;
};

type PracticeProps = {
  pageContext: PageContext;
  data: PracticeDataType;
};

const PracticeTransfersRequested: FC<PracticeProps> = ({
  pageContext,
  data,
}) => {
  const { dataUpdatedDate } = pageContext;
  const practice =
    data.allFile.edges[0].node.childOrganisationsJson.practices[0];
  const { name, odsCode, metrics } = practice;
  const formattedName = convertToTitleCase(name);

  const contentListItems = [
    {
      text: "Integration times",
      href: `/practice/${odsCode}/integration-times`,
    },
    {
      text: "GP2GP transfers requested",
    },
    {
      text: "Download data",
      href: `/practice/${odsCode}/download-data`,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - ${odsCode} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for this practice"
        />
        <noscript>{`<style>.gp2gp-tabs,.gp2gp-open-modal-btn,.gp2gp-dropdown {display: none}</style>`}</noscript>
      </Helmet>
      <div className="gp2gp-page-content-wrapper">
        <div className="gp2gp-page-heading">
          <h1 className="nhsuk-u-margin-bottom-5">
            {formattedName ? `${formattedName} - ${odsCode}` : odsCode}
            <span className="nhsuk-u-visually-hidden">
              {" "}
              GP2GP transfers requested
            </span>
          </h1>
          <OrganisationAddress odsCode={odsCode} />
          <hr aria-hidden={true} />
        </div>

        <div className="gp2gp-side-nav">
          <ContentsList items={contentListItems} />
        </div>
        <PageContent
          className="gp2gp-page-contents"
          title="GP2GP transfers requested as registering practice"
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
          definitionsContent={<TransfersRequestedDefinitionsContent />}
          expanderTitle="What happens when a GP2GP transfer fails?"
          expanderContent={<WhatHappensWhenAGP2GPTransferFails />}
          dataUpdatedDate={dataUpdatedDate}
          tableContent={
            <PracticeTable
              headers={[
                { title: "Month " },
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
              tableCaption="GP2GP transfers requested as registering practice"
              metrics={metrics}
              pageTemplatePath={PageTemplatePath.GP2GPTransfersRequested}
            />
          }
        />
      </div>
    </>
  );
};

export const query = graphql`
  query PracticeTransfersRequestedQuery($practiceOdsCode: String) {
    allFile(filter: { name: { eq: "practiceMetrics" } }) {
      edges {
        node {
          childOrganisationsJson {
            practices(practiceOdsCode: $practiceOdsCode) {
              ...PracticeTransfersRequestedFragment
            }
          }
        }
      }
    }
  }
`;

export default PracticeTransfersRequested;
