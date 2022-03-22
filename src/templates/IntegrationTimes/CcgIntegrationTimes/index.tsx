import React, { FC } from "react";
import { Helmet } from "react-helmet";

import { CcgPracticeType } from "../../../library/types/practice.types";
import { convertToTitleCase } from "../../../library/utils/convertToTitleCase";
import { PageContent } from "../../../components/PageContent";
import { PracticeTableWithSort } from "../../../components/PracticeTableWithSort";
import practiceTableContent from "../../../data/content/practiceIntegrationsSortOptions.json";

import { HelpModal } from "../../../components/common/HelpModal";
import {
  IntegratedWithin3DaysDefinition,
  IntegratedWithin8DaysDefinition,
  IntegrationsDefinitionsContent,
  NotIntegratedWithin8DaysDefinition,
  TransfersReceivedDefinition,
  WhyIntegrateWithin8Days,
} from "../../../components/Definitions";
import { ContentsList } from "../../../components/common/ContentsList";
import "../../index.scss";
import { PageTemplatePath } from "../../../library/enums/pageTemplatePath";
import { graphql } from "gatsby";
import { CcgIntegrationTimesType } from "../../../library/types/queryResultIntegrationTimes.types";

type PageContext = {
  ccgOdsCode: string;
  layout: string;
  dataUpdatedDate: string;
};

type CcgProps = {
  pageContext: PageContext;
  data: CcgIntegrationTimesType;
};

const CcgIntegrationTimes: FC<CcgProps> = ({ data, pageContext }) => {
  const ccgPractices =
    data.allFile.edges[0].node.childOrganisationsJson.practices;
  const { name, odsCode: ccgOdsCode } =
    data.allFile.edges[0].node.childOrganisationsJson.ccgs[0];

  const { dataUpdatedDate } = pageContext;
  const formattedName: string = convertToTitleCase(name);

  const pageTitle = `Integration times for registering practices`;

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
    },
    {
      text: "GP2GP transfers requested",
      href: `/ccg/${ccgOdsCode}/gp2gp-transfers-requested`,
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
          <span className="nhsuk-u-visually-hidden"> integration times</span>
        </h1>
        <div className="gp2gp-side-nav">
          <ContentsList items={contentListItems} />
        </div>
        <PageContent
          className="gp2gp-page-contents"
          title={pageTitle}
          tableDescription={
            <p>
              The table below shows the integration times for GP2GP transfers
              received.
            </p>
          }
          expanderTitle="Why integrate within 8 days?"
          expanderContent={<WhyIntegrateWithin8Days />}
          definitionsContent={<IntegrationsDefinitionsContent />}
          dataUpdatedDate={dataUpdatedDate}
          tableContent={
            <PracticeTableWithSort
              ccgPractices={ccgPracticeTableData}
              headers={[
                { title: "Registering practice name " },
                {
                  title: "GP2GP transfers received ",
                  extra: (
                    <HelpModal
                      ariaLabelledBy="transfers-received-modal-title"
                      iconHiddenDescription="Open modal with definition"
                      content={
                        <TransfersReceivedDefinition ariaLabelId="transfers-received-modal-title" />
                      }
                    />
                  ),
                },
                {
                  title: "Integrated within 3 days ",
                  extra: (
                    <HelpModal
                      ariaLabelledBy="integrated-within-3-days-modal-title"
                      iconHiddenDescription="Open modal with definition"
                      content={
                        <IntegratedWithin3DaysDefinition ariaLabelId="integrated-within-3-days-modal-title" />
                      }
                    />
                  ),
                },
                {
                  title: "Integrated within 8 days ",
                  extra: (
                    <HelpModal
                      ariaLabelledBy="integrated-within-8-days-modal-title"
                      iconHiddenDescription="Open modal with definition"
                      content={
                        <IntegratedWithin8DaysDefinition ariaLabelId="integrated-within-8-days-modal-title" />
                      }
                    />
                  ),
                },
                {
                  title: (
                    <>
                      Not integrated within 8 days{" "}
                      <div className="gp2gp-title-emphasis">
                        (paper copy requested){" "}
                      </div>
                    </>
                  ),
                  extra: (
                    <HelpModal
                      ariaLabelledBy="not-integrated-within-8-days-modal-title"
                      iconHiddenDescription="Open modal with definition"
                      content={
                        <>
                          <NotIntegratedWithin8DaysDefinition ariaLabelId="not-integrated-within-8-days-modal-title" />
                          <WhyIntegrateWithin8Days title="Why integrate within 8 days?" />
                        </>
                      }
                    />
                  ),
                },
              ]}
              pageTemplatePath={PageTemplatePath.IntegrationTimes}
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
  query CcgIntegrationTimesQuery($ccgOdsCode: String) {
    allFile(filter: { name: { eq: "practiceMetrics" } }) {
      edges {
        node {
          childOrganisationsJson {
            ccgs(ccgOdsCode: $ccgOdsCode) {
              name
              odsCode
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
                  integratedWithin3DaysCount
                  integratedWithin3DaysPercentOfReceived
                  integratedWithin8DaysCount
                  integratedWithin8DaysPercentOfReceived
                  notIntegratedWithin8DaysTotal
                  notIntegratedWithin8DaysPercentOfReceived
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

export default CcgIntegrationTimes;
