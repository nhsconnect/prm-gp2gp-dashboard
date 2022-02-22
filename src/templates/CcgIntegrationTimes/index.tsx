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
  WhyIntegrateWithin8Days,
} from "../../components/Definitions";
import { ContentsList } from "../../components/common/ContentsList";
import "../index.scss";
import { useFeatureToggles } from "../../library/hooks/useFeatureToggle";

type PageContext = {
  odsCode: string;
  name: string;
  ccgPractices: PracticeType[];
  layout: string;
};

type CcgProps = {
  pageContext: PageContext;
};

const CcgIntegrationTimes: FC<CcgProps> = ({ pageContext }) => {
  const { name, odsCode, ccgPractices } = pageContext;
  const formattedName: string = convertToTitleCase(name);

  const { showContentsNavigation } = useFeatureToggles();

  const { year, month } = ccgPractices[0].metrics[0];
  const tableTitle = `Integration times for registering practices - ${convertMonthNumberToText(
    month
  )} ${year}`;

  const pageTitle = `Integration times for registering practices`;

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
    {
      text: "GP2GP transfers requested",
      href: `/ccg/${odsCode}/transfers-requested`,
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
      {showContentsNavigation ? (
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
              <p>
                The table below shows the integration times for GP2GP transfers
                received.
              </p>
            }
            expanderTitle="Why integrate within 8 days"
            expanderContent={<WhyIntegrateWithin8Days />}
            definitionsContent={<IntegrationsDefinitionsContent />}
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
                sortBySelect={practiceTableContent.sortBySelect}
                orderSelect={practiceTableContent.orderSelect}
                tableCaption={tableTitle}
              />
            }
          />
        </div>
      ) : (
        <>
          <h1 className="nhsuk-u-margin-bottom-5">
            {formattedName ? `${formattedName} - ${odsCode}` : odsCode}
          </h1>
          <PageContent
            title={pageTitle}
            tableDescription={
              <p>
                The table below shows the integration times for GP2GP transfers
                received.
              </p>
            }
            expanderTitle="Why integrate within 8 days"
            expanderContent={<WhyIntegrateWithin8Days />}
            definitionsContent={<IntegrationsDefinitionsContent />}
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
                sortBySelect={practiceTableContent.sortBySelect}
                orderSelect={practiceTableContent.orderSelect}
                tableCaption={tableTitle}
              />
            }
          />
        </>
      )}
    </>
  );
};
export default CcgIntegrationTimes;
