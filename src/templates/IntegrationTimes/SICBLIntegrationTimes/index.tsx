import React, { FC } from "react";
import { Helmet } from "react-helmet";

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
import { SICBLDataType } from "../../../library/types/queryResults.types";

type PageContext = {
  sicblOdsCode: string;
  layout: string;
  dataUpdatedDate: string;
};

type SICBLProps = {
  pageContext: PageContext;
  data: SICBLDataType;
};

const SICBLIntegrationTimes: FC<SICBLProps> = ({ data, pageContext }) => {
  const sicblPractices =
    data.allFile.edges[0].node.childOrganisationsJson.practices;
  const { name, odsCode: sicblOdsCode } =
    data.allFile.edges[0].node.childOrganisationsJson.sicbls[0];

  const { dataUpdatedDate } = pageContext;
  const formattedName: string = convertToTitleCase(name);

  const pageTitle = `Integration times for registering practices`;

  const contentListItems = [
    {
      text: "Integration times",
    },
    {
      text: "GP2GP transfers requested",
      href: `/sub-ICB-location/${sicblOdsCode}/gp2gp-transfers-requested`,
    },
    {
      text: "Download data",
      href: `/sub-ICB-location/${sicblOdsCode}/download-data`,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`${formattedName} - GP Registrations Data`}</title>
        <meta
          name="description"
          content="Monthly data about GP2GP transfers for practices within this integrated care board"
        />
        <noscript>{`<style>.gp2gp-sort, .gp2gp-tabs, .gp2gp-open-modal-btn {display: none}</style>`}</noscript>
      </Helmet>
      <div className="gp2gp-page-content-wrapper">
        <h1 className="nhsuk-u-margin-bottom-5 gp2gp-page-heading">
          {formattedName ? formattedName : sicblOdsCode}
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
              sicblPractices={sicblPractices}
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
              tableCaption={pageTitle}
            />
          }
        />
      </div>
    </>
  );
};

export const query = graphql`
  query SICBLIntegrationTimesQuery($sicblOdsCode: String) {
    allFile(filter: { name: { eq: "practiceMetrics" } }) {
      edges {
        node {
          childOrganisationsJson {
            sicbls(sicblOdsCode: $sicblOdsCode) {
              ...SICBLQueryFragment
            }
            practices(sicblOdsCode: $sicblOdsCode) {
              ...PracticeIntegrationTimesFragment
            }
          }
        }
      }
    }
  }
`;

export default SICBLIntegrationTimes;
