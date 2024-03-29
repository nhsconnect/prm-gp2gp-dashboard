import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { OrganisationAddress } from "../../../components/OrganisationAddress";

import { graphql } from "gatsby";

import { convertToTitleCase } from "../../../library/utils/convertToTitleCase";
import { PageContent } from "../../../components/PageContent";
import { HelpModal } from "../../../components/common/HelpModal";
import { PracticeTable } from "../../../components/PracticeTable";
import { PageTemplatePath } from "../../../library/enums/pageTemplatePath";
import {
  IntegratedWithin3DaysDefinition,
  IntegratedWithin8DaysDefinition,
  IntegrationsDefinitionsContent,
  NotIntegratedWithin8DaysDefinition,
  TransfersReceivedDefinition,
  WhyIntegrateWithin8Days,
} from "../../../components/Definitions";
import "../../index.scss";
import { ContentsList } from "../../../components/common/ContentsList";
import { PracticeDataType } from "../../../library/types/queryResults.types";

type PageContext = {
  practiceOdsCode: string;
  layout?: string;
  dataUpdatedDate: string;
};

type PracticeProps = {
  pageContext: PageContext;
  data: PracticeDataType;
};

const PracticeIntegrationTimes: FC<PracticeProps> = ({ data, pageContext }) => {
  const practice =
    data.allFile.edges[0].node.childOrganisationsJson.practices[0];
  const { dataUpdatedDate } = pageContext;
  const { name, odsCode, metrics } = practice;
  const formattedName = convertToTitleCase(name);

  const contentListItems = [
    {
      text: "Integration times",
    },
    {
      text: "GP2GP transfers requested",
      href: `/practice/${odsCode}/gp2gp-transfers-requested`,
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
            <span className="nhsuk-u-visually-hidden"> integration times</span>
          </h1>
          <OrganisationAddress odsCode={odsCode} />
          <hr aria-hidden={true} />
        </div>

        <div className="gp2gp-side-nav">
          <ContentsList items={contentListItems} />
        </div>
        <PageContent
          className="gp2gp-page-contents"
          title="Integration times for registering practice"
          tableDescription={
            <p>
              The table below shows the integration times for GP2GP transfers
              received.
            </p>
          }
          expanderTitle="Why integrate within 8 days"
          expanderContent={<WhyIntegrateWithin8Days />}
          definitionsContent={<IntegrationsDefinitionsContent />}
          dataUpdatedDate={dataUpdatedDate}
          tableContent={
            <PracticeTable
              headers={[
                { title: "Month " },
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
              tableCaption={"Integration times for registering practice"}
              metrics={metrics}
              pageTemplatePath={PageTemplatePath.IntegrationTimes}
            />
          }
        />
      </div>
    </>
  );
};

export const query = graphql`
  query PracticeIntegrationsQuery($practiceOdsCode: String) {
    allFile(filter: { name: { eq: "practiceMetrics" } }) {
      edges {
        node {
          childOrganisationsJson {
            practices(practiceOdsCode: $practiceOdsCode) {
              ...PracticeIntegrationTimesFragment
            }
          }
        }
      }
    }
  }
`;

export default PracticeIntegrationTimes;
